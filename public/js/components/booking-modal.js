// Simplesphere OS CRM — Digital Booking Form & Token Collection Modal (Light Theme)
window.openBookingModal = function(unitId, prefillDiscount = 0, selectedScheme = 'clp') {
  const matrix = window.store.state.currentMatrix;
  if (!matrix) return;
  const unit = matrix.units.find(u => u.id === unitId) || matrix.units[0];
  if (!unit) return;

  const leads = window.store.state.leads || [];

  const modalHtml = `
    <div class="modal-overlay" id="booking-modal-overlay" onclick="if(event.target===this) window.closeModal('booking-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 640px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> Digital Booking & Allotment Form</h3>
            <p style="font-size: 12px; color: var(--text-secondary);">${matrix.project.name} • Unit ${unit.unit_number} (${unit.configuration})</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('booking-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 16px;">
          <!-- Select Lead or Direct Buyer -->
          <div>
            <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Link Existing Lead or Register Buyer:</label>
            <select id="booking-lead-select" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px;">
              ${leads.map(l => `<option value="${l.id}">${l.name} (${l.phone}) - Jarvis Score: ${l.jarvis_score}</option>`).join('')}
              <option value="direct">Direct Walk-In Buyer</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Token Booking Amount (INR) *</label>
              <input type="number" id="booking-token-amount" value="2500000" step="100000" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 10px 14px; border-radius: var(--radius-sm); font-size: 15px; font-weight: 700;" />
            </div>
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Applied Negotiation Discount (%)</label>
              <input type="number" id="booking-discount-pct" value="${prefillDiscount}" max="5" min="0" step="0.5" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 10px 14px; border-radius: var(--radius-sm); font-weight: 700; font-size: 14px;" />
            </div>
          </div>

          <div>
            <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Payment Scheme Framework:</label>
            <select id="booking-scheme-select" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px;">
              <option value="clp" ${selectedScheme === 'clp' ? 'selected' : ''}>Construction-Linked Plan (CLP) - 8 RERA Milestones</option>
              <option value="tlp" ${selectedScheme === 'tlp' ? 'selected' : ''}>Time-Linked Plan (TLP) - Quarterly Installments</option>
              <option value="flexi_20_80" ${selectedScheme === 'flexi_20_80' ? 'selected' : ''}>Flexi 20:80 Subvention (20% Now, 80% on Possession)</option>
              <option value="down_payment" ${selectedScheme === 'down_payment' ? 'selected' : ''}>Down Payment Plan (DPP) - 8% Instant Rebate</option>
            </select>
          </div>

          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 14px; border-radius: var(--radius-md); font-size: 12.5px; color: #065F46; line-height: 1.5;">
            <strong style="color: #047857;">Instant Allotment Lock:</strong> Submitting this booking will atomically transition Unit <strong>${unit.unit_number}</strong> to <strong>Booked</strong>, generate RERA payment milestones matching the selected scheme, and route 70% token funds to the Designated Master Escrow Account.
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('booking-modal-overlay')">Cancel</button>
          <button class="btn btn-coral" onclick="window.submitBooking('${unit.id}')">
            Confirm Allotment & Generate Token Receipt
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.submitBooking = async function(unitId) {
  const leadSelect = document.getElementById('booking-lead-select');
  const leadId = leadSelect ? leadSelect.value : null;
  const tokenAmt = Number(document.getElementById('booking-token-amount')?.value || 2500000);
  const discPct = Number(document.getElementById('booking-discount-pct')?.value || 0);
  const schemeSelect = document.getElementById('booking-scheme-select');
  const schemeId = schemeSelect ? schemeSelect.value : 'clp';

  window.closeModal('booking-modal-overlay');

  const res = await window.store.createBooking(leadId, unitId, tokenAmt, discPct, schemeId);
  if (res && res.success) {
    window.showToast?.(res.message, 'success');
    window.store.setTab('post-sales');
  }
};

// Plotted Land Development Booking Modal
window.openPlotBookingModal = function(plot) {
  if (!plot) return;
  const leads = window.store?.state?.leads || [];

  const modalHtml = `
    <div class="modal-overlay" id="plot-booking-modal-overlay" onclick="if(event.target===this) window.closeModal('plot-booking-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">PMRDA ALLOTMENT AGREEMENT</span>
            <h3 class="modal-title" style="margin-top: 4px;">Plotted Land Allotment: ${plot.label}</h3>
            <p style="font-size: 12px; color: var(--text-secondary);">${plot.sector} • ${plot.areaSqFt} sq.ft. (${plot.guntha} Gunthas) • Gat No. 71/1, 91/1</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('plot-booking-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 16px;">
          <div>
            <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Link Prospective Lead or Direct Allottee:</label>
            <select id="plot-booking-lead-select" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;">
              ${leads.map(l => `<option value="${l.id}">${l.name} (${l.phone}) - Jarvis Score: ${l.jarvis_score}</option>`).join('')}
              <option value="direct">Direct Walk-In Investor Allottee</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Allottee Full Name *</label>
              <input type="text" id="plot-booking-buyer-name" value="Anand Deshpande" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600;" />
            </div>
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Contact Phone *</label>
              <input type="text" id="plot-booking-buyer-phone" value="+91 98204 55123" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Booking Token Deposit (INR) *</label>
              <input type="number" id="plot-booking-token-amount" value="100000" step="10000" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 700;" />
            </div>
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Payment Scheme</label>
              <select id="plot-booking-scheme" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;">
                <option value="clp">Construction-Linked Plan (Demarcation Milestones)</option>
                <option value="down_payment">Down Payment Plan (8% Upfront Rebate)</option>
                <option value="flexi_50_50">Flexi 50:50 (50% Agreement, 50% Registration)</option>
              </select>
            </div>
          </div>

          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 12px; border-radius: var(--radius-sm); font-size: 12px; color: #065F46; line-height: 1.5;">
            <strong>Atomic Reservation:</strong> Confirming token collection transitions <strong>${plot.label}</strong> to <strong>Booked</strong> state, locks out concurrent holds, generates official PMRDA allotment certificate, and dispatches automated SMS confirmation to allottee.
          </div>
        </div>

        <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="window.closeModal('plot-booking-modal-overlay')">Cancel</button>
          <button class="btn btn-primary btn-sm" onclick="window.submitPlotBooking('${plot.id}')" style="font-weight: 700;">
            Confirm Token Booking & Issue Allotment
          </button>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('plot-booking-modal-overlay');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.submitPlotBooking = async function(plotId) {
  const buyerName = document.getElementById('plot-booking-buyer-name')?.value || 'Confirmed Allottee';
  const buyerPhone = document.getElementById('plot-booking-buyer-phone')?.value || '+91 98200 00000';
  const tokenAmt = Number(document.getElementById('plot-booking-token-amount')?.value || 100000);
  const scheme = document.getElementById('plot-booking-scheme')?.value || 'clp';
  const leadId = document.getElementById('plot-booking-lead-select')?.value;

  window.closeModal('plot-booking-modal-overlay');

  try {
    const res = await fetch(`/v1/cad/plots/${plotId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyerName,
        buyerPhone,
        tokenAmount: tokenAmt,
        paymentScheme: scheme,
        leadId: leadId === 'direct' ? null : leadId
      })
    });
    const json = await res.json();
    if (json.success) {
      window.showToast?.(json.message, 'success');
      const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
      if (container && window.renderFloorPlanViewer) {
        window.renderFloorPlanViewer(container);
      }
    } else {
      alert(json.error || 'Failed to book plot');
    }
  } catch (err) {
    console.error(err);
    alert('Booking request failed');
  }
};
