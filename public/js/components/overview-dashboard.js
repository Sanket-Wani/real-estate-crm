// Simplesphere OS — Overview Dashboard Component (Professional SVG Icons, No Emojis)
// Modeled directly after the user's reference UI image:
// - Top Bar: Interactive Timeframe Switcher [Today, This Week, This Month, Q3 FY26, FY26 YTD]
// - Left: Total Collections, RERA Escrow Breakdown, Project Allocation Switcher, Payment Scheme Frameworks
// - Center: 2x2 Metric Grid with vibrant Coral-Orange hero card & Jarvis AI Telephony banner
// - Right: Milestone Realization Bar Chart & Real Estate Conversion Funnel
// - Bottom: "Recent Inbound & Pipeline Activities" table with interactive category filters, phone/WhatsApp/cost-sheet quick actions

window._overviewTimeframe = window._overviewTimeframe || 'month';
window._overviewStageFilter = window._overviewStageFilter || 'all';

function renderOverviewDashboard(container, state) {
  const leads = state.leads || [];
  const matrix = state.currentMatrix || {};
  const stats = matrix.stats || { available: 24, held: 3, booked: 10, sold: 15 };
  const currentProject = state.projects?.find(p => p.id === state.currentProject) || state.projects?.[0] || {};
  const activeUser = state.currentUser || { name: 'Vikram Malhotra', role: 'admin' };

  // Multiplier based on timeframe
  const tfConfig = {
    today: { mult: 0.08, label: 'Today', trend: '↑ 14.2% vs yesterday', invoiced: '₹0.75 Cr', collected: '₹0.68 Cr', calls: 42, visits: 3 },
    week:  { mult: 0.28, label: 'This Week', trend: '↑ 11.5% vs last week', invoiced: '₹2.40 Cr', collected: '₹2.15 Cr', calls: 184, visits: 8 },
    month: { mult: 1.0,  label: 'This Month', trend: '↑ 8.4% than last month', invoiced: '₹9.50 Cr', collected: '₹8.78 Cr', calls: 640, visits: 18 },
    q3:    { mult: 2.8,  label: 'Q3 FY26', trend: '↑ 19.1% vs Q2 target', invoiced: '₹26.5 Cr', collected: '₹24.2 Cr', calls: 1920, visits: 52 },
    ytd:   { mult: 7.5,  label: 'FY26 YTD', trend: '↑ 24.6% YoY growth', invoiced: '₹71.2 Cr', collected: '₹68.9 Cr', calls: 5400, visits: 148 }
  }[window._overviewTimeframe] || { mult: 1.0, label: 'This Month', trend: '↑ 8.4% than last month', invoiced: '₹9.50 Cr', collected: '₹8.78 Cr', calls: 640, visits: 18 };

  // Dynamic calculations
  const totalAgVal = ((state.bookings || []).reduce((acc, b) => acc + (b.agreement_value || 58000000), 0) + 689000000) * tfConfig.mult;
  const formattedRevCr = (totalAgVal / 100000000).toFixed(1);
  const escrowCr = (Number(formattedRevCr) * 0.70).toFixed(1);
  const operationalCr = (Number(formattedRevCr) * 0.30).toFixed(1);

  // Filter leads for the activities table
  let filteredLeads = leads;
  if (window._overviewStageFilter === 'booked') {
    filteredLeads = leads.filter(l => l.stage === 'booked' || l.stage === 'booking_initiated');
  } else if (window._overviewStageFilter === 'visit') {
    filteredLeads = leads.filter(l => l.stage === 'visit_scheduled' || l.stage === 'visit_completed');
  } else if (window._overviewStageFilter === 'negotiation') {
    filteredLeads = leads.filter(l => l.stage === 'negotiation');
  } else if (window._overviewStageFilter === 'jarvis') {
    filteredLeads = leads.filter(l => (l.jarvis_score || 0) >= 80);
  }

  container.innerHTML = `
    <div class="module-page-container fade-in" style="max-width: 1400px; margin: 0 auto; padding: 10px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Timeframe Horizon Pill Filter Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: #FFFFFF; padding: 10px 18px; border-radius: var(--radius-card); border: 1px solid var(--border-card); box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 13px; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Reporting Horizon:
          </span>
          <div style="display: flex; gap: 4px; background: var(--bg-canvas); padding: 3px; border-radius: var(--radius-pill);">
            ${['today', 'week', 'month', 'q3', 'ytd'].map(tf => {
              const names = { today: 'Today', week: 'This Week', month: 'This Month', q3: 'Q3 FY26', ytd: 'FY26 YTD' };
              const isActive = window._overviewTimeframe === tf;
              return `
                <button class="time-filter-pill ${isActive ? 'active' : ''}" 
                  style="border: none; padding: 5px 14px; border-radius: var(--radius-pill); font-size: 12px; font-weight: ${isActive ? '700' : '500'}; background: ${isActive ? 'var(--accent-dark)' : 'transparent'}; color: ${isActive ? '#FFFFFF' : 'var(--text-secondary)'}; cursor: pointer; transition: all var(--transition-fast);"
                  onclick="window.setOverviewTimeframe('${tf}')">
                  ${names[tf]}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 12px; color: var(--text-muted);">Current Active Project:</span>
          <span style="font-size: 12.5px; font-weight: 700; background: #FFF1EE; color: var(--accent-coral); padding: 4px 12px; border-radius: var(--radius-pill); border: 1px solid rgba(255, 91, 55, 0.2); display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
            ${currentProject.name || 'The Grand Solitaire'}
          </span>
        </div>
      </div>

      <!-- Top 3-Column Grid -->
      <div class="overview-dashboard-grid">
        
        <!-- Left Column: Balance & Project Allocation Cards -->
        <div class="overview-left-col">
          <!-- Total Balance Card -->
          <div class="card balance-card">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Total Realized Collections</span>
              <div style="font-size: 12px; font-weight: 600; color: var(--text-primary); background: var(--bg-input); padding: 4px 10px; border-radius: var(--radius-pill); display: flex; align-items: center; gap: 6px;">
                <span>INR (₹)</span>
              </div>
            </div>

            <div>
              <div class="balance-amount">₹${formattedRevCr} Cr</div>
              <div class="trend-badge" style="margin-top: 4px;">
                <span>${tfConfig.trend}</span>
              </div>
            </div>

            <!-- Escrow vs Current Account Breakdown Pills -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; padding: 10px; background: #F8F9FA; border-radius: var(--radius-sm); border: 1px solid #E5E7EB;">
              <div>
                <span style="font-size: 10.5px; color: #6B7280; font-weight: 600; display: block;">70% RERA ESCROW</span>
                <strong style="font-size: 13px; color: #047857;">₹${escrowCr} Cr</strong>
              </div>
              <div style="border-left: 1px solid #E5E7EB; padding-left: 8px;">
                <span style="font-size: 10.5px; color: #6B7280; font-weight: 600; display: block;">30% OPERATIONAL</span>
                <strong style="font-size: 13px; color: #111827;">₹${operationalCr} Cr</strong>
              </div>
            </div>

            <!-- Dual Action Pill Buttons -->
            <div class="balance-actions-row">
              <button class="btn btn-dark" onclick="window.openNewLeadModal()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Inbound Lead</span>
              </button>
              <button class="btn btn-subtle" onclick="window.openReportsExportModal()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Export CSV</span>
              </button>
            </div>

            <!-- Sub-Projects Interactive Switcher -->
            <div style="margin-top: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-muted); font-weight: 700; margin-bottom: 6px;">
                <span>PROJECT REVENUE ALLOCATION</span>
                <span>SWITCH VIEW</span>
              </div>
              <div class="sub-wallets-row">
                <div class="sub-wallet-item ${currentProject.id === 'proj-solitaire' ? 'active-wallet' : ''}" 
                  onclick="window.store.setCurrentProject('proj-solitaire')" style="cursor: pointer;" title="Filter by The Grand Solitaire">
                  <div class="sub-wallet-header">
                    <span>Solitaire</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
                  </div>
                  <div class="sub-wallet-value">₹42.5 Cr</div>
                  <div class="sub-wallet-tag" style="color: var(--accent-emerald);">● Worli Prime</div>
                </div>
                <div class="sub-wallet-item ${currentProject.id === 'proj-aurelia' ? 'active-wallet' : ''}" 
                  onclick="window.store.setCurrentProject('proj-aurelia')" style="cursor: pointer;" title="Filter by Aurelia Residences">
                  <div class="sub-wallet-header">
                    <span>Aurelia</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div class="sub-wallet-value">₹18.4 Cr</div>
                  <div class="sub-wallet-tag" style="color: var(--accent-blue);">● Thane Forest</div>
                </div>
                <div class="sub-wallet-item" 
                  onclick="window.showToast('NRI Desk Portfolio Filter applied', 'info')" style="cursor: pointer;" title="Filter by NRI Global Desk">
                  <div class="sub-wallet-header">
                    <span>NRI Desk</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <div class="sub-wallet-value">₹8.0 Cr</div>
                  <div class="sub-wallet-tag" style="color: var(--accent-coral);">● UAE / US</div>
                </div>
              </div>
            </div>
          </div>

          <!-- RERA Milestone Escrow Target Card -->
          <div class="card progress-limit-card">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 13.5px; font-weight: 700; color: var(--text-primary);">RERA Escrow Target (70%)</span>
              <span style="font-size: 11px; color: var(--accent-coral); font-weight: 700;">Sec 4(2)(l)(D)</span>
            </div>
            
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: 71%;"></div>
            </div>

            <div class="progress-labels-row">
              <span><strong>₹${escrowCr} Cr</strong> realized into Escrow</span>
              <span style="font-weight: 700; color: var(--text-primary);">₹20.0 Cr Target</span>
            </div>
          </div>

          <!-- Payment Scheme Stylized Mini Cards -->
          <div class="card" style="padding: 16px 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Payment Scheme Options</span>
              <button class="btn btn-subtle btn-sm" style="padding: 3px 10px; font-size: 11px;" onclick="window.store.setTab('cost-sheets')">
                + View Cost Sheets
              </button>
            </div>

            <div class="mini-cards-row">
              <div class="mini-scheme-card dark" onclick="window.store.setTab('cost-sheets')">
                <div style="font-size: 10px; opacity: 0.8; font-weight: 600; text-transform: uppercase;">CLP Schedule</div>
                <div>
                  <div style="font-size: 14px; font-weight: 800;">8 Milestones</div>
                  <div style="font-size: 10px; opacity: 0.8;">Slab-Linked RERA</div>
                </div>
              </div>
              <div class="mini-scheme-card coral" onclick="window.store.setTab('cost-sheets')">
                <div style="font-size: 10px; opacity: 0.9; font-weight: 600; text-transform: uppercase;">DPP Cash Rebate</div>
                <div>
                  <div style="font-size: 14px; font-weight: 800;">8% Upfront</div>
                  <div style="font-size: 10px; opacity: 0.9;">Instant ~₹47.2L Off</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Center Column: 2x2 Vibrant Metric Grid -->
        <div class="overview-center-col">
          <div class="metrics-2x2-grid">
            <!-- Hero Coral Metric Card -->
            <div class="metric-tile hero-coral">
              <div class="metric-tile-header">
                <span>Total Invoiced Demand</span>
                <div class="metric-tile-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                </div>
              </div>
              <div>
                <div class="metric-tile-value">${tfConfig.invoiced}</div>
                <div class="metric-tile-footer">↑ 12.4% realization rate</div>
              </div>
            </div>

            <!-- Metric Card 2: Available Inventory -->
            <div class="metric-tile">
              <div class="metric-tile-header">
                <span>Available Inventory</span>
                <div class="metric-tile-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
                </div>
              </div>
              <div>
                <div class="metric-tile-value">${stats.available || 24} Units</div>
                <div class="metric-tile-footer" style="color: var(--accent-amber); font-weight: 600;">
                  ${stats.held || 3} Locked in Token Hold
                </div>
              </div>
            </div>

            <!-- Metric Card 3: Site Visits Verified -->
            <div class="metric-tile">
              <div class="metric-tile-header">
                <span>Site Visits Verified</span>
                <div class="metric-tile-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
              </div>
              <div>
                <div class="metric-tile-value">${tfConfig.visits} Visits</div>
                <div class="metric-tile-footer" style="color: var(--accent-emerald); font-weight: 600;">
                  ↑ 85% Geofence Verified
                </div>
              </div>
            </div>

            <!-- Metric Card 4: CP Brokerage Disbursed -->
            <div class="metric-tile">
              <div class="metric-tile-header">
                <span>Brokerage Disbursed</span>
                <div class="metric-tile-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>
                </div>
              </div>
              <div>
                <div class="metric-tile-value">₹85.0 L</div>
                <div class="metric-tile-footer" style="color: var(--text-muted);">
                  Sec 194H TDS 5% Deducted
                </div>
              </div>
            </div>
          </div>

          <!-- Middle Banner: Jarvis AI Autonomous Voice Agent Quick Action -->
          <div class="card" style="background: linear-gradient(135deg, #181B22 0%, #0F1218 100%); color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-radius: var(--radius-card);">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 91, 55, 0.2); display: flex; align-items: center; justify-content: center; color: var(--brand-coral);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              </div>
              <div>
                <h4 style="font-size: 15px; font-weight: 700; color: #FFFFFF;">Jarvis AI Voice Telephony Bot Active</h4>
                <p style="font-size: 12px; color: #9CA3AF; margin-top: 2px;">
                  ${tfConfig.calls} autonomous buyer dialogues conducted • 96% qualification accuracy
                </p>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm" style="color: #FFFFFF; border-color: rgba(255,255,255,0.2);" onclick="window.store.setTab('jarvis-voice')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                Telephony Studio
              </button>
              <button class="btn btn-coral btn-sm" onclick="window.openNewLeadModal()">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Ingest Lead
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Dual-Tone Bar Chart & Funnel -->
        <div class="overview-right-col">
          <div class="card income-chart-card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                <div>
                  <h3 class="card-title">Milestone Realization</h3>
                  <p class="card-subtitle">Invoiced vs Collected by Month</p>
                </div>
                <div class="chart-legend-row">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div class="legend-dot" style="background: var(--accent-coral);"></div>
                    <span>Invoiced</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div class="legend-dot" style="background: var(--accent-dark);"></div>
                    <span>Collected</span>
                  </div>
                </div>
              </div>

              <!-- Dual Bar Chart Visual -->
              <div class="chart-bars-container" style="margin-top: 14px;">
                ${[
                  { month: 'Jan', invoiced: 45, collected: 30 },
                  { month: 'Feb', invoiced: 60, collected: 42 },
                  { month: 'Mar', invoiced: 52, collected: 40 },
                  { month: 'Apr', invoiced: 75, collected: 58 },
                  { month: 'May', invoiced: 85, collected: 65 },
                  { month: 'Jun', invoiced: 95, collected: 78 },
                  { month: 'Jul', invoiced: 70, collected: 55 },
                  { month: 'Aug', invoiced: 82, collected: 68 }
                ].map(bar => `
                  <div class="chart-bar-group">
                    <div class="dual-bar-stack">
                      <div class="bar-segment-coral" style="height: ${bar.invoiced}px;" title="Invoiced: ₹${bar.invoiced}L"></div>
                      <div class="bar-segment-dark" style="height: ${bar.collected}px;" title="Collected: ₹${bar.collected}L"></div>
                    </div>
                    <span class="chart-bar-label">${bar.month}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Mini Real Estate Conversion Funnel -->
            <div style="background: #F8F9FA; padding: 12px; border-radius: var(--radius-sm); border: 1px solid #E5E7EB; margin-top: 12px;">
              <div style="font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 6px;">
                Conversion Velocity Funnel
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; text-align: center;">
                <div>
                  <strong style="color: var(--text-primary); display: block;">100%</strong>
                  <span style="color: var(--text-muted); font-size: 10px;">Leads</span>
                </div>
                <div>→</div>
                <div>
                  <strong style="color: var(--accent-blue); display: block;">64%</strong>
                  <span style="color: var(--text-muted); font-size: 10px;">Qualified</span>
                </div>
                <div>→</div>
                <div>
                  <strong style="color: var(--accent-coral); display: block;">28%</strong>
                  <span style="color: var(--text-muted); font-size: 10px;">Visits</span>
                </div>
                <div>→</div>
                <div>
                  <strong style="color: var(--accent-emerald); display: block;">9.5%</strong>
                  <span style="color: var(--text-muted); font-size: 10px;">Booked</span>
                </div>
              </div>
            </div>

            <!-- Chart Footer Metrics -->
            <div style="display: flex; justify-content: space-between; padding-top: 10px; font-size: 12px; color: var(--text-secondary); border-top: 1px solid #F3F4F6;">
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 11px;">COLLECTION RECOVERY</span>
                <strong style="font-size: 14px; color: var(--accent-emerald);">92.4% Realized</strong>
              </div>
              <div style="text-align: right;">
                <span style="color: var(--text-muted); display: block; font-size: 11px;">AVG TURNAROUND</span>
                <strong style="font-size: 14px; color: var(--text-primary);">4.2 Days</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Row: Recent Activities Data Table -->
      <div class="card activities-table-card">
        <div class="table-toolbar" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 class="card-title">Recent Inbound & Pipeline Activities</h3>
            <p class="card-subtitle">Real-time omnichannel inquiries, bookings, and site visit logs</p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <!-- Category Filter Tabs -->
            <div style="display: flex; gap: 4px; background: var(--bg-canvas); padding: 3px; border-radius: var(--radius-pill);">
              ${[
                { id: 'all', label: 'All Activities' },
                { id: 'booked', label: 'Closed Booked' },
                { id: 'visit', label: 'Site Visits' },
                { id: 'negotiation', label: 'Negotiations' },
                { id: 'jarvis', label: 'AI Qualified' }
              ].map(f => {
                const isActive = window._overviewStageFilter === f.id;
                return `
                  <button style="border: none; padding: 4px 12px; border-radius: var(--radius-pill); font-size: 11.5px; font-weight: ${isActive ? '700' : '500'}; background: ${isActive ? 'var(--accent-dark)' : 'transparent'}; color: ${isActive ? '#FFFFFF' : 'var(--text-secondary)'}; cursor: pointer; transition: all var(--transition-fast);"
                    onclick="window.setOverviewStageFilter('${f.id}')">
                    ${f.label}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Search Box -->
            <div class="table-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="recent-activities-search" placeholder="Search buyer, unit, or phone..." oninput="window.filterActivitiesTable(this.value)" />
            </div>
            
            <button class="btn btn-secondary btn-sm" onclick="window.openReportsExportModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Export</span>
            </button>
          </div>
        </div>

        <div class="data-table-wrapper">
          <table class="clean-table" id="activities-table-element">
            <thead>
              <tr>
                <th style="width: 32px;"><input type="checkbox" /></th>
                <th>Order / Lead ID</th>
                <th>Activity / Buyer</th>
                <th>Ticket Size</th>
                <th>Jarvis Score</th>
                <th>Status</th>
                <th>Assigned Rep</th>
                <th>Date & Time</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLeads.slice(0, 8).map((lead, idx) => {
                const statusConfig = {
                  'booked': { label: 'Booked', class: 'status-completed' },
                  'booking_initiated': { label: 'Booking Form', class: 'status-blue' },
                  'negotiation': { label: 'Under Offer', class: 'status-progress' },
                  'visit_scheduled': { label: 'Visit Scheduled', class: 'status-blue' },
                  'visit_completed': { label: 'Visit Completed', class: 'status-completed' },
                  'pre_qualified': { label: 'Pre-Qualified', class: 'status-progress' },
                  'contacted': { label: 'Contacted', class: 'status-pending' }
                }[lead.stage] || { label: 'In Progress', class: 'status-progress' };

                const ticketCr = ((lead.budget_min || 55000000) / 10000000).toFixed(2);
                const dateStr = new Date(lead.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                return `
                  <tr>
                    <td><input type="checkbox" /></td>
                    <td style="font-family: monospace; font-weight: 700; color: var(--text-secondary);">${lead.id.toUpperCase()}</td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 34px; height: 34px; border-radius: 50%; background: ${idx % 2 === 0 ? 'var(--accent-coral-subtle)' : 'var(--accent-blue-subtle)'}; color: ${idx % 2 === 0 ? 'var(--accent-coral)' : 'var(--accent-blue)'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">
                          ${lead.name.charAt(0)}
                        </div>
                        <div>
                          <strong style="color: var(--text-primary); display: block;">${lead.name}</strong>
                          <span style="font-size: 11px; color: var(--text-muted);">${lead.project_name || 'The Grand Solitaire'} • ${lead.source.toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td style="font-weight: 700; color: var(--text-primary);">₹${ticketCr} Cr</td>
                    <td>
                      <span class="jarvis-pill" title="Jarvis AI Intent Score" style="display: inline-flex; align-items: center; gap: 4px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/></svg>
                        ${lead.jarvis_score || 88}
                      </span>
                    </td>
                    <td>
                      <span class="status-pill ${statusConfig.class}">
                        <span class="status-dot"></span>
                        <span>${statusConfig.label}</span>
                      </span>
                    </td>
                    <td>
                      <span style="font-size: 12.5px; color: var(--text-secondary);">${lead.assigned_rep_name || 'Priya Kulkarni'}</span>
                    </td>
                    <td style="font-size: 12px; color: var(--text-muted);">${dateStr}</td>
                    <td style="text-align: right;">
                      <div style="display: inline-flex; gap: 4px;">
                        <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 11px;" title="Virtual Dialer" onclick="window.openDialerModal('${lead.id}')">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </button>
                        <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 11px;" title="WhatsApp" onclick="window.openLeadDetailsModal('${lead.id}', 'whatsapp')">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        </button>
                        <button class="btn btn-subtle btn-sm" style="padding: 4px 10px; font-size: 11.5px;" onclick="window.openLeadDetailsModal('${lead.id}')">
                          Inspect →
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

window.setOverviewTimeframe = function(tf) {
  window._overviewTimeframe = tf;
  const mainContent = document.getElementById('main-content-viewport') || document.getElementById('main-content');
  if (mainContent) {
    renderOverviewDashboard(mainContent, window.store.state);
  }
};

window.setOverviewStageFilter = function(stageId) {
  window._overviewStageFilter = stageId;
  const mainContent = document.getElementById('main-content-viewport') || document.getElementById('main-content');
  if (mainContent) {
    renderOverviewDashboard(mainContent, window.store.state);
  }
};

window.filterActivitiesTable = function(query) {
  const q = String(query).toLowerCase();
  const rows = document.querySelectorAll('#activities-table-element tbody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
};

window.renderOverviewDashboard = renderOverviewDashboard;
