document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let currentView = 'dashboard';
let GEMINI_API_KEY = 'AIzaSyAr2tuuP6XQvsH0xb_MwjbxXG_YPNQcfZM';

function initApp() {
    setupChat();
    setupEventListeners();
    renderView('dashboard');
}

function setupEventListeners() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.id.replace('nav-', '');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            renderView(viewId);
        });
    });

    const chatTrigger = document.getElementById('chat-trigger');
    const chatWidget = document.getElementById('chat-widget');
    const chatCloseBtn = document.getElementById('chat-close-btn');

    if (chatTrigger && chatWidget) {
        chatTrigger.addEventListener('click', () => {
            chatWidget.style.display = 'flex';
            chatWidget.classList.add('animate-up');
            chatTrigger.style.display = 'none';
            setTimeout(() => document.getElementById('user-input').focus(), 300);
        });
    }

    if (chatCloseBtn && chatWidget && chatTrigger) {
        chatCloseBtn.addEventListener('click', () => {
            chatWidget.style.display = 'none';
            chatTrigger.style.display = 'flex';
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
                <button style="background: var(--primary-indigo); color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer;">Find My Booth</button>
                <button style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--border-subtle); padding: 0.75rem 1.5rem; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer;">View Schedule</button>
            </div>
        </div>
        <div class="bento-grid">
            <div class="bento-item large animate-up" style="animation-delay: 0.1s;">
                <span class="stat-label">Current Status</span>
                <div style="display: flex; align-items: flex-end; justify-content: space-between;">
                    <div><span class="stat-value">Phase 2 Active</span><p style="color: var(--text-secondary); margin-top: 0.5rem;">89 Constituencies polling today.</p></div>
                    <div style="width: 120px; height: 60px; background: rgba(99, 102, 241, 0.1); border-radius: var(--radius-sm); border: 1px dashed var(--primary-indigo); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--primary-indigo); font-weight: 700;">LIVE UPDATES</div>
                </div>
            </div>
            <div class="bento-item animate-up" style="animation-delay: 0.2s; background: var(--primary-indigo);">
                <span class="stat-label" style="color: rgba(255,255,255,0.7);">Target Turnout</span>
                <span class="stat-value">100%</span>
                <p style="color: rgba(255,255,255,0.8); font-size: 0.875rem; margin-top: 1rem;">Every vote counts.</p>
            </div>
            <div class="bento-item tall animate-up" style="animation-delay: 0.3s;">
                <span class="stat-label">Upcoming Milestones</span>
                <div id="timeline-root" class="timeline-list" style="margin-top: 2rem;"></div>
            </div>
            <div class="bento-item animate-up" style="animation-delay: 0.4s;">
                <span class="stat-label">Electorate</span><span class="stat-value">96.8 Cr</span><p style="color: var(--text-secondary); margin-top: 0.5rem;">Total registered voters in 2024.</p>
            </div>
            <div class="bento-item animate-up" style="animation-delay: 0.5s;">
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
        div.innerHTML = `<div class="step-number">${index + 1}</div><div class="step-info"><h3>${item.title}</h3><p>${item.description}</p></div>`;
        timelineRoot.appendChild(div);
    });
}

function renderTimelineView(container) {
    if (!window.electionData) return;
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem;">Election Map & Schedule</h2>
        <div class="bento-grid">
            <div class="bento-item large" style="height: 400px; display: flex; align-items: center; justify-content: center; background: #111; position: relative; overflow: hidden;">
                <div style="position: absolute; width: 100%; height: 100%; opacity: 0.1; background: url('/Users/omkara/.gemini/antigravity/brain/9116c180-0391-4431-8f73-dbceeb1fe831/indian_election_dashboard_hero_1777195028296.png') center/cover;"></div>
                <div style="text-align: center; z-index: 2;">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--primary-indigo)" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    <h3 style="margin-top: 1rem;">Interactive Phase Map</h3>
                    <p style="color: var(--text-secondary); max-width: 300px; margin: 1rem auto;">Visualizing all 543 constituencies across 7 polling phases.</p>
                </div>
            </div>
            ${window.electionData.phases.map(p => `
                <div class="bento-item animate-up" style="border-left: 4px solid ${p.status === 'Active' ? 'var(--accent-emerald)' : 'transparent'};">
                    <span class="stat-label" style="color: ${p.status === 'Active' ? 'var(--accent-emerald)' : 'var(--text-secondary)'}">
                        ${p.status.toUpperCase()} • Phase ${p.phase}
                    </span>
                    <h3 style="margin-top: 0.5rem; font-size: 1.25rem;">${p.date}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem;">${p.seats} Constituencies Polling</p>
                </div>
            `).join('')}
        </div>
    `;
}

function renderLibraryView(container) {
    container.innerHTML = `<h2 style="margin-bottom: 2rem;">Voter Library</h2><div class="bento-grid"><div class="bento-item large"><h3>Essential Documents</h3><p style="color: var(--text-secondary); margin-bottom: 2rem;">Download and understand the critical forms for Indian elections.</p><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;"><div style="padding: 1.5rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);"><h4 style="color: var(--accent-yellow);">Form 6</h4><p style="font-size: 0.875rem; color: var(--text-secondary);">New Voter Registration</p><button style="margin-top: 1rem; background: none; border: 1px solid var(--primary-indigo); color: var(--primary-indigo); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">Download PDF</button></div><div style="padding: 1.5rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);"><h4 style="color: var(--accent-yellow);">Form 8</h4><p style="font-size: 0.875rem; color: var(--text-secondary);">Correction of Entries</p><button style="margin-top: 1rem; background: none; border: 1px solid var(--primary-indigo); color: var(--primary-indigo); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">Download PDF</button></div></div></div><div class="bento-item"><h3>Poll Day Kit</h3><ul style="list-style: none; margin-top: 1.5rem; color: var(--text-secondary); font-size: 0.9375rem;"><li style="margin-bottom: 0.75rem;">✓ 12 Approved Photo IDs</li><li style="margin-bottom: 0.75rem;">✓ How to use EVM</li><li style="margin-bottom: 0.75rem;">✓ VVPAT Verification</li><li>✓ Voter Slip Guide</li></ul></div></div>`;
}

function renderVerifyView(container) {
    container.innerHTML = `<h2 style="margin-bottom: 2rem;">Verify Your Registration</h2><div class="bento-item large"><p style="color: var(--text-secondary); margin-bottom: 2rem;">Enter your EPIC (Voter ID) Number to search the National Electoral Roll.</p><div style="display: flex; gap: 1rem; margin-bottom: 2rem;"><input type="text" id="epic-input" placeholder="Enter EPIC Number (e.g. ABC1234567)" style="flex: 1; background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 1rem; border-radius: var(--radius-sm); color: #fff;"><button id="search-btn" style="background: var(--primary-indigo); color: #fff; border: none; padding: 0 2rem; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer;">Search</button></div><div id="search-results" style="display: none; padding: 2rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--accent-emerald);"><h4 style="color: var(--accent-emerald); margin-bottom: 1rem;">Record Found</h4><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; color: var(--text-secondary);"><div><small>Name</small><p style="color: #fff;">RAJESH KUMAR</p></div><div><small>Constituency</small><p style="color: #fff;">NEW DELHI (SC)</p></div><div><small>Polling Station</small><p style="color: #fff;">GOVT MIDDLE SCHOOL, ROOM 2</p></div><div><small>Part Number</small><p style="color: #fff;">142</p></div></div></div></div>`;
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.onclick = () => {
            const results = document.getElementById('search-results');
            if (results) {
                searchBtn.innerText = 'Searching...';
                setTimeout(() => { results.style.display = 'block'; results.classList.add('animate-up'); searchBtn.innerText = 'Search'; }, 1500);
            }
        };
    }
}

function setupChat() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatForm || !userInput || !chatMessages) return;

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        userInput.value = '';

        const loadingMsg = appendMessage('assistant', 'Thinking...');
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are CivicGuide. Answer this Indian Election query briefly: ${text}` }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                loadingMsg.textContent = data.candidates[0].content.parts.map(p => p.text).join('');
                chatMessages.scrollTop = chatMessages.scrollHeight;
                handleUITriggers(text);
            } else {
                loadingMsg.textContent = "I'm here to help. Check the Map or Library sections for more info!";
            }
        })
        .catch(err => {
            loadingMsg.textContent = "I'm here to help. Check the Map or Library sections for more info!";
            handleUITriggers(text);
        });
    });
}

function handleUITriggers(text) {
    const q = text.toLowerCase();
    if (q.includes('map') || q.includes('schedule') || q.includes('phase')) {
        const el = document.getElementById('nav-timeline');
        if (el) el.click();
    }
    if (q.includes('library') || q.includes('form') || q.includes('document')) {
        const el = document.getElementById('nav-guide');
        if (el) el.click();
    }
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
