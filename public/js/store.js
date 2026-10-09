// Reactive Store & API Client for Simplesphere OS - Real Estate CRM
class Store {
  constructor() {
    this.state = {
      currentUser: { id: 'usr-admin-1', name: 'Vikram Malhotra', role: 'admin', email: 'vikram@aurumrealty.com' },
      currentProjectId: 'proj-solitaire',
      projects: [],
      currentMatrix: null,
      leads: [],
      siteVisits: [],
      channelPartners: [],
      bookings: [],
      milestones: [],
      payments: [],
      snags: [],
      campaigns: [],
      routingConfig: null,
      templates: [],
      paymentSchemes: [],
      irisWarRoom: null,
      cockpit: null,
      activeTab: 'overview'
    };

    this.listeners = new Set();
    this.initSSE();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Error in store listener:', err);
      }
    }
  }

  setTab(tab) {
    this.state.activeTab = tab;
    this.notify();
  }

  setCurrentUser(user) {
    this.state.currentUser = user;
    this.notify();
  }

  setCurrentProject(projectId) {
    this.state.currentProjectId = projectId;
    this.loadProjectMatrix(projectId);
    this.notify();
  }

  // SSE Setup for real-time sync
  initSSE() {
    try {
      const evtSource = new EventSource('/v1/events');
      
      evtSource.addEventListener('connected', () => {
        console.log('[Realtime] SSE Connection Established');
      });

      evtSource.addEventListener('unit_status_changed', (e) => {
        const data = JSON.parse(e.data);
        if (this.state.currentMatrix && this.state.currentMatrix.units) {
          const u = this.state.currentMatrix.units.find(x => x.id === data.unit_id);
          if (u) {
            u.status = data.status;
            if (data.status === 'held') {
              u.held_by_name = data.held_by;
              u.held_until = data.held_until;
            } else if (data.status === 'available') {
              u.held_by_name = null;
              u.held_until = null;
            }
            this.recalculateMatrixStats();
            this.notify();
          }
        }
      });

      evtSource.addEventListener('new_lead', (e) => {
        const lead = JSON.parse(e.data);
        this.state.leads.unshift(lead);
        this.notify();
        window.showToast?.(`New Lead Ingested: ${lead.name} (${lead.source})`, 'info');
      });

      evtSource.addEventListener('lead_updated', (e) => {
        const updatedLead = JSON.parse(e.data);
        const idx = this.state.leads.findIndex(l => l.id === updatedLead.id);
        if (idx !== -1) {
          this.state.leads[idx] = updatedLead;
          this.notify();
        }
      });

      evtSource.addEventListener('new_booking', (e) => {
        const booking = JSON.parse(e.data);
        this.state.bookings.unshift(booking);
        this.notify();
        window.showToast?.(`Unit ${booking.unit_number} Booked! (₹${(booking.agreement_value / 10000000).toFixed(2)} Cr)`, 'success');
      });

      evtSource.addEventListener('milestone_demanded', (e) => {
        const milestone = JSON.parse(e.data);
        const idx = this.state.milestones.findIndex(m => m.id === milestone.id);
        if (idx !== -1) {
          this.state.milestones[idx] = milestone;
          this.notify();
        }
        window.showToast?.(`RERA Demand Notice issued for ${milestone.milestone_name}`, 'warning');
      });

      evtSource.addEventListener('payment_recorded', (e) => {
        const payment = JSON.parse(e.data);
        this.state.payments.unshift(payment);
        this.notify();
        window.showToast?.(`Payment Reconciled: ₹${payment.amount_paid.toLocaleString('en-IN')}`, 'success');
      });

      evtSource.addEventListener('site_visit_created', (e) => {
        const visit = JSON.parse(e.data);
        this.state.siteVisits.unshift(visit);
        this.notify();
      });

      evtSource.addEventListener('site_visit_updated', (e) => {
        const visit = JSON.parse(e.data);
        const idx = this.state.siteVisits.findIndex(v => v.id === visit.id);
        if (idx !== -1) {
          this.state.siteVisits[idx] = visit;
          this.notify();
        }
      });

      evtSource.addEventListener('routing_rules_updated', (e) => {
        const cfg = JSON.parse(e.data);
        this.state.routingConfig = cfg;
        this.notify();
      });

      evtSource.addEventListener('system_reset', () => {
        window.showToast?.('Demo dataset reset to initial state', 'info');
        this.refreshAll();
      });

    } catch (e) {
      console.warn('SSE connection failed, running in polling fallback mode:', e);
    }
  }

  recalculateMatrixStats() {
    if (!this.state.currentMatrix || !this.state.currentMatrix.units) return;
    const units = this.state.currentMatrix.units;
    this.state.currentMatrix.stats = {
      totalUnits: units.length,
      available: units.filter(u => u.status === 'available').length,
      held: units.filter(u => u.status === 'held').length,
      booked: units.filter(u => u.status === 'booked').length,
      sold: units.filter(u => u.status === 'sold').length
    };
  }

  // API Methods
  async loadInitialData() {
    try {
      const [projectsRes, leadsRes, siteVisitsRes, cpRes, bookingsRes, cockpitRes, campRes, routingRes, tplRes, schemesRes] = await Promise.all([
        fetch('/v1/projects').then(r => r.json()),
        fetch('/v1/leads').then(r => r.json()),
        fetch('/v1/site-visits').then(r => r.json()),
        fetch('/v1/channel-partners').then(r => r.json()),
        fetch('/v1/bookings').then(r => r.json()),
        fetch('/v1/reports/cockpit').then(r => r.json()),
        fetch('/v1/campaigns').then(r => r.json()),
        fetch('/v1/routing/rules').then(r => r.json()),
        fetch('/v1/communications/templates').then(r => r.json()),
        fetch('/v1/payment-schemes').then(r => r.json())
      ]);

      if (projectsRes.success) this.state.projects = projectsRes.projects;
      if (leadsRes.success) this.state.leads = leadsRes.leads;
      if (siteVisitsRes.success) this.state.siteVisits = siteVisitsRes.site_visits;
      if (cpRes.success) this.state.channelPartners = cpRes.channel_partners;
      if (bookingsRes.success) {
        this.state.bookings = bookingsRes.bookings;
        this.state.milestones = bookingsRes.milestones;
        this.state.payments = bookingsRes.payments;
        this.state.snags = bookingsRes.snags;
      }
      if (cockpitRes.success) this.state.cockpit = cockpitRes;
      if (campRes.success) this.state.campaigns = campRes.campaigns;
      if (routingRes.success) this.state.routingConfig = routingRes.routingConfig;
      if (tplRes.success) this.state.templates = tplRes.templates;
      if (schemesRes.success) this.state.paymentSchemes = schemesRes.schemes;

      await this.loadProjectMatrix(this.state.currentProjectId);
      await this.loadIrisWarRoom();

      this.notify();
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }

  async loadProjectMatrix(projectId) {
    try {
      const res = await fetch(`/v1/projects/${projectId}/matrix`).then(r => r.json());
      if (res.success) {
        this.state.currentMatrix = res;
        this.notify();
      }
    } catch (err) {
      console.error('Failed to load project matrix:', err);
    }
  }

  async loadIrisWarRoom() {
    try {
      const res = await fetch('/v1/iris/war-room').then(r => r.json());
      if (res.success) {
        this.state.irisWarRoom = res;
        this.notify();
      }
    } catch (err) {
      console.error('Failed to load IRIS war room:', err);
    }
  }

  async holdUnit(unitId) {
    try {
      const res = await fetch(`/v1/units/${unitId}/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: this.state.currentUser })
      }).then(r => r.json());

      if (res.success) {
        window.showToast?.(res.message, 'warning');
        await this.loadProjectMatrix(this.state.currentProjectId);
        return true;
      } else {
        window.showToast?.(res.message, 'warning');
        return false;
      }
    } catch (err) {
      window.showToast?.('Failed to hold unit: ' + err.message, 'danger');
      return false;
    }
  }

  async releaseUnitHold(unitId) {
    try {
      const res = await fetch(`/v1/units/${unitId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json());

      if (res.success) {
        window.showToast?.(res.message, 'info');
        await this.loadProjectMatrix(this.state.currentProjectId);
        return true;
      } else {
        window.showToast?.(res.message, 'warning');
        return false;
      }
    } catch (err) {
      window.showToast?.('Failed to release hold: ' + err.message, 'danger');
      return false;
    }
  }

  async createBooking(leadId, unitId, tokenAmount, discountPct, schemeId = 'clp') {
    try {
      const res = await fetch('/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          unit_id: unitId,
          token_amount: tokenAmount,
          discount_pct: discountPct,
          scheme_id: schemeId
        })
      }).then(r => r.json());

      if (res.success) {
        await this.loadProjectMatrix(this.state.currentProjectId);
        await this.refreshBookings();
        await this.refreshLeads();
        return res;
      } else {
        window.showToast?.(res.message, 'danger');
        return null;
      }
    } catch (err) {
      window.showToast?.('Booking failed: ' + err.message, 'danger');
      return null;
    }
  }

  async refreshLeads() {
    const res = await fetch('/v1/leads').then(r => r.json());
    if (res.success) {
      this.state.leads = res.leads;
      this.notify();
    }
  }

  async refreshBookings() {
    const res = await fetch('/v1/bookings').then(r => r.json());
    if (res.success) {
      this.state.bookings = res.bookings;
      this.state.milestones = res.milestones;
      this.state.payments = res.payments;
      this.notify();
    }
  }

  async refreshAll() {
    await this.loadInitialData();
  }
}

// Global Store Instance
window.store = new Store();
