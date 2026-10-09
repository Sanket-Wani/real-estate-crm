// Simplesphere OS CRM — Executive Revenue Cockpit & Analytics Component (Light Theme)
function renderAnalyticsCockpit(container, state) {
  const cockpit = state.cockpit || {
    kpis: {
      target_revenue: 250000000,
      achieved_revenue: 104250000,
      revenue_target_pct: 42,
      total_collections: 23712500,
      total_leads: 6,
      total_bookings: 1,
      site_visits: 2,
      cost_per_booking: 145000,
      cost_per_site_visit: 12500
    },
    funnel: {
      new: 1,
      contacted: 1,
      qualified: 0,
      visit_scheduled: 1,
      visit_completed: 0,
      negotiation: 1,
      booking_initiated: 1,
      booked: 1,
      lost: 1
    },
    leaderboard: []
  };

  const { kpis, funnel, leaderboard } = cockpit;

  let html = `
    <div class="module-page-container fade-in" style="max-width: 1400px; margin: 0 auto; padding: 10px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      <div class="page-header" style="margin-bottom: 0;">
        <div>
          <h2 class="page-title">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></span> Executive Revenue Cockpit
          </h2>
          <p class="page-subtitle">Real-Time PropTech Revenue Intelligence, Stage Drop-Off Funnel & Rep Leaderboard</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="window.store.refreshAll()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg> Refresh Metrics
          </button>
        </div>
      </div>

      <!-- Top Row Financial KPIs -->
      <div class="stats-grid">
        <div class="stat-card" style="border-left: 4px solid var(--accent-coral);">
          <div class="stat-label">Achieved Revenue <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg></span></div>
          <div class="stat-value" style="color: var(--accent-coral);">
            ₹${(kpis.achieved_revenue / 10000000).toFixed(2)} <span style="font-size: 14px; font-weight: normal; color: var(--text-muted);">Cr</span>
          </div>
          <div class="stat-sub positive">${kpis.revenue_target_pct}% of ₹${(kpis.target_revenue / 10000000).toFixed(0)} Cr Target</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--accent-emerald);">
          <div class="stat-label">Total Realized Collections <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></span></div>
          <div class="stat-value" style="color: var(--accent-emerald);">
            ₹${(kpis.total_collections / 100000).toFixed(2)} <span style="font-size: 14px; font-weight: normal; color: var(--text-muted);">L</span>
          </div>
          <div class="stat-sub positive">Direct Bank Reconciled</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--accent-blue);">
          <div class="stat-label">Cost-Per-Booking (CPB) <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span></div>
          <div class="stat-value" style="color: var(--accent-blue);">
            ₹${(kpis.cost_per_booking / 1000).toFixed(0)}k
          </div>
          <div class="stat-sub">Blended Meta + Portal Spend</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--accent-amber);">
          <div class="stat-label">Cost-Per-Site-Visit (CPSV) <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg></span></div>
          <div class="stat-value" style="color: var(--accent-amber);">
            ₹${(kpis.cost_per_site_visit / 1000).toFixed(1)}k
          </div>
          <div class="stat-sub positive">High Intent Walk-Ins</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Left: Sales Conversion Funnel -->
        <div style="background: #FFFFFF; border: 1px solid var(--border-card); border-radius: var(--radius-card); box-shadow: var(--shadow-sm); padding: 22px;">
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px;">
            Stage-by-Stage Conversion Funnel
          </h3>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${[
              { label: 'New Enquiries', count: funnel.new, color: 'var(--accent-coral)' },
              { label: 'Connected / Contacted', count: funnel.contacted, color: 'var(--accent-blue)' },
              { label: 'Site Visits Scheduled', count: funnel.visit_scheduled, color: 'var(--accent-amber)' },
              { label: 'Cost Sheets / Negotiation', count: funnel.negotiation, color: '#8B5CF6' },
              { label: 'Booking Form & Token', count: funnel.booking_initiated + funnel.booked, color: 'var(--accent-emerald)' }
            ].map(f => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 6px;">
                  <span style="color: var(--text-primary); font-weight: 600;">${f.label}</span>
                  <span style="font-weight: 700; color: ${f.color};">${f.count} Leads</span>
                </div>
                <div style="width: 100%; height: 9px; background: #E5E7EB; border-radius: 9999px; overflow: hidden;">
                  <div style="width: ${Math.max(15, (f.count / 6) * 100)}%; height: 100%; background: ${f.color}; border-radius: 9999px; transition: width 0.4s ease;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Sales Representative Productivity Leaderboard -->
        <div style="background: #FFFFFF; border: 1px solid var(--border-card); border-radius: var(--radius-card); box-shadow: var(--shadow-sm); padding: 22px;">
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px;">
            Sales Rep Productivity Leaderboard
          </h3>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${(leaderboard.length ? leaderboard : [
              { name: 'Amit Verma', bookings_closed: 1, revenue_closed: 94850000, total_calls: 8, total_talk_time_mins: 42 },
              { name: 'Priya Kulkarni', bookings_closed: 0, revenue_closed: 0, total_calls: 12, total_talk_time_mins: 58 }
            ]).map((rep, idx) => `
              <div style="display: flex; align-items: center; justify-content: space-between; background: #F8F9FA; padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid #E5E7EB;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: ${idx === 0 ? 'var(--accent-coral-subtle)' : '#EFF6FF'}; color: ${idx === 0 ? 'var(--accent-coral)' : '#1D4ED8'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px;">
                    #${idx + 1}
                  </div>
                  <div>
                    <strong style="color: var(--text-primary); font-size: 13.5px;">${rep.name}</strong>
                    <div style="font-size: 11.5px; color: var(--text-muted);">${rep.total_calls} calls logged • ${rep.total_talk_time_mins} mins talk time</div>
                  </div>
                </div>
                <div style="text-align: right;">
                  <strong style="color: var(--accent-emerald); font-size: 14px;">₹${(rep.revenue_closed / 10000000).toFixed(2)} Cr</strong>
                  <div style="font-size: 11px; color: var(--accent-amber); font-weight: 600;">${rep.bookings_closed} Unit(s) Closed</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}
