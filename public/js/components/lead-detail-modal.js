// Simplesphere OS CRM — Lead Detail Dialog with Jarvis AI Breakdown & WhatsApp Chat (Light Theme)
window.openLeadDetailsModal = async function(leadId, activeTab = 'overview') {
  const lead = window.store.state.leads.find(l => l.id === leadId);
  if (!lead) return;

  // Fetch WhatsApp Thread
  let thread = { messages: [] };
  try {
    const res = await fetch(`/v1/comm/threads/${lead.id}`).then(r => r.json());
    if (res.success) thread = res.thread;
  } catch (e) {
    console.error(e);
  }

  const modalHtml = `
    <div class="modal-overlay" id="lead-modal-overlay" onclick="if(event.target===this) window.closeModal('lead-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 720px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--grad-coral); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: #FFFFFF; box-shadow: var(--shadow-coral);">
              ${lead.name.charAt(0)}
            </div>
            <div>
              <h3 class="modal-title">${lead.name}</h3>
              <p style="font-size: 12px; color: var(--text-secondary);">${lead.phone} • ${lead.email}</p>
            </div>
          </div>
          <button class="modal-close" onclick="window.closeModal('lead-modal-overlay')">&times;</button>
        </div>

        <!-- Tabs -->
        <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-card); padding: 0 24px; background: #FAFAFC;">
          <button class="btn btn-sm ${activeTab === 'overview' ? 'btn-dark' : 'btn-secondary'}" onclick="window.openLeadDetailsModal('${lead.id}', 'overview')" style="border-radius: var(--radius-pill); margin: 8px 0;">
            Overview & Jarvis AI
          </button>
          <button class="btn btn-sm ${activeTab === 'whatsapp' ? 'btn-dark' : 'btn-secondary'}" onclick="window.openLeadDetailsModal('${lead.id}', 'whatsapp')" style="border-radius: var(--radius-pill); margin: 8px 0;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> WhatsApp Inbox (${thread.messages.length})
          </button>
        </div>

        <div class="modal-body" style="gap: 16px;">
          ${activeTab === 'overview' ? `
            <!-- Jarvis AI Intent Cockpit -->
            <div style="background: #FFF1EE; border: 1.5px solid rgba(255, 91, 55, 0.25); border-radius: var(--radius-md); padding: 18px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 22px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg></span>
                  <div>
                    <h4 style="font-size: 14.5px; font-weight: 700; color: var(--text-primary); margin: 0;">Jarvis AI Intent Score</h4>
                    <p style="font-size: 11.5px; color: var(--accent-coral); margin: 2px 0 0 0; font-weight: 600;">Predictive Propensity & Behavioral Scoring Model</p>
                  </div>
                </div>
                <div style="font-size: 26px; font-weight: 800; color: var(--accent-coral); font-family: var(--font-heading);">
                  ${lead.jarvis_score}<span style="font-size: 14px; color: var(--text-muted); font-weight: 600;">/100</span>
                </div>
              </div>
              <div style="font-size: 12.5px; color: var(--text-secondary);">
                <strong style="color: var(--text-primary);">Key Predictive Factors:</strong>
                <ul style="margin-left: 18px; margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">
                  ${(lead.jarvis_factors || ['Standard behavioral signals recorded']).map(f => `<li>${f}</li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- Profile & Details Grid -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
              <div style="background: #F8F9FA; padding: 14px; border-radius: var(--radius-md); border: 1px solid #E5E7EB;">
                <span style="color: var(--text-muted); font-size: 11.5px;">Project Inquired:</span>
                <strong style="color: var(--text-primary); display: block; margin-top: 2px;">${lead.project_name || 'The Grand Solitaire'}</strong>
              </div>
              <div style="background: #F8F9FA; padding: 14px; border-radius: var(--radius-md); border: 1px solid #E5E7EB;">
                <span style="color: var(--text-muted); font-size: 11.5px;">Lead Source & Campaign:</span>
                <strong style="color: var(--text-primary); display: block; margin-top: 2px;">${lead.source.toUpperCase()} (${lead.campaign_id || 'Direct'})</strong>
              </div>
              <div style="background: #F8F9FA; padding: 14px; border-radius: var(--radius-md); border: 1px solid #E5E7EB;">
                <span style="color: var(--text-muted); font-size: 11.5px;">Budget Range:</span>
                <strong style="color: var(--accent-coral); display: block; margin-top: 2px;">
                  ₹${(lead.budget_min / 10000000).toFixed(1)} - ${(lead.budget_max / 10000000).toFixed(1)} Cr
                </strong>
              </div>
              <div style="background: #F8F9FA; padding: 14px; border-radius: var(--radius-md); border: 1px solid #E5E7EB;">
                <span style="color: var(--text-muted); font-size: 11.5px;">Assigned Representative:</span>
                <strong style="color: var(--text-primary); display: block; margin-top: 2px;">${lead.assigned_rep_name || 'Priya Kulkarni'}</strong>
              </div>
            </div>

            <!-- Activity History -->
            <div style="background: #F8F9FA; padding: 16px; border-radius: var(--radius-md); border: 1px solid #E5E7EB;">
              <h4 style="font-size: 13.5px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Latest Activity Timeline</h4>
              <p style="font-size: 12.5px; color: var(--text-secondary);">${lead.last_activity || 'Inbound registration received'}</p>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 6px;">
                Registered: ${new Date(lead.created_at).toLocaleString()} • Connected Calls: ${lead.call_count || 0}
              </div>
            </div>
          ` : `
            <!-- WhatsApp Chat Inbox View -->
            <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: var(--radius-md); display: flex; flex-direction: column; height: 380px; overflow: hidden;">
              <div style="padding: 10px 16px; background: #FFFFFF; border-bottom: 1px solid #E5E7EB; font-size: 12px; color: #047857; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                 WhatsApp Business API Verified • E.164 Routed
              </div>

              <div id="whatsapp-messages-container" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #F3F4F7;">
                ${thread.messages.map(m => `
                  <div style="align-self: ${m.sender === 'agent' ? 'flex-end' : 'flex-start'}; max-width: 80%; background: ${m.sender === 'agent' ? '#FFF1EE' : '#FFFFFF'}; border: 1px solid ${m.sender === 'agent' ? 'rgba(255, 91, 55, 0.25)' : '#E5E7EB'}; padding: 10px 14px; border-radius: 12px; font-size: 13px; box-shadow: var(--shadow-sm);">
                    <div style="font-size: 10.5px; color: var(--text-muted); margin-bottom: 2px;">${m.sender === 'agent' ? 'Sales Rep' : lead.name} • ${new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div style="color: var(--text-primary);">${m.text}</div>
                  </div>
                `).join('')}
              </div>

              <div style="padding: 12px 14px; border-top: 1px solid #E5E7EB; display: flex; gap: 10px; background: #FFFFFF;">
                <input type="text" id="whatsapp-input-text" placeholder="Type WhatsApp reply or template update..." 
                  style="flex: 1; background: #F8F9FA; border: 1.5px solid #D1D5DB; border-radius: var(--radius-sm); padding: 9px 14px; color: #111827; font-size: 13px; outline: none;" 
                  onkeydown="if(event.key==='Enter') window.sendWhatsAppReply('${lead.id}')" />
                <button class="btn btn-coral btn-sm" onclick="window.sendWhatsAppReply('${lead.id}')">
                  Send
                </button>
              </div>
            </div>
          `}
        </div>

        <div class="modal-footer" style="flex-wrap: wrap; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="window.openCommunicationModal('${lead.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> WhatsApp Drip
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.openDialerModal('${lead.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Softphone
          </button>
          <button class="btn btn-secondary btn-sm" style="border-color: var(--accent-coral); color: var(--accent-coral);" onclick="window.closeModal('lead-modal-overlay'); window.store.setTab('jarvis-voice'); window.switchVoiceLead('${lead.id}'); window.startJarvisVoiceCall('${lead.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg> Jarvis Voice Bot
          </button>
          <button class="btn btn-coral btn-sm" onclick="window.scheduleVisitForLead('${lead.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg> Schedule Site Visit
          </button>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('lead-modal-overlay');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.sendWhatsAppReply = async function(leadId) {
  const input = document.getElementById('whatsapp-input-text');
  if (!input || !input.value.trim()) return;

  const msgText = input.value.trim();
  input.value = '';

  try {
    const res = await fetch('/v1/comm/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId, message: msgText })
    }).then(r => r.json());

    if (res.success) {
      window.openLeadDetailsModal(leadId, 'whatsapp');
    }
  } catch (e) {
    console.error(e);
  }
};

window.scheduleVisitForLead = function(leadId) {
  window.closeModal('lead-modal-overlay');
  window.openScheduleVisitModal();
};
