# Browser Timer

A modern, high-impact Single Page Application (SPA) countdown timer designed for meetings and presentations.

## Features

- **Single Page Architecture:** Instant transitions between Setup, Timer, and Finish views without page reloads.
- **Massive Full-Screen Scaling:** Uses CSS `clamp()` to scale the timer digits to fill up to 90% of the screen width (40vw).
- **Optimized Flip Animation:** High-performance logic that reuses DOM elements instead of creating/destroying them every second.
- **Dynamic Color Warnings:** (For timers $\ge$ 5 minutes)
    - **Amber:** At 2 minutes remaining.
    - **Red:** At 1 minute remaining.
- **Visual Finish Cues:** A pulsing "Attention Please" box providing visual feedback when the timer ends.
- **Manual Audio Control:** A "Play Audio" button to trigger the sit-down reminder only when you're ready.

## How It Works

### 1. Structure (`index.html`)
The application is contained within a single HTML file using three primary sections:
- `#setup-view`: Configuration interface for title selection and duration.
- `#timer-view`: The main countdown interface with responsive flip-cards.
- `#finish-view`: The conclusion screen with visual alerts and audio controls.

### 2. Logic (`main.js`)
- **View Controller:** Manages DOM visibility via the `switchView()` function, toggling the `.hidden` CSS class.
- **Countdown Engine:** Calculates the target end-time and updates the display 4 times per second to ensure accuracy.
- **Color Logic:** Monitors the remaining time and applies `.warning` or `.critical` CSS classes to the timer digits based on thresholds.
- **Flip Optimization:** Reuses persistent `.top-flip` and `.bottom-flip` elements, triggering animations via class toggling and cleaning up via `onanimationend` events.

### 3. Styling (`styles.css`)
- **Responsive Typography:** Uses `vw` (viewport width) units and `clamp()` to ensure the timer fits perfectly on any display, from mobile to 4K projectors.
- **Flexbox Layout:** Ensures perfect vertical and horizontal centering of all UI elements.
- **Animations:** Handles the complex 3D flip effects and the "pulse" alert on the finish screen.

## Usage

1. Open `index.html` in any modern web browser.
2. Enter the meeting duration and select a title.
3. Click **Begin Countdown Timer**.
4. Use the browser's **Full Screen** mode (usually F11) for the best visual impact during meetings.
5. Once finished, click **Play Audio** to trigger the reminder chime.

## Technical Details

- **Vanilla JS:** No external frameworks or libraries required.
- **CSS Custom Properties:** Easily themeable using variables in `:root`.
- **State Management:** Uses local variables within `main.js` for real-time tracking.
