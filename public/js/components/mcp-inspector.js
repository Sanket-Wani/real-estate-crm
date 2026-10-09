// Simplesphere OS CRM — Model Context Protocol (MCP) Server Live Inspector (Light Theme)
function renderMCPInspector(container, state) {
  const tools = [
    {
      name: 'crm_get_inventory',
      desc: 'Query real estate project inventory, towers, units, availability, and pricing',
      sampleParams: { project_id: 'proj-solitaire', status: 'available' }
    },
    {
      name: 'crm_hold_unit',
      desc: 'Place a 15-minute concurrency-safe reservation lock on a specific unit',
      sampleParams: { unit_id: 'unit-sol-a-301', rep_name: 'AI Agent' }
    },
    {
      name: 'crm_generate_cost_sheet',
      desc: 'Calculate comprehensive price quotation including BSP, Floor Rise, PLC, Parking, GST, Stamp Duty',
      sampleParams: { unit_id: 'unit-sol-a-101', discount_pct: 1.5 }
    },
    {
      name: 'crm_get_lead_summary',
      desc: 'Fetch lead profile, Jarvis AI predictive intent score, factors, and communication history',
      sampleParams: { lead_id: 'lead-101' }
    },
    {
      name: 'crm_calculate_cp_brokerage',
      desc: 'Calculate Channel Partner slab brokerage, Section 194H TDS (5%), and GST (18%) invoicing',
      sampleParams: { agreement_value: 65000000 }
    },
    {
      name: 'crm_query_funnel_metrics',
      desc: 'Retrieve executive conversion metrics, pipeline stages, and drop-off rates',
      sampleParams: {}
    }
  ];

  let html = `
    <div class="module-page-container fade-in" style="max-width: 1400px; margin: 0 auto; padding: 10px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      <div class="page-header" style="margin-bottom: 0;">
        <div>
          <h2 class="page-title">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg></span> Model Context Protocol (MCP) Server Inspector
            <span class="badge" style="background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px;">
              JSON-RPC 2.0 Active
            </span>
          </h2>
          <p class="page-subtitle">Built-in Native MCP Endpoint (/v1/mcp) for Antigravity, Claude, ChatGPT & Cursor Agents</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Left: Tool Selector & Request Builder -->
        <div style="background: #FFFFFF; border: 1px solid var(--border-card); border-radius: var(--radius-card); box-shadow: var(--shadow-sm); padding: 22px;">
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 14px;">Select MCP Tool to Execute</h3>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${tools.map((t, idx) => `
              <div class="mcp-tool-item" id="tool-item-${t.name}" onclick="window.selectMCPTool('${t.name}', ${JSON.stringify(t.sampleParams).replace(/"/g, '&quot;')})" 
                style="padding: 12px 16px; background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s ease;">
                <div style="font-weight: 700; color: var(--accent-coral); font-family: monospace; font-size: 13.5px;">${t.name}</div>
                <div style="font-size: 11.5px; color: var(--text-secondary); margin-top: 3px;">${t.desc}</div>
              </div>
            `).join('')}
          </div>

          <div>
            <label style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">Request Arguments (JSON):</label>
            <textarea id="mcp-args-textarea" rows="6" 
              style="width: 100%; margin-top: 6px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 10px 14px; border-radius: var(--radius-sm); font-family: monospace; font-size: 12.5px; outline: none;"></textarea>
          </div>

          <button class="btn btn-coral" style="margin-top: 14px; width: 100%;" onclick="window.executeMCPCall()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Send JSON-RPC Tool Call
          </button>
        </div>

        <!-- Right: Real-time Response Output -->
        <div style="background: #FFFFFF; border: 1px solid var(--border-card); border-radius: var(--radius-card); box-shadow: var(--shadow-sm); padding: 22px; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin: 0;">Tool Execution Output</h3>
            <span id="mcp-status-tag" style="font-size: 11px; color: var(--text-muted); font-family: monospace; font-weight: 600;">Awaiting Call</span>
          </div>

          <pre id="mcp-response-pre" style="flex: 1; background: #111827; border: 1px solid #374151; border-radius: var(--radius-md); padding: 16px; overflow: auto; color: #10B981; font-family: monospace; font-size: 12px; min-height: 420px; white-space: pre-wrap; line-height: 1.4;">
// Click any MCP tool on the left to inspect and execute against the live database
          </pre>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Auto-select first tool
  setTimeout(() => {
    window.selectMCPTool('crm_get_inventory', { project_id: 'proj-solitaire', status: 'available' });
  }, 50);
}

window.selectedMCPToolName = 'crm_get_inventory';

window.selectMCPTool = function(toolName, params) {
  window.selectedMCPToolName = toolName;
  document.querySelectorAll('.mcp-tool-item').forEach(el => {
    el.style.borderColor = '#E5E7EB';
    el.style.background = '#F8F9FA';
  });
  const selectedEl = document.getElementById(`tool-item-${toolName}`);
  if (selectedEl) {
    selectedEl.style.borderColor = 'var(--accent-coral)';
    selectedEl.style.background = '#FFF1EE';
  }

  const textarea = document.getElementById('mcp-args-textarea');
  if (textarea) textarea.value = JSON.stringify(params, null, 2);
};

window.executeMCPCall = async function() {
  const toolName = window.selectedMCPToolName;
  const textarea = document.getElementById('mcp-args-textarea');
  const responsePre = document.getElementById('mcp-response-pre');
  const statusTag = document.getElementById('mcp-status-tag');

  let args = {};
  try {
    args = JSON.parse(textarea?.value || '{}');
  } catch (e) {
    if (responsePre) responsePre.innerText = 'Error: Invalid JSON arguments syntax';
    return;
  }

  if (statusTag) {
    statusTag.innerText = 'Executing...';
    statusTag.style.color = 'var(--accent-amber)';
  }

  try {
    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    };

    const res = await fetch('/v1/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (statusTag) {
      statusTag.innerText = '200 OK • Success';
      statusTag.style.color = '#10B981';
    }

    if (responsePre) {
      responsePre.innerText = JSON.stringify(res, null, 2);
    }
  } catch (err) {
    if (statusTag) {
      statusTag.innerText = 'Error';
      statusTag.style.color = 'var(--accent-rose)';
    }
    if (responsePre) {
      responsePre.innerText = 'Execution error: ' + err.message;
    }
  }
};
