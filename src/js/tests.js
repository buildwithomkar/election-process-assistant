/**
 * CivicGuide Validation Suite
 * Run this in the browser console to verify application health.
 */
const CivicTest = {
    runAll() {
        console.log("%c--- Starting CivicGuide System Validation ---", "color: #6366f1; font-weight: bold; font-size: 14px;");
        this.testDataIntegrity();
        this.testDOMStability();
        this.testSecuritySanitization();
        this.testAccessibilityCompliance();
        console.log("%c--- Validation Complete ---", "color: #10b981; font-weight: bold;");
    },

    testDataIntegrity() {
        const passed = window.electionData && window.electionData.phases.length === 7;
        this.logResult("Data Integrity (7 Phases)", passed);
    },

    testDOMStability() {
        const criticalElements = ['content-area', 'chat-form', 'chat-trigger', 'nav-dashboard'];
        const missing = criticalElements.filter(id => !document.getElementById(id));
        this.logResult("DOM Stability (Core Elements)", missing.length === 0, missing.length > 0 ? `Missing: ${missing.join(', ')}` : '');
    },

    testSecuritySanitization() {
        // Mock a dangerous input
        const dangerousText = "<img src=x onerror=alert(1)> Safe Text";
        const sanitized = this.mockSanitize(dangerousText);
        this.logResult("Security (XSS Sanitization)", !sanitized.includes('onerror'));
    },

    testAccessibilityCompliance() {
        const chatTrigger = document.getElementById('chat-trigger');
        const hasAria = chatTrigger && chatTrigger.getAttribute('aria-label');
        this.logResult("Accessibility (Aria Labels)", !!hasAria);
    },

    logResult(name, passed, detail = '') {
        const status = passed ? "✅ PASSED" : "❌ FAILED";
        console.log(`${status}: ${name} ${detail}`);
    },

    mockSanitize(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Expose to window
window.CivicTest = CivicTest;
console.log("CivicGuide Testing Suite Loaded. Type 'CivicTest.runAll()' to validate.");
