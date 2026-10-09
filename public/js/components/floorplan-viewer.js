// Interactive SVG Architectural Floor-Plan Viewer & 3D Walkthrough
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

function renderFloorPlanViewer(container) {
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CAD / Vector
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
        <!-- Left: Interactive Vector Blueprint -->
        <div class="svg-plan-frame">
          <svg class="svg-floorplan" viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Architectural Blueprint Grid Pattern -->
              <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
              </pattern>
            </defs>

            <!-- Background Grid -->
            <rect width="600" height="480" fill="url(#arch-grid)" rx="8" />

            <!-- Outer Wall Perimeter Frame -->
            <rect x="36" y="36" width="528" height="408" fill="none" stroke="#64748b" stroke-width="4" stroke-dasharray="8 4" />

            <!-- Room Polygons -->
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

            <!-- Architectural Compass Rose (North Arrow) -->
            <g transform="translate(550, 430)">
              <circle cx="0" cy="0" r="16" fill="rgba(15,23,42,0.8)" stroke="#64748b" stroke-width="1" />
              <polygon points="0,-12 4,0 0,-3 -4,0" fill="#f43f5e" />
              <polygon points="0,12 4,0 0,3 -4,0" fill="#94a3b8" />
              <text x="0" y="-14" font-size="8" fill="#f43f5e" font-weight="bold" text-anchor="middle">N</text>
            </g>
          </svg>
        </div>

        <!-- Right: Detailed Room Specification Card -->
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> View in 3D Walkthrough
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.showToast('Material Specification Data Sheet Opened', 'info')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg> Spec Sheet
            </button>
          </div>
        </div>
      </div>

      <!-- 3D Walkthrough Section -->
      <div id="fp-view-3d" class="walkthrough-3d-box" style="display: none;">
        <canvas id="walkthrough-3d-canvas" class="walkthrough-canvas"></canvas>

        <div class="walkthrough-overlay-ui">
          <!-- Room Selector Hotspots -->
          <div class="walkthrough-controls">
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 700; align-self: center; margin-right: 4px;">ROOM:</span>
            <button class="lighting-toggle-btn ${currentWalkthroughRoom === 'living' ? 'active' : ''}" onclick="window.setWalkthroughRoom('living')">
              Living Salon
            </button>
            <button class="lighting-toggle-btn ${currentWalkthroughRoom === 'deck' ? 'active' : ''}" onclick="window.setWalkthroughRoom('deck')">
              Sea Deck
            </button>
            <button class="lighting-toggle-btn ${currentWalkthroughRoom === 'master' ? 'active' : ''}" onclick="window.setWalkthroughRoom('master')">
              Master Suite
            </button>
          </div>

          <!-- Ambient Lighting & Staging Controls -->
          <div class="walkthrough-controls">
            <button class="lighting-toggle-btn ${currentLightingMode === 'day' ? 'active' : ''}" onclick="window.setLightingMode('day')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>Daylight
            </button>
            <button class="lighting-toggle-btn ${currentLightingMode === 'sunset' ? 'active' : ''}" onclick="window.setLightingMode('sunset')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M12 10V2"/><path d="m4.93 10.93 1.41-1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41-1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>Golden Sunset
            </button>
            <button class="lighting-toggle-btn ${currentLightingMode === 'night' ? 'active' : ''}" onclick="window.setLightingMode('night')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>Night Lights
            </button>
            <button class="lighting-toggle-btn ${isStagedFurniture ? 'active' : ''}" style="margin-left: 6px; border-left: 1px solid var(--border-subtle);" onclick="window.toggleStagedFurniture()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/><path d="M4 18v2"/><path d="M20 18v2"/></svg>${isStagedFurniture ? 'Staged' : 'Bare Shell'}
            </button>
          </div>
        </div>

        <!-- Interactive Hotspot Pins -->
        <div class="hotspot-pill" style="top: 55%; left: 45%;" onclick="window.setWalkthroughRoom('deck')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>Step onto Sunset Deck
        </div>
        <div class="hotspot-pill" style="top: 48%; left: 78%;" onclick="window.setWalkthroughRoom('master')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><circle cx="14" cy="12" r="1"/></svg>Enter Master Bedroom
        </div>

        <!-- Bottom Guidance Bar -->
        <div style="position: absolute; bottom: 12px; left: 16px; font-size: 11px; color: rgba(255,255,255,0.7); background: rgba(0,0,0,0.6); padding: 4px 10px; border-radius: 4px; pointer-events: none;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><rect x="5" y="2" width="14" height="20" rx="7"/><line x1="12" y1="6" x2="12" y2="10"/></svg>Click and drag anywhere to orbit 360° • Scroll wheel to zoom
        </div>
      </div>
    </div>
  `;

  initCanvas3DWalkthrough();
}

// 2D & 3D Tab Toggle
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
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement;
  if (container) renderFloorPlanViewer(container);
};

window.selectFloorPlanRoom = function(roomId) {
  selectedRoomId = roomId;
  const plan = FLOOR_PLAN_DATA[currentConfigKey];
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement;
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
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement;
  if (container) renderFloorPlanViewer(container);
  window.switchFpViewMode('3d');
};

window.setLightingMode = function(mode) {
  currentLightingMode = mode;
  draw3DScene();
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement;
  if (container) renderFloorPlanViewer(container);
  window.switchFpViewMode('3d');
};

window.toggleStagedFurniture = function() {
  isStagedFurniture = !isStagedFurniture;
  draw3DScene();
  const container = document.querySelector('.floorplan-viewer-container')?.parentElement;
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
    gradSky.addColorStop(0, '#fdba74'); // Orange glow
    gradSky.addColorStop(0.3, '#f43f5e'); // Rose
    gradSky.addColorStop(0.6, '#312e81'); // Indigo sea
    gradSky.addColorStop(1, '#0f172a');
  } else if (currentLightingMode === 'night') {
    gradSky.addColorStop(0, '#020617');
    gradSky.addColorStop(0.5, '#0f172a');
    gradSky.addColorStop(1, '#1e1b4b');
  } else {
    // Daylight
    gradSky.addColorStop(0, '#38bdf8'); // Sky blue
    gradSky.addColorStop(0.45, '#bae6fd');
    gradSky.addColorStop(0.5, '#0284c7'); // Deep sea horizon
    gradSky.addColorStop(1, '#0f172a');
  }
  ctx.fillStyle = gradSky;
  ctx.fillRect(0, 0, w, h);

  // Horizon Line with Perspective Orbit
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

  // Draw Room Architectural Frame: Floor, Ceiling, Glass Balustrade
  const floorGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  if (currentLightingMode === 'sunset') {
    floorGrad.addColorStop(0, '#78350f');
    floorGrad.addColorStop(1, '#1c1917');
  } else if (currentLightingMode === 'night') {
    floorGrad.addColorStop(0, '#1e293b');
    floorGrad.addColorStop(1, '#090d16');
  } else {
    // Italian Marble White reflection
    floorGrad.addColorStop(0, '#e2e8f0');
    floorGrad.addColorStop(0.2, '#f8fafc');
    floorGrad.addColorStop(1, '#cbd5e1');
  }

  // Floor Perspective Polygon
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

  // Floor Marble Joint Grid Perspective lines
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

  // If Staged, Draw Luxury Living Furniture Silhouette / Sofa / Chandelier
  if (isStagedFurniture) {
    ctx.save();
    // Modern Designer Italian Sofa
    const sofaY = h * 0.72;
    const sofaX = w * 0.35 + yawOffset * 0.4;
    ctx.fillStyle = currentLightingMode === 'sunset' ? '#451a03' : currentLightingMode === 'night' ? '#1e1b4b' : '#334155';
    
    // Sofa Base
    ctx.beginPath();
    ctx.roundRect(sofaX, sofaY, w * 0.32, h * 0.14, [12, 12, 4, 4]);
    ctx.fill();

    // Sofa Cushions
    ctx.fillStyle = currentLightingMode === 'sunset' ? '#ea580c' : '#475569';
    ctx.beginPath();
    ctx.roundRect(sofaX + 10, sofaY - 25, (w * 0.32) - 20, 30, [8, 8, 0, 0]);
    ctx.fill();

    // Coffee Table (Marble Top with Brass Legs)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(sofaX + 40, sofaY + 70, (w * 0.32) - 80, 20, 6);
    ctx.fill();

    // Hanging Architectural Chandelier
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(w * 0.5, horizonY - 40);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(w * 0.5, horizonY - 35, 18, 0, Math.PI * 2);
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
