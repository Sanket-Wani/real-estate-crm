// Application Controller & View Routing for Simplesphere OS - Real Estate CRM
document.addEventListener('DOMContentLoaded', async () => {
  const store = window.store;

  // Initialize Toast System
  const toastContainer = document.getElementById('toast-container');
  window.showToast = function(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = window.getIcon ? window.getIcon('info', { size: 16 }) : '';
    if (type === 'success') iconSvg = window.getIcon ? window.getIcon('checkCircle', { size: 16 }) : '';
    if (type === 'warning') iconSvg = window.getIcon ? window.getIcon('alertTriangle', { size: 16 }) : '';
    if (type === 'danger') iconSvg = window.getIcon ? window.getIcon('alertCircle', { size: 16 }) : '';

    toast.innerHTML = `
      <span style="display: flex; align-items: center; color: currentColor;">${iconSvg}</span>
      <div style="flex: 1;">${message}</div>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  // Wire Topbar Project Switcher
  const projectSelect = document.getElementById('topbar-project-select');
  if (projectSelect) {
    projectSelect.addEventListener('change', (e) => {
      store.setCurrentProject(e.target.value);
    });
  }

  // Wire Topbar Role Switcher
  const roleSelect = document.getElementById('topbar-role-select');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const selectedRole = e.target.value;
      const user = {
        id: `usr-${selectedRole}-1`,
        role: selectedRole,
        name: selectedRole === 'admin' ? 'Vikram Malhotra' :
              selectedRole === 'vp_sales' ? 'Ananya Sharma' :
              selectedRole === 'sales_rep' ? 'Priya Kulkarni' :
              selectedRole === 'cp_broker' ? 'Rajesh Gupta' :
              selectedRole === 'post_sales' ? 'Sneha Patel' :
              'Arjun Singhania'
      };
      store.setCurrentUser(user);
      window.showToast(`Switched active persona to ${user.name}`, 'info');

      // Auto-navigate to appropriate view based on persona
      if (selectedRole === 'homebuyer') {
        store.setTab('cx-portal');
      } else if (selectedRole === 'cp_broker') {
        store.setTab('channel-partners');
      } else if (selectedRole === 'post_sales') {
        store.setTab('post-sales');
      }
    });
  }

  // Wire Navigation Elements (Rail Buttons)
  document.querySelectorAll('[data-tab]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      if (tab) store.setTab(tab);
    });
  });

  // Reset Demo Data Button
  const resetBtn = document.getElementById('reset-demo-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      if (confirm('Reset all Simplesphere OS demo inventory, leads, and bookings to original pristine state?')) {
        await fetch('/v1/system/reset-demo', { method: 'POST' });
        window.location.reload();
      }
    });
  }

  // Subscribe view renderer to store changes
  const mainContent = document.getElementById('main-content-viewport');

  const moduleNames = {
    'overview': 'Overview Cockpit',
    'inventory': 'Inventory Matrix',
    'pipeline': 'Sales Pipeline',
    'cost-sheets': 'Dynamic Cost Sheets',
    'site-visits': 'Field Ops & Site Visits',
    'post-sales': 'Post-Sales & CLP',
    'campaigns': 'Marketing Attribution',
    'channel-partners': 'Channel Partner Portal',
    'cx-portal': 'Homebuyer CX Portal',
    'jarvis-voice': 'Jarvis AI Voice Bot',
    'floorplans': '3D Floor Plans & CAD',
    'iris-war-room': 'IRIS Launch War Room',
    'mcp-inspector': 'MCP Server Inspector'
  };

  store.subscribe((state) => {
    // Synchronize Active Nav Highlighting
    document.querySelectorAll('[data-tab]').forEach(item => {
      if (item.getAttribute('data-tab') === state.activeTab) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Topbar Active Breadcrumb
    const activeModuleEl = document.getElementById('topbar-active-module');
    if (activeModuleEl) {
      activeModuleEl.innerText = moduleNames[state.activeTab] || 'Workspace';
    }

    // Update Greeting Persona Header (Show only on Overview Dashboard)
    const greetingRowEl = document.getElementById('greeting-row-section');
    if (greetingRowEl) {
      greetingRowEl.style.display = state.activeTab === 'overview' ? 'flex' : 'none';
    }
    const greetingNameEl = document.getElementById('greeting-persona-name');
    const displayPersonaEl = document.getElementById('display-persona-name');
    if (state.currentUser) {
      const firstName = state.currentUser.name.split(' ')[0] || 'User';
      if (greetingNameEl) greetingNameEl.innerText = firstName;
      if (displayPersonaEl) displayPersonaEl.innerText = state.currentUser.name;
    }

    // Render active tab view
    if (!mainContent) return;

    switch (state.activeTab) {
      case 'overview':
        if (window.renderOverviewDashboard) {
          window.renderOverviewDashboard(mainContent, state);
        }
        break;
      case 'inventory':
        renderInventoryMatrix(mainContent, state);
        break;
      case 'pipeline':
        renderKanbanPipeline(mainContent, state);
        break;
      case 'site-visits':
        window.renderSiteVisitsView(mainContent, state);
        break;
      case 'campaigns':
        window.renderCampaignsView(mainContent, state);
        break;
      case 'cost-sheets':
        if (window.renderCostSheetModule) {
          window.renderCostSheetModule(mainContent, state, store.selectedCostSheetUnitId);
        } else {
          renderInventoryMatrix(mainContent, state);
        }
        break;
      case 'floorplans':
        window.renderFloorPlanViewer(mainContent);
        break;
      case 'channel-partners':
        renderCPPortal(mainContent, state);
        break;
      case 'post-sales':
        renderPostSales(mainContent, state);
        break;
      case 'cx-portal':
        renderCXPortal(mainContent, state);
        break;
      case 'iris-war-room':
        renderIrisWarRoom(mainContent, state);
        break;
      case 'jarvis-voice':
        if (window.renderJarvisVoiceStudio) {
          window.renderJarvisVoiceStudio(mainContent, state);
        }
        break;
      case 'analytics':
        renderAnalyticsCockpit(mainContent, state);
        break;
      case 'mcp-inspector':
        renderMCPInspector(mainContent, state);
        break;
      default:
        if (window.renderOverviewDashboard) {
          window.renderOverviewDashboard(mainContent, state);
        } else {
          renderInventoryMatrix(mainContent, state);
        }
    }
  });

  // Initial Load
  await store.loadInitialData();
});
