// Simplesphere OS CRM — Developer Project & Tower Configurator Wizard Modal (Light Theme)
window.openProjectConfigModal = function() {
  const projects = window.store.state.projects || [];

  const modalHtml = `
    <div class="modal-overlay" id="proj-config-overlay" onclick="if(event.target===this) window.closeModal('proj-config-overlay')">
      <div class="modal-content fade-in" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Developer Project & Tower Configurator</h3>
            <p style="font-size: 12px; color: var(--text-secondary);">RERA Registration, Master Inventory Generation & Base Pricing Schedule</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('proj-config-overlay')">&times;</button>
        </div>

        <!-- Mode Tabs -->
        <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-card); padding: 0 24px; background: #FAFAFC;">
          <button id="config-tab-proj" class="btn btn-sm btn-dark" onclick="window.switchConfigTab('project')" style="border-radius: var(--radius-pill); margin: 8px 0;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add New Project
          </button>
          <button id="config-tab-tow" class="btn btn-sm btn-secondary" onclick="window.switchConfigTab('tower')" style="border-radius: var(--radius-pill); margin: 8px 0;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg> Add Tower & Generate Units
          </button>
        </div>

        <div class="modal-body" style="gap: 16px;">
          <!-- Project Form -->
          <div id="config-project-form" style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Project Name *</label>
              <input type="text" id="new-proj-name" placeholder="e.g. Prestige High Fields" 
                style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">State RERA ID *</label>
                <input type="text" id="new-proj-rera" placeholder="e.g. P51800044912" 
                  style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
              </div>
              <div>
                <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Base Rate / sq.ft. (INR) *</label>
                <input type="number" id="new-proj-rate" value="18500" step="500" 
                  style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; font-weight: 700; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Micro-Market Location *</label>
                <input type="text" id="new-proj-loc" placeholder="e.g. Financial District, Hyderabad" 
                  style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
              </div>
              <div>
                <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">City</label>
                <input type="text" id="new-proj-city" value="Mumbai" 
                  style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
              </div>
            </div>
          </div>

          <!-- Tower Form -->
          <div id="config-tower-form" style="display: none; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Select Target Project *</label>
              <select id="tow-proj-select" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;">
                ${projects.map(p => `<option value="${p.id}">${p.name} (${p.city})</option>`).join('')}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Tower / Wing Name *</label>
                <input type="text" id="tow-name" placeholder="e.g. Tower C (Skyline Elite)" 
                  style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
              </div>
              <div>
                <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Total Floors *</label>
                <input type="number" id="tow-floors" value="8" max="40" min="1" 
                  style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;" />
              </div>
            </div>

            <div>
              <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Units Per Floor *</label>
              <select id="tow-units-per-floor" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;">
                <option value="2">2 Units / Floor (Ultra-Luxury Palatial)</option>
                <option value="3">3 Units / Floor (Premium 3BHK)</option>
                <option value="4" selected>4 Units / Floor (Standard Matrix)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('proj-config-overlay')">Cancel</button>
          <button id="config-submit-btn" class="btn btn-coral" onclick="window.submitProjectConfig()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Register Project
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.currentConfigTab = 'project';

window.switchConfigTab = function(tab) {
  window.currentConfigTab = tab;
  const pForm = document.getElementById('config-project-form');
  const tForm = document.getElementById('config-tower-form');
  const pBtn = document.getElementById('config-tab-proj');
  const tBtn = document.getElementById('config-tab-tow');
  const submitBtn = document.getElementById('config-submit-btn');

  if (tab === 'tower') {
    if (pForm) pForm.style.display = 'none';
    if (tForm) tForm.style.display = 'flex';
    if (pBtn) pBtn.className = 'btn btn-sm btn-secondary';
    if (tBtn) tBtn.className = 'btn btn-sm btn-dark';
    if (submitBtn) submitBtn.innerText = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg> Generate Tower & Live Units';
  } else {
    if (pForm) pForm.style.display = 'flex';
    if (tForm) tForm.style.display = 'none';
    if (pBtn) pBtn.className = 'btn btn-sm btn-dark';
    if (tBtn) tBtn.className = 'btn btn-sm btn-secondary';
    if (submitBtn) submitBtn.innerText = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Register Project';
  }
};

window.submitProjectConfig = async function() {
  if (window.currentConfigTab === 'project') {
    const name = document.getElementById('new-proj-name')?.value;
    const rera = document.getElementById('new-proj-rera')?.value;
    const rate = document.getElementById('new-proj-rate')?.value;
    const loc = document.getElementById('new-proj-loc')?.value;
    const city = document.getElementById('new-proj-city')?.value;

    if (!name || !rera || !loc) {
      window.showToast?.('Name, RERA ID and Location are required', 'warning');
      return;
    }

    try {
      const res = await fetch('/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rera_id: rera, base_rate_sqft: rate, location: loc, city })
      }).then(r => r.json());

      if (res.success) {
        window.showToast?.(res.message, 'success');
        window.closeModal('proj-config-overlay');
        await window.store.refreshAll();
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    const projId = document.getElementById('tow-proj-select')?.value;
    const name = document.getElementById('tow-name')?.value;
    const floors = document.getElementById('tow-floors')?.value;
    const unitsPerFloor = document.getElementById('tow-units-per-floor')?.value;

    if (!name) {
      window.showToast?.('Tower name is required', 'warning');
      return;
    }

    try {
      const res = await fetch('/v1/towers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projId,
          name,
          total_floors: floors,
          units_per_floor: unitsPerFloor
        })
      }).then(r => r.json());

      if (res.success) {
        window.showToast?.(res.message, 'success');
        window.closeModal('proj-config-overlay');
        await window.store.refreshAll();
      }
    } catch (e) {
      console.error(e);
    }
  }
};
