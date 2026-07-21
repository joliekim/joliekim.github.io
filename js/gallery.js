/* ============================================================
   Rotating photo sphere + lightbox
   Data comes from js/gallery-data.js (const GALLERY).
   Each item: { slug, src, date, place, lat, lng, w, h }
   Thumbnails live in image/gallery/web/<slug>.jpg
   Full-size in image/gallery/full/<slug>.jpg
   ============================================================ */
(function () {
    if (typeof GALLERY === "undefined" || !Array.isArray(GALLERY)) return;

    const sphere = document.getElementById("photo-sphere");
    const stage = document.getElementById("sphere-stage");
    const hint = document.getElementById("sphere-hint");
    if (!sphere || !stage) return;

    // ---- sphere geometry ----------------------------------------------------
    const items = GALLERY.slice();
    const N = items.length;
    const RADIUS = 168;        // sphere radius in px
    const TILE_W = 58;         // tile width; height derived from photo aspect
    const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // golden angle

    const tiles = [];          // { el, lon, lat }

    items.forEach((item, i) => {
        // even area distribution on a sphere (Fibonacci)
        const yUnit = 1 - (i + 0.5) / N * 2;              // 1 .. -1
        const lat = Math.asin(yUnit);                     // -pi/2 .. pi/2
        const lon = GOLDEN * i;                           // azimuth

        const tile = document.createElement("div");
        tile.className = "sphere-tile";
        tile.setAttribute("role", "listitem");

        const ratio = item.w && item.h ? item.h / item.w : 1;
        const h = Math.max(38, Math.min(84, Math.round(TILE_W * ratio)));
        tile.style.width = TILE_W + "px";
        tile.style.height = h + "px";
        // centre the tile on its point, then push it out along the normal
        tile.style.marginLeft = (-TILE_W / 2) + "px";
        tile.style.marginTop = (-h / 2) + "px";

        const img = document.createElement("img");
        img.decoding = "async";
        img.src = "./image/gallery/web/" + item.slug + ".jpg";
        img.alt = item.place ? ("Photo from " + item.place) : "A photo from my collection";
        img.addEventListener("load", () => tile.classList.add("ready"));
        img.addEventListener("error", () => tile.remove());
        tile.appendChild(img);

        tile.dataset.index = String(i);
        stage.appendChild(tile);
        tiles.push({ el: tile, lon: lon * 180 / Math.PI, lat: lat * 180 / Math.PI });
    });

    // static per-tile transform (position on the sphere, facing outward)
    tiles.forEach((t) => {
        t.el.style.transform =
            "rotateY(" + t.lon + "deg) rotateX(" + (-t.lat) + "deg) translateZ(" + RADIUS + "px)";
    });

    // ---- rotation state -----------------------------------------------------
    let rotX = -12;            // tilt
    let rotY = 0;              // spin
    let velX = 0;
    let velY = 0.12;           // gentle idle spin
    let dragging = false;
    let moved = false;
    let last = { x: 0, y: 0 };
    let downAt = 0;
    let downTile = null;
    let paused = false;

    function render() {
        stage.style.transform = "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
    }
    render();

    function tick() {
        if (!dragging && !paused) {
            rotY += velY;
            rotX += velX;
            // clamp tilt so the sphere never flips fully over on idle
            if (rotX > 32) { rotX = 32; velX *= -0.4; }
            if (rotX < -32) { rotX = -32; velX *= -0.4; }
            // ease velocity back toward the idle spin
            velY += (0.12 - velY) * 0.02;
            velX *= 0.94;
            render();
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // ---- drag to spin -------------------------------------------------------
    function pointerDown(e) {
        dragging = true;
        moved = false;
        downAt = Date.now();
        // remember the tile pressed now — pointer capture would otherwise
        // retarget pointerup to the sphere, hiding which photo was clicked
        downTile = e.target && e.target.closest ? e.target.closest(".sphere-tile") : null;
        const p = point(e);
        last = p;
        sphere.classList.add("dragging");
        if (e.pointerId !== undefined && sphere.setPointerCapture) {
            try { sphere.setPointerCapture(e.pointerId); } catch (_) {}
        }
    }

    function pointerMove(e) {
        if (!dragging) return;
        const p = point(e);
        const dx = p.x - last.x;
        const dy = p.y - last.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
        rotY += dx * 0.35;
        rotX -= dy * 0.35;
        if (rotX > 78) rotX = 78;
        if (rotX < -78) rotX = -78;
        velY = dx * 0.35;
        velX = -dy * 0.35;
        last = p;
        render();
    }

    function pointerUp(e) {
        if (!dragging) return;
        dragging = false;
        sphere.classList.remove("dragging");
        // a quick, still tap on a tile = open it
        const quick = Date.now() - downAt < 350;
        if (!moved && quick && downTile) {
            openLightbox(parseInt(downTile.dataset.index, 10));
        }
        downTile = null;
        if (hint && !hint.classList.contains("hidden") && moved) {
            hint.classList.add("hidden");
        }
    }

    function point(e) {
        if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }

    if (window.PointerEvent) {
        sphere.addEventListener("pointerdown", pointerDown);
        window.addEventListener("pointermove", pointerMove);
        window.addEventListener("pointerup", pointerUp);
    } else {
        sphere.addEventListener("mousedown", pointerDown);
        window.addEventListener("mousemove", pointerMove);
        window.addEventListener("mouseup", pointerUp);
        sphere.addEventListener("touchstart", pointerDown, { passive: true });
        window.addEventListener("touchmove", pointerMove, { passive: true });
        window.addEventListener("touchend", pointerUp);
    }

    // slow the idle spin while hovering so photos are easier to grab
    sphere.addEventListener("mouseenter", () => { paused = false; velY = 0.05; });

    // ---- lightbox -----------------------------------------------------------
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    const lbFigure = document.getElementById("lightbox-figure");
    const lbClose = document.getElementById("lightbox-close");
    const metaWhere = document.getElementById("meta-where");
    const metaWhen = document.getElementById("meta-when");
    const lbTip = document.getElementById("lightbox-tip");

    let swallowClick = false;   // eat the opening tap's trailing click
    let swallowTimer = 0;

    function openLightbox(index) {
        const item = items[index];
        if (!item || !lightbox) return;
        paused = true;
        // swallow the trailing click from the opening tap; auto-clear so a
        // genuine later tap is never eaten if that trailing click never lands
        swallowClick = true;
        clearTimeout(swallowTimer);
        swallowTimer = setTimeout(() => { swallowClick = false; }, 500);
        lbImg.src = "./image/gallery/full/" + item.slug + ".jpg";
        lbImg.alt = item.place ? ("Photo from " + item.place) : "A photo from my collection";

        const where = item.place || "Somewhere I wandered";
        const when = item.date || "sometime";
        metaWhere.textContent = "📍 " + where;   // 📍
        metaWhen.textContent = "🗓️ " + when; // 🗓️
        lbFigure.classList.remove("show-meta");
        // hide the "tap for when & where" hint if there's nothing to show
        lbTip.style.display = (item.place || item.date) ? "" : "none";

        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        paused = false;
    }

    if (lightbox) {
        // the tap that opened the lightbox also fires a trailing click on it;
        // swallow that one click (capture phase, before the handlers below)
        lightbox.addEventListener("click", (e) => {
            if (swallowClick) {
                swallowClick = false;
                clearTimeout(swallowTimer);
                e.stopPropagation();
            }
        }, true);
        // tap the photo -> toggle the when/where overlay
        lbImg.addEventListener("click", (e) => {
            e.stopPropagation();
            if (lbTip.style.display === "none") return; // no metadata to reveal
            lbFigure.classList.toggle("show-meta");
        });
        lbClose.addEventListener("click", closeLightbox);
        // click on the backdrop (outside the figure) closes
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
        });
    }

    // pause the idle spin when the tab is hidden (saves battery)
    document.addEventListener("visibilitychange", () => {
        paused = document.hidden || (lightbox && lightbox.classList.contains("open"));
    });
})();
