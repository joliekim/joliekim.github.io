// Sparkle trail behind the cursor.
// Mouse/trackpad only (no touch), and off for people who prefer reduced motion.
(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    // same palette as the rainbow "creativity" letters
    const COLORS = ["#ff3b30", "#ff7a00", "#e6a700", "#34c759", "#00b8a9", "#007aff", "#5856d6", "#af52de", "#ff2d75", "#ff5e8a"];
    const STAR = "M12 1 C13 8 16 11 23 12 C16 13 13 16 12 23 C11 16 8 13 1 12 C8 11 11 8 12 1 Z";
    const SPACING = 16;   // px the cursor must travel before the next sparkle
    const MAX_LIVE = 30;  // cap on sparkles on screen at once

    let lastX = null;
    let lastY = null;
    let colorIndex = 0;
    let live = 0;

    function spawn(x, y) {
        if (live >= MAX_LIVE) return;
        live += 1;

        const size = 6 + Math.random() * 6;
        const el = document.createElement("span");
        el.className = "cursor-trail";
        el.setAttribute("aria-hidden", "true");
        el.style.setProperty("--x", `${x - size / 2 + (Math.random() - 0.5) * 8}px`);
        el.style.setProperty("--y", `${y - size / 2 + (Math.random() - 0.5) * 8}px`);
        el.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 16}px`);
        el.style.setProperty("--drift-y", `${8 + Math.random() * 14}px`);
        el.style.setProperty("--spin", `${(Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 60)}deg`);
        el.style.width = el.style.height = `${size}px`;
        el.innerHTML = `<svg viewBox="0 0 24 24"><path d="${STAR}" fill="${COLORS[colorIndex]}"/></svg>`;
        colorIndex = (colorIndex + 1) % COLORS.length;

        el.addEventListener("animationend", () => {
            el.remove();
            live -= 1;
        });
        document.body.appendChild(el);
    }

    window.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        const { clientX: x, clientY: y } = event;
        if (lastX === null) {
            lastX = x;
            lastY = y;
            return;
        }
        if (Math.hypot(x - lastX, y - lastY) < SPACING) return;
        lastX = x;
        lastY = y;
        spawn(x, y);
    }, { passive: true });

    // reset when the cursor leaves the window so re-entry doesn't draw a streak
    document.addEventListener("pointerleave", () => { lastX = lastY = null; });
})();
