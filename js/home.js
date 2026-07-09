// ============================================================
// Working camera + draggable "creativity" letters
// ============================================================

// ---------- camera ----------

// Photos the MENU button cycles through. Add more entries any time.
const GALLERY = [
    "./image/lcd-balcony.jpg",
    "./image/hero.png",
    "./image/gallery-snowman.jpg",
];

const lcdInner = document.getElementById("lcd-inner");
const lcdPhoto = document.getElementById("lcd-photo");
const lcdOsd = document.getElementById("lcd-osd");
const flash = document.getElementById("cam-flash");
const filmTray = document.getElementById("film-tray");

let photoIndex = 0;
let zoom = 1;
let osdTimer = null;

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 1.25;

function showOsd(text) {
    if (!lcdOsd) return;
    lcdOsd.textContent = text;
    lcdOsd.classList.add("show");
    clearTimeout(osdTimer);
    osdTimer = setTimeout(() => lcdOsd.classList.remove("show"), 900);
}

function setZoom(next) {
    zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
    lcdInner.style.setProperty("--zoom", zoom.toFixed(2));
    showOsd(`x${zoom.toFixed(1)}`);
}

function cyclePhoto() {
    photoIndex = (photoIndex + 1) % GALLERY.length;
    // quick blink like a real camera, then swap
    lcdInner.style.opacity = "0";
    setTimeout(() => {
        lcdPhoto.src = GALLERY[photoIndex];
        zoom = 1;
        lcdInner.style.setProperty("--zoom", "1");
        lcdInner.style.opacity = "1";
        showOsd(`${photoIndex + 1}/${GALLERY.length}`);
    }, 160);
}

function takePhoto() {
    flash.classList.remove("fire");
    void flash.offsetWidth; // restart animation on rapid clicks
    flash.classList.add("fire");

    const polaroid = document.createElement("button");
    polaroid.type = "button";
    polaroid.className = "polaroid";
    polaroid.title = "click to toss";
    polaroid.style.setProperty("--tilt", `${(Math.random() * 10 - 5).toFixed(1)}deg`);

    const print = document.createElement("span");
    print.className = "print";
    const img = document.createElement("img");
    img.src = GALLERY[photoIndex];
    img.alt = "polaroid print";
    img.style.setProperty("--zoom", zoom.toFixed(2));
    print.appendChild(img);
    polaroid.appendChild(print);

    polaroid.addEventListener("click", () => {
        polaroid.classList.add("popped");
        setTimeout(() => polaroid.remove(), 250);
    });

    // keep the pile small
    while (filmTray.children.length >= 4) {
        filmTray.firstElementChild.remove();
    }
    filmTray.appendChild(polaroid);
}

if (lcdInner) {
    document.getElementById("btn-t").addEventListener("click", () => setZoom(zoom * ZOOM_STEP));
    document.getElementById("btn-w").addEventListener("click", () => setZoom(zoom / ZOOM_STEP));
    document.getElementById("btn-menu").addEventListener("click", cyclePhoto);
    document.getElementById("btn-shutter").addEventListener("click", takePhoto);
}

// ---------- draggable "creativity" letters ----------

document.querySelectorAll(".rainbow span").forEach((letter) => {
    let startX = 0;
    let startY = 0;

    letter.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        letter.setPointerCapture(event.pointerId);
        letter.classList.add("dragging");
        startX = event.clientX;
        startY = event.clientY;
    });

    letter.addEventListener("pointermove", (event) => {
        if (!letter.classList.contains("dragging")) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        const tilt = Math.max(-30, Math.min(30, dx * 0.25));
        letter.style.transform = `translate(${dx}px, ${dy}px) rotate(${tilt}deg)`;
    });

    const release = () => {
        if (!letter.classList.contains("dragging")) return;
        letter.classList.remove("dragging");
        // spring home (transition handles the bounce)
        letter.style.transform = "";
    };

    letter.addEventListener("pointerup", release);
    letter.addEventListener("pointercancel", release);
});

// ---------- updates pagination ----------

const UPDATES_PER_PAGE = 7;

const updateList = document.getElementById("update-list");
const updatePagination = document.getElementById("update-pagination");

if (updateList && updatePagination) {
    const items = Array.from(updateList.children);
    const totalPages = Math.ceil(items.length / UPDATES_PER_PAGE);

    function showUpdatesPage(page) {
        items.forEach((item, i) => {
            const itemPage = Math.floor(i / UPDATES_PER_PAGE) + 1;
            item.style.display = itemPage !== page ? "none" : "";
        });
        updatePagination.querySelectorAll(".page-btn").forEach((btn) => {
            btn.classList.toggle("active", Number(btn.dataset.page) === page);
        });
    }

    if (totalPages > 1) {
        for (let page = 1; page <= totalPages; page++) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "page-btn";
            btn.textContent = String(page);
            btn.dataset.page = String(page);
            btn.addEventListener("click", () => showUpdatesPage(page));
            updatePagination.appendChild(btn);
        }
    }

    showUpdatesPage(1);
}
