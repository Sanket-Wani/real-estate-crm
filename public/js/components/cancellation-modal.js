// Booking Cancellation & Unit Release Modal
window.openCancellationModal = function(bookingId) {
  const booking = window.store.state.bookings.find(b => b.id === bookingId) || window.store.state.bookings[0];
  if (!booking) return;

  const tokenAmt = Number(booking.token_amount || 2500000);
  const defForfeit = Math.round(tokenAmt * 0.1);
  const defRefund = tokenAmt - defForfeit;

  const modalHtml = `
    <div class="modal-overlay" id="cancellation-overlay" onclick="if(event.target===this) window.closeModal('cancellation-overlay')">
      <div class="modal-content fade-in" style="max-width: 540px; border-radius: 22px;">
        <div class="modal-header">
          <h3 class="modal-title" style="color: #EF4444; display: flex; align-items: center; gap: 8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Cancel Booking & Release Unit</h3>
          <button class="modal-close" onclick="window.closeModal('cancellation-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 16px;">
          <div style="background: #FEF2F2; border: 1.5px solid #FEE2E2; border-radius: 14px; padding: 14px 16px; font-size: 12.5px; color: #991B1B; line-height: 1.5;">
            Cancelling this booking will release Unit <strong>${booking.unit_number}</strong> back to <strong>Available</strong> for immediate resale across all agent and CP channels.
          </div>

          <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 14px 16px;">
            <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; font-weight: 700; display: block; margin-bottom: 4px;">Allottee / Allotment Reference</label>
            <div style="font-size: 14px; font-weight: 700; color: #111827;">
              ${booking.customer_name} • Unit ${booking.unit_number} (₹${(booking.agreement_value/10000000).toFixed(2)} Cr)
            </div>
          </div>

          <div>
            <label style="font-size: 12px; color: #374151; font-weight: 600; display: block; margin-bottom: 6px;">Cancellation Reason *</label>
            <select id="cancel-reason-select" style="width: 100%; background: #FFFFFF; border: 1.5px solid #E5E7EB; color: #111827; padding: 10px 14px; border-radius: 12px; font-size: 13px; font-weight: 500; outline: none;">
              <option value="Home Loan Sanction Rejected by Bank">Home Loan Sanction Rejected by Bank</option>
              <option value="Buyer Requested Voluntary Withdrawal">Buyer Requested Voluntary Withdrawal</option>
              <option value="Non-Payment of Construction Demands Beyond 60 Days">Non-Payment Beyond 60 Days Notice</option>
              <option value="Relocation / Family Exigency">Relocation / Family Exigency</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div style="background: #FFFFFF; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 12px 14px;">
              <label style="font-size: 11px; color: #6B7280; font-weight: 600; display: block; text-transform: uppercase;">Token Collected:</label>
              <div style="font-size: 16px; font-weight: 800; color: #111827; margin-top: 4px; font-family: monospace;">
                ₹${tokenAmt.toLocaleString('en-IN')}
              </div>
            </div>
            <div style="background: #FFFFFF; border: 1.5px solid #FEE2E2; border-radius: 14px; padding: 12px 14px;">
              <label style="font-size: 11px; color: #991B1B; font-weight: 600; display: block; text-transform: uppercase;">EMD Forfeiture (10%):</label>
              <div style="font-size: 16px; font-weight: 800; color: #DC2626; margin-top: 4px; font-family: monospace;">
                - ₹${defForfeit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; padding: 14px 18px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: #4B5563; font-size: 13px;">Net Refund Payable to Buyer:</span>
            <span style="font-size: 18px; font-weight: 800; color: #059669; font-family: monospace;">
              ₹${defRefund.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('cancellation-overlay')">Dismiss</button>
          <button class="btn btn-danger" onclick="window.submitBookingCancellation('${booking.id}')">
            Confirm Cancellation & Release Unit
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.submitBookingCancellation = async function(bookingId) {
  const reason = document.getElementById('cancel-reason-select')?.value;

  try {
    const res = await fetch(`/v1/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(res.message, 'warning');
      window.closeModal('cancellation-overlay');
      await window.store.refreshAll();
    }
  } catch (e) {
    console.error(e);
  }
};
