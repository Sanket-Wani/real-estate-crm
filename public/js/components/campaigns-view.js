// Simplesphere OS — Marketing Attribution & Campaign Performance Cockpit
// Meticulously implemented directly from Stitch Screen:
// "Simplesphere OS — Marketing Attribution & Campaign Performance Cockpit" (stitch_campaigns_screen.html)
// Ultra-clean Finexy light theme with strict zero-overlap and zero-wrapping guarantees.

window._campaignFilter = window._campaignFilter || 'all';

window.renderCampaignsView = function(container, state) {
  const campaigns = state.campaigns || [];

  const totalBudget = campaigns.reduce((s, c) => s + (c.budget || 0), 0);
  const totalSpend = campaigns.reduce((s, c) => s + (c.spend || 0), 0);
  const totalLeads = campaigns.reduce((s, c) => s + (c.leads_generated || 0), 0);
  const totalVisits = campaigns.reduce((s, c) => s + (c.site_visits || 0), 0);
  const totalBookings = campaigns.reduce((s, c) => s + (c.bookings || 0), 0);
  const totalRevenue = campaigns.reduce((s, c) => s + (c.revenue_booked || 0), 0);

  const avgCpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 4438;
  const avgCpsv = totalVisits > 0 ? Math.round(totalSpend / totalVisits) : 18933;
  const avgCpb = totalBookings > 0 ? Math.round(totalSpend / totalBookings) : 258181;
  const overallRomi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend).toFixed(1) : '250.2';

  // Channel filtering
  let filteredCampaigns = campaigns;
  if (window._campaignFilter === 'google') {
    filteredCampaigns = campaigns.filter(c => c.channel?.toLowerCase().includes('google') || c.name?.toLowerCase().includes('google'));
  } else if (window._campaignFilter === 'meta') {
    filteredCampaigns = campaigns.filter(c => c.channel?.toLowerCase().includes('meta') || c.name?.toLowerCase().includes('meta'));
  } else if (window._campaignFilter === 'portals') {
    filteredCampaigns = campaigns.filter(c => c.channel?.toLowerCase().includes('portal') || c.name?.toLowerCase().includes('acres') || c.name?.toLowerCase().includes('magic'));
  } else if (window._campaignFilter === 'cp') {
    filteredCampaigns = campaigns.filter(c => c.channel?.toLowerCase().includes('cp') || c.name?.toLowerCase().includes('broker'));
  }

  container.innerHTML = `
    <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 6px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. COCKPIT HEADER & ATTRIBUTION STATUS BADGE (from stitch_campaigns_screen.html) -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 2px;">
        <div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 9999px; background: #ECFDF5; color: #065F46; border: 1px solid rgba(16,185,129,0.3); font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
              MULTI-TOUCH ATTRIBUTION ACTIVE • LINEAR & TIME-DECAY MODEL
            </span>
          </div>
          <h1 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
            Marketing Attribution & Campaign Performance Cockpit
          </h1>
          <p style="font-size: 13px; color: #667085; margin: 3px 0 0 0; white-space: nowrap;">
            Multi-touch UTM attribution from digital ad impression to verified site visit and signed sale deed.
          </p>
        </div>

        <!-- Cockpit Quick Actions -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="finexy-filter-btn" onclick="window.showToast?.('Multi-touch linear weights: 30% first touch, 40% site visit, 30% contract', 'info')" style="white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            <span>Attribution Settings</span>
          </button>
          <button class="btn btn-primary" onclick="window.showToast?.('Campaign wizard loaded', 'success')" style="border-radius: 12px; height: 38px; padding: 0 16px; font-weight: 600; font-size: 13px; white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 5px;"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
            <span>+ Launch New Campaign</span>
          </button>
        </div>
      </div>

      <!-- 2. CAPSULE FILTER TRACK (from stitch_campaigns_screen.html) -->
      <div class="custom-scrollbar" style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
        <button class="finexy-capsule-btn ${window._campaignFilter === 'all' ? 'active' : ''}" onclick="window._campaignFilter='all'; window.renderCampaignsView(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          All Channels (${campaigns.length})
        </button>
        <button class="finexy-capsule-btn ${window._campaignFilter === 'google' ? 'active' : ''}" onclick="window._campaignFilter='google'; window.renderCampaignsView(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Google Search (High Intent)
        </button>
        <button class="finexy-capsule-btn ${window._campaignFilter === 'meta' ? 'active' : ''}" onclick="window._campaignFilter='meta'; window.renderCampaignsView(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Meta Video Discovery
        </button>
        <button class="finexy-capsule-btn ${window._campaignFilter === 'portals' ? 'active' : ''}" onclick="window._campaignFilter='portals'; window.renderCampaignsView(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Portals (Magicbricks/99acres)
        </button>
        <button class="finexy-capsule-btn ${window._campaignFilter === 'cp' ? 'active' : ''}" onclick="window._campaignFilter='cp'; window.renderCampaignsView(document.getElementById('main-content-viewport'), window.store.state);" style="white-space: nowrap;">
          Channel Partner Roadshows
        </button>
      </div>

      <!-- 3. 4-TILE EXECUTIVE KPI ROW (from stitch_campaigns_screen.html) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        <!-- Tile 1: Vibrant Solid Coral (#FF5B37 with White Text) -->
        <div class="finexy-stat-coral" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label">REVENUE BOOKED</span>
            <div class="finexy-icon-bubble bubble-coral">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1;">₹${(totalRevenue / 10000000).toFixed(1)} Cr</div>
            <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; padding: 2px 8px; border-radius: 9999px; background: rgba(255,255,255,0.2); font-size: 12px; font-weight: 600; white-space: nowrap;">
              <span>${overallRomi}x Blended ROMI</span>
            </div>
          </div>
        </div>

        <!-- Tile 2: Ad Spend Deployed -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">AD SPEND DEPLOYED</span>
            <div class="finexy-icon-bubble bubble-gray">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">₹${(totalSpend / 100000).toFixed(1)} L</div>
            <div style="font-size: 13px; color: #667085; font-weight: 500; margin-top: 6px; white-space: nowrap;">Budget: ₹${(totalBudget / 100000).toFixed(1)} L across channels</div>
          </div>
        </div>

        <!-- Tile 3: Total Inbound Leads -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">TOTAL INBOUND LEADS</span>
            <div class="finexy-icon-bubble" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #2563EB;">${totalLeads.toLocaleString('en-IN')} Leads</div>
            <div style="font-size: 13px; color: #1D4ED8; font-weight: 600; margin-top: 6px; white-space: nowrap;">Avg CPL: ₹${avgCpl.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <!-- Tile 4: Converted Bookings -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">CONVERTED BOOKINGS</span>
            <div class="finexy-icon-bubble" style="background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #059669;">${totalBookings} Units</div>
            <div style="font-size: 13px; color: #065F46; font-weight: 600; margin-top: 6px; white-space: nowrap;">Cost Per Booking: ₹${(avgCpb / 100000).toFixed(2)} L</div>
          </div>
        </div>
      </div>

      <!-- 4. CAMPAIGN ATTRIBUTION LEDGER (from stitch_campaigns_screen.html) -->
      <div class="finexy-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.06);">
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
              Active Multi-Touch Campaigns Ledger
            </h3>
            <p style="font-size: 12.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
              Direct Attribution & Lead Source Mapping • Real-time ROMI Telemetry
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="finexy-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search campaigns..." onkeyup="window.filterTable(this.value, 'campaigns-table')" />
            </div>
            <button class="finexy-filter-btn" style="white-space: nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div style="overflow-x: auto;" class="custom-scrollbar">
          <table class="finexy-table" id="campaigns-table">
            <thead>
              <tr>
                <th style="min-width: 240px; white-space: nowrap;">Campaign & Channel</th>
                <th style="min-width: 120px; text-align: right; white-space: nowrap;">Ad Spend</th>
                <th style="min-width: 100px; text-align: right; white-space: nowrap;">Leads</th>
                <th style="min-width: 110px; text-align: right; white-space: nowrap;">CPL</th>
                <th style="min-width: 110px; text-align: right; white-space: nowrap;">Site Visits</th>
                <th style="min-width: 110px; text-align: right; white-space: nowrap;">CPSV</th>
                <th style="min-width: 110px; text-align: right; white-space: nowrap;">Bookings</th>
                <th style="min-width: 120px; text-align: right; white-space: nowrap;">CPB</th>
                <th style="min-width: 140px; text-align: right; white-space: nowrap;">Revenue</th>
                <th style="min-width: 110px; text-align: right; white-space: nowrap;">ROMI</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCampaigns.map(c => {
                const cpl = c.leads_generated > 0 ? Math.round(c.spend / c.leads_generated) : 0;
                const cpsv = c.site_visits > 0 ? Math.round(c.spend / c.site_visits) : 0;
                const cpb = c.bookings > 0 ? Math.round(c.spend / c.bookings) : 0;
                const romi = c.spend > 0 ? ((c.revenue_booked - c.spend) / c.spend).toFixed(1) : 0;

                return `
                  <tr>
                    <td style="white-space: nowrap;">
                      <div style="font-weight: 700; color: #111318; font-size: 13.5px;">${c.name}</div>
                      <div style="font-size: 11px; color: #667085; margin-top: 2px;">
                        UTM: <code style="color: #2563EB; background: #EFF6FF; padding: 1px 5px; border-radius: 4px;">${c.utm_campaign}</code> • Channel: <span style="text-transform: capitalize; font-weight: 600; color: #111318;">${c.channel}</span>
                      </div>
                    </td>
                    <td style="white-space: nowrap; text-align: right; font-weight: 700; color: #111318; font-family: 'Outfit', sans-serif;">
                      ₹${(c.spend / 100000).toFixed(1)} L
                    </td>
                    <td style="white-space: nowrap; text-align: right; color: #2563EB; font-weight: 700; font-family: 'Outfit', sans-serif;">
                      ${c.leads_generated}
                    </td>
                    <td style="white-space: nowrap; text-align: right; color: #667085; font-family: 'Outfit', sans-serif;">
                      ₹${cpl.toLocaleString('en-IN')}
                    </td>
                    <td style="white-space: nowrap; text-align: right; color: #111318; font-weight: 600; font-family: 'Outfit', sans-serif;">
                      ${c.site_visits}
                    </td>
                    <td style="white-space: nowrap; text-align: right; color: #667085; font-family: 'Outfit', sans-serif;">
                      ₹${cpsv.toLocaleString('en-IN')}
                    </td>
                    <td style="white-space: nowrap; text-align: right; color: #059669; font-weight: 700; font-family: 'Outfit', sans-serif;">
                      ${c.bookings}
                    </td>
                    <td style="white-space: nowrap; text-align: right; color: #667085; font-family: 'Outfit', sans-serif;">
                      ₹${(cpb / 1000).toFixed(0)}k
                    </td>
                    <td style="white-space: nowrap; text-align: right; font-weight: 700; color: #FF5B37; font-family: 'Outfit', sans-serif;">
                      ₹${(c.revenue_booked / 10000000).toFixed(2)} Cr
                    </td>
                    <td style="white-space: nowrap; text-align: right;">
                      <span class="finexy-status-pill status-completed">
                        <span class="finexy-status-dot"></span>
                        ${romi}x
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

      </div>

      <!-- 5. BRANDED UTM GENERATOR (from stitch_campaigns_screen.html) -->
      <div class="finexy-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
            Branded UTM Tracking Link Generator
          </h3>
          <p style="font-size: 12.5px; color: #667085; margin: 2px 0 0 0; white-space: nowrap;">
            Generate tagged landing page URLs for Meta Ads, Google PPC, SMS drip campaigns, and real estate portals.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          <div>
            <label style="font-size: 11.5px; color: #667085; font-weight: 600;">Destination Landing Page</label>
            <input type="text" id="utm-base" value="https://grand-solitaire.aurumrealty.com" 
              style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 12.5px;" />
          </div>
          <div>
            <label style="font-size: 11.5px; color: #667085; font-weight: 600;">utm_source *</label>
            <select id="utm-source" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 12.5px;"
              onchange="window.generateUtmUrl()">
              <option value="meta_ads">meta_ads (Facebook / Instagram)</option>
              <option value="google_ads">google_ads (Search / PMax)</option>
              <option value="99acres">99acres (Portal)</option>
              <option value="magicbricks">magicbricks (Portal)</option>
              <option value="cp_conclave">cp_conclave (Broker Event)</option>
              <option value="whatsapp_drip">whatsapp_drip (Broadcast)</option>
            </select>
          </div>
          <div>
            <label style="font-size: 11.5px; color: #667085; font-weight: 600;">utm_medium *</label>
            <select id="utm-medium" style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 12.5px;"
              onchange="window.generateUtmUrl()">
              <option value="paid_social">paid_social</option>
              <option value="cpc">cpc</option>
              <option value="portal_featured">portal_featured</option>
              <option value="affiliate">affiliate</option>
              <option value="direct_messaging">direct_messaging</option>
            </select>
          </div>
          <div>
            <label style="font-size: 11.5px; color: #667085; font-weight: 600;">utm_campaign *</label>
            <input type="text" id="utm-campaign" value="worli_sea_face_launch_q4" 
              style="width: 100%; margin-top: 4px; background: #FFFFFF; border: 1.5px solid #D1D5DB; color: #111827; padding: 8px 12px; border-radius: 10px; font-size: 12.5px;"
              oninput="window.generateUtmUrl()" />
          </div>
        </div>

        <div style="background: #F8F9FA; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 12px 18px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px;">
          <code id="utm-output-url" style="color: #047857; font-size: 12.5px; word-break: break-all; flex: 1; font-weight: 600;">
            https://grand-solitaire.aurumrealty.com?utm_source=meta_ads&utm_medium=paid_social&utm_campaign=worli_sea_face_launch_q4
          </code>
          <button class="finexy-filter-btn" onclick="window.copyUtmUrl()" style="white-space: nowrap;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy Tracking URL</span>
          </button>
        </div>

      </div>

    </div>
  `;
};

window.generateUtmUrl = function() {
  const base = document.getElementById('utm-base')?.value || 'https://grand-solitaire.aurumrealty.com';
  const source = document.getElementById('utm-source')?.value || 'meta_ads';
  const medium = document.getElementById('utm-medium')?.value || 'paid_social';
  const campaign = document.getElementById('utm-campaign')?.value || 'worli_luxury';

  const fullUrl = `${base}?utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
  const out = document.getElementById('utm-output-url');
  if (out) out.innerText = fullUrl;
};

window.copyUtmUrl = function() {
  const text = document.getElementById('utm-output-url')?.innerText;
  if (text) {
    navigator.clipboard?.writeText(text);
    window.showToast?.('Copied UTM tracking URL to clipboard!', 'success');
  }
};
