// Simplesphere OS CRM — Inbound Lead Ingestion & Webhook Simulator Modal (Light Theme)
window.openNewLeadModal = function() {
  const modalHtml = `
    <div class="modal-overlay" id="new-lead-modal-overlay" onclick="if(event.target===this) window.closeModal('new-lead-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Ingest Inbound Lead / Webhook Simulator</h3>
            <p style="font-size: 12px; color: var(--text-secondary);">E.164 Phone Normalization, Deduplication Engine & Jarvis AI Intent Scoring</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('new-lead-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 16px;">
          <!-- Quick Preset Simulation Buttons -->
          <div>
            <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">1-Click Portal & Ads Webhook Presets:</label>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px;">
              <button class="btn btn-secondary btn-sm" onclick="window.fillLeadPreset('99acres')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> 99acres (Worli 3BHK)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.fillLeadPreset('meta')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Meta Lead Ads (Bengaluru)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.fillLeadPreset('cp')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg> Channel Partner VIP
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.fillLeadPreset('duplicate')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg> Test Deduplication Merge
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Full Name *</label>
              <input type="text" id="lead-in-name" placeholder="e.g. Anand Mahindra Rep" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Phone Number (E.164) *</label>
              <input type="text" id="lead-in-phone" placeholder="e.g. +91 98200 99881" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Inquiry Source</label>
              <select id="lead-in-source" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;">
                <option value="99acres">99acres Portal Webhook</option>
                <option value="magicbricks">MagicBricks Ingestion</option>
                <option value="meta_ads">Meta Lead Ads (Instagram/FB)</option>
                <option value="google_ads">Google Search PPC</option>
                <option value="cp">Channel Partner VIP Desk</option>
                <option value="walk_in">Experience Center Walk-In</option>
              </select>
            </div>
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Target Project</label>
              <select id="lead-in-project" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;">
                <option value="proj-solitaire">The Grand Solitaire (Worli, Mumbai)</option>
                <option value="proj-aurelia">Aurelia Greenfields (Bengaluru)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Min Budget (INR)</label>
              <input type="number" id="lead-in-bmin" value="50000000" step="5000000" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Max Budget (INR)</label>
              <input type="number" id="lead-in-bmax" value="70000000" step="5000000" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('new-lead-modal-overlay')">Cancel</button>
          <button class="btn btn-coral" onclick="window.submitNewLead()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Ingest Lead & Run Jarvis AI</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.openLeadModalForUnit = function() {
  window.openNewLeadModal();
};

window.fillLeadPreset = function(preset) {
  const nameEl = document.getElementById('lead-in-name');
  const phoneEl = document.getElementById('lead-in-phone');
  const sourceEl = document.getElementById('lead-in-source');
  const projEl = document.getElementById('lead-in-project');
  const bminEl = document.getElementById('lead-in-bmin');
  const bmaxEl = document.getElementById('lead-in-bmax');

  if (preset === '99acres') {
    if (nameEl) nameEl.value = 'Rohan Murthy';
    if (phoneEl) phoneEl.value = '+91 98205 11992';
    if (sourceEl) sourceEl.value = '99acres';
    if (projEl) projEl.value = 'proj-solitaire';
    if (bminEl) bminEl.value = '55000000';
    if (bmaxEl) bmaxEl.value = '75000000';
  } else if (preset === 'meta') {
    if (nameEl) nameEl.value = 'Divya Chandran';
    if (phoneEl) phoneEl.value = '+91 98452 77112';
    if (sourceEl) sourceEl.value = 'meta_ads';
    if (projEl) projEl.value = 'proj-aurelia';
    if (bminEl) bminEl.value = '12000000';
    if (bmaxEl) bmaxEl.value = '16000000';
  } else if (preset === 'cp') {
    if (nameEl) nameEl.value = 'Kunal Bahl';
    if (phoneEl) phoneEl.value = '+91 98110 55443';
    if (sourceEl) sourceEl.value = 'cp';
    if (projEl) projEl.value = 'proj-solitaire';
    if (bminEl) bminEl.value = '80000000';
    if (bmaxEl) bmaxEl.value = '110000000';
  } else if (preset === 'duplicate') {
    // Tests existing lead deduplication
    if (nameEl) nameEl.value = 'Dr. Siddharth Nambiar';
    if (phoneEl) phoneEl.value = '+91 98210 54321';
    if (sourceEl) sourceEl.value = 'housing';
    if (projEl) projEl.value = 'proj-solitaire';
    if (bminEl) bminEl.value = '50000000';
    if (bmaxEl) bmaxEl.value = '70000000';
  }
};

window.submitNewLead = async function() {
  const name = document.getElementById('lead-in-name')?.value;
  const phone = document.getElementById('lead-in-phone')?.value;
  const source = document.getElementById('lead-in-source')?.value;
  const projectId = document.getElementById('lead-in-project')?.value;
  const bmin = document.getElementById('lead-in-bmin')?.value;
  const bmax = document.getElementById('lead-in-bmax')?.value;

  if (!name || !phone) {
    window.showToast?.('Name and Phone are mandatory', 'warning');
    return;
  }

  try {
    const res = await fetch('/v1/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        source,
        project_id: projectId,
        budget_min: bmin,
        budget_max: bmax
      })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(res.message, res.deduplicated ? 'warning' : 'success');
      window.closeModal('new-lead-modal-overlay');
      await window.store.refreshLeads();
      window.store.setTab('pipeline');
    }
  } catch (e) {
    console.error(e);
  }
};
