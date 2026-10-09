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
