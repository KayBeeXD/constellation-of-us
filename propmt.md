Create an interactive, deeply romantic web application called "Constellation of Us". The project should be built using clean, modular HTML, modern CSS, and vanilla JavaScript (or React with Tailwind CSS / Framer Motion / Canvas-confetti).

### 1. Aesthetic & Atmosphere
- **Visuals:** Immersive deep midnight-blue to obsidian gradient background (`#070B19` to `#0B132B`) with soft drifting nebula clouds and twinkling ambient background stars (using HTML5 Canvas or CSS particles).
- **Typography:** Elegant serif or modern calligraphic fonts (e.g., Cormorant Garamond, Playfair Display, or Great Vibes) paired with crisp, clean sans-serif for UI labels.
- **Color Palette:** Soft champagne gold, starlight white, ethereal lilac, and rose gold accents.

### 2. Audio & Entrance Screen (Crucial for Browser Autoplay Policy)
- Modern browsers block audio autoplay without a prior user gesture. Design an elegant, minimal "Welcome / Entry Curtain":
  - A centered glowing prompt: *"A little universe made just for you ✨"* with a button that says *"Enter the Stars 💫"*.
  - When clicked, trigger a soft audio fade-in of an ambient, emotional romantic instrumental track (include a placeholder `<audio>` element with royalty-free audio or a local MP3 link, plus a discreet, aesthetic floating Mute/Play toggle in the top corner).
  - Smoothly fade out the welcome overlay into the main sky canvas.

### 3. Core Mechanics: The Interactive Constellation
- Render 6–8 primary glowing "anchor" stars strategically positioned across the screen so that, when joined in order, they form a clear shape (a heart or glowing constellation).
- Give unclicked stars a gentle breathing/pulsing animation with a soft golden glow.
- **Star Click Interaction:**
  - When the user taps a star, it triggers an explosion of subtle golden sparkle particles (canvas particle burst).
  - The star lights up permanently, and an animated glowing starlight line draws dynamically connecting it to the previous star.
  - A modal or floating glassmorphic card smoothly appears (with subtle blur and typewriter or fade-up animation) displaying a quote.
  - Structure the quote dataset as an easy-to-edit JavaScript array of objects (e.g., `const quotes = [{ id: 1, text: "PLACEHOLDER_QUOTE_1" }, ...]`) so I can replace them with my custom quotes easily.
  - The card should have a gentle "Next Star ✨" button or tap-to-dismiss feature that guides her to the next glowing node.

### 4. Climax: Completion & Final Letter
- When the final star is connected:
  - The entire constellation pulses with light, drawing the complete outline cleanly.
  - Launch a delicate, slow-falling stardust / shimmer effect across the entire screen.
  - A glowing sealed envelope or starlight parchment modal unfolds in the center:
    - Include a space for a handwritten-style love letter.
    - Add a replay button ("Watch the stars again 🌌") that smoothly resets the constellation while keeping the background music playing.

### 5. Technical & Responsive Requirements
- Fully responsive across desktop, tablet, and mobile browsers (touch events and click events must work seamlessly).
- High performance 60fps canvas animations without lag.
- Code should be clean, well-commented, and easily configurable with placeholders for audio files, custom quotes, and letter content.