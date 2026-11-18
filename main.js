/* ==========================================================================
   MesC's Clients — interactions
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------- blossom fall */
  const petalField = $("[data-petals]");
  if (petalField && !reduce) {
    const frag = document.createDocumentFragment();
    const count = window.matchMedia("(max-width: 640px)").matches ? 11 : 20;
    for (let i = 0; i < count; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.setProperty("--x", `${Math.random() * 100}%`);
      petal.style.setProperty("--s", `${(5 + Math.random() * 8).toFixed(1)}px`);
      petal.style.setProperty("--dur", `${(14 + Math.random() * 12).toFixed(1)}s`);
      petal.style.setProperty("--delay", `${(-Math.random() * 22).toFixed(1)}s`);
      petal.style.setProperty("--sway", `${(18 + Math.random() * 70).toFixed(0)}px`);
      frag.appendChild(petal);
    }
    petalField.appendChild(frag);
  }

  /* ------------------------------------------------------------- footer year */
  const year = $("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------- toast */
  const toastEl = $("[data-toast]");
  let toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 2800);
  }

  /* ---------------------------------------------------------------- sticky nav */
  const nav = $("#nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-stuck", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --------------------------------------------------------------- mobile nav */
  const burger = $("#burger");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    $$("#navLinks a").forEach((link) =>
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target)) return;
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  }

  /* ---------------------------------------------------------- active nav link */
  const navLinks = $$("#navLinks a");
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? { link, el: $(id) } : null;
    })
    .filter((item) => item && item.el);

  if (sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((l) => l.classList.remove("is-active"));
          const match = sections.find((s) => s.el === entry.target);
          if (match) match.link.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s.el));
  }

  /* ---------------------------------------------------------- active rail link */
  const railLinks = $$("[data-rail] a");
  const railSections = railLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? { link, el: $(id) } : null;
    })
    .filter((item) => item && item.el);

  if (railSections.length && "IntersectionObserver" in window) {
    const railObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          railLinks.forEach((l) => l.classList.remove("is-active"));
          const match = railSections.find((s) => s.el === entry.target);
          if (match) match.link.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    railSections.forEach((s) => railObserver.observe(s.el));
  }

  /* ----------------------------------------------------------- scroll reveals */
  const revealEls = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------------- counters */
  const counters = $$("[data-count]");
  const formatNumber = (n) => n.toLocaleString("fr-FR");

  function runCounter(el) {
    const target = Number(el.dataset.count) || 0;
    if (reduce) {
      el.textContent = formatNumber(target);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNumber(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      const countObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => countObserver.observe(el));
    }
  }

  /* ----------------------------------------------------------------- filters */
  const filterBar = $("[data-filters]");
  const clientList = $("[data-clients]");

  if (filterBar && clientList) {
    const cards = $$(".client", clientList);
    const filterButtons = $$(".filter", filterBar);

    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (!btn) return;

      filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      const value = btn.dataset.filter;

      cards.forEach((card) => {
        const cats = (card.dataset.cat || "").split(/\s+/);
        const show = value === "all" || cats.includes(value);

        if (show) {
          card.classList.remove("is-hidden");
          card.classList.remove("is-in");
          // let the browser paint the hidden→shown state before animating in
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add("is-in"));
          });
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  }

  /* ------------------------------------------------------- client "Voir" cards */
  $$('.client__btns a[href="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const name = link.closest(".client")?.querySelector("h3")?.textContent?.trim().split(/\s+/)[0] || "Ce client";
      toast(`${name} — la fiche complète arrive très bientôt. Passe par le Discord en attendant.`);
    });
  });

  /* ------------------------------------------------------------ hub tilt (3D) */
  const tiltEl = $("[data-tilt]");
  if (tiltEl && !reduce) {
    const max = Number(tiltEl.dataset.tiltMax) || 6;
    let raf = null;

    const apply = (rx, ry) => {
      tiltEl.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      tiltEl.style.animationPlayState = rx || ry ? "paused" : "running";
    };

    tiltEl.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const rect = tiltEl.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(-py * max, px * max));
    });

    tiltEl.addEventListener("pointerleave", () => {
      if (raf) cancelAnimationFrame(raf);
      apply(0, 0);
    });
  }

  /* ---------------------------------------------------------------- hub tabs */
  const hubTabs = $$(".hub__tabs [data-tab]");
  const hubRows = $$("#hubRows .hrow");
  hubTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      hubTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      const cat = tab.dataset.tab;
      hubRows.forEach((row) => {
        row.hidden = cat !== "all" && row.dataset.cat !== cat;
      });
    });
  });

  /* ------------------------------------------------------------- hub switches */
  $$(".switch").forEach((sw) => {
    sw.addEventListener("click", () => {
      const on = sw.classList.toggle("is-on");
      sw.setAttribute("aria-pressed", String(on));
    });
  });

  /* ------------------------------------------------- excess light: cursor spot */
  const spot = $("[data-spot]");
  if (spot && !reduce && window.matchMedia("(pointer: fine)").matches) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let sx = x;
    let sy = y;
    let raf = null;

    const loop = () => {
      sx += (x - sx) * 0.12;
      sy += (y - sy) * 0.12;
      spot.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      if (Math.abs(x - sx) > 0.5 || Math.abs(y - sy) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType === "touch") return;
        x = e.clientX;
        y = e.clientY;
        document.body.classList.add("has-pointer");
        if (!raf) raf = requestAnimationFrame(loop);
      },
      { passive: true }
    );
  }

  /* -------------------------------------------------------------------- faq */
  const faqItems = $$(".faq__item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ------------------------------------------------------------ keyboard nudge */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !nav) return;
    if (nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      burger?.setAttribute("aria-expanded", "false");
      burger?.focus();
    }
  });
})();
