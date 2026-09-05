/* ==========================================================================
   TIGER 136 — Smooth Interactions
   Scroll reveal, active category highlight, smooth anchor offsets
   ========================================================================== */

(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     1. Scroll-Reveal (IntersectionObserver)
     ----------------------------------------------------------------------- */

  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* -----------------------------------------------------------------------
     2. Active Category Bar Highlight
     ----------------------------------------------------------------------- */

  const categoryLinks = document.querySelectorAll(".category-bar a[href^='#']");
  const sections = [];

  categoryLinks.forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    const section = document.getElementById(id);
    if (section) sections.push({ link, section });
  });

  function updateActiveLink() {
    // Account for nav (70px) + category bar (~50px)
    const scrollY = window.scrollY + 140;
    let current = null;

    sections.forEach(({ link, section }) => {
      if (section.offsetTop <= scrollY) {
        current = link;
      }
    });

    categoryLinks.forEach((l) => l.classList.remove("active"));
    if (current) current.classList.add("active");
  }

  // Debounced scroll handler for performance
  let scrollTick = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTick) {
        requestAnimationFrame(() => {
          updateActiveLink();
          scrollTick = false;
        });
        scrollTick = true;
      }
    },
    { passive: true },
  );

  // Run once on load
  updateActiveLink();

  /* -----------------------------------------------------------------------
     3. Smooth Scroll with Offset (for fixed nav + sticky bar)
     ----------------------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = 70;
      const barHeight = target.id === "top" ? 0 : 50;
      const offset = target.offsetTop - navHeight - barHeight;

      window.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
    });
  });
})();
