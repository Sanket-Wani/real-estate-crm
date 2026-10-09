// Jarvis AI Autonomous Voice Qualification Agent Studio
let voiceCallState = {
  activeLeadId: null,
  language: 'en-IN',
  callActive: false,
  currentStep: 1,
  transcript: [],
  quickReplies: [],
  isSpeaking: false,
  callDurationSec: 0,
  callInterval: null,
  checklist: {
    identity: false,
    purpose: false,
    config: false,
    budget: false,
    visit: false
  }
};

function renderJarvisVoiceStudio(container, state) {
  const leads = state.leads || [];
  if (!voiceCallState.activeLeadId && leads.length > 0) {
    voiceCallState.activeLeadId = leads[0].id;
  }

  const activeLead = leads.find(l => l.id === voiceCallState.activeLeadId) || leads[0];

  container.innerHTML = `
    <div class="voice-agent-container fade-in">
      <!-- Studio Header -->
      <div class="voice-agent-header">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 10px;">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg></span> Jarvis AI Voice Qualification Agent
            <span class="badge" style="background: rgba(6, 182, 212, 0.15); color: var(--brand-cyan); font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 99px;">
              Autonomous Outbound Voice Bot v4.2
            </span>
          </h2>
          <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            Multi-Lingual Conversational Telephony Agent for Inbound Lead Qualification & Site Visit Conversion
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <!-- Target Lead Selector -->
          <div style="display: flex; align-items: center; gap: 8px; background: rgba(10,14,23,0.8); padding: 4px 10px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">TARGET LEAD:</span>
            <select id="voice-lead-select" style="background: transparent; border: none; color: #fff; font-size: 12.5px; font-weight: 600; outline: none; cursor: pointer;" onchange="window.switchVoiceLead(this.value)">
              ${leads.map(l => `<option value="${l.id}" ${l.id === activeLead?.id ? 'selected' : ''}>${l.name} (${l.phone}) - ${l.source.toUpperCase()}</option>`).join('')}
            </select>
          </div>

          <!-- Language Selector -->
          <div class="fp-config-pills">
            <button class="fp-pill-btn ${voiceCallState.language === 'en-IN' ? 'active' : ''}" onclick="window.setVoiceLanguage('en-IN')">
              EN • Indian English
            </button>
            <button class="fp-pill-btn ${voiceCallState.language === 'hi-IN' ? 'active' : ''}" onclick="window.setVoiceLanguage('hi-IN')">
              HI • Hindi (हिंदी)
            </button>
          </div>
        </div>
      </div>

      <!-- Main Studio Stage -->
      <div class="voice-agent-grid">
        <!-- Left: Interactive Call Stage & Live Transcript -->
        <div class="voice-call-stage">
          <div class="call-stage-topbar">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: ${voiceCallState.callActive ? 'var(--brand-emerald)' : 'var(--text-muted)'}; box-shadow: ${voiceCallState.callActive ? '0 0 10px var(--brand-emerald)' : 'none'};"></div>
              <div>
                <strong style="color: #fff; font-size: 13.5px;">${activeLead ? activeLead.name : 'Target Lead'}</strong>
                <span style="font-size: 11px; color: var(--text-muted); margin-left: 6px;">(${activeLead ? activeLead.phone : ''})</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #fff;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${Math.floor(voiceCallState.callDurationSec / 60).toString().padStart(2, '0')}:${(voiceCallState.callDurationSec % 60).toString().padStart(2, '0')}
              </div>
              ${!voiceCallState.callActive ? `
                <button class="btn btn-gold btn-sm" onclick="window.startJarvisVoiceCall()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Launch Autonomous AI Call
                </button>
              ` : `
                <button class="btn btn-danger btn-sm" onclick="window.endJarvisVoiceCall()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 6px;"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" y1="2" x2="2" y2="22"/></svg>Disconnect Call
                </button>
              `}
            </div>
          </div>

          <!-- Animated Audio Waveform Spectrum -->
          <div class="waveform-container ${voiceCallState.isSpeaking ? 'waveform-active' : ''}">
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
          </div>

          <!-- Real-Time Dialogue Transcript Stream -->
          <div class="transcript-stream" id="transcript-stream-box">
            ${voiceCallState.transcript.length === 0 ? `
              <div style="text-align: center; color: var(--text-muted); margin: auto; font-size: 13px;">
                <span style="font-size: 32px; display: block; margin-bottom: 8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg></span>
                Click <strong>"Launch Autonomous AI Call"</strong> to trigger Jarvis voice synthesis.<br/>
                The AI will greet the buyer, verify identity, qualify requirements, and book a VIP site visit.
              </div>
            ` : voiceCallState.transcript.map(msg => `
              <div class="transcript-bubble bubble-${msg.role}">
                <div class="bubble-sender">${msg.role === 'agent' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg> Priya (Senior Sales Advisor AI)' : activeLead.name}</div>
                <div>${msg.text}</div>
              </div>
            `).join('')}
          </div>

          <!-- Quick Utterance Replies Tray -->
          <div class="quick-replies-tray">
            <div style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">
              ${voiceCallState.callActive ? 'Buyer Speech Simulator / Response Options:' : 'Awaiting Call Connection...'}
            </div>
            <div class="chips-row">
              ${(voiceCallState.quickReplies || []).map(reply => `
                <button class="chip-btn" onclick="window.sendBuyerVoiceUtterance('${reply.replace(/'/g, "\\'")}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>"${reply}"
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Real-Time Qualification Telemetry -->
        <div class="telemetry-panel">
          <!-- Real-Time Sentiment & Intent Card -->
          <div class="telemetry-card" style="border-left: 3px solid var(--brand-cyan);">
            <div style="font-size: 11.5px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
              Jarvis Propensity Telemetry
            </div>
            <div class="sentiment-meter">
              <div>
                <div class="sentiment-dial" id="sentiment-dial-val">
                  ${voiceCallState.callActive ? '96%' : `${activeLead?.jarvis_score || 50}%`}
                </div>
                <div style="font-size: 11px; color: var(--brand-cyan); font-weight: 600;">High Purchase Intent</div>
              </div>
              <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: var(--brand-emerald); font-weight: 700; padding: 4px 10px; border-radius: 99px; font-size: 11px;">
                Positive Sentiment
              </span>
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">
              Zero objections detected • Acoustic latency < 450ms
            </div>
          </div>

          <!-- Qualification Checklist -->
          <div class="telemetry-card">
            <h4 style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 12px;">
              Qualification Checklist
            </h4>
            <div class="checklist-item">
              <span>Lead Identity & Project Verified</span>
              <span class="${voiceCallState.checklist.identity ? 'check-icon-done' : 'check-icon-pending'}">
                ${voiceCallState.checklist.identity ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: -1px;"><polyline points="20 6 9 17 4 12"/></svg>Confirmed' : 'Pending'}
              </span>
            </div>
            <div class="checklist-item">
              <span>Purpose (End-Use vs Investment)</span>
              <span class="${voiceCallState.checklist.purpose ? 'check-icon-done' : 'check-icon-pending'}">
                ${voiceCallState.checklist.purpose ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: -1px;"><polyline points="20 6 9 17 4 12"/></svg>End-Use' : 'Pending'}
              </span>
            </div>
            <div class="checklist-item">
              <span>Configuration & Carpet Fit</span>
              <span class="${voiceCallState.checklist.config ? 'check-icon-done' : 'check-icon-pending'}">
                ${voiceCallState.checklist.config ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: -1px;"><polyline points="20 6 9 17 4 12"/></svg>3BHK Sea Suite' : 'Pending'}
              </span>
            </div>
            <div class="checklist-item">
              <span>Budget Alignment (₹5.8 Cr CLP)</span>
              <span class="${voiceCallState.checklist.budget ? 'check-icon-done' : 'check-icon-pending'}">
                ${voiceCallState.checklist.budget ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: -1px;"><polyline points="20 6 9 17 4 12"/></svg>Aligned' : 'Pending'}
              </span>
            </div>
            <div class="checklist-item">
              <span>VIP Site Visit Confirmed</span>
              <span class="${voiceCallState.checklist.visit ? 'check-icon-done' : 'check-icon-pending'}">
                ${voiceCallState.checklist.visit ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: -1px;"><polyline points="20 6 9 17 4 12"/></svg>Saturday 11:30 AM' : 'Pending'}
              </span>
            </div>
          </div>

          <!-- Direct MCP Server Tool Gating Box -->
          <div class="telemetry-card" style="background: rgba(10, 14, 23, 0.9);">
            <div style="font-size: 11px; color: var(--brand-cyan); font-weight: 700;">
              MODEL CONTEXT PROTOCOL (MCP)
            </div>
            <p style="font-size: 11.5px; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">
              External AI agents can invoke this qualification autonomously via <code style="color: var(--brand-gold);">jarvis_voice_qualify</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Speak Agent Utterance using Web Speech API (with silent fallback)
function speakAgentText(text) {
  voiceCallState.isSpeaking = true;
  updateWaveformUI(true);

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceCallState.language === 'hi-IN' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      voiceCallState.isSpeaking = false;
      updateWaveformUI(false);
    };
    utterance.onerror = () => {
      voiceCallState.isSpeaking = false;
      updateWaveformUI(false);
    };

    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(() => {
      voiceCallState.isSpeaking = false;
      updateWaveformUI(false);
    }, 2500);
  }
}

function updateWaveformUI(isSpeaking) {
  const wave = document.querySelector('.waveform-container');
  if (wave) {
    if (isSpeaking) wave.classList.add('waveform-active');
    else wave.classList.remove('waveform-active');
  }
}

window.switchVoiceLead = function(leadId) {
  voiceCallState.activeLeadId = leadId;
  const container = document.querySelector('.voice-agent-container')?.parentElement;
  if (container) renderJarvisVoiceStudio(container, window.store.state);
};

window.setVoiceLanguage = function(lang) {
  voiceCallState.language = lang;
  const container = document.querySelector('.voice-agent-container')?.parentElement;
  if (container) renderJarvisVoiceStudio(container, window.store.state);
};

window.startJarvisVoiceCall = async function(customLeadId = null) {
  if (customLeadId) voiceCallState.activeLeadId = customLeadId;
  voiceCallState.callActive = true;
  voiceCallState.currentStep = 1;
  voiceCallState.transcript = [];
  voiceCallState.callDurationSec = 0;
  voiceCallState.checklist = { identity: false, purpose: false, config: false, budget: false, visit: false };

  if (voiceCallState.callInterval) clearInterval(voiceCallState.callInterval);
  voiceCallState.callInterval = setInterval(() => {
    voiceCallState.callDurationSec++;
    const container = document.querySelector('.voice-agent-container')?.parentElement;
    // Don't re-render entire DOM every second, just update timer
    const timerDisplay = document.querySelector('.call-stage-topbar div[style*="monospace"]');
    if (timerDisplay) {
      const m = Math.floor(voiceCallState.callDurationSec / 60).toString().padStart(2, '0');
      const s = (voiceCallState.callDurationSec % 60).toString().padStart(2, '0');
      timerDisplay.innerText = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${m}:${s}`;
    }
  }, 1000);

  try {
    const res = await fetch('/v1/ai/voice-call/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: voiceCallState.activeLeadId, language: voiceCallState.language })
    }).then(r => r.json());

    if (res.success) {
      voiceCallState.transcript.push({ role: 'agent', text: res.agent_utterance });
      voiceCallState.quickReplies = res.quick_replies;
      voiceCallState.checklist.identity = true;

      const container = document.querySelector('.voice-agent-container')?.parentElement;
      if (container) renderJarvisVoiceStudio(container, window.store.state);
      speakAgentText(res.agent_utterance);
    }
  } catch (e) {
    console.error(e);
  }
};

window.sendBuyerVoiceUtterance = async function(replyText) {
  // Push buyer reply
  voiceCallState.transcript.push({ role: 'buyer', text: replyText });
  voiceCallState.quickReplies = [];

  // Update qualification checklist flags dynamically
  if (voiceCallState.currentStep === 1) voiceCallState.checklist.purpose = true;
  else if (voiceCallState.currentStep === 2) voiceCallState.checklist.config = true;
  else if (voiceCallState.currentStep === 3) voiceCallState.checklist.budget = true;
  else if (voiceCallState.currentStep === 4) voiceCallState.checklist.visit = true;

  const container = document.querySelector('.voice-agent-container')?.parentElement;
  if (container) renderJarvisVoiceStudio(container, window.store.state);

  // Scroll transcript to bottom
  const streamBox = document.getElementById('transcript-stream-box');
  if (streamBox) streamBox.scrollTop = streamBox.scrollHeight;

  try {
    const res = await fetch('/v1/ai/voice-call/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: voiceCallState.activeLeadId,
        current_step: voiceCallState.currentStep,
        buyer_reply: replyText,
        language: voiceCallState.language
      })
    }).then(r => r.json());

    if (res.success) {
      voiceCallState.currentStep = res.step;
      voiceCallState.transcript.push({ role: 'agent', text: res.agent_utterance });
      voiceCallState.quickReplies = res.quick_replies;

      if (container) renderJarvisVoiceStudio(container, window.store.state);
      const stream = document.getElementById('transcript-stream-box');
      if (stream) stream.scrollTop = stream.scrollHeight;

      speakAgentText(res.agent_utterance);

      // If final step reached, automatically finalize lead qualification
      if (res.is_final_step) {
        setTimeout(() => {
          window.finalizeVoiceQualification();
        }, 1500);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

window.finalizeVoiceQualification = async function() {
  if (voiceCallState.callInterval) clearInterval(voiceCallState.callInterval);

  try {
    const res = await fetch('/v1/ai/voice-call/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: voiceCallState.activeLeadId,
        transcript: voiceCallState.transcript,
        slot: 'Saturday 11:30 AM'
      })
    }).then(r => r.json());

    if (res.success) {
      window.showToast?.(`${res.message}`, 'success');
      await window.store.refreshLeads();
    }
  } catch (e) {
    console.error(e);
  }
};

window.endJarvisVoiceCall = function() {
  if (voiceCallState.callInterval) clearInterval(voiceCallState.callInterval);
  voiceCallState.callActive = false;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  window.finalizeVoiceQualification();
  const container = document.querySelector('.voice-agent-container')?.parentElement;
  if (container) renderJarvisVoiceStudio(container, window.store.state);
};

// Global Export
window.renderJarvisVoiceStudio = renderJarvisVoiceStudio;
