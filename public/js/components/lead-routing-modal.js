// Lead Routing & Capacity Management Cockpit Modal
window.openLeadRoutingModal = async function() {
  let routingConfig = window.store.state.routingConfig;
  if (!routingConfig) {
    try {
      const res = await fetch('/v1/routing/rules').then(r => r.json());
      if (res.success) routingConfig = res.routingConfig;
    } catch (e) {
      console.error(e);
    }
  }

  const rules = routingConfig?.rules || [];
  const workloads = routingConfig?.agentWorkloads || [];

  const html = `
    <div class="modal-overlay" id="routing-modal-overlay" onclick="if(event.target===this) window.closeModal('routing-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 820px; max-height: 90vh; overflow-y: auto; border-radius: 22px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Enterprise Lead Routing & Capacity Rules</h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
              Rule hierarchy engine, agent workload caps, NRI queues, and automated 15-minute SLA escalations
            </p>
          </div>
          <button class="modal-close" onclick="window.closeModal('routing-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 20px;">
          <!-- Top Action Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: #F8F9FA; border: 1.5px solid #E5E7EB; padding: 14px 18px; border-radius: 14px;">
            <div style="font-size: 13px; color: #374151;">
              Engine Status: <strong style="color: #059669;">Active (Smart Rules First, Capacity-Aware)</strong>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.triggerSlaEscalation()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Scan & Auto-Escalate Overdue SLAs
            </button>
          </div>

          <!-- Active Rule Hierarchy List -->
          <div>
            <h4 style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 12px;">
              Rule Hierarchy (Evaluated Top-to-Bottom in Priority Order)
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${rules.map(r => `
                <div style="background: #FFFFFF; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">
                      #${r.priority}
                    </div>
                    <div>
                      <div style="font-size: 13.5px; font-weight: 700; color: #111827;">${r.name}</div>
                      <div style="font-size: 11.5px; color: #6B7280; margin-top: 2px;">${r.description}</div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 12.5px; font-weight: 600; color: #2563EB;">${r.assigned_to_name}</div>
                    <span class="badge" style="font-size: 10px; background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; margin-top: 4px;">
                      ${r.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Sales Rep Workload & Capacity Grid -->
          <div>
            <h4 style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 12px;">
              Agent Workload Capacities & Duty Status
            </h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
              ${workloads.map(w => {
                const pct = Math.round((w.current_active / w.max_capacity) * 100);
                const isNearCap = pct >= 80;
                return `
                  <div style="background: #FFFFFF; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <div style="font-size: 13.5px; font-weight: 700; color: #111827;">${w.name}</div>
                      <span class="badge" style="font-size: 10px; background: ${w.on_duty ? '#ECFDF5' : '#FEF2F2'}; color: ${w.on_duty ? '#059669' : '#DC2626'}; border: 1px solid ${w.on_duty ? '#A7F3D0' : '#FECACA'};">
                        ${w.on_duty ? '● On Duty' : '○ Off Duty'}
                      </span>
                    </div>
                    <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">
                      Active Workload: <strong style="color: #111827;">${w.current_active} / ${w.max_capacity} leads</strong> (${pct}%)
                    </div>
                    <div style="width: 100%; height: 7px; background: #F3F4F6; border-radius: 99px; overflow: hidden;">
                      <div style="width: ${Math.min(100, pct)}%; height: 100%; background: ${isNearCap ? '#EF4444' : '#10B981'}; transition: width 0.3s ease;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Interactive Live Lead Routing Simulator -->
          <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: 16px; padding: 20px;">
            <h4 style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.1 20.3a2 2 0 0 0 1.7 2.7h12.4a2 2 0 0 0 1.7-2.7L14 9.31V2"/></svg> Live Routing Decision Simulator</span>
              <span class="badge" style="background: #EEF2FF; color: #4F46E5; border: 1px solid #C7D2FE; font-size: 10.5px;">Audit Trail</span>
            </h4>
            <p style="font-size: 12px; color: #6B7280; margin-bottom: 14px;">
              Simulate any hypothetical incoming lead and watch the rule hierarchy explain the exact allocation path.
            </p>

            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px;">
              <div>
                <label style="font-size: 11px; font-weight: 600; color: #4B5563; display: block; margin-bottom: 3px;">Phone Number</label>
                <input type="text" id="sim-phone" value="+971 50 123 4567" 
                  style="width: 100%; background: #FFFFFF; border: 1.5px solid #E5E7EB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 12.5px; outline: none;" />
              </div>
              <div>
                <label style="font-size: 11px; font-weight: 600; color: #4B5563; display: block; margin-bottom: 3px;">Budget Min (INR)</label>
                <input type="number" id="sim-budget" value="65000000" step="5000000"
                  style="width: 100%; background: #FFFFFF; border: 1.5px solid #E5E7EB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 12.5px; outline: none;" />
              </div>
              <div>
                <label style="font-size: 11px; font-weight: 600; color: #4B5563; display: block; margin-bottom: 3px;">Lead Source</label>
                <select id="sim-source" style="width: 100%; background: #FFFFFF; border: 1.5px solid #E5E7EB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 12.5px; outline: none;">
                  <option value="meta_ads">Meta Lead Ads</option>
                  <option value="google_ads">Google Search</option>
                  <option value="cp">Channel Partner</option>
                  <option value="nri_campaign">NRI Gulf Campaign</option>
                </select>
              </div>
              <div>
                <label style="font-size: 11px; font-weight: 600; color: #4B5563; display: block; margin-bottom: 3px;">Project</label>
                <select id="sim-proj" style="width: 100%; background: #FFFFFF; border: 1.5px solid #E5E7EB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 12.5px; outline: none;">
                  <option value="proj-solitaire">The Grand Solitaire (Mumbai)</option>
                  <option value="proj-aurelia">Aurelia Greenfields (BLR)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
              <button class="btn btn-primary btn-sm" onclick="window.runRoutingSimulation()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Evaluate Rule Trace
              </button>
            </div>

            <!-- Simulation Result Container -->
            <div id="sim-result-box" style="display: none; background: #FFFFFF; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('routing-modal-overlay')">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
};

window.runRoutingSimulation = async function() {
  const phone = document.getElementById('sim-phone')?.value;
  const budget_min = document.getElementById('sim-budget')?.value;
  const source = document.getElementById('sim-source')?.value;
  const project_id = document.getElementById('sim-proj')?.value;

  try {
    const res = await fetch('/v1/routing/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, budget_min, source, project_id })
    }).then(r => r.json());

    const box = document.getElementById('sim-result-box');
    if (box && res.success) {
      box.style.display = 'block';
      const sim = res.simulation;
      box.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #F3F4F6; padding-bottom: 10px; margin-bottom: 10px;">
          <div>
            <span style="font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: 600;">Allocated Representative:</span>
            <div style="font-size: 15px; font-weight: 800; color: #059669;">${sim.assigned_user.name} (${sim.assigned_user.role})</div>
          </div>
          <span class="badge" style="background: #FEF3C7; color: #D97706; border: 1px solid #FDE68A; font-size: 11px; font-weight: 700;">
            Matched: ${sim.matched_rule}
          </span>
        </div>
        <div style="font-size: 12.5px; color: #111827; margin-bottom: 10px;">
          <strong>Rationale:</strong> ${sim.reason}
        </div>
        <div style="font-size: 11.5px; color: #4B5563;">
          <strong style="color: #111827;">Rule Hierarchy Traversal:</strong>
          <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">
            ${sim.trace.map(t => `
              <div style="display: flex; align-items: center; gap: 8px;">
                <span>${t.matched ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}</span>
                <span style="color: ${t.matched ? '#059669' : '#6B7280'}; font-weight: ${t.matched ? '700' : 'normal'};">
                  Priority #${t.priority}: ${t.rule_name} → ${t.matched ? 'MATCHED' : 'Skipped (Condition not met)'}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  } catch (err) {
    window.showToast?.('Simulation failed: ' + err.message, 'danger');
  }
};

window.triggerSlaEscalation = async function() {
  try {
    const res = await fetch('/v1/routing/escalate-sla', { method: 'POST' }).then(r => r.json());
    if (res.success) {
      if (res.escalated_count > 0) {
        window.showToast?.(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${res.escalated_count} overdue lead(s) escalated to Team Lead Closer`, 'warning');
        await window.store.refreshAll();
      } else {
        window.showToast?.('All active leads are within SLA response windows (0 breaches)', 'success');
      }
    }
  } catch (err) {
    window.showToast?.('SLA scan failed: ' + err.message, 'danger');
  }
};
