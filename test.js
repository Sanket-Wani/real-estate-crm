// Automated Verification Test Suite for Sell.do CRM
const http = require('http');

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function runTests() {
  console.log('[TEST] Starting Simplesphere OS - Real Estate CRM Automated Verification Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Projects Matrix
    const projRes = await request('/v1/projects');
    assert(projRes.status === 200 && projRes.body.projects.length >= 2, 'GET /v1/projects returns projects list');

    const matrixRes = await request('/v1/projects/proj-solitaire/matrix');
    assert(matrixRes.status === 200 && matrixRes.body.units.length > 0, 'GET /v1/projects/:id/matrix returns units grid');

    // 2. Unit Hold Mutex (15-min lock)
    const holdRes = await request('/v1/units/unit-sol-a-102/hold', {
      method: 'POST',
      body: { user: { id: 'usr-rep-1', name: 'Priya Kulkarni' } }
    });
    assert(holdRes.status === 200 && holdRes.body.unit.status === 'held', 'POST /v1/units/:id/hold atomically reserves unit');

    // Release hold
    const releaseRes = await request('/v1/units/unit-sol-a-102/release', { method: 'POST' });
    assert(releaseRes.status === 200 && releaseRes.body.unit.status === 'available', 'POST /v1/units/:id/release frees unit');

    // 3. Dynamic Cost Sheet Calculation
    const costRes = await request('/v1/cost-sheets/calculate', {
      method: 'POST',
      body: { unit_id: 'unit-sol-a-201', discount_pct: 1.0 }
    });
    assert(costRes.status === 200 && costRes.body.cost_sheet.total_cost > 0, 'POST /v1/cost-sheets/calculate generates accurate pricing breakdown');
    assert(costRes.body.cost_sheet.statutory_charges.gst_5_pct > 0, 'Cost sheet calculates 5% GST & 6% Stamp Duty');

    // 4. Inbound Lead with Jarvis AI & Deduplication
    const newLeadRes = await request('/v1/leads', {
      method: 'POST',
      body: {
        name: 'Automated Test Buyer',
        phone: '+91 99887 76655',
        source: 'meta_ads',
        project_id: 'proj-solitaire',
        budget_min: 55000000,
        budget_max: 75000000
      }
    });
    assert(newLeadRes.status === 200 && newLeadRes.body.lead.jarvis_score > 0, 'POST /v1/leads ingests lead and computes Jarvis AI score');

    // Test Deduplication
    const dupLeadRes = await request('/v1/leads', {
      method: 'POST',
      body: {
        name: 'Automated Test Buyer',
        phone: '9988776655',
        source: 'google_ads'
      }
    });
    assert(dupLeadRes.status === 200 && dupLeadRes.body.deduplicated === true, 'POST /v1/leads detects repeat phone and merges timeline');

    // 5. Built-in MCP Server Tool Execution
    const mcpToolsRes = await request('/v1/mcp', {
      method: 'POST',
      body: { jsonrpc: '2.0', id: 1, method: 'tools/list' }
    });
    assert(mcpToolsRes.status === 200 && mcpToolsRes.body.result.tools.length >= 6, 'POST /v1/mcp tools/list returns MCP tool catalog');

    const mcpCallRes = await request('/v1/mcp', {
      method: 'POST',
      body: {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'crm_calculate_cp_brokerage',
          arguments: { agreement_value: 80000000 }
        }
      }
    });
    assert(mcpCallRes.status === 200 && mcpCallRes.body.result.content[0].text.includes('section_194h_tds_5_pct'), 'POST /v1/mcp tools/call computes Section 194H TDS');

    // 6. RERA Demand Notice Generation with 70% Escrow Account
    const demandRes = await request('/v1/bookings/bkg-301/demand-letter/mls-2');
    assert(demandRes.status === 200 && demandRes.body.demand_notice.rera_escrow_account.escrow_account_no, 'GET demand-letter returns compliant RERA 70% escrow notice');

    // 7. Snagging Management
    const snagRes = await request('/v1/snags', {
      method: 'POST',
      body: { booking_id: 'bkg-301', room: 'Balcony', category: 'Plumbing', description: 'Drain trap calibration' }
    });
    assert(snagRes.status === 200 && snagRes.body.snag.id, 'POST /v1/snags logs inspection defect');

    const resolveSnagRes = await request(`/v1/snags/${snagRes.body.snag.id}/resolve`, { method: 'PATCH' });
    assert(resolveSnagRes.status === 200 && resolveSnagRes.body.snag.status === 'resolved', 'PATCH /v1/snags/:id/resolve clears inspection defect');

    // 8. Possession Handover Certificate & Key NOC
    const nocRes = await request('/v1/bookings/bkg-301/handover-certificate');
    assert(nocRes.status === 200 && nocRes.body.certificate.defect_liability_period.guarantee_years === 5, 'GET handover-certificate generates 5-year RERA DLP guarantee');

    // 9. Dynamic Project & Tower Configurator
    const newProjRes = await request('/v1/projects', {
      method: 'POST',
      body: { name: 'Test Park Residencies', rera_id: 'P51900099999', location: 'Worli, Mumbai', base_rate_sqft: 22000 }
    });
    assert(newProjRes.status === 200 && newProjRes.body.project.id, 'POST /v1/projects registers new developer project');

    const newTowRes = await request('/v1/towers', {
      method: 'POST',
      body: { project_id: newProjRes.body.project.id, name: 'Tower X', total_floors: 5, units_per_floor: 2 }
    });
    assert(newTowRes.status === 200 && newTowRes.body.units_count === 10, 'POST /v1/towers automatically generates live unit matrix');

    // 10. Intelligent Lead Allocation & Routing Rules
    const simRes = await request('/v1/routing/simulate', {
      method: 'POST',
      body: { phone: '+971 50 1234567', project_id: 'proj-solitaire', budget_min: 60000000 }
    });
    assert(simRes.status === 200 && simRes.body.simulation.matched_rule.includes('NRI'), 'POST /v1/routing/simulate matches International NRI Desk');

    // 11. Multi-Scheme Payment Plan Engine
    const schemesRes = await request('/v1/payment-schemes');
    assert(schemesRes.status === 200 && schemesRes.body.schemes.length >= 4, 'GET /v1/payment-schemes returns CLP, TLP, Subvention, and DPP');

    const dppRes = await request('/v1/cost-sheets/calculate', {
      method: 'POST',
      body: { unit_id: 'unit-sol-a-201', discount_pct: 0, scheme_id: 'down_payment' }
    });
    assert(dppRes.status === 200 && dppRes.body.cost_sheet.scheme_rebate_pct === 8, 'Down Payment Plan applies 8% upfront rebate');

    // 12. Site Visit Chauffeur Logistics & Geofenced Attendance
    const siteVisitsRes = await request('/v1/site-visits');
    assert(siteVisitsRes.status === 200 && siteVisitsRes.body.site_visits.length >= 2, 'GET /v1/site-visits returns active visits');

    const firstSv = siteVisitsRes.body.site_visits[0];
    const geoCheckRes = await request(`/v1/site-visits/${firstSv.id}/geo-checkin`, {
      method: 'PATCH',
      body: { lat: 19.0178, lng: 72.8172 }
    });
    assert(geoCheckRes.status === 200 && geoCheckRes.body.geo_verified === true, 'PATCH /v1/site-visits/:id/geo-checkin validates geofence within 250m');

    // 13. Marketing Campaigns & Attribution Engine
    const campRes = await request('/v1/campaigns');
    assert(campRes.status === 200 && campRes.body.campaigns.length >= 5 && campRes.body.campaigns[0].cost_per_lead > 0, 'GET /v1/campaigns returns CPL, CPSV, CPB, and ROMI metrics');

    // 14. Enterprise Data Exports
    const invExportRes = await request('/v1/exports/inventory');
    assert(invExportRes.status === 200 && invExportRes.raw && invExportRes.raw.includes('Unit ID,Project,Tower'), 'GET /v1/exports/inventory generates valid CSV export');

    const clpExportRes = await request('/v1/exports/clp-collections');
    assert(clpExportRes.status === 200 && clpExportRes.raw && clpExportRes.raw.includes('Milestone ID,Booking ID'), 'GET /v1/exports/clp-collections generates RERA collections CSV');

    // 15. Omnichannel Communications & WhatsApp Drips
    const tplRes = await request('/v1/communications/templates');
    assert(tplRes.status === 200 && tplRes.body.templates.length >= 5, 'GET /v1/communications/templates returns pre-approved templates');

    const sendRes = await request('/v1/communications/send', {
      method: 'POST',
      body: { lead_id: 'lead-101', template_id: 'tpl_welcome_brochure', channel: 'whatsapp' }
    });
    assert(sendRes.status === 200 && sendRes.body.dispatch.status === 'delivered', 'POST /v1/communications/send resolves merge tags and dispatches message');

    // 16. Jarvis AI Autonomous Voice Telephony Bot (English & Hindi)
    const voiceStartRes = await request('/v1/ai/voice-call/start', {
      method: 'POST',
      body: { lead_id: 'lead-101', language: 'en-IN' }
    });
    assert(voiceStartRes.status === 200 && voiceStartRes.body.agent_utterance.includes('Priya calling from Aurum'), 'POST /v1/ai/voice-call/start initiates English voice bot');

    const voiceStartHindiRes = await request('/v1/ai/voice-call/start', {
      method: 'POST',
      body: { lead_id: 'lead-101', language: 'hi-IN' }
    });
    assert(voiceStartHindiRes.status === 200 && voiceStartHindiRes.body.agent_utterance.includes('नमस्ते'), 'POST /v1/ai/voice-call/start initiates Hindi voice bot');

    const voiceStepRes = await request('/v1/ai/voice-call/step', {
      method: 'POST',
      body: { lead_id: 'lead-101', current_step: 1, buyer_reply: 'Yes, looking for family end-use.', language: 'en-IN' }
    });
    assert(voiceStepRes.status === 200 && voiceStepRes.body.step === 2, 'POST /v1/ai/voice-call/step advances dialogue progression');

    const voiceFinalizeRes = await request('/v1/ai/voice-call/finalize', {
      method: 'POST',
      body: { lead_id: 'lead-101', slot: 'Saturday 11:30 AM' }
    });
    assert(voiceFinalizeRes.status === 200 && voiceFinalizeRes.body.lead.stage === 'visit_scheduled' && voiceFinalizeRes.body.lead.jarvis_score === 96, 'POST /v1/ai/voice-call/finalize auto-promotes lead to Visit Scheduled with 96% score');
    assert(voiceFinalizeRes.body.visit && voiceFinalizeRes.body.visit.id, 'Jarvis AI Voice finalization auto-schedules VIP Site Visit');

    // CAD Land Plotting Masterplan Module Tests
    const cadMasterplanRes = await request('/v1/cad/masterplan');
    assert(cadMasterplanRes.status === 200 && cadMasterplanRes.body.masterplan.plots.length >= 50, 'GET /v1/cad/masterplan loads plotted development township with 50+ plots');
    assert(cadMasterplanRes.body.masterplan.metadata.fileName === 'SUB-KESNAND-13.11.2025.dwg', 'CAD masterplan metadata binds to Kesnand DWG file');

    const cadHoldRes = await request('/v1/cad/plots/KES-P-001/hold', {
      method: 'POST',
      body: { buyerName: 'VIP Hold Test' }
    });
    assert(cadHoldRes.status === 200 && cadHoldRes.body.plot.status === 'held', 'POST /v1/cad/plots/:id/hold places 15-minute priority lock');

    const cadCostSheetRes = await request('/v1/cad/plots/KES-P-001/cost-sheet', {
      method: 'POST',
      body: { discountPct: 2 }
    });
    assert(cadCostSheetRes.status === 200 && cadCostSheetRes.body.costSheet.stampDutyPct === 7 && cadCostSheetRes.body.costSheet.gst === 0, 'POST /v1/cad/plots/:id/cost-sheet calculates 0% Land GST and 7% PMRDA stamp duty');

    const cadBookRes = await request('/v1/cad/plots/KES-P-001/book', {
      method: 'POST',
      body: { buyerName: 'Rohan Sharma', tokenAmount: 100000, paymentScheme: 'clp' }
    });
    assert(cadBookRes.status === 200 && cadBookRes.body.plot.status === 'booked', 'POST /v1/cad/plots/:id/book confirms token allotment');

    const cadResetRes = await request('/v1/cad/plots/KES-P-001/status', {
      method: 'PATCH',
      body: { status: 'available' }
    });
    assert(cadResetRes.status === 200 && cadResetRes.body.plot.status === 'available', 'PATCH /v1/cad/plots/:id/status resets plot availability');

    console.log(`\n======================================================`);
    console.log(`  Tests Passed: ${passed} / ${passed + failed}`);
    console.log(`  Tests Failed: ${failed}`);
    console.log(`======================================================\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test suite failed unexpectedly:', err);
    process.exit(1);
  }
}

runTests();
