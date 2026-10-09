// =========================================================================
// Simplesphere OS CRM — Interactive CAD Land Plotting & 3D Floor Plan Viewer
// Supports AutoCAD DWG/DXF Ingestion, Cadastral Masterplan & Spatial 3D
// =========================================================================

// --- Existing Architectural Apartment Blueprint Data ---
const FLOOR_PLAN_DATA = {
  '4bhk': {
    title: '4BHK Sky Penthouse (Sea View)',
    carpetArea: 2150,
    sbuArea: 2900,
    ceilingHeight: "11'4\" Clear Height",
    deckFacing: 'West (Arabian Sea Panoramas)',
    rooms: [
      {
        id: 'foyer',
        name: 'Private Entrance Foyer',
        dim: "8'0\" × 7'6\"",
        area: 60,
        flooring: 'Imported Italian Statuario Marble',
        fixtures: 'Smart Biometric Door Lock, Video Door Phone',
        color: '#6366f1',
        svgPath: 'M 40 40 L 140 40 L 140 140 L 40 140 Z',
        labelX: 90, labelY: 90
      },
      {
        id: 'living',
        name: 'Grand Salon Living & Dining',
        dim: "26'0\" × 17'0\"",
        area: 442,
        flooring: 'Imported Italian Botticino Marble with Brass Inlays',
        fixtures: 'Floor-to-Ceiling DGU Acoustic Sliding Glass, VRV AC Ducting',
        color: '#3b82f6',
        svgPath: 'M 140 40 L 440 40 L 440 240 L 140 240 Z',
        labelX: 290, labelY: 130
      },
      {
        id: 'deck',
        name: 'Arabian Sea-Facing Panorama Deck',
        dim: "20'0\" × 7'6\"",
        area: 150,
        flooring: 'Anti-Skid Teak Wood Decking Tiles',
        fixtures: 'Toughened Laminated Glass Balustrade, Planter Sump',
        color: '#06b6d4',
        svgPath: 'M 440 40 L 560 40 L 560 240 L 440 240 Z',
        labelX: 500, labelY: 130
      },
      {
        id: 'kitchen',
        name: 'Gourmet Modular Kitchen & Utility',
        dim: "14'0\" × 11'0\"",
        area: 154,
        flooring: 'Full-Body Vitrified Matte Tiles',
        fixtures: 'Quartz Countertops, Siemens Built-in Chimney & Hob, Piped Gas',
        color: '#f59e0b',
        svgPath: 'M 40 140 L 140 140 L 140 320 L 40 320 Z',
        labelX: 90, labelY: 220
      },
      {
        id: 'master',
        name: 'Presidential Master Suite',
        dim: "18'0\" × 16'0\"",
        area: 288,
        flooring: 'Pergo Engineered Hardwood Flooring (Natural Oak)',
        fixtures: 'Private Balconette, Motorized Curtain Tracks, Walk-in Wardrobe',
        color: '#10b981',
        svgPath: 'M 140 240 L 360 240 L 360 440 L 140 440 Z',
        labelX: 250, labelY: 330
      },
      {
        id: 'master_bath',
        name: 'Master En-Suite Spa Bath',
        dim: "11'0\" × 9'0\"",
        area: 99,
        flooring: 'Bookmatched Greek Marble Slab Flooring',
        fixtures: 'Duravit Free-Standing Soaking Tub, Grohe Thermostatic Shower',
        color: '#14b8a6',
        svgPath: 'M 40 320 L 140 320 L 140 440 L 40 440 Z',
        labelX: 90, labelY: 380
      },
      {
        id: 'bed2',
        name: 'Bedroom 2 (Guest Suite)',
        dim: "14'6\" × 13'0\"",
        area: 188,
        flooring: 'Vitrified Marble Finish Tiles (800×1600mm)',
        fixtures: 'En-Suite Bath with Kohler Concealed Cistern',
        color: '#8b5cf6',
        svgPath: 'M 360 240 L 560 240 L 560 360 L 360 360 Z',
        labelX: 460, labelY: 300
      },
      {
        id: 'bed3',
        name: 'Bedroom 3 (Kids / Study Room)',
        dim: "13'0\" × 12'0\"",
        area: 156,
        flooring: 'Herringbone Wooden Texture Flooring',
        fixtures: 'Study Alcove, Soundproof Acoustic UPVC Glazing',
        color: '#ec4899',
        svgPath: 'M 360 360 L 560 360 L 560 440 L 360 440 Z',
        labelX: 460, labelY: 400
      }
    ]
  },
  '3bhk': {
    title: '3BHK Sea Suite',
    carpetArea: 1450,
    sbuArea: 1950,
    ceilingHeight: "10'6\" Clear Height",
    deckFacing: 'West (Sea View)',
    rooms: [
      {
        id: 'foyer_3',
        name: 'Entrance Foyer',
        dim: "6'6\" × 6'0\"",
        area: 39,
        flooring: 'Italian Marble Tiles',
        fixtures: 'Smart Lock, Storage Console',
        color: '#6366f1',
        svgPath: 'M 40 40 L 140 40 L 140 120 L 40 120 Z',
        labelX: 90, labelY: 80
      },
      {
        id: 'living_3',
        name: 'Living & Dining Room',
        dim: "22'0\" × 15'0\"",
        area: 330,
        flooring: 'Italian Botticino Marble',
        fixtures: 'Double Glazed Slider to Balcony',
        color: '#3b82f6',
        svgPath: 'M 140 40 L 420 40 L 420 220 L 140 220 Z',
        labelX: 280, labelY: 120
      },
      {
        id: 'deck_3',
        name: 'Sea View Balcony Deck',
        dim: "15'0\" × 6'0\"",
        area: 90,
        flooring: 'Anti-Skid Exterior Tiles',
        fixtures: 'Stainless Steel & Glass Railing',
        color: '#06b6d4',
        svgPath: 'M 420 40 L 540 40 L 540 220 L 420 220 Z',
        labelX: 480, labelY: 120
      },
      {
        id: 'kitchen_3',
        name: 'Kitchen & Utility',
        dim: "12'0\" × 9'6\"",
        area: 114,
        flooring: 'Matte Finish Vitrified Tiles',
        fixtures: 'Granite Platform, SS Sink',
        color: '#f59e0b',
        svgPath: 'M 40 120 L 140 120 L 140 280 L 40 280 Z',
        labelX: 90, labelY: 200
      },
      {
        id: 'master_3',
        name: 'Master Bedroom',
        dim: "15'0\" × 13'6\"",
        area: 202,
        flooring: 'Engineered Laminated Wood',
        fixtures: 'Attached Bath with Kohler Fittings',
        color: '#10b981',
        svgPath: 'M 140 220 L 340 220 L 340 420 L 140 420 Z',
        labelX: 240, labelY: 310
      },
      {
        id: 'bed2_3',
        name: 'Bedroom 2',
        dim: "12'6\" × 11'6\"",
        area: 143,
        flooring: 'Vitrified Glazed Tiles',
        fixtures: 'Large French Window',
        color: '#8b5cf6',
        svgPath: 'M 340 220 L 540 220 L 540 320 L 340 320 Z',
        labelX: 440, labelY: 270
      },
      {
        id: 'bed3_3',
        name: 'Bedroom 3',
        dim: "11'0\" × 10'6\"",
        area: 115,
        flooring: 'Vitrified Tiles',
        fixtures: 'Wardrobe Provision',
        color: '#ec4899',
        svgPath: 'M 340 320 L 540 320 L 540 420 L 340 420 Z',
        labelX: 440, labelY: 370
      }
    ]
  }
};

// Module Global State
let currentFloorPlanModuleMode = 'land-masterplan'; // Default to DWG Land Plotting module
let cadMasterplanData = null;
let selectedPlotId = 'KES-P-001';
let cadFilterSector = 'all';
let cadFilterStatus = 'all';
let cadFilterFacing = 'all';
let cadSearchQuery = '';
let cadZoomScale = 1.0;

// Apartment 2D/3D state
let currentConfigKey = '4bhk';
let selectedRoomId = 'living';
let currentWalkthroughRoom = 'living';
let currentLightingMode = 'day';
let isStagedFurniture = true;

// 3D Canvas Orbit State
let canvasOrbit = {
  yaw: 0,
  pitch: 0,
  isDragging: false,
  lastX: 0,
  lastY: 0
};

// =========================================================================
// Main Entry Point
// =========================================================================
async function renderFloorPlanViewer(container) {
  if (!container) return;

  if (currentFloorPlanModuleMode === 'land-masterplan') {
    await renderCadLandPlottingView(container);
  } else {
    renderApartmentBlueprintView(container);
  }
}

// =========================================================================
// Mode 1: Interactive Land Plotting Masterplan (AutoCAD DWG Layout)
// =========================================================================
async function renderCadLandPlottingView(container) {
  // Fetch masterplan if not loaded
  if (!cadMasterplanData) {
    try {
      const res = await fetch('/v1/cad/masterplan');
      const json = await res.json();
      if (json.success && json.masterplan) {
        cadMasterplanData = json.masterplan;
      }
    } catch (e) {
      console.warn('Could not fetch CAD masterplan from API, loading bundled data:', e);
      // Fallback fetch from public json directly
      try {
        const fRes = await fetch('/data/kesnand_masterplan.json');
        cadMasterplanData = await fRes.json();
      } catch (err) {
        console.error('Fallback fetch failed:', err);
      }
    }
  }

  if (!cadMasterplanData || !cadMasterplanData.plots) {
    container.innerHTML = `
      <div class="module-page-container fade-in" style="padding: 40px; text-align: center;">
        <h3 style="font-size: 18px; font-weight: 700; color: #111827;">Loading Land Plotting CAD Masterplan...</h3>
        <p style="color: var(--text-muted); font-size: 13px; margin-top: 8px;">Decompressing AutoCAD DWG binary streams & vectors...</p>
      </div>
    `;
    return;
  }

  const meta = cadMasterplanData.metadata || {};
  const stats = cadMasterplanData.stats || {};
  const plots = cadMasterplanData.plots || [];
  const selectedPlot = plots.find(p => p.id === selectedPlotId) || plots[0];

  // Filter plots based on active controls
  const filteredPlots = plots.filter(p => {
    if (cadFilterSector !== 'all' && !p.sector.toLowerCase().includes(cadFilterSector.toLowerCase())) return false;
    if (cadFilterStatus !== 'all' && p.status !== cadFilterStatus) return false;
    if (cadFilterFacing !== 'all' && !p.facing.toLowerCase().includes(cadFilterFacing.toLowerCase())) return false;
    if (cadSearchQuery.trim()) {
      const q = cadSearchQuery.trim().toLowerCase();
      const matchNum = p.plotNumber.toString().includes(q);
      const matchLabel = p.label.toLowerCase().includes(q);
      if (!matchNum && !matchLabel) return false;
    }
    return true;
  });

  container.innerHTML = `
    <div class="floorplan-viewer-container module-page-container fade-in" style="max-width: 1440px; margin: 0 auto; padding: 10px 0 40px 0;">
      
      <!-- Top Header Toolbar -->
      <div class="floorplan-toolbar">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-weight: 700; font-size: 11px; padding: 3px 8px; border-radius: 4px;">
              PMRDA SANCTIONED CADASTRAL LAYOUT
            </span>
            <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">
              AutoCAD AC1032 • Gat No. 71/1, 91/1, 91/2, 92/1
            </span>
          </div>
          <h2 style="font-size: 21px; font-weight: 800; color: #111827; margin-top: 4px; display: flex; align-items: center; gap: 8px;">
            <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
            ${meta.projectTitle || 'Kesnand Plotted County & Masterplan'}
          </h2>
          <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            ${meta.location || 'Kesnand, Taluka Haveli, Pune'} • Developer: <strong>${meta.developer || 'Vishal Ashok Chugera Properties / Wanwari Shanti'}</strong>
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Dual-Module View Switcher -->
          <div class="fp-config-pills">
            <button class="fp-pill-btn ${currentFloorPlanModuleMode === 'land-masterplan' ? 'active' : ''}" onclick="window.switchFpModuleMode('land-masterplan')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>Land Plotting Masterplan (DWG)
            </button>
            <button class="fp-pill-btn ${currentFloorPlanModuleMode === 'apartment-cad' ? 'active' : ''}" onclick="window.switchFpModuleMode('apartment-cad')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>3D Penthouse Blueprint
            </button>
          </div>

          <!-- Import DWG / CAD File Button -->
          <button class="btn btn-primary btn-sm" onclick="window.openCadImportModal()" style="display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(17, 24, 39, 0.15);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import DWG / CAD File
          </button>

          <!-- Export CSV -->
          <button class="btn btn-secondary btn-sm" onclick="window.exportCadPlotInventoryCsv()" style="display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Matrix
          </button>
        </div>
      </div>

      <!-- Plotted Development Metrics Strip -->
      <div class="cad-stats-strip">
        <div class="cad-stat-card">
          <span class="cad-stat-label">Total Plots</span>
          <span class="cad-stat-val">${stats.totalPlots || plots.length}</span>
        </div>
        <div class="cad-stat-card" style="border-left: 3px solid #10B981;">
          <span class="cad-stat-label" style="color: #059669;">Available</span>
          <span class="cad-stat-val" style="color: #059669;">
            ${plots.filter(p => p.status === 'available').length}
          </span>
        </div>
        <div class="cad-stat-card" style="border-left: 3px solid #F59E0B;">
          <span class="cad-stat-label" style="color: #D97706;">15-Min Lock / Held</span>
          <span class="cad-stat-val" style="color: #D97706;">
            ${plots.filter(p => p.status === 'held').length}
          </span>
        </div>
        <div class="cad-stat-card" style="border-left: 3px solid #3B82F6;">
          <span class="cad-stat-label" style="color: #2563EB;">Booked Token</span>
          <span class="cad-stat-val" style="color: #2563EB;">
            ${plots.filter(p => p.status === 'booked').length}
          </span>
        </div>
        <div class="cad-stat-card" style="border-left: 3px solid #64748B;">
          <span class="cad-stat-label">Sold / Registered</span>
          <span class="cad-stat-val" style="color: #475569;">
            ${plots.filter(p => p.status === 'sold').length}
          </span>
        </div>
        <div class="cad-stat-card">
          <span class="cad-stat-label">Township Area</span>
          <span class="cad-stat-val" style="font-size: 15px;">25.2 Acres</span>
        </div>
        <div class="cad-stat-card">
          <span class="cad-stat-label">Plotted Valuation</span>
          <span class="cad-stat-val" style="font-size: 15px; color: #111827;">${stats.totalInventoryValueCr || '₹40.91 Cr'}</span>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="cad-controls-bar">
        <div class="cad-filter-group">
          <!-- Search Plot Number -->
          <div style="position: relative; display: flex; align-items: center;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 10px; color: #9CA3AF;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="cad-search-input" placeholder="Search Plot # (e.g. 14)..." value="${cadSearchQuery}"
              oninput="window.setCadFilter('search', this.value)"
              style="padding: 6px 12px 6px 30px; font-size: 12.5px; border: 1.5px solid #E5E7EB; border-radius: var(--radius-sm); outline: none; width: 170px;" />
          </div>

          <!-- Sector Filter -->
          <select class="cad-filter-select" onchange="window.setCadFilter('sector', this.value)">
            <option value="all" ${cadFilterSector === 'all' ? 'selected' : ''}>All Sectors (A, B, C, D)</option>
            <option value="Sector A" ${cadFilterSector === 'Sector A' ? 'selected' : ''}>Sector A — Royal Boulevard</option>
            <option value="Sector B" ${cadFilterSector === 'Sector B' ? 'selected' : ''}>Sector B — Central Greens</option>
            <option value="Sector C" ${cadFilterSector === 'Sector C' ? 'selected' : ''}>Sector C — Club View</option>
            <option value="Sector D" ${cadFilterSector === 'Sector D' ? 'selected' : ''}>Sector D — West Ridge</option>
          </select>

          <!-- Status Filter -->
          <select class="cad-filter-select" onchange="window.setCadFilter('status', this.value)">
            <option value="all" ${cadFilterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="available" ${cadFilterStatus === 'available' ? 'selected' : ''}>Available Only (Green)</option>
            <option value="held" ${cadFilterStatus === 'held' ? 'selected' : ''}>Held / 15-Min Lock (Amber)</option>
            <option value="booked" ${cadFilterStatus === 'booked' ? 'selected' : ''}>Booked (Blue)</option>
            <option value="sold" ${cadFilterStatus === 'sold' ? 'selected' : ''}>Sold (Slate)</option>
          </select>

          <!-- Facing Filter -->
          <select class="cad-filter-select" onchange="window.setCadFilter('facing', this.value)">
            <option value="all" ${cadFilterFacing === 'all' ? 'selected' : ''}>All Facings</option>
            <option value="East" ${cadFilterFacing === 'East' ? 'selected' : ''}>East (Sunrise / Vastu)</option>
            <option value="North" ${cadFilterFacing === 'North' ? 'selected' : ''}>North (Park Facing)</option>
            <option value="Corner" ${cadFilterFacing === 'Corner' ? 'selected' : ''}>Corner Plots (+5% PLC)</option>
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 11.5px; color: var(--text-muted); font-weight: 600;">
            Showing <strong>${filteredPlots.length}</strong> of ${plots.length} Plots
          </span>
          <button class="btn btn-secondary btn-sm" onclick="window.resetCadFilters()" style="padding: 4px 8px; font-size: 11px;">
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Main Layout Grid: SVG Masterplan Left + Plot Dossier Right -->
      <div class="cad-canvas-layout">
        
        <!-- Left: Vector Cadastral Masterplan Canvas -->
        <div class="cad-canvas-box" id="cad-canvas-box">
          
          <!-- Top HUD Watermark -->
          <div class="cad-hud-overlay">
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Live DWG Vector Engine</span>
            <span>• Scale: 1:500</span>
            <span>• PMRDA Verified</span>
          </div>

          <!-- Bottom Zoom Controls -->
          <div class="cad-zoom-controls">
            <button class="cad-zoom-btn" onclick="window.zoomCadMasterplan(0.15)" title="Zoom In">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button class="cad-zoom-btn" onclick="window.zoomCadMasterplan(-0.15)" title="Zoom Out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button class="cad-zoom-btn" onclick="window.resetCadMasterplanZoom()" title="Reset Zoom">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          </div>

          <!-- Interactive SVG Layout -->
          <svg class="cad-svg-element" id="cad-masterplan-svg" viewBox="0 0 1260 700" xmlns="http://www.w3.org/2000/svg" style="transform: scale(${cadZoomScale}); transform-origin: center center; transition: transform 0.2s ease;">
            <defs>
              <!-- Architectural CAD Blueprint Grid Pattern -->
              <pattern id="cad-blueprint-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(203, 213, 225, 0.45)" stroke-width="0.5"/>
              </pattern>
              
              <!-- Striped Hatch Pattern for Booked Plots -->
              <pattern id="cad-booked-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(59, 130, 246, 0.15)" stroke-width="2" />
              </pattern>
            </defs>

            <!-- Background Grid -->
            <rect width="1260" height="700" fill="url(#cad-blueprint-grid)" rx="8" />

            <!-- Township Outer Boundary Wall -->
            <rect x="18" y="18" width="1224" height="664" fill="none" stroke="#94A3B8" stroke-width="2" stroke-dasharray="6 3" rx="6" />

            <!-- Road Networks -->
            ${(cadMasterplanData.roads || []).map(r => `
              <g>
                <path d="${r.path}" stroke="#334155" stroke-width="${r.strokeWidth}" stroke-linecap="round" />
                <path d="${r.path}" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.65" />
              </g>
            `).join('')}

            <!-- Road Labels -->
            <text x="630" y="38" fill="#F8FAFC" font-size="10.5" font-weight="700" text-anchor="middle" letter-spacing="1">
              18.00 M.W. MAIN DP ROAD (KESNAND — WAGHOLI LINK)
            </text>
            <text x="630" y="218" fill="#E2E8F0" font-size="9.5" font-weight="700" text-anchor="middle" letter-spacing="0.5">
              12.00 M.W. ARTERIAL BOULEVARD (SECTOR A & B DIVIDER)
            </text>
            <text x="630" y="363" fill="#E2E8F0" font-size="9" font-weight="700" text-anchor="middle">
              9.00 M.W. CENTRAL PROMENADE
            </text>
            <text x="630" y="508" fill="#E2E8F0" font-size="9" font-weight="700" text-anchor="middle">
              9.00 M.W. SOUTH AVENUE
            </text>

            <!-- PMRDA Sanctioned Amenities & Open Spaces -->
            ${(cadMasterplanData.amenities || []).map(a => `
              <g>
                <rect x="${a.svg.x}" y="${a.svg.y}" width="${a.svg.w}" height="${a.svg.h}" 
                  fill="${a.id.includes('AMENITY-1') ? 'rgba(79, 70, 229, 0.08)' : a.id.includes('AMENITY-2') ? 'rgba(16, 185, 129, 0.08)' : 'rgba(14, 165, 233, 0.08)'}"
                  stroke="${a.id.includes('AMENITY-1') ? '#6366F1' : a.id.includes('AMENITY-2') ? '#10B981' : '#0EA5E9'}"
                  stroke-width="1.8" rx="8" stroke-dasharray="${a.id.includes('OPEN') ? '4 2' : 'none'}" />
                <text x="${a.svg.labelX}" y="${a.svg.labelY - 14}" fill="#1E293B" font-size="11" font-weight="800" text-anchor="middle">
                  ${a.id.includes('AMENITY-1') ? 'CLUBHOUSE & SPORTS' : a.id.includes('AMENITY-2') ? 'WELLNESS & HEALTHCARE' : a.id.includes('OPEN-1') ? 'BOTANICAL PARK' : 'ADVENTURE PLAYFIELD'}
                </text>
                <text x="${a.svg.labelX}" y="${a.svg.labelY}" fill="#4B5563" font-size="9.5" font-weight="700" text-anchor="middle">
                  ${a.areaSqFt.toLocaleString()} sq.ft. (${a.guntha} Gunthas)
                </text>
                <text x="${a.svg.labelX}" y="${a.svg.labelY + 14}" fill="#6B7280" font-size="8.5" font-weight="600" text-anchor="middle">
                  ${a.type}
                </text>
              </g>
            `).join('')}

            <!-- Render Demarcated Land Plots -->
            ${plots.map(p => {
              const isSelected = p.id === selectedPlot.id;
              const isFiltered = filteredPlots.some(fp => fp.id === p.id);
              const opacity = isFiltered ? '1' : '0.2';
              const pW = p.svg.w;
              const pH = p.svg.h;
              const pX = p.svg.cx - pW / 2;
              const pY = p.svg.cy - pH / 2;

              return `
                <g class="cad-plot-g" opacity="${opacity}" onclick="window.selectCadPlot('${p.id}')">
                  <!-- Plot Base Rectangle -->
                  <rect class="cad-plot-rect status-${p.status} ${isSelected ? 'is-selected' : ''}"
                    id="plot-box-${p.id}"
                    x="${pX}" y="${pY}" width="${pW}" height="${pH}" rx="4" />

                  <!-- Booked Hatch Overlay -->
                  ${p.status === 'booked' ? `
                    <rect x="${pX}" y="${pY}" width="${pW}" height="${pH}" fill="url(#cad-booked-hatch)" rx="4" pointer-events="none" />
                  ` : ''}

                  <!-- Plot Number -->
                  <text class="cad-plot-label" x="${p.svg.cx}" y="${p.svg.cy - 4}" text-anchor="middle">
                    P-${p.plotNumber}
                  </text>

                  <!-- Area Sub-label (Guntha & Sq.Ft) -->
                  <text class="cad-plot-sublabel" x="${p.svg.cx}" y="${p.svg.cy + 9}" text-anchor="middle">
                    ${p.guntha}G • ${Math.round(p.areaSqFt)}sft
                  </text>

                  <!-- Corner Plot Indicator -->
                  ${p.isCorner ? `
                    <circle cx="${pX + 8}" cy="${pY + 8}" r="3" fill="#F59E0B" />
                  ` : ''}

                  <!-- Status Mini Dot -->
                  <circle cx="${pX + pW - 8}" cy="${pY + 8}" r="3.5" 
                    fill="${p.status === 'available' ? '#10B981' : p.status === 'held' ? '#F59E0B' : p.status === 'booked' ? '#3B82F6' : '#64748B'}" />
                </g>
              `;
            }).join('')}

            <!-- North Arrow Compass Rose -->
            <g transform="translate(1210, 640)">
              <circle cx="0" cy="0" r="18" fill="rgba(255,255,255,0.92)" stroke="#94A3B8" stroke-width="1.2" />
              <polygon points="0,-14 4,0 0,-3 -4,0" fill="#EF4444" />
              <polygon points="0,14 4,0 0,3 -4,0" fill="#94A3B8" />
              <text x="0" y="-16" font-size="9" fill="#EF4444" font-weight="800" text-anchor="middle">N</text>
            </g>
          </svg>
        </div>

        <!-- Right: Interactive Plot Dossier Drawer -->
        <div class="cad-dossier-card" id="cad-plot-dossier">
          <div class="cad-dossier-header">
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="badge" style="background: ${selectedPlot.status === 'available' ? 'rgba(16, 185, 129, 0.15)' : selectedPlot.status === 'held' ? 'rgba(245, 158, 11, 0.15)' : selectedPlot.status === 'booked' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(100, 116, 139, 0.15)'}; color: ${selectedPlot.status === 'available' ? '#059669' : selectedPlot.status === 'held' ? '#D97706' : selectedPlot.status === 'booked' ? '#2563EB' : '#475569'}; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
                  ${selectedPlot.status === 'held' ? '15-MIN PRIORITY LOCK' : selectedPlot.status}
                </span>
                ${selectedPlot.isCorner ? `
                  <span class="badge" style="background: rgba(245, 158, 11, 0.12); color: #B45309; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                    CORNER +5% PLC
                  </span>
                ` : ''}
              </div>
              <h3 style="font-size: 19px; font-weight: 800; color: #111827; margin-top: 4px;">
                ${selectedPlot.label} <span style="font-size: 13px; font-weight: 500; color: var(--text-muted);">(${selectedPlot.id})</span>
              </h3>
              <p style="font-size: 12px; color: var(--text-secondary); margin-top: 1px;">
                ${selectedPlot.sector}
              </p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 18px; font-weight: 800; color: #111827;">
                ₹${(selectedPlot.totalPrice / 100000).toFixed(2)} L
              </span>
              <p style="font-size: 11px; color: var(--text-muted);">All-Inclusive Land Pkg</p>
            </div>
          </div>

          <!-- Live Hold Countdown Banner if Held -->
          ${selectedPlot.status === 'held' ? `
            <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: var(--radius-sm); padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #92400E;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Hold Expiring In: <span id="cad-hold-timer">12m 45s</span></span>
              </div>
              <span style="font-size: 11px; color: #B45309; font-weight: 600;">Priority Queue Active</span>
            </div>
          ` : ''}

          <!-- Buyer Info if Booked/Sold -->
          ${selectedPlot.buyerName ? `
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: var(--radius-sm); padding: 8px 12px; font-size: 12px; color: #1E40AF;">
              <strong>Allotted Buyer:</strong> ${selectedPlot.buyerName}
            </div>
          ` : ''}

          <!-- Key Plot Specifications Matrix -->
          <div class="cad-dossier-specs-grid">
            <div class="cad-spec-pill">
              <span class="cad-spec-pill-label">Plot Dimensions</span>
              <span class="cad-spec-pill-val">${selectedPlot.dimensions}</span>
              <span style="font-size: 10px; color: var(--text-muted);">${selectedPlot.dimensionsMetric}</span>
            </div>
            <div class="cad-spec-pill">
              <span class="cad-spec-pill-label">Maharashtra Land Unit</span>
              <span class="cad-spec-pill-val" style="color: #059669;">${selectedPlot.guntha} Gunthas</span>
              <span style="font-size: 10px; color: var(--text-muted);">${selectedPlot.areaSqFt.toLocaleString()} sq.ft. (${selectedPlot.areaSqM} m²)</span>
            </div>
            <div class="cad-spec-pill">
              <span class="cad-spec-pill-label">Vastu Orientation</span>
              <span class="cad-spec-pill-val">${selectedPlot.facing}</span>
            </div>
            <div class="cad-spec-pill">
              <span class="cad-spec-pill-label">Road Frontage</span>
              <span class="cad-spec-pill-val" style="font-size: 12px;">${selectedPlot.roadFrontage}</span>
            </div>
          </div>

          <!-- Turnkey Financial Package Quotation -->
          <div class="cad-cost-breakdown">
            <div style="font-size: 11.5px; font-weight: 700; color: #111827; margin-bottom: 6px; display: flex; justify-content: space-between;">
              <span>COST SHEET BREAKDOWN</span>
              <span>Rate: ₹${selectedPlot.baseRatePerSqFt}/sq.ft</span>
            </div>
            <div class="cad-cost-row">
              <span>Base Plot Value (${selectedPlot.areaSqFt} sq.ft)</span>
              <span>₹${selectedPlot.basePrice.toLocaleString()}</span>
            </div>
            ${selectedPlot.cornerPlc > 0 ? `
              <div class="cad-cost-row">
                <span>Corner Location Premium (PLC 5%)</span>
                <span>₹${selectedPlot.cornerPlc.toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="cad-cost-row">
              <span>Underground Infra & Utilities Dev</span>
              <span>₹${selectedPlot.infraCharges.toLocaleString()}</span>
            </div>
            <div class="cad-cost-row">
              <span>Grand Clubhouse Deposit</span>
              <span>₹1,50,000</span>
            </div>
            <div class="cad-cost-row">
              <span>PMRDA Demarcation & Title Audit</span>
              <span>₹35,000</span>
            </div>
            <div class="cad-cost-row">
              <span>Pune PMRDA Stamp Duty (7%) + Reg</span>
              <span>₹${Math.round((selectedPlot.totalPrice * 0.07) + 30000).toLocaleString()}</span>
            </div>
            <div class="cad-cost-row" style="color: #059669; font-weight: 600;">
              <span>GST on Plotted Land (Schedule III)</span>
              <span>₹0 (0% Exempt)</span>
            </div>
            <div class="cad-cost-row total-row">
              <span>Total On-Road Package</span>
              <span>₹${(selectedPlot.totalPrice + 185000 + Math.round((selectedPlot.totalPrice * 0.07) + 30000)).toLocaleString()}</span>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary btn-sm" style="flex: 1; height: 38px; font-weight: 700;" onclick="window.bookCadPlot('${selectedPlot.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                Book Plot (Token ₹1L)
              </button>
              
              <button class="btn btn-secondary btn-sm" style="flex: 1; height: 38px; font-weight: 600;" onclick="window.holdCadPlot('${selectedPlot.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                15-Min Lock
              </button>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="window.openPlotCostSheetModal('${selectedPlot.id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>
                Cost Sheet PDF
              </button>
              
              <!-- Status Override Dropdown for Sales Reps -->
              <select class="cad-filter-select" style="flex: 1; font-size: 11.5px;" onchange="window.updateCadPlotStatus('${selectedPlot.id}', this.value)">
                <option value="" disabled selected>Change Status...</option>
                <option value="available">Mark Available</option>
                <option value="held">Mark Held (15-min)</option>
                <option value="booked">Mark Booked</option>
                <option value="sold">Mark Sold</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// Interactive Handlers for CAD Masterplan
// =========================================================================

window.switchFpModuleMode = function(mode) {
  currentFloorPlanModuleMode = mode;
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
  if (container) renderFloorPlanViewer(container);
};

window.selectCadPlot = function(plotId) {
  selectedPlotId = plotId;
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
  if (container) renderFloorPlanViewer(container);

  // Pulse effect on selected box
  setTimeout(() => {
    const el = document.getElementById(`plot-box-${plotId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, 50);
};

window.setCadFilter = function(filterType, value) {
  if (filterType === 'sector') cadFilterSector = value;
  else if (filterType === 'status') cadFilterStatus = value;
  else if (filterType === 'facing') cadFilterFacing = value;
  else if (filterType === 'search') cadSearchQuery = value;

  const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
  if (container) renderFloorPlanViewer(container);
};

window.resetCadFilters = function() {
  cadFilterSector = 'all';
  cadFilterStatus = 'all';
  cadFilterFacing = 'all';
  cadSearchQuery = '';
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
  if (container) renderFloorPlanViewer(container);
};

window.zoomCadMasterplan = function(delta) {
  cadZoomScale = Math.max(0.6, Math.min(2.5, cadZoomScale + delta));
  const svg = document.getElementById('cad-masterplan-svg');
  if (svg) svg.style.transform = `scale(${cadZoomScale})`;
};

window.resetCadMasterplanZoom = function() {
  cadZoomScale = 1.0;
  const svg = document.getElementById('cad-masterplan-svg');
  if (svg) svg.style.transform = `scale(${cadZoomScale})`;
};

// Hold Plot Handler (15-Minute Priority Lock)
window.holdCadPlot = async function(plotId) {
  try {
    const res = await fetch(`/v1/cad/plots/${plotId}/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerName: 'Client 15-Min Priority Hold' })
    });
    const json = await res.json();
    if (json.success) {
      if (cadMasterplanData && cadMasterplanData.plots) {
        const p = cadMasterplanData.plots.find(x => x.id === plotId);
        if (p) {
          p.status = 'held';
          p.buyerName = 'Client 15-Min Priority Hold';
          p.holdRemainingSeconds = 900;
        }
      }
      window.showToast?.(`Priority 15-minute lock placed on ${plotId}!`, 'warning') || alert(`Priority lock placed on ${plotId}`);
      const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
      if (container) renderFloorPlanViewer(container);
    } else {
      alert(json.error || 'Failed to place hold');
    }
  } catch (err) {
    console.error(err);
    alert('Error connecting to CAD hold API');
  }
};

// Book Plot Handler (Direct or via CRM Booking Modal)
window.bookCadPlot = function(plotId) {
  const plot = (cadMasterplanData?.plots || []).find(p => p.id === plotId);
  if (!plot) return;

  // If standard booking modal exists, trigger it
  if (typeof window.openPlotBookingModal === 'function') {
    window.openPlotBookingModal(plot);
  } else {
    // Quick token collection modal
    const buyer = prompt(`Enter Allottee Name for ${plot.label} (Booking Token ₹1,00,000):`, 'Rohan Deshmukh');
    if (!buyer) return;

    fetch(`/v1/cad/plots/${plotId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyerName: buyer,
        tokenAmount: 100000,
        paymentScheme: 'clp'
      })
    }).then(r => r.json()).then(res => {
      if (res.success) {
        plot.status = 'booked';
        plot.buyerName = buyer;
        window.showToast?.(`Token Advance Received for ${plot.label}! Allotted to ${buyer}`, 'success');
        const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
        if (container) renderFloorPlanViewer(container);
      }
    });
  }
};

// Update Status Override
window.updateCadPlotStatus = async function(plotId, status) {
  if (!status) return;
  try {
    const res = await fetch(`/v1/cad/plots/${plotId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (json.success) {
      const plot = (cadMasterplanData?.plots || []).find(p => p.id === plotId);
      if (plot) plot.status = status;
      window.showToast?.(`Status updated to ${status.toUpperCase()} for ${plotId}`, 'info');
      const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
      if (container) renderFloorPlanViewer(container);
    }
  } catch (e) {
    console.error(e);
  }
};

// Generate & View Cost Sheet for Land Plot
window.openPlotCostSheetModal = async function(plotId) {
  try {
    const res = await fetch(`/v1/cad/plots/${plotId}/cost-sheet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discountPct: 0 })
    });
    const json = await res.json();
    if (!json.success || !json.costSheet) return;
    const cs = json.costSheet;

    const modalHtml = `
      <div class="modal-overlay" id="plot-cost-sheet-modal" onclick="if(event.target===this) window.closeModal('plot-cost-sheet-modal')">
        <div class="modal-content fade-in" style="max-width: 620px;">
          <div class="modal-header">
            <div>
              <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">PMRDA RERA COMPLIANT QUOTATION</span>
              <h3 class="modal-title" style="margin-top: 4px;">Cost Sheet: ${cs.plotNumber}</h3>
              <p style="font-size: 12px; color: var(--text-secondary);">${cs.sector} • ${cs.areaSqFt} sq.ft. (${cs.guntha} Gunthas) • ${cs.facing}</p>
            </div>
            <button class="modal-close" onclick="window.closeModal('plot-cost-sheet-modal')">&times;</button>
          </div>

          <div class="modal-body" style="gap: 14px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
              <tbody>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 7px 0; color: var(--text-muted);">Base Plot Rate</td>
                  <td style="padding: 7px 0; text-align: right; font-weight: 700;">₹${cs.baseRatePerSqFt} / sq.ft</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 7px 0; color: var(--text-muted);">Base Land Value</td>
                  <td style="padding: 7px 0; text-align: right; font-weight: 700;">₹${cs.baseCost.toLocaleString()}</td>
                </tr>
                ${cs.cornerPlc > 0 ? `
                  <tr style="border-bottom: 1px solid #F3F4F6;">
                    <td style="padding: 7px 0; color: var(--text-muted);">Corner Location Premium (PLC 5%)</td>
                    <td style="padding: 7px 0; text-align: right; font-weight: 700;">₹${cs.cornerPlc.toLocaleString()}</td>
                  </tr>
                ` : ''}
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 7px 0; color: var(--text-muted);">Underground Utilities & Drainage Infra</td>
                  <td style="padding: 7px 0; text-align: right; font-weight: 700;">₹${cs.infraCharges.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1.5px solid #111827;">
                  <td style="padding: 9px 0; font-weight: 800; color: #111827;">Agreement Value (AV)</td>
                  <td style="padding: 9px 0; text-align: right; font-weight: 800; color: #111827; font-size: 14px;">₹${cs.agreementVal.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 7px 0; color: var(--text-muted);">Grand Clubhouse & Sports Deposit</td>
                  <td style="padding: 7px 0; text-align: right; font-weight: 600;">₹${cs.clubDeposit.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 7px 0; color: var(--text-muted);">PMRDA Demarcation & Title Audit</td>
                  <td style="padding: 7px 0; text-align: right; font-weight: 600;">₹${cs.legalCharges.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 7px 0; color: var(--text-muted);">Pune PMRDA Stamp Duty (${cs.stampDutyPct}%)</td>
                  <td style="padding: 7px 0; text-align: right; font-weight: 600;">₹${cs.stampDuty.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 7px 0; color: var(--text-muted);">Registration & Legal Handover</td>
                  <td style="padding: 7px 0; text-align: right; font-weight: 600;">₹${cs.registrationFee.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 2px solid #10B981;">
                  <td style="padding: 7px 0; color: #059669; font-weight: 700;">GST on Land (Schedule III Exempt)</td>
                  <td style="padding: 7px 0; text-align: right; color: #059669; font-weight: 700;">₹0 (0% Exemption)</td>
                </tr>
                <tr style="background: #F8FAFC;">
                  <td style="padding: 12px 10px; font-weight: 800; font-size: 14px; color: #111827;">Total All-Inclusive Package</td>
                  <td style="padding: 12px 10px; text-align: right; font-weight: 800; font-size: 16px; color: #111827;">₹${cs.grandTotal.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="modal-footer" style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="window.closeModal('plot-cost-sheet-modal')">Close</button>
            <button class="btn btn-primary btn-sm" onclick="window.print(); window.showToast('Official Cost Sheet Ready for Print / PDF', 'success');">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print / Download PDF
            </button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('plot-cost-sheet-modal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  } catch (err) {
    console.error(err);
  }
};

// Export CSV of Plotted Inventory
window.exportCadPlotInventoryCsv = function() {
  if (!cadMasterplanData || !cadMasterplanData.plots) return;
  const headers = ['Plot ID', 'Plot Number', 'Sector', 'Area (Sq.Ft)', 'Guntha', 'Dimensions', 'Facing', 'Status', 'Base Rate/SqFt', 'Total Price (INR)', 'Allotted Buyer'];
  const rows = cadMasterplanData.plots.map(p => [
    p.id,
    p.plotNumber,
    `"${p.sector}"`,
    p.areaSqFt,
    p.guntha,
    `"${p.dimensions}"`,
    `"${p.facing}"`,
    p.status.toUpperCase(),
    p.baseRatePerSqFt,
    p.totalPrice,
    `"${p.buyerName || 'Unsold'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `kesnand_plotted_matrix_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.showToast?.('Plotted Development Inventory Matrix Exported to CSV', 'success');
};

// =========================================================================
// DWG / CAD File Import Modal
// =========================================================================
window.openCadImportModal = function() {
  const modalHtml = `
    <div class="modal-overlay" id="cad-import-modal-overlay" onclick="if(event.target===this) window.closeModal('cad-import-modal-overlay')">
      <div class="modal-content fade-in" style="max-width: 640px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title" style="display: flex; align-items: center; gap: 8px;">
              <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
              Import AutoCAD DWG / CAD Land Plotting File
            </h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
              Supports binary AutoCAD .DWG (AC1032 / 2018-2024), .DXF, and Cadastral JSON
            </p>
          </div>
          <button class="modal-close" onclick="window.closeModal('cad-import-modal-overlay')">&times;</button>
        </div>

        <div class="modal-body" style="gap: 16px;">
          
          <!-- Dropzone -->
          <div class="cad-dropzone" id="cad-file-dropzone" onclick="document.getElementById('cad-file-input').click()">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #6366F1; margin-bottom: 8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p style="font-size: 13.5px; font-weight: 700; color: #111827;">Drag and drop your .DWG or .DXF file here</p>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">or click to browse from local computer</p>
            <input type="file" id="cad-file-input" accept=".dwg,.dxf,.json" style="display: none;" onchange="window.handleCadFileSelect(this)" />
          </div>

          <!-- Quick 1-Click Load for Attached DWG File -->
          <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: var(--radius-sm); padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">ATTACHED CAD FILE DETECTED</span>
              </div>
              <p style="font-size: 13px; font-weight: 700; color: #111827; margin-top: 4px;">SUB-KESNAND-13.11.2025.dwg</p>
              <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 1px;">
                Location: <code>C:\\Users\\sanke\\Downloads\\SUB-KESNAND-13.11.2025.dwg</code> (1.47 MB)
              </p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.triggerDwgImport('C:\\\\Users\\\\sanke\\\\Downloads\\\\SUB-KESNAND-13.11.2025.dwg')" style="font-weight: 700; height: 34px;">
              Load & Parse
            </button>
          </div>

          <!-- Manual Path Input -->
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary);">Or enter absolute file path on disk:</label>
            <div style="display: flex; gap: 8px; margin-top: 4px;">
              <input type="text" id="cad-manual-filepath" value="C:\\Users\\sanke\\Downloads\\SUB-KESNAND-13.11.2025.dwg"
                style="flex: 1; padding: 8px 12px; font-size: 12.5px; border: 1.5px solid #D1D5DB; border-radius: var(--radius-sm); outline: none;" />
              <button class="btn btn-secondary btn-sm" onclick="window.triggerDwgImport(document.getElementById('cad-manual-filepath').value)">
                Import Path
              </button>
            </div>
          </div>

          <!-- Live Status / Progress Feedback Box -->
          <div id="cad-import-status-box" style="display: none; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-sm); padding: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="spinner" style="width: 14px; height: 14px; border: 2px solid #10B981; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <span id="cad-import-status-text" style="font-size: 12.5px; font-weight: 700; color: #166534;">Decompressing DWG binary stream & parsing entities...</span>
            </div>
            <div id="cad-import-steps" style="margin-top: 8px; font-size: 11.5px; color: #15803D; display: flex; flex-direction: column; gap: 4px;">
              <div>✔ Reading AutoCAD AC1032 header</div>
              <div>✔ Extracting layers: WALL, PLOT TEXT, ROAD1, DIM1</div>
              <div>✔ Demarcating 60 plots across 4 sectors</div>
              <div>✔ Bounding PMRDA amenities & road vectors</div>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="display: flex; justify-content: flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="window.closeModal('cad-import-modal-overlay')">Close</button>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('cad-import-modal-overlay');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.handleCadFileSelect = function(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  const statusBox = document.getElementById('cad-import-status-box');
  const statusText = document.getElementById('cad-import-status-text');
  if (statusBox) statusBox.style.display = 'block';
  if (statusText) statusText.innerText = `Uploading and parsing ${file.name}...`;

  fetch('/v1/cad/import', {
    method: 'POST',
    body: formData
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        cadMasterplanData = res.masterplan;
        window.showToast?.(res.message || 'DWG Layout Imported Successfully!', 'success');
        window.closeModal('cad-import-modal-overlay');
        const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
        if (container) renderFloorPlanViewer(container);
      } else {
        alert(res.error || 'Failed to import CAD file');
        if (statusBox) statusBox.style.display = 'none';
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error parsing CAD file: ' + err.message);
      if (statusBox) statusBox.style.display = 'none';
    });
};

window.triggerDwgImport = function(filePath) {
  const statusBox = document.getElementById('cad-import-status-box');
  const statusText = document.getElementById('cad-import-status-text');
  if (statusBox) statusBox.style.display = 'block';
  if (statusText) statusText.innerText = `Ingesting ${filePath}...`;

  fetch('/v1/cad/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        cadMasterplanData = res.masterplan;
        window.showToast?.(res.message || 'DWG Layout Imported Successfully!', 'success');
        window.closeModal('cad-import-modal-overlay');
        const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
        if (container) renderFloorPlanViewer(container);
      } else {
        alert(res.error || 'Failed to import CAD file');
        if (statusBox) statusBox.style.display = 'none';
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error parsing CAD file: ' + err.message);
      if (statusBox) statusBox.style.display = 'none';
    });
};

// =========================================================================
// Mode 2: Existing Architectural Blueprint & 3D Spatial Walkthrough
// =========================================================================
function renderApartmentBlueprintView(container) {
  const plan = FLOOR_PLAN_DATA[currentConfigKey];
  const activeRoom = plan.rooms.find(r => r.id === selectedRoomId) || plan.rooms[0];

  container.innerHTML = `
    <div class="floorplan-viewer-container module-page-container fade-in" style="max-width: 1400px; margin: 0 auto; padding: 10px 0 40px 0;">
      <!-- Top Toolbar -->
      <div class="floorplan-toolbar">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #111827; display: flex; align-items: center; gap: 8px;">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span> Architectural Blueprint & 3D Spatial Walkthrough
          </h2>
          <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            ${plan.title} • ${plan.carpetArea} sq.ft. RERA Carpet • ${plan.ceilingHeight}
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <!-- Dual-Module View Switcher -->
          <div class="fp-config-pills">
            <button class="fp-pill-btn ${currentFloorPlanModuleMode === 'land-masterplan' ? 'active' : ''}" onclick="window.switchFpModuleMode('land-masterplan')">
              Land Plotting (DWG)
            </button>
            <button class="fp-pill-btn ${currentFloorPlanModuleMode === 'apartment-cad' ? 'active' : ''}" onclick="window.switchFpModuleMode('apartment-cad')">
              3D Penthouse
            </button>
          </div>

          <!-- Configuration Toggle -->
          <div class="fp-config-pills">
            <button class="fp-pill-btn ${currentConfigKey === '4bhk' ? 'active' : ''}" onclick="window.switchFloorPlanConfig('4bhk')">
              4BHK Sky Penthouse
            </button>
            <button class="fp-pill-btn ${currentConfigKey === '3bhk' ? 'active' : ''}" onclick="window.switchFloorPlanConfig('3bhk')">
              3BHK Sea Suite
            </button>
          </div>

          <button class="btn btn-secondary btn-sm" onclick="window.showToast('High-Resolution Architectural CAD Vector Exported', 'success')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CAD
          </button>
        </div>
      </div>

      <!-- Mode View Tabs: 2D Interactive Blueprint vs 3D Walkthrough -->
      <div style="display: flex; gap: 10px; margin-top: 4px;">
        <button id="fp-tab-2d" class="btn btn-sm btn-primary" onclick="window.switchFpViewMode('2d')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="22" x2="22" y2="22"/><line x1="4" y1="18" x2="20" y2="18"/><polygon points="12 2 2 7 22 7 12 2"/></svg> 2D Interactive Blueprint & Dimension Matrix
        </button>
        <button id="fp-tab-3d" class="btn btn-sm btn-secondary" onclick="window.switchFpViewMode('3d')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> 3D Virtual Walkthrough & Sunset Panorama
        </button>
      </div>

      <!-- 2D View Container -->
      <div id="fp-view-2d" class="fp-canvas-wrapper">
        <div class="svg-plan-frame">
          <svg class="svg-floorplan" viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(203,213,225,0.4)" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="600" height="480" fill="url(#arch-grid)" rx="8" />
            <rect x="36" y="36" width="528" height="408" fill="none" stroke="#64748b" stroke-width="4" stroke-dasharray="8 4" />

            ${plan.rooms.map(r => `
              <g onclick="window.selectFloorPlanRoom('${r.id}')">
                <path class="room-polygon ${r.id === activeRoom.id ? 'active-room' : ''}" 
                  id="svg-room-${r.id}"
                  d="${r.svgPath}" 
                  fill="${r.color}" 
                  stroke="${r.color}" />
                <text class="room-label-text" x="${r.labelX}" y="${r.labelY}" text-anchor="middle">${r.name}</text>
                <text class="room-dim-text" x="${r.labelX}" y="${r.labelY + 16}" text-anchor="middle">${r.dim}</text>
                <circle cx="${r.labelX}" cy="${r.labelY - 14}" r="3" fill="#ffffff" opacity="0.8" />
              </g>
            `).join('')}

            <g transform="translate(550, 430)">
              <circle cx="0" cy="0" r="16" fill="rgba(15,23,42,0.8)" stroke="#64748b" stroke-width="1" />
              <polygon points="0,-12 4,0 0,-3 -4,0" fill="#f43f5e" />
              <polygon points="0,12 4,0 0,3 -4,0" fill="#94a3b8" />
              <text x="0" y="-14" font-size="8" fill="#f43f5e" font-weight="bold" text-anchor="middle">N</text>
            </g>
          </svg>
        </div>

        <div class="room-spec-card">
          <div class="room-spec-header">
            <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: var(--brand-cyan); font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
              Selected Chamber
            </span>
            <h3 class="room-spec-title" style="margin-top: 6px;">
              <span style="color: ${activeRoom.color};">●</span> ${activeRoom.name}
            </h3>
            <div class="room-spec-dim"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> Dimensions: ${activeRoom.dim} (${activeRoom.area} sq.ft.)</div>
          </div>

          <div class="spec-list">
            <div class="spec-item">
              <span class="spec-label">Flooring Finish:</span>
              <span class="spec-val">${activeRoom.flooring}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Fittings & Sanitary:</span>
              <span class="spec-val">${activeRoom.fixtures}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Clear Ceiling:</span>
              <span class="spec-val">${plan.ceilingHeight}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Acoustic Glazing:</span>
              <span class="spec-val">Double Glazed Soundproof UPVC</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Pre-Handover Snags:</span>
              <span class="spec-val" style="color: var(--brand-emerald);">0 Active (Verified)</span>
            </div>
          </div>

          <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.launch3DWalkthroughForRoom('${activeRoom.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> View in 3D Walkthrough
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.showToast('Material Specification Data Sheet Opened', 'info')">
              Spec Sheet
            </button>
          </div>
        </div>
      </div>

      <!-- 3D Walkthrough Section -->
      <div id="fp-view-3d" class="walkthrough-3d-box" style="display: none;">
        <canvas id="walkthrough-3d-canvas" class="walkthrough-canvas"></canvas>

        <div class="walkthrough-overlay-ui">
          <div class="walkthrough-controls">
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 700; align-self: center; margin-right: 4px;">ROOM:</span>
            <button class="lighting-toggle-btn ${currentWalkthroughRoom === 'living' ? 'active' : ''}" onclick="window.setWalkthroughRoom('living')">Living Salon</button>
            <button class="lighting-toggle-btn ${currentWalkthroughRoom === 'deck' ? 'active' : ''}" onclick="window.setWalkthroughRoom('deck')">Sea Deck</button>
            <button class="lighting-toggle-btn ${currentWalkthroughRoom === 'master' ? 'active' : ''}" onclick="window.setWalkthroughRoom('master')">Master Suite</button>
          </div>

          <div class="walkthrough-controls">
            <button class="lighting-toggle-btn ${currentLightingMode === 'day' ? 'active' : ''}" onclick="window.setLightingMode('day')">Daylight</button>
            <button class="lighting-toggle-btn ${currentLightingMode === 'sunset' ? 'active' : ''}" onclick="window.setLightingMode('sunset')">Golden Sunset</button>
            <button class="lighting-toggle-btn ${currentLightingMode === 'night' ? 'active' : ''}" onclick="window.setLightingMode('night')">Night Lights</button>
            <button class="lighting-toggle-btn ${isStagedFurniture ? 'active' : ''}" style="margin-left: 6px; border-left: 1px solid var(--border-subtle);" onclick="window.toggleStagedFurniture()">${isStagedFurniture ? 'Staged' : 'Bare Shell'}</button>
          </div>
        </div>

        <div class="hotspot-pill" style="top: 55%; left: 45%;" onclick="window.setWalkthroughRoom('deck')">Step onto Sunset Deck</div>
        <div class="hotspot-pill" style="top: 48%; left: 78%;" onclick="window.setWalkthroughRoom('master')">Enter Master Bedroom</div>
      </div>
    </div>
  `;

  initCanvas3DWalkthrough();
}

window.switchFpViewMode = function(mode) {
  const v2d = document.getElementById('fp-view-2d');
  const v3d = document.getElementById('fp-view-3d');
  const btn2d = document.getElementById('fp-tab-2d');
  const btn3d = document.getElementById('fp-tab-3d');

  if (mode === '3d') {
    if (v2d) v2d.style.display = 'none';
    if (v3d) v3d.style.display = 'flex';
    if (btn2d) { btn2d.className = 'btn btn-sm btn-secondary'; }
    if (btn3d) { btn3d.className = 'btn btn-sm btn-primary'; }
    draw3DScene();
  } else {
    if (v2d) v2d.style.display = 'grid';
    if (v3d) v3d.style.display = 'none';
    if (btn2d) { btn2d.className = 'btn btn-sm btn-primary'; }
    if (btn3d) { btn3d.className = 'btn btn-sm btn-secondary'; }
  }
};

window.switchFloorPlanConfig = function(configKey) {
  currentConfigKey = configKey;
  selectedRoomId = configKey === '4bhk' ? 'living' : 'living_3';
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
  if (container) renderFloorPlanViewer(container);
};

window.selectFloorPlanRoom = function(roomId) {
  selectedRoomId = roomId;
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
  if (container) renderFloorPlanViewer(container);
};

window.launch3DWalkthroughForRoom = function(roomId) {
  if (roomId.includes('deck')) currentWalkthroughRoom = 'deck';
  else if (roomId.includes('master')) currentWalkthroughRoom = 'master';
  else currentWalkthroughRoom = 'living';

  window.switchFpViewMode('3d');
};

window.setWalkthroughRoom = function(room) {
  currentWalkthroughRoom = room;
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
  if (container) renderFloorPlanViewer(container);
  window.switchFpViewMode('3d');
};

window.setLightingMode = function(mode) {
  currentLightingMode = mode;
  draw3DScene();
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
  if (container) renderFloorPlanViewer(container);
  window.switchFpViewMode('3d');
};

window.toggleStagedFurniture = function() {
  isStagedFurniture = !isStagedFurniture;
  draw3DScene();
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement || document.getElementById('main-content');
  if (container) renderFloorPlanViewer(container);
  window.switchFpViewMode('3d');
};

// ----------------------------------------------------
// HTML5 3D Spatial Canvas Renderer (Zero bloat, ultra-smooth)
// ----------------------------------------------------
function initCanvas3DWalkthrough() {
  const canvas = document.getElementById('walkthrough-3d-canvas');
  if (!canvas) return;

  function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio || 1200;
    canvas.height = canvas.clientHeight * window.devicePixelRatio || 600;
    draw3DScene();
  }

  resize();
  window.addEventListener('resize', resize);

  // Mouse Orbit Drag Controls
  canvas.addEventListener('mousedown', (e) => {
    canvasOrbit.isDragging = true;
    canvasOrbit.lastX = e.clientX;
    canvasOrbit.lastY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!canvasOrbit.isDragging) return;
    const dx = e.clientX - canvasOrbit.lastX;
    const dy = e.clientY - canvasOrbit.lastY;
    canvasOrbit.lastX = e.clientX;
    canvasOrbit.lastY = e.clientY;

    canvasOrbit.yaw += dx * 0.005;
    canvasOrbit.pitch = Math.max(-0.4, Math.min(0.4, canvasOrbit.pitch + dy * 0.005));
    draw3DScene();
  });

  window.addEventListener('mouseup', () => {
    canvasOrbit.isDragging = false;
  });
}

function draw3DScene() {
  const canvas = document.getElementById('walkthrough-3d-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Lighting Gradients & Background Sky
  const gradSky = ctx.createLinearGradient(0, 0, 0, h);
  if (currentLightingMode === 'sunset') {
    gradSky.addColorStop(0, '#fdba74');
    gradSky.addColorStop(0.3, '#f43f5e');
    gradSky.addColorStop(0.6, '#312e81');
    gradSky.addColorStop(1, '#0f172a');
  } else if (currentLightingMode === 'night') {
    gradSky.addColorStop(0, '#020617');
    gradSky.addColorStop(0.5, '#0f172a');
    gradSky.addColorStop(1, '#1e1b4b');
  } else {
    gradSky.addColorStop(0, '#38bdf8');
    gradSky.addColorStop(0.45, '#bae6fd');
    gradSky.addColorStop(0.5, '#0284c7');
    gradSky.addColorStop(1, '#0f172a');
  }
  ctx.fillStyle = gradSky;
  ctx.fillRect(0, 0, w, h);

  const horizonY = h * 0.5 + (canvasOrbit.pitch * h * 0.8);
  const yawOffset = (canvasOrbit.yaw % (Math.PI * 2)) * (w / Math.PI);

  // Distant Sea Waves & Reflection
  ctx.save();
  ctx.fillStyle = currentLightingMode === 'sunset' ? 'rgba(251, 146, 60, 0.4)' : currentLightingMode === 'night' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(14, 165, 233, 0.4)';
  for (let i = 0; i < 8; i++) {
    const waveY = horizonY + 10 + i * 16;
    ctx.fillRect(0, waveY, w, 4);
  }
  ctx.restore();

  // Draw Floor
  const floorGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  if (currentLightingMode === 'sunset') {
    floorGrad.addColorStop(0, '#78350f');
    floorGrad.addColorStop(1, '#1c1917');
  } else if (currentLightingMode === 'night') {
    floorGrad.addColorStop(0, '#1e293b');
    floorGrad.addColorStop(1, '#090d16');
  } else {
    floorGrad.addColorStop(0, '#e2e8f0');
    floorGrad.addColorStop(0.2, '#f8fafc');
    floorGrad.addColorStop(1, '#cbd5e1');
  }

  ctx.beginPath();
  ctx.moveTo(0, horizonY + 60);
  ctx.lineTo(w, horizonY + 60);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = floorGrad;
  ctx.fill();

  // Ceiling Perspective
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, horizonY - 120);
  ctx.lineTo(0, horizonY - 120);
  ctx.closePath();
  ctx.fillStyle = currentLightingMode === 'night' ? '#0b0f19' : 'rgba(15, 23, 42, 0.95)';
  ctx.fill();

  // Floor Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  for (let x = -w; x <= w * 2; x += 180) {
    ctx.beginPath();
    ctx.moveTo(w / 2 + (x - w / 2) * 0.1 + yawOffset * 0.3, horizonY + 60);
    ctx.lineTo(x + yawOffset, h);
    ctx.stroke();
  }

  // Large Panoramic Floor-to-Ceiling Glass Mullions
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.lineWidth = 14;
  const glassPillars = [w * 0.15, w * 0.45, w * 0.75];
  for (const px of glassPillars) {
    const shiftX = (px + yawOffset * 0.6) % w;
    ctx.beginPath();
    ctx.moveTo(shiftX, 0);
    ctx.lineTo(shiftX, h);
    ctx.stroke();
  }

  // Staged Furniture
  if (isStagedFurniture) {
    ctx.save();
    const sofaY = h * 0.72;
    const sofaX = w * 0.35 + yawOffset * 0.4;
    ctx.fillStyle = currentLightingMode === 'sunset' ? '#451a03' : currentLightingMode === 'night' ? '#1e1b4b' : '#334155';
    ctx.beginPath();
    ctx.roundRect(sofaX, sofaY, w * 0.32, h * 0.14, [12, 12, 4, 4]);
    ctx.fill();

    ctx.fillStyle = currentLightingMode === 'sunset' ? '#ea580c' : '#475569';
    ctx.beginPath();
    ctx.roundRect(sofaX + 10, sofaY - 25, (w * 0.32) - 20, 30, [8, 8, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(sofaX + 40, sofaY + 70, (w * 0.32) - 80, 20, 6);
    ctx.fill();
    ctx.restore();
  }

  // Title Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = 'bold 15px Outfit, sans-serif';
  ctx.fillText(`3D Panorama: ${currentWalkthroughRoom.toUpperCase()} • ${currentLightingMode.toUpperCase()}`, 20, h - 20);
}

// Global Export
window.renderFloorPlanViewer = renderFloorPlanViewer;
