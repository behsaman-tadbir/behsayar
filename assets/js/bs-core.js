/* behsayar - bs-core.js
 * Tiny utilities + global namespace.
 * No deps. Safe for static hosting.
 */
(() => {
  "use strict";
  const BS = (window.BS = window.BS || {});

  // DOM helpers
  BS.qs = (sel, root = document) => root.querySelector(sel);
  BS.qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  BS.on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);

  BS.createEl = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      if (k === "class") el.className = v;
      else if (k === "dataset") Object.entries(v).forEach(([dk, dv]) => (el.dataset[dk] = dv));
      else if (k in el) el[k] = v;
      else el.setAttribute(k, String(v));
    });
    children.forEach((c) => el.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return el;
  };

  BS.safeJSONParse = (str, fallback) => {
    try { return JSON.parse(str); } catch { return fallback; }
  };

  // Storage helpers (namespaced)
  BS.store = {
    get(key, fallback = null) {
      return BS.safeJSONParse(localStorage.getItem(key), fallback);
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    del(key) {
      localStorage.removeItem(key);
    },
  };

  // Simple event bus (optional)
  BS.events = {
    on(name, fn) {
      document.addEventListener(name, fn);
    },
    emit(name, detail) {
      document.dispatchEvent(new CustomEvent(name, { detail }));
    },
  };
})();
