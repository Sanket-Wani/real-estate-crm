// Simulated In-App Telephony Dialer Component (Light Theme)
let activeCallInterval = null;
let callSecondsElapsed = 0;

window.openDialerModal = function(leadId) {
  const lead = window.store.state.leads.find(l => l.id === leadId);
  if (!lead) return;

  callSecondsElapsed = 0;
  if (activeCallInterval) clearInterval(activeCallInterval);

  const modalHtml = `
    <div class="modal-overlay" id="dialer-modal-overlay" onclick="if(event.target===this) window.closeDialerModal()">
      <div class="modal-content fade-in" style="max-width: 440px; text-align: center;">
        <div class="modal-header">
          <h3 class="modal-title" style="font-size: 16px;">Cloud Telephony Softphone</h3>
          <button class="modal-close" onclick="window.closeDialerModal()">&times;</button>
        </div>

        <div class="modal-body" style="align-items: center; padding: 26px 24px; gap: 14px;">
          <!-- Telephony Masking Badge -->
          <div style="font-size: 11px; color: #0284C7; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 4px 12px; border-radius: 9999px; font-weight: 600;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Virtual Number Masking Active (Exotel Bridge)
          </div>

          <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--grad-coral); display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 4px auto 0 auto; box-shadow: var(--shadow-coral); color: #FFFFFF;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>

          <div>
            <h2 style="font-size: 20px; font-weight: 800; color: var(--text-primary); margin-bottom: 2px;">${lead.name}</h2>
            <p style="font-size: 13px; color: var(--text-secondary);">${lead.phone}</p>
          </div>

          <!-- Call Status & Timer -->
          <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; padding: 16px 24px; border-radius: var(--radius-md); width: 100%; box-sizing: border-box;">
            <div id="call-status-indicator" style="font-size: 12px; color: var(--accent-amber); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
              Initiating Bridge Connection...
            </div>
            <div id="call-timer-display" style="font-size: 32px; font-weight: 800; color: var(--text-primary); font-family: monospace; margin-top: 4px;">
              00:00
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
              Recording audio stream for compliance & quality audit
            </div>
          </div>

          <!-- Disposition / Outcome Selector -->
          <div style="text-align: left; width: 100%; box-sizing: border-box;">
            <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Call Outcome Disposition:</label>
            <select id="call-outcome-select" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: var(--radius-sm); outline: none; font-size: 13px;">
              <option value="Interested - Pitch Complete">Interested - Unit Details Discussed</option>
              <option value="Site Visit Requested">Site Visit Requested for Weekend</option>
              <option value="Callback Requested">Callback Requested Later</option>
              <option value="Ringing - No Answer">Ringing / Unreachable</option>
            </select>
          </div>
        </div>

        <div class="modal-footer" style="justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" onclick="window.closeDialerModal(); window.store.setTab('jarvis-voice'); window.switchVoiceLead('${lead.id}'); window.startJarvisVoiceCall('${lead.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg> Handoff to Jarvis Bot
          </button>
          <button class="btn btn-danger btn-sm" style="padding: 8px 20px;" onclick="window.endAndLogCall('${lead.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 6px;"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" y1="2" x2="2" y2="22"/></svg>End Call & Log
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Start call simulation
  setTimeout(() => {
    const statusEl = document.getElementById('call-status-indicator');
    if (statusEl) {
      statusEl.innerText = 'Call In Progress';
      statusEl.style.color = 'var(--accent-emerald)';
    }

    activeCallInterval = setInterval(() => {
      callSecondsElapsed++;
      const timerEl = document.getElementById('call-timer-display');
      if (timerEl) {
        const m = Math.floor(callSecondsElapsed / 60);
        const s = callSecondsElapsed % 60;
        timerEl.innerText = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
      }
    }, 1000);
  }, 1500);
};

window.closeDialerModal = function() {
  if (activeCallInterval) clearInterval(activeCallInterval);
  window.closeModal('dialer-modal-overlay');
};

window.endAndLogCall = async function(leadId) {
  if (activeCallInterval) clearInterval(activeCallInterval);
  const outcomeSelect = document.getElementById('call-outcome-select');
  const outcome = outcomeSelect ? outcomeSelect.value : 'Call Ended';

  window.closeDialerModal();

  try {
    const res = await fetch(`/v1/leads/${leadId}/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duration_sec: callSecondsElapsed || 60,
        outcome,
        notes: `Outcome recorded: ${outcome}`
      })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(`Call logged for ${res.lead.name} (${callSecondsElapsed}s)`, 'success');
      await window.store.refreshLeads();
    }
  } catch (e) {
    console.error(e);
  }
};
