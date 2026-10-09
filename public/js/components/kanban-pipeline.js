// Simplesphere OS — Sales Pipeline & Kanban Funnel Component
// Meticulously implemented directly from Stitch Screen:
// "Simplesphere OS — Real Estate Sales Pipeline & Kanban Funnel" (stitch_pipeline_screen.html)
// Ultra-clean Finexy light theme with strict zero-overlap and zero-wrapping guarantees.

window._pipelineFilter = window._pipelineFilter || 'all';

function renderKanbanPipeline(container, state) {
  const leads = state.leads || [];

  const stages = [
    { id: 'new', label: 'New Enquiries', dotColor: '#FF5B37' },
    { id: 'contacted', label: 'Contacted / AI Qualified', dotColor: '#38BDF8' },
    { id: 'visit_scheduled', label: 'Visit Scheduled', dotColor: '#3B82F6' },
    { id: 'visit_completed', label: 'Visit Completed', dotColor: '#10B981' },
    { id: 'negotiation', label: 'Negotiation / Cost Sheet', dotColor: '#8B5CF6' },
    { id: 'booking_initiated', label: 'Booking Form Drafted', dotColor: '#EC4899' }
  ];

  // Pipeline Filter Logic
  let filteredLeads = leads;
  if (window._pipelineFilter === 'hot') {
    filteredLeads = leads.filter(l => (l.jarvis_score || 0) >= 80);
  } else if (window._pipelineFilter === 'warm') {
    filteredLeads = leads.filter(l => (l.jarvis_score || 0) >= 50 && (l.jarvis_score || 0) < 80);
  } else if (window._pipelineFilter === 'sla') {
    filteredLeads = leads.filter(l => l.stage === 'new' && l.first_response_due_at);
  } else if (window._pipelineFilter === 'my') {
    filteredLeads = leads.filter(l => l.assigned_rep_name?.includes('Priya') || l.assigned_rep_name?.includes('Vikram'));
  }

  // Calculate Executive Metrics
  const totalPipelineVal = leads.reduce((acc, l) => acc + (l.budget_max || 60000000), 0);
  const totalPipelineCr = (totalPipelineVal / 10000000).toFixed(1);
  const hotLeadsCount = leads.filter(l => (l.jarvis_score || 0) >= 80).length;
  const scheduledVisitsCount = leads.filter(l => l.stage === 'visit_scheduled').length;

  let html = `
    <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 6px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. HEADER BAR & INGESTION CONTROLS (from stitch_pipeline_screen.html) -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 2px;">
        <div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 6px;">
            <h2 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
              Real Estate Sales Pipeline & Funnel
            </h2>
            <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 9999px; background: rgba(16,185,129,0.12); color: #065F46; border: 1px solid rgba(16,185,129,0.25); font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
              JARVIS AI ACTIVE
            </span>
          </div>
          <p style="font-size: 13px; color: #667085; margin: 0; white-space: nowrap;">
            Pre-Sales & Direct Sales Funnel with Jarvis AI Intent Scoring & Dynamic Stage Tracking
          </p>
        </div>

        <!-- Quick Action Cluster -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="finexy-filter-btn" onclick="window.store.refreshLeads()" style="white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
            <span>Refresh Leads</span>
          </button>
          <button class="btn btn-primary" onclick="window.openNewLeadModal()" style="border-radius: 12px; height: 38px; padding: 0 16px; font-weight: 600; font-size: 13px; white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>+ Ingest Inbound Lead</span>
          </button>
        </div>
      </div>

      <!-- 2. HORIZONTAL CAPSULE FILTER TRACK (from stitch_pipeline_screen.html) -->
      <div class="custom-scrollbar" style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
        <button class="finexy-capsule-btn ${window._pipelineFilter === 'all' ? 'active' : ''}" onclick="window._pipelineFilter='all'; window.store.notify();" style="white-space: nowrap;">
          <span>All Leads (${leads.length})</span>
        </button>
        <button class="finexy-capsule-btn ${window._pipelineFilter === 'hot' ? 'active' : ''}" onclick="window._pipelineFilter='hot'; window.store.notify();" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #10B981;"></span>
          <span>Hot Intent (80%+) (${hotLeadsCount})</span>
        </button>
        <button class="finexy-capsule-btn ${window._pipelineFilter === 'warm' ? 'active' : ''}" onclick="window._pipelineFilter='warm'; window.store.notify();" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #F59E0B;"></span>
          <span>Warm Intent (50-79%)</span>
        </button>
        <button class="finexy-capsule-btn ${window._pipelineFilter === 'sla' ? 'active' : ''}" onclick="window._pipelineFilter='sla'; window.store.notify();" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>SLA Due Today</span>
        </button>
        <button class="finexy-capsule-btn ${window._pipelineFilter === 'my' ? 'active' : ''}" onclick="window._pipelineFilter='my'; window.store.notify();" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>My Assigned Leads</span>
        </button>
      </div>

      <!-- 3. 4-TILE EXECUTIVE KPI ROW (from stitch_pipeline_screen.html) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        <!-- Tile 1: Vibrant Solid Coral (#FF5B37 with White Text) -->
        <div class="finexy-stat-coral" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label">PIPELINE VALUE</span>
            <div class="finexy-icon-bubble bubble-coral">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1;">₹${totalPipelineCr} Cr</div>
            <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; padding: 2px 8px; border-radius: 9999px; background: rgba(255,255,255,0.2); font-size: 12px; font-weight: 600; white-space: nowrap;">
              <span>↑ 18.2% vs target</span>
            </div>
          </div>
        </div>

        <!-- Tile 2: Total Active Leads -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">TOTAL ACTIVE LEADS</span>
            <div class="finexy-icon-bubble bubble-gray">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">${leads.length} Leads</div>
            <div style="font-size: 13px; color: #667085; font-weight: 500; margin-top: 6px;">${hotLeadsCount} High-Intent Qualified</div>
          </div>
        </div>

        <!-- Tile 3: Scheduled Visits -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">SCHEDULED VISITS</span>
            <div class="finexy-icon-bubble" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #2563EB;">${scheduledVisitsCount} Visits</div>
            <div style="font-size: 13px; color: #1D4ED8; font-weight: 600; margin-top: 6px;">Chauffeur Valet Allocated</div>
          </div>
        </div>

        <!-- Tile 4: Average Sales Velocity -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">AVG SALES VELOCITY</span>
            <div class="finexy-icon-bubble" style="background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">14.2 Days</div>
            <div style="font-size: 13px; color: #059669; font-weight: 600; margin-top: 6px;">Lead to EOI Token Velocity</div>
          </div>
        </div>
      </div>

      <!-- 4. KANBAN 6-STAGE PIPELINE BOARD (from stitch_pipeline_screen.html) -->
      <div class="stitch-kanban-board custom-scrollbar" id="kanban-wrapper-board">
  `;

  for (const stg of stages) {
    const colLeads = filteredLeads.filter(l => l.stage === stg.id);
    const colVal = colLeads.reduce((acc, l) => acc + (l.budget_max || 60000000), 0);
    const colValCr = (colVal / 10000000).toFixed(1);

    html += `
      <div class="stitch-kanban-col" id="kanban-col-${stg.id}"
        ondragover="window.handleDragOverCol(event, this)" 
        ondragenter="window.handleDragOverCol(event, this)" 
        ondragleave="window.handleDragLeaveCol(event, this)" 
        ondrop="window.handleDropLead(event, '${stg.id}')">
        
        <!-- Column Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1.5px solid rgba(0,0,0,0.06); gap: 6px;">
          <div style="display: flex; align-items: center; gap: 7px; min-width: 0; flex: 1;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${stg.dotColor}; flex-shrink: 0;"></span>
            <span style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #111318; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${stg.label}">${stg.label}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <span style="font-family: 'Outfit', sans-serif; font-size: 11.5px; font-weight: 700; color: #667085; white-space: nowrap;">₹${colValCr}Cr</span>
            <span style="padding: 2px 7px; border-radius: 9999px; background: #FFFFFF; font-size: 11px; font-weight: 700; color: #111318; border: 1px solid rgba(0,0,0,0.08); white-space: nowrap;">${colLeads.length}</span>
          </div>
        </div>

        <!-- Cards List -->
        <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
          ${colLeads.map(lead => {
            // SLA calculation
            let slaHtml = '';
            if (stg.id === 'new' && lead.first_response_due_at) {
              const diffMs = new Date(lead.first_response_due_at) - new Date();
              if (diffMs > 0) {
                const mins = Math.floor(diffMs / 60000);
                const secs = Math.floor((diffMs % 60000) / 1000);
                slaHtml = `
                  <div style="display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #D97706; background: #FFFBEB; padding: 4px 8px; border-radius: 8px; border: 1px solid #FDE68A; white-space: nowrap;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>SLA: ${mins}m ${secs < 10 ? '0' : ''}${secs}s remaining</span>
                  </div>
                `;
              } else {
                slaHtml = `
                  <div style="display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #B91C1C; background: #FEF2F2; padding: 4px 8px; border-radius: 8px; border: 1px solid #FECACA; white-space: nowrap;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>SLA Breached • Escalation</span>
                  </div>
                `;
              }
            }

            const budgetText = lead.budget_min && lead.budget_max
              ? `₹${(lead.budget_min / 10000000).toFixed(1)} - ${(lead.budget_max / 10000000).toFixed(1)} Cr`
              : 'Budget Undefined';

            const score = lead.jarvis_score || 75;
            const scoreColor = score >= 85 ? '#065F46' : score >= 70 ? '#92400E' : '#475569';
            const scoreBg = score >= 85 ? '#ECFDF5' : score >= 70 ? '#FFFBEB' : '#F1F5F9';
            const scoreBorder = score >= 85 ? 'rgba(16,185,129,0.3)' : score >= 70 ? '#FDE68A' : '#E2E8F0';

            return `
              <div class="stitch-lead-card" draggable="true"
                ondragstart="window.handleDragLead(event, '${lead.id}')"
                ondragend="document.querySelectorAll('.stitch-kanban-col').forEach(c => c.classList.remove('drag-over'))"
                onclick="window.openLeadDetailsModal('${lead.id}')">
                
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                  <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #111318; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${lead.name}">
                    ${lead.name}
                  </span>
                  <span style="padding: 2px 7px; border-radius: 9999px; background: ${scoreBg}; color: ${scoreColor}; border: 1px solid ${scoreBorder}; font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; white-space: nowrap; flex-shrink: 0;">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    ${score}
                  </span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #667085; white-space: nowrap; gap: 6px;">
                  <span style="padding: 2px 6px; border-radius: 6px; background: #F4F5F7; font-weight: 600; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px;" title="${lead.source || 'INBOUND'}">
                    ${lead.source || 'INBOUND'}
                  </span>
                  <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0;" title="Rep: ${lead.assigned_rep_name || 'Priya K.'}">
                    • Rep: ${(lead.assigned_rep_name || 'Priya K.').split(' ')[0]}
                  </span>
                </div>

                <div>
                  <div style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #111318; white-space: nowrap;">
                    ${budgetText}
                  </div>
                  <div style="font-size: 11.5px; color: #667085; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;" title="${lead.preferred_config || '3BHK Sea Suite'}">
                    ${lead.preferred_config || '3BHK Sea Suite'}
                  </div>
                </div>

                ${slaHtml}

                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 11.5px;" onclick="event.stopPropagation();">
                  <span style="color: #667085; font-weight: 500; white-space: nowrap; font-size: 11px;">Calls: ${lead.call_count || 0}</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <button class="finexy-icon-action-btn" onclick="window.openDialerModal('${lead.id}')" title="Virtual Dialer (Click to Call)" style="width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: #F4F5F7; display: inline-flex; align-items: center; justify-content: center; color: #111318; cursor: pointer; transition: all 0.15s ease;">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </button>
                    <button class="finexy-icon-action-btn" onclick="window.openLeadDetailsModal('${lead.id}', 'whatsapp')" title="WhatsApp Instant Chat" style="width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(16,185,129,0.25); background: #ECFDF5; display: inline-flex; align-items: center; justify-content: center; color: #065F46; cursor: pointer; transition: all 0.15s ease;">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    </button>
                  </div>
                </div>

              </div>
            `;
          }).join('')}

          <!-- Plain Drop Landing Pad without awkward text -->
          <div class="stitch-drop-pad" ondragover="event.preventDefault(); event.stopPropagation();" ondrop="window.handleDropLead(event, '${stg.id}')"></div>
        </div>

      </div>
    `;
  }

  html += `
      </div>

    </div>
  `;

  container.innerHTML = html;
}

// Global Drag & Drop Handlers
window.handleDragLead = function(event, leadId) {
  event.dataTransfer.setData('text/plain', leadId);
  event.dataTransfer.effectAllowed = 'move';
};

window.handleDragOverCol = function(event, colEl) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  if (colEl && !colEl.classList.contains('drag-over')) {
    colEl.classList.add('drag-over');
  }
};

window.handleDragLeaveCol = function(event, colEl) {
  if (colEl && event.relatedTarget && !colEl.contains(event.relatedTarget)) {
    colEl.classList.remove('drag-over');
  }
};

window.handleDropLead = async function(event, newStage) {
  event.preventDefault();
  event.stopPropagation();
  
  document.querySelectorAll('.stitch-kanban-col').forEach(c => c.classList.remove('drag-over'));

  const leadId = event.dataTransfer.getData('text/plain');
  if (!leadId) return;

  const lead = window.store.state.leads.find(l => l.id === leadId);
  if (lead && lead.stage !== newStage) {
    const oldStage = lead.stage;
    lead.stage = newStage;
    window.store.notify();

    try {
      const res = await fetch(`/v1/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      }).then(r => r.json());

      if (res.success) {
        window.showToast?.(`Lead moved to ${newStage.replace(/_/g, ' ').toUpperCase()}`, 'success');
      } else {
        lead.stage = oldStage;
        window.store.notify();
        window.showToast?.('Failed to update stage on server', 'danger');
      }
    } catch (err) {
      lead.stage = oldStage;
      window.store.notify();
      window.showToast?.('Network error updating lead stage', 'danger');
    }
  }
};

window.renderKanbanPipeline = renderKanbanPipeline;
