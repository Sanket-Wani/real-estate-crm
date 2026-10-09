// Simplesphere OS — Channel Partner (Broker) Platform View
// Meticulously implemented directly from Stitch Screen:
// "Simplesphere OS — Channel Partner Portal & 194H TDS" (stitch_cp_screen.html)
// Ultra-clean Finexy light theme with strict zero-overlap and zero-wrapping guarantees.

window._cpFilter = window._cpFilter || 'all';

function renderCPPortal(container, state) {
  const partners = state.channelPartners || [];

  const totalPaid = partners.reduce((s, p) => s + (p.brokerage_paid || 0), 0);
  const totalPending = partners.reduce((s, p) => s + (p.brokerage_pending || 0), 0);
  const totalBookings = partners.reduce((s, p) => s + (p.total_bookings || 0), 0);
  const totalPaidL = (totalPaid / 100000).toFixed(1);
  const totalPendingL = (totalPending / 100000).toFixed(1);

  // Filter partners
  let filteredPartners = partners;
  if (window._cpFilter === 'tier1') {
    filteredPartners = partners.filter(p => p.commission_slab_pct >= 2.5);
  } else if (window._cpFilter === 'tier2') {
    filteredPartners = partners.filter(p => p.commission_slab_pct < 2.5);
  } else if (window._cpFilter === 'pending') {
    filteredPartners = partners.filter(p => (p.brokerage_pending || 0) > 0);
  }

  container.innerHTML = `
    <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 6px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. PAGE HEADER & TOP CTAs (from stitch_cp_screen.html) -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 2px;">
        <div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 9999px; background: #ECFDF5; color: #065F46; border: 1px solid rgba(16,185,129,0.3); font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
              STATUTORY COMPLIANT • SECTION 194H TDS ACTIVE
            </span>
          </div>
          <h1 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
            Channel Partner (Broker) Platform
          </h1>
          <p style="font-size: 13px; color: #667085; margin: 3px 0 0 0; white-space: nowrap;">
            RERA KYC verification, lead protection window (60 days), slab commissions, and statutory Section 194H TDS ledger.
          </p>
        </div>

        <!-- Action bar on right -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="finexy-filter-btn" onclick="window.openBrokerageCalculatorModal()" style="white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="8" x2="16" y1="12" y2="12"/><line x1="12" x2="12" y1="8" y2="16"/></svg>
            <span>194H TDS Calculator</span>
          </button>
          <button class="btn btn-primary" onclick="window.openOnboardCPModal()" style="border-radius: 12px; height: 38px; padding: 0 16px; font-weight: 600; font-size: 13px; white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 5px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>
            <span>+ Onboard New CP</span>
          </button>
        </div>
      </div>

      <!-- 2. CAPSULE FILTER TRACK (from stitch_cp_screen.html) -->
      <div class="custom-scrollbar" style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
        <button class="finexy-capsule-btn ${window._cpFilter === 'all' ? 'active' : ''}" onclick="window._cpFilter='all'; window.renderCPPortal(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          All Brokers (${partners.length})
        </button>
        <button class="finexy-capsule-btn ${window._cpFilter === 'tier1' ? 'active' : ''}" onclick="window._cpFilter='tier1'; window.renderCPPortal(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Tier 1 Platinum (2.5%)
        </button>
        <button class="finexy-capsule-btn ${window._cpFilter === 'tier2' ? 'active' : ''}" onclick="window._cpFilter='tier2'; window.renderCPPortal(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Tier 2 Gold (2.0%)
        </button>
        <button class="finexy-capsule-btn ${window._cpFilter === 'pending' ? 'active' : ''}" onclick="window._cpFilter='pending'; window.renderCPPortal(document.getElementById('main-content-viewport'), window.store.state);" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #F59E0B;"></span>
          Pending Invoices (${partners.filter(p => (p.brokerage_pending || 0) > 0).length})
        </button>
        <button class="finexy-capsule-btn" style="white-space: nowrap;">
          Passbook Settled
        </button>
        <button class="finexy-capsule-btn" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Lead Rules (60 Days Active)
        </button>
      </div>

      <!-- 3. 4-TILE EXECUTIVE KPI ROW (from stitch_cp_screen.html) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        <!-- Tile 1: Vibrant Solid Coral (#FF5B37 with White Text) -->
        <div class="finexy-stat-coral" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label">BROKERAGE DISBURSED</span>
            <div class="finexy-icon-bubble bubble-coral">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1;">₹${totalPaidL} L</div>
            <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; padding: 2px 8px; border-radius: 9999px; background: rgba(255,255,255,0.2); font-size: 12px; font-weight: 600; white-space: nowrap;">
              <span>Net of 5% Section 194H TDS</span>
            </div>
          </div>
        </div>

        <!-- Tile 2: Active Channel Partners -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">ACTIVE CHANNEL PARTNERS</span>
            <div class="finexy-icon-bubble bubble-gray">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">${partners.length} Firms</div>
            <div style="font-size: 13px; color: #059669; font-weight: 600; margin-top: 6px; white-space: nowrap;">100% RERA Registered</div>
          </div>
        </div>

        <!-- Tile 3: Pending Invoices -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">PENDING INVOICES</span>
            <div class="finexy-icon-bubble" style="background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #D97706;">₹${totalPendingL} L</div>
            <div style="font-size: 13px; color: #B45309; font-weight: 600; margin-top: 6px; white-space: nowrap;">Awaiting Token Sign-Off</div>
          </div>
        </div>

        <!-- Tile 4: Attributed Bookings -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">ATTRIBUTED BOOKINGS</span>
            <div class="finexy-icon-bubble" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">${totalBookings} Units</div>
            <div style="font-size: 13px; color: #2563EB; font-weight: 600; margin-top: 6px; white-space: nowrap;">₹42.8 Cr Value Generated</div>
          </div>
        </div>
      </div>

      <!-- 4. CP DIRECTORY TABLE (from stitch_cp_screen.html) -->
      <div class="finexy-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.06);">
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
              Registered Channel Partners Directory
            </h3>
            <p style="font-size: 12.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
              Lead Protection Window: 60 Days Default • Direct Passbook Settlement
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="finexy-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search brokers..." onkeyup="window.filterTable(this.value, 'cp-table')" />
            </div>
            <button class="finexy-filter-btn" style="white-space: nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div style="overflow-x: auto;" class="custom-scrollbar">
          <table class="finexy-table" id="cp-table">
            <thead>
              <tr>
                <th style="min-width: 240px; white-space: nowrap;">Partner / Agency</th>
                <th style="min-width: 170px; white-space: nowrap;">RERA & PAN</th>
                <th style="min-width: 160px; white-space: nowrap;">Commission Tier</th>
                <th style="min-width: 120px; white-space: nowrap;">Bookings</th>
                <th style="min-width: 140px; white-space: nowrap;">Total Earned</th>
                <th style="min-width: 160px; white-space: nowrap;">Passbook Status</th>
                <th style="min-width: 180px; text-align: right; white-space: nowrap;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPartners.map(cp => `
                <tr>
                  <td style="white-space: nowrap;">
                    <div style="font-weight: 700; color: #111318; font-size: 14px;">${cp.firm_name}</div>
                    <div style="font-size: 12px; color: #667085; margin-top: 2px;">${cp.contact_name} • ${cp.phone}</div>
                  </td>
                  <td style="white-space: nowrap;">
                    <span style="font-family: 'Outfit', sans-serif; font-weight: 700; color: #065F46; font-size: 12px; background: #ECFDF5; padding: 2px 7px; border-radius: 9999px; border: 1px solid rgba(16,185,129,0.3);">
                      ${cp.rera_number}
                    </span>
                    <div style="font-size: 11px; color: #667085; margin-top: 2px;">PAN: ${cp.pan}</div>
                  </td>
                  <td style="white-space: nowrap;">
                    <div style="font-weight: 700; color: #D97706; font-size: 13px;">${cp.current_slab || 'Tier 1'}</div>
                    <div style="font-size: 11.5px; color: #667085;">Base: ${cp.commission_slab_pct}% Commission</div>
                  </td>
                  <td style="white-space: nowrap;">
                    <span style="font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318; font-size: 13.5px;">${cp.total_bookings} Units</span>
                  </td>
                  <td style="white-space: nowrap;">
                    <span style="font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318; font-size: 13.5px;">₹${((cp.total_brokerage_earned || 0) / 100000).toFixed(2)} L</span>
                  </td>
                  <td style="white-space: nowrap;">
                    <span class="finexy-status-pill status-completed">
                      <span class="finexy-status-dot"></span>
                      ₹${((cp.brokerage_paid || 0) / 100000).toFixed(2)} L Settled
                    </span>
                  </td>
                  <td style="text-align: right; white-space: nowrap;">
                    <div style="display: inline-flex; align-items: center; gap: 6px;">
                      <button class="finexy-filter-btn" style="padding: 5px 10px; font-size: 11.5px;" onclick="window.viewCPPassbook('${cp.id}')">
                        Passbook
                      </button>
                      <button class="finexy-filter-btn" style="padding: 5px 10px; font-size: 11.5px; background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE;" onclick="window.openBrokerageCalculatorModal()">
                        Calc TDS
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  `;
}

// Onboard CP Modal (Finexy Light Theme)
window.openOnboardCPModal = function() {
  const modalHtml = `
    <div class="modal-overlay" id="onboard-cp-overlay" onclick="if(event.target===this) window.closeModal('onboard-cp-overlay')">
      <div class="modal-content fade-in" style="max-width: 580px; border-radius: 20px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Onboard Real Estate Channel Partner</h3>
            <p style="font-size: 12px; color: #667085;">RERA certification verification and Section 194H empanelement</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('onboard-cp-overlay')">&times;</button>
        </div>
        <div class="modal-body" style="gap: 14px; padding: 20px;">
          <div>
            <label style="font-size: 12px; color: #667085; font-weight: 600;">Firm / Agency Name *</label>
            <input type="text" id="cp-firm-name" placeholder="e.g. Skyline Advisory Group LLP" 
              style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">RERA Agent Certificate *</label>
              <input type="text" id="cp-rera-num" placeholder="e.g. A51900099881" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Authorized Contact Person *</label>
              <input type="text" id="cp-contact-name" placeholder="e.g. Rahul Kapoor" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Phone (10-Digit Mobile) *</label>
              <input type="text" id="cp-phone" placeholder="+91 98200 12345" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Business Email</label>
              <input type="email" id="cp-email" placeholder="rahul@skyline.in" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Firm PAN</label>
              <input type="text" id="cp-pan" placeholder="AAACP9988D" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Bank IFSC Code</label>
              <input type="text" id="cp-ifsc" placeholder="HDFC0000123" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" />
            </div>
          </div>
        </div>

        <div class="modal-footer" style="padding: 16px 20px; border-top: 1px solid rgba(0,0,0,0.06);">
          <button class="btn btn-secondary" onclick="window.closeModal('onboard-cp-overlay')">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitCPOnboarding()">Complete Verification & Onboard</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.submitCPOnboarding = async function() {
  const firm = document.getElementById('cp-firm-name')?.value;
  const rera = document.getElementById('cp-rera-num')?.value;
  const contact = document.getElementById('cp-contact-name')?.value;
  const phone = document.getElementById('cp-phone')?.value;
  const email = document.getElementById('cp-email')?.value;
  const pan = document.getElementById('cp-pan')?.value;
  const ifsc = document.getElementById('cp-ifsc')?.value;

  if (!firm || !rera || !contact || !phone) {
    window.showToast?.('Please fill all mandatory fields', 'warning');
    return;
  }

  try {
    const res = await fetch('/v1/channel-partners/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firm_name: firm,
        rera_number: rera,
        contact_name: contact,
        phone,
        email,
        pan,
        bank_ifsc: ifsc
      })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(`Channel Partner ${firm} onboarded!`, 'success');
      window.closeModal('onboard-cp-overlay');
      await window.store.refreshAll();
    }
  } catch (e) {
    console.error(e);
  }
};

// 194H TDS & Brokerage Calculator Modal (Finexy Light Theme)
window.openBrokerageCalculatorModal = function() {
  const modalHtml = `
    <div class="modal-overlay" id="brokerage-calc-overlay" onclick="if(event.target===this) window.closeModal('brokerage-calc-overlay')">
      <div class="modal-content fade-in" style="max-width: 540px; border-radius: 20px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Brokerage & Section 194H TDS Engine</h3>
            <p style="font-size: 12px; color: #667085;">Statutory tax deduction compliance for empanelled brokers</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('brokerage-calc-overlay')">&times;</button>
        </div>
        <div class="modal-body" style="gap: 14px; padding: 20px;">
          <div>
            <label style="font-size: 12px; color: #667085; font-weight: 600;">Agreement Value (INR):</label>
            <input type="number" id="calc-ag-val" value="65000000" step="500000" 
              style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 10px 14px; border-radius: 10px; font-size: 16px; font-weight: 700; font-family: 'Outfit', sans-serif;"
              oninput="window.recalcBrokerage()" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Commission Slab Tier:</label>
              <select id="calc-slab-select" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 13px;" onchange="window.recalcBrokerage()">
                <option value="2.0">Slab 1 (1–3 Units) : 2.0%</option>
                <option value="2.5" selected>Slab 2 (4–8 Units) : 2.5%</option>
                <option value="3.0">Slab 3 (9+ Units) : 3.0%</option>
              </select>
            </div>
            <div>
              <label style="font-size: 12px; color: #667085; font-weight: 600;">Section 194H TDS:</label>
              <input type="text" value="5% Mandated" disabled style="width: 100%; margin-top: 4px; background: #F3F4F6; border: 1.5px solid #E5E7EB; color: #0284C7; padding: 8px 12px; border-radius: 10px; font-weight: 700; font-size: 13px;" />
            </div>
          </div>

          <div id="calc-result-box" style="background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 18px; font-size: 13px;">
            <!-- Rendered dynamically -->
          </div>
        </div>
        <div class="modal-footer" style="padding: 16px 20px; border-top: 1px solid rgba(0,0,0,0.06);">
          <button class="btn btn-secondary" onclick="window.closeModal('brokerage-calc-overlay')">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  window.recalcBrokerage();
};

window.recalcBrokerage = function() {
  const agVal = Number(document.getElementById('calc-ag-val')?.value || 0);
  const slabPct = Number(document.getElementById('calc-slab-select')?.value || 2.5);

  const gross = Math.round(agVal * (slabPct / 100));
  const tds = Math.round(gross * 0.05); // 5% TDS
  const gst = Math.round(gross * 0.18); // 18% GST Invoice
  const net = gross - tds;

  const resBox = document.getElementById('calc-result-box');
  if (resBox) {
    resBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="color: #667085;">Gross Brokerage (${slabPct}%):</span>
        <strong style="color: #111827; font-family: 'Outfit', sans-serif;">₹${gross.toLocaleString('en-IN')}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #B91C1C;">
        <span>Less: Section 194H TDS (5%):</span>
        <strong style="font-family: 'Outfit', sans-serif;">- ₹${tds.toLocaleString('en-IN')}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #2563EB;">
        <span>Add: GST Invoice Claim (18%):</span>
        <strong style="font-family: 'Outfit', sans-serif;">+ ₹${gst.toLocaleString('en-IN')}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #E5E7EB; font-size: 15px; font-weight: 800; color: #047857;">
        <span>Net Brokerage Bank Payout:</span>
        <span style="font-family: 'Outfit', sans-serif;">₹${net.toLocaleString('en-IN')}</span>
      </div>
    `;
  }
};

window.viewCPPassbook = function(cpId) {
  const cp = window.store.state.channelPartners.find(p => p.id === cpId);
  if (!cp) return;

  window.showToast?.(`Passbook for ${cp.firm_name}: Total Earned ₹${(cp.total_brokerage_earned/100000).toFixed(1)}L, Disbursed ₹${(cp.brokerage_paid/100000).toFixed(1)}L`, 'info');
};

window.renderCPPortal = renderCPPortal;
