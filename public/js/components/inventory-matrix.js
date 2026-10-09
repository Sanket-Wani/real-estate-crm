// Simplesphere OS — Inventory Matrix Component
// Meticulously implemented directly from Stitch Screen:
// "Simplesphere OS — Inventory Matrix & Architectural Stacking Plan" (stitch_inventory_screen.html)
// Ultra-clean Finexy light theme with strict zero-overlap and zero-wrapping guarantees.

window._invFilter = window._invFilter || 'all';
window._invViewMode = window._invViewMode || 'grid';
window._selectedUnitId = window._selectedUnitId || null;

function renderInventoryMatrix(container, state) {
  const matrix = state.currentMatrix;
  if (!matrix || !matrix.project) {
    container.innerHTML = `<div class="p-8 text-center" style="color: #667085; font-size: 14px; padding: 40px;">Loading inventory matrix from Simplesphere OS core...</div>`;
    return;
  }

  const { project, towers, units, stats } = matrix;
  if (!window._selectedUnitId && units && units.length > 0) {
    window._selectedUnitId = units[0].id;
  }

  // Filter units based on active capsule filter
  let displayTowers = towers;
  let activeFilter = window._invFilter;

  if (activeFilter === 'tower-a') {
    displayTowers = towers.filter(t => t.id === 'tow-1' || t.name.includes('A') || t.name.includes('Sea Crest'));
  } else if (activeFilter === 'tower-b') {
    displayTowers = towers.filter(t => t.id === 'tow-2' || t.name.includes('B') || t.name.includes('Skyline'));
  }

  // Find currently selected unit for Quick Dossier
  const selectedUnit = units.find(u => u.id === window._selectedUnitId) || units[0];
  const estSelAgreement = selectedUnit ? ((selectedUnit.super_built_up_area * selectedUnit.base_price) + (selectedUnit.super_built_up_area * selectedUnit.floor_number * (selectedUnit.floor_rise_rate || 0)) + (selectedUnit.parking_cost || 0)) : 0;
  const estSelCr = (estSelAgreement / 10000000).toFixed(2);
  const formattedSelFullCost = estSelAgreement.toLocaleString('en-IN');

  let html = `
    <div class="module-page-container fade-in" style="max-width: 1720px; margin: 0 auto; padding: 6px 0 40px 0; display: flex; flex-direction: column; gap: 20px;">
      
      <!-- 1. CONTEXT ROW & SUB-HEADER (from stitch_inventory_screen.html) -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 2px;">
        <div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 6px;">
            <!-- Property Selector Pill -->
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; background: #FFFFFF; border-radius: 9999px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF5B37" stroke="#FF5B37" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #111318; white-space: nowrap;">${project.name}</span>
            </div>
            <!-- RERA Badge -->
            <div style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px; background: #E8EEFF; color: #1E293B; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; border: 1px solid rgba(0,0,0,0.06); white-space: nowrap;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>RERA: ${project.rera_id}</span>
            </div>
            <!-- Base Rate Pill -->
            <div style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 11px; border-radius: 9999px; background: #ECFDF5; color: #065F46; border: 1px solid rgba(16,185,129,0.3); font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 700; white-space: nowrap;">
              <span>Base: ₹${project.base_rate_sqft.toLocaleString('en-IN')}/sqft</span>
            </div>
          </div>
          <p style="font-size: 13px; color: #667085; margin: 0; white-space: nowrap;">
            Live Architectural Stacking Matrix & Staging Inventory Control • Phase 1 Oceanfront Wing
          </p>
        </div>

        <!-- Actions Cluster -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="finexy-filter-btn" onclick="window.store.loadProjectMatrix('${project.id}')" style="white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
            <span>Refresh Grid</span>
          </button>
          <button class="btn btn-primary" onclick="window.openNewLeadModal()" style="border-radius: 12px; height: 38px; padding: 0 16px; font-weight: 600; font-size: 13px; white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>+ Fast Inbound Lead</span>
          </button>
        </div>
      </div>

      <!-- 2. CAPSULE FILTER TRACK (from stitch_inventory_screen.html) -->
      <div class="custom-scrollbar" style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
        <button class="finexy-capsule-btn ${activeFilter === 'all' ? 'active' : ''}" onclick="window._invFilter='all'; window.store.notify();" style="white-space: nowrap;">
          All Units (${stats.totalUnits})
        </button>
        <button class="finexy-capsule-btn ${activeFilter === 'tower-a' ? 'active' : ''}" onclick="window._invFilter='tower-a'; window.store.notify();" style="white-space: nowrap;">
          Tower A (Sea Crest)
        </button>
        <button class="finexy-capsule-btn ${activeFilter === 'tower-b' ? 'active' : ''}" onclick="window._invFilter='tower-b'; window.store.notify();" style="white-space: nowrap;">
          Tower B (Skyline)
        </button>
        <button class="finexy-capsule-btn ${activeFilter === 'available' ? 'active' : ''}" onclick="window._invFilter='available'; window.store.notify();" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #10B981;"></span>
          Available Only (${stats.available})
        </button>
        <button class="finexy-capsule-btn ${activeFilter === 'held' ? 'active' : ''}" onclick="window._invFilter='held'; window.store.notify();" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #F59E0B;"></span>
          Held (15m Lock) (${stats.held})
        </button>
        <button class="finexy-capsule-btn ${activeFilter === 'booked' ? 'active' : ''}" onclick="window._invFilter='booked'; window.store.notify();" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #3B82F6;"></span>
          Booked (${stats.booked})
        </button>
        <button class="finexy-capsule-btn ${activeFilter === 'sold' ? 'active' : ''}" onclick="window._invFilter='sold'; window.store.notify();" style="display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #64748B;"></span>
          Sold (${stats.sold})
        </button>
      </div>

      <!-- 3. SUMMARY STAT ROW (Finexy 4-Tile Grid Style from stitch_inventory_screen.html) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        <!-- Tile 1: Vibrant Solid Coral (#FF5B37 with White Text) -->
        <div class="finexy-stat-coral" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label">AVAILABLE FOR SALE</span>
            <div class="finexy-icon-bubble bubble-coral">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1;">${stats.available} Units</div>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 13px; font-weight: 600; opacity: 0.95;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              <span>${Math.round((stats.available / stats.totalUnits) * 100)}% Available</span>
            </div>
          </div>
        </div>

        <!-- Tile 2: Crisp White Card - Total Inventory -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">TOTAL INVENTORY</span>
            <div class="finexy-icon-bubble bubble-gray">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">${stats.totalUnits} Units</div>
            <div style="font-size: 13px; color: #667085; font-weight: 500; margin-top: 6px;">Across ${towers.length} Towers / ${towers.reduce((acc, t) => acc + t.total_floors, 0)} Floors</div>
          </div>
        </div>

        <!-- Tile 3: Crisp White Card - On Hold / Locked -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">ON HOLD / LOCKED</span>
            <div class="finexy-icon-bubble" style="background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #D97706;">${stats.held} Units</div>
            <div style="font-size: 13px; color: #B45309; font-weight: 600; margin-top: 6px;">Active 15-min reservation locks</div>
          </div>
        </div>

        <!-- Tile 4: Crisp White Card - Booked & Sold -->
        <div class="finexy-stat-white" style="min-height: 150px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="finexy-stat-label" style="color: #667085;">BOOKED & SOLD</span>
            <div class="finexy-icon-bubble" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div class="finexy-stat-value" style="font-size: 34px; line-height: 1.1; color: #111318;">${stats.booked + stats.sold} Units</div>
            <div style="font-size: 13px; color: #2563EB; font-weight: 600; margin-top: 6px;">Token Received & CLP Active</div>
          </div>
        </div>
      </div>

      <!-- 4. DUAL-PANE COCKPIT WORKSPACE (from stitch_inventory_screen.html) -->
      <div style="display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start;">
        
        <!-- LEFT COLUMN: ARCHITECTURAL STACKING PLAN -->
        <div class="finexy-card" style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Tower Section Header -->
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.06);">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5B37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="22.01"/><line x1="15" y1="22" x2="15" y2="22.01"/></svg>
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 19px; font-weight: 700; color: #111318; margin: 0; white-space: nowrap;">
                  ${towers[0]?.name || 'Tower A'} (Floors ${towers[0]?.total_floors || 8} down to 1)
                </h3>
              </div>
              <p style="font-size: 12.5px; color: #667085; margin: 3px 0 0 0;">
                West-facing Arabian Sea front elevation • Floor rise +₹${units[0]?.floor_rise_rate || 150}/sqft per tier
              </p>
            </div>

            <!-- Stacking Legend -->
            <div style="display: flex; align-items: center; gap: 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">
              <span style="display: flex; align-items: center; gap: 5px; color: #065F46; white-space: nowrap;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981;"></span> Available
              </span>
              <span style="display: flex; align-items: center; gap: 5px; color: #92400E; white-space: nowrap;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #F59E0B;"></span> Held (15m Lock)
              </span>
              <span style="display: flex; align-items: center; gap: 5px; color: #1E40AF; white-space: nowrap;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #3B82F6;"></span> Booked
              </span>
              <span style="display: flex; align-items: center; gap: 5px; color: #475569; white-space: nowrap;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #64748B;"></span> Sold
              </span>
            </div>
          </div>

          <!-- Stacking Plan Floor Rows -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
    `;

  for (const tower of displayTowers) {
    const towerUnits = units.filter(u => u.tower_id === tower.id);
    const floorsMap = {};
    for (let f = tower.total_floors; f >= 1; f--) {
      floorsMap[f] = towerUnits.filter(u => u.floor_number === f);
    }

    for (let f = tower.total_floors; f >= 1; f--) {
      let rowUnits = floorsMap[f] || [];
      
      // Apply active status filters
      if (activeFilter === 'available') rowUnits = rowUnits.filter(u => u.status === 'available');
      if (activeFilter === 'held') rowUnits = rowUnits.filter(u => u.status === 'held');
      if (activeFilter === 'booked') rowUnits = rowUnits.filter(u => u.status === 'booked');
      if (activeFilter === 'sold') rowUnits = rowUnits.filter(u => u.status === 'sold');

      if (rowUnits.length === 0 && activeFilter !== 'all' && !activeFilter.startsWith('tower')) {
        continue;
      }

      const totalRowUnits = floorsMap[f]?.length || 4;
      const availInRow = (floorsMap[f] || []).filter(u => u.status === 'available').length;
      const tierLabel = f >= 7 ? 'Penthouse Tier' : f >= 4 ? 'Executive Tier' : 'Prestige Tier';

      html += `
        <div class="stitch-floor-row">
          <!-- Floor Indicator Badge -->
          <div class="stitch-floor-badge">
            <div>
              <span style="font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 700; color: #111318; display: block; line-height: 1.1;">Floor ${f < 10 ? '0' + f : f}</span>
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #FF5B37; letter-spacing: 0.04em;">${tierLabel}</span>
            </div>
            <div style="margin-top: 8px;">
              <span style="padding: 3px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; font-size: 10.5px; font-weight: 700; border: 1px solid rgba(16,185,129,0.3); white-space: nowrap;">
                ${availInRow}/${totalRowUnits} Avail
              </span>
            </div>
          </div>

          <!-- Unit Cards Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 10px; flex: 1;">
      `;

      for (const unit of rowUnits) {
        const isSelected = unit.id === window._selectedUnitId;
        const estAgreement = (unit.super_built_up_area * unit.base_price) + (unit.super_built_up_area * unit.floor_number * (unit.floor_rise_rate || 0)) + (unit.parking_cost || 0);
        const estCr = (estAgreement / 10000000).toFixed(2);

        // Status badge configuration
        let statusBadge = '';
        if (unit.status === 'available') {
          statusBadge = `<span style="padding: 2px 8px; border-radius: 9999px; background: #ECFDF5; color: #065F46; font-size: 11px; font-weight: 700; border: 1px solid rgba(16,185,129,0.25); display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;"><span style="width: 5px; height: 5px; border-radius: 50%; background: #10B981;"></span>Available</span>`;
        } else if (unit.status === 'held') {
          const diffMs = Math.max(0, new Date(unit.held_until || Date.now() + 700000) - new Date());
          const mins = Math.floor(diffMs / 60000);
          const secs = Math.floor((diffMs % 60000) / 1000);
          statusBadge = `<span style="padding: 2px 8px; border-radius: 9999px; background: #FFFBEB; color: #92400E; font-size: 11px; font-weight: 700; border: 1px solid #FDE68A; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;"><span style="width: 5px; height: 5px; border-radius: 50%; background: #F59E0B;"></span>Held (${mins}m ${secs}s)</span>`;
        } else if (unit.status === 'booked') {
          statusBadge = `<span style="padding: 2px 8px; border-radius: 9999px; background: #EFF6FF; color: #1E40AF; font-size: 11px; font-weight: 700; border: 1px solid #BFDBFE; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;"><span style="width: 5px; height: 5px; border-radius: 50%; background: #3B82F6;"></span>Booked</span>`;
        } else {
          statusBadge = `<span style="padding: 2px 8px; border-radius: 9999px; background: #F1F5F9; color: #475569; font-size: 11px; font-weight: 700; border: 1px solid #CBD5E1; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;"><span style="width: 5px; height: 5px; border-radius: 50%; background: #64748B;"></span>Sold</span>`;
        }

        html += `
          <div class="stitch-unit-card ${isSelected ? 'active-inspecting' : ''}" onclick="window._selectedUnitId='${unit.id}'; window.store.notify();">
            <div>
              <div class="stitch-unit-top">
                <span class="stitch-unit-id">${unit.unit_number}</span>
                ${statusBadge}
              </div>
              <div class="stitch-unit-config" title="${unit.configuration}">${unit.configuration}</div>
              <div class="stitch-unit-specs">
                <span>${unit.carpet_area} sqft</span>
                <span style="color: #FF5B37; font-weight: 600;">${unit.facing || 'Sea Facing'}</span>
              </div>
            </div>

            <div class="stitch-unit-footer">
              <div class="stitch-unit-price">₹${estCr} Cr</div>
              <div class="stitch-unit-actions" onclick="event.stopPropagation();">
                <button class="stitch-unit-btn" onclick="window.store.selectedCostSheetUnitId='${unit.id}'; window.store.setTab('cost-sheets');" title="Open Dynamic Cost Sheet">
                  Cost Sheet
                </button>
                ${unit.status === 'available' ? `
                  <button class="stitch-unit-btn btn-hold" onclick="window.openUnitModal('${unit.id}')" title="Place 15-Minute Hold">
                    Hold Unit
                  </button>
                ` : unit.status === 'held' ? `
                  <button class="stitch-unit-btn" style="background: #FEE2E2; color: #B91C1C; border-color: #FECACA;" onclick="window.handleReleaseHold('${unit.id}')" title="Release Hold">
                    Release
                  </button>
                ` : `
                  <button class="stitch-unit-btn" onclick="window.openUnitModal('${unit.id}')" title="View Dossier">
                    Dossier
                  </button>
                `}
                <button class="stitch-unit-btn" onclick="window.openFloorPlanModal('${unit.configuration.includes('4BHK') ? '4bhk' : '3bhk'}')" title="3D Architectural View">
                  Floor Plan
                </button>
              </div>
            </div>
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
    }
  }

  html += `
          </div>
        </div>

        <!-- RIGHT COLUMN: QUICK UNIT DOSSIER & INSPECTION DRAWER (from stitch_inventory_screen.html) -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Selected Unit Preview Card -->
          <div class="finexy-card" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="finexy-stat-label" style="color: #667085;">QUICK UNIT DOSSIER</span>
              <span style="padding: 2px 8px; border-radius: 9999px; background: #FFFBEB; color: #92400E; font-size: 11px; font-weight: 700; border: 1px solid #FDE68A; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">
                <span style="width: 5px; height: 5px; border-radius: 50%; background: #F59E0B;"></span>
                ${selectedUnit.status === 'held' ? 'Lock: 11m 40s' : selectedUnit.status.toUpperCase()}
              </span>
            </div>

            <!-- Architectural Render Visual -->
            <div style="position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 16/9; border: 1px solid rgba(0,0,0,0.06);">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" alt="Unit Architectural Rendering" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 12px;">
                <div style="color: #FFFFFF;">
                  <div style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; line-height: 1.1;">Unit ${selectedUnit.unit_number}</div>
                  <div style="font-size: 12px; font-weight: 500; opacity: 0.9; margin-top: 2px;">Floor ${selectedUnit.floor_number} • ${selectedUnit.configuration}</div>
                </div>
              </div>
            </div>

            <!-- Price & Yield Box -->
            <div style="background: #F4F5F7; padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 10.5px; font-weight: 600; text-transform: uppercase; color: #667085; display: block;">Gross All-Inclusive Cost</span>
                <span style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 800; color: #111318; white-space: nowrap;">₹${formattedSelFullCost}</span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 10.5px; font-weight: 600; text-transform: uppercase; color: #065F46; display: block;">Yield Index</span>
                <span style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; color: #065F46; background: #ECFDF5; padding: 2px 7px; border-radius: 6px; border: 1px solid rgba(16,185,129,0.3); white-space: nowrap;">+4.8% Est.</span>
              </div>
            </div>

            <!-- Itemized Specs Table -->
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #667085;">
                <span>Carpet Area (RERA)</span>
                <span style="font-weight: 600; color: #111318; font-family: 'Outfit', sans-serif;">${selectedUnit.carpet_area} sqft</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #667085;">
                <span>Balcony Deck</span>
                <span style="font-weight: 600; color: #111318; font-family: 'Outfit', sans-serif;">320 sqft Deck</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #667085;">
                <span>Base Rate Value</span>
                <span style="font-weight: 600; color: #111318; font-family: 'Outfit', sans-serif;">₹${selectedUnit.base_price.toLocaleString('en-IN')}/sqft</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #667085;">
                <span>Floor Rise Premium</span>
                <span style="font-weight: 600; color: #111318; font-family: 'Outfit', sans-serif;">₹${(selectedUnit.floor_rise_rate || 150) * selectedUnit.floor_number}/sqft</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #667085;">
                <span>Allocated Parking</span>
                <span style="font-weight: 600; color: #111318;">${selectedUnit.parking_slots || 2} Covered Podium</span>
              </div>
            </div>

            <!-- Quick Action Buttons -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
              <button class="btn btn-primary" onclick="window.openBookingModal('${selectedUnit.id}')" style="border-radius: 12px; height: 42px; font-weight: 600; font-size: 13.5px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span>Initiate Token Escrow</span>
              </button>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button class="finexy-filter-btn" onclick="window.store.selectedCostSheetUnitId='${selectedUnit.id}'; window.store.setTab('cost-sheets');" style="justify-content: center; padding: 8px 10px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M6 15h2"/><path d="M10 15h6"/></svg>
                  <span>Cost Sheet</span>
                </button>
                <button class="finexy-filter-btn" onclick="window.openFloorPlanModal('${selectedUnit.configuration.includes('4BHK') ? '4bhk' : '3bhk'}')" style="justify-content: center; padding: 8px 10px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                  <span>3D CAD Plan</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Stacking Guidance Rules Micro-Card (from stitch_inventory_screen.html) -->
          <div class="finexy-card" style="padding: 18px; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #111318; font-weight: 700; font-size: 14px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5B37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>Stacking Guidance Rules</span>
            </div>
            <p style="font-size: 12px; color: #667085; line-height: 1.5; margin: 0;">
              Units held under 15-minute lock auto-release back to pool if token transaction is not authorized within the terminal window. Dual holds require managing director approval.
            </p>
            <div style="padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; color: #FF5B37; cursor: pointer;">
              <span>Tower A RERA Certificate</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  container.innerHTML = html;
}

// Unit Modal Handler
window.openUnitModal = function(unitId) {
  const matrix = window.store.state.currentMatrix;
  if (!matrix) return;
  const unit = matrix.units.find(u => u.id === unitId);
  if (!unit) return;

  const estAgreement = (unit.super_built_up_area * unit.base_price) + (unit.super_built_up_area * unit.floor_number * (unit.floor_rise_rate || 0)) + (unit.parking_cost || 0);

  const modalHtml = `
    <div class="modal-overlay" id="unit-modal-overlay" onclick="if(event.target===this) window.closeModal('unit-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 620px; border-radius: 20px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Unit Specification: ${unit.unit_number}</h3>
            <p style="font-size: 12px; color: #667085; margin-top: 2px;">${matrix.project.name} • Floor ${unit.floor_number}</p>
          </div>
          <button class="modal-close" onclick="window.closeModal('unit-modal-overlay')">&times;</button>
        </div>
        <div class="modal-body" style="gap: 16px; padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; background: #F8F9FA; padding: 16px 20px; border-radius: 14px; border: 1.5px solid #E5E7EB;">
            <div>
              <div style="font-size: 11px; color: #6B7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Current Live Status</div>
              <div style="font-size: 16px; font-weight: 700; color: #111827; text-transform: capitalize; margin-top: 4px; display: flex; align-items: center; gap: 8px;">
                <span class="finexy-status-pill ${unit.status === 'available' ? 'status-completed' : unit.status === 'held' ? 'status-pending' : 'status-in-progress'}">
                  <span class="finexy-status-dot"></span>${unit.status}
                </span>
                ${unit.held_by_name ? `<span style="font-size: 12px; color: #D97706; font-weight: 600;">(Held by ${unit.held_by_name})</span>` : ''}
              </div>
            </div>
            <div>
              <div style="font-size: 11px; color: #6B7280; text-transform: uppercase; text-align: right; font-weight: 700; letter-spacing: 0.5px;">Estimated Agreement Value</div>
              <div style="font-size: 20px; font-weight: 800; color: #FF5B37; font-family: 'Outfit', sans-serif; text-align: right; margin-top: 2px;">
                ₹${(estAgreement / 10000000).toFixed(2)} Cr
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
            <div style="background: #FFFFFF; padding: 12px 14px; border-radius: 14px; border: 1.5px solid #E5E7EB;">
              <span style="color: #6B7280; font-size: 11.5px; font-weight: 600;">Configuration:</span>
              <strong style="color: #111827; display: block; margin-top: 3px; font-size: 14px;">${unit.configuration}</strong>
            </div>
            <div style="background: #FFFFFF; padding: 12px 14px; border-radius: 14px; border: 1.5px solid #E5E7EB;">
              <span style="color: #6B7280; font-size: 11.5px; font-weight: 600;">Facing & View:</span>
              <strong style="color: #111827; display: block; margin-top: 3px; font-size: 14px;">${unit.facing}</strong>
            </div>
            <div style="background: #FFFFFF; padding: 12px 14px; border-radius: 14px; border: 1.5px solid #E5E7EB;">
              <span style="color: #6B7280; font-size: 11.5px; font-weight: 600;">RERA Carpet Area:</span>
              <strong style="color: #111827; display: block; margin-top: 3px; font-size: 14px;">${unit.carpet_area} sq.ft.</strong>
            </div>
            <div style="background: #FFFFFF; padding: 12px 14px; border-radius: 14px; border: 1.5px solid #E5E7EB;">
              <span style="color: #6B7280; font-size: 11.5px; font-weight: 600;">Super Built-Up Area:</span>
              <strong style="color: #111827; display: block; margin-top: 3px; font-size: 14px;">${unit.super_built_up_area} sq.ft.</strong>
            </div>
            <div style="background: #FFFFFF; padding: 12px 14px; border-radius: 14px; border: 1.5px solid #E5E7EB;">
              <span style="color: #6B7280; font-size: 11.5px; font-weight: 600;">Base Rate:</span>
              <strong style="color: #111827; display: block; margin-top: 3px; font-size: 14px;">₹${unit.base_price.toLocaleString('en-IN')}/sqft</strong>
            </div>
            <div style="background: #FFFFFF; padding: 12px 14px; border-radius: 14px; border: 1.5px solid #E5E7EB;">
              <span style="color: #6B7280; font-size: 11.5px; font-weight: 600;">Floor Rise Rate:</span>
              <strong style="color: #111827; display: block; margin-top: 3px; font-size: 14px;">₹${unit.floor_rise_rate || 0}/sqft per floor</strong>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="padding: 16px 20px; border-top: 1px solid rgba(0,0,0,0.06);">
          ${unit.status === 'available' ? `
            <button class="btn btn-secondary" onclick="window.handleHoldUnit('${unit.id}')">
              Place 15-Min Hold
            </button>
          ` : unit.status === 'held' ? `
            <button class="btn btn-danger" onclick="window.handleReleaseHold('${unit.id}')">
              Release Hold
            </button>
          ` : ''}

          <button class="btn btn-secondary" onclick="window.closeModal('unit-modal-overlay'); window.openFloorPlanModal('${unit.configuration.includes('4BHK') ? '4bhk' : '3bhk'}')">
            3D Floor Plan
          </button>

          <button class="btn btn-primary" onclick="window.closeModal('unit-modal-overlay'); window.store.selectedCostSheetUnitId='${unit.id}'; window.store.setTab('cost-sheets');">
            Generate Cost Sheet
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.openFloorPlanModal = function(configKey = '4bhk') {
  const modalHtml = `
    <div class="modal-overlay" id="fp-modal-overlay" onclick="if(event.target===this) window.closeModal('fp-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 960px; max-height: 92vh; border-radius: 20px;">
        <div class="modal-header">
          <h3 class="modal-title" style="display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            Architectural CAD Plan & 3D Walkthrough
          </h3>
          <button class="modal-close" onclick="window.closeModal('fp-modal-overlay')">&times;</button>
        </div>
        <div class="modal-body" style="padding: 16px;" id="fp-modal-mount">
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const mount = document.getElementById('fp-modal-mount');
  if (mount && window.renderFloorPlanViewer) {
    if (window.switchFloorPlanConfig) window.switchFloorPlanConfig(configKey);
    window.renderFloorPlanViewer(mount);
  }
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
};

window.handleHoldUnit = async function(unitId) {
  window.closeModal('unit-modal-overlay');
  await window.store.holdUnit(unitId);
};

window.handleReleaseHold = async function(unitId) {
  window.closeModal('unit-modal-overlay');
  await window.store.releaseUnitHold(unitId);
};
