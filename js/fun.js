(function () {
  "use strict";

  const EMOJI_POOL = {
    default: ["✨", "💫", "⭐", "🌟", "💡", "🎯", "🎈", "🫧", "🌈", "🎉", "😈"],
    about: ["🧠", "🤖", "🔬", "💡", "🌱", "🚀"],
    publications: ["📄", "📊", "🔍", "📝", "🏆", "✨"],
    education: ["🎓", "📚", "✏️", "🏫", "📖"],
    news: ["📢", "🗞️", "🆕", "📌"],
    hero: ["👋", "😊", "✌️", "🙌"],
    rare: ["🦄", "🌠", "🍀", "🎊", "👾"],
  };

  const CHARGE_MOVE_THRESHOLD = 12;
  const MISS_CHANCE = 0.14;
  const CRIT_CHANCE = 0.07;
  const COMBO_WINDOW_MS = 850;
  const COMBO_MIN_STREAK = 3;

  let clickStreak = 0;
  let clickStreakTimer = null;
  let scrollVelX = 0;
  let scrollVelY = 0;
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let particles = [];
  let rafId = null;
  let lightbox = null;
  let lightboxImg = null;
  let lightboxScale = 1;
  let lightboxOpen = false;
  let lightboxDragging = false;
  let lightboxPanMoved = false;
  let zoomHideTimer = null;
  let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LIGHTBOX_CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>`;

  let emojiCharge = null;

  function clearTextSelection() {
    const sel = window.getSelection();
    if (sel && sel.removeAllRanges) sel.removeAllRanges();
  }

  function hasActiveTextSelection() {
    const sel = window.getSelection();
    return Boolean(sel && !sel.isCollapsed && sel.toString().trim().length > 0);
  }

  function enterFunDragMode() {
    document.body.classList.add("fun-no-select");
    clearTextSelection();
  }

  function exitFunDragMode() {
    document.body.classList.remove("fun-no-select");
  }

  /** 正文区域：允许用户正常选中复制 */
  function isTextSelectableTarget(el) {
    if (!el) return false;
    const node = el.nodeType === Node.TEXT_NODE ? el.parentElement : el;
    if (!node || !node.closest) return false;
    return Boolean(
      node.closest(
        [
          "p",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "li",
          ".pub-title",
          ".pub-authors",
          ".pub-tldr",
          ".about-text",
          ".hero-bio",
          ".hero-name",
          ".hero-affiliation",
          ".timeline-title",
          ".timeline-subtitle",
          ".timeline-detail",
          ".project-name",
          ".project-desc",
          ".award-item",
          ".section-title",
          ".interest-desc",
          ".news-item",
        ].join(", ")
      )
    );
  }

  function isClickInsideActiveSelection(target) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return false;
    const node = target?.nodeType === Node.TEXT_NODE ? target.parentElement : target;
    if (!node || !sel.containsNode) return false;
    try {
      return sel.containsNode(node, true);
    } catch {
      return false;
    }
  }

  function clearSelectionIfClickOutside(e) {
    if (isClickInsideActiveSelection(e.target)) return;
    if (isTextSelectableTarget(e.target)) return;
    clearTextSelection();
  }

  function cancelEmojiInteraction() {
    clearEmojiCharge();
    exitFunDragMode();
  }

  function pickEmoji(target) {
    if (Math.random() < 0.04) {
      return EMOJI_POOL.rare[Math.floor(Math.random() * EMOJI_POOL.rare.length)];
    }
    const section = target.closest("section[id]");
    const id = section ? section.id : "";
    const pool = EMOJI_POOL[id] || EMOJI_POOL.default;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function isInteractive(el) {
    if (!el || el === document.documentElement) return false;
    if (el.closest(".lightbox")) return true;
    if (el.closest("a, button, input, select, textarea, label, .lang-btn, .pub-link, .pub-author-link, .pub-menu")) {
      return true;
    }
    if (el.closest(".pub-figure-zoomable")) return true;
    if (el.closest(".nav-links")) return true;
    const tag = el.tagName;
    if (tag === "A" || tag === "BUTTON" || tag === "INPUT") return true;
    return false;
  }

  function trackScrollVelocity() {
    const now = performance.now();
    const dt = Math.max(now - lastScrollTime, 1);
    const dy = window.scrollY - lastScrollY;
    scrollVelY = scrollVelY * 0.82 + (dy / dt) * 16;
    lastScrollY = window.scrollY;
    lastScrollTime = now;
  }

  function trackWheelVelocity(e) {
    scrollVelX = scrollVelX * 0.75 + e.deltaX * 0.08;
    scrollVelY = scrollVelY * 0.75 + e.deltaY * 0.08;
  }

  function registerClickStreak() {
    clickStreak += 1;
    clearTimeout(clickStreakTimer);
    clickStreakTimer = setTimeout(() => {
      clickStreak = 0;
    }, COMBO_WINDOW_MS);
    return clickStreak;
  }

  function rollTapOutcome() {
    const r = Math.random();
    if (r < CRIT_CHANCE) return "crit";
    if (r < CRIT_CHANCE + MISS_CHANCE) return "miss";
    return "hit";
  }

  function comboDecayScale(streak) {
    return streak >= COMBO_MIN_STREAK ? 0.5 + Math.min(streak - 2, 6) * 0.04 : 1;
  }

  function showFloatTip(x, y, text, typeClass, duration) {
    const tip = document.createElement("span");
    tip.className = `emoji-float-tip ${typeClass}`;
    tip.textContent = text;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), duration || 1000);
  }

  function addParticle(opts) {
    const emoji = document.createElement("span");
    emoji.className = "emoji-particle";
    emoji.textContent = opts.emoji;
    emoji.style.left = `${opts.x}px`;
    emoji.style.top = `${opts.y}px`;
    document.body.appendChild(emoji);

    particles.push({
      el: emoji,
      x: opts.x,
      y: opts.y,
      vx: opts.vx,
      vy: opts.vy,
      life: opts.life ?? 1,
      decay: opts.decay,
      spin: opts.spin ?? (Math.random() - 0.5) * 8,
      scale: opts.scale ?? 1,
      gravity: opts.gravity ?? 0.08,
    });

    if (!rafId) rafId = requestAnimationFrame(tickParticles);
  }

  /** Tap: 1–3 emojis, radial pop */
  function spawnTapPop(x, y, target, streak) {
    const combo = streak >= COMBO_MIN_STREAK;
    let n = 1 + Math.floor(Math.random() * 3);
    if (combo) n += 2 + Math.min(streak - COMBO_MIN_STREAK + 1, 4);
    const decayBase = (0.024 + Math.random() * 0.01) * comboDecayScale(streak);

    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / Math.max(n, 1) + (Math.random() - 0.5) * 0.9;
      const speed = 1.8 + Math.random() * 3.2;
      addParticle({
        emoji: pickEmoji(target),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        decay: decayBase,
        scale: 0.7 + Math.random() * 0.35,
      });
    }

    if (combo) {
      showFloatTip(
        x,
        y - 26,
        streak >= 5 ? `Combo x${streak}!` : "Combo!",
        "emoji-combo-tip",
        1100 + Math.min(streak, 8) * 80
      );
    }
  }

  /** Drag: cone scatter toward drag direction */
  function spawnDragScatter(x, y, dx, dy, charge, target, streak) {
    const dist = Math.hypot(dx, dy) || 1;
    const baseAngle = Math.atan2(dy, dx);
    const combo = streak >= COMBO_MIN_STREAK;
    const dragCombo = combo || (charge > 0.45 && Math.random() < 0.35 + charge * 0.3);

    let count = 2 + Math.floor(Math.random() * 2) + Math.floor(charge * 3);
    if (dragCombo) count += 3 + Math.min(streak, 5);

    const decayBase = (0.016 + Math.random() * 0.008) * comboDecayScale(streak);
    const speedBase = 3 + charge * 14 + Math.min(dist * 0.06, 6);

    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * (1.1 + charge * 0.8);
      const angle = baseAngle + spread;
      const speed = speedBase * (0.65 + Math.random() * 0.55);
      addParticle({
        emoji: pickEmoji(target),
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed + scrollVelX * 0.1,
        vy: Math.sin(angle) * speed + scrollVelY * 0.1,
        decay: decayBase,
        scale: 0.75 + Math.random() * 0.45 + charge * 0.2,
        gravity: 0.06,
      });
    }

    if (dragCombo) {
      showFloatTip(
        x,
        y - 26,
        streak >= 5 ? `Combo x${streak}!` : "Combo!",
        "emoji-combo-tip",
        1200 + Math.min(streak, 8) * 100
      );
    }
  }

  /** Critical: mass emoji burst with varied patterns */
  function spawnCritBurst(x, y, target) {
    if (reducedMotion) {
      spawnTapPop(x, y, target, 1);
      showFloatTip(x, y - 30, "CRITICAL!", "emoji-crit-tip", 1400);
      return;
    }

    const patterns = ["firework", "rain", "confetti", "sparkle"];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const w = window.innerWidth;
    const h = window.innerHeight;

    showFloatTip(x, y - 32, "CRITICAL!", "emoji-crit-tip", 1600);

    if (pattern === "firework") {
      const n = 32 + Math.floor(Math.random() * 12);
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
        const speed = 4 + Math.random() * 10;
        addParticle({
          emoji: pickEmoji(target),
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          decay: 0.006 + Math.random() * 0.004,
          scale: 0.85 + Math.random() * 0.6,
          gravity: 0.04,
        });
      }
      return;
    }

    if (pattern === "rain") {
      const n = 36 + Math.floor(Math.random() * 16);
      for (let i = 0; i < n; i++) {
        addParticle({
          emoji: pickEmoji(target),
          x: Math.random() * w,
          y: -10 - Math.random() * h * 0.15,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 3 + Math.random() * 5,
          decay: 0.005 + Math.random() * 0.003,
          scale: 0.65 + Math.random() * 0.5,
          gravity: 0.03,
        });
      }
      return;
    }

    if (pattern === "confetti") {
      const n = 40 + Math.floor(Math.random() * 14);
      const origins = [
        { x: 0, y: h + 10, ax: 0.4 },
        { x: w, y: h + 10, ax: -0.4 },
        { x, y: h + 10, ax: (x / w - 0.5) * 0.3 },
      ];
      for (let i = 0; i < n; i++) {
        const o = origins[i % origins.length];
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4 + o.ax;
        const speed = 6 + Math.random() * 9;
        addParticle({
          emoji: pickEmoji(target),
          x: o.x + (Math.random() - 0.5) * 80,
          y: o.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          decay: 0.007 + Math.random() * 0.004,
          scale: 0.7 + Math.random() * 0.55,
          gravity: 0.07,
        });
      }
      return;
    }

    // sparkle — dotted across the viewport
    const n = 44 + Math.floor(Math.random() * 16);
    for (let i = 0; i < n; i++) {
      addParticle({
        emoji: pickEmoji(target),
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        decay: 0.008 + Math.random() * 0.005,
        scale: 0.5 + Math.random() * 0.9,
        gravity: 0.02,
        life: 0.3 + Math.random() * 0.5,
      });
    }
  }

  function resolveEmojiAction(x, y, target, opts) {
    const streak = registerClickStreak();

    if (opts.isDrag && Math.random() < 0.06) {
      showFloatTip(x, y - 22, "Miss", "emoji-miss-tip", 800);
      return;
    }

    if (!opts.isDrag) {
      const outcome = rollTapOutcome();
      if (outcome === "crit") {
        spawnCritBurst(x, y, target);
        return;
      }
      if (outcome === "miss") {
        showFloatTip(x, y - 22, "Miss", "emoji-miss-tip", 800);
        return;
      }
      spawnTapPop(x, y, target, streak);
      return;
    }

    if (Math.random() < CRIT_CHANCE * 0.6) {
      spawnCritBurst(x, y, target);
      return;
    }

    spawnDragScatter(x, y, opts.dx, opts.dy, opts.charge, target, streak);
  }

  function tickParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    particles = particles.filter((p) => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.spin *= 0.98;

      if (p.x < 12) {
        p.x = 12;
        p.vx = Math.abs(p.vx) * 0.72;
      } else if (p.x > w - 12) {
        p.x = w - 12;
        p.vx = -Math.abs(p.vx) * 0.72;
      }
      if (p.y < 12) {
        p.y = 12;
        p.vy = Math.abs(p.vy) * 0.72;
      } else if (p.y > h - 12) {
        p.y = h - 12;
        p.vy = -Math.abs(p.vy) * 0.65;
      }

      p.el.style.left = `${p.x}px`;
      p.el.style.top = `${p.y}px`;
      p.el.style.transform = `translate(-50%, -50%) scale(${p.scale * Math.max(p.life, 0.2)}) rotate(${p.spin * (1 - p.life)}deg)`;
      p.el.style.opacity = String(Math.max(p.life, 0));

      if (p.life <= 0) {
        p.el.remove();
        return false;
      }
      return true;
    });

    scrollVelX *= 0.92;
    scrollVelY *= 0.92;

    rafId = particles.length ? requestAnimationFrame(tickParticles) : null;
  }

  function createChargeHolder(x, y, emoji, target) {
    const holder = document.createElement("div");
    holder.className = "emoji-charge-holder";
    holder.innerHTML = `
      <span class="emoji-charge-ring" aria-hidden="true"></span>
      <span class="emoji-charge-emoji">${emoji}</span>`;
    holder.style.left = `${x}px`;
    holder.style.top = `${y}px`;
    document.body.appendChild(holder);
    return holder;
  }

  function updateChargeVisual(charge) {
    if (!emojiCharge) return;
    const { holder } = emojiCharge;
    holder.style.left = `${emojiCharge.x}px`;
    holder.style.top = `${emojiCharge.y}px`;
    holder.style.setProperty("--charge", charge.toFixed(2));
    holder.classList.toggle("is-charging", charge > 0.08);
  }

  function clearEmojiCharge() {
    if (emojiCharge && emojiCharge.holder) {
      emojiCharge.holder.remove();
    }
    emojiCharge = null;
  }

  function onPointerDown(e) {
    if (lightboxOpen || e.button !== 0) return;

    if (isInteractive(e.target)) {
      clearSelectionIfClickOutside(e);
      return;
    }

    clearSelectionIfClickOutside(e);

    if (isTextSelectableTarget(e.target)) return;
    if (e.shiftKey) return;

    if (reducedMotion) {
      spawnTapPop(e.clientX, e.clientY, e.target, registerClickStreak());
      return;
    }

    const emoji = pickEmoji(e.target);
    const holder = createChargeHolder(e.clientX, e.clientY, emoji, e.target);

    emojiCharge = {
      holder,
      emoji,
      target: e.target,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      startTime: performance.now(),
      moved: false,
      funMode: false,
      pointerId: e.pointerId,
    };
  }

  function onPointerMove(e) {
    if (!emojiCharge || e.pointerId !== emojiCharge.pointerId) return;

    if (hasActiveTextSelection()) {
      cancelEmojiInteraction();
      return;
    }

    emojiCharge.x = e.clientX;
    emojiCharge.y = e.clientY;

    const dx = e.clientX - emojiCharge.startX;
    const dy = e.clientY - emojiCharge.startY;
    const dist = Math.hypot(dx, dy);

    if (dist >= CHARGE_MOVE_THRESHOLD) {
      emojiCharge.moved = true;
      if (!emojiCharge.funMode) {
        emojiCharge.funMode = true;
        enterFunDragMode();
      }
    }

    const moveCharge = Math.min(dist / 140, 1);
    const timeCharge = Math.min((performance.now() - emojiCharge.startTime) / 900, 1);
    const charge = emojiCharge.moved ? Math.max(moveCharge, timeCharge * 0.35) : 0;

    updateChargeVisual(charge);
  }

  function onPointerUp(e) {
    if (!emojiCharge || e.pointerId !== emojiCharge.pointerId) return;

    const { x, y, startX, startY, moved, target, startTime, funMode } = emojiCharge;
    const dx = x - startX;
    const dy = y - startY;
    const dist = Math.hypot(dx, dy);
    const charge = moved ? Math.min(dist / 140, 1) : 0;

    clearEmojiCharge();
    exitFunDragMode();

    if (hasActiveTextSelection()) return;

    if (moved && dist >= CHARGE_MOVE_THRESHOLD) {
      resolveEmojiAction(x, y, target, {
        isDrag: true,
        dx,
        dy,
        charge: Math.max(charge, 0.2),
      });
    } else if (!funMode && performance.now() - startTime < 500) {
      resolveEmojiAction(x, y, target, { isDrag: false });
    }
  }

  function createLightbox() {
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.id = "figure-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-panel">
        <div class="lightbox-stage">
          <img class="lightbox-img" src="" alt="" draggable="false">
        </div>
      </div>
      <button type="button" class="lightbox-close lightbox-chip" aria-label="Close">${LIGHTBOX_CLOSE_ICON}</button>
      <div class="lightbox-zoom-toast lightbox-chip" aria-live="polite">
        <span class="lightbox-zoom-level">100%</span>
      </div>`;
    document.body.appendChild(lightbox);

    lightboxImg = lightbox.querySelector(".lightbox-img");
    lightboxImg.draggable = false;

    lightboxImg.addEventListener("dragstart", (e) => e.preventDefault());

    lightbox.querySelector(".lightbox-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    lightbox.addEventListener("click", () => {
      if (!lightboxOpen || lightboxPanMoved) {
        lightboxPanMoved = false;
        return;
      }
      closeLightbox();
    });

    lightbox.querySelector(".lightbox-stage").addEventListener("wheel", onLightboxWheel, {
      passive: false,
    });

    lightbox._panX = 0;
    lightbox._panY = 0;
    lightbox._panStartX = 0;
    lightbox._panStartY = 0;
    lightbox._panOriginX = 0;
    lightbox._panOriginY = 0;

    lightboxImg.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      lightboxPanMoved = false;
      e.stopPropagation();
      lightboxDragging = true;
      lightbox._panOriginX = e.clientX;
      lightbox._panOriginY = e.clientY;
      lightbox._panStartX = e.clientX - lightbox._panX;
      lightbox._panStartY = e.clientY - lightbox._panY;
      lightboxImg.classList.add("is-dragging");
      lightboxImg.setPointerCapture(e.pointerId);
    });

    lightboxImg.addEventListener("pointermove", (e) => {
      if (!lightboxDragging) return;
      e.stopPropagation();
      const moved = Math.hypot(
        e.clientX - lightbox._panOriginX,
        e.clientY - lightbox._panOriginY
      );
      if (moved > 5) {
        lightboxPanMoved = true;
        if (!document.body.classList.contains("fun-no-select")) {
          enterFunDragMode();
        }
        e.preventDefault();
      }
      if (!lightboxPanMoved) return;
      lightbox._panX = e.clientX - lightbox._panStartX;
      lightbox._panY = e.clientY - lightbox._panStartY;
      applyLightboxTransform();
    });

    const endPan = (e) => {
      if (!lightboxDragging) return;
      lightboxDragging = false;
      lightboxImg.classList.remove("is-dragging");
      exitFunDragMode();
      if (lightboxImg.hasPointerCapture(e.pointerId)) {
        lightboxImg.releasePointerCapture(e.pointerId);
      }
      e.stopPropagation();
    };

    lightboxImg.addEventListener("pointerup", endPan);
    lightboxImg.addEventListener("pointercancel", endPan);

    lightbox._resetPan = () => {
      lightbox._panX = 0;
      lightbox._panY = 0;
      lightboxDragging = false;
    };
  }

  function hideZoomIndicator() {
    if (!lightbox) return;
    clearTimeout(zoomHideTimer);
    lightbox.querySelector(".lightbox-zoom-toast").classList.remove("is-visible");
  }

  function showZoomIndicator() {
    if (!lightbox) return;
    lightbox.querySelector(".lightbox-zoom-level").textContent =
      `${Math.round(lightboxScale * 100)}%`;
    const toast = lightbox.querySelector(".lightbox-zoom-toast");
    toast.classList.add("is-visible");
    clearTimeout(zoomHideTimer);
    zoomHideTimer = setTimeout(hideZoomIndicator, 1400);
  }

  function applyLightboxTransform() {
    const px = lightbox._panX || 0;
    const py = lightbox._panY || 0;
    lightboxImg.style.transform = `translate(${px}px, ${py}px) scale(${lightboxScale})`;
  }

  function openLightbox(img) {
    if (!lightbox) createLightbox();

    lightboxScale = 1;
    lightbox._resetPan();
    lightboxPanMoved = false;
    hideZoomIndicator();

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    applyLightboxTransform();

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxOpen = true;

    lightbox.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    if (!lightboxOpen) return;
    hideZoomIndicator();
    exitFunDragMode();
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxOpen = false;
    lightboxDragging = false;
    lightboxPanMoved = false;
    lightboxImg.src = "";
  }

  function onLightboxWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    lightboxScale = Math.min(4, Math.max(0.5, lightboxScale + delta));
    applyLightboxTransform();
    showZoomIndicator();
  }

  function onDocumentClick(e) {
    if (lightboxOpen) return;

    const zoomImg = e.target.closest(".pub-figure-zoomable");
    if (zoomImg) {
      e.preventDefault();
      openLightbox(zoomImg);
    }
  }

  function init() {
    document.querySelectorAll(".pub-figure-zoomable").forEach((img) => {
      img.draggable = false;
      img.addEventListener("dragstart", (e) => e.preventDefault());
    });

    window.addEventListener("scroll", trackScrollVelocity, { passive: true });
    window.addEventListener("wheel", trackWheelVelocity, { passive: true });

    document.addEventListener("click", onDocumentClick);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", cancelEmojiInteraction);

    document.addEventListener("selectstart", (e) => {
      if (document.body.classList.contains("fun-no-select")) {
        e.preventDefault();
      }
    });

    document.addEventListener("dblclick", (e) => {
      if (isTextSelectableTarget(e.target)) return;
      e.preventDefault();
      clearTextSelection();
    });

    document.addEventListener("dragstart", (e) => {
      if (
        document.body.classList.contains("fun-no-select") ||
        e.target.closest(".pub-figure-zoomable, .lightbox-img, .emoji-charge-holder, .emoji-particle")
      ) {
        e.preventDefault();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (lightboxOpen) closeLightbox();
        cancelEmojiInteraction();
      }
      if (e.key === "Enter") {
        const img = document.activeElement;
        if (img && img.classList.contains("pub-figure-zoomable")) {
          openLightbox(img);
        }
      }
    });

    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (ev) => {
      reducedMotion = ev.matches;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
