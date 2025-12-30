/* bs-core.js — tiny utilities used across the site (no dependencies) */
(() => {
  "use strict";

  const BS = (window.BS = window.BS || {});
  BS.core = BS.core || {};

  const core = BS.core;

  core.qs = (sel, root = document) => root.querySelector(sel);
  core.qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  core.on = (el, evt, handler, opts) => el && el.addEventListener(evt, handler, opts);
  core.off = (el, evt, handler, opts) => el && el.removeEventListener(evt, handler, opts);

  // Event delegation: on(document, 'click', '.btn', (e, target)=>{})
  core.onDelegate = (root, evt, selector, handler, opts) => {
    if (!root) return;
    root.addEventListener(
      evt,
      (e) => {
        const target = e.target?.closest?.(selector);
        if (target && root.contains(target)) handler(e, target);
      },
      opts
    );
  };

  core.ready = (fn) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  };

  core.safeJsonParse = (str, fallback) => {
    try { return JSON.parse(str); } catch { return fallback; }
  };

  core.formatFaNumber = (value) => {
    // keep it minimal; if Intl is missing, fall back
    try { return new Intl.NumberFormat("fa-IR").format(Number(value || 0)); }
    catch { return String(value || 0); }
  };

  core.isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  core.setExpanded = (btn, isExpanded) => {
    if (!btn) return;
    btn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  };

  core.focusFirst = (container) => {
    if (!container) return;
    const focusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus?.();
  };
})();
