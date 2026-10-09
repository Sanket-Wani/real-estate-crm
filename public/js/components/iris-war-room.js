// Simplesphere OS — IRIS Launch War Room & Live Deal Floor
// Implemented directly from Stitch Screen:
// "Simplesphere OS — IRIS Launch War Room & Live Deal Floor" (stitch_iris_war_room_screen.html)
// Screen ID: 5feb6ec092ae45ad8c97f87c90b1ae12
// Finexy light theme with strict zero-overlap and zero-wrapping design.

window._warRoomFilter = window._warRoomFilter || 'all';

function renderIrisWarRoom(container, state) {
  const warRoom = state?.irisWarRoom || {
    launch_name: 'The Aquaria — Phase 1 Launch Stage',
    launch_status: 'live',
    queue_tokens: []
  };

  const inventory = warRoom.inventory || {
    total: 60,
    available: 22,
    held: 4,
    booked: 38
  };

  const queueTokens = warRoom.war_room?.queue_tokens || warRoom.queue_tokens || [];

  let html = `
    <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 6px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. BREADCRUMBS & META EYEBROW (from stitch_iris_war_room_screen.html) -->
      <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #667085; white-space: nowrap;">
        <span>Pipelines</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        <span>Launch Operations</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        <span style="color: #111318; font-weight: 700;">IRIS Live War Room</span>
      </div>

      <!-- 2. COCKPIT HEADER SECTION (from stitch_iris_war_room_screen.html) -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 4px; border-bottom: 1px solid rgba(0,0,0,0.06);">
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 4px; flex-wrap: wrap;">
            <h1 style="font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
              IRIS Launch War Room & Live Deal Floor
            </h1>
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 12px; border-radius: 9999px; background: #ECFDF5; border: 1px solid rgba(16,185,129,0.3); white-space: nowrap;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #10B981; animation: pulse 1.5s infinite;"></span>
              <span style="font-size: 11.5px; font-weight: 700; color: #065F46;">Live Floor Stream Active • Sub-second Sync</span>
            </div>
          </div>
          <p style="font-size: 13px; color: #667085; margin: 0; white-space: nowrap;">
            High-frequency telemetry for Phase 1 launch day allotments, real-time inventory locking, broker referrals, and dynamic pricing triggers.
          </p>
        </div>

        <!-- Header Actions Cluster -->
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <button class="finexy-filter-btn" onclick="window.showToast?.('Gong sounded! Launch floor booking alert dispatched to all screens.', 'success')" style="white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span>Sound Floor Gong</span>
          </button>
          <button class="finexy-filter-btn" onclick="window.showToast?.('Run-rate launch telemetry report generated (PDF)', 'info')" style="white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>Download Run-Rate PDF</span>
          </button>
          <button class="btn btn-coral btn-sm" onclick="window.openIssueTokenModal()" style="white-space: nowrap; padding: 9px 16px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>+ Fast Track EOI Token</span>
          </button>
        </div>
      </div>

      <!-- 3. TOP 4-TILE EXECUTIVE KPI ROW (from stitch_iris_war_room_screen.html) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        
        <!-- Tile 1: Signature Coral Hero -->
        <div style="background: #FF5B37; border-radius: 20px; padding: 22px; color: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; box-shadow: 0 8px 24px -4px rgba(255, 91, 55, 0.35);">
          <div style="position: absolute; right: -20px; bottom: -20px; width: 120px; height: 120px; background: rgba(255,255,255,0.12); border-radius: 50%; pointer-events: none; filter: blur(10px);"></div>
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="finexy-stat-label" style="color: rgba(255,255,255,0.85); white-space: nowrap;">LAUNCH DAY GROSS BOOKINGS</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div class="finexy-stat-value" style="font-size: 34px; color: #FFFFFF; line-height: 1.1; margin-bottom: 6px; white-space: nowrap;">
              ₹28.5 Cr
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(255,255,255,0.9); white-space: nowrap;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></span>
              <span>14 Units Locked in 4 Hours</span>
            </div>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: rgba(255,255,255,0.85);">
            <span style="white-space: nowrap;">Phase 1 Quota</span>
            <strong style="color: #FFFFFF; white-space: nowrap;">82% Achieved</strong>
          </div>
        </div>

        <!-- Tile 2: Live Walk-In Footfall -->
        <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="finexy-stat-label" style="color: #667085; white-space: nowrap;">LIVE WALK-IN FOOTFALL</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #F4F5F7; display: flex; align-items: center; justify-content: center; color: #111318;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
            <div class="finexy-stat-value" style="font-size: 32px; color: #111318; line-height: 1.1; margin-bottom: 4px; white-space: nowrap;">
              142 HNIs
            </div>
            <p style="font-size: 12px; color: #667085; margin: 0; white-space: nowrap;">
              High-Net-Worth Visitors on Site (Capacity: 85%)
            </p>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between;">
            <span style="display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; font-size: 11px; font-weight: 700; white-space: nowrap;">
              <span style="width: 5px; height: 5px; border-radius: 50%; background: #10B981;"></span>
              Geofence Active
            </span>
            <span style="font-size: 11px; color: #667085; white-space: nowrap;">Haversine 250m</span>
          </div>
        </div>

        <!-- Tile 3: Average Token Velocity -->
        <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="finexy-stat-label" style="color: #667085; white-space: nowrap;">AVERAGE TOKEN VELOCITY</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #F4F5F7; display: flex; align-items: center; justify-content: center; color: #111318;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
            <div class="finexy-stat-value" style="font-size: 32px; color: #111318; line-height: 1.1; margin-bottom: 4px; white-space: nowrap;">
              18.2 min
            </div>
            <p style="font-size: 12px; color: #667085; margin: 0; white-space: nowrap;">
              Per EOI Expression of Interest (-4.1m vs Target)
            </p>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between;">
            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; background: #FFFBEB; color: #B45309; font-size: 11px; font-weight: 700; white-space: nowrap;">
              High Velocity Peak
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #065F46; white-space: nowrap;">-22.5% Latency</span>
          </div>
        </div>

        <!-- Tile 4: Real-Time Inventory Absorption -->
        <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="finexy-stat-label" style="color: #667085; white-space: nowrap;">REAL-TIME INVENTORY ABSORPTION</span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #F4F5F7; display: flex; align-items: center; justify-content: center; color: #111318;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              </div>
            </div>
            <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px;">
              <span class="finexy-stat-value" style="font-size: 32px; color: #111318; line-height: 1.1; white-space: nowrap;">${inventory.booked}</span>
              <span style="font-size: 18px; color: #667085; font-weight: 500; white-space: nowrap;">/ ${inventory.total} Units</span>
            </div>
            <div style="width: 100%; height: 8px; background: #EDEFF2; border-radius: 9999px; overflow: hidden; margin-bottom: 8px;">
              <div style="width: 63.3%; height: 100%; background: #FF5B37; border-radius: 9999px;"></div>
            </div>
          </div>
          <div style="padding-top: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: #667085;">
            <span style="white-space: nowrap;">63.3% Committed & Staged</span>
            <strong style="color: #111318; white-space: nowrap;">${inventory.available} Units Available</strong>
          </div>
        </div>

      </div>

      <!-- 4. PROJECT SHOWCASE STRIP (from stitch_iris_war_room_screen.html) -->
      <div style="background: #FFFFFF; border-radius: 20px; padding: 16px 20px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
          <div style="position: relative; width: 110px; height: 75px; border-radius: 12px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.08);">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPvP5ld_caxj3U9btYF8KIGpGM_Q4rahpXZokbAJ_iqsh27KQYQXwrvRdq5xF7fzyMhzDeraZmdaPJRSjtfz1cF28X3m6ojAYyUn_gejxMP8EOYNXIa3f-AzMOveQn4M3lYERdXWrDqhPWJJHKyHpOJCBosyAKLkspADahiuXdl-dIKvnF4WlHpeCh0Ag-cuEAOLGBAuZHQ0uFYa9yueEzGOqYWkOdqdhtJEl6zM57BcNQQfQ7hr7byy4Mm-hHzWTUtNy9-8tqRIs" 
                 alt="The Aquaria luxury development site aerial view" 
                 style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            <div style="position: absolute; top: 6px; left: 6px; padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); font-size: 9px; font-weight: 700; color: #FFFFFF; white-space: nowrap;">
              TOWER A & B
            </div>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                THE AQUARIA — Phase 1 Launch Stage
              </h3>
              <span style="padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; font-size: 10px; font-weight: 700; white-space: nowrap;">
                RERA Registered
              </span>
            </div>
            <p style="font-size: 12px; color: #667085; margin: 3px 0 0 0; white-space: nowrap;">
              Bandra-Worli Coastal Vista • Super-luxury 2.5BHK, 3BHK, 3.5BHK & Sky Penthouses
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
          <div style="text-align: right; white-space: nowrap;">
            <span class="finexy-stat-label" style="color: #667085; display: block; font-size: 10px;">BASE LAUNCH RATE</span>
            <span class="finexy-stat-value" style="font-size: 16px; color: #111318;">₹48,500 / sq.ft</span>
          </div>
          <div style="text-align: right; white-space: nowrap;">
            <span class="finexy-stat-label" style="color: #667085; display: block; font-size: 10px;">STAGE STATUS</span>
            <span style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #FF5B37;">Cast Floor 14 of 28</span>
          </div>
          <button class="finexy-filter-btn" onclick="window.store.setTab('inventory')" style="white-space: nowrap;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Floor Architect Map</span>
          </button>
        </div>
      </div>

      <!-- 5. MAIN SPLIT LAYOUT (60% Left Deal Floor Feed / 40% Right Dynamic Insights) -->
      <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; align-items: start;">
        
        <!-- ============================================== -->
        <!-- LEFT COLUMN: LIVE DEAL FLOOR STREAM (60%)       -->
        <!-- ============================================== -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          
          <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03);">
            
            <!-- Stream Header & Filters -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.06); flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: #FF5B37; animation: pulse 1.5s infinite;"></span>
                  <h2 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                    Live Deal Floor Feed
                  </h2>
                </div>
                <p style="font-size: 12px; color: #667085; margin: 3px 0 0 0; white-space: nowrap;">
                  Real-Time Transaction & Inventory Locking Stream
                </p>
              </div>

              <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; background: #F4F5F7; font-size: 11px; color: #667085; white-space: nowrap;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5B37" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                <span>Floor Sync: 0.4s</span>
              </div>
            </div>

            <!-- Filter Segment Chips Track (from stitch_iris_war_room_screen.html) -->
            <div style="display: flex; align-items: center; gap: 8px; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.04); overflow-x: auto;" class="custom-scrollbar">
              <button class="finexy-capsule-btn ${window._warRoomFilter === 'all' ? 'active' : ''}" onclick="window._warRoomFilter='all'; window.store.loadIrisWarRoom();" style="white-space: nowrap;">
                All Events (38)
              </button>
              <button class="finexy-capsule-btn ${window._warRoomFilter === 'tokens' ? 'active' : ''}" onclick="window._warRoomFilter='tokens'; window.store.loadIrisWarRoom();" style="white-space: nowrap;">
                Tokens Cleared
              </button>
              <button class="finexy-capsule-btn ${window._warRoomFilter === 'locks' ? 'active' : ''}" onclick="window._warRoomFilter='locks'; window.store.loadIrisWarRoom();" style="white-space: nowrap;">
                Unit Locks
              </button>
              <button class="finexy-capsule-btn ${window._warRoomFilter === 'brokers' ? 'active' : ''}" onclick="window._warRoomFilter='brokers'; window.store.loadIrisWarRoom();" style="white-space: nowrap;">
                Broker Referrals
              </button>
              <button class="finexy-capsule-btn ${window._warRoomFilter === 'escrow' ? 'active' : ''}" onclick="window._warRoomFilter='escrow'; window.store.loadIrisWarRoom();" style="white-space: nowrap;">
                Escrow Verified
              </button>
            </div>

            <!-- Real-Time Stream Event List -->
            <div style="display: flex; flex-direction: column; divide-y: 1px solid rgba(0,0,0,0.04); max-height: 600px; overflow-y: auto;" class="custom-scrollbar">
              
              <!-- Event 1: Penthouse Deal (from stitch_iris_war_room_screen.html) -->
              <div style="padding: 16px 8px; border-bottom: 1px solid rgba(0,0,0,0.04); display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;">
                <div style="display: flex; align-items: flex-start; gap: 12px; min-width: 0;">
                  <div style="width: 38px; height: 38px; border-radius: 12px; background: #FFF1EE; border: 1px solid rgba(255,91,55,0.25); display: flex; align-items: center; justify-content: center; color: #FF5B37; flex-shrink: 0; margin-top: 2px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #111318; white-space: nowrap;">Unit A-1402</span>
                      <span style="font-size: 13px; color: #667085; white-space: nowrap;">4BHK Sky Penthouse</span>
                      <span class="finexy-stat-value" style="font-size: 15px; color: #FF5B37;">₹9.57 Cr</span>
                      <span style="padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; font-size: 11px; font-weight: 700; white-space: nowrap;">
                        Token Cleared (₹25L RTGS Escrow)
                      </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-top: 8px; font-size: 12px; color: #667085;">
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">ALLOTTEE</span>
                        <strong style="color: #111318; white-space: nowrap;">Dr. Kabir & Rhea Mehta</strong>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">SALES DESK</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Priya Kulkarni</span>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">CHANNEL PARTNER</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Prime Realty Advisors (2.5%)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="text-align: right; white-space: nowrap;">
                  <span style="font-size: 11px; color: #9CA3AF; display: block;">2 mins ago</span>
                  <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; color: #065F46; margin-top: 4px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Verified
                  </span>
                </div>
              </div>

              <!-- Event 2: Unit Staged Lock (from stitch_iris_war_room_screen.html) -->
              <div style="padding: 16px 8px; border-bottom: 1px solid rgba(0,0,0,0.04); display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;">
                <div style="display: flex; align-items: flex-start; gap: 12px; min-width: 0;">
                  <div style="width: 38px; height: 38px; border-radius: 12px; background: #FFFBEB; border: 1px solid #FDE68A; display: flex; align-items: center; justify-content: center; color: #B45309; flex-shrink: 0; margin-top: 2px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #111318; white-space: nowrap;">Unit B-1104</span>
                      <span style="font-size: 13px; color: #667085; white-space: nowrap;">3.5BHK Crest</span>
                      <span class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹7.20 Cr</span>
                      <span style="padding: 2px 8px; border-radius: 9999px; background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; font-size: 11px; font-weight: 700; white-space: nowrap;">
                        Unit Staged (15m Lock Active)
                      </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-top: 8px; font-size: 12px; color: #667085;">
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">ALLOTTEE</span>
                        <strong style="color: #111318; white-space: nowrap;">Ananya Vardhan</strong>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">SALES DESK</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Vikram Malhotra</span>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">CHANNEL PARTNER</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Direct Inbound Desk</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="text-align: right; white-space: nowrap;">
                  <span style="font-size: 11px; color: #9CA3AF; display: block;">7 mins ago</span>
                  <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; color: #B45309; margin-top: 4px;">
                    Expires in 08:14
                  </span>
                </div>
              </div>

              <!-- Event 3: RERA Allotment Signed (from stitch_iris_war_room_screen.html) -->
              <div style="padding: 16px 8px; border-bottom: 1px solid rgba(0,0,0,0.04); display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;">
                <div style="display: flex; align-items: flex-start; gap: 12px; min-width: 0;">
                  <div style="width: 38px; height: 38px; border-radius: 12px; background: #EFF6FF; border: 1px solid #BFDBFE; display: flex; align-items: center; justify-content: center; color: #1D4ED8; flex-shrink: 0; margin-top: 2px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #111318; white-space: nowrap;">Unit A-0902</span>
                      <span style="font-size: 13px; color: #667085; white-space: nowrap;">3BHK Sea Suite</span>
                      <span class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹6.45 Cr</span>
                      <span style="padding: 2px 8px; border-radius: 9999px; background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; font-size: 11px; font-weight: 700; white-space: nowrap;">
                        RERA Allotment Signed
                      </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-top: 8px; font-size: 12px; color: #667085;">
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">ALLOTTEE</span>
                        <strong style="color: #111318; white-space: nowrap;">Sunil Mittal & Co</strong>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">SALES DESK</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Ananya Sharma</span>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">CHANNEL PARTNER</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Apex Prop Consultancy</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="text-align: right; white-space: nowrap;">
                  <span style="font-size: 11px; color: #9CA3AF; display: block;">14 mins ago</span>
                  <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; color: #1D4ED8; margin-top: 4px;">
                    Digital Seal Attached
                  </span>
                </div>
              </div>

              <!-- Event 4: Token Cleared (from stitch_iris_war_room_screen.html) -->
              <div style="padding: 16px 8px; border-bottom: 1px solid rgba(0,0,0,0.04); display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;">
                <div style="display: flex; align-items: flex-start; gap: 12px; min-width: 0;">
                  <div style="width: 38px; height: 38px; border-radius: 12px; background: #FFF1EE; border: 1px solid rgba(255,91,55,0.25); display: flex; align-items: center; justify-content: center; color: #FF5B37; flex-shrink: 0; margin-top: 2px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #111318; white-space: nowrap;">Unit B-0801</span>
                      <span style="font-size: 13px; color: #667085; white-space: nowrap;">3BHK Bay View</span>
                      <span class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹5.85 Cr</span>
                      <span style="padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; font-size: 11px; font-weight: 700; white-space: nowrap;">
                        Token Cleared (₹25L Escrow)
                      </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-top: 8px; font-size: 12px; color: #667085;">
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">ALLOTTEE</span>
                        <strong style="color: #111318; white-space: nowrap;">Rajesh Nadar</strong>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">SALES DESK</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Priya Kulkarni</span>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">CHANNEL PARTNER</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Prime Realty Advisors</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="text-align: right; white-space: nowrap;">
                  <span style="font-size: 11px; color: #9CA3AF; display: block;">21 mins ago</span>
                  <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; color: #065F46; margin-top: 4px;">
                    Escrow Ack #7749
                  </span>
                </div>
              </div>

              <!-- Event 5: Token Cleared (from stitch_iris_war_room_screen.html) -->
              <div style="padding: 16px 8px; display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;">
                <div style="display: flex; align-items: flex-start; gap: 12px; min-width: 0;">
                  <div style="width: 38px; height: 38px; border-radius: 12px; background: #FFF1EE; border: 1px solid rgba(255,91,55,0.25); display: flex; align-items: center; justify-content: center; color: #FF5B37; flex-shrink: 0; margin-top: 2px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #111318; white-space: nowrap;">Unit A-0704</span>
                      <span style="font-size: 13px; color: #667085; white-space: nowrap;">2.5BHK Urban</span>
                      <span class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹4.80 Cr</span>
                      <span style="padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; font-size: 11px; font-weight: 700; white-space: nowrap;">
                        Token Cleared
                      </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-top: 8px; font-size: 12px; color: #667085;">
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">ALLOTTEE</span>
                        <strong style="color: #111318; white-space: nowrap;">Devika Rastogi</strong>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">SALES DESK</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Rohit Sen</span>
                      </div>
                      <div>
                        <span class="finexy-stat-label" style="display: block; font-size: 9px; color: #9CA3AF;">CHANNEL PARTNER</span>
                        <span style="color: #111318; font-weight: 500; white-space: nowrap;">Urban Nest Associates</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="text-align: right; white-space: nowrap;">
                  <span style="font-size: 11px; color: #9CA3AF; display: block;">29 mins ago</span>
                  <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; color: #065F46; margin-top: 4px;">
                    Escrow Ack #7741
                  </span>
                </div>
              </div>

            </div>

            <!-- Floor Live Feed Footer Bar -->
            <div style="padding-top: 14px; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #667085;">
              <span style="white-space: nowrap;">Showing recent 5 of 38 events</span>
              <button onclick="window.showToast?.('All 38 live floor telemetry events exported to audit buffer', 'info')" style="background: none; border: none; color: #FF5B37; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                <span>Expand Complete Telemetry Log</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>

          </div>

        </div>

        <!-- ============================================== -->
        <!-- RIGHT COLUMN: DYNAMIC PRICING & LEADERBOARD    -->
        <!-- ============================================== -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          
          <!-- CARD 1: REAL-TIME DYNAMIC PRICE RISE TRIGGER (from stitch_iris_war_room_screen.html) -->
          <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span class="finexy-stat-label" style="color: #667085; white-space: nowrap;">ALGORITHMIC YIELD CONTROLLER</span>
              <span style="padding: 2px 8px; border-radius: 9999px; background: #FFF1EE; color: #FF5B37; font-size: 11px; font-weight: 700; border: 1px solid rgba(255,91,55,0.3); white-space: nowrap;">
                Imminent Hike
              </span>
            </div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 700; color: #111318; margin: 0 0 4px 0; white-space: nowrap;">
              Real-Time Phase 1 Price Rise Trigger
            </h3>
            <p style="font-size: 12px; color: #667085; margin: 0 0 16px 0; white-space: nowrap;">
              Automated floor price threshold based on velocity run-rate.
            </p>

            <!-- Alert Highlight Box -->
            <div style="background: linear-gradient(135deg, #FFF8F6 0%, #FFFFFF 100%); border-radius: 14px; padding: 16px; border: 1px solid rgba(255,91,55,0.25); margin-bottom: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 12px; font-weight: 700; color: #9A3412; white-space: nowrap;">Next Price Escalation: At 40 Bookings</span>
                <span class="finexy-stat-value" style="font-size: 14px; color: #FF5B37; white-space: nowrap;">38 / 40 Reached</span>
              </div>
              <p style="font-size: 13px; color: #111318; font-weight: 600; margin: 0 0 10px 0; white-space: nowrap;">
                +₹500/sq.ft hike incoming in <strong style="color: #FF5B37;">2 bookings!</strong>
              </p>
              
              <!-- Progress Visualization (95% to threshold) -->
              <div style="width: 100%; height: 8px; background: rgba(255,91,55,0.15); border-radius: 9999px; overflow: hidden; margin-bottom: 6px;">
                <div style="width: 95%; height: 100%; background: #FF5B37; border-radius: 9999px;"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #667085; white-space: nowrap;">
                <span>0 Bookings (Base)</span>
                <span style="font-weight: 700; color: #FF5B37;">95% of Target Limit</span>
                <span>40 Threshold</span>
              </div>
            </div>

            <!-- Projected Gain Metrics -->
            <div style="background: #F8F9FA; border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(0,0,0,0.04); margin-bottom: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 12px; color: #667085; white-space: nowrap;">Projected Incremental Gain:</span>
                <span class="finexy-stat-value" style="font-size: 16px; color: #065F46; white-space: nowrap;">+₹4.20 Cr</span>
              </div>
              <p style="font-size: 11px; color: #667085; margin: 4px 0 0 0; line-height: 1.4;">
                Applied automatically across remaining 22 Phase 1 units immediately upon trigger.
              </p>
            </div>

            <button class="btn btn-secondary" onclick="window.store.setTab('cost-sheets')" style="width: 100%; justify-content: center; padding: 10px; font-size: 12.5px; white-space: nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
              <span>Preview Adjusted Cost Sheets</span>
            </button>
          </div>

          <!-- CARD 2: ACTIVE SALES DESK LEADERBOARD (from stitch_iris_war_room_screen.html) -->
          <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <h3 style="font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                Active Sales Desk Leaderboard
              </h3>
              <span style="padding: 2px 8px; border-radius: 9999px; background: #EDEFF2; color: #4B5563; font-size: 10px; font-weight: 700; white-space: nowrap;">
                Target: ₹35 Cr Quota
              </span>
            </div>
            <p style="font-size: 12px; color: #667085; margin: 0 0 16px 0; white-space: nowrap;">
              Launch Day Velocity & Allotment Conversion
            </p>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              
              <!-- Rank 1: Priya Kulkarni -->
              <div style="padding: 12px 14px; border-radius: 12px; background: #FFF8F6; border: 1px solid rgba(255,91,55,0.25); display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                  <div style="width: 22px; height: 22px; border-radius: 50%; background: #FF5B37; color: #FFFFFF; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    1
                  </div>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPfhv2fGm0QSzdR6OkOJYpXmjJy8R23P27TG-5N5CIvzbpobEWYrVnfn8Cw0Koc1Q-RyOSrjhvcQ504ZM7nLXZkkBskDyFXyAkzyAAE5zs42f8ozcxH0WoBOtBQahQ8AuQmNC6xooeERy3HYH5vKUPF2T2itWTGcQWTM6-d_PkPT6UK4zUkSNfeuoY8fzl8ERXWEY_LKUXuaU7Ovfg_bigY-H4TJdvkMX_KVvE3ne5N2ZSoedOTos7YjtoVu1YqpC3erfk2_ApwQs" 
                       alt="Priya Kulkarni" 
                       style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #FF5B37; flex-shrink: 0;" />
                  <div style="min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <span style="font-size: 13px; font-weight: 700; color: #111318; white-space: nowrap;">Priya Kulkarni</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <span style="font-size: 11px; color: #667085; white-space: nowrap;">5 Units Booked • Conv: 41.2%</span>
                  </div>
                </div>
                <div style="text-align: right; white-space: nowrap;">
                  <div class="finexy-stat-value" style="font-size: 15px; color: #FF5B37;">₹11.2 Cr</div>
                  <span style="font-size: 10px; font-weight: 700; color: #065F46; background: #ECFDF5; padding: 1px 6px; border-radius: 4px;">112% Quota</span>
                </div>
              </div>

              <!-- Rank 2: Ananya Sharma -->
              <div style="padding: 12px 14px; border-radius: 12px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                  <div style="width: 22px; height: 22px; border-radius: 50%; background: #EDEFF2; color: #667085; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    2
                  </div>
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #F4F5F7; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #374151; flex-shrink: 0;">
                    AS
                  </div>
                  <div style="min-width: 0;">
                    <span style="font-size: 13px; font-weight: 700; color: #111318; display: block; white-space: nowrap;">Ananya Sharma</span>
                    <span style="font-size: 11px; color: #667085; white-space: nowrap;">4 Units Booked • Conv: 36.8%</span>
                  </div>
                </div>
                <div style="text-align: right; white-space: nowrap;">
                  <div class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹9.8 Cr</div>
                  <span style="font-size: 10px; font-weight: 600; color: #667085; background: #EDEFF2; padding: 1px 6px; border-radius: 4px;">98% Quota</span>
                </div>
              </div>

              <!-- Rank 3: Vikram Malhotra -->
              <div style="padding: 12px 14px; border-radius: 12px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                  <div style="width: 22px; height: 22px; border-radius: 50%; background: #EDEFF2; color: #667085; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    3
                  </div>
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #F4F5F7; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #374151; flex-shrink: 0;">
                    VM
                  </div>
                  <div style="min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <span style="font-size: 13px; font-weight: 700; color: #111318; white-space: nowrap;">Vikram Malhotra</span>
                      <span style="font-size: 9px; font-weight: 700; background: #E5E7EB; color: #374151; padding: 1px 4px; border-radius: 3px;">MD</span>
                    </div>
                    <span style="font-size: 11px; color: #667085; white-space: nowrap;">3 Units Booked • Conv: 50.0%</span>
                  </div>
                </div>
                <div style="text-align: right; white-space: nowrap;">
                  <div class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹7.5 Cr</div>
                  <span style="font-size: 10px; font-weight: 600; color: #667085; background: #EDEFF2; padding: 1px 6px; border-radius: 4px;">75% Quota</span>
                </div>
              </div>

              <!-- Rank 4: Rohit Sen -->
              <div style="padding: 12px 14px; border-radius: 12px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                  <div style="width: 22px; height: 22px; border-radius: 50%; background: #EDEFF2; color: #667085; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    4
                  </div>
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #F4F5F7; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #374151; flex-shrink: 0;">
                    RS
                  </div>
                  <div style="min-width: 0;">
                    <span style="font-size: 13px; font-weight: 700; color: #111318; display: block; white-space: nowrap;">Rohit Sen</span>
                    <span style="font-size: 11px; color: #667085; white-space: nowrap;">2 Units Booked • Conv: 29.5%</span>
                  </div>
                </div>
                <div style="text-align: right; white-space: nowrap;">
                  <div class="finexy-stat-value" style="font-size: 15px; color: #111318;">₹4.8 Cr</div>
                  <span style="font-size: 10px; font-weight: 600; color: #667085; background: #EDEFF2; padding: 1px 6px; border-radius: 4px;">48% Quota</span>
                </div>
              </div>

            </div>
          </div>

          <!-- CARD 3: FLOOR ESCROW & TOKEN NODE (from stitch_iris_war_room_screen.html) -->
          <div style="background: #FFFFFF; border-radius: 20px; padding: 22px; border: 1px solid rgba(17,19,24,0.06); box-shadow: 0 4px 20px -2px rgba(17,19,24,0.03);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065F46" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                  Floor Escrow & Token Node
                </h3>
              </div>
              <span style="padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; font-size: 11px; font-weight: 700; border: 1px solid #A7F3D0; white-space: nowrap;">
                Zero Bounce
              </span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
              <div style="background: #F8F9FA; border-radius: 12px; padding: 12px; border: 1px solid rgba(0,0,0,0.04);">
                <span class="finexy-stat-label" style="display: block; font-size: 9.5px; color: #667085; margin-bottom: 2px;">RERA ESCROW TODAY</span>
                <span class="finexy-stat-value" style="font-size: 22px; color: #111318; display: block;">₹3.50 Cr</span>
                <span style="font-size: 11px; color: #667085; white-space: nowrap;">ICICI Dedicated Node</span>
              </div>
              <div style="background: #F8F9FA; border-radius: 12px; padding: 12px; border: 1px solid rgba(0,0,0,0.04);">
                <span class="finexy-stat-label" style="display: block; font-size: 9.5px; color: #667085; margin-bottom: 2px;">AVG TOKEN VALUE</span>
                <span class="finexy-stat-value" style="font-size: 22px; color: #111318; display: block;">₹25.00 L</span>
                <span style="font-size: 11px; color: #667085; white-space: nowrap;">Priority Allotment Slip</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.04); font-size: 12px; color: #667085;">
              <div style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
                <span>RTGS / UPI Instant Settlement: 100% Ok</span>
              </div>
              <button onclick="window.showToast?.('ICICI Escrow Sub-second Ledger Trail synced', 'info')" style="background: none; border: none; color: #FF5B37; font-weight: 700; cursor: pointer; white-space: nowrap;">
                Audit Trail
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  container.innerHTML = html;
}

// Issue Queue Token Modal
window.openIssueTokenModal = function() {
  const modalHtml = `
    <div class="modal-overlay" id="issue-token-overlay" onclick="if(event.target===this) window.closeModal('issue-token-overlay')">
      <div class="modal-content fade-in" style="max-width: 440px; background: #FFFFFF; border-radius: 20px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.12);">
        <div class="modal-header" style="border-bottom: 1px solid rgba(0,0,0,0.06); padding: 18px 24px;">
          <h3 class="modal-title" style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5B37" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Issue Launch VIP Queue Token
          </h3>
          <button class="modal-close" onclick="window.closeModal('issue-token-overlay')" style="font-size: 20px; color: #667085;">&times;</button>
        </div>
        <div class="modal-body" style="padding: 20px 24px; display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="font-size: 12px; color: #374151; font-weight: 600; display: block; margin-bottom: 6px;">Visitor / Buyer Name *</label>
            <input type="text" id="token-visitor-name" placeholder="e.g. Mr. Rajesh Singhal" 
              style="width: 100%; background: #F8F9FA; border: 1.5px solid #D1D5DB; color: #111827; padding: 10px 14px; border-radius: 10px; font-size: 13px; outline: none;" />
          </div>
        </div>
        <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn btn-secondary" onclick="window.closeModal('issue-token-overlay')">Cancel</button>
          <button class="btn btn-coral" onclick="window.submitQueueToken()">Print Token & Assign Lounge</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.submitQueueToken = async function() {
  const name = document.getElementById('token-visitor-name')?.value;
  if (!name) return;

  try {
    const res = await fetch('/v1/war-room/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor: name })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(`Token ${res.token?.token || 'T-108'} issued to ${name}`, 'success');
      window.closeModal('issue-token-overlay');
      await window.store?.loadIrisWarRoom();
    }
  } catch (e) {
    console.error(e);
  }
};
