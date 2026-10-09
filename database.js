const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

let db = null;

function generateSeedData() {
  const orgId = 'org-aurum-01';
  
  const users = [
    { id: 'usr-admin-1', org_id: orgId, name: 'Vikram Malhotra', email: 'vikram@aurumrealty.com', role: 'admin', phone: '+91 98201 11223' },
    { id: 'usr-vp-1', org_id: orgId, name: 'Ananya Sharma', email: 'ananya@aurumrealty.com', role: 'vp_sales', phone: '+91 98202 22334' },
    { id: 'usr-tl-1', org_id: orgId, name: 'Rohan Deshmukh', email: 'rohan@aurumrealty.com', role: 'team_lead', phone: '+91 98203 33445' },
    { id: 'usr-rep-1', org_id: orgId, name: 'Priya Kulkarni', email: 'priya@aurumrealty.com', role: 'sales_rep', phone: '+91 98204 44556' },
    { id: 'usr-rep-2', org_id: orgId, name: 'Amit Verma', email: 'amit@aurumrealty.com', role: 'sales_rep', phone: '+91 98205 55667' },
    { id: 'usr-post-1', org_id: orgId, name: 'Sneha Patel', email: 'sneha@aurumrealty.com', role: 'post_sales', phone: '+91 98206 66778' },
    { id: 'usr-cp-1', org_id: orgId, name: 'Rajesh Gupta (CP)', email: 'rajesh@primerealty.in', role: 'cp_broker', phone: '+91 98207 77889' },
    { id: 'usr-buyer-1', org_id: orgId, name: 'Arjun Singhania', email: 'arjun.singhania@gmail.com', role: 'homebuyer', phone: '+91 98199 88776' }
  ];

  const projects = [
    {
      id: 'proj-solitaire',
      org_id: orgId,
      name: 'The Grand Solitaire',
      rera_id: 'P51900028471',
      location: 'Worli Sea Face, Mumbai',
      city: 'Mumbai',
      latitude: 19.0178,
      longitude: 72.8172,
      total_units: 32,
      base_rate_sqft: 28500,
      description: 'Ultra-luxury sea-facing 3BHK & 4BHK residences with private elevator access, infinity clubhouse, and RERA certified milestones.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'proj-aurelia',
      org_id: orgId,
      name: 'Aurelia Greenfields',
      rera_id: 'PRM/KA/RERA/1251/446/PR/201201',
      location: 'Whitefield Main Road, Bengaluru',
      city: 'Bengaluru',
      latitude: 12.9716,
      longitude: 77.7499,
      total_units: 36,
      base_rate_sqft: 9200,
      description: 'Sustainable IGBC Gold certified 2BHK & 3BHK smart homes surrounded by 75% landscaped greenery and tech corridor access.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const towers = [
    { id: 'tow-sol-a', project_id: 'proj-solitaire', name: 'Tower A (Sea Crest)', total_floors: 8, units_per_floor: 2 },
    { id: 'tow-sol-b', project_id: 'proj-solitaire', name: 'Tower B (Ocean Azure)', total_floors: 8, units_per_floor: 2 },
    { id: 'tow-aur-a', project_id: 'proj-aurelia', name: 'Wing Alpha', total_floors: 6, units_per_floor: 3 },
    { id: 'tow-aur-b', project_id: 'proj-aurelia', name: 'Wing Beta', total_floors: 6, units_per_floor: 3 }
  ];

  const units = [];
  
  // Tower A Solitaire (Worli)
  for (let f = 1; f <= 8; f++) {
    const isHighFloor = f >= 6;
    units.push({
      id: `unit-sol-a-${f}01`,
      tower_id: 'tow-sol-a',
      project_id: 'proj-solitaire',
      unit_number: `A-${f}01`,
      floor_number: f,
      configuration: '3BHK Sea Suite',
      carpet_area: 1450,
      super_built_up_area: 1950,
      facing: 'Arabian Sea (West)',
      base_price: 28500,
      floor_rise_rate: 150,
      plc_rate: 1200,
      status: f === 1 ? 'sold' : f === 2 ? 'booked' : f === 4 ? 'held' : 'available',
      held_by_user_id: f === 4 ? 'usr-rep-1' : null,
      held_by_name: f === 4 ? 'Priya Kulkarni' : null,
      held_until: f === 4 ? new Date(Date.now() + 12 * 60 * 1000).toISOString() : null,
      parking_slots: 2,
      parking_cost: 800000
    });
    units.push({
      id: `unit-sol-a-${f}02`,
      tower_id: 'tow-sol-a',
      project_id: 'proj-solitaire',
      unit_number: `A-${f}02`,
      floor_number: f,
      configuration: '4BHK Sky Penthouse',
      carpet_area: 2150,
      super_built_up_area: 2900,
      facing: 'Sea View & Skyline (North-West)',
      base_price: 31000,
      floor_rise_rate: 200,
      plc_rate: 1800,
      status: f === 3 ? 'booked' : f === 7 ? 'sold' : 'available',
      held_by_user_id: null,
      held_by_name: null,
      held_until: null,
      parking_slots: 3,
      parking_cost: 1200000
    });
  }

  // Tower B Solitaire (Worli)
  for (let f = 1; f <= 8; f++) {
    units.push({
      id: `unit-sol-b-${f}01`,
      tower_id: 'tow-sol-b',
      project_id: 'proj-solitaire',
      unit_number: `B-${f}01`,
      floor_number: f,
      configuration: '3BHK Sea Suite',
      carpet_area: 1420,
      super_built_up_area: 1920,
      facing: 'Sea View (West)',
      base_price: 28500,
      floor_rise_rate: 150,
      plc_rate: 1000,
      status: f === 5 ? 'held' : 'available',
      held_by_user_id: f === 5 ? 'usr-rep-2' : null,
      held_by_name: f === 5 ? 'Amit Verma' : null,
      held_until: f === 5 ? new Date(Date.now() + 8 * 60 * 1000).toISOString() : null,
      parking_slots: 2,
      parking_cost: 800000
    });
    units.push({
      id: `unit-sol-b-${f}02`,
      tower_id: 'tow-sol-b',
      project_id: 'proj-solitaire',
      unit_number: `B-${f}02`,
      floor_number: f,
      configuration: '3.5BHK Horizon',
      carpet_area: 1780,
      super_built_up_area: 2400,
      facing: 'Clubhouse & Sea (South-West)',
      base_price: 29500,
      floor_rise_rate: 175,
      plc_rate: 1100,
      status: f === 2 ? 'sold' : 'available',
      held_by_user_id: null,
      held_by_name: null,
      held_until: null,
      parking_slots: 2,
      parking_cost: 800000
    });
  }

  // Wing Alpha Aurelia (Bengaluru)
  for (let f = 1; f <= 6; f++) {
    units.push({
      id: `unit-aur-a-${f}01`,
      tower_id: 'tow-aur-a',
      project_id: 'proj-aurelia',
      unit_number: `A-${f}01`,
      floor_number: f,
      configuration: '2BHK Comfort',
      carpet_area: 840,
      super_built_up_area: 1140,
      facing: 'East (Morning Sunlight)',
      base_price: 9200,
      floor_rise_rate: 60,
      plc_rate: 300,
      status: f === 1 ? 'sold' : f === 3 ? 'booked' : 'available',
      held_by_user_id: null,
      held_by_name: null,
      held_until: null,
      parking_slots: 1,
      parking_cost: 350000
    });
    units.push({
      id: `unit-aur-a-${f}02`,
      tower_id: 'tow-aur-a',
      project_id: 'proj-aurelia',
      unit_number: `A-${f}02`,
      floor_number: f,
      configuration: '2.5BHK Luxe',
      carpet_area: 1020,
      super_built_up_area: 1380,
      facing: 'Garden Facing (North)',
      base_price: 9400,
      floor_rise_rate: 60,
      plc_rate: 450,
      status: 'available',
      held_by_user_id: null,
      held_by_name: null,
      held_until: null,
      parking_slots: 1,
      parking_cost: 350000
    });
    units.push({
      id: `unit-aur-a-${f}03`,
      tower_id: 'tow-aur-a',
      project_id: 'proj-aurelia',
      unit_number: `A-${f}03`,
      floor_number: f,
      configuration: '3BHK Royale',
      carpet_area: 1280,
      super_built_up_area: 1720,
      facing: 'Central Boulevard (East)',
      base_price: 9600,
      floor_rise_rate: 75,
      plc_rate: 500,
      status: f === 2 ? 'booked' : 'available',
      held_by_user_id: null,
      held_by_name: null,
      held_until: null,
      parking_slots: 1,
      parking_cost: 350000
    });
  }

  // Wing Beta Aurelia (Bengaluru)
  for (let f = 1; f <= 6; f++) {
    units.push({
      id: `unit-aur-b-${f}01`,
      tower_id: 'tow-aur-b',
      project_id: 'proj-aurelia',
      unit_number: `B-${f}01`,
      floor_number: f,
      configuration: '2BHK Comfort',
      carpet_area: 840,
      super_built_up_area: 1140,
      facing: 'North-East',
      base_price: 9200,
      floor_rise_rate: 60,
      plc_rate: 300,
      status: 'available',
      held_by_user_id: null,
      held_by_name: null,
      held_until: null,
      parking_slots: 1,
      parking_cost: 350000
    });
    units.push({
      id: `unit-aur-b-${f}02`,
      tower_id: 'tow-aur-b',
      project_id: 'proj-aurelia',
      unit_number: `B-${f}02`,
      floor_number: f,
      configuration: '3BHK Royale',
      carpet_area: 1280,
      super_built_up_area: 1720,
      facing: 'Swimming Pool (West)',
      base_price: 9600,
      floor_rise_rate: 75,
      plc_rate: 550,
      status: f === 4 ? 'held' : 'available',
      held_by_user_id: f === 4 ? 'usr-rep-1' : null,
      held_by_name: f === 4 ? 'Priya Kulkarni' : null,
      held_until: f === 4 ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : null,
      parking_slots: 1,
      parking_cost: 350000
    });
    units.push({
      id: `unit-aur-b-${f}03`,
      tower_id: 'tow-aur-b',
      project_id: 'proj-aurelia',
      unit_number: `B-${f}03`,
      floor_number: f,
      configuration: '3BHK Royale',
      carpet_area: 1310,
      super_built_up_area: 1770,
      facing: 'Boulevard & Clubhouse',
      base_price: 9600,
      floor_rise_rate: 75,
      plc_rate: 550,
      status: 'available',
      held_by_user_id: null,
      held_by_name: null,
      held_until: null,
      parking_slots: 1,
      parking_cost: 350000
    });
  }

  const channelPartners = [
    {
      id: 'cp-prime',
      org_id: orgId,
      firm_name: 'Prime Realty Advisors LLP',
      rera_number: 'A51900012938',
      contact_name: 'Rajesh Gupta',
      phone: '+91 98207 77889',
      email: 'rajesh@primerealty.in',
      pan: 'AAACP1234D',
      gstin: '27AAACP1234D1Z5',
      bank_ifsc: 'HDFC0000123',
      bank_account_no: '50200019283746',
      status: 'approved',
      current_slab: 'Slab 2 (2.5%)',
      commission_slab_pct: 2.5,
      total_bookings: 5,
      total_brokerage_earned: 4250000,
      brokerage_paid: 3400000,
      brokerage_pending: 850000,
      created_at: '2026-01-15T10:00:00.000Z'
    },
    {
      id: 'cp-knight',
      org_id: orgId,
      firm_name: 'Apex Prop Consultancy',
      rera_number: 'A51900088219',
      contact_name: 'Suresh Menon',
      phone: '+91 98333 44556',
      email: 'suresh@apexprop.com',
      pan: 'BBBCP5678E',
      gstin: '27BBBCP5678E1Z9',
      bank_ifsc: 'ICIC0000456',
      bank_account_no: '001205009812',
      status: 'approved',
      current_slab: 'Slab 1 (2.0%)',
      commission_slab_pct: 2.0,
      total_bookings: 2,
      total_brokerage_earned: 1680000,
      brokerage_paid: 1200000,
      brokerage_pending: 480000,
      created_at: '2026-02-10T11:30:00.000Z'
    },
    {
      id: 'cp-metro',
      org_id: orgId,
      firm_name: 'Urban Nest Associates',
      rera_number: 'A51900044552',
      contact_name: 'Deepak Rao',
      phone: '+91 98450 12345',
      email: 'deepak@urbannest.in',
      pan: 'CCCCP9988F',
      gstin: null,
      bank_ifsc: 'SBIN0001122',
      bank_account_no: '30291827364',
      status: 'pending_kyc',
      current_slab: 'Slab 1 (2.0%)',
      commission_slab_pct: 2.0,
      total_bookings: 0,
      total_brokerage_earned: 0,
      brokerage_paid: 0,
      brokerage_pending: 0,
      created_at: '2026-04-01T09:15:00.000Z'
    }
  ];

  const leads = [
    {
      id: 'lead-101',
      org_id: orgId,
      project_id: 'proj-solitaire',
      project_name: 'The Grand Solitaire',
      assigned_to: 'usr-rep-1',
      assigned_rep_name: 'Priya Kulkarni',
      channel_partner_id: null,
      name: 'Dr. Siddharth Nambiar',
      phone: '+91 98210 54321',
      email: 'dr.siddharth@lilavati.org',
      source: '99acres',
      campaign_id: '99acres_Worli_Luxury_Q3',
      budget_min: 50000000,
      budget_max: 70000000,
      preferred_config: '3BHK Sea Suite',
      stage: 'negotiation',
      lost_reason: null,
      jarvis_score: 92,
      jarvis_factors: [
        'Budget matches 3BHK Sea Suite ticket size (₹5.8 Cr)',
        'Downloaded brochure within 90 seconds of portal inquiry',
        'Completed 42-minute physical site visit with spouse',
        'Requested stamp duty waiver quote'
      ],
      first_response_due_at: new Date(Date.now() - 3600000).toISOString(),
      sla_breached: false,
      call_count: 4,
      total_talk_time_sec: 1420,
      last_activity: 'Cost Sheet v2 generated with 1% discount',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'lead-102',
      org_id: orgId,
      project_id: 'proj-solitaire',
      project_name: 'The Grand Solitaire',
      assigned_to: 'usr-rep-2',
      assigned_rep_name: 'Amit Verma',
      channel_partner_id: 'cp-prime',
      channel_partner_name: 'Prime Realty Advisors LLP',
      name: 'Arjun Singhania',
      phone: '+91 98199 88776',
      email: 'arjun.singhania@gmail.com',
      source: 'cp',
      campaign_id: 'CP_VIP_Worli_Club',
      budget_min: 80000000,
      budget_max: 110000000,
      preferred_config: '4BHK Sky Penthouse',
      stage: 'booking_initiated',
      lost_reason: null,
      jarvis_score: 98,
      jarvis_factors: [
        'High Net Worth Individual (MD of FinTech unicorn)',
        'Registered by Top Tier CP (Prime Realty Advisors)',
        'Token cheque ₹25,00,000 received for Unit A-702',
        'KYC verified via Aadhaar OTP'
      ],
      first_response_due_at: new Date(Date.now() - 86400000).toISOString(),
      sla_breached: false,
      call_count: 6,
      total_talk_time_sec: 2100,
      last_activity: 'Booking form drafted & Token acknowledged',
      created_at: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: 'lead-103',
      org_id: orgId,
      project_id: 'proj-aurelia',
      project_name: 'Aurelia Greenfields',
      assigned_to: 'usr-rep-1',
      assigned_rep_name: 'Priya Kulkarni',
      channel_partner_id: null,
      name: 'Meera Iyer',
      phone: '+91 98451 98765',
      email: 'meera.iyer@microsoft.com',
      source: 'meta_ads',
      campaign_id: 'Meta_Whitefield_IT_Professionals',
      budget_min: 12000000,
      budget_max: 16000000,
      preferred_config: '3BHK Royale',
      stage: 'visit_scheduled',
      lost_reason: null,
      jarvis_score: 84,
      jarvis_factors: [
        'Confirmed Saturday 11:30 AM site visit slot',
        'Geo-location: Microsoft Campus, Bengaluru (8km away)',
        'High engagement on WhatsApp video walkthrough'
      ],
      first_response_due_at: new Date(Date.now() - 14400000).toISOString(),
      sla_breached: false,
      call_count: 2,
      total_talk_time_sec: 480,
      last_activity: 'Site visit confirmed for 11th Oct',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'lead-104',
      org_id: orgId,
      project_id: 'proj-aurelia',
      project_name: 'Aurelia Greenfields',
      assigned_to: 'usr-rep-2',
      assigned_rep_name: 'Amit Verma',
      channel_partner_id: null,
      name: 'Rakesh Bansal',
      phone: '+91 98101 23456',
      email: 'rakesh.b@rediffmail.com',
      source: 'magicbricks',
      campaign_id: 'MagicBricks_Bangalore_East',
      budget_min: 9000000,
      budget_max: 11000000,
      preferred_config: '2BHK Comfort',
      stage: 'new',
      lost_reason: null,
      jarvis_score: 65,
      jarvis_factors: [
        'Fresh portal inquiry received 8 minutes ago',
        'Budget aligns with 2BHK Comfort Base inventory',
        'SLA clock ticking: 1st response due within 7 mins'
      ],
      first_response_due_at: new Date(Date.now() + 7 * 60 * 1000).toISOString(),
      sla_breached: false,
      call_count: 0,
      total_talk_time_sec: 0,
      last_activity: 'Lead received from MagicBricks webhook',
      created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString()
    },
    {
      id: 'lead-105',
      org_id: orgId,
      project_id: 'proj-solitaire',
      project_name: 'The Grand Solitaire',
      assigned_to: 'usr-rep-1',
      assigned_rep_name: 'Priya Kulkarni',
      channel_partner_id: 'cp-knight',
      channel_partner_name: 'Apex Prop Consultancy',
      name: 'Nikhil Kashyap',
      phone: '+91 98200 44332',
      email: 'nikhil.k@investcapital.com',
      source: 'google_ads',
      campaign_id: 'Google_Search_Worli_Flats',
      budget_min: 45000000,
      budget_max: 60000000,
      preferred_config: '3BHK Sea Suite',
      stage: 'contacted',
      lost_reason: null,
      jarvis_score: 72,
      jarvis_factors: [
        'First call connected; buyer requested virtual tour link',
        'NRI investor based in Dubai visiting Mumbai next week'
      ],
      first_response_due_at: new Date(Date.now() - 1800000).toISOString(),
      sla_breached: false,
      call_count: 1,
      total_talk_time_sec: 320,
      last_activity: 'Introductory call logged with brochure sent on WhatsApp',
      created_at: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      id: 'lead-106',
      org_id: orgId,
      project_id: 'proj-aurelia',
      project_name: 'Aurelia Greenfields',
      assigned_to: 'usr-rep-2',
      assigned_rep_name: 'Amit Verma',
      channel_partner_id: null,
      name: 'Tanvi Agarwal',
      phone: '+91 98860 11223',
      email: 'tanvi.agarwal@gmail.com',
      source: 'housing',
      campaign_id: 'Housing_Q3_Festive',
      budget_min: 8000000,
      budget_max: 9500000,
      preferred_config: '2BHK Comfort',
      stage: 'lost',
      lost_reason: 'Budget mismatch - looking for ready possession under ₹80L',
      jarvis_score: 28,
      jarvis_factors: [
        'Budget below project threshold',
        'Urgent possession required within 30 days'
      ],
      first_response_due_at: new Date(Date.now() - 86400000).toISOString(),
      sla_breached: false,
      call_count: 2,
      total_talk_time_sec: 260,
      last_activity: 'Marked Closed Lost: Budget & Timeline mismatch',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString()
    }
  ];

  const siteVisits = [
    {
      id: 'sv-201',
      lead_id: 'lead-101',
      lead_name: 'Dr. Siddharth Nambiar',
      project_id: 'proj-solitaire',
      sales_rep_id: 'usr-rep-1',
      sales_rep_name: 'Priya Kulkarni',
      scheduled_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'completed',
      checked_in_lat: 19.0178,
      checked_in_lng: 72.8172,
      feedback_score: 5,
      feedback_notes: 'Buyer loved Tower A 4th floor sea view. Discussed parking slots and stamp duty rebate.',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'sv-202',
      lead_id: 'lead-103',
      lead_name: 'Meera Iyer',
      project_id: 'proj-aurelia',
      sales_rep_id: 'usr-rep-1',
      sales_rep_name: 'Priya Kulkarni',
      scheduled_at: new Date(Date.now() + 2 * 86400000).toISOString(),
      status: 'scheduled',
      checked_in_lat: null,
      checked_in_lng: null,
      feedback_score: null,
      feedback_notes: 'Scheduled for upcoming Saturday 11:30 AM with site pickup arranged.',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ];

  const bookings = [
    {
      id: 'bkg-301',
      lead_id: 'lead-102',
      customer_name: 'Arjun Singhania',
      customer_email: 'arjun.singhania@gmail.com',
      customer_phone: '+91 98199 88776',
      unit_id: 'unit-sol-a-702',
      unit_number: 'A-702',
      project_id: 'proj-solitaire',
      project_name: 'The Grand Solitaire',
      booked_by_user_id: 'usr-rep-2',
      booked_by_name: 'Amit Verma',
      channel_partner_id: 'cp-prime',
      channel_partner_name: 'Prime Realty Advisors LLP',
      booking_date: '2026-09-28',
      agreement_value: 94850000,
      total_cost: 104250000,
      token_amount: 2500000,
      booking_status: 'active',
      payment_plan: 'Construction-Linked Plan (CLP)',
      created_at: '2026-09-28T14:30:00.000Z'
    }
  ];

  const paymentMilestones = [
    {
      id: 'mls-1',
      booking_id: 'bkg-301',
      milestone_name: 'Booking Token & Application',
      milestone_percentage: 10,
      amount_due: 9485000,
      due_date: '2026-09-28',
      architect_cert_ref: 'ARCH-CERT-INIT',
      is_triggered: true,
      demand_notice_sent_at: '2026-09-28T15:00:00.000Z',
      amount_paid: 9485000,
      status: 'paid'
    },
    {
      id: 'mls-2',
      booking_id: 'bkg-301',
      milestone_name: 'Completion of Plinth Level',
      milestone_percentage: 15,
      amount_due: 14227500,
      due_date: '2026-10-15',
      architect_cert_ref: 'ARCH-CERT-PLINTH-A',
      is_triggered: true,
      demand_notice_sent_at: '2026-10-02T10:00:00.000Z',
      amount_paid: 14227500,
      status: 'paid'
    },
    {
      id: 'mls-3',
      booking_id: 'bkg-301',
      milestone_name: 'Casting of 4th RCC Slab',
      milestone_percentage: 10,
      amount_due: 9485000,
      due_date: '2026-11-20',
      architect_cert_ref: 'ARCH-CERT-SLAB4-A',
      is_triggered: true,
      demand_notice_sent_at: '2026-10-08T09:00:00.000Z',
      amount_paid: 0,
      status: 'demanded'
    },
    {
      id: 'mls-4',
      booking_id: 'bkg-301',
      milestone_name: 'Casting of Top Terrace Slab',
      milestone_percentage: 15,
      amount_due: 14227500,
      due_date: '2027-01-30',
      architect_cert_ref: null,
      is_triggered: false,
      demand_notice_sent_at: null,
      amount_paid: 0,
      status: 'pending'
    },
    {
      id: 'mls-5',
      booking_id: 'bkg-301',
      milestone_name: 'Completion of Brickwork & MEP',
      milestone_percentage: 20,
      amount_due: 18970000,
      due_date: '2027-04-15',
      architect_cert_ref: null,
      is_triggered: false,
      demand_notice_sent_at: null,
      amount_paid: 0,
      status: 'pending'
    },
    {
      id: 'mls-6',
      booking_id: 'bkg-301',
      milestone_name: 'Flooring, Painting & Snag Handover',
      milestone_percentage: 20,
      amount_due: 18970000,
      due_date: '2027-08-30',
      architect_cert_ref: null,
      is_triggered: false,
      demand_notice_sent_at: null,
      amount_paid: 0,
      status: 'pending'
    },
    {
      id: 'mls-7',
      booking_id: 'bkg-301',
      milestone_name: 'Occupancy Certificate & Possession',
      milestone_percentage: 10,
      amount_due: 9485000,
      due_date: '2027-11-15',
      architect_cert_ref: null,
      is_triggered: false,
      demand_notice_sent_at: null,
      amount_paid: 0,
      status: 'pending'
    }
  ];

  const customerPayments = [
    {
      id: 'pay-501',
      booking_id: 'bkg-301',
      milestone_id: 'mls-1',
      milestone_name: 'Booking Token & Application',
      amount_paid: 9485000,
      payment_mode: 'gateway_razorpay',
      transaction_ref: 'rzp_pay_9981247',
      verified_by: 'usr-post-1',
      receipt_number: 'REC-2026-0089',
      payment_date: '2026-09-28'
    },
    {
      id: 'pay-502',
      booking_id: 'bkg-301',
      milestone_id: 'mls-2',
      milestone_name: 'Completion of Plinth Level',
      amount_paid: 14227500,
      payment_mode: 'rtgs',
      transaction_ref: 'HDFCR52026100599182',
      verified_by: 'usr-post-1',
      receipt_number: 'REC-2026-0104',
      payment_date: '2026-10-05'
    }
  ];

  const snags = [
    {
      id: 'sng-1',
      booking_id: 'bkg-301',
      room: 'Master Bedroom',
      category: 'Carpentry',
      description: 'Minor silicone sealant gap on balcony glass slider',
      status: 'in_progress',
      reported_at: '2026-10-01T11:00:00.000Z'
    },
    {
      id: 'sng-2',
      booking_id: 'bkg-301',
      room: 'Living Room',
      category: 'Electrical',
      description: 'Dimmer switch calibration needed for cove ceiling LED',
      status: 'resolved',
      reported_at: '2026-10-01T11:20:00.000Z'
    }
  ];

  const commThreads = [
    {
      lead_id: 'lead-101',
      channel: 'whatsapp',
      messages: [
        { sender: 'system', text: 'Hello Dr. Siddharth Nambiar, thank you for your interest in The Grand Solitaire, Worli. Here is the brochure: https://aurumrealty.com/brochures/solitaire.pdf', time: '2026-10-06T10:00:00.000Z' },
        { sender: 'lead', text: 'Thank you. Is Unit A-401 still available? What is the current floor rise scheme?', time: '2026-10-06T10:14:00.000Z' },
        { sender: 'agent', text: 'Yes Doctor! Unit A-401 is available. Floor rise is ₹150/sqft per floor. I can share the tailored cost sheet with payment schedule.', time: '2026-10-06T10:16:00.000Z' },
        { sender: 'lead', text: 'Please send across the cost sheet.', time: '2026-10-06T10:20:00.000Z' }
      ]
    },
    {
      lead_id: 'lead-103',
      channel: 'whatsapp',
      messages: [
        { sender: 'system', text: 'Hi Meera, welcome to Aurelia Greenfields! We have confirmed your visit for Saturday 11:30 AM.', time: '2026-10-08T14:00:00.000Z' },
        { sender: 'lead', text: 'Can you share Google Maps location pin and parking instructions?', time: '2026-10-08T14:10:00.000Z' },
        { sender: 'agent', text: 'Location pin: https://maps.google.com/?q=12.9716,77.5946. Valet parking is available at the Experience Center.', time: '2026-10-08T14:12:00.000Z' }
      ]
    }
  ];

  const irisWarRoom = {
    launch_name: 'The Grand Solitaire - Phase 2 Sea Crest Launch',
    launch_status: 'live',
    queue_tokens: [
      { token: 'T-001', visitor: 'Mr. Cyrus Poonawalla Rep', desk: 'Desk 1 (Priya K)', status: 'served', unit_allocated: 'A-501' },
      { token: 'T-002', visitor: 'Mrs. Ritu Singhal', desk: 'Desk 2 (Amit V)', status: 'in_consultation', unit_allocated: null },
      { token: 'T-003', visitor: 'Mr. Vivek Goenka', desk: 'Waiting Lounge', status: 'waiting', unit_allocated: null },
      { token: 'T-004', visitor: 'Mr. Harsh Mariwala Rep', desk: 'Waiting Lounge', status: 'waiting', unit_allocated: null }
    ]
  };

  const campaigns = [
    {
      id: 'camp-101',
      name: 'Worli Sea Face Luxury Launch (Google Search Ads)',
      channel: 'google_search',
      source: 'google_ads',
      medium: 'cpc',
      utm_campaign: 'worli_luxury_launch',
      budget: 1200000,
      spend: 940000,
      impressions: 450000,
      clicks: 18500,
      leads_generated: 240,
      site_visits: 38,
      bookings: 4,
      revenue_booked: 324000000,
      target_project_id: 'proj-solitaire',
      status: 'active'
    },
    {
      id: 'camp-102',
      name: 'Aurelia Smart Green Homes (Meta Lead Gen)',
      channel: 'meta_ads',
      source: 'meta_ads',
      medium: 'paid_social',
      utm_campaign: 'aurelia_green_diwali',
      budget: 800000,
      spend: 620000,
      impressions: 890000,
      clicks: 31200,
      leads_generated: 410,
      site_visits: 52,
      bookings: 6,
      revenue_booked: 108000000,
      target_project_id: 'proj-aurelia',
      status: 'active'
    },
    {
      id: 'camp-103',
      name: '99Acres Premium Builder Spotlight',
      channel: 'real_estate_portal',
      source: '99acres',
      medium: 'portal_featured',
      utm_campaign: 'solitaire_spotlight',
      budget: 500000,
      spend: 500000,
      impressions: 210000,
      clicks: 8400,
      leads_generated: 95,
      site_visits: 14,
      bookings: 2,
      revenue_booked: 78000000,
      target_project_id: 'proj-solitaire',
      status: 'active'
    },
    {
      id: 'camp-104',
      name: 'MagicBricks Verified Platinum Showcase',
      channel: 'real_estate_portal',
      source: 'magicbricks',
      medium: 'portal_banner',
      utm_campaign: 'aurelia_verified',
      budget: 450000,
      spend: 450000,
      impressions: 180000,
      clicks: 7600,
      leads_generated: 82,
      site_visits: 11,
      bookings: 1,
      revenue_booked: 39000000,
      target_project_id: 'proj-aurelia',
      status: 'active'
    },
    {
      id: 'camp-105',
      name: 'Prime Channel Partner Exclusive Conclave',
      channel: 'channel_partner',
      source: 'cp',
      medium: 'affiliate_partner',
      utm_campaign: 'cp_conclave_q3',
      budget: 350000,
      spend: 320000,
      impressions: 12000,
      clicks: 4200,
      leads_generated: 64,
      site_visits: 22,
      bookings: 3,
      revenue_booked: 162000000,
      target_project_id: 'proj-solitaire',
      status: 'active'
    }
  ];

  const routingConfig = {
    mode: 'smart_rules',
    rules: [
      {
        id: 'rule-nri',
        name: 'International & NRI Desk Routing',
        description: 'Direct international dialing prefixes (+1, +971, +65, +44, +966) to Senior NRI Desk',
        enabled: true,
        priority: 1,
        condition: 'is_nri',
        assigned_to_user_id: 'usr-vp-1',
        assigned_to_name: 'Ananya Sharma (VP Sales / NRI Desk)'
      },
      {
        id: 'rule-hnw',
        name: 'Ultra-HNW Segment (> ₹5 Cr)',
        description: 'Leads with budget >= 50,000,000 assigned to Team Lead Closer',
        enabled: true,
        priority: 2,
        condition: 'budget_gte_50m',
        assigned_to_user_id: 'usr-tl-1',
        assigned_to_name: 'Rohan Deshmukh (Team Lead Closer)'
      },
      {
        id: 'rule-cp',
        name: 'Channel Partner Dedicated Desk',
        description: 'Leads originating through certified RERA brokers assigned to CP Specialist',
        enabled: true,
        priority: 3,
        condition: 'source_is_cp',
        assigned_to_user_id: 'usr-tl-1',
        assigned_to_name: 'Rohan Deshmukh (CP Relations)'
      },
      {
        id: 'rule-project-mumbai',
        name: 'Worli Mumbai Project Affinity',
        description: 'The Grand Solitaire leads assigned to Mumbai Sales Specialist',
        enabled: true,
        priority: 4,
        condition: 'project_solitaire',
        assigned_to_user_id: 'usr-rep-1',
        assigned_to_name: 'Priya Kulkarni (Mumbai Luxury Rep)'
      },
      {
        id: 'rule-project-blr',
        name: 'Bengaluru Tech Corridor Affinity',
        description: 'Aurelia Greenfields leads assigned to Bengaluru Sales Specialist',
        enabled: true,
        priority: 5,
        condition: 'project_aurelia',
        assigned_to_user_id: 'usr-rep-2',
        assigned_to_name: 'Amit Verma (Bengaluru Rep)'
      }
    ],
    agentWorkloads: [
      { user_id: 'usr-rep-1', name: 'Priya Kulkarni', on_duty: true, max_capacity: 15, current_active: 8 },
      { user_id: 'usr-rep-2', name: 'Amit Verma', on_duty: true, max_capacity: 15, current_active: 6 },
      { user_id: 'usr-tl-1', name: 'Rohan Deshmukh', on_duty: true, max_capacity: 20, current_active: 4 },
      { user_id: 'usr-vp-1', name: 'Ananya Sharma', on_duty: true, max_capacity: 10, current_active: 3 }
    ]
  };

  const communicationTemplates = [
    {
      id: 'tpl_welcome_brochure',
      name: 'Instant WhatsApp Brochure & Master Plan',
      channel: 'whatsapp',
      subject: 'Welcome to {{project_name}} by Aurum Crest Developers',
      body: 'Namaste {{lead_name}},\n\nThank you for your interest in {{project_name}}! Here is your private access link to our RERA-approved digital brochure and interactive 3D floor plans:\n\nLink: https://aurumrealty.com/brochures/{{project_id}}\n\nYour dedicated property relationship manager is {{assigned_rep_name}} ({{assigned_rep_phone}}). Please feel free to reply directly to this message to coordinate a private site viewing.',
      trigger_event: 'lead_created'
    },
    {
      id: 'tpl_site_visit_pass',
      name: 'VIP Site Visit Pass & Chauffeur Directions',
      channel: 'whatsapp',
      subject: 'Confirmed: VIP Site Visit at {{project_name}}',
      body: 'Dear {{lead_name}},\n\nYour site visit appointment at {{project_name}} is confirmed for {{scheduled_time}}.\n\n• Experience Lounge Location: {{project_location}}\n• Navigation Pin: https://maps.google.com/?q={{project_lat}},{{project_lng}}\n• Chauffeur Status: {{chauffeur_status}} (Vehicle: {{vehicle_number}})\n\nValet parking is reserved under your name. Looking forward to welcoming you!',
      trigger_event: 'site_visit_scheduled'
    },
    {
      id: 'tpl_cost_sheet_quotation',
      name: 'Official Unit Cost Sheet Quotation',
      channel: 'email',
      subject: 'Official Quotation & Pricing Summary: Unit {{unit_number}} at {{project_name}}',
      body: 'Dear {{lead_name}},\n\nThank you for reviewing Unit {{unit_number}} at {{project_name}}.\n\nSummary Breakdown:\n- Carpet Area: {{carpet_area}} sq.ft.\n- Base Rate: ₹{{base_rate_sqft}}/sq.ft.\n- Agreement Value: ₹{{agreement_value_cr}} Cr\n- Statutory Charges (GST 5% + Stamp Duty 6%): Included in schedule\n- Selected Payment Scheme: {{payment_scheme}}\n\nThis pricing quotation is valid for 7 calendar days under RERA inventory reservation rules.',
      trigger_event: 'cost_sheet_issued'
    },
    {
      id: 'tpl_demand_notice',
      name: 'RERA Milestone Demand Notice (70% Escrow)',
      channel: 'email',
      subject: 'RERA Demand Notice for Unit {{unit_number}} - {{milestone_name}}',
      body: 'Dear {{buyer_name}},\n\nAs certified by the Project Architect under RERA Section 4(2)(l)(D), milestone {{milestone_name}} has been achieved for {{project_name}}.\n\n- Net Amount Due: ₹{{demand_amount}}\n- Due Date: {{due_date}}\n- Designated RERA 70% Escrow Account: {{escrow_account}}\n- Bank IFSC: {{bank_ifsc}}\n\nKindly initiate RTGS/NEFT payment to the designated escrow account or use our online collection link.',
      trigger_event: 'demand_raised'
    },
    {
      id: 'tpl_possession_noc',
      name: 'Possession NOC & Key Handover Certificate',
      channel: 'whatsapp',
      subject: 'Welcome Home! Possession & Key Handover for Unit {{unit_number}}',
      body: 'Heartiest Congratulations {{buyer_name}}!\n\nAll financial clearances and statutory OC inspections have been fulfilled. Unit {{unit_number}} at {{project_name}} is ready for possession.\n\n• 4 Sets of Master Keys Issued\n• 5-Year Structural Defect Liability Guarantee active under RERA Section 14(3).\n\nWelcome to the Aurum Crest family!',
      trigger_event: 'possession_completed'
    }
  ];

  const paymentSchemes = [
    {
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
    },
    {
      id: 'tlp',
      name: 'Time-Linked Plan (TLP)',
      tagline: 'Predictable calendar tranches regardless of construction speed',
      discount_pct: 0,
      milestones: [
        { name: 'Booking Token / Advance', pct: 10, trigger: 'Immediate' },
        { name: 'Tranche 1 (Agreement)', pct: 15, trigger: 'Within 45 Days' },
        { name: 'Tranche 2', pct: 15, trigger: 'Within 90 Days' },
        { name: 'Tranche 3', pct: 20, trigger: 'Within 180 Days' },
        { name: 'Tranche 4', pct: 20, trigger: 'Within 270 Days' },
        { name: 'Tranche 5 (Possession)', pct: 20, trigger: 'On Possession & OC' }
      ]
    },
    {
      id: 'flexi_20_80',
      name: 'Flexi / 20:80 Subvention Scheme',
      tagline: 'Pay 20% now, balance 80% on Possession (Developer Subvention)',
      discount_pct: 0,
      milestones: [
        { name: 'Booking Token', pct: 10, trigger: 'Immediate upon booking' },
        { name: 'Agreement Signing (Self Funding)', pct: 10, trigger: 'Within 30 Days' },
        { name: 'Balance Tranche on Intimation of Possession', pct: 80, trigger: 'Notice of Possession / Bank Loan Disbursement' }
      ]
    },
    {
      id: 'down_payment',
      name: 'Down Payment Plan (DPP) - 8% Instant Rebate',
      tagline: 'Pay 95% upfront and receive 8% instant cash discount on Agreement Value',
      discount_pct: 8,
      milestones: [
        { name: 'Booking Token', pct: 10, trigger: 'Immediate' },
        { name: 'Lump Sum Tranche (Upfront 8% Rebate Applied)', pct: 85, trigger: 'Within 30 Days of Booking' },
        { name: 'Balance on Possession & Key Handover', pct: 5, trigger: 'Notice of Possession & OC' }
      ]
    }
  ];

  return {
    organization: { id: orgId, name: 'Aurum Crest Developers', rera_id: 'RERA-MUMBAI-CORP-2026' },
    users,
    projects,
    towers,
    units,
    channelPartners,
    leads,
    siteVisits,
    bookings,
    paymentMilestones,
    customerPayments,
    snags,
    commThreads,
    irisWarRoom,
    campaigns,
    routingConfig,
    communicationTemplates,
    paymentSchemes
  };
}

function ensureNewCollections(data) {
  const seed = generateSeedData();
  let changed = false;
  if (!data.campaigns) { data.campaigns = seed.campaigns; changed = true; }
  if (!data.routingConfig) { data.routingConfig = seed.routingConfig; changed = true; }
  if (!data.communicationTemplates) { data.communicationTemplates = seed.communicationTemplates; changed = true; }
  if (!data.paymentSchemes) { data.paymentSchemes = seed.paymentSchemes; changed = true; }

  // Ensure project coordinates
  if (data.projects) {
    data.projects.forEach(p => {
      if (p.id === 'proj-solitaire' && !p.latitude) {
        p.latitude = 19.0178;
        p.longitude = 72.8172;
        changed = true;
      }
      if (p.id === 'proj-aurelia' && !p.latitude) {
        p.latitude = 12.9716;
        p.longitude = 77.7499;
        changed = true;
      }
    });
  }

  // Ensure site visit records have pickup/chauffeur details if missing
  if (data.siteVisits) {
    data.siteVisits.forEach(v => {
      if (!v.pickup_type) {
        v.pickup_type = 'chauffeur';
        v.pickup_address = 'Bandra West, Mumbai';
        v.chauffeur_status = v.status === 'completed' ? 'dropped' : 'driver_assigned';
        v.chauffeur_driver = 'Ramesh Rathod (+91 98334 11223)';
        v.chauffeur_vehicle = 'Toyota Camry Hybrid (MH-01-EQ-4422)';
        changed = true;
      }
    });
  }

  if (changed) saveDb();
}

function initDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(raw);
      ensureNewCollections(db);
      checkExpiredHolds();
      return db;
    } catch (e) {
      console.warn('Could not parse db.json, generating fresh seed data...');
    }
  }
  
  db = generateSeedData();
  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function checkExpiredHolds() {
  if (!db || !db.units) return;
  const now = new Date();
  let changed = false;
  db.units.forEach(u => {
    if (u.status === 'held' && u.held_until) {
      if (new Date(u.held_until) <= now) {
        u.status = 'available';
        u.held_by_user_id = null;
        u.held_by_name = null;
        u.held_until = null;
        changed = true;
      }
    }
  });
  if (changed) saveDb();
}

// Check every 30 seconds for expired holds
const holdInterval = setInterval(checkExpiredHolds, 30000);
if (holdInterval.unref) holdInterval.unref();

module.exports = {
  getDb: () => {
    if (!db) initDb();
    return db;
  },
  saveDb,
  checkExpiredHolds,
  resetDb: () => {
    db = generateSeedData();
    saveDb();
    return db;
  }
};
