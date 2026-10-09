// Official RERA Demand Notice Modal Component
window.openDemandNoticeModal = async function(bookingId, milestoneId) {
  try {
    const res = await fetch(`/v1/bookings/${bookingId}/demand-letter/${milestoneId}`).then(r => r.json());
    if (!res.success) {
      window.showToast?.('Could not load demand notice details', 'warning');
      return;
    }

    const dn = res.demand_notice;

    const modalHtml = `
      <div class="modal-overlay" id="demand-notice-overlay" onclick="if(event.target===this) window.closeModal('demand-notice-overlay')">
        <div class="modal-content fade-in" style="max-width: 780px;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Official RERA Demand Notice</h3>
              <p style="font-size: 12px; color: var(--text-secondary);">${dn.project.name} • Ref: ${dn.notice_ref}</p>
            </div>
            <button class="modal-close" onclick="window.closeModal('demand-notice-overlay')">&times;</button>
          </div>

          <div class="modal-body" style="gap: 16px;">
            <div id="printable-demand-letter" style="background: #ffffff; color: #0f172a; padding: 28px; border-radius: var(--radius-md); font-size: 12.5px; line-height: 1.6; box-shadow: var(--shadow-md);">
              <!-- Letterhead -->
              <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 16px;">
                <div>
                  <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0;">AURUM CREST DEVELOPERS</h2>
                  <p style="font-size: 11px; color: #475569; margin-top: 2px;">
                    Project: <strong>${dn.project.name}</strong> • ${dn.project.location}<br/>
                    MahaRERA Registration No: <strong style="color: #047857;">${dn.project.rera_registration}</strong>
                  </p>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 11px; font-weight: 700; background: #f1f5f9; padding: 4px 10px; border-radius: 4px; color: #1e293b;">
                    DEMAND NOTICE
                  </span>
                  <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Ref: ${dn.notice_ref}</div>
                  <div style="font-size: 11px; color: #64748b;">Date: ${dn.dispatch_date}</div>
                </div>
              </div>

              <!-- Buyer & Allotment Box -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px;">
                <div style="font-weight: 700; color: #0f172a; font-size: 13.5px;">To: ${dn.buyer.name}</div>
                <div style="font-size: 11.5px; color: #475569; margin-top: 2px;">
                  Allottee of Unit No: <strong>${dn.buyer.unit_number}</strong> (${dn.buyer.configuration})<br/>
                  Registered Contact: ${dn.buyer.phone} • ${dn.buyer.email}
                </div>
              </div>

              <p style="margin-bottom: 12px;">
                Dear Sir/Madam,<br/>
                We are pleased to inform you that the construction work for your allocated unit has successfully achieved the milestone certified by the project architect below:
              </p>

              <!-- Milestone Breakdown Table -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <thead>
                  <tr style="background: #f1f5f9; text-align: left; font-size: 11px; text-transform: uppercase;">
                    <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Milestone Description</th>
                    <th style="padding: 8px 12px; border: 1px solid #cbd5e1;">Architect Certificate</th>
                    <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: right;">% Slab</th>
                    <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: right;">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 10px 12px; border: 1px solid #e2e8f0; font-weight: 700;">${dn.milestone.name}</td>
                    <td style="padding: 10px 12px; border: 1px solid #e2e8f0; color: #047857; font-weight: 600;">${dn.milestone.architect_cert}</td>
                    <td style="padding: 10px 12px; border: 1px solid #e2e8f0; text-align: right;">${dn.milestone.percentage}%</td>
                    <td style="padding: 10px 12px; border: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-weight: 700;">₹${dn.milestone.amount_due.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding: 8px 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">Applicable GST (5%):</td>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0; text-align: right; font-family: monospace;">₹${dn.milestone.gst_5_pct.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style="background: #f8fafc; font-weight: 800; font-size: 13.5px;">
                    <td colspan="3" style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right; color: #0f172a;">TOTAL AMOUNT PAYABLE:</td>
                    <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right; color: #047857; font-family: monospace;">₹${dn.milestone.total_payable.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              <div style="font-weight: 700; color: #b91c1c; margin-bottom: 14px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Payment Due Date: ${dn.due_date} (Strict 15 Days Notice Period)
              </div>

              <!-- RERA Designated 70% Escrow Account -->
              <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 12px 16px; margin-bottom: 14px;">
                <div style="font-weight: 700; color: #166534; font-size: 12px; text-transform: uppercase;">
                  RERA Designated 70% Master Escrow Account Details
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11.5px; color: #14532d; margin-top: 6px;">
                  <div>Bank Name: <strong>${dn.rera_escrow_account.bank_name}</strong></div>
                  <div>Account No: <strong>${dn.rera_escrow_account.escrow_account_no}</strong></div>
                  <div>IFSC Code: <strong>${dn.rera_escrow_account.ifsc_code}</strong></div>
                  <div>Virtual UPI ID: <strong>${dn.rera_escrow_account.virtual_upi_id}</strong></div>
                </div>
              </div>

              <!-- Statutory Terms -->
              <div style="font-size: 10.5px; color: #64748b; line-height: 1.4; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                <strong>Statutory Clauses & Notice:</strong>
                <ul style="margin-left: 16px; margin-top: 4px;">
                  ${dn.statutory_clauses.map(c => `<li>${c}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="window.printDemandNotice()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print / Download PDF Notice
            </button>
            <button class="btn btn-gold" onclick="window.closeModal('demand-notice-overlay'); window.openRecordPaymentModal('${bookingId}', '${milestoneId}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> Record Payment Against Notice
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  } catch (err) {
    console.error(err);
  }
};

window.printDemandNotice = function() {
  const printContents = document.getElementById('printable-demand-letter').innerHTML;
  const win = window.open('', '', 'height=750,width=850');
  win.document.write('<html><head><title>RERA Demand Notice</title>');
  win.document.write('<style>body { font-family: sans-serif; padding: 20px; background: #fff; color: #000; line-height: 1.5; } table { width: 100%; border-collapse: collapse; } th, td { padding: 8px 12px; } </style>');
  win.document.write('</head><body>');
  win.document.write(printContents);
  win.document.write('</body></html>');
  win.document.close();
  win.print();
};
