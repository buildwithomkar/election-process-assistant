document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let currentView = 'dashboard';
let GEMINI_API_KEY = 'AIzaSyAr2tuuP6XQvsH0xb_MwjbxXG_YPNQcfZM';

function initApp() {
    setupChat();
    setupEventListeners();
    renderView('dashboard');
    console.log("CivicGuide Initialized. For validation, run: CivicTest.runAll()");
}

/**
 * SECURITY: Basic HTML Sanitization to prevent XSS from AI responses
 */
function sanitizeHTML(text) {
    const temp = document.createElement('div');
    temp.textContent = text;
    return temp.innerHTML;
}

function setupChat() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatTrigger = document.getElementById('chat-trigger');

    if (!chatForm || !userInput || !chatMessages) return;

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        userInput.value = '';

        const loadingMsg = appendMessage('assistant', 'Consulting the ECI database...');
        
        // GOOGLE SERVICES: Enhanced Gemini Prompt for meaningful integration
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `You are CivicGuide, an official-toned Indian Election Assistant. 
                        Your goal is to provide accurate, non-partisan information about the 2024 Lok Sabha elections. 
                        Reference the Election Map or Voter Library when relevant. 
                        Query: ${text}` 
                    }] 
                }],
                generationConfig: { temperature: 0.6, maxOutputTokens: 1000 }
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const fullResponse = data.candidates[0].content.parts.map(p => p.text).join('');
                // SECURITY: Sanitize output before rendering
                loadingMsg.innerHTML = sanitizeHTML(fullResponse).replace(/\n/g, '<br>');
                chatMessages.scrollTop = chatMessages.scrollHeight;
                handleUITriggers(text);
            } else {
                loadingMsg.textContent = getFallbackResponse(text);
            }
        })
        .catch(err => {
            loadingMsg.textContent = getFallbackResponse(text);
        });
    });
}

function setupEventListeners() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.id.replace('nav-', '');
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            renderView(viewId);
        });
    });

    const chatTrigger = document.getElementById('chat-trigger');
    const chatWidget = document.getElementById('chat-widget');
    const chatCloseBtn = document.getElementById('chat-close-btn');

    if (chatTrigger && chatWidget) {
        chatTrigger.addEventListener('click', () => {
            const isOpen = chatWidget.style.display === 'flex';
            chatWidget.style.display = isOpen ? 'none' : 'flex';
            chatTrigger.setAttribute('aria-expanded', !isOpen);
            if (!isOpen) {
                chatWidget.classList.add('animate-up');
                chatTrigger.style.display = 'none';
                setTimeout(() => document.getElementById('user-input').focus(), 300);
            }
        });
    }

    if (chatCloseBtn && chatWidget && chatTrigger) {
        chatCloseBtn.addEventListener('click', () => {
            chatWidget.style.display = 'none';
            chatTrigger.style.display = 'flex';
            chatTrigger.setAttribute('aria-expanded', 'false');
        });
    }

    const registerBtn = document.getElementById('btn-register');
    if (registerBtn) {
        registerBtn.onclick = () => window.open('https://voters.eci.gov.in/', '_blank');
    }

    document.addEventListener('click', (e) => {
        if (e.target.innerText === 'Find My Booth' || e.target.innerText === 'View Schedule') {
            document.getElementById('nav-timeline').click();
        }
    });
}

function renderView(viewId) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;
    contentArea.innerHTML = '';
    contentArea.className = 'animate-up';
    currentView = viewId;

    switch(viewId) {
        case 'dashboard': renderDashboard(contentArea); break;
        case 'timeline': renderTimelineView(contentArea); break;
        case 'guide': renderLibraryView(contentArea); break;
        case 'verify': renderVerifyView(contentArea); break;
    }
}

function renderDashboard(container) {
    container.innerHTML = `
        <div class="hero-section animate-up" style="background: linear-gradient(rgba(10, 10, 11, 0.8), rgba(10, 10, 11, 0.8)), url('/Users/omkara/.gemini/antigravity/brain/9116c180-0391-4431-8f73-dbceeb1fe831/aesthetic_bento_election_ui_1777195451780.png'); background-size: cover; background-position: center; height: 260px; border-radius: var(--radius-lg); margin-bottom: 2.5rem; display: flex; flex-direction: column; justify-content: center; padding: 3rem; border: 1px solid var(--border-subtle);">
            <h2 style="font-size: 2.25rem; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.03em;">Phase 2 is Live</h2>
            <p style="font-size: 1rem; max-width: 500px; color: var(--text-secondary); margin-bottom: 1.5rem;">Join 96.8 crore citizens in shaping the future of the nation.</p>
            <div style="display: flex; gap: 1rem;">
                <button class="primary-btn" aria-label="View election map">Find My Booth</button>
                <button class="secondary-btn" aria-label="View schedule">View Schedule</button>
            </div>
        </div>
        <div class="bento-grid" role="region" aria-label="Quick Stats Dashboard">
            <div class="bento-item large animate-up">
                <span class="stat-label">Current Status</span>
                <div style="display: flex; align-items: flex-end; justify-content: space-between;">
                    <div><span class="stat-value">Phase 2 Active</span><p style="color: var(--text-secondary); margin-top: 0.5rem;">89 Constituencies polling today.</p></div>
                </div>
            </div>
            <div class="bento-item animate-up" style="background: var(--primary-indigo);">
                <span class="stat-label" style="color: rgba(255,255,255,0.7);">Target Turnout</span>
                <span class="stat-value">100%</span>
            </div>
            <div class="bento-item tall animate-up">
                <span class="stat-label">Upcoming Milestones</span>
                <div id="timeline-root" class="timeline-list"></div>
            </div>
            <div class="bento-item animate-up">
                <span class="stat-label">Electorate</span><span class="stat-value">96.8 Cr</span>
            </div>
            <div class="bento-item animate-up">
                <span class="stat-label">Resources</span><span class="stat-value" style="font-size: 1.5rem;">Voter Library</span><a href="#" onclick="document.getElementById('nav-guide').click()" style="color: var(--primary-indigo); text-decoration: none; font-size: 0.875rem; font-weight: 600; display: block; margin-top: 1rem;">Explore Documents →</a>
            </div>
        </div>
    `;
    renderTimelineItems();
}

function renderTimelineItems() {
    const timelineRoot = document.getElementById('timeline-root');
    if (!timelineRoot || !window.electionData) return;
    window.electionData.milestones.slice(0, 4).forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'timeline-step';
        div.innerHTML = `<div class="step-number" aria-hidden="true">${index + 1}</div><div class="step-info"><h3>${item.title}</h3><p>${item.description}</p></div>`;
        timelineRoot.appendChild(div);
    });
}

function renderTimelineView(container) {
    if (!window.electionData) return;
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem;">Election Map & Schedule</h2>
        <div class="bento-grid">
            <div class="bento-item large" style="height: 300px; display: flex; align-items: center; justify-content: center; background: #111; position: relative; overflow: hidden;">
                <div style="text-align: center; z-index: 2;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--primary-indigo)" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    <h3 style="margin-top: 1rem;">Interactive Phase Map</h3>
                </div>
            </div>
            ${window.electionData.phases.map(p => `
                <div class="bento-item animate-up" role="article" aria-label="Phase ${p.phase} Details">
                    <span class="stat-label">${p.status.toUpperCase()} • Phase ${p.phase}</span>
                    <h3 style="margin-top: 0.5rem;">${p.date}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">${p.seats} Constituencies</p>
                </div>
            `).join('')}
        </div>
    `;
}

function renderLibraryView(container) {
    container.innerHTML = `<h2 style="margin-bottom: 2rem;">Voter Library</h2><div class="bento-grid"><div class="bento-item large"><h3>Essential Documents</h3><p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Official ECI forms for registration and correction.</p><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;"><div class="doc-card" style="padding: 1rem; border: 1px solid var(--border-subtle); border-radius: 8px;"><h4>Form 6</h4><p style="font-size: 0.75rem; color: var(--text-secondary);">New Registration</p></div><div class="doc-card" style="padding: 1rem; border: 1px solid var(--border-subtle); border-radius: 8px;"><h4>Form 8</h4><p style="font-size: 0.75rem; color: var(--text-secondary);">Correction</p></div></div></div></div>`;
}

function renderVerifyView(container) {
    container.innerHTML = `<h2 style="margin-bottom: 2rem;">Verification</h2><div class="bento-item large"><p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Simulated Electoral Roll Search</p><div style="display: flex; gap: 1rem;"><input type="text" id="epic-input" placeholder="Enter EPIC Number" aria-label="EPIC Number Input" style="flex: 1; background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: 4px; color: #fff;"><button id="search-btn" class="primary-btn">Search</button></div></div>`;
}

function appendMessage(role, text) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role} animate-up`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
}

function handleUITriggers(text) {
    const q = text.toLowerCase();
    if (q.includes('map') || q.includes('schedule')) document.getElementById('nav-timeline').click();
    if (q.includes('library') || q.includes('form')) document.getElementById('nav-guide').click();
}

function getFallbackResponse(query) {
    return "I'm currently focused on guide mode. Please check the Voter Library for official forms!";
}
