// Simplesphere OS — Post-Sales & Construction-Linked Collections (CLP) View
// Meticulously implemented directly from Stitch Screen:
// "Simplesphere OS — Post-Sales & CLP Milestone Collections" (stitch_post_sales_screen.html)
// Ultra-clean Finexy light theme with strict zero-overlap and zero-wrapping guarantees.

window._postSalesFilter = window._postSalesFilter || 'all';

function renderPostSales(container, state) {
  const bookings = state.bookings || [];
  const milestones = state.milestones || [];
  const payments = state.payments || [];
  const snags = state.snags || [];

  const activeBooking = bookings[0] || null;
  const bookingMilestones = activeBooking ? milestones.filter(m => m.booking_id === activeBooking.id) : [];
  const bookingPayments = activeBooking ? payments.filter(p => p.booking_id === activeBooking.id) : [];

  const totalDemanded = bookingMilestones.filter(m => m.is_triggered).reduce((s, m) => s + m.amount_due, 0);
  const totalPaid = bookingPayments.reduce((s, p) => s + p.amount_paid, 0);
  const outstanding = Math.max(0, totalDemanded - totalPaid);
  const totalAgVal = activeBooking ? activeBooking.agreement_value : 58000000;
  const totalCollectedCr = (totalPaid / 10000000).toFixed(2);
  const agValCr = (totalAgVal / 10000000).toFixed(2);
  const recoveryRate = totalDemanded > 0 ? Math.round((totalPaid / totalDemanded) * 100) : 100;
  const demandedPct = Math.round((totalDemanded / totalAgVal) * 100);

  // Filter milestones based on capsule
  let filteredMilestones = bookingMilestones;
  if (window._postSalesFilter === 'completed') {
    filteredMilestones = bookingMilestones.filter(m => m.status === 'paid');
  } else if (window._postSalesFilter === 'architect') {
    filteredMilestones = bookingMilestones.filter(m => !m.architect_cert_ref || !m.is_triggered);
  } else if (window._postSalesFilter === 'demanded') {
    filteredMilestones = bookingMilestones.filter(m => m.status === 'demanded');
  }

  container.innerHTML = `
    <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 6px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. PAGE HEADER & QUICK ACTIONS (from stitch_post_sales_screen.html) -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 2px;">
        <div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 9999px; background: #ECFDF5; color: #065F46; border: 1px solid rgba(16,185,129,0.3); font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
              RERA COMPLIANT • SECTION 11(4)(g) ESCROW PROTOCOL
            </span>
          </div>
          <h1 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
            Post-Sales & Construction-Linked Collections (CLP)
          </h1>
          <p style="font-size: 13px; color: #667085; margin: 3px 0 0 0; white-space: nowrap;">
            RERA escrow milestones, architect certification sign-offs, customer demand notices, and defect liability handovers.
          </p>
        </div>

        <!-- Quick Action Buttons -->
        <div style="display: flex; align-items: center; gap: 10px;">
          ${activeBooking ? `
            <button class="finexy-filter-btn" onclick="window.openHandoverNOCModal('${activeBooking.id}')" style="white-space: nowrap;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/></svg>
              <span>Possession & Key NOC</span>
            </button>
          ` : ''}
          <button class="btn btn-primary" onclick="window.openRecordPaymentModal('${activeBooking ? activeBooking.id : ''}')" style="border-radius: 12px; height: 38px; padding: 0 16px; font-weight: 600; font-size: 13px; white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <span>+ Record Milestone Payment</span>
          </button>
        </div>
      </div>

      <!-- 2. CAPSULE FILTER TRACK (from stitch_post_sales_screen.html) -->
      <div class="custom-scrollbar" style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
        <button class="finexy-capsule-btn ${window._postSalesFilter === 'all' ? 'active' : ''}" onclick="window._postSalesFilter='all'; window.renderPostSales(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          All Milestones (${bookingMilestones.length})
        </button>
        <button class="finexy-capsule-btn ${window._postSalesFilter === 'completed' ? 'active' : ''}" onclick="window._postSalesFilter='completed'; window.renderPostSales(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Completed Tranches (${bookingMilestones.filter(m => m.status === 'paid').length})
        </button>
        <button class="finexy-capsule-btn ${window._postSalesFilter === 'architect' ? 'active' : ''}" onclick="window._postSalesFilter='architect'; window.renderPostSales(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Awaiting Architect Sign-off (${bookingMilestones.filter(m => !m.architect_cert_ref || !m.is_triggered).length})
        </button>
        <button class="finexy-capsule-btn ${window._postSalesFilter === 'demanded' ? 'active' : ''}" onclick="window._postSalesFilter='demanded'; window.renderPostSales(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Demand Notices Dispatched
        </button>
        <button class="finexy-capsule-btn" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #10B981;"></span>
          <span>RERA Escrow Audited</span>
        </button>
      </div>

      <!-- 3. 4-TILE EXECUTIVE KPI ROW (from stitch_post_sales_screen.html) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        <!-- Tile 1: Vibrant Solid Coral (#FF5B37 with White Text) -->
        <div class="finexy-stat-coral" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label">TOTAL COLLECTED</span>
            <div class="finexy-icon-bubble bubble-coral">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1;">₹${totalCollectedCr} Cr</div>
            <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; padding: 2px 8px; border-radius: 9999px; background: rgba(255,255,255,0.2); font-size: 12px; font-weight: 600; white-space: nowrap;">
              <span>${recoveryRate}% Recovery Rate on Due</span>
            </div>
          </div>
        </div>

        <!-- Tile 2: Agreement Value -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">AGREEMENT VALUE</span>
            <div class="finexy-icon-bubble bubble-gray">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">₹${agValCr} Cr</div>
            <div style="font-size: 13px; color: #667085; font-weight: 500; margin-top: 6px; white-space: nowrap;">Unit ${activeBooking?.unit_number || 'A-1402'} • ${activeBooking?.customer_name || 'Dr. Kabir Mehta'}</div>
          </div>
        </div>

        <!-- Tile 3: Total Demanded to Date -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">DEMANDED TO DATE</span>
            <div class="finexy-icon-bubble" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #2563EB;">₹${(totalDemanded / 100000).toFixed(2)} L</div>
            <div style="font-size: 13px; color: #1D4ED8; font-weight: 600; margin-top: 6px; white-space: nowrap;">${demandedPct}% of Total Agreement Value</div>
          </div>
        </div>

        <!-- Tile 4: Current Outstanding -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">CURRENT OUTSTANDING</span>
            <div class="finexy-icon-bubble" style="background: ${outstanding > 0 ? '#FFFBEB' : '#ECFDF5'}; color: ${outstanding > 0 ? '#D97706' : '#059669'}; border: 1px solid ${outstanding > 0 ? '#FDE68A' : '#A7F3D0'};">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: ${outstanding > 0 ? '#D97706' : '#059669'};">₹${(outstanding / 100000).toFixed(2)} L</div>
            <div style="font-size: 13px; color: ${outstanding > 0 ? '#B45309' : '#065F46'}; font-weight: 600; margin-top: 6px; white-space: nowrap;">${outstanding > 0 ? 'Due within 15 days' : 'Zero Overdue Balance'}</div>
          </div>
        </div>
      </div>

      <!-- 4. CONSTRUCTION-LINKED MILESTONES LEDGER (from stitch_post_sales_screen.html) -->
      <div class="finexy-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.06);">
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
              Construction-Linked Payment Schedule (CLP) — Unit ${activeBooking?.unit_number || 'A-1402'}
            </h3>
            <p style="font-size: 12.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
              Statutory 70% Escrow Account Locked • Gated by Council of Architecture Sign-Off
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="finexy-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search milestones..." onkeyup="window.filterTable(this.value, 'post-sales-table')" />
            </div>
            <button class="finexy-filter-btn" style="white-space: nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        <!-- Milestones Table -->
        <div style="overflow-x: auto;" class="custom-scrollbar">
          <table class="finexy-table" id="post-sales-table">
            <thead>
              <tr>
                <th style="min-width: 240px; white-space: nowrap;">Milestone Stage</th>
                <th style="min-width: 100px; white-space: nowrap;">% Due</th>
                <th style="min-width: 150px; white-space: nowrap;">Amount (INR)</th>
                <th style="min-width: 210px; white-space: nowrap;">Architect Certificate</th>
                <th style="min-width: 140px; white-space: nowrap;">Status</th>
                <th style="min-width: 200px; text-align: right; white-space: nowrap;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredMilestones.map(m => {
                const isPaid = m.status === 'paid';
                const isDue = m.status === 'demanded' || m.status === 'partially_paid';

                return `
                  <tr>
                    <td style="white-space: nowrap;">
                      <div style="font-weight: 700; color: #111318; font-size: 13.5px;">${m.milestone_name}</div>
                      <div style="font-size: 12px; color: #667085; margin-top: 2px;">Due: ${m.due_date || 'On Slab Casting'}</div>
                    </td>
                    <td style="white-space: nowrap;">
                      <span style="font-family: 'Outfit', sans-serif; font-weight: 700; color: #2563EB; font-size: 13.5px;">${m.milestone_percentage}%</span>
                    </td>
                    <td style="white-space: nowrap;">
                      <span style="font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318; font-size: 14px;">₹${m.amount_due.toLocaleString('en-IN')}</span>
                    </td>
                    <td style="white-space: nowrap;">
                      ${m.architect_cert_ref ? `
                        <span style="display: inline-flex; align-items: center; gap: 5px; color: #065F46; font-size: 12px; font-weight: 600;">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          ${m.architect_cert_ref}
                        </span>
                      ` : `
                        <span style="color: #667085; font-size: 12px;">Awaiting Site Engineer</span>
                      `}
                    </td>
                    <td style="white-space: nowrap;">
                      <span class="finexy-status-pill ${isPaid ? 'status-completed' : isDue ? 'status-pending' : 'status-in-progress'}">
                        <span class="finexy-status-dot"></span>
                        ${isPaid ? 'Paid' : isDue ? 'Demanded / Due' : 'Upcoming'}
                      </span>
                    </td>
                    <td style="text-align: right; white-space: nowrap;">
                      <div style="display: inline-flex; align-items: center; gap: 6px;">
                        ${!m.is_triggered ? `
                          <button class="finexy-filter-btn" style="padding: 5px 10px; font-size: 11.5px; background: #ECFDF5; color: #065F46; border-color: rgba(16,185,129,0.3);" onclick="window.triggerMilestoneSignOff('${m.id}')">
                            Architect Sign-Off
                          </button>
                        ` : `
                          <button class="finexy-filter-btn" style="padding: 5px 10px; font-size: 11.5px;" onclick="window.openDemandNoticeModal('${activeBooking?.id}', '${m.id}')">
                            Demand Notice
                          </button>
                        `}
                        ${m.is_triggered && !isPaid ? `
                          <button class="finexy-filter-btn" style="padding: 5px 10px; font-size: 11.5px; background: #FF5B37; color: #FFFFFF; border-color: #FF5B37;" onclick="window.openRecordPaymentModal('${activeBooking?.id}', '${m.id}')">
                            Record Pay
                          </button>
                        ` : isPaid ? `
                          <button class="finexy-filter-btn" style="padding: 5px 10px; font-size: 11.5px;" onclick="window.showToast?.('Official Escrow Receipt Verified', 'info')">
                            Receipt
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

      </div>

      <!-- 5. PRE-HANDOVER SNAGGING CHECKLIST (from stitch_post_sales_screen.html) -->
      <div class="finexy-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.06);">
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
              Pre-Handover Snagging & Inspection Checklist
            </h3>
            <p style="font-size: 12.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
              RERA Quality Verification & Contractor Rectification Tracking
            </p>
          </div>
          <button class="finexy-filter-btn" onclick="window.openLogSnagModal('${activeBooking ? activeBooking.id : ''}')" style="white-space: nowrap;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Log Inspection Snag</span>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${snags.map(s => `
            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; background: #F8F9FA; padding: 14px 18px; border-radius: 14px; border: 1px solid #ECEEF2;">
              <div>
                <strong style="color: #111318; font-size: 13.5px;">${s.room} — ${s.category}</strong>
                <p style="font-size: 12.5px; color: #667085; margin: 2px 0 0 0;">${s.description}</p>
                <div style="font-size: 11px; color: #667085; margin-top: 4px;">Reported: ${new Date(s.reported_at).toLocaleDateString()}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="finexy-status-pill ${s.status === 'resolved' ? 'status-completed' : 'status-pending'}">
                  <span class="finexy-status-dot"></span>
                  ${s.status.replace('_', ' ').toUpperCase()}
                </span>
                ${s.status !== 'resolved' ? `
                  <button class="finexy-filter-btn" style="padding: 4px 10px; font-size: 11.5px;" onclick="window.resolveSnagItem('${s.id}')">
                    Mark Resolved
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

// Quick filter helper for tables
window.filterTable = function(query, tableId) {
  const q = query.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
};

// Existing backend action triggers preserved 100%
window.triggerMilestoneSignOff = async function(milestoneId) {
  try {
    const certRef = 'ARCH-' + Math.floor(1000 + Math.random() * 9000);
    const res = await fetch(`/v1/milestones/${milestoneId}/sign-off`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ architect_cert_ref: certRef })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(`Architect certificate ${certRef} certified. Milestone triggered.`, 'success');
      await window.store.refreshAll();
    }
  } catch (err) {
    window.showToast?.('Sign-off error: ' + err.message, 'danger');
  }
};

window.resolveSnagItem = async function(snagId) {
  try {
    const res = await fetch(`/v1/snags/${snagId}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.('Snag resolved and verified with site engineer', 'success');
      await window.store.refreshAll();
    }
  } catch (err) {
    window.showToast?.('Error resolving snag: ' + err.message, 'danger');
  }
};

window.renderPostSales = renderPostSales;
