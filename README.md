# CivicGuide: Smart Indian Election Assistant 🇮🇳

**CivicGuide** is a premium, AI-driven interactive assistant designed to help Indian citizens navigate the complexities of the **2024 Lok Sabha Elections**. Built for the Google Promptwars Challenge, it combines sophisticated "Aesthetic Bento" design with the reasoning power of Gemini AI to make civic engagement effortless and engaging.

**Live Demo:** [https://election-assistant-238334723342.us-central1.run.app](https://election-assistant-238334723342.us-central1.run.app)

---

## 🗳️ Chosen Vertical: Election Process Assistant
This solution focuses on the **Indian Lok Sabha Election 2024** persona. It addresses the real-world need for clear, contextual, and accessible information during the world's largest democratic exercise.

---

## 💡 Approach and Logic
The core philosophy of CivicGuide is **"Intelligence without Friction."**

1.  **Aesthetic Bento Architecture**: Instead of overwhelming users with text, we use a modular "Bento Grid" layout. This allows users to scan high-level status (Electorate size, Turnout targets, Current Phase) at a glance.
2.  **State-Managed SPA**: The app is built as a highly responsive Single Page Application (SPA) using Vanilla JavaScript. This ensures instantaneous transitions between the Dashboard, Election Map, Voter Library, and Verification modules.
3.  **Interactive Logic Engine**:
    *   **Contextual Routing**: The app dynamically swaps views based on user intent.
    *   **Smart Triggers**: The AI assistant doesn't just "talk"—it "acts." If a user asks about registration, the app programmatically navigates them to the Voter Library.
    *   **Verification Simulation**: A logic-driven EPIC search tool simulates the experience of verifying electoral roll registration with realistic feedback loops.

---

## 🤖 How the Solution Works
### 1. Gemini AI Integration (Google Service)
CivicGuide integrates **Gemini 2.5 Flash** (via the Google AI SDK) as its "Brain." It handles natural language queries about:
*   Constituencies and candidates.
*   Registration deadlines and required forms (Form 6, 7, 8).
*   Poll Day procedures and approved ID documents.

### 2. Interactive Election Map
A dynamic phase-wise breakdown of all 7 phases of the 2024 election. It uses a logic-driven rendering engine to display seat counts and polling dates for each phase.

### 3. Voter Library & Toolkit
A centralized repository of essential civic resources. It provides quick access to ECI forms and a "Poll Day Kit" to ensure voters are prepared before heading to the booth.

---

## 🏛️ Assumptions Made
*   **Data Accuracy**: Milestone and phase data are based on the official ECI 2024 schedule.
*   **Connectivity**: The app assumes an active internet connection to communicate with the Gemini AI backend.
*   **Browser Compatibility**: Optimized for modern evergreen browsers (Chrome, Safari, Edge) to support sophisticated CSS grid and animations.

---

## 🚀 Evaluation Focus Areas
*   **Code Quality**: Structured as a modular Vanilla JS application with clear separation of concerns (HTML structure, CSS design system, and JS logic).
*   **Security**: Implements safe API handling and input sanitization to prevent common web vulnerabilities.
*   **Efficiency**: Extremely lightweight (zero heavy frameworks), leading to near-instant load times on mobile and desktop.
*   **Testing**: Validated through multiple iterations of user-flow testing, ensuring all navigation links, buttons, and AI triggers are functional.
*   **Accessibility**: Uses semantic HTML5, high-contrast color palettes, and large interactive touch targets for inclusive design.
*   **Google Services**: Deep integration of **Gemini AI** for intelligence and **Google Cloud Run** for a scalable, high-performance production environment.

---

## 🛠️ Tech Stack
*   **Core**: HTML5, Vanilla JavaScript
*   **Design**: Modern CSS3 (Grid, Flexbox, Animations)
*   **Intelligence**: Google Gemini 2.5 Flash API
*   **Deployment**: Google Cloud Run (Containerized via Nginx)

---

**Developed with ❤️ for the Google Promptwars Challenge.**
