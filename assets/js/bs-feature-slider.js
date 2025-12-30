/* bs-feature-slider.js — home hero slider (guarded) */
(() => {
  "use strict";

  const BS = (window.BS = window.BS || {});
  const { qs, qsa, on } = BS.core;

  BS.features = BS.features || {};
  BS.features.slider = BS.features.slider || {};

  const initHomeSlider = () => {
    const root = qs("[data-home-slider]");
    if (!root) return;

    const slides = qsa(".hero-slide", root);
    if (slides.length <= 1) return;

    let idx = 0;

    const show = (i) => {
      slides.forEach((s, n) => s.classList.toggle("is-active", n === i));
    };

    const next = () => {
      idx = (idx + 1) % slides.length;
      show(idx);
    };

    const prevBtn = qs("[data-slide-prev]", root);
    const nextBtn = qs("[data-slide-next]", root);

    on(prevBtn, "click", (e) => { e.preventDefault(); idx = (idx - 1 + slides.length) % slides.length; show(idx); });
    on(nextBtn, "click", (e) => { e.preventDefault(); next(); });

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!prefersReduced) {
      setInterval(next, 4500);
    }
    show(idx);
  };

  BS.features.slider.initHomeSlider = initHomeSlider;
})();
