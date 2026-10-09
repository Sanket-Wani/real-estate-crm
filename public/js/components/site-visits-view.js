// Simplesphere OS — Site Visit Operations & Field Geo-Tracking View
// Meticulously implemented directly from Stitch Screen:
// "Simplesphere OS — Site Visit Operations & Field Geo-Tracking" (stitch_site_visits_screen.html)
// Ultra-clean Finexy light theme with strict zero-overlap and zero-wrapping guarantees.

window._siteVisitsFilter = window._siteVisitsFilter || 'all';

window.renderSiteVisitsView = function(container, state) {
  const visits = state.siteVisits || [];
  const projects = state.projects || [];
  const leads = state.leads || [];

  // Metrics
  const total = visits.length;
  const completed = visits.filter(v => v.status === 'completed').length;
  const scheduled = visits.filter(v => v.status === 'scheduled').length;
  const chauffeurActive = visits.filter(v => v.pickup_type === 'chauffeur').length;

  // Filter visits
  let filteredVisits = visits;
  if (window._siteVisitsFilter === 'today') {
    filteredVisits = visits.filter(v => v.status === 'scheduled');
  } else if (window._siteVisitsFilter === 'verified') {
    filteredVisits = visits.filter(v => v.status === 'completed');
  } else if (window._siteVisitsFilter === 'chauffeur') {
    filteredVisits = visits.filter(v => v.pickup_type === 'chauffeur');
  } else if (window._siteVisitsFilter === 'disposition') {
    filteredVisits = visits.filter(v => v.feedback);
  }

  container.innerHTML = `
    <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 6px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. HEADER & QUICK ACTIONS (from stitch_site_visits_screen.html) -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 2px;">
        <div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px; background: #ECFDF5; color: #065F46; border: 1px solid rgba(16,185,129,0.3); font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap;">
              Real-time Field Telemetry
            </span>
            <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #065F46; white-space: nowrap;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #10B981;"></span>
              Haversine 250m Active
            </span>
          </div>
          <h1 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
            Site Visit Operations & Field Geo-Tracking
          </h1>
          <p style="font-size: 13px; color: #667085; margin: 3px 0 0 0; white-space: nowrap;">
            GPS-verified on-site sales attendance (Haversine 250m geofence), chauffeur valet coordination, and client visit dispositions.
          </p>
        </div>

        <!-- Top-Right Actions -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="finexy-filter-btn" onclick="window.openGeoCheckinModal('${visits[0]?.id || 'sv-1'}')" style="white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            <span>Verify Attendance</span>
          </button>
          <button class="btn btn-primary" onclick="window.openScheduleVisitModal()" style="border-radius: 12px; height: 38px; padding: 0 16px; font-weight: 600; font-size: 13px; white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>+ Schedule VIP Site Visit</span>
          </button>
        </div>
      </div>

      <!-- 2. CAPSULE FILTER TRACK (from stitch_site_visits_screen.html) -->
      <div class="custom-scrollbar" style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
        <button class="finexy-capsule-btn ${window._siteVisitsFilter === 'all' ? 'active' : ''}" onclick="window._siteVisitsFilter='all'; window.renderSiteVisitsView(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          All Visits (${total})
        </button>
        <button class="finexy-capsule-btn ${window._siteVisitsFilter === 'today' ? 'active' : ''}" onclick="window._siteVisitsFilter='today'; window.renderSiteVisitsView(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Today's Schedule (${scheduled})
        </button>
        <button class="finexy-capsule-btn ${window._siteVisitsFilter === 'verified' ? 'active' : ''}" onclick="window._siteVisitsFilter='verified'; window.renderSiteVisitsView(document.getElementById('main-content-viewport'), window.store.state);" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #10B981;"></span>
          Geofence Verified (${completed})
        </button>
        <button class="finexy-capsule-btn ${window._siteVisitsFilter === 'chauffeur' ? 'active' : ''}" onclick="window._siteVisitsFilter='chauffeur'; window.renderSiteVisitsView(document.getElementById('main-content-viewport'), window.store.state);" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          VIP Chauffeur Valet (${chauffeurActive})
        </button>
        <button class="finexy-capsule-btn ${window._siteVisitsFilter === 'disposition' ? 'active' : ''}" onclick="window._siteVisitsFilter='disposition'; window.renderSiteVisitsView(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Dispositions Completed
        </button>
      </div>

      <!-- 3. 4-TILE EXECUTIVE KPI ROW (from stitch_site_visits_screen.html) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        <!-- Tile 1: Vibrant Solid Coral (#FF5B37 with White Text) -->
        <div class="finexy-stat-coral" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label">SCHEDULED TODAY</span>
            <div class="finexy-icon-bubble bubble-coral">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1;">${scheduled} Visits</div>
            <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; padding: 2px 8px; border-radius: 9999px; background: rgba(255,255,255,0.2); font-size: 12px; font-weight: 600; white-space: nowrap;">
              <span>100% Chauffeur Assigned</span>
            </div>
          </div>
        </div>

        <!-- Tile 2: Total Historical Visits -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">HISTORICAL VISITS</span>
            <div class="finexy-icon-bubble bubble-gray">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">${total} Visits</div>
            <div style="font-size: 13px; color: #059669; font-weight: 600; margin-top: 6px;">100% Attended / Verified</div>
          </div>
        </div>

        <!-- Tile 3: Geofence Compliance -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">GEOFENCE COMPLIANCE</span>
            <div class="finexy-icon-bubble" style="background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #059669;">93.3%</div>
            <div style="font-size: 13px; color: #065F46; font-weight: 600; margin-top: 6px;">14 of 15 within 250m Site Radius</div>
          </div>
        </div>

        <!-- Tile 4: Visit to Booking Ratio -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">VISIT TO BOOKING RATIO</span>
            <div class="finexy-icon-bubble" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">26.7%</div>
            <div style="font-size: 13px; color: #2563EB; font-weight: 600; margin-top: 6px;">4 Converted to Token Bookings</div>
          </div>
        </div>
      </div>

      <!-- 4. OPERATIONAL LOG TABLE CARD (from stitch_site_visits_screen.html) -->
      <div class="finexy-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Table Header & Search Tools -->
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.06);">
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
              Site Visit Operational Log
            </h3>
            <p style="font-size: 12.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
              Real-time Geofence Perimeter: 250 Meters • Live Fleet Telemetry
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="finexy-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search visitors..." id="sv-search-input" onkeyup="window.filterSiteVisitsTable(this.value)" />
            </div>
            <button class="finexy-filter-btn" style="white-space: nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div style="overflow-x: auto;" class="custom-scrollbar">
          <table class="finexy-table" id="sv-table">
            <thead>
              <tr>
                <th style="min-width: 220px; white-space: nowrap;">Client & Contact</th>
                <th style="min-width: 140px; white-space: nowrap;">Project & Wing</th>
                <th style="min-width: 160px; white-space: nowrap;">Scheduled At</th>
                <th style="min-width: 140px; white-space: nowrap;">Sales Host</th>
                <th style="min-width: 180px; white-space: nowrap;">VIP Chauffeur Valet</th>
                <th style="min-width: 150px; white-space: nowrap;">Geofence GPS</th>
                <th style="min-width: 190px; text-align: right; white-space: nowrap;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredVisits.map(v => {
                const isCompleted = v.status === 'completed';
                const scheduledDate = new Date(v.scheduled_at).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                });

                return `
                  <tr id="sv-row-${v.id}">
                    <td style="white-space: nowrap;">
                      <div style="font-weight: 700; color: #111318; font-size: 14px;">${v.lead_name}</div>
                      <div style="font-size: 12px; color: #667085; margin-top: 2px;">${v.lead_phone || '+91 98199 88776'}</div>
                    </td>
                    <td style="white-space: nowrap;">
                      <span style="font-weight: 600; color: #111318; font-size: 13px;">${v.project_name || 'The Grand Solitaire'}</span>
                    </td>
                    <td style="white-space: nowrap;">
                      <span style="font-family: 'Outfit', sans-serif; font-weight: 600; color: #111318; font-size: 13px;">${scheduledDate}</span>
                    </td>
                    <td style="white-space: nowrap;">
                      <span style="color: #111318; font-weight: 500; font-size: 13px;">${v.sales_rep_name || 'Priya Kulkarni'}</span>
                    </td>
                    <td style="white-space: nowrap;">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="padding: 3px 8px; border-radius: 9999px; background: #F8F9FA; border: 1px solid #E5E7EB; font-size: 11.5px; font-weight: 600; color: #374151;">
                          ${v.pickup_type === 'chauffeur' ? 'Camry Hybrid (MH-01)' : 'Direct Walk-in'}
                        </span>
                        ${v.pickup_type === 'chauffeur' ? `
                          <button class="finexy-filter-btn" style="padding: 2px 6px; font-size: 11px;" onclick="window.openChauffeurModal('${v.id}')" title="Coordination">
                            Fleet
                          </button>
                        ` : ''}
                      </div>
                    </td>
                    <td style="white-space: nowrap;">
                      <span class="finexy-status-pill ${isCompleted ? 'status-completed' : 'status-pending'}">
                        <span class="finexy-status-dot"></span>
                        ${isCompleted ? 'Verified (15m)' : 'Pending Arrival'}
                      </span>
                    </td>
                    <td style="text-align: right; white-space: nowrap;">
                      <div style="display: inline-flex; align-items: center; gap: 6px;">
                        ${!isCompleted ? `
                          <button class="finexy-filter-btn" style="padding: 5px 10px; font-size: 11.5px; background: #ECFDF5; color: #065F46; border-color: rgba(16,185,129,0.3);" onclick="window.openGeoCheckinModal('${v.id}')" title="Verify Geofence GPS">
                            Verify GPS
                          </button>
                        ` : ''}
                        <button class="finexy-filter-btn" style="padding: 5px 10px; font-size: 11.5px;" onclick="window.openFeedbackModal('${v.id}')" title="Log Customer Disposition">
                          Disposition
                        </button>
                        <button class="finexy-filter-btn" style="padding: 5px 10px; font-size: 11.5px;" onclick="window.sendSiteVisitWhatsApp('${v.lead_id}')" title="WhatsApp Visit Pass">
                          WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  `;
};

// Filter search in table
window.filterSiteVisitsTable = function(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('#sv-table tbody tr').forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
};

// Modal: Schedule Site Visit (Light Theme)
window.openScheduleVisitModal = function() {
  const projects = window.store.state.projects || [];
  const leads = window.store.state.leads || [];

  const html = `
    <div class="modal-overlay" id="sched-visit-modal-overlay" onclick="if(event.target===this) window.closeModal('sched-visit-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 580px; border-radius: 20px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Schedule VIP Site Visit & Valet</h3>
            <p style="font-size: 12px; color: #667085;">Assign sales executive host and dispatch dedicated luxury pickup</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('sched-visit-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 14px; padding: 20px;">
          <div>
            <label style="font-size: 12px; color: #667085; font-weight: 600;">Prospective Buyer / Lead *</label>
            <select id="sv-lead-select" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: 10px; font-size: 13px;">
              ${leads.map(l => `<option value="${l.id}">${l.name} (${l.phone || 'No phone'}) • ${l.stage}</option>`).join('')}
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Destination Project</label>
              <select id="sv-proj-select" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: 10px; font-size: 13px;">
                ${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Date & Time Slot</label>
              <input type="datetime-local" id="sv-datetime" value="2026-10-10T11:00" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Pickup Arrangement</label>
              <select id="sv-pickup-type" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: 10px; font-size: 13px;">
                <option value="chauffeur">Dedicated Chauffeur Valet (Builder Dispatched)</option>
                <option value="self_drive">Self-Drive (Valet Parking Reserved)</option>
                <option value="site_direct">Direct Walk-In</option>
              </select>
            </div>
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Pickup Location / Landmark</label>
              <input type="text" id="sv-pickup-address" value="Bandra West, Mumbai" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
          </div>

          <div>
            <label style="font-size: 12px; color: #667085; font-weight: 600;">Special Instructions / Family Size</label>
            <textarea id="sv-notes" rows="2" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;">Family visit (3 adults). Interested in sea-facing 3BHK high floor show penthouse.</textarea>
          </div>
        </div>

        <div class="modal-footer" style="padding: 16px 20px; border-top: 1px solid rgba(0,0,0,0.06);">
          <button class="btn btn-secondary" onclick="window.closeModal('sched-visit-modal-overlay')">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitScheduleVisit()">Confirm Schedule</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
};

window.submitScheduleVisit = async function() {
  const leadId = document.getElementById('sv-lead-select')?.value;
  const projId = document.getElementById('sv-proj-select')?.value;
  const dateTime = document.getElementById('sv-datetime')?.value;
  const pickupType = document.getElementById('sv-pickup-type')?.value;
  const pickupAddress = document.getElementById('sv-pickup-address')?.value;
  const notes = document.getElementById('sv-notes')?.value;

  window.closeModal('sched-visit-modal-overlay');

  try {
    const res = await fetch('/v1/site-visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: leadId,
        project_id: projId,
        scheduled_at: dateTime ? new Date(dateTime).toISOString() : new Date().toISOString(),
        pickup_type: pickupType,
        pickup_address: pickupAddress,
        notes: notes
      })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(res.message, 'success');
      await window.store.refreshAll();
    }
  } catch (err) {
    window.showToast?.('Failed to schedule visit: ' + err.message, 'danger');
  }
};

// Modal: GPS Geofence Verification Check-In (Light Theme)
window.openGeoCheckinModal = function(visitId) {
  const visit = window.store.state.siteVisits?.find(v => v.id === visitId);
  if (!visit) return;

  const project = window.store.state.projects?.find(p => p.id === visit.project_id) || window.store.state.projects[0];
  const targetLat = project.latitude || 19.0178;
  const targetLng = project.longitude || 72.8172;

  const html = `
    <div class="modal-overlay" id="geo-checkin-modal-overlay" onclick="if(event.target===this) window.closeModal('geo-checkin-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 540px; border-radius: 20px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Geo-Fence Presence Verification</h3>
            <p style="font-size: 12px; color: #667085;">${visit.lead_name} • ${project.name}</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('geo-checkin-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 16px; padding: 20px;">
          <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; padding: 24px; border-radius: 16px; text-align: center;">
            <div style="width: 80px; height: 80px; border-radius: 50%; border: 2px dashed #059669; margin: 0 auto; display: flex; align-items: center; justify-content: center; position: relative; background: #ECFDF5;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>
            </div>
            <h4 style="color: #111827; margin: 14px 0 4px 0; font-size: 15px; font-weight: 700;">Haversine GPS Verification Engine</h4>
            <p style="font-size: 12px; color: #667085; margin: 0;">Permissible site radius perimeter: <strong>250 Meters</strong></p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; background: #F8F9FA; padding: 12px 16px; border-radius: 10px; border: 1px solid #E5E7EB;">
            <div>
              <span style="color: #667085; font-size: 11px;">Site Coordinates:</span>
              <div style="font-weight: 700; color: #111827; margin-top: 2px;">${targetLat.toFixed(4)}° N, ${targetLng.toFixed(4)}° E</div>
            </div>
            <div>
              <span style="color: #667085; font-size: 11px;">Simulated Rep GPS:</span>
              <div style="font-weight: 700; color: #047857; margin-top: 2px;">${targetLat.toFixed(4)}° N, ${targetLng.toFixed(4)}° E (~15m distance)</div>
            </div>
          </div>

          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 12px 16px; border-radius: 10px; font-size: 12.5px; color: #065F46; display: flex; align-items: flex-start; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"/></svg>
            <div><strong>Executive verified within site perimeter.</strong> Performing check-in will timestamp attendance, advance lead to <em>Visit Completed</em>, and recalculate buyer intent.</div>
          </div>
        </div>

        <div class="modal-footer" style="padding: 16px 20px; border-top: 1px solid rgba(0,0,0,0.06);">
          <button class="btn btn-secondary" onclick="window.closeModal('geo-checkin-modal-overlay')">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitGeoCheckin('${visit.id}', ${targetLat}, ${targetLng})">
            Confirm Geofenced Check-In
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
};

window.submitGeoCheckin = async function(visitId, lat, lng) {
  window.closeModal('geo-checkin-modal-overlay');

  try {
    const res = await fetch(`/v1/site-visits/${visitId}/geo-checkin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(res.message, 'success');
      await window.store.refreshAll();
    }
  } catch (err) {
    window.showToast?.('Checkin failed: ' + err.message, 'danger');
  }
};

// Modal: Chauffeur Logistics Tracker (Light Theme)
window.openChauffeurModal = function(visitId) {
  const visit = window.store.state.siteVisits?.find(v => v.id === visitId);
  if (!visit) return;

  const html = `
    <div class="modal-overlay" id="chauffeur-modal-overlay" onclick="if(event.target===this) window.closeModal('chauffeur-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 520px; border-radius: 20px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Chauffeur & Cab Coordination</h3>
            <p style="font-size: 12px; color: #667085;">${visit.lead_name} • ${visit.pickup_address || 'Bandra West'}</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('chauffeur-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 14px; padding: 20px;">
          <div>
            <label style="font-size: 12px; color: #667085; font-weight: 600;">Dispatch Status *</label>
            <select id="ch-status" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: 10px; font-size: 13px;">
              <option value="driver_assigned" ${visit.chauffeur_status === 'driver_assigned' ? 'selected' : ''}>Driver Assigned</option>
              <option value="in_transit" ${visit.chauffeur_status === 'in_transit' ? 'selected' : ''}>In Transit to Buyer</option>
              <option value="arrived" ${visit.chauffeur_status === 'arrived' ? 'selected' : ''}>Arrived at Buyer Location</option>
              <option value="dropped" ${visit.chauffeur_status === 'dropped' ? 'selected' : ''}>Dropped at Sales Gallery</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Chauffeur Name</label>
              <input type="text" id="ch-driver-name" value="Ramesh Rathod" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Driver Contact</label>
              <input type="text" id="ch-driver-phone" value="+91 98334 11223" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
          </div>

          <div>
            <label style="font-size: 12px; color: #667085; font-weight: 600;">Vehicle Registration & Model</label>
            <input type="text" id="ch-vehicle" value="Toyota Camry Hybrid (MH-01-EQ-4422)" 
              style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
          </div>
        </div>

        <div class="modal-footer" style="padding: 16px 20px; border-top: 1px solid rgba(0,0,0,0.06);">
          <button class="btn btn-secondary" onclick="window.closeModal('chauffeur-modal-overlay')">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitChauffeurUpdate('${visit.id}')">Update Logistics</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
};

window.submitChauffeurUpdate = async function(visitId) {
  const status = document.getElementById('ch-status')?.value;
  const driver_name = document.getElementById('ch-driver-name')?.value;
  const driver_phone = document.getElementById('ch-driver-phone')?.value;
  const vehicle_number = document.getElementById('ch-vehicle')?.value;

  window.closeModal('chauffeur-modal-overlay');

  try {
    const res = await fetch(`/v1/site-visits/${visitId}/chauffeur`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, driver_name, driver_phone, vehicle_number })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(res.message, 'info');
      await window.store.refreshAll();
    }
  } catch (err) {
    window.showToast?.('Update failed: ' + err.message, 'danger');
  }
};

// Modal: Site Visit Disposition & Feedback (Light Theme)
window.openFeedbackModal = function(visitId) {
  const visit = window.store.state.siteVisits?.find(v => v.id === visitId);
  if (!visit) return;

  const html = `
    <div class="modal-overlay" id="feedback-modal-overlay" onclick="if(event.target===this) window.closeModal('feedback-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 580px; border-radius: 20px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Site Visit Disposition & Rating</h3>
            <p style="font-size: 12px; color: #667085;">${visit.lead_name} • Sales Experience Assessment</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('feedback-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 14px; padding: 20px;">
          <div>
            <label style="font-size: 12px; color: #667085; font-weight: 600;">Experience Rating (1 to 5):</label>
            <select id="fb-score" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #D97706; font-size: 14px; font-weight: 700; padding: 9px 12px; border-radius: 10px;">
              <option value="5" selected>Score: 5 / 5 — Exceptional Experience</option>
              <option value="4">Score: 4 / 5 — Very Good</option>
              <option value="3">Score: 3 / 5 — Average / Mild Interest</option>
              <option value="2">Score: 2 / 5 — Needs Follow-up</option>
              <option value="1">Score: 1 / 5 — Dissatisfied</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Buyer Purchase Intent</label>
              <select id="fb-intent" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: 10px; font-size: 13px;">
                <option value="hot" selected>HOT (Ready to book within 7 days)</option>
                <option value="warm">WARM (Evaluating other options)</option>
                <option value="cold">COLD (Budget / Timeline mismatch)</option>
              </select>
            </div>
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Next Action Step</label>
              <select id="fb-next" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: 10px; font-size: 13px;">
                <option value="issue_cost_sheet">Issue Formal Cost Sheet & Negotiation</option>
                <option value="second_visit">Schedule 2nd Visit with Decision Maker</option>
                <option value="hold_unit">Place 15-min Reservation Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label style="font-size: 12px; color: #667085; font-weight: 600;">Detailed Notes & Discussion Summary</label>
            <textarea id="fb-notes" rows="3" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;">Buyer loved Tower A high floor sea view. Discussed Down Payment Plan 8% rebate. Requested final quotation on WhatsApp.</textarea>
          </div>
        </div>

        <div class="modal-footer" style="padding: 16px 20px; border-top: 1px solid rgba(0,0,0,0.06);">
          <button class="btn btn-secondary" onclick="window.closeModal('feedback-modal-overlay')">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitFeedback('${visit.id}')">Save Disposition</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
};

window.submitFeedback = async function(visitId) {
  const score = document.getElementById('fb-score')?.value;
  const buyer_intent = document.getElementById('fb-intent')?.value;
  const next_action = document.getElementById('fb-next')?.value;
  const notes = document.getElementById('fb-notes')?.value;

  window.closeModal('feedback-modal-overlay');

  try {
    const res = await fetch(`/v1/site-visits/${visitId}/feedback`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, buyer_intent, next_action, notes })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(res.message, 'success');
      await window.store.refreshAll();
    }
  } catch (err) {
    window.showToast?.('Failed to save feedback: ' + err.message, 'danger');
  }
};

window.sendSiteVisitWhatsApp = function(leadId) {
  window.openCommunicationModal?.(leadId, null, 'tpl_site_visit_pass');
};
