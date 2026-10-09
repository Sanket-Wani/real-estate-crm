// Simplesphere OS — Homebuyer CX Experience Portal
// Implemented directly from Stitch Screen:
// "Simplesphere OS — Homebuyer Experience Portal" (stitch_cx_portal_screen.html)
// Screen ID: f2c9359404834b8ab9572bf76b3fa715
// Finexy light theme with strict zero-overlap and zero-wrapping design.

let cxActiveSubTab = 'overview'; // 'overview' or 'floorplan'

function renderCXPortal(container, state) {
  const bookings = state?.bookings || [];
  const milestones = state?.milestones || [];
  const booking = bookings[0] || {
    id: 'b-101',
    unit_number: 'A-1402',
    customer_name: 'Kabir & Rhea Mehta',
    project_name: 'The Grand Solitaire',
    agreement_value: 29655900,
    booking_date: '2025-01-14'
  };

  const bookingMilestones = milestones.filter(m => m.booking_id === booking.id);
  const paidMilestones = bookingMilestones.filter(m => m.status === 'paid');
  const progressPct = bookingMilestones.length > 0
    ? Math.round((paidMilestones.length / bookingMilestones.length) * 100)
    : 62;

  let html = `
    <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 6px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. BREADCRUMBS & META EYEBROW (from stitch_cx_portal_screen.html) -->
      <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; color: #667085; white-space: nowrap;">
        <span>Properties</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        <span>The Grand Solitaire</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        <span style="font-weight: 600; color: #111318;">Unit ${booking.unit_number}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        <span style="color: #FF5B37; font-weight: 700;">Homebuyer CX Portal</span>
      </div>

      <!-- 2. COCKPIT HEADER SECTION (from stitch_cx_portal_screen.html) -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 4px; border-bottom: 1px solid rgba(0,0,0,0.06);">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <h1 style="font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
              The Grand Solitaire — Homebuyer Experience Portal
            </h1>
            <span style="display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: #ECFDF5; color: #065F46; border: 1px solid rgba(6,95,70,0.2); white-space: nowrap;">
              Tower A Verified
            </span>
          </div>
          <p style="font-size: 13px; color: #667085; margin: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span><strong style="color: #111318;">Unit ${booking.unit_number}</strong> (3 BHK Sea Suite, 1,450 sq.ft)</span>
            <span style="color: #D0D5DD;">•</span>
            <span>Primary Allottee: <strong style="color: #111318;">${booking.customer_name}</strong></span>
            <span style="color: #D0D5DD;">•</span>
            <span style="font-family: monospace; font-size: 11.5px; background: #FFFFFF; padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.08); white-space: nowrap;">MahaRERA Reg: P51900028471</span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <button class="finexy-filter-btn" onclick="window.showToast?.('Unit ${booking.unit_number} RERA Allotment Dossier downloaded (PDF)', 'success')" style="white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download Unit Dossier (PDF)</span>
          </button>
          <button class="btn btn-coral btn-sm" onclick="window.showToast?.('Private VIP Site Inspection requested for Unit ${booking.unit_number}. Relationship Manager will call within 15 mins.', 'success')" style="white-space: nowrap; padding: 9px 16px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Schedule Site Inspection</span>
          </button>
        </div>
      </div>

      <!-- 3. TOP 4-TILE EXECUTIVE KPI ROW (Finexy signature: Coral Hero + 3 White Cards) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        
        <!-- Tile 1: Coral Hero Card -->
        <div style="background: #FF5B37; border-radius: 20px; padding: 22px; color: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; box-shadow: 0 8px 24px -4px rgba(255, 91, 55, 0.35);">
          <div style="position: absolute; right: -20px; bottom: -20px; width: 120px; height: 120px; background: rgba(255,255,255,0.12); border-radius: 50%; pointer-events: none; filter: blur(10px);"></div>
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="finexy-stat-label" style="color: rgba(255,255,255,0.85); white-space: nowrap;">TOTAL DEMAND CLEARED</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.22); display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
            <div class="finexy-stat-value" style="font-size: 32px; color: #FFFFFF; line-height: 1.1; margin-bottom: 4px; white-space: nowrap;">
              ₹1.45 Cr
            </div>
            <p style="font-size: 12px; color: rgba(255,255,255,0.85); margin: 0; white-space: nowrap;">
              100% On-Time • Allotment ${booking.unit_number}
            </p>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: space-between;">
            <span style="display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 9999px; background: rgba(255,255,255,0.2); font-size: 11px; font-weight: 700; color: #FFFFFF; white-space: nowrap;">
              <span style="width: 5px; height: 5px; border-radius: 50%; background: #FFFFFF;"></span>
              Escrow Confirmed
            </span>
            <span style="font-family: monospace; font-size: 11px; color: rgba(255,255,255,0.8); white-space: nowrap;">Axis Bank ESC-77</span>
          </div>
        </div>

        <!-- Tile 2: Construction Progress -->
        <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="finexy-stat-label" style="color: #667085; white-space: nowrap;">CONSTRUCTION PROGRESS</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #F4F5F7; display: flex; align-items: center; justify-content: center; color: #111318;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
              </div>
            </div>
            <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 6px;">
              <span class="finexy-stat-value" style="font-size: 32px; color: #111318; line-height: 1.1; white-space: nowrap;">62%</span>
              <span style="font-size: 12px; font-weight: 700; color: #065F46; white-space: nowrap;">+4% this month</span>
            </div>
            <div style="width: 100%; height: 8px; background: #EDEFF2; border-radius: 9999px; overflow: hidden; margin-bottom: 8px;">
              <div style="width: 62%; height: 100%; background: #FF5B37; border-radius: 9999px;"></div>
            </div>
            <p style="font-size: 12px; color: #667085; margin: 0; white-space: nowrap;">
              Current Stage: <strong style="color: #111318;">14th Slab Completed</strong> • Tower A
            </p>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #667085;">
            <span style="white-space: nowrap;">Target Slab 15: Nov 2026</span>
            <span style="font-weight: 700; color: #111318; white-space: nowrap;">Ahead of Schedule</span>
          </div>
        </div>

        <!-- Tile 3: Next Due Tranche -->
        <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="finexy-stat-label" style="color: #667085; white-space: nowrap;">NEXT DUE TRANCHE</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #F4F5F7; display: flex; align-items: center; justify-content: center; color: #111318;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
            </div>
            <div class="finexy-stat-value" style="font-size: 30px; color: #111318; line-height: 1.1; margin-bottom: 4px; white-space: nowrap;">
              24 Oct 2026
            </div>
            <p style="font-size: 12px; color: #667085; margin: 0; white-space: nowrap;">
              Tranche <strong style="color: #111318;">₹14.82 L</strong> for 15th Slab Casting
            </p>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between;">
            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; background: #FFFBEB; color: #92400E; font-size: 11px; font-weight: 700; white-space: nowrap;">
              Notice Sent (7 Days Grace)
            </span>
            <button class="finexy-nowrap" onclick="window.showToast?.('Opening Axis Escrow RTGS Payment Gateway for ₹14,82,795...', 'info')" style="font-size: 11px; font-weight: 700; color: #FF5B37; background: none; border: none; cursor: pointer; text-decoration: underline;">
              Pay Demand
            </button>
          </div>
        </div>

        <!-- Tile 4: Legal & KYC Status -->
        <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="finexy-stat-label" style="color: #667085; white-space: nowrap;">LEGAL & KYC STATUS</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #F4F5F7; display: flex; align-items: center; justify-content: center; color: #111318;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span class="finexy-stat-value" style="font-size: 20px; color: #111318; white-space: nowrap;">RERA Form 4 Approved</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#065F46" stroke="#065F46"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" stroke="#FFFFFF" stroke-width="2"/></svg>
            </div>
            <p style="font-size: 12px; color: #667085; margin: 0; white-space: nowrap;">
              Allotment Agreement Registered • Stamp Duty Paid
            </p>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between;">
            <span style="display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; font-size: 11px; font-weight: 700; white-space: nowrap;">
              Maharashtra IGR Verified
            </span>
            <span style="font-family: monospace; font-size: 11px; color: #667085; white-space: nowrap;">DOC-8942-B</span>
          </div>
        </div>

      </div>

      <!-- 4. NAVIGATION CAPSULE SUB-TABS (from stitch_cx_portal_screen.html) -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 12px; gap: 12px; flex-wrap: wrap;">
        <div class="finexy-capsule-track">
          <button class="finexy-capsule-btn ${cxActiveSubTab === 'overview' ? 'active' : ''}" onclick="window.switchCXSubTab('overview')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 6px;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            <span class="finexy-nowrap">Payment Milestones & Live Site Feed</span>
          </button>
          <button class="finexy-capsule-btn ${cxActiveSubTab === 'floorplan' ? 'active' : ''}" onclick="window.switchCXSubTab('floorplan')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 6px;"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <span class="finexy-nowrap">Interactive Architectural Floor Plan & 3D Walkthrough</span>
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #667085; white-space: nowrap;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981;"></span>
          <span>DigiLocker Encryption v2.4 Active</span>
        </div>
      </div>

      <!-- 5. SUB-TAB CONTENT ROUTING -->
      <div id="cx-subtab-container">
  `;

  if (cxActiveSubTab === 'floorplan') {
    html += `
        <div id="floorplan-root-mount"></div>
      </div>
    </div>
    `;
    container.innerHTML = html;
    const fpMount = document.getElementById('floorplan-root-mount');
    if (fpMount && typeof window.renderFloorPlanViewer === 'function') {
      window.renderFloorPlanViewer(fpMount);
    }
    return;
  }

  // OVERVIEW SUBTAB CONTENT (Exact 62% / 38% split from stitch_cx_portal_screen.html)
  html += `
        <div style="display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; align-items: start;">
          
          <!-- ========================================== -->
          <!-- LEFT COLUMN: LIVE CAM FEED & CLP MILESTONES -->
          <!-- ========================================== -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            
            <!-- 1. Live Construction Feed & Site Telemetry Card -->
            <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03);">
              
              <!-- Feed Card Header -->
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <h2 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                      Live Construction Feed & Site Telemetry
                    </h2>
                    <span style="display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px; border-radius: 9999px; background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; font-size: 11px; font-weight: 700; white-space: nowrap;">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background: #DC2626; animation: pulse 2s infinite;"></span>
                      Live • 11:42 AM IST
                    </span>
                  </div>
                  <p style="font-size: 12px; color: #667085; margin: 3px 0 0 0; white-space: nowrap;">
                    Camera 04 — Tower A Sea Crest (1080p Ultra-Low Latency Telemetry)
                  </p>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="finexy-filter-btn" style="padding: 6px 10px;" onclick="window.showToast?.('Feed refreshed • Camera 04 stream synced', 'info')" title="Refresh Feed">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  </button>
                  <button class="finexy-filter-btn" style="padding: 6px 10px;" onclick="window.showToast?.('Expanded to High-Definition Fullscreen Deck', 'info')" title="Fullscreen">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                  </button>
                </div>
              </div>

              <!-- High-Resolution Video/Photo Container with Telemetry Overlays -->
              <div style="position: relative; width: 100%; height: 360px; border-radius: 16px; overflow: hidden; background: #000000; box-shadow: inset 0 2px 8px rgba(0,0,0,0.4);">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPkcGv3pEJIAspQi2PieKVkKgOAD5CSOJxN7T_ER1MbC1jwMHHmgad9sApRdidXycm5CDENxbc9XuPNSDREk0uixHNJcB6JXWYmVzzg8tAcgNpMN5bk0ng8Y5J0YV6Oky1Je1M5U9-fdbJAd7HzqrPKvXteiuYEGiLCdd4vBy1HNGXa7ALrAF1cEcAGR_ifxGJHXlx_BI0p7B8p-ccPXVdIeFkLQZUZaKXEAihSkoVq30sw6RxSzAWCXTE1snubJY5SoXnryuMo5Y" 
                     alt="Live high-resolution construction view of Tower A luxury residential skyscraper" 
                     style="width: 100%; height: 100%; object-fit: cover; display: block;" />

                <!-- Gradient Vignette -->
                <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.85) 100%); pointer-events: none;"></div>

                <!-- Top Left Status Badge -->
                <div style="position: absolute; top: 14px; left: 14px;">
                  <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 9999px; background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); font-size: 11px; font-weight: 700; color: #111318; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: #FF5B37;"></span>
                    <span>Tower A • Floor 14 Deck Cam</span>
                  </div>
                </div>

                <!-- Top Right Sensor Telemetry Pills -->
                <div style="position: absolute; top: 14px; right: 14px; display: flex; align-items: center; gap: 8px;">
                  <div style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; background: rgba(0,0,0,0.65); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; font-family: monospace; font-size: 11px; white-space: nowrap;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
                    <span>Wind: 14 km/h WNW</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; background: rgba(0,0,0,0.65); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; font-family: monospace; font-size: 11px; white-space: nowrap;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
                    <span>29°C Ambient</span>
                  </div>
                </div>

                <!-- Bottom Floating Live Telemetry HUD Bar -->
                <div style="position: absolute; bottom: 14px; left: 14px; right: 14px; padding: 12px 16px; border-radius: 12px; background: rgba(17,19,24,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
                  <div style="display: flex; align-items: center; gap: 16px; font-size: 12px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/></svg>
                      <span style="color: rgba(255,255,255,0.7);">Cranes Active:</span>
                      <strong style="font-family: monospace; color: #FFFFFF;">2 Units</strong>
                    </div>
                    <div style="width: 1px; height: 14px; background: rgba(255,255,255,0.2);"></div>
                    <div style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>
                      <span style="color: rgba(255,255,255,0.7);">Workers Logged:</span>
                      <strong style="font-family: monospace; color: #FFFFFF;">184 Personnel</strong>
                    </div>
                    <div style="width: 1px; height: 14px; background: rgba(255,255,255,0.2);"></div>
                    <div style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                      <span style="color: rgba(255,255,255,0.7);">RCC Curing:</span>
                      <strong style="color: #34D399; font-family: monospace;">In Progress (Grade M50)</strong>
                    </div>
                  </div>

                  <button onclick="window.showToast?.('Camera switched to Tower A North Panorama', 'info')" style="padding: 5px 12px; border-radius: 8px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); color: #FFFFFF; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap;">
                    Preset Angles
                  </button>
                </div>
              </div>

              <!-- Mode Switcher Buttons Track -->
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); overflow-x: auto;" class="custom-scrollbar">
                <button style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 12px; background: #111318; color: #FFFFFF; font-size: 12px; font-weight: 600; border: none; cursor: pointer; white-space: nowrap;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span>Live Site Cam</span>
                </button>
                <button class="finexy-filter-btn" onclick="window.switchCXSubTab('floorplan')" style="white-space: nowrap;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  <span>360° Virtual Walkthrough</span>
                </button>
                <button class="finexy-filter-btn" onclick="window.showToast?.('Loading Autodesk Revit BIM LOD 400 3D Wireframe Model...', 'info')" style="white-space: nowrap;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                  <span>Structural BIM Model</span>
                </button>
              </div>

            </div>

            <!-- 2. Construction-Linked Milestone Progress Card (from stitch_cx_portal_screen.html) -->
            <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03);">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <h2 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                      Construction-Linked Milestone Progress
                    </h2>
                    <span style="padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; font-size: 10px; font-weight: 700; border: 1px solid #A7F3D0; white-space: nowrap;">
                      RERA Schedule VII
                    </span>
                  </div>
                  <p style="font-size: 12px; color: #667085; margin: 3px 0 0 0; white-space: nowrap;">
                    All milestone demands validated by Council of Architecture certified engineer
                  </p>
                </div>
                <div style="font-size: 12px; color: #667085; white-space: nowrap;">
                  Cleared: <strong style="color: #111318; font-family: 'Outfit', sans-serif; font-size: 14px;">₹1,48,27,950</strong> / ₹2,96,55,900
                </div>
              </div>

              <!-- Vertical Timeline Steps (from stitch_cx_portal_screen.html) -->
              <div style="display: flex; flex-direction: column; gap: 12px;">

                <!-- Stage 1: Paid -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background: #065F46; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <h4 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">Stage 1: Booking & Token (10%)</h4>
                        <span style="font-family: monospace; font-size: 10px; background: #ECFDF5; color: #065F46; padding: 1px 6px; border-radius: 4px; font-weight: 700; white-space: nowrap;">Receipt #REC-901</span>
                      </div>
                      <p style="font-size: 11.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">Completed 14 Jan 2025 • HDFC Bank Wire Confirmed</p>
                    </div>
                  </div>
                  <div style="text-align: right; white-space: nowrap;">
                    <div class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹29,65,590</div>
                    <span style="font-size: 11px; font-weight: 700; color: #065F46; display: inline-flex; align-items: center; gap: 3px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Paid In Full
                    </span>
                  </div>
                </div>

                <!-- Stage 2: Paid -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background: #065F46; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <h4 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">Stage 2: Registered Agreement (20%)</h4>
                        <span style="font-family: monospace; font-size: 10px; background: #ECFDF5; color: #065F46; padding: 1px 6px; border-radius: 4px; font-weight: 700; white-space: nowrap;">Receipt #REC-982</span>
                      </div>
                      <p style="font-size: 11.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">Completed 28 Feb 2025 • Sub-Registrar Mumbai Suburbs</p>
                    </div>
                  </div>
                  <div style="text-align: right; white-space: nowrap;">
                    <div class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹59,31,180</div>
                    <span style="font-size: 11px; font-weight: 700; color: #065F46; display: inline-flex; align-items: center; gap: 3px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Paid In Full
                    </span>
                  </div>
                </div>

                <!-- Stage 3: Paid -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background: #065F46; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <h4 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">Stage 3: Plinth Completion (10%)</h4>
                        <span style="font-family: monospace; font-size: 10px; background: #ECFDF5; color: #065F46; padding: 1px 6px; border-radius: 4px; font-weight: 700; white-space: nowrap;">Cert ARCH-992</span>
                      </div>
                      <p style="font-size: 11.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">Completed 18 May 2025 • Architect Cert ARCH-992</p>
                    </div>
                  </div>
                  <div style="text-align: right; white-space: nowrap;">
                    <div class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹29,65,590</div>
                    <span style="font-size: 11px; font-weight: 700; color: #065F46; display: inline-flex; align-items: center; gap: 3px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Paid In Full
                    </span>
                  </div>
                </div>

                <!-- Stage 4: Paid -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background: #065F46; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <h4 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">Stage 4: Slabs 1 to 14 RCC Cast (20%)</h4>
                        <span style="font-family: monospace; font-size: 10px; background: #ECFDF5; color: #065F46; padding: 1px 6px; border-radius: 4px; font-weight: 700; white-space: nowrap;">Drone Audit Passed</span>
                      </div>
                      <p style="font-size: 11.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">Completed 12 Sep 2025 • Structural Engineer Sign-off</p>
                    </div>
                  </div>
                  <div style="text-align: right; white-space: nowrap;">
                    <div class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹59,31,180</div>
                    <span style="font-size: 11px; font-weight: 700; color: #065F46; display: inline-flex; align-items: center; gap: 3px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Paid In Full
                    </span>
                  </div>
                </div>

                <!-- Stage 5: Active Current Tranche (Highlighted Coral Border from Stitch) -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-radius: 14px; background: #FFF8F6; border: 2px solid #FF5B37; box-shadow: 0 4px 16px -2px rgba(255,91,55,0.18); gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background: #FF5B37; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <span style="width: 8px; height: 8px; border-radius: 50%; background: #FFFFFF; animation: pulse 1.5s infinite;"></span>
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <h4 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 800; color: #111318; margin: 0; white-space: nowrap;">Stage 5: 15th Slab RCC Casting (5%)</h4>
                        <span style="padding: 2px 8px; border-radius: 9999px; background: #FF5B37; color: #FFFFFF; font-size: 10px; font-weight: 800; text-transform: uppercase; white-space: nowrap;">Tranche Ready</span>
                      </div>
                      <p style="font-size: 11.5px; color: #FF5B37; font-weight: 600; margin: 2px 0 0 0; white-space: nowrap;">Demand Due 24 Oct 2026 • Structural Rebar Grid Verified</p>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="text-align: right; white-space: nowrap;">
                      <div class="finexy-stat-value" style="font-size: 17px; color: #111318;">₹14,82,795</div>
                      <span style="font-size: 11px; font-weight: 700; color: #FF5B37;">Awaiting Clearance</span>
                    </div>
                    <button class="btn btn-coral btn-sm" onclick="window.showToast?.('Redirecting to Axis Bank RERA Escrow Gateway...', 'info')" style="padding: 8px 16px; white-space: nowrap;">
                      Pay Now
                    </button>
                  </div>
                </div>

                <!-- Stage 6: Upcoming -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; background: #FAFAFC; border: 1px solid rgba(0,0,0,0.04); opacity: 0.85; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background: #EDEFF2; color: #667085; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background: #9CA3AF;"></span>
                    </div>
                    <div>
                      <h4 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; color: #4B5563; margin: 0; white-space: nowrap;">Stage 6: Finishing & Glazing (15%)</h4>
                      <p style="font-size: 11.5px; color: #9CA3AF; margin: 2px 0 0 0; white-space: nowrap;">Estimated Jan 2027 • Reynaers Aluminium Glazing & VRV HVAC</p>
                    </div>
                  </div>
                  <div style="text-align: right; white-space: nowrap;">
                    <div class="finexy-stat-value" style="font-size: 15px; color: #667085;">₹44,48,385</div>
                    <span style="font-size: 11px; color: #9CA3AF;">Upcoming Milestone</span>
                  </div>
                </div>

                <!-- Stage 7: Handover -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; background: #FAFAFC; border: 1px solid rgba(0,0,0,0.04); opacity: 0.85; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background: #EDEFF2; color: #667085; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <span style="width: 6px; height: 6px; border-radius: 50%; background: #9CA3AF;"></span>
                    </div>
                    <div>
                      <h4 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; color: #4B5563; margin: 0; white-space: nowrap;">Stage 7: Handover & OC Possession (20%)</h4>
                      <p style="font-size: 11.5px; color: #9CA3AF; margin: 2px 0 0 0; white-space: nowrap;">Targeted Q4 2027 • Final Key Handover & Club Membership Activation</p>
                    </div>
                  </div>
                  <div style="text-align: right; white-space: nowrap;">
                    <div class="finexy-stat-value" style="font-size: 15px; color: #667085;">₹59,31,180</div>
                    <span style="font-size: 11px; color: #9CA3AF;">Target Q4 2027</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <!-- ========================================== -->
          <!-- RIGHT COLUMN: DOCUMENT LOCKER & RM CARD    -->
          <!-- ========================================== -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            
            <!-- 1. RERA Document Locker Card (from stitch_cx_portal_screen.html) -->
            <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03);">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <div>
                  <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                    RERA Document Locker
                  </h3>
                  <p style="font-size: 12px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
                    Statutory archives & allottee digital vault
                  </p>
                </div>
                <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 9999px; background: #EFF6FF; color: #1D4ED8; font-size: 10px; font-weight: 700; border: 1px solid #BFDBFE; white-space: nowrap;">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Encrypted DigiLocker Sync
                </span>
              </div>

              <!-- Document List -->
              <div style="display: flex; flex-direction: column; divide-y: 1px solid rgba(0,0,0,0.05);">
                
                <!-- Doc 1 -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05); gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: #FEF2F2; color: #DC2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #FEE2E2;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div style="min-width: 0;">
                      <h5 style="font-size: 13px; font-weight: 600; color: #111318; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        RERA Allotment Letter (Form 3)
                      </h5>
                      <p style="font-size: 11px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
                        PDF • 2.4 MB • Stamped & Signed
                      </p>
                    </div>
                  </div>
                  <button class="finexy-filter-btn" style="padding: 6px;" onclick="window.showToast?.('Downloading Form 3 PDF...', 'success')" title="Download PDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>

                <!-- Doc 2 -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05); gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: #FEF2F2; color: #DC2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #FEE2E2;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div style="min-width: 0;">
                      <h5 style="font-size: 13px; font-weight: 600; color: #111318; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        Tax Invoice & TDS Reconciliation
                      </h5>
                      <p style="font-size: 11px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
                        PDF • 840 KB • Paid & Verified
                      </p>
                    </div>
                  </div>
                  <button class="finexy-filter-btn" style="padding: 6px;" onclick="window.showToast?.('Downloading TDS Reconciliation Invoice...', 'success')" title="Download PDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>

                <!-- Doc 3 -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05); gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: #FEF2F2; color: #DC2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #FEE2E2;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div style="min-width: 0;">
                      <h5 style="font-size: 13px; font-weight: 600; color: #111318; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        COA Slab 14 Certificate
                      </h5>
                      <p style="font-size: 11px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
                        PDF • 1.8 MB • Ar. Rohinton Mistry
                      </p>
                    </div>
                  </div>
                  <button class="finexy-filter-btn" style="padding: 6px;" onclick="window.showToast?.('Downloading COA Architect Certificate...', 'success')" title="Download PDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>

                <!-- Doc 4 -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05); gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: #FFFBEB; color: #B45309; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #FDE68A;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                    </div>
                    <div style="min-width: 0;">
                      <h5 style="font-size: 13px; font-weight: 600; color: #111318; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        Sanctioned Floor Layout (A-1402)
                      </h5>
                      <p style="font-size: 11px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
                        CAD/PDF • 4.1 MB • Municipal Corp
                      </p>
                    </div>
                  </div>
                  <button class="finexy-filter-btn" style="padding: 6px;" onclick="window.showToast?.('Downloading Sanctioned Floor Blueprint...', 'success')" title="Download CAD/PDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>

                <!-- Doc 5 -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: #FEF2F2; color: #DC2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #FEE2E2;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div style="min-width: 0;">
                      <h5 style="font-size: 13px; font-weight: 600; color: #111318; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        Title Search & Encumbrance Report
                      </h5>
                      <p style="font-size: 11px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
                        PDF • 3.2 MB • Clear Title Legal Opinion
                      </p>
                    </div>
                  </div>
                  <button class="finexy-filter-btn" style="padding: 6px;" onclick="window.showToast?.('Downloading Legal Title Search Report...', 'success')" title="Download PDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>

              </div>

              <!-- Upload CTA -->
              <button onclick="window.showToast?.('Select DigiLocker document to upload & sign', 'info')" style="margin-top: 14px; width: 100%; padding: 10px; border-radius: 12px; border: 1.5px dashed rgba(0,0,0,0.15); background: #F8F9FA; color: #667085; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>+ Upload Custom Stamp Document</span>
              </button>

            </div>

            <!-- 2. Dedicated Relationship Manager Card (from stitch_cx_portal_screen.html) -->
            <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03);">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <div>
                  <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                    Dedicated Relationship Manager
                  </h3>
                  <p style="font-size: 12px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
                    Private Escrow & Construction Liaison
                  </p>
                </div>
                <span style="display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; font-size: 10px; font-weight: 700; border: 1px solid #A7F3D0; white-space: nowrap;">
                  <span style="width: 5px; height: 5px; border-radius: 50%; background: #10B981;"></span>
                  Online • Direct Line
                </span>
              </div>

              <!-- Profile Info Cluster -->
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
                <div style="position: relative;">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1X8hyPD3V2fqFr5_O0l_-SlktpmtFg5E5x60-D4Gs50fo77oC1krDzWfr5EeXdSNfNUPmDko84HMK19gS-gWqH6Yk_FOnPa9wbAckACYg-HHPnAIxvc9c-WYmfNMgFQmaYivqjlVC0c-MM0cYdxx09b0HRiDES7qFIphe9Wjf1CnD_SX3hKNYcO7xFPvPmtck5wb15irKQ83EHGj3TBfKvOrzOMS8GIlmZM6tZaLDBUiq64313W05Yd-RL1ZqZPe-HPKPvu7jlKc" 
                       alt="Priya Kulkarni, Senior Vice President Client Experience" 
                       style="width: 60px; height: 60px; border-radius: 16px; object-fit: cover; border: 2px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
                  <span style="position: absolute; bottom: -2px; right: -2px; width: 16px; height: 16px; border-radius: 50%; background: #10B981; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                </div>
                <div>
                  <h4 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                    Priya Kulkarni
                  </h4>
                  <p style="font-size: 12px; color: #667085; margin: 2px 0 4px 0; white-space: nowrap;">
                    Senior Vice President — Client Experience
                  </p>
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: #667085; white-space: nowrap;">
                    <span style="display: inline-flex; align-items: center; gap: 2px; color: #F59E0B; font-weight: 700;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      4.98
                    </span>
                    <span>•</span>
                    <span>9+ Yrs Simplesphere</span>
                    <span>•</span>
                    <span>142 HNI Allottees</span>
                  </div>
                </div>
              </div>

              <!-- Message Preview Note Box -->
              <div style="background: #F8F9FA; border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(0,0,0,0.04); margin-bottom: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #667085; margin-bottom: 4px;">
                  <span style="font-weight: 700; color: #111318; display: inline-flex; align-items: center; gap: 4px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5B37" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Latest Update Note
                  </span>
                  <span>Today 10:15 AM</span>
                </div>
                <p style="font-size: 12px; color: #374151; font-style: italic; margin: 0; line-height: 1.5;">
                  "Hi Kabir, the 14th slab structural audit has just cleared. Let me know if you would like me to arrange private access for the Sunday drone review!"
                </p>
              </div>

              <!-- Contact Actions -->
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button class="btn btn-coral" onclick="window.showToast?.('Opening encrypted private chat with Priya Kulkarni...', 'info')" style="width: 100%; justify-content: center; padding: 10px; font-size: 12.5px; white-space: nowrap;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span>Start Instant Chat</span>
                </button>
                <button class="finexy-filter-btn" onclick="window.showToast?.('Calling Direct: +91 98201 44920 (Priya Kulkarni, SVP CX)...', 'info')" style="width: 100%; justify-content: center; padding: 10px; font-size: 12.5px; white-space: nowrap;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>Call Direct (+91 98201 44920)</span>
                </button>
                <button class="finexy-filter-btn" onclick="window.showToast?.('Opening calendar for VIP Private Site Walkthrough reservation...', 'info')" style="width: 100%; justify-content: center; padding: 10px; font-size: 12.5px; white-space: nowrap;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>Book In-Person Site Walkthrough</span>
                </button>
              </div>

              <!-- Escrow Guarantee Footer Note -->
              <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #667085;">
                <span style="display: inline-flex; align-items: center; gap: 4px; color: #065F46; font-weight: 600; white-space: nowrap;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#065F46" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  MahaRERA Escrow Protected
                </span>
                <span style="font-family: monospace; white-space: nowrap;">Ref: AP-1402-ESC</span>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;
}

window.switchCXSubTab = function(subTab) {
  cxActiveSubTab = subTab;
  const mainContent = document.getElementById('main-content');
  if (mainContent && window.store?.state) {
    renderCXPortal(mainContent, window.store.state);
  }
};
