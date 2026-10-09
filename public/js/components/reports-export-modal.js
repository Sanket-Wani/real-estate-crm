// Simplesphere OS CRM — Enterprise Data Export & Reporting Center Modal (Light Theme)
window.openReportsExportModal = function() {
  const html = `
    <div class="modal-overlay" id="reports-export-modal-overlay" onclick="if(event.target===this) window.closeModal('reports-export-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 740px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> Enterprise Reports & Data Export Center</h3>
            <p style="font-size: 12px; color: var(--text-secondary);">
              Download RERA statutory registers, ERP sync dumps, and CP tax registers in standard CSV format
            </p>
          </div>
          <button class="modal-close" onclick="window.closeModal('reports-export-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 14px;">
          <!-- Card 1: Master Inventory Dump -->
          <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: var(--radius-md); padding: 18px; display: flex; justify-content: space-between; align-items: center; transition: all 0.15s ease;" onmouseover="this.style.borderColor='var(--accent-coral)'" onmouseout="this.style.borderColor='#E5E7EB'">
            <div style="display: flex; gap: 14px; align-items: center;">
              <span style="font-size: 28px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg></span>
              <div>
                <h4 style="font-size: 14.5px; font-weight: 700; color: var(--text-primary); margin: 0;">Master Unit Inventory Register</h4>
                <p style="font-size: 12px; color: var(--text-secondary); margin: 3px 0 0 0;">
                  Complete unit-level price book, carpet areas, floor rise schedule, PLC facing, and current lock status.
                </p>
              </div>
            </div>
            <button class="btn btn-coral btn-sm" onclick="window.downloadReportCsv('/v1/exports/inventory', 'SellDo_Master_Inventory.csv')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CSV
            </button>
          </div>

          <!-- Card 2: Leads & UTM Attribution Dump -->
          <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: var(--radius-md); padding: 18px; display: flex; justify-content: space-between; align-items: center; transition: all 0.15s ease;" onmouseover="this.style.borderColor='var(--accent-coral)'" onmouseout="this.style.borderColor='#E5E7EB'">
            <div style="display: flex; gap: 14px; align-items: center;">
              <span style="font-size: 28px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg></span>
              <div>
                <h4 style="font-size: 14.5px; font-weight: 700; color: var(--text-primary); margin: 0;">Leads & UTM Campaign Attribution Dump</h4>
                <p style="font-size: 12px; color: var(--text-secondary); margin: 3px 0 0 0;">
                  End-to-end lead journey, UTM parameters, SLA breach flags, telephony call counts, and talk-time duration.
                </p>
              </div>
            </div>
            <button class="btn btn-coral btn-sm" onclick="window.downloadReportCsv('/v1/exports/leads', 'SellDo_Leads_Attribution_Dump.csv')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CSV
            </button>
          </div>

          <!-- Card 3: RERA CLP Collections & Escrow Ledger -->
          <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: var(--radius-md); padding: 18px; display: flex; justify-content: space-between; align-items: center; transition: all 0.15s ease;" onmouseover="this.style.borderColor='var(--accent-coral)'" onmouseout="this.style.borderColor='#E5E7EB'">
            <div style="display: flex; gap: 14px; align-items: center;">
              <span style="font-size: 28px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg></span>
              <div>
                <h4 style="font-size: 14.5px; font-weight: 700; color: var(--text-primary); margin: 0;">RERA CLP Collections & 70% Escrow Ledger</h4>
                <p style="font-size: 12px; color: var(--text-secondary); margin: 3px 0 0 0;">
                  Milestone demand notices, overdue aging, Section 19(6) penal interest, and 70% master escrow allocations.
                </p>
              </div>
            </div>
            <button class="btn btn-coral btn-sm" onclick="window.downloadReportCsv('/v1/exports/clp-collections', 'SellDo_CLP_Collections_Escrow.csv')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CSV
            </button>
          </div>

          <!-- Card 4: Channel Partner Section 194H TDS Register -->
          <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: var(--radius-md); padding: 18px; display: flex; justify-content: space-between; align-items: center; transition: all 0.15s ease;" onmouseover="this.style.borderColor='var(--accent-coral)'" onmouseout="this.style.borderColor='#E5E7EB'">
            <div style="display: flex; gap: 14px; align-items: center;">
              <span style="font-size: 28px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg></span>
              <div>
                <h4 style="font-size: 14.5px; font-weight: 700; color: var(--text-primary); margin: 0;">Channel Partner Section 194H TDS Register</h4>
                <p style="font-size: 12px; color: var(--text-secondary); margin: 3px 0 0 0;">
                  Brokerage ledger, slab tier calculations, statutory 5% Section 194H TDS deductions, and 18% GST tax audit records.
                </p>
              </div>
            </div>
            <button class="btn btn-coral btn-sm" onclick="window.downloadReportCsv('/v1/exports/cp-brokerage', 'SellDo_CP_Section194H_TDS_Register.csv')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CSV
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('reports-export-modal-overlay')">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
};

window.downloadReportCsv = async function(url, filename) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showToast?.(`Downloaded ${filename} successfully`, 'success');
  } catch (err) {
    window.showToast?.('Export failed: ' + err.message, 'danger');
  }
};
