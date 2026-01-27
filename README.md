# Geometric Journal Portfolio

A high-performance, single-page application (SPA) developer portfolio featuring a unique "Geometric Structure" bento box layout with an organic "Hand-drawn Logic" aesthetic.

## 🎨 Design Philosophy

*   **Theme:** Bento box grid, Organic Typography, Tactile Depth.
*   **Visual Language:** "Hand-drawn Logic" — strict geometric grids meet handwritten warmth.
*   **Typography:** 
    *   **Headings:** 'Henny Penny' (Decorative, bold).
    *   **Body:** 'Kalam' (Handwriting style, approachable).
    *   *Powered by **Google Fonts**.*
*   **Tactile Aesthetics:** Custom soft shadows (`2px 2px 2px rgba(0,0,0,0.15)`) that collapse on interaction to create a physical button-press feel.

## 🎬 The Living Interface (Stickman Scene)

Beyond the static grid, the application features a **cinematic canvas overlay** (`components/StickmanScene.tsx`) where two digital entities inhabit the portfolio.

*   **Real-Time Physics:** Characters treat DOM elements (`#identity-card` and `#ai-assistant-card`) as physical solids, calculating floor positions and edge boundaries dynamically.
*   **Procedural Animation:** Uses linear interpolation (lerp) and easing functions to generate smooth walking, jumping (parabolic arcs), and "relaxed" sitting postures where limbs dangle organically off the UI cards.
*   **The 24-Second Loop:**
    1.  **0s-4s (Lounging):** Characters sit casually on the far edges, leaning back on their hands.
    2.  **6s-12s (The Crossing):** They hop across the grid gaps using gravity-simulated jumps (`height: 60px`).
    3.  **12s-16s (Interaction):** A "Happy Dance" and handshake in the center of the AI card.
    4.  **20s+ (Discussion):** They retreat to the inner edges to sit face-to-face, indefinitely discussing the user's journey.

## 🛠 Tech Stack

*   **Framework:** React 19 (Vite) + TypeScript
*   **Styling:** Tailwind CSS
*   **Animation:** Framer Motion & HTML5 Canvas
*   **AI Model:** **Google Gemini 1.5 Flash** (via `@google/genai`)
*   **Backend/Integration:** **Google Apps Script** (Calendar API Proxy)
*   **Icons:** Lucide React & React Icons

## 🧠 AI-Powered by Google Gemini

The core differentiator of this portfolio is the **AI Executive Assistant** (`components/AIChat.tsx`). Instead of static text, visitors interact with a "Super-Intelligent" agent that manages the portfolio.

### Implementation Details:
*   **SDK:** Built using the `@google/genai` library.
*   **Model:** `gemini-1.5-flash` is used for high-speed, low-latency conversational responses.
*   **System Instructions:** The AI is prompted to act as "Samuel's Executive Assistant", maintaining a professional yet witty persona with strict context awareness of the user's current view.

### 🔧 Function Calling (Tools)
The AI is connected to real-world data through Gemini's Function Calling capabilities:
1.  **`check_calendar(date)`**: The AI autonomously calls the backend to check for free slots when a user asks "Are you free next Tuesday?".
2.  **`create_booking(...)`**: If the user confirms a time, the AI executes a booking request.
3.  **`get_resume()`**: Delivers a specific UI card for downloading the CV.

## 📅 Real-Time Availability (Google Calendar)

The "Book a Call" card (`components/Availability.tsx`) provides a live window into real availability.

*   **Frontend:** A custom-built calendar UI that handles timezone conversion (Host UTC+1 vs User Local Time).
*   **Backend:** A **Google Apps Script** Web App acts as a secure middleware between the React app and **Google Calendar**.
    *   It acts as a lightweight backend to fetch busy slots and handle meeting requests without exposing direct API keys on the client.

## 📂 Project Structure

*   **`components/StickmanScene.tsx`**: The canvas-based animation layer handling the 24s cinematic loop and physics.
*   **`components/AIChat.tsx`**: The brain of the app. Handles Gemini streaming, tool definitions, and chat state.
*   **`components/Availability.tsx`**: Logic for the calendar grid, slot generation, and backend communication.
*   **`ProjectShowcase.tsx`**: Interactive carousel for projects with "like" functionality persistence.
*   **`data.ts`**: The single source of truth for profile data, project lists, and configuration.

## 🚀 Setup & Installation

1.  **Clone the repository**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Setup:**
    *   Get a Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
    *   Ensure the `API_KEY` is available in your build environment.
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---
*Built with ❤️ using the Google Gemini API, Google Calendar, and Google Fonts.*