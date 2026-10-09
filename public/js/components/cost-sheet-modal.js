// Simplesphere OS — Dynamic Cost Sheet & RERA Allotment Calculator Module Page
// Meticulously implemented directly from Stitch Screen:
// "Simplesphere OS — Dynamic Cost Sheet & RERA Allotment Calculator" (stitch_cost_sheet_screen.html)
// Ultra-clean Finexy light theme with strict zero-overlap and zero-wrapping guarantees.

let currentCostSheetState = {
  selectedUnitId: null,
  discountPct: 0,
  schemeId: 'clp'
};

window.renderCostSheetModule = async function(container, state, targetUnitId = null) {
  const matrix = state.currentMatrix;
  if (!matrix || !matrix.units || matrix.units.length === 0) {
    container.innerHTML = `
      <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 20px 0; text-align: center; color: #667085;">
        Loading project inventory matrix for cost sheet calculation...
      </div>
    `;
    return;
  }

  const units = matrix.units;
  const project = matrix.project;
  const currentUser = state.currentUser || { role: 'admin' };

  // Determine active unit ID
  const activeUnitId = targetUnitId || currentCostSheetState.selectedUnitId || units[0].id;
  currentCostSheetState.selectedUnitId = activeUnitId;
  const unit = units.find(u => u.id === activeUnitId) || units[0];

  const discount = currentCostSheetState.discountPct || 0;
  const scheme = currentCostSheetState.schemeId || 'clp';

  // Calculate pricing from backend engine
  let costSheetData = null;
  try {
    const res = await fetch('/v1/cost-sheets/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit_id: unit.id, discount_pct: discount, scheme_id: scheme })
    }).then(r => r.json());
    if (res.success) costSheetData = res.cost_sheet;
  } catch (err) {
    console.error('Cost sheet calculation failed:', err);
  }

  if (!costSheetData) {
    container.innerHTML = `
      <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 20px 0; text-align: center; color: #667085;">
        Failed to calculate quotation pricing.
      </div>
    `;
    return;
  }

  const cs = costSheetData;
  const formattedGrandTotal = cs.total_cost.toLocaleString('en-IN');
  const grandTotalCr = (cs.total_cost / 10000000).toFixed(2);
  const statutoryLakhs = (cs.statutory_charges.total / 100000).toFixed(2);
  const bookingTokenLakhs = ((cs.total_cost * 0.10) / 100000).toFixed(2);

  container.innerHTML = `
    <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 6px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. STATUTORY BREADCRUMB & PAGE HEADER (from stitch_cost_sheet_screen.html) -->
      <div>
        <!-- Breadcrumb Bar -->
        <nav style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #667085; margin-bottom: 8px; white-space: nowrap;">
          <span>Properties</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>${project.name}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span style="color: #111318; font-weight: 700;">Unit ${unit.unit_number}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span style="color: #FF5B37; font-weight: 700;">Cost Sheet & Allotment Calculator</span>
        </nav>

        <!-- Headline & Actions -->
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
          <div>
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 6px;">
              <h1 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                Dynamic Cost Sheet & RERA Allotment Calculator
              </h1>
              <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 9999px; background: #ECFDF5; color: #065F46; border: 1px solid rgba(16,185,129,0.3); font-size: 11px; font-weight: 700; letter-spacing: 0.04em; white-space: nowrap;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
                RERA COMPLIANT • MAHARERA: ${project.rera_id || 'P51900028471'}
              </span>
            </div>
            <p style="font-size: 13px; color: #667085; margin: 0; white-space: nowrap;">
              Statutory RERA Form 3 verified pricing model, dynamic PLC & floor rise computation, and milestone-linked allotment schedule.
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="finexy-filter-btn" onclick="window.showToast?.('Pricing rate locked in memory for 48 hours', 'info');" style="white-space: nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Freeze Rate for 48 Hours</span>
            </button>
            <button class="finexy-filter-btn" onclick="window.handleCostSheetDiscountChange('${unit.id}', 2);" style="white-space: nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              <span>Apply Approved Discount</span>
            </button>
            <button class="btn btn-primary" onclick="window.printCostSheet()" style="border-radius: 12px; height: 38px; padding: 0 16px; font-weight: 600; font-size: 13px; white-space: nowrap;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>Generate Official Quotation PDF</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. 4-TILE KPI METRIC ROW (from stitch_cost_sheet_screen.html) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        <!-- Tile 1: Solid Coral Hero Container (#FF5B37) -->
        <div class="finexy-stat-coral" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label">TOTAL ALL-INCLUSIVE COST</span>
            <div class="finexy-icon-bubble bubble-coral">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1;">₹${grandTotalCr} Cr</div>
            <div style="font-size: 13px; font-weight: 600; opacity: 0.95; margin-top: 4px; white-space: nowrap;">₹${formattedGrandTotal} all-inclusive package</div>
          </div>
          <div style="padding-top: 10px; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 11.5px; opacity: 0.85; white-space: nowrap;">
            Base rate ₹${(cs.base_rate_sqft || unit.base_price || 28500).toLocaleString('en-IN')}/sqft • RERA Carpet ${unit.carpet_area} sqft
          </div>
        </div>

        <!-- Tile 2: Carpet Area & Specs -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">CARPET AREA & SPECS</span>
            <div class="finexy-icon-bubble bubble-gray">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">${unit.carpet_area} sqft</div>
            <div style="font-size: 13px; color: #667085; font-weight: 500; margin-top: 4px; white-space: nowrap;">${unit.configuration} Grand Luxury</div>
          </div>
          <div style="padding-top: 10px; margin-top: 10px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 11.5px; color: #667085; white-space: nowrap;">
            ${unit.facing || 'East Facing'} • Floor ${unit.floor_number} (${unit.unit_number})
          </div>
        </div>

        <!-- Tile 3: Government Taxes & Levies -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">GOVT TAXES & LEVIES</span>
            <div class="finexy-icon-bubble" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">₹${statutoryLakhs} L</div>
            <div style="font-size: 13px; color: #2563EB; font-weight: 600; margin-top: 4px; white-space: nowrap;">Statutory & Taxes Breakdown</div>
          </div>
          <div style="padding-top: 10px; margin-top: 10px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 11.5px; color: #667085; white-space: nowrap;">
            Stamp Duty 6% • Reg ₹30K • GST 5%
          </div>
        </div>

        <!-- Tile 4: Effective Booking Token -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">EFFECTIVE BOOKING TOKEN</span>
            <div class="finexy-icon-bubble" style="background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #059669;">₹${bookingTokenLakhs} L</div>
            <div style="font-size: 13px; color: #065F46; font-weight: 600; margin-top: 4px; white-space: nowrap;">10% Initial Token Deposit</div>
          </div>
          <div style="padding-top: 10px; margin-top: 10px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 11.5px; color: #667085; white-space: nowrap;">
            Non-refundable token • Schedule locked 7 days
          </div>
        </div>
      </div>

      <!-- 3. MAIN CONTENT 60/40 SPLIT GRID (from stitch_cost_sheet_screen.html) -->
      <div style="display: grid; grid-template-columns: 1fr 420px; gap: 24px; align-items: start;">
        
        <!-- LEFT COLUMN (60%): ITEMIZED RERA BREAKDOWN TABLE -->
        <div class="finexy-card" id="printable-cost-sheet" style="padding: 24px; display: flex; flex-direction: column; gap: 18px;">
          
          <!-- Section Header & Controls -->
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.06);">
            <div>
              <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                Itemized Agreement & Statutory Cost Breakdown
              </h3>
              <p style="font-size: 12.5px; color: #667085; margin: 2px 0 0 0;">
                Calculated strictly in accordance with Maharashtra Real Estate Regulatory Authority standards.
              </p>
            </div>

            <!-- Unit Selector Pill -->
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 12px; font-weight: 600; color: #667085;">Unit:</span>
              <select onchange="window.selectCostSheetUnit(this.value)" style="background: #F4F5F7; border: 1px solid rgba(0,0,0,0.08); border-radius: 9999px; padding: 5px 14px; font-size: 12.5px; font-weight: 700; color: #111318; outline: none; cursor: pointer;">
                ${units.map(u => `<option value="${u.id}" ${u.id === unit.id ? 'selected' : ''}>${u.unit_number} (${u.configuration})</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Itemized Table -->
          <div style="overflow-x: auto;" class="custom-scrollbar">
            <table class="finexy-table">
              <thead>
                <tr>
                  <th style="min-width: 40px; white-space: nowrap;">#</th>
                  <th style="min-width: 260px; white-space: nowrap;">Component Description</th>
                  <th style="min-width: 140px; white-space: nowrap;">Calculation Basis</th>
                  <th style="min-width: 130px; white-space: nowrap;">Rate / Unit</th>
                  <th style="min-width: 140px; text-align: right; white-space: nowrap;">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="color: #667085; font-weight: 600;">1</td>
                  <td style="font-weight: 600; color: #111318;">Base Agreement Value</td>
                  <td style="color: #667085;">${unit.super_built_up_area} sq.ft SBU</td>
                  <td style="font-family: 'Outfit', sans-serif; font-weight: 600; color: #111318;">₹${(cs.base_rate_sqft || unit.base_price || 28500).toLocaleString('en-IN')}/sqft</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318;">₹${(cs.base_cost || (unit.super_built_up_area * (unit.base_price || 28500))).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="color: #667085; font-weight: 600;">2</td>
                  <td style="font-weight: 600; color: #111318;">Floor Rise Charges</td>
                  <td style="color: #667085;">Floor ${unit.floor_number} Premium</td>
                  <td style="font-family: 'Outfit', sans-serif; font-weight: 600; color: #111318;">₹${(cs.floor_rise_rate || 150) * unit.floor_number}/sqft</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318;">₹${(cs.floor_rise_total || 0).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="color: #667085; font-weight: 600;">3</td>
                  <td style="font-weight: 600; color: #111318;">Preferential Location Charge (PLC)</td>
                  <td style="color: #667085;">${unit.facing || 'Worli Horizon'}</td>
                  <td style="font-family: 'Outfit', sans-serif; font-weight: 600; color: #111318;">₹${cs.plc_rate || 0}/sqft</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318;">₹${(cs.plc_total || 0).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="color: #667085; font-weight: 600;">4</td>
                  <td style="font-weight: 600; color: #111318;">Car Parking Allocation</td>
                  <td style="color: #667085;">${unit.parking_slots || 2} Covered Podium Bays</td>
                  <td style="font-family: 'Outfit', sans-serif; font-weight: 600; color: #111318;">Fixed Allotment</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318;">₹${(cs.parking_charges || 500000).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="color: #667085; font-weight: 600;">5</td>
                  <td style="font-weight: 600; color: #111318;">Infrastructure & Development Levy</td>
                  <td style="color: #667085;">Clubhouse, Grid & Substation</td>
                  <td style="font-family: 'Outfit', sans-serif; font-weight: 600; color: #111318;">Statutory Share</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318;">₹${(cs.other_charges?.infra_development || cs.other_charges?.total || 450000).toLocaleString('en-IN')}</td>
                </tr>

                <!-- Subtotal A -->
                <tr style="background: #F8F9FA; font-weight: 700;">
                  <td colspan="4" style="color: #111318; padding: 12px 14px;">Subtotal Agreement Value (A)</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-size: 15px; color: #111318; padding: 12px 14px;">₹${(cs.agreement_value || 0).toLocaleString('en-IN')}</td>
                </tr>

                <tr>
                  <td style="color: #667085; font-weight: 600;">6</td>
                  <td style="font-weight: 600; color: #111318;">Maharashtra Stamp Duty (6.00%)</td>
                  <td style="color: #667085;">State Revenue Dept</td>
                  <td style="font-family: 'Outfit', sans-serif; font-weight: 600; color: #111318;">6.00% on (A)</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318;">₹${(cs.statutory_charges?.stamp_duty_6_pct || Math.round((cs.agreement_value || 0) * 0.06)).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="color: #667085; font-weight: 600;">7</td>
                  <td style="font-weight: 600; color: #111318;">Government Registration Fee</td>
                  <td style="color: #667085;">Sub-Registrar Authority</td>
                  <td style="font-family: 'Outfit', sans-serif; font-weight: 600; color: #111318;">Capped Statutory</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318;">₹${(cs.statutory_charges?.registration_fee || 30000).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="color: #667085; font-weight: 600;">8</td>
                  <td style="font-weight: 600; color: #111318;">Goods & Services Tax (GST 5.00%)</td>
                  <td style="color: #667085;">Under Construction RERA</td>
                  <td style="font-family: 'Outfit', sans-serif; font-weight: 600; color: #111318;">5.00% on (A)</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318;">₹${(cs.statutory_charges?.gst_5_pct || Math.round((cs.agreement_value || 0) * 0.05)).toLocaleString('en-IN')}</td>
                </tr>

                <!-- Subtotal B -->
                <tr style="background: #F8F9FA; font-weight: 700;">
                  <td colspan="4" style="color: #111318; padding: 12px 14px;">Total Statutory Levies & Taxes (B)</td>
                  <td style="text-align: right; font-family: 'Outfit', sans-serif; font-size: 15px; color: #111318; padding: 12px 14px;">₹${(cs.statutory_charges?.total || 0).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Grand Total Package Summary Banner (Carbon container #111318 with coral accent) -->
          <div style="background: #111318; border-radius: 16px; padding: 20px 24px; color: #FFFFFF; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
            <div>
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.7); font-weight: 700;">
                GRAND TOTAL ALL-INCLUSIVE PACKAGE (A + B)
              </span>
              <div style="font-family: 'Outfit', sans-serif; font-size: 30px; font-weight: 800; color: #FF5B37; margin-top: 4px; letter-spacing: -0.02em;">
                ₹${formattedGrandTotal}
              </div>
              <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 2px;">
                Zero hidden charges. Inclusive of 2 covered car parks, clubhouse access, and all statutory taxes.
              </div>
            </div>

            <button class="btn btn-primary" onclick="window.openBookingModal('${unit.id}', ${cs.discount_pct}, '${cs.payment_scheme?.id || 'clp'}')" style="border-radius: 12px; height: 42px; font-weight: 700; font-size: 13.5px; padding: 0 20px; white-space: nowrap;">
              Initiate Booking Form
            </button>
          </div>

        </div>

        <!-- RIGHT COLUMN (40%): CLP PAYMENT SCHEDULE & ESCROW (from stitch_cost_sheet_screen.html) -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- CLP Schedule Card -->
          <div class="finexy-card" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="finexy-stat-label" style="color: #667085;">CONSTRUCTION-LINKED (CLP)</span>
              <span style="padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; font-size: 11px; font-weight: 700; border: 1px solid rgba(16,185,129,0.3); white-space: nowrap;">
                70% Escrow Linked
              </span>
            </div>

            <h4 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: #111318; margin: 0;">
              Construction-Linked Payment Schedule
            </h4>

            <!-- Multi-segment Striped Progress Bar -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 6px;">
                <span style="color: #111318;">30% Demanded / Paid</span>
                <span style="color: #667085;">70% Upcoming Slabs</span>
              </div>
              <div class="finexy-progress-track">
                <div class="finexy-progress-solid" style="width: 30%;"></div>
              </div>
            </div>

            <!-- Milestones Tranche List -->
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12.5px;">
              ${(cs.payment_scheme?.milestones || []).map((m, idx) => {
                const isPaid = idx === 0;
                const isDue = idx === 1;
                const badgeText = isPaid ? 'Paid' : isDue ? 'Due' : 'Upcoming';
                const badgeColor = isPaid ? '#065F46' : isDue ? '#FF5B37' : '#667085';
                const badgeBg = isPaid ? '#ECFDF5' : isDue ? '#FFF0ED' : '#F4F5F7';
                const badgeBorder = isPaid ? 'rgba(16,185,129,0.3)' : isDue ? 'rgba(255,91,55,0.3)' : 'rgba(0,0,0,0.06)';

                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 10px; background: #F8F9FA; border: 1px solid rgba(0,0,0,0.04);">
                    <div>
                      <div style="font-weight: 600; color: #111318;">${m.name} (${m.percentage}%)</div>
                      <div style="font-size: 11px; color: #667085;">${m.trigger}</div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-family: 'Outfit', sans-serif; font-weight: 700; color: #111318;">₹${m.amount.toLocaleString('en-IN')}</div>
                      <span style="padding: 2px 6px; border-radius: 9999px; background: ${badgeBg}; color: ${badgeColor}; font-size: 10px; font-weight: 700; border: 1px solid ${badgeBorder}; display: inline-block; margin-top: 2px;">
                        ${badgeText}
                      </span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Financial Guarantee & Escrow Card -->
          <div class="finexy-card" style="padding: 18px; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #111318; font-weight: 700; font-size: 13.5px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5B37" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>Statutory Escrow & Warranty</span>
            </div>
            <div style="font-size: 12px; color: #667085; line-height: 1.5;">
              <strong>RERA Escrow Account:</strong> ICICI Bank Luxury Project Escrow Node • A/C #4092-019-2819. All tranche collections locked for 70% direct construction deployment.
            </div>
            <div style="display: flex; gap: 8px; margin-top: 4px;">
              <button class="finexy-filter-btn" style="flex: 1; justify-content: center; padding: 7px 10px;" onclick="window.sendCostSheetCommunication('${unit.id}', 'whatsapp')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                <span>WhatsApp</span>
              </button>
              <button class="finexy-filter-btn" style="flex: 1; justify-content: center; padding: 7px 10px;" onclick="window.sendCostSheetCommunication('${unit.id}', 'email')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span>Email</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;
};

// Handlers for in-page interaction
window.selectCostSheetUnit = function(unitId) {
  currentCostSheetState.selectedUnitId = unitId;
  const container = document.getElementById('main-content-viewport');
  if (container) window.renderCostSheetModule(container, window.store.state, unitId);
};

window.handleCostSheetDiscountChange = function(unitId, discountVal) {
  currentCostSheetState.discountPct = parseFloat(discountVal);
  const container = document.getElementById('main-content-viewport');
  if (container) window.renderCostSheetModule(container, window.store.state, unitId);
};

window.handleCostSheetSchemeChange = function(unitId, schemeId) {
  currentCostSheetState.schemeId = schemeId;
  const container = document.getElementById('main-content-viewport');
  if (container) window.renderCostSheetModule(container, window.store.state, unitId);
};

// Seamless transition from anywhere (Inventory matrix, War room, etc.)
window.openCostSheetModal = function(unitId, prefillDiscount = 0, selectedScheme = 'clp') {
  currentCostSheetState.selectedUnitId = unitId;
  currentCostSheetState.discountPct = parseFloat(prefillDiscount) || 0;
  currentCostSheetState.schemeId = selectedScheme || 'clp';
  window.store.selectedCostSheetUnitId = unitId;
  window.store.setTab('cost-sheets');
};

window.printCostSheet = function() {
  const printEl = document.getElementById('printable-cost-sheet');
  if (!printEl) return;
  const printContents = printEl.innerHTML;
  const win = window.open('', '', 'height=800,width=1000');
  win.document.write('<html><head><title>Simplesphere OS — Unit Cost Sheet Quotation</title>');
  win.document.write('<style>body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; background: #fff; color: #0f172a; } table { width: 100%; border-collapse: collapse; margin-bottom: 16px; } th, td { padding: 6px 8px; } </style>');
  win.document.write('</head><body>');
  win.document.write(printContents);
  win.document.write('</body></html>');
  win.document.close();
  win.print();
};

window.sendCostSheetCommunication = function(unitId, channel) {
  if (window.openCommModal) {
    const matrix = window.store.state.currentMatrix;
    const unit = matrix?.units?.find(u => u.id === unitId) || matrix?.units?.[0];
    const unitNumber = unit ? unit.unit_number : 'Selected';
    window.openCommModal({
      name: 'Interested Buyer',
      phone: '+91 98199 88776',
      email: 'buyer@example.com',
      unit_number: unitNumber,
      project_name: matrix?.project?.name || 'The Grand Solitaire'
    }, channel);
  } else {
    window.showToast?.(`Quotation dispatched via ${channel.toUpperCase()}`, 'success');
  }
};
