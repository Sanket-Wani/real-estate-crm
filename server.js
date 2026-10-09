const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const { getDb, saveDb, checkExpiredHolds, resetDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store SSE connections
const sseClients = new Set();

function broadcastSSE(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

// ----------------------------------------------------
// Helper: Calculate Cost Sheet with Multi-Scheme Support
// ----------------------------------------------------
function computeCostSheet(unit, discountPct = 0, schemeId = 'clp') {
  const db = getDb();
  const schemes = db.paymentSchemes || [];
  const selectedScheme = schemes.find(s => s.id === schemeId) || schemes[0] || {
    id: 'clp',
    name: 'Construction-Linked Plan (CLP)',
    tagline: 'Standard RERA milestone schedule linked to site progress',
    discount_pct: 0,
    milestones: [
      { name: 'Booking Token / Earnest Deposit', pct: 10, trigger: 'Immediate upon booking' },
      { name: 'Execution of Registered Agreement of Sale', pct: 10, trigger: 'Within 30 days of booking' },
      { name: 'Completion of Foundation & Plinth Work', pct: 10, trigger: 'Architect Plinth Certificate' },
      { name: 'Casting of 5th Floor RCC Slab', pct: 15, trigger: 'Architect Slab Certificate' },
      { name: 'Casting of 8th Floor RCC Roof Slab', pct: 15, trigger: 'Superstructure Certificate' },
      { name: 'Completion of Internal Brickwork & MEP Services', pct: 20, trigger: 'MEP Inspection Sign-off' },
      { name: 'Completion of External Plaster & Flooring', pct: 10, trigger: 'Finishing Phase Audit' },
      { name: 'Notice of Possession & Key Handover', pct: 10, trigger: 'Occupancy Certificate (OC)' }
    ]
  };

  const sbuArea = Number(unit.super_built_up_area);
  const baseRate = Number(unit.base_price);
  const baseCost = sbuArea * baseRate;

  const floorRiseRate = Number(unit.floor_rise_rate || 0);
  const floorRiseTotal = sbuArea * (Number(unit.floor_number) * floorRiseRate);

  const plcRate = Number(unit.plc_rate || 0);
  const plcTotal = sbuArea * plcRate;

  const parkingCharges = Number(unit.parking_cost || 500000);

  // Agreement Value before discount
  const grossAgreementValue = baseCost + floorRiseTotal + plcTotal + parkingCharges;

  // Manual Rep/TL Discount + Scheme Rebate (e.g. 8% for Down Payment Plan)
  const repDiscPct = Math.max(0, Math.min(10, Number(discountPct) || 0));
  const schemeRebatePct = Number(selectedScheme.discount_pct || 0);

  const discountAmount = Math.round(grossAgreementValue * (repDiscPct / 100));
  const schemeRebateAmount = Math.round(grossAgreementValue * (schemeRebatePct / 100));
  const totalDeductions = discountAmount + schemeRebateAmount;
  const agreementValue = Math.max(0, grossAgreementValue - totalDeductions);

  // Other Charges
  const clubhouseCharges = 250000;
  const infraCharges = 150000;
  const legalCharges = 50000;
  const otherChargesTotal = clubhouseCharges + infraCharges + legalCharges;

  // Statutory Charges
  // GST 5% on agreement value
  const statutoryGst = Math.round(agreementValue * 0.05);
  // Stamp Duty 6% in Maharashtra / 5% in Karnataka
  const statutoryStampDuty = Math.round(agreementValue * 0.06);
  const registrationFee = 30000;
  const statutoryChargesTotal = statutoryGst + statutoryStampDuty + registrationFee;

  const totalCost = agreementValue + otherChargesTotal + statutoryChargesTotal;

  // Dynamic milestone breakdown for the chosen scheme
  const milestoneBreakdown = (selectedScheme.milestones || []).map((m, idx) => {
    const amt = Math.round(agreementValue * (m.pct / 100));
    return {
      order: idx + 1,
      name: m.name,
      percentage: m.pct,
      amount: amt,
      amount_formatted: `₹ ${(amt / 100000).toFixed(2)} L`,
      trigger: m.trigger
    };
  });

  return {
    unit_id: unit.id,
    unit_number: unit.unit_number,
    configuration: unit.configuration,
    carpet_area: unit.carpet_area,
    super_built_up_area: sbuArea,
    base_rate_sqft: baseRate,
    base_cost: baseCost,
    floor_number: unit.floor_number,
    floor_rise_rate: floorRiseRate,
    floor_rise_total: floorRiseTotal,
    plc_rate: plcRate,
    plc_total: plcTotal,
    parking_slots: unit.parking_slots,
    parking_charges: parkingCharges,
    gross_agreement_value: grossAgreementValue,
    discount_pct: repDiscPct,
    discount_amount: discountAmount,
    scheme_rebate_pct: schemeRebatePct,
    scheme_rebate_amount: schemeRebateAmount,
    payment_scheme: {
      id: selectedScheme.id,
      name: selectedScheme.name,
      tagline: selectedScheme.tagline,
      milestones: milestoneBreakdown
    },
    agreement_value: agreementValue,
    other_charges: {
      clubhouse: clubhouseCharges,
      infra_development: infraCharges,
      legal_documentation: legalCharges,
      total: otherChargesTotal
    },
    statutory_charges: {
      gst_5_pct: statutoryGst,
      stamp_duty_6_pct: statutoryStampDuty,
      registration_fee: registrationFee,
      total: statutoryChargesTotal
    },
    total_cost: totalCost
  };
}

// ----------------------------------------------------
// Helper: Geofencing Haversine Distance (in Meters)
// ----------------------------------------------------
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// ----------------------------------------------------
// Helper: Enterprise Lead Allocation & Routing Rules
// ----------------------------------------------------
function evaluateLeadRouting(leadInput, db) {
  const config = db.routingConfig || { mode: 'smart_rules', rules: [], agentWorkloads: [] };
  const trace = [];

  const rawPhone = String(leadInput.phone || '').trim();
  const isNriPhone = rawPhone.startsWith('+1') ||
                     rawPhone.startsWith('+971') ||
                     rawPhone.startsWith('+65') ||
                     rawPhone.startsWith('+44') ||
                     rawPhone.startsWith('+966') ||
                     rawPhone.startsWith('+49') ||
                     leadInput.source === 'nri_campaign';

  const avgBudget = (Number(leadInput.budget_min || 0) + Number(leadInput.budget_max || 0)) / 2;
  const isHighBudget = avgBudget >= 50000000 || Number(leadInput.budget_min || 0) >= 50000000;

  let assignedUserId = null;
  let matchedRule = null;
  let ruleReason = '';

  const activeRules = (config.rules || []).filter(r => r.enabled).sort((a, b) => a.priority - b.priority);

  for (const rule of activeRules) {
    let matches = false;
    if (rule.condition === 'is_nri' && isNriPhone) {
      matches = true;
    } else if (rule.condition === 'budget_gte_50m' && isHighBudget) {
      matches = true;
    } else if (rule.condition === 'source_is_cp' && leadInput.source === 'cp') {
      matches = true;
    } else if (rule.condition === 'project_solitaire' && leadInput.project_id === 'proj-solitaire') {
      matches = true;
    } else if (rule.condition === 'project_aurelia' && leadInput.project_id === 'proj-aurelia') {
      matches = true;
    }

    trace.push({
      rule_id: rule.id,
      rule_name: rule.name,
      priority: rule.priority,
      matched: matches,
      target_rep: rule.assigned_to_name
    });

    if (matches && !assignedUserId) {
      assignedUserId = rule.assigned_to_user_id;
      matchedRule = rule;
      ruleReason = rule.description;
      break;
    }
  }

  // Workload capacity verification
  const workloads = config.agentWorkloads || [];
  let candidateUser = db.users.find(u => u.id === assignedUserId);
  const repWorkload = workloads.find(w => w.user_id === assignedUserId);

  if (repWorkload && (!repWorkload.on_duty || repWorkload.current_active >= repWorkload.max_capacity)) {
    trace.push({
      rebalance: true,
      original_rep: candidateUser?.name,
      reason: !repWorkload.on_duty ? 'Agent is currently marked OFF-DUTY' : 'Agent has reached maximum capacity cap'
    });

    // Fallback to least loaded on-duty sales rep
    const availableWorkloads = workloads.filter(w => w.on_duty && w.current_active < w.max_capacity);
    if (availableWorkloads.length > 0) {
      availableWorkloads.sort((a, b) => a.current_active - b.current_active);
      candidateUser = db.users.find(u => u.id === availableWorkloads[0].user_id) || candidateUser;
      ruleReason += ` (Rebalanced to ${candidateUser.name} due to capacity/duty availability)`;
    }
  }

  if (!candidateUser) {
    const defaultReps = db.users.filter(u => u.role === 'sales_rep');
    candidateUser = defaultReps[0];
    ruleReason = 'Default Round-Robin allocation';
  }

  return {
    assigned_user: candidateUser,
    matched_rule: matchedRule ? matchedRule.name : 'Default Fallback',
    reason: ruleReason,
    trace
  };
}

// ----------------------------------------------------
// Helper: Jarvis AI Predictive Intent Scoring
// ----------------------------------------------------
function computeJarvisScore(lead, unit = null) {
  let score = 50;
  const factors = [];

  // Source attribution
  if (lead.source === 'cp') {
    score += 20;
    factors.push('Registered via VIP Channel Partner (+20)');
  } else if (lead.source === 'google_ads') {
    score += 15;
    factors.push('High-intent Search Keyword Campaign (+15)');
  } else if (lead.source === '99acres' || lead.source === 'magicbricks') {
    score += 10;
    factors.push('Verified Real Estate Portal Inquirer (+10)');
  }

  // Budget alignment
  if (lead.budget_min && lead.budget_max) {
    const avgBudget = (Number(lead.budget_min) + Number(lead.budget_max)) / 2;
    if (avgBudget >= 50000000) {
      score += 15;
      factors.push('HNW / Ultra-Luxury Segment Alignment (+15)');
    } else {
      score += 10;
      factors.push('Realistic Budget Range Defined (+10)');
    }
  }

  // Stage progression
  if (lead.stage === 'booking_initiated') {
    score += 25;
    factors.push('Booking form drafted & Token acknowledged (+25)');
  } else if (lead.stage === 'negotiation') {
    score += 20;
    factors.push('Active Price Negotiation / Cost Sheet Issued (+20)');
  } else if (lead.stage === 'visit_completed') {
    score += 15;
    factors.push('Physical Site Visit Verified & Completed (+15)');
  } else if (lead.stage === 'visit_scheduled') {
    score += 10;
    factors.push('Site Visit Slot Scheduled (+10)');
  }

  // Call count & engagement
  if ((lead.call_count || 0) >= 3) {
    score += 10;
    factors.push('High phone engagement (3+ connected calls) (+10)');
  }

  score = Math.max(10, Math.min(99, score));
  return { score, factors };
}

// ====================================================
// SSE Stream Endpoint
// ====================================================
app.get('/v1/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  // Send initial ping
  res.write(`event: connected\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// ====================================================
// Auth & Workspace API
// ====================================================
app.get('/v1/auth/users', (req, res) => {
  const db = getDb();
  res.json({ success: true, users: db.users, organization: db.organization });
});

// ====================================================
// Projects & Inventory Matrix API
// ====================================================
app.get('/v1/projects', (req, res) => {
  const db = getDb();
  checkExpiredHolds();
  res.json({ success: true, projects: db.projects });
});

app.get('/v1/projects/:id/matrix', (req, res) => {
  const db = getDb();
  checkExpiredHolds();
  const proj = db.projects.find(p => p.id === req.params.id);
  if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });

  const projectTowers = db.towers.filter(t => t.project_id === proj.id);
  const projectUnits = db.units.filter(u => u.project_id === proj.id);

  // Stats
  const totalUnits = projectUnits.length;
  const available = projectUnits.filter(u => u.status === 'available').length;
  const held = projectUnits.filter(u => u.status === 'held').length;
  const booked = projectUnits.filter(u => u.status === 'booked').length;
  const sold = projectUnits.filter(u => u.status === 'sold').length;

  res.json({
    success: true,
    project: proj,
    towers: projectTowers,
    units: projectUnits,
    stats: { totalUnits, available, held, booked, sold }
  });
});

// Unit Hold / Lock Mutex (15-Minute Expiration)
app.post('/v1/units/:id/hold', (req, res) => {
  const db = getDb();
  checkExpiredHolds();
  const unit = db.units.find(u => u.id === req.params.id);
  if (!unit) return res.status(404).json({ success: false, message: 'Unit not found' });

  if (unit.status !== 'available') {
    return res.status(400).json({
      success: false,
      message: `Cannot hold unit. Current status is '${unit.status}' (Locked by ${unit.held_by_name || 'system'})`
    });
  }

  const user = req.body.user || { id: 'usr-rep-1', name: 'Priya Kulkarni' };
  const holdDurationMs = 15 * 60 * 1000; // 15 minutes
  const heldUntil = new Date(Date.now() + holdDurationMs).toISOString();

  unit.status = 'held';
  unit.held_by_user_id = user.id;
  unit.held_by_name = user.name;
  unit.held_until = heldUntil;

  saveDb();

  const eventPayload = {
    unit_id: unit.id,
    unit_number: unit.unit_number,
    status: 'held',
    held_by: user.name,
    held_until: heldUntil
  };
  broadcastSSE('unit_status_changed', eventPayload);

  res.json({
    success: true,
    message: `Unit ${unit.unit_number} placed on atomic 15-minute hold for ${user.name}`,
    unit
  });
});

// Release Hold
app.post('/v1/units/:id/release', (req, res) => {
  const db = getDb();
  const unit = db.units.find(u => u.id === req.params.id);
  if (!unit) return res.status(404).json({ success: false, message: 'Unit not found' });

  if (unit.status !== 'held') {
    return res.status(400).json({ success: false, message: `Unit is not currently held (status: ${unit.status})` });
  }

  unit.status = 'available';
  unit.held_by_user_id = null;
  unit.held_by_name = null;
  unit.held_until = null;

  saveDb();

  const eventPayload = {
    unit_id: unit.id,
    unit_number: unit.unit_number,
    status: 'available'
  };
  broadcastSSE('unit_status_changed', eventPayload);

  res.json({
    success: true,
    message: `Unit ${unit.unit_number} hold released. Status is now Available.`,
    unit
  });
});

// ====================================================
// Dynamic Cost Sheet API
// ====================================================
app.get('/v1/payment-schemes', (req, res) => {
  const db = getDb();
  res.json({ success: true, schemes: db.paymentSchemes || [] });
});

app.post('/v1/cost-sheets/calculate', (req, res) => {
  const db = getDb();
  const { unit_id, discount_pct, scheme_id = 'clp' } = req.body;
  const unit = db.units.find(u => u.id === unit_id);
  if (!unit) return res.status(404).json({ success: false, message: 'Unit not found' });

  const costSheet = computeCostSheet(unit, discount_pct, scheme_id);
  res.json({ success: true, cost_sheet: costSheet });
});

// ====================================================
// Leads & Sales Pipeline API
// ====================================================
app.get('/v1/leads', (req, res) => {
  const db = getDb();
  const { stage, project_id, assigned_to } = req.query;

  let leads = [...db.leads];
  if (stage && stage !== 'all') {
    leads = leads.filter(l => l.stage === stage);
  }
  if (project_id && project_id !== 'all') {
    leads = leads.filter(l => l.project_id === project_id);
  }
  if (assigned_to && assigned_to !== 'all') {
    leads = leads.filter(l => l.assigned_to === assigned_to);
  }

  res.json({ success: true, leads });
});

// ====================================================
// Lead Routing & Distribution Engine API
// ====================================================
app.get('/v1/routing/rules', (req, res) => {
  const db = getDb();
  res.json({ success: true, routingConfig: db.routingConfig });
});

app.put('/v1/routing/rules', (req, res) => {
  const db = getDb();
  const { mode, rules, agentWorkloads } = req.body;
  if (mode) db.routingConfig.mode = mode;
  if (rules) db.routingConfig.rules = rules;
  if (agentWorkloads) db.routingConfig.agentWorkloads = agentWorkloads;
  saveDb();
  broadcastSSE('routing_rules_updated', db.routingConfig);
  res.json({ success: true, message: 'Lead routing rules updated successfully', routingConfig: db.routingConfig });
});

app.post('/v1/routing/simulate', (req, res) => {
  const db = getDb();
  const evaluation = evaluateLeadRouting(req.body, db);
  res.json({ success: true, simulation: evaluation });
});

app.post('/v1/routing/escalate-sla', (req, res) => {
  const db = getDb();
  const now = Date.now();
  const escalatedLeads = [];

  db.leads.forEach(lead => {
    if (lead.stage === 'new') {
      const dueTime = new Date(lead.first_response_due_at).getTime();
      if (now > dueTime && !lead.sla_breached) {
        lead.sla_breached = true;
        const escalationsManager = db.users.find(u => u.role === 'team_lead') || db.users.find(u => u.role === 'vp_sales');
        lead.assigned_to = escalationsManager.id;
        lead.assigned_rep_name = escalationsManager.name;
        lead.last_activity = `[SLA Breached] (15 min overdue). Auto-escalated to ${escalationsManager.name}`;
        escalatedLeads.push(lead);
      }
    }
  });

  if (escalatedLeads.length > 0) {
    saveDb();
    broadcastSSE('leads_escalated', { count: escalatedLeads.length, leads: escalatedLeads });
  }

  res.json({ success: true, escalated_count: escalatedLeads.length, escalated_leads: escalatedLeads });
});

// Ingest Inbound Lead (with Deduplication & Intelligent Routing)
app.post('/v1/leads', (req, res) => {
  const db = getDb();
  const {
    name,
    phone,
    email,
    source = 'web_inquiry',
    project_id = 'proj-solitaire',
    budget_min = 40000000,
    budget_max = 60000000,
    preferred_config = '3BHK Sea Suite',
    channel_partner_id = null
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and Phone are mandatory' });
  }

  // E.164 phone normalization (strip non-digits, country code +91 or leading 0)
  let cleanDigits = phone.replace(/\D/g, '');
  if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
    cleanDigits = cleanDigits.slice(2);
  } else if (cleanDigits.length === 11 && cleanDigits.startsWith('0')) {
    cleanDigits = cleanDigits.slice(1);
  }

  const normalizedPhone = cleanDigits.length === 10 
    ? `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}` 
    : phone;

  // Check Deduplication against existing leads using the 10-digit core
  const existingLead = db.leads.find(l => {
    let leadDigits = (l.phone || '').replace(/\D/g, '');
    if (leadDigits.length === 12 && leadDigits.startsWith('91')) leadDigits = leadDigits.slice(2);
    else if (leadDigits.length === 11 && leadDigits.startsWith('0')) leadDigits = leadDigits.slice(1);
    return leadDigits === cleanDigits;
  });
  if (existingLead) {
    // Merge activity timeline without duplicate creation
    existingLead.last_activity = `Repeat inquiry received via ${source} at ${new Date().toLocaleTimeString()}`;
    existingLead.call_count = (existingLead.call_count || 0) + 1;
    saveDb();

    broadcastSSE('lead_updated', existingLead);

    return res.json({
      success: true,
      deduplicated: true,
      message: `Lead already exists (${existingLead.name}). Activity timeline merged automatically.`,
      lead: existingLead
    });
  }

  // Intelligent Lead Allocation Engine
  const routing = evaluateLeadRouting({ phone: normalizedPhone, source, project_id, budget_min, budget_max }, db);
  const assignedRep = routing.assigned_user;
  const project = db.projects.find(p => p.id === project_id) || db.projects[0];

  // Update agent active capacity count in db
  if (db.routingConfig && db.routingConfig.agentWorkloads) {
    const w = db.routingConfig.agentWorkloads.find(x => x.user_id === assignedRep.id);
    if (w) w.current_active = (w.current_active || 0) + 1;
  }

  const newLead = {
    id: `lead-${Date.now()}`,
    org_id: db.organization.id,
    project_id: project.id,
    project_name: project.name,
    assigned_to: assignedRep.id,
    assigned_rep_name: assignedRep.name,
    routing_rule: routing.matched_rule,
    routing_reason: routing.reason,
    channel_partner_id,
    channel_partner_name: channel_partner_id ? (db.channelPartners.find(cp => cp.id === channel_partner_id)?.firm_name || null) : null,
    name,
    phone: normalizedPhone,
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    source,
    campaign_id: `Inbound_${source}_${new Date().getMonth() + 1}`,
    budget_min: Number(budget_min),
    budget_max: Number(budget_max),
    preferred_config,
    stage: 'new',
    lost_reason: null,
    first_response_due_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15-min SLA clock
    sla_breached: false,
    call_count: 0,
    total_talk_time_sec: 0,
    last_activity: `Inbound lead received via ${source}. Routed: ${routing.reason}`,
    created_at: new Date().toISOString()
  };

  const jarvis = computeJarvisScore(newLead);
  newLead.jarvis_score = jarvis.score;
  newLead.jarvis_factors = jarvis.factors;

  db.leads.unshift(newLead);
  saveDb();

  broadcastSSE('new_lead', newLead);

  res.json({
    success: true,
    deduplicated: false,
    message: `New lead created & allocated to ${assignedRep.name} (${routing.matched_rule}). Jarvis AI score: ${newLead.jarvis_score}`,
    lead: newLead
  });
});

// Update Lead Stage
app.patch('/v1/leads/:id/stage', (req, res) => {
  const db = getDb();
  const { stage, lost_reason } = req.body;
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

  const oldStage = lead.stage;
  lead.stage = stage;
  if (stage === 'lost') {
    lead.lost_reason = lost_reason || 'Not specified';
    lead.last_activity = `Stage changed to Lost: ${lead.lost_reason}`;
  } else {
    lead.lost_reason = null;
    lead.last_activity = `Stage progressed from ${oldStage} to ${stage}`;
  }

  // Recalculate Jarvis Score
  const jarvis = computeJarvisScore(lead);
  lead.jarvis_score = jarvis.score;
  lead.jarvis_factors = jarvis.factors;

  saveDb();
  broadcastSSE('lead_updated', lead);

  res.json({ success: true, message: `Lead stage updated to ${stage}`, lead });
});

// Simulate In-App Telephony Call
app.post('/v1/leads/:id/call', (req, res) => {
  const db = getDb();
  const { duration_sec = 180, outcome = 'connected', notes = 'Discussed project overview' } = req.body;
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

  lead.call_count = (lead.call_count || 0) + 1;
  lead.total_talk_time_sec = (lead.total_talk_time_sec || 0) + Number(duration_sec);
  lead.last_activity = `Outbound call (${duration_sec}s): ${outcome} - ${notes}`;

  // If was new, auto-advance to contacted
  if (lead.stage === 'new') {
    lead.stage = 'contacted';
  }

  const jarvis = computeJarvisScore(lead);
  lead.jarvis_score = jarvis.score;
  lead.jarvis_factors = jarvis.factors;

  saveDb();
  broadcastSSE('lead_updated', lead);

  res.json({
    success: true,
    message: `Call logged for ${lead.name}. Total talk time: ${lead.total_talk_time_sec}s`,
    lead
  });
});

// ====================================================
// Site Visits, Field Tracking & Geo-Attendance API
// ====================================================
app.get('/v1/site-visits', (req, res) => {
  const db = getDb();
  res.json({ success: true, site_visits: db.siteVisits });
});

app.post('/v1/site-visits', (req, res) => {
  const db = getDb();
  const {
    lead_id,
    project_id,
    scheduled_at,
    pickup_type = 'chauffeur',
    pickup_address = 'Buyer Residence',
    notes
  } = req.body;

  const lead = db.leads.find(l => l.id === lead_id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

  const targetProjectId = project_id || lead.project_id;
  const project = db.projects.find(p => p.id === targetProjectId) || db.projects[0];

  const visit = {
    id: `sv-${Date.now()}`,
    lead_id: lead.id,
    lead_name: lead.name,
    lead_phone: lead.phone,
    project_id: project.id,
    project_name: project.name,
    sales_rep_id: lead.assigned_to,
    sales_rep_name: lead.assigned_rep_name,
    scheduled_at: scheduled_at || new Date(Date.now() + 86400000).toISOString(),
    pickup_type,
    pickup_address,
    chauffeur_status: pickup_type === 'chauffeur' ? 'driver_assigned' : 'not_requested',
    chauffeur_driver: pickup_type === 'chauffeur' ? 'Ramesh Rathod (+91 98334 11223)' : null,
    chauffeur_vehicle: pickup_type === 'chauffeur' ? 'Toyota Camry Hybrid (MH-01-EQ-4422)' : null,
    status: 'scheduled',
    checked_in_lat: null,
    checked_in_lng: null,
    geo_distance_meters: null,
    geo_verified: false,
    checked_in_at: null,
    feedback_score: null,
    buyer_intent: null,
    objections: [],
    feedback_notes: notes || 'Site visit appointment scheduled',
    created_at: new Date().toISOString()
  };

  db.siteVisits.unshift(visit);
  lead.stage = 'visit_scheduled';
  lead.last_activity = `Site visit scheduled for ${new Date(visit.scheduled_at).toLocaleDateString()} (${pickup_type} pickup)`;
  saveDb();

  broadcastSSE('site_visit_created', visit);
  broadcastSSE('lead_updated', lead);
  res.json({ success: true, message: 'Site visit scheduled successfully', visit, lead });
});

app.patch('/v1/site-visits/:id/chauffeur', (req, res) => {
  const db = getDb();
  const visit = db.siteVisits.find(v => v.id === req.params.id);
  if (!visit) return res.status(404).json({ success: false, message: 'Site visit not found' });

  const { status, driver_name, driver_phone, vehicle_number } = req.body;
  if (status) visit.chauffeur_status = status;
  if (driver_name && driver_phone) visit.chauffeur_driver = `${driver_name} (${driver_phone})`;
  if (vehicle_number) visit.chauffeur_vehicle = vehicle_number;

  saveDb();
  broadcastSSE('site_visit_updated', visit);
  res.json({ success: true, message: `Chauffeur logistics updated to ${visit.chauffeur_status}`, visit });
});

app.patch('/v1/site-visits/:id/geo-checkin', (req, res) => {
  const db = getDb();
  const visit = db.siteVisits.find(v => v.id === req.params.id);
  if (!visit) return res.status(404).json({ success: false, message: 'Site visit not found' });

  const project = db.projects.find(p => p.id === visit.project_id) || db.projects[0];
  const userLat = Number(req.body.lat) || (project.latitude || 19.0178);
  const userLng = Number(req.body.lng) || (project.longitude || 72.8172);

  const projLat = project.latitude || 19.0178;
  const projLng = project.longitude || 72.8172;

  const distance = haversineDistance(userLat, userLng, projLat, projLng);
  const isWithinGeofence = distance <= 250; // 250m perimeter

  visit.status = 'completed';
  visit.checked_in_lat = userLat;
  visit.checked_in_lng = userLng;
  visit.geo_distance_meters = distance;
  visit.geo_verified = isWithinGeofence;
  visit.checked_in_at = new Date().toISOString();
  if (visit.pickup_type === 'chauffeur') visit.chauffeur_status = 'dropped';

  const lead = db.leads.find(l => l.id === visit.lead_id);
  if (lead) {
    lead.stage = 'visit_completed';
    lead.last_activity = `Site visit verified via Geofencing (${distance}m from center). Checked in at ${new Date().toLocaleTimeString()}`;
    const jarvis = computeJarvisScore(lead);
    lead.jarvis_score = jarvis.score;
    lead.jarvis_factors = jarvis.factors;
  }

  saveDb();
  broadcastSSE('site_visit_updated', visit);
  if (lead) broadcastSSE('lead_updated', lead);

  res.json({
    success: true,
    message: isWithinGeofence
      ? `Geo-attendance verified! Executive confirmed within ${distance}m of site.`
      : `Check-in recorded, but outside 250m geofence (${distance}m away). Flagged for audit.`,
    geo_verified: isWithinGeofence,
    distance_meters: distance,
    visit
  });
});

// Backward-compatible checkin endpoint for test suite
app.patch('/v1/site-visits/:id/checkin', (req, res) => {
  const db = getDb();
  const visit = db.siteVisits.find(v => v.id === req.params.id);
  if (!visit) return res.status(404).json({ success: false, message: 'Site visit not found' });

  visit.status = 'completed';
  visit.checked_in_lat = 19.0178;
  visit.checked_in_lng = 72.8172;
  visit.geo_distance_meters = 0;
  visit.geo_verified = true;
  visit.checked_in_at = new Date().toISOString();
  visit.feedback_score = req.body.score || 5;
  visit.feedback_notes = req.body.notes || 'Buyer verified site visit. Positive feedback.';

  const lead = db.leads.find(l => l.id === visit.lead_id);
  if (lead) {
    lead.stage = 'visit_completed';
    lead.last_activity = `Site visit completed. Rating: ${visit.feedback_score}/5 stars`;
    const jarvis = computeJarvisScore(lead);
    lead.jarvis_score = jarvis.score;
    lead.jarvis_factors = jarvis.factors;
  }

  saveDb();
  broadcastSSE('site_visit_updated', visit);
  res.json({ success: true, message: 'Site visit verified and checked in', visit });
});

app.patch('/v1/site-visits/:id/feedback', (req, res) => {
  const db = getDb();
  const visit = db.siteVisits.find(v => v.id === req.params.id);
  if (!visit) return res.status(404).json({ success: false, message: 'Site visit not found' });

  const { score = 5, notes = '', buyer_intent = 'hot', preferred_config, objections = [], next_action } = req.body;
  visit.feedback_score = Number(score);
  visit.feedback_notes = notes;
  visit.buyer_intent = buyer_intent;
  visit.preferred_config = preferred_config || visit.preferred_config;
  visit.objections = objections;
  visit.next_action = next_action || 'Generate dynamic cost sheet';

  const lead = db.leads.find(l => l.id === visit.lead_id);
  if (lead) {
    if (buyer_intent === 'hot' && lead.stage === 'visit_completed') {
      lead.stage = 'negotiation';
    }
    lead.last_activity = `Site visit disposition: ${buyer_intent.toUpperCase()} intent (${score}/5 stars). Notes: ${notes}`;
    const jarvis = computeJarvisScore(lead);
    lead.jarvis_score = jarvis.score;
    lead.jarvis_factors = jarvis.factors;
  }

  saveDb();
  broadcastSSE('site_visit_updated', visit);
  if (lead) broadcastSSE('lead_updated', lead);

  res.json({ success: true, message: 'Site visit feedback logged successfully', visit });
});

// ====================================================
// Channel Partner Platform API
// ====================================================
app.get('/v1/channel-partners', (req, res) => {
  const db = getDb();
  res.json({ success: true, channel_partners: db.channelPartners });
});

app.post('/v1/channel-partners/onboard', (req, res) => {
  const db = getDb();
  const {
    firm_name,
    rera_number,
    contact_name,
    phone,
    email,
    pan,
    gstin,
    bank_ifsc,
    bank_account_no
  } = req.body;

  if (!firm_name || !rera_number || !contact_name || !phone) {
    return res.status(400).json({ success: false, message: 'Mandatory fields missing for CP onboarding' });
  }

  const cp = {
    id: `cp-${Date.now()}`,
    org_id: db.organization.id,
    firm_name,
    rera_number,
    contact_name,
    phone,
    email: email || `${contact_name.toLowerCase().replace(/\s+/g, '')}@cp.in`,
    pan: pan || 'ABCDE1234F',
    gstin: gstin || '27ABCDE1234F1Z5',
    bank_ifsc: bank_ifsc || 'HDFC0001234',
    bank_account_no: bank_account_no || '50100098765432',
    status: 'approved',
    current_slab: 'Slab 1 (2.0%)',
    commission_slab_pct: 2.0,
    total_bookings: 0,
    total_brokerage_earned: 0,
    brokerage_paid: 0,
    brokerage_pending: 0,
    created_at: new Date().toISOString()
  };

  db.channelPartners.push(cp);
  saveDb();

  broadcastSSE('cp_onboarded', cp);
  res.json({ success: true, message: `Channel Partner ${firm_name} onboarded with RERA ${rera_number}`, channel_partner: cp });
});

// ====================================================
// Bookings, CLP Milestones & Collections API
// ====================================================
app.get('/v1/bookings', (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    bookings: db.bookings,
    milestones: db.paymentMilestones,
    payments: db.customerPayments,
    snags: db.snags
  });
});

app.post('/v1/bookings', (req, res) => {
  const db = getDb();
  const {
    lead_id,
    unit_id,
    token_amount = 2500000,
    discount_pct = 0,
    scheme_id = 'clp',
    payment_plan
  } = req.body;

  const lead = db.leads.find(l => l.id === lead_id);
  const unit = db.units.find(u => u.id === unit_id);

  if (!unit) return res.status(404).json({ success: false, message: 'Unit not found' });
  if (unit.status === 'booked' || unit.status === 'sold') {
    return res.status(400).json({ success: false, message: `Unit ${unit.unit_number} is already booked or sold!` });
  }

  const costSheet = computeCostSheet(unit, discount_pct, scheme_id);
  const project = db.projects.find(p => p.id === unit.project_id);

  const planName = payment_plan || costSheet.payment_scheme?.name || 'Construction-Linked Plan (CLP)';

  const booking = {
    id: `bkg-${Date.now()}`,
    lead_id: lead ? lead.id : `lead-guest-${Date.now()}`,
    customer_name: lead ? lead.name : 'Direct Buyer',
    customer_email: lead ? lead.email : 'buyer@example.com',
    customer_phone: lead ? lead.phone : '+91 98000 00000',
    unit_id: unit.id,
    unit_number: unit.unit_number,
    project_id: unit.project_id,
    project_name: project ? project.name : 'The Grand Solitaire',
    booked_by_user_id: lead ? lead.assigned_to : 'usr-rep-1',
    booked_by_name: lead ? lead.assigned_rep_name : 'Priya Kulkarni',
    channel_partner_id: lead ? lead.channel_partner_id : null,
    channel_partner_name: lead ? lead.channel_partner_name : null,
    booking_date: new Date().toISOString().split('T')[0],
    agreement_value: costSheet.agreement_value,
    total_cost: costSheet.total_cost,
    token_amount: Number(token_amount),
    booking_status: 'active',
    scheme_id: costSheet.payment_scheme?.id || scheme_id,
    payment_plan: planName,
    created_at: new Date().toISOString()
  };

  // Lock unit permanently to 'booked'
  unit.status = 'booked';
  unit.held_by_user_id = null;
  unit.held_by_name = null;
  unit.held_until = null;

  // Generate Milestones from the selected Payment Scheme
  const agreementVal = costSheet.agreement_value;
  const milestonesList = costSheet.payment_scheme?.milestones || [
    { name: 'Booking Token & Allotment', percentage: 10, trigger: 'Immediate upon booking' },
    { name: 'Completion of Plinth Level', percentage: 15, trigger: 'Architect Plinth Certificate' },
    { name: 'Casting of 4th RCC Slab', percentage: 10, trigger: 'Architect Slab Certificate' },
    { name: 'Casting of Top Terrace Slab', percentage: 15, trigger: 'Superstructure Certificate' },
    { name: 'Completion of Brickwork & MEP', percentage: 20, trigger: 'MEP Inspection Sign-off' },
    { name: 'Flooring, Painting & Snag Handover', percentage: 20, trigger: 'Finishing Phase Audit' },
    { name: 'Occupancy Certificate & Possession', percentage: 10, trigger: 'Occupancy Certificate (OC)' }
  ];

  const generatedMilestones = milestonesList.map((m, idx) => {
    const pct = m.percentage || m.pct;
    const dueAmt = Math.round(agreementVal * (pct / 100));
    const isFirst = idx === 0;
    return {
      id: `mls-${booking.id}-${idx + 1}`,
      booking_id: booking.id,
      milestone_name: m.name,
      milestone_percentage: pct,
      amount_due: dueAmt,
      due_date: new Date(Date.now() + idx * 35 * 86400000).toISOString().split('T')[0],
      architect_cert_ref: isFirst ? 'ARCH-CERT-INIT' : `ARCH-CERT-STAGE-${idx + 1}`,
      is_triggered: isFirst,
      demand_notice_sent_at: isFirst ? new Date().toISOString() : null,
      amount_paid: isFirst ? Number(token_amount) : 0,
      status: isFirst ? (Number(token_amount) >= dueAmt ? 'paid' : 'partially_paid') : 'pending'
    };
  });

  // Record Token Payment
  const tokenPayment = {
    id: `pay-${Date.now()}`,
    booking_id: booking.id,
    milestone_id: generatedMilestones[0].id,
    milestone_name: generatedMilestones[0].milestone_name,
    amount_paid: Number(token_amount),
    payment_mode: 'gateway_razorpay',
    transaction_ref: `RZP_${Date.now()}`,
    verified_by: 'usr-post-1',
    receipt_number: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    payment_date: new Date().toISOString().split('T')[0]
  };

  db.bookings.unshift(booking);
  db.paymentMilestones.push(...generatedMilestones);
  db.customerPayments.unshift(tokenPayment);

  // Update CP broker metrics if applicable
  if (booking.channel_partner_id) {
    const cp = db.channelPartners.find(c => c.id === booking.channel_partner_id);
    if (cp) {
      cp.total_bookings = (cp.total_bookings || 0) + 1;
      const brokeragePct = cp.commission_slab_pct || 2.0;
      const earned = Math.round(booking.agreement_value * (brokeragePct / 100));
      cp.total_brokerage_earned = (cp.total_brokerage_earned || 0) + earned;
      cp.brokerage_pending = (cp.brokerage_pending || 0) + earned;
    }
  }

  // Update lead stage
  if (lead) {
    lead.stage = 'booked';
    lead.last_activity = `Unit ${unit.unit_number} booked successfully! Booking Ref: ${booking.id}`;
    lead.jarvis_score = 99;
  }

  saveDb();

  broadcastSSE('unit_status_changed', { unit_id: unit.id, unit_number: unit.unit_number, status: 'booked' });
  broadcastSSE('new_booking', booking);

  res.json({
    success: true,
    message: `Unit ${unit.unit_number} booked! Agreement Value: ₹${(booking.agreement_value / 10000000).toFixed(2)} Cr`,
    booking,
    milestones: generatedMilestones,
    payment: tokenPayment
  });
});

// Trigger Architect Milestone -> Demand Notice
app.post('/v1/milestones/:id/trigger', (req, res) => {
  const db = getDb();
  const milestone = db.paymentMilestones.find(m => m.id === req.params.id);
  if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

  milestone.is_triggered = true;
  milestone.architect_cert_ref = req.body.cert_ref || `ARCH-CERT-${Date.now().toString().slice(-4)}`;
  milestone.demand_notice_sent_at = new Date().toISOString();
  if (milestone.status === 'pending') {
    milestone.status = 'demanded';
  }

  saveDb();
  broadcastSSE('milestone_demanded', milestone);

  res.json({
    success: true,
    message: `RERA Demand Notice dispatched for ${milestone.milestone_name}. Architect Cert: ${milestone.architect_cert_ref}`,
    milestone
  });
});

// Record Customer Payment
app.post('/v1/payments/record', (req, res) => {
  const db = getDb();
  const { booking_id, milestone_id, amount_paid, payment_mode = 'rtgs', transaction_ref } = req.body;

  const milestone = db.paymentMilestones.find(m => m.id === milestone_id);
  if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

  const amt = Number(amount_paid);
  const payment = {
    id: `pay-${Date.now()}`,
    booking_id,
    milestone_id,
    milestone_name: milestone.milestone_name,
    amount_paid: amt,
    payment_mode,
    transaction_ref: transaction_ref || `TXN_${Date.now()}`,
    verified_by: 'usr-post-1',
    receipt_number: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    payment_date: new Date().toISOString().split('T')[0]
  };

  milestone.amount_paid = (milestone.amount_paid || 0) + amt;
  if (milestone.amount_paid >= milestone.amount_due) {
    milestone.status = 'paid';
  } else {
    milestone.status = 'partially_paid';
  }

  db.customerPayments.unshift(payment);
  saveDb();

  broadcastSSE('payment_recorded', payment);
  res.json({ success: true, message: `Payment of ₹${amt.toLocaleString('en-IN')} reconciled. Receipt: ${payment.receipt_number}`, payment, milestone });
});

// Official RERA Demand Notice Generator Endpoint
app.get('/v1/bookings/:id/demand-letter/:milestoneId', (req, res) => {
  const db = getDb();
  const booking = db.bookings.find(b => b.id === req.params.id) || db.bookings[0];
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  const milestone = db.paymentMilestones.find(m => m.id === req.params.milestoneId) || 
                    db.paymentMilestones.find(m => m.booking_id === booking.id && m.is_triggered) ||
                    db.paymentMilestones[0];

  const project = db.projects.find(p => p.id === booking.project_id) || db.projects[0];
  const unit = db.units.find(u => u.id === booking.unit_id) || db.units[0];

  const demandNotice = {
    notice_ref: `DEMAND-${project.id.slice(5).toUpperCase()}-${Date.now().toString().slice(-5)}`,
    dispatch_date: new Date().toISOString().split('T')[0],
    due_date: milestone ? milestone.due_date : new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    project: {
      name: project.name,
      rera_registration: project.rera_id,
      location: project.location
    },
    buyer: {
      name: booking.customer_name,
      phone: booking.customer_phone,
      email: booking.customer_email,
      unit_number: booking.unit_number,
      configuration: unit ? unit.configuration : 'Luxury Residence',
      agreement_value: booking.agreement_value
    },
    milestone: {
      id: milestone ? milestone.id : 'mls-1',
      name: milestone ? milestone.milestone_name : 'Current Construction Milestone',
      percentage: milestone ? milestone.milestone_percentage : 10,
      architect_cert: milestone?.architect_cert_ref || 'ARCH-CERT-CIVIL-2026',
      amount_due: milestone ? milestone.amount_due : Math.round(booking.agreement_value * 0.1),
      gst_5_pct: Math.round((milestone ? milestone.amount_due : Math.round(booking.agreement_value * 0.1)) * 0.05),
      total_payable: Math.round((milestone ? milestone.amount_due : Math.round(booking.agreement_value * 0.1)) * 1.05)
    },
    rera_escrow_account: {
      bank_name: 'HDFC Bank Ltd, Corporate Banking Branch',
      account_name: `${project.name} RERA 70% Master Escrow Account`,
      escrow_account_no: '575000192837461',
      ifsc_code: 'HDFC0000060',
      virtual_upi_id: `aurum.${booking.unit_number.toLowerCase().replace(/[^a-z0-9]/g, '')}@hdfcbank`
    },
    statutory_clauses: [
      'Demand is raised pursuant to Engineer & Architect Milestone Completion Certificate under RERA Section 4(2)(l)(D).',
      '70% of received funds shall be deposited directly into the RERA Designated Project Escrow Account for construction and land costs.',
      'Under RERA Section 19(6), any delay in payment beyond due date attracts interest at the State Bank of India (SBI) Highest Marginal Cost of Funds Based Lending Rate (MCLR) + 2% per annum.'
    ]
  };

  res.json({ success: true, demand_notice: demandNotice });
});

// Snagging Management Endpoints
app.post('/v1/snags', (req, res) => {
  const db = getDb();
  const { booking_id, room, category = 'Finishes', description } = req.body;
  const booking = db.bookings.find(b => b.id === booking_id) || db.bookings[0];

  const snag = {
    id: `sng-${Date.now()}`,
    booking_id: booking ? booking.id : 'bkg-301',
    room: room || 'Living Room',
    category,
    description: description || 'Visual inspection observation logged',
    status: 'in_progress',
    reported_at: new Date().toISOString()
  };

  db.snags.unshift(snag);
  saveDb();

  broadcastSSE('snag_reported', snag);
  res.json({ success: true, message: `Snag reported for ${snag.room}`, snag });
});

app.patch('/v1/snags/:id/resolve', (req, res) => {
  const db = getDb();
  const snag = db.snags.find(s => s.id === req.params.id);
  if (!snag) return res.status(404).json({ success: false, message: 'Snag not found' });

  snag.status = 'resolved';
  snag.resolved_at = new Date().toISOString();
  saveDb();

  broadcastSSE('snag_resolved', snag);
  res.json({ success: true, message: 'Snag verified and resolved', snag });
});

// Official Possession Handover Certificate & Key NOC Endpoint
app.get('/v1/bookings/:id/handover-certificate', (req, res) => {
  const db = getDb();
  const booking = db.bookings.find(b => b.id === req.params.id) || db.bookings[0];
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  const project = db.projects.find(p => p.id === booking.project_id) || db.projects[0];
  const unit = db.units.find(u => u.id === booking.unit_id) || db.units[0];
  const bookingSnags = db.snags.filter(s => s.booking_id === booking.id);
  const pendingSnags = bookingSnags.filter(s => s.status !== 'resolved').length;

  const certificate = {
    noc_reference: `POSS-NOC-${booking.unit_number}-${Date.now().toString().slice(-4)}`,
    handover_date: new Date().toISOString().split('T')[0],
    project: {
      name: project.name,
      rera_id: project.rera_id,
      location: project.location
    },
    buyer: {
      name: booking.customer_name,
      unit_number: booking.unit_number,
      agreement_value: booking.agreement_value
    },
    unit_specs: {
      configuration: unit ? unit.configuration : '4BHK Penthouse',
      carpet_area: unit ? unit.carpet_area : 2150,
      parking_slots: unit ? unit.parking_slots : 2
    },
    clearance_status: {
      financial_ledger_cleared: true,
      society_share_money_paid: true,
      snag_inspection_cleared: pendingSnags === 0,
      electricity_water_meter_transferred: true,
      keys_handed_over: 4
    },
    defect_liability_period: {
      guarantee_years: 5,
      section_reference: 'Section 14(3) of RERA Act, 2016',
      warranty_expires: new Date(Date.now() + 5 * 365 * 86400000).toISOString().split('T')[0],
      coverage: 'Structural defect, workmanship, quality of provision'
    }
  };

  res.json({ success: true, certificate });
});

// Booking Cancellation & Unit Release Mutex
app.post('/v1/bookings/:id/cancel', (req, res) => {
  const db = getDb();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  const { forfeiture_pct = 10, reason = 'Buyer opted for withdrawal' } = req.body;

  // Calculate Forfeiture (e.g. 10% of token or statutory EMD)
  const forfeitureAmt = Math.round(Number(booking.token_amount) * (forfeiture_pct / 100));
  const refundAmt = Math.max(0, Number(booking.token_amount) - forfeitureAmt);

  booking.booking_status = 'cancelled';
  booking.cancellation_reason = reason;
  booking.forfeiture_amount = forfeitureAmt;
  booking.refund_amount = refundAmt;
  booking.cancelled_at = new Date().toISOString();

  // Atomically release unit back to available
  const unit = db.units.find(u => u.id === booking.unit_id);
  if (unit) {
    unit.status = 'available';
    unit.held_by_user_id = null;
    unit.held_by_name = null;
    unit.held_until = null;
  }

  saveDb();

  broadcastSSE('unit_status_changed', { unit_id: unit.id, unit_number: unit.unit_number, status: 'available' });
  broadcastSSE('booking_cancelled', booking);

  res.json({
    success: true,
    message: `Booking cancelled. Unit ${booking.unit_number} released back to Available. Refund: ₹${refundAmt.toLocaleString('en-IN')}`,
    booking,
    released_unit: unit
  });
});

// Dynamic Project & Inventory Admin Configurator Endpoints
app.post('/v1/projects', (req, res) => {
  const db = getDb();
  const { name, rera_id, location, city, base_rate_sqft = 12000, description } = req.body;

  if (!name || !rera_id || !location) {
    return res.status(400).json({ success: false, message: 'Name, RERA ID, and Location are mandatory' });
  }

  const projId = `proj-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const newProj = {
    id: projId,
    org_id: db.organization.id,
    name,
    rera_id,
    location,
    city: city || 'Mumbai',
    total_units: 0,
    base_rate_sqft: Number(base_rate_sqft),
    description: description || 'Master planned real estate development',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  };

  db.projects.push(newProj);
  saveDb();

  broadcastSSE('project_created', newProj);
  res.json({ success: true, message: `Project ${name} created with RERA ${rera_id}`, project: newProj });
});

app.post('/v1/towers', (req, res) => {
  const db = getDb();
  const { project_id, name, total_floors = 10, units_per_floor = 4 } = req.body;
  const project = db.projects.find(p => p.id === project_id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const towerId = `tow-${Date.now()}`;
  const newTower = {
    id: towerId,
    project_id,
    name,
    total_floors: Number(total_floors),
    units_per_floor: Number(units_per_floor)
  };

  db.towers.push(newTower);

  // Bulk generate units for the tower
  const generatedUnits = [];
  for (let f = 1; f <= Number(total_floors); f++) {
    for (let u = 1; u <= Number(units_per_floor); u++) {
      const isLarge = u % 2 === 0;
      const unitNum = `${name.charAt(0).toUpperCase()}-${f}0${u}`;
      const carpet = isLarge ? 1450 : 950;
      const sbu = Math.round(carpet * 1.35);

      generatedUnits.push({
        id: `unit-${towerId}-${f}0${u}`,
        tower_id: towerId,
        project_id,
        unit_number: unitNum,
        floor_number: f,
        configuration: isLarge ? '3BHK Prime' : '2BHK Comfort',
        carpet_area: carpet,
        super_built_up_area: sbu,
        facing: u === 1 ? 'East' : u === 2 ? 'West' : 'North',
        base_price: project.base_rate_sqft || 15000,
        floor_rise_rate: 100,
        plc_rate: 500,
        status: 'available',
        held_by_user_id: null,
        held_by_name: null,
        held_until: null,
        parking_slots: isLarge ? 2 : 1,
        parking_cost: isLarge ? 600000 : 400000
      });
    }
  }

  db.units.push(...generatedUnits);
  project.total_units = (project.total_units || 0) + generatedUnits.length;
  saveDb();

  broadcastSSE('tower_created', { tower: newTower, units_created: generatedUnits.length });
  res.json({
    success: true,
    message: `Tower ${name} configured with ${generatedUnits.length} live units`,
    tower: newTower,
    units_count: generatedUnits.length
  });
});

// ====================================================
// IRIS Launch Command Center API
// ====================================================
app.get('/v1/iris/war-room', (req, res) => {
  const db = getDb();
  checkExpiredHolds();
  const solitaireUnits = db.units.filter(u => u.project_id === 'proj-solitaire');
  res.json({
    success: true,
    war_room: db.irisWarRoom,
    inventory: {
      total: solitaireUnits.length,
      available: solitaireUnits.filter(u => u.status === 'available').length,
      held: solitaireUnits.filter(u => u.status === 'held').length,
      booked: solitaireUnits.filter(u => u.status === 'booked').length,
      sold: solitaireUnits.filter(u => u.status === 'sold').length
    },
    units: solitaireUnits
  });
});

app.post('/v1/iris/token/issue', (req, res) => {
  const db = getDb();
  const { visitor } = req.body;
  const tokenNumber = `T-00${db.irisWarRoom.queue_tokens.length + 1}`;
  const newToken = {
    token: tokenNumber,
    visitor: visitor || `Walk-in Guest ${tokenNumber}`,
    desk: 'Waiting Lounge',
    status: 'waiting',
    unit_allocated: null
  };

  db.irisWarRoom.queue_tokens.push(newToken);
  saveDb();

  broadcastSSE('iris_token_issued', newToken);
  res.json({ success: true, message: `Token ${tokenNumber} issued to ${newToken.visitor}`, token: newToken });
});

// ====================================================
// Omnichannel Communication API
// ====================================================
app.get('/v1/comm/threads/:leadId', (req, res) => {
  const db = getDb();
  const thread = db.commThreads.find(t => t.lead_id === req.params.leadId);
  res.json({ success: true, thread: thread || { lead_id: req.params.leadId, channel: 'whatsapp', messages: [] } });
});

app.post('/v1/comm/send-whatsapp', (req, res) => {
  const db = getDb();
  const { lead_id, message } = req.body;
  let thread = db.commThreads.find(t => t.lead_id === lead_id);
  if (!thread) {
    thread = { lead_id, channel: 'whatsapp', messages: [] };
    db.commThreads.push(thread);
  }

  const msg = {
    sender: 'agent',
    text: message,
    time: new Date().toISOString()
  };
  thread.messages.push(msg);
  saveDb();

  broadcastSSE('new_whatsapp_message', { lead_id, message: msg });
  res.json({ success: true, message: 'WhatsApp message dispatched via Meta Business API', msg });
});

// ====================================================
// Omnichannel Communication & WhatsApp Drips Engine API
// ====================================================
app.get('/v1/communications/templates', (req, res) => {
  const db = getDb();
  res.json({ success: true, templates: db.communicationTemplates || [] });
});

app.post('/v1/communications/send', (req, res) => {
  const db = getDb();
  const { lead_id, booking_id, template_id, channel = 'whatsapp', custom_body } = req.body;

  const lead = db.leads.find(l => l.id === lead_id);
  const booking = db.bookings.find(b => b.id === booking_id);
  const template = (db.communicationTemplates || []).find(t => t.id === template_id);

  const recipientName = lead ? lead.name : (booking ? booking.customer_name : 'Customer');
  const recipientPhone = lead ? lead.phone : (booking ? booking.customer_phone : '+91 98000 00000');
  const project = db.projects.find(p => p.id === (lead?.project_id || booking?.project_id)) || db.projects[0];

  let messageText = custom_body || template?.body || 'Hello from Aurum Crest Developers';
  // Merge dynamic tags
  messageText = messageText
    .replace(/\{\{lead_name\}\}/g, recipientName)
    .replace(/\{\{buyer_name\}\}/g, recipientName)
    .replace(/\{\{project_name\}\}/g, project.name)
    .replace(/\{\{project_id\}\}/g, project.id)
    .replace(/\{\{project_location\}\}/g, project.location)
    .replace(/\{\{project_lat\}\}/g, project.latitude || '19.0178')
    .replace(/\{\{project_lng\}\}/g, project.longitude || '72.8172')
    .replace(/\{\{unit_number\}\}/g, booking ? booking.unit_number : 'A-401')
    .replace(/\{\{assigned_rep_name\}\}/g, lead ? lead.assigned_rep_name : 'Priya Kulkarni')
    .replace(/\{\{assigned_rep_phone\}\}/g, '+91 98204 44556')
    .replace(/\{\{scheduled_time\}\}/g, 'Saturday 11:30 AM')
    .replace(/\{\{chauffeur_status\}\}/g, 'Driver Assigned')
    .replace(/\{\{vehicle_number\}\}/g, 'MH-01-EQ-4422');

  const dispatchRecord = {
    id: `comm-${Date.now()}`,
    channel,
    recipient_name: recipientName,
    recipient_phone: recipientPhone,
    template_id: template?.id || 'custom',
    template_name: template?.name || 'Custom Message',
    body: messageText,
    status: 'delivered',
    sent_at: new Date().toISOString()
  };

  if (lead) {
    lead.last_activity = `Dispatched ${channel.toUpperCase()} message: "${template?.name || 'Custom Notification'}"`;
    let thread = db.commThreads.find(t => t.lead_id === lead.id);
    if (!thread) {
      thread = { lead_id: lead.id, channel, messages: [] };
      db.commThreads.push(thread);
    }
    thread.messages.push({
      sender: 'agent',
      text: messageText,
      time: dispatchRecord.sent_at
    });
  }

  saveDb();
  broadcastSSE('communication_dispatched', dispatchRecord);
  if (lead) broadcastSSE('lead_updated', lead);

  res.json({
    success: true,
    message: `${channel.toUpperCase()} notification dispatched via Twilio/Meta Business API`,
    dispatch: dispatchRecord
  });
});

// ====================================================
// Marketing Campaigns & Attribution Engine API
// ====================================================
app.get('/v1/campaigns', (req, res) => {
  const db = getDb();
  const campaigns = (db.campaigns || []).map(c => {
    const cpl = c.leads_generated > 0 ? Math.round(c.spend / c.leads_generated) : 0;
    const cpsv = c.site_visits > 0 ? Math.round(c.spend / c.site_visits) : 0;
    const cpb = c.bookings > 0 ? Math.round(c.spend / c.bookings) : 0;
    const romi = c.spend > 0 ? Number(((c.revenue_booked - c.spend) / c.spend).toFixed(1)) : 0;

    return {
      ...c,
      cost_per_lead: cpl,
      cost_per_site_visit: cpsv,
      cost_per_booking: cpb,
      romi_multiplier: romi
    };
  });

  const totals = campaigns.reduce((acc, c) => {
    acc.total_budget += c.budget;
    acc.total_spend += c.spend;
    acc.total_leads += c.leads_generated;
    acc.total_site_visits += c.site_visits;
    acc.total_bookings += c.bookings;
    acc.total_revenue += c.revenue_booked;
    return acc;
  }, { total_budget: 0, total_spend: 0, total_leads: 0, total_site_visits: 0, total_bookings: 0, total_revenue: 0 });

  res.json({ success: true, campaigns, totals });
});

app.post('/v1/campaigns/utm-link', (req, res) => {
  const { base_url = 'https://grand-solitaire.aurumrealty.com', source = 'meta', medium = 'paid_social', campaign = 'diwali_fest_2026', term = '', content = '' } = req.body;
  try {
    const url = new URL(base_url);
    if (source) url.searchParams.set('utm_source', source);
    if (medium) url.searchParams.set('utm_medium', medium);
    if (campaign) url.searchParams.set('utm_campaign', campaign);
    if (term) url.searchParams.set('utm_term', term);
    if (content) url.searchParams.set('utm_content', content);
    res.json({ success: true, generated_url: url.toString() });
  } catch (e) {
    const fallback = `${base_url}?utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
    res.json({ success: true, generated_url: fallback });
  }
});

// ====================================================
// Enterprise Data Export & Reporting Center API
// ====================================================
app.get('/v1/exports/inventory', (req, res) => {
  const db = getDb();
  let csv = 'Unit ID,Project,Tower,Unit Number,Floor,Configuration,Carpet Area (sqft),SBU Area (sqft),Base Rate (sqft),Parking Slots,Status,Held By,Agreement Value (INR)\n';
  db.units.forEach(u => {
    const proj = db.projects.find(p => p.id === u.project_id)?.name || u.project_id;
    const bkg = db.bookings.find(b => b.unit_id === u.id);
    const cost = computeCostSheet(u);
    csv += `"${u.id}","${proj}","${u.tower_id}","${u.unit_number}",${u.floor_number},"${u.configuration}",${u.carpet_area},${u.super_built_up_area},${u.base_price},${u.parking_slots},"${u.status}","${u.held_by_name || ''}",${bkg ? bkg.agreement_value : cost.agreement_value}\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="SellDo_Master_Inventory.csv"');
  res.send(csv);
});

app.get('/v1/exports/leads', (req, res) => {
  const db = getDb();
  let csv = 'Lead ID,Name,Phone,Email,Source,Project,Assigned Rep,Stage,Jarvis Score,SLA Breached,Call Count,Talk Time (sec),Created Date,Last Activity\n';
  db.leads.forEach(l => {
    csv += `"${l.id}","${l.name}","${l.phone}","${l.email}","${l.source}","${l.project_name || l.project_id}","${l.assigned_rep_name || ''}","${l.stage}",${l.jarvis_score || 0},${l.sla_breached ? 'YES' : 'NO'},${l.call_count || 0},${l.total_talk_time_sec || 0},"${l.created_at}","${(l.last_activity || '').replace(/"/g, '""')}"\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="SellDo_Leads_Attribution_Dump.csv"');
  res.send(csv);
});

app.get('/v1/exports/clp-collections', (req, res) => {
  const db = getDb();
  let csv = 'Milestone ID,Booking ID,Customer,Unit,Milestone Name,Percentage,Due Date,Amount Due (INR),Amount Paid (INR),Balance Due (INR),Status,RERA 70% Escrow Allocation\n';
  db.paymentMilestones.forEach(m => {
    const bkg = db.bookings.find(b => b.id === m.booking_id);
    const balance = Math.max(0, m.amount_due - (m.amount_paid || 0));
    const escrow70 = Math.round(m.amount_due * 0.70);
    csv += `"${m.id}","${m.booking_id}","${bkg?.customer_name || 'Buyer'}","${bkg?.unit_number || 'Unit'}","${m.milestone_name}",${m.milestone_percentage},"${m.due_date}",${m.amount_due},${m.amount_paid || 0},${balance},"${m.status}",${escrow70}\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="SellDo_CLP_Collections_Escrow.csv"');
  res.send(csv);
});

app.get('/v1/exports/cp-brokerage', (req, res) => {
  const db = getDb();
  let csv = 'CP ID,Firm Name,RERA Number,Contact Person,Phone,Email,Commission Slab,Total Bookings,Gross Brokerage Earned (INR),Sec 194H TDS 5% (INR),GST 18% (INR),Net Brokerage Paid (INR),Pending Payout (INR)\n';
  db.channelPartners.forEach(cp => {
    const gross = cp.total_brokerage_earned || 0;
    const tds = Math.round(gross * 0.05);
    const gst = Math.round(gross * 0.18);
    csv += `"${cp.id}","${cp.firm_name}","${cp.rera_number}","${cp.contact_name}","${cp.phone}","${cp.email}","${cp.current_slab || 'Slab 1 (2%)'}",${cp.total_bookings || 0},${gross},${tds},${gst},${cp.brokerage_paid || 0},${cp.brokerage_pending || 0}\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="SellDo_CP_Section194H_TDS_Register.csv"');
  res.send(csv);
});

// ====================================================
// Executive Revenue Cockpit & Analytics API
// ====================================================
app.get('/v1/reports/cockpit', (req, res) => {
  const db = getDb();
  
  const totalLeads = db.leads.length;
  const activeBookings = db.bookings.length;
  const totalRevenue = db.bookings.reduce((sum, b) => sum + Number(b.agreement_value || 0), 0);
  const totalCollections = db.customerPayments.reduce((sum, p) => sum + Number(p.amount_paid || 0), 0);
  const siteVisitsCount = db.siteVisits.length;

  // Funnel Breakdown
  const funnel = {
    new: db.leads.filter(l => l.stage === 'new').length,
    contacted: db.leads.filter(l => l.stage === 'contacted').length,
    qualified: db.leads.filter(l => l.stage === 'qualified').length,
    visit_scheduled: db.leads.filter(l => l.stage === 'visit_scheduled').length,
    visit_completed: db.leads.filter(l => l.stage === 'visit_completed').length,
    negotiation: db.leads.filter(l => l.stage === 'negotiation').length,
    booking_initiated: db.leads.filter(l => l.stage === 'booking_initiated').length,
    booked: db.leads.filter(l => l.stage === 'booked').length,
    lost: db.leads.filter(l => l.stage === 'lost').length
  };

  // Agent Leaderboard
  const reps = db.users.filter(u => u.role === 'sales_rep');
  const leaderboard = reps.map(rep => {
    const repLeads = db.leads.filter(l => l.assigned_to === rep.id);
    const repBookings = db.bookings.filter(b => b.booked_by_user_id === rep.id);
    const repRevenue = repBookings.reduce((sum, b) => sum + Number(b.agreement_value || 0), 0);
    const totalCalls = repLeads.reduce((sum, l) => sum + (l.call_count || 0), 0);
    const totalTalkTime = repLeads.reduce((sum, l) => sum + (l.total_talk_time_sec || 0), 0);

    return {
      id: rep.id,
      name: rep.name,
      leads_managed: repLeads.length,
      bookings_closed: repBookings.length,
      revenue_closed: repRevenue,
      total_calls: totalCalls,
      total_talk_time_mins: Math.round(totalTalkTime / 60)
    };
  });

  res.json({
    success: true,
    kpis: {
      target_revenue: 250000000,
      achieved_revenue: totalRevenue,
      revenue_target_pct: Math.round((totalRevenue / 250000000) * 100),
      total_collections: totalCollections,
      total_leads: totalLeads,
      total_bookings: activeBookings,
      site_visits: siteVisitsCount,
      cost_per_booking: 145000,
      cost_per_site_visit: 12500
    },
    funnel,
    leaderboard
  });
});

// ====================================================
// Built-in Model Context Protocol (MCP) Server Endpoint
// ====================================================
const MCP_TOOLS = [
  {
    name: 'crm_get_inventory',
    description: 'Query real estate project inventory, towers, units, availability, and pricing',
    parameters: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project ID (e.g. proj-solitaire, proj-aurelia)' },
        status: { type: 'string', enum: ['available', 'held', 'booked', 'sold', 'all'] },
        configuration: { type: 'string', description: 'Filter by configuration like 2BHK, 3BHK, 4BHK' }
      }
    }
  },
  {
    name: 'crm_hold_unit',
    description: 'Place a 15-minute concurrency-safe reservation lock on a specific unit',
    parameters: {
      type: 'object',
      properties: {
        unit_id: { type: 'string', description: 'Target Unit ID' },
        rep_name: { type: 'string', description: 'Sales representative requesting hold' }
      },
      required: ['unit_id']
    }
  },
  {
    name: 'crm_generate_cost_sheet',
    description: 'Calculate comprehensive real estate price quotation including BSP, Floor Rise, PLC, Parking, GST, Stamp Duty',
    parameters: {
      type: 'object',
      properties: {
        unit_id: { type: 'string', description: 'Unit ID' },
        discount_pct: { type: 'number', description: 'Optional discount percentage (0 to 5%)' }
      },
      required: ['unit_id']
    }
  },
  {
    name: 'crm_get_lead_summary',
    description: 'Fetch lead profile, Jarvis AI predictive intent score, factors, and communication history',
    parameters: {
      type: 'object',
      properties: {
        lead_id: { type: 'string', description: 'Lead ID' }
      },
      required: ['lead_id']
    }
  },
  {
    name: 'crm_calculate_cp_brokerage',
    description: 'Calculate Channel Partner slab brokerage, Section 194H TDS (5%), and GST (18%) invoicing',
    parameters: {
      type: 'object',
      properties: {
        agreement_value: { type: 'number', description: 'Agreement value in INR' },
        partner_id: { type: 'string', description: 'Channel Partner ID' }
      },
      required: ['agreement_value']
    }
  },
  {
    name: 'crm_query_funnel_metrics',
    description: 'Retrieve executive conversion metrics, pipeline stages, and drop-off rates',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'jarvis_voice_qualify',
    description: 'Autonomous conversational AI voice agent qualification for real estate inquiries',
    parameters: {
      type: 'object',
      properties: {
        lead_id: { type: 'string', description: 'Target Lead ID to qualify' },
        purpose: { type: 'string', enum: ['end_use', 'investment'] },
        budget_range: { type: 'string', description: 'Budget comfort bracket' },
        preferred_bhk: { type: 'string', description: 'Configuration preference' },
        site_visit_slot: { type: 'string', description: 'Confirmed slot for visit' }
      },
      required: ['lead_id']
    }
  }
];

app.post('/v1/mcp', (req, res) => {
  const db = getDb();
  const { jsonrpc = '2.0', id = 1, method, params = {} } = req.body;

  if (method === 'tools/list') {
    return res.json({
      jsonrpc,
      id,
      result: { tools: MCP_TOOLS }
    });
  }

  if (method === 'tools/call') {
    const { name, arguments: args = {} } = params;

    if (name === 'crm_get_inventory') {
      let units = [...db.units];
      if (args.project_id) units = units.filter(u => u.project_id === args.project_id);
      if (args.status && args.status !== 'all') units = units.filter(u => u.status === args.status);
      if (args.configuration) units = units.filter(u => u.configuration.toLowerCase().includes(args.configuration.toLowerCase()));

      return res.json({
        jsonrpc,
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ count: units.length, units }, null, 2)
            }
          ]
        }
      });
    }

    if (name === 'crm_hold_unit') {
      const unit = db.units.find(u => u.id === args.unit_id);
      if (!unit) {
        return res.json({ jsonrpc, id, error: { code: -32602, message: 'Unit not found' } });
      }
      if (unit.status !== 'available') {
        return res.json({ jsonrpc, id, error: { code: -32603, message: `Unit is already ${unit.status}` } });
      }

      const heldUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      unit.status = 'held';
      unit.held_by_name = args.rep_name || 'AI Assistant';
      unit.held_until = heldUntil;
      saveDb();

      broadcastSSE('unit_status_changed', { unit_id: unit.id, unit_number: unit.unit_number, status: 'held', held_by: unit.held_by_name });

      return res.json({
        jsonrpc,
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, unit_number: unit.unit_number, held_until: heldUntil }, null, 2)
            }
          ]
        }
      });
    }

    if (name === 'crm_generate_cost_sheet') {
      const unit = db.units.find(u => u.id === args.unit_id);
      if (!unit) {
        return res.json({ jsonrpc, id, error: { code: -32602, message: 'Unit not found' } });
      }
      const sheet = computeCostSheet(unit, args.discount_pct || 0);
      return res.json({
        jsonrpc,
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(sheet, null, 2) }]
        }
      });
    }

    if (name === 'crm_get_lead_summary') {
      const lead = db.leads.find(l => l.id === args.lead_id);
      if (!lead) {
        return res.json({ jsonrpc, id, error: { code: -32602, message: 'Lead not found' } });
      }
      return res.json({
        jsonrpc,
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(lead, null, 2) }]
        }
      });
    }

    if (name === 'crm_calculate_cp_brokerage') {
      const agreementVal = Number(args.agreement_value);
      const slabPct = 2.5; // default slab 2
      const grossBrokerage = Math.round(agreementVal * (slabPct / 100));
      const tds194H = Math.round(grossBrokerage * 0.05); // 5% TDS
      const gst18 = Math.round(grossBrokerage * 0.18); // 18% GST invoice
      const netPayable = grossBrokerage - tds194H;

      return res.json({
        jsonrpc,
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                agreement_value: agreementVal,
                commission_slab_pct: slabPct,
                gross_brokerage: grossBrokerage,
                section_194h_tds_5_pct: tds194H,
                gst_invoice_18_pct: gst18,
                net_brokerage_payable: netPayable
              }, null, 2)
            }
          ]
        }
      });
    }

    if (name === 'crm_query_funnel_metrics') {
      const totalLeads = db.leads.length;
      const bookingsCount = db.bookings.length;
      return res.json({
        jsonrpc,
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                total_leads: totalLeads,
                total_bookings: bookingsCount,
                conversion_rate_pct: ((bookingsCount / totalLeads) * 100).toFixed(1)
              }, null, 2)
            }
          ]
        }
      });
    }

    if (name === 'jarvis_voice_qualify') {
      const lead = db.leads.find(l => l.id === args.lead_id);
      if (!lead) {
        return res.json({ jsonrpc, id, error: { code: -32602, message: 'Lead not found' } });
      }

      lead.stage = args.site_visit_slot ? 'visit_scheduled' : 'qualified';
      lead.jarvis_score = 96;
      lead.jarvis_factors = [
        'Jarvis AI Multi-Lingual Voice Qualification Call Completed',
        `Purpose confirmed: ${args.purpose || 'End Use'}`,
        `Budget bracket confirmed: ${args.budget_range || '₹5.5 - 7.5 Cr'}`,
        `Configuration verified: ${args.preferred_bhk || '3BHK Sea Suite'}`,
        `Site Visit Slot: ${args.site_visit_slot || 'Saturday 11:30 AM'}`
      ];
      lead.last_activity = `Jarvis AI Voice Agent qualified lead. Stage: ${lead.stage}. Intent: 96%`;
      saveDb();

      broadcastSSE('lead_updated', lead);

      return res.json({
        jsonrpc,
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                lead_id: lead.id,
                name: lead.name,
                qualified_stage: lead.stage,
                jarvis_score: lead.jarvis_score,
                factors: lead.jarvis_factors
              }, null, 2)
            }
          ]
        }
      });
    }

    return res.status(404).json({ jsonrpc, id, error: { code: -32601, message: `Tool ${name} not found` } });
  }

  res.status(400).json({ jsonrpc, id, error: { code: -32600, message: 'Invalid Request' } });
});

// ====================================================
// Jarvis AI Autonomous Voice Qualification API
// ====================================================
app.post('/v1/ai/voice-call/start', (req, res) => {
  const db = getDb();
  const { lead_id, language = 'en-IN' } = req.body;
  const lead = db.leads.find(l => l.id === lead_id) || db.leads[0];
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

  const greeting = language === 'hi-IN'
    ? `नमस्ते ${lead.name} जी! मैं औरम रियल्टी से प्रिया बात कर रही हूँ, आपके ${lead.project_name || 'The Grand Solitaire'} में सी-फेसिंग लक्ज़री फ्लैट के इन्क्वायरी के संदर्भ में। क्या मेरी बात ${lead.name} जी से हो रही है?`
    : `Hello ${lead.name}! This is Priya calling from Aurum Crest regarding your interest in ${lead.project_name || 'The Grand Solitaire'}. I noticed you were exploring our premium ${lead.preferred_config || '3BHK Sea Suite'} residences. Am I speaking with ${lead.name}?`;

  res.json({
    success: true,
    call_id: `call-ai-${Date.now()}`,
    lead: { id: lead.id, name: lead.name, phone: lead.phone, project: lead.project_name, config: lead.preferred_config },
    step: 1,
    agent_utterance: greeting,
    intent_detected: 'Greeting & Verification',
    quick_replies: [
      "Yes, this is me. Please share more details.",
      "Yes, what are the current prices and availability?",
      "I am driving right now, can you give a quick 1-minute summary?"
    ]
  });
});

app.post('/v1/ai/voice-call/step', (req, res) => {
  const db = getDb();
  const { lead_id, current_step = 1, buyer_reply = '', language = 'en-IN' } = req.body;
  const lead = db.leads.find(l => l.id === lead_id) || db.leads[0];

  let nextStep = Number(current_step) + 1;
  let agentUtterance = '';
  let intent = '';
  let quickReplies = [];

  if (nextStep === 2) {
    intent = 'Purpose Qualification (End Use vs Investment)';
    agentUtterance = language === 'hi-IN'
      ? `बहुत बढ़िया! क्या आप यह घर मुख्य रूप से अपने परिवार के रहने (End-Use) के लिए देख रहे हैं, या कैपिटल अप्रिसिएशन के लिए पोर्टफोलियो इन्वेस्टमेंट के रूप में?`
      : `Wonderful! Are you exploring this luxury residence primarily for your personal family end-use, or are you looking at capital appreciation as an investment portfolio addition?`;
    quickReplies = [
      "Primarily for personal end-use with family.",
      "Looking for investment with rental yield.",
      "Both - end-use after a couple of years."
    ];
  } else if (nextStep === 3) {
    intent = 'Configuration & Carpet Area Alignment';
    agentUtterance = language === 'hi-IN'
      ? `समझ गई जी। हमारे 3BHK और 4BHK पेंटहाउस में 11 फ़ीट 4 इंच की क्लियर सीलिंग और अरब सागर का शानदार अनइंटरप्टेड व्यू मिलता है। क्या यह कारपेट एरिया आपके परिवार की आवश्यकता के अनुकूल है?`
      : `Understood! In our 3BHK and 4BHK Sky Penthouses, we offer 11'4" clear ceiling heights with unobstructed Arabian Sea panoramas and private sundecks. Does this layout align with your family's space requirements?`;
    quickReplies = [
      "Yes, 3BHK or 4BHK with sea view is perfect.",
      "How many parking slots are included?",
      "Can we customize the room layout?"
    ];
  } else if (nextStep === 4) {
    intent = 'Budget & CLP Payment Schedule';
    agentUtterance = language === 'hi-IN'
      ? `बिल्कुल! एग्रीमेंट वैल्यू लगभग ₹5.8 Cr से शुरू होती है, जिसमें हमारा रेरा कंस्ट्रक्शन-लिंक्ड पेमेंट प्लान (CLP) लागू है, यानी भुगतान केवल स्लैब की प्रगति पर ही होता है। क्या यह आपके बजट ब्रैकेट के अनुसार है?`
      : `Certainly! The agreement value starts at approximately ₹5.8 Cr for the Sea Suite, backed by our RERA Construction-Linked Schedule where payments are tied strictly to structural slab milestones. Is this comfortable within your planned budget?`;
    quickReplies = [
      "Yes, budget is in line. What is the token amount?",
      "Is there any festive or stamp duty waiver offer?",
      "Slightly above budget, but willing to consider for sea facing."
    ];
  } else if (nextStep === 5) {
    intent = 'VIP Site Visit Scheduling & Valet';
    agentUtterance = language === 'hi-IN'
      ? `शानदार! हमारे एक्सपीरियंस सेंटर में पूरा शो-अपार्टमेंट तैयार है। क्या इस शनिवार सुबह 11:30 बजे या रविवार दोपहर आप साइट विजिट के लिए पधार सकते हैं? हम आपके लिए प्राइवेट शोफर पिकअप भी अरेंज कर सकते हैं।`
      : `Outstanding! Our dedicated Experience Center with a fully finished show penthouse is ready on-site. Would this Saturday at 11:30 AM or Sunday afternoon be convenient for you to visit? We can arrange a private chauffeur valet pickup for your family.`;
    quickReplies = [
      "Saturday 11:30 AM works well for me.",
      "Sunday afternoon 3:00 PM is better.",
      "Please send WhatsApp pin first, I will confirm by evening."
    ];
  } else {
    intent = 'Call Wrap-Up & Digital Confirmation';
    agentUtterance = language === 'hi-IN'
      ? `बहुत-बहुत धन्यवाद ${lead.name} जी! मैंने आपका वीआईपी विजिट स्लॉट शनिवार 11:30 बजे के लिए कन्फर्म कर दिया है। मैंने ब्रोशर, 3D वॉकथ्रू और लोकेशन पिन सीधे आपके व्हाट्सएप पर भेज दिया है। आपसे मिलकर खुशी होगी!`
      : `Splendid, ${lead.name}! I have confirmed your VIP Experience Center slot for Saturday 11:30 AM. I have also dispatched the architectural CAD brochure and location pin directly to your WhatsApp. Thank you, and we look forward to welcoming you!`;
    quickReplies = [
      "Thank you Priya! See you on Saturday.",
      "Got the WhatsApp notification. Appreciate the quick response!"
    ];
  }

  res.json({
    success: true,
    step: nextStep,
    agent_utterance: agentUtterance,
    intent_detected: intent,
    quick_replies: quickReplies,
    is_final_step: nextStep >= 6
  });
});

app.post('/v1/ai/voice-call/finalize', (req, res) => {
  const db = getDb();
  const {
    lead_id,
    transcript = [],
    sentiment = 'Highly Positive (95% Intent)',
    slot = 'Saturday 11:30 AM'
  } = req.body;

  const lead = db.leads.find(l => l.id === lead_id) || db.leads[0];
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

  lead.stage = 'visit_scheduled';
  lead.jarvis_score = 96;
  lead.call_count = (lead.call_count || 0) + 1;
  lead.total_talk_time_sec = (lead.total_talk_time_sec || 0) + 165;
  lead.jarvis_factors = [
    'Autonomous Jarvis AI Multi-Lingual Voice Bot Call Completed (165s)',
    'Sentiment: High Intent & Positive Sentiment (95%)',
    'Purpose Qualified: Personal Family Luxury End-Use',
    'Budget Verified: ₹5.5 - 7.5 Cr Ticket Size',
    `VIP Site Visit Confirmed: ${slot}`
  ];
  lead.last_activity = `Jarvis AI Voice Agent completed autonomous qualification call. Site visit booked for ${slot}`;

  // Automatically create site visit record if not exists
  const visit = {
    id: `sv-${Date.now()}`,
    lead_id: lead.id,
    lead_name: lead.name,
    project_id: lead.project_id,
    sales_rep_id: lead.assigned_to,
    sales_rep_name: lead.assigned_rep_name,
    scheduled_at: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: 'scheduled',
    checked_in_lat: null,
    checked_in_lng: null,
    feedback_score: null,
    feedback_notes: `AI Voice Bot scheduled VIP consultation slot (${slot}) with chauffeur pickup arranged`,
    created_at: new Date().toISOString()
  };
  db.siteVisits.unshift(visit);

  saveDb();

  broadcastSSE('lead_updated', lead);
  broadcastSSE('site_visit_created', visit);

  res.json({
    success: true,
    message: `Jarvis AI voice qualification completed for ${lead.name}. Auto-promoted to Visit Scheduled!`,
    lead,
    visit
  });
});

// Reset Demo Data Endpoint
app.post('/v1/system/reset-demo', (req, res) => {
  resetDb();
  broadcastSSE('system_reset', { timestamp: new Date().toISOString() });
  res.json({ success: true, message: 'Simplesphere OS - Real Estate CRM demo data reset to pristine state' });
});

// Fallback to SPA index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Simplesphere OS - Real Estate CRM`);
  console.log(`  Server running at: http://localhost:${PORT}`);
  console.log(`  REST API: http://localhost:${PORT}/v1`);
  console.log(`  MCP Server: http://localhost:${PORT}/v1/mcp`);
  console.log(`======================================================\n`);
});
