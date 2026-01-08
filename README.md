<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# OppTracker
### The AI-Powered Application Concierge
</div>

---

**OppTracker** is a mobile-first, intelligent agent designed to manage the chaos of applying for **scholarships, hackathons, essays, and jobs**. 

Acting as a personal career assistant, the system builds a dynamic profile of you (based on your CV and interests) and integrates directly with **WhatsApp**. Simply forward a link to the bot, and it will scrape the content, verify its legitimacy, match it against your criteria, and manage the application lifecycle with automated reminders.

## 🚀 The Problem & Solution
Finding opportunities is easy; managing them is hard.
* **The Problem:** You see a link for a Hackathon or Scholarship, save it, and forget it. Or, you waste time reading requirements only to realize you aren't eligible.
* **The Solution:** OppTracker acts as a **Validator, Tracker, and Reminder**.
    1.  **Forward:** Send a URL to the WhatsApp bot.
    2.  **Analyze:** The AI scrapes the site, checks for scams (domain authority), and extracts deadlines/criteria.
    3.  **Match:** It compares the opportunity against *your* profile to answer: *"Can I apply?"*
    4.  **Track:** If you proceed, it tracks the state (`Drafting` → `Submitted`) and nags you until it's done.

## ✨ Key Features

* **📱 WhatsApp-First Interface:** Interaction happens primarily via chat. Forward links, receive eligibility summaries, and get nudged to finish your essays.
* **👤 Dynamic User Profiling:** Ingests user data (CV, Interests, Skills) to create a persona used for matching.
* **🤖 Automated Vetting Agent:** * **Scraper:** Fetches live content from provided URLs.
    * **Validator:** Checks for red flags and verifies domain authority.
    * **Extractor:** Identifies hard deadlines and specific eligibility criteria using RAG.
* **🧠 Logic Engine:** Uses **Google Gemini** to reason whether your specific profile matches the opportunity's requirements.
* **🔄 Lifecycle Management:** A state machine that tracks your progress through `Interested`, `Drafting`, and `Submitted` stages.

## 🛠️ Tech Stack

* **Frontend/Framework:** Next.js (React), TypeScript
* **Styling:** Tailwind CSS (Inter & Space Grotesk typography)
* **AI Model:** Google Gemini API
* **Orchestration:** Genkit / LangChain concepts
* **Integration:** Twilio / Meta API (Architecture ready)

## 🚧 Current Status & Limitations
* **Web Scraping:** The app currently uses a custom scraping implementation to fetch job/scholarship descriptions.
* **LinkedIn Integration:** Direct LinkedIn profile scraping is currently disabled due to authentication complexity; the app currently relies on manual profile data entry or CV text pasting.

---

## 💻 Run Locally

This repository contains the full prototype. Follow these steps to get it running on your machine.

**Prerequisites:** Node.js (v18+)

1.  **Clone and Install:**
    ```bash
    git clone [your-repo-link-here]
    cd opptracker
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Google Gemini API key:
    ```bash
    GEMINI_API_KEY=your_actual_api_key_here
    ```
    *(You can get a key from [Google AI Studio](https://aistudio.google.com/))*

3.  **Run the App:**
    ```bash
    npm run dev
    ```

4.  **Explore:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing
Feel free to open issues or pull requests to improve the scraping logic or add new integration channels!
