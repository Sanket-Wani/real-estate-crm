// Official Possession Handover Certificate & Key Handover NOC Modal
window.openHandoverNOCModal = async function(bookingId) {
  try {
    const res = await fetch(`/v1/bookings/${bookingId}/handover-certificate`).then(r => r.json());
    if (!res.success) {
      window.showToast?.('Could not load handover certificate', 'warning');
      return;
    }

    const cert = res.certificate;

    const modalHtml = `
      <div class="modal-overlay" id="handover-noc-overlay" onclick="if(event.target===this) window.closeModal('handover-noc-overlay')">
        <div class="modal-content fade-in" style="max-width: 760px;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/></svg> Possession Handover Certificate & Key NOC</h3>
              <p style="font-size: 12px; color: var(--text-secondary);">${cert.project.name} • Ref: ${cert.noc_reference}</p>
            </div>
            <button class="modal-close" onclick="window.closeModal('handover-noc-overlay')">&times;</button>
          </div>

          <div class="modal-body" style="gap: 16px;">
            <div id="printable-handover-cert" style="background: #ffffff; color: #0f172a; padding: 28px; border-radius: var(--radius-md); font-size: 12.5px; line-height: 1.6; box-shadow: var(--shadow-md);">
              <!-- Letterhead -->
              <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px;">
                <div>
                  <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0;">POSSESSION CLEARANCE CERTIFICATE</h2>
                  <p style="font-size: 11px; color: #475569; margin-top: 2px;">
                    Project: <strong>${cert.project.name}</strong> • RERA: <strong>${cert.project.rera_id}</strong>
                  </p>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 4px;">
                    NOC GRANTED
                  </span>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Ref: ${cert.noc_reference}</div>
                  <div style="font-size: 11px; color: #64748b;">Date: ${cert.handover_date}</div>
                </div>
              </div>

              <!-- Certificate Statement -->
              <div style="margin-bottom: 16px;">
                This is to certify that physical vacant possession of Unit <strong>${cert.buyer.unit_number}</strong> (${cert.unit_specs.configuration}, ${cert.unit_specs.carpet_area} sq.ft. carpet area) along with ${cert.unit_specs.parking_slots} covered parking slot(s) in <strong>${cert.project.name}</strong> has been handed over to <strong>${cert.buyer.name}</strong>.
              </div>

              <!-- Clearance Checklist -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin-bottom: 16px;">
                <div style="font-weight: 700; color: #0f172a; margin-bottom: 8px;">Compliance & Clearance Audit:</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                  <div style="color: #047857; display: flex; align-items: center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>Full Payment Milestone Ledger Reconciled</div>
                  <div style="color: #047857; display: flex; align-items: center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>Society Maintenance & Corpus Deposited</div>
                  <div style="color: #047857; display: flex; align-items: center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>Pre-Handover Snagging Rectification Cleared</div>
                  <div style="color: #047857; display: flex; align-items: center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>Electricity & Water Sub-Meters Calibrated</div>
                  <div style="color: #047857; display: flex; align-items: center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>4 Master Smart RFID Key Sets Handed Over</div>
                  <div style="color: #047857; display: flex; align-items: center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>Occupancy Certificate (OC) Verified</div>
                </div>
              </div>

              <!-- 5-Year Defect Liability Period (DLP) Box -->
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 14px; margin-bottom: 16px;">
                <div style="font-weight: 700; color: #1e40af; font-size: 12.5px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 5-Year Defect Liability Period (DLP) Guarantee
                </div>
                <p style="font-size: 11.5px; color: #1e3a8a; margin-top: 4px;">
                  Under <strong>${cert.defect_liability_period.section_reference}</strong>, the developer undertakes a statutory 5-year structural warranty valid through <strong>${cert.defect_liability_period.warranty_expires}</strong> covering structural integrity, plumbing concealed lines, and core mechanical provisions at zero cost to the allottee.
                </p>
              </div>

              <!-- Signatures -->
              <div style="display: flex; justify-content: space-between; margin-top: 24px; padding-top: 14px; border-top: 1px solid #cbd5e1;">
                <div>
                  <div style="font-size: 11px; color: #64748b;">Authorized Signatory:</div>
                  <div style="font-weight: 700; margin-top: 20px;">For Aurum Crest Developers Ltd.</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 11px; color: #64748b;">Allottee Acceptance:</div>
                  <div style="font-weight: 700; margin-top: 20px;">${cert.buyer.name}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="window.printHandoverCertificate()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Certificate & NOC
            </button>
            <button class="btn btn-gold" onclick="window.closeModal('handover-noc-overlay'); window.showToast('Possession NOC finalized and sent to buyer portal', 'success')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>Acknowledge Handover
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

window.printHandoverCertificate = function() {
  const printContents = document.getElementById('printable-handover-cert').innerHTML;
  const win = window.open('', '', 'height=750,width=850');
  win.document.write('<html><head><title>Possession Handover Certificate</title>');
  win.document.write('<style>body { font-family: sans-serif; padding: 20px; background: #fff; color: #000; line-height: 1.5; } </style>');
  win.document.write('</head><body>');
  win.document.write(printContents);
  win.document.write('</body></html>');
  win.document.close();
  win.print();
};
