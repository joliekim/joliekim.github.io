// Edit these to change what the "fun fact" pill cycles through.
const FUN_FACTS = [
    "“Jolie” is from Angelina Jolie — my parents are fans \u{1F3AC}",
    "quadrilingual: English, Korean, Chinese, and Japanese \u{1F5E3}️",
    "winter sports person — snowboarding and figure skating ⛷️",
    "coffee: a persistent dependency ☕",
    "passed my master's defense this year \u{1F393}",
];

let factIndex = 0;

const factPill = document.getElementById("fact-pill");
const factText = document.getElementById("fact-pill-text");

if (factPill && factText) {
    factPill.addEventListener("click", () => {
        factIndex = (factIndex + 1) % FUN_FACTS.length;
        factText.classList.add("fade");
        setTimeout(() => {
            factText.textContent = FUN_FACTS[factIndex];
            factText.classList.remove("fade");
        }, 150);
    });
}

const sparkle = document.getElementById("sparkle");

if (sparkle) {
    sparkle.addEventListener("click", (event) => {
        sparkle.classList.remove("spin");
        // restart animation even on rapid re-clicks
        void sparkle.offsetWidth;
        sparkle.classList.add("spin");

        const rect = sparkle.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        const glyphs = ["✦", "✧", "✹", "✵"];

        for (let i = 0; i < 8; i++) {
            const bit = document.createElement("span");
            bit.className = "mini-sparkle";
            bit.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];

            const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
            const distance = 40 + Math.random() * 30;
            bit.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
            bit.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
            bit.style.left = `${originX}px`;
            bit.style.top = `${originY}px`;

            document.body.appendChild(bit);
            setTimeout(() => bit.remove(), 700);
        }
    });
}

// ---------- curation tabs ----------

const tabChips = document.querySelectorAll(".tab-chip");
const panels = document.querySelectorAll(".curation-panel");

tabChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        const target = chip.dataset.tab;

        tabChips.forEach((c) => {
            c.classList.toggle("active", c === chip);
            c.setAttribute("aria-selected", c === chip ? "true" : "false");
        });

        panels.forEach((panel) => {
            const isMatch = panel.dataset.panel === target;
            panel.hidden = !isMatch;
            panel.classList.toggle("active", isMatch);
        });
    });
});
