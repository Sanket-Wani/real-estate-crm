// Simplesphere OS CRM — Omnichannel Buyer Communication Modal (Light Theme)
window.openCommunicationModal = function(leadId, bookingId = null, preselectedTemplateId = 'tpl_welcome_brochure') {
  const state = window.store.state;
  const lead = state.leads?.find(l => l.id === leadId);
  const booking = state.bookings?.find(b => b.id === bookingId);
  const templates = state.templates || [];
  const project = state.projects?.find(p => p.id === (lead?.project_id || booking?.project_id)) || state.projects[0];

  const recipientName = lead ? lead.name : (booking ? booking.customer_name : 'Valued Buyer');
  const recipientPhone = lead ? lead.phone : (booking ? booking.customer_phone : '+91 98000 00000');

  const selectedTpl = templates.find(t => t.id === preselectedTemplateId) || templates[0];

  function resolveTags(text) {
    if (!text) return '';
    return text
      .replace(/\{\{lead_name\}\}/g, recipientName)
      .replace(/\{\{buyer_name\}\}/g, recipientName)
      .replace(/\{\{project_name\}\}/g, project.name)
      .replace(/\{\{project_id\}\}/g, project.id)
      .replace(/\{\{project_location\}\}/g, project.location)
      .replace(/\{\{project_lat\}\}/g, project.latitude || '19.0178')
      .replace(/\{\{project_lng\}\}/g, project.longitude || '72.8172')
      .replace(/\{\{unit_number\}\}/g, booking ? booking.unit_number : 'A-401')
      .replace(/\{\{assigned_rep_name\}\}/g, lead ? lead.assigned_rep_name : 'Priya Kulkarni')
      .replace(/\{\{assigned_rep_phone\}\}/g, '+91 98204 44556')
      .replace(/\{\{scheduled_time\}\}/g, 'Saturday 11:30 AM')
      .replace(/\{\{chauffeur_status\}\}/g, 'Driver Assigned')
      .replace(/\{\{vehicle_number\}\}/g, 'MH-01-EQ-4422');
  }

  const initialBody = resolveTags(selectedTpl?.body);

  const html = `
    <div class="modal-overlay" id="comm-modal-overlay" onclick="if(event.target===this) window.closeModal('comm-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> Omnichannel Buyer Communication</h3>
            <p style="font-size: 12px; color: var(--text-secondary);">${recipientName} • ${recipientPhone}</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('comm-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 16px;">
          <!-- Channel Selector -->
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm btn-dark" id="comm-channel-whatsapp" onclick="window.selectCommChannel('whatsapp')" style="flex: 1; border-radius: var(--radius-pill);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 6px;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>WhatsApp API
            </button>
            <button class="btn btn-sm btn-secondary" id="comm-channel-email" onclick="window.selectCommChannel('email')" style="flex: 1; border-radius: var(--radius-pill);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 6px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>Official Email
            </button>
            <button class="btn btn-sm btn-secondary" id="comm-channel-sms" onclick="window.selectCommChannel('sms')" style="flex: 1; border-radius: var(--radius-pill);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> DLT SMS
            </button>
          </div>
          <input type="hidden" id="comm-selected-channel" value="whatsapp" />

          <!-- Template Selector -->
          <div>
            <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Pre-Approved Drip Template *</label>
            <select id="comm-template-select" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px;"
              onchange="window.updateCommTemplatePreview('${leadId}', '${bookingId}')">
              ${templates.map(t => `
                <option value="${t.id}" ${t.id === preselectedTemplateId ? 'selected' : ''}>
                  [${t.channel.toUpperCase()}] ${t.name}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Message Text Preview & Edit Area -->
          <div>
            <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Message Content (Variables Auto-Merged):</label>
            <textarea id="comm-message-body" rows="7" 
              style="width: 100%; margin-top: 4px; background: #F8F9FA; border: 1.5px solid #D1D5DB; color: #111827; padding: 12px; border-radius: var(--radius-sm); font-size: 13px; line-height: 1.5; font-family: monospace;">${initialBody}</textarea>
          </div>

          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 10px 14px; border-radius: var(--radius-md); font-size: 12px; color: #1D4ED8;">
            ℹ️ Dispatched message will be logged immediately to the customer's CRM activity timeline and softphone conversation thread.
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('comm-modal-overlay')">Cancel</button>
          <button class="btn btn-coral" onclick="window.submitCommDispatch('${leadId}', '${bookingId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Dispatch Notification
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
};

window.selectCommChannel = function(channel) {
  const hidden = document.getElementById('comm-selected-channel');
  if (hidden) hidden.value = channel;

  ['whatsapp', 'email', 'sms'].forEach(ch => {
    const btn = document.getElementById(`comm-channel-${ch}`);
    if (btn) {
      if (ch === channel) {
        btn.className = 'btn btn-sm btn-dark';
      } else {
        btn.className = 'btn btn-sm btn-secondary';
      }
    }
  });
};

window.updateCommTemplatePreview = function(leadId, bookingId) {
  const state = window.store.state;
  const lead = state.leads?.find(l => l.id === leadId);
  const booking = state.bookings?.find(b => b.id === bookingId);
  const templates = state.templates || [];
  const project = state.projects?.find(p => p.id === (lead?.project_id || booking?.project_id)) || state.projects[0];

  const tplId = document.getElementById('comm-template-select')?.value;
  const selectedTpl = templates.find(t => t.id === tplId);
  if (!selectedTpl) return;

  const recipientName = lead ? lead.name : (booking ? booking.customer_name : 'Valued Buyer');
  let text = selectedTpl.body
    .replace(/\{\{lead_name\}\}/g, recipientName)
    .replace(/\{\{buyer_name\}\}/g, recipientName)
    .replace(/\{\{project_name\}\}/g, project.name)
    .replace(/\{\{project_id\}\}/g, project.id)
    .replace(/\{\{project_location\}\}/g, project.location)
    .replace(/\{\{project_lat\}\}/g, project.latitude || '19.0178')
    .replace(/\{\{project_lng\}\}/g, project.longitude || '72.8172')
    .replace(/\{\{unit_number\}\}/g, booking ? booking.unit_number : 'A-401')
    .replace(/\{\{assigned_rep_name\}\}/g, lead ? lead.assigned_rep_name : 'Priya Kulkarni')
    .replace(/\{\{assigned_rep_phone\}\}/g, '+91 98204 44556')
    .replace(/\{\{scheduled_time\}\}/g, 'Saturday 11:30 AM')
    .replace(/\{\{chauffeur_status\}\}/g, 'Driver Assigned')
    .replace(/\{\{vehicle_number\}\}/g, 'MH-01-EQ-4422');

  const textarea = document.getElementById('comm-message-body');
  if (textarea) textarea.value = text;

  window.selectCommChannel(selectedTpl.channel);
};

window.submitCommDispatch = async function(leadId, bookingId) {
  const channel = document.getElementById('comm-selected-channel')?.value || 'whatsapp';
  const template_id = document.getElementById('comm-template-select')?.value;
  const custom_body = document.getElementById('comm-message-body')?.value;

  window.closeModal('comm-modal-overlay');

  try {
    const res = await fetch('/v1/communications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId, booking_id: bookingId, channel, template_id, custom_body })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(res.message, 'success');
      await window.store.refreshAll();
    }
  } catch (err) {
    window.showToast?.('Dispatch failed: ' + err.message, 'danger');
  }
};
