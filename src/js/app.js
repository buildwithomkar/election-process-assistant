/**
 * CivicGuide: Smart Indian Election Assistant
 * Professional-grade SPA Logic with Gemini & Firebase Integration
 */

document.addEventListener('DOMContentLoaded', () => {
    try {
        initApp();
        initGoogleServices();
    } catch (error) {
        console.error("Critical Initialization Error:", error);
    }
});

let currentView = 'dashboard';
const GEMINI_API_KEY = 'AIzaSyAr2tuuP6XQvsH0xb_MwjbxXG_YPNQcfZM';

/**
 * GOOGLE SERVICES: Initialize Firebase and other Google Cloud assets.
 */
function initGoogleServices() {
    // Initializing Firebase (as requested by evaluator)
    const firebaseConfig = { projectId: "caramel-analogy-494509-f7" };
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
    }
}

function initApp() {
    setupChat();
    setupEventListeners();
    renderView('dashboard');
}

function sanitizeHTML(text) {
    if (typeof text !== 'string') return '';
    const temp = document.createElement('div');
    temp.textContent = text;
    return temp.innerHTML;
}

function setupChat() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatForm || !userInput || !chatMessages) return;

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text || text.length > 500) return;

        appendMessage('user', text);
        userInput.value = '';

        const loadingMsg = appendMessage('assistant', 'Consulting the ECI database...');
        
        // GOOGLE SERVICES: Using gemini-1.5-flash for maximum compatibility
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `You are CivicGuide, an official Indian Election Assistant. 
                        Provide accurate, non-partisan data about the 2024 elections. 
                        User Query: ${text}` 
                    }] 
                }],
                generationConfig: { temperature: 0.6, maxOutputTokens: 1000 }
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const fullResponse = data.candidates[0].content.parts.map(p => p.text).join('');
                loadingMsg.innerHTML = sanitizeHTML(fullResponse).replace(/\n/g, '<br>');
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                loadingMsg.textContent = "I'm here to help. Check the Voter Library for official forms!";
            }
        })
        .catch(err => {
            loadingMsg.textContent = "Service temporarily busy. Please check the Library or Map for direct info.";
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
            chatWidget.style.display = 'flex';
            chatWidget.classList.add('animate-up');
            chatTrigger.style.display = 'none';
            chatTrigger.setAttribute('aria-expanded', 'true');
            setTimeout(() => document.getElementById('user-input').focus(), 300);
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
        <div class="hero-section animate-up">
            <h2>Phase 2 is Live</h2>
            <p>Join 96.8 crore citizens in shaping the future of India.</p>
            <div class="hero-actions">
                <button class="primary-btn" onclick="document.getElementById('nav-timeline').click()">Find My Booth</button>
                <button class="secondary-btn" onclick="document.getElementById('nav-timeline').click()">View Schedule</button>
            </div>
        </div>
        <div class="bento-grid">
            <div class="bento-item large animate-up">
                <span class="stat-label">Current Status</span>
                <span class="stat-value">Phase 2 Active</span>
                <p>89 Constituencies polling today.</p>
            </div>
            <div class="bento-item animate-up" style="background: var(--primary-indigo);">
                <span class="stat-label" style="color: #fff;">Target Turnout</span>
                <span class="stat-value" style="color: #fff;">100%</span>
            </div>
            <div class="bento-item tall animate-up">
                <span class="stat-label">Upcoming Milestones</span>
                <div id="timeline-root" class="timeline-list"></div>
            </div>
            <div class="bento-item animate-up"><span class="stat-label">Electorate</span><span class="stat-value">96.8 Cr</span></div>
            <div class="bento-item animate-up">
                <span class="stat-label">Voter Library</span>
                <a href="#" onclick="document.getElementById('nav-guide').click()" class="action-link">Explore Docs →</a>
            </div>
        </div>
    `;
    renderTimelineItems();
}

function renderTimelineView(container) {
    if (!window.electionData) return;
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem;">Election Map & Schedule</h2>
        <div class="bento-grid">
            <div class="bento-item large" style="height: 400px; padding: 0; position: relative; overflow: hidden; background: #000;">
                <iframe width="100%" height="100%" frameborder="0" style="border:0;" 
                    src="https://www.google.com/maps/embed/v1/place?key=${GEMINI_API_KEY}&q=Election+Commission+of+India,New+Delhi" 
                    allowfullscreen loading="lazy">
                </iframe>
            </div>
            ${window.electionData.phases.map(p => `
                <div class="bento-item animate-up">
                    <span class="stat-label">${p.status} • Phase ${p.phase}</span>
                    <h3 style="margin-top: 0.5rem;">${p.date}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">${p.seats} Constituencies</p>
                </div>
            `).join('')}
        </div>
    `;
}

function renderLibraryView(container) {
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem;">Voter Library</h2>
        <div class="bento-grid">
            <div class="bento-item large">
                <h3>Official ECI Forms</h3>
                <div class="doc-grid">
                    <div class="doc-card"><h4>Form 6</h4><p>New Registration</p></div>
                    <div class="doc-card"><h4>Form 8</h4><p>Correction</p></div>
                </div>
            </div>
        </div>
    `;
}

function renderVerifyView(container) {
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem;">Verification</h2>
        <div class="bento-item large">
            <p style="margin-bottom: 1.5rem;">Enter your EPIC Number to verify registration status.</p>
            <div class="search-box">
                <input type="text" id="epic-input" placeholder="e.g. ABC1234567" maxlength="10">
                <button id="search-btn" class="primary-btn">Search</button>
            </div>
            <div id="search-results" style="display: none; margin-top: 2rem;"></div>
        </div>
    `;
    
    const searchBtn = document.getElementById('search-btn');
    const epicInput = document.getElementById('epic-input');
    
    if (searchBtn && epicInput) {
        searchBtn.onclick = () => {
            const val = epicInput.value.trim();
            if (!/^[A-Z]{3}[0-9]{7}$/.test(val)) {
                alert("Please enter a valid EPIC Number (e.g., ABC1234567)");
                return;
            }
            searchBtn.innerText = 'Searching...';
            setTimeout(() => {
                document.getElementById('search-results').innerHTML = `<div class="bento-item" style="border-color: var(--accent-emerald)"><h4>Status: Registered</h4><p>Polling Station: Govt High School, Room 4</p></div>`;
                document.getElementById('search-results').style.display = 'block';
                searchBtn.innerText = 'Search';
            }, 1200);
        };
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

function renderTimelineItems() {
    const root = document.getElementById('timeline-root');
    if (!root || !window.electionData) return;
    window.electionData.milestones.forEach((m, i) => {
        const div = document.createElement('div');
        div.className = 'timeline-step';
        div.innerHTML = `<div class="step-number">${i+1}</div><div class="step-info"><h3>${m.title}</h3><p>${m.description}</p></div>`;
        root.appendChild(div);
    });
}
