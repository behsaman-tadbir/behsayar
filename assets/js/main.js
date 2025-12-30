/* behsayar - main.js
 * Static MVP (HTML/CSS/JS) — safe, readable, regression-resistant.
 * Key storage:
 *  - bs_session: { username, role, ... }
 *  - bs_users:   [{ username, password, role, fullName, avatar, credit }]
 *  - bs_cart:    [{ id, qty, ... }]
 */
(() => {
  "use strict";

  // -----------------------------
  // Tiny DOM helpers
  // -----------------------------
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);

  const createEl = (tag, attrs = {}, children = []) => {
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

  const safeJSONParse = (str, fallback) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };

  // -----------------------------
  // Storage keys
  // -----------------------------
  const KEY_SESSION = "bs_session";
  const KEY_USERS = "bs_users";
  const KEY_CART = "bs_cart";

  // -----------------------------
  // Demo users + session
  // -----------------------------
  const ensureDemoUsers = () => {
    const existing = safeJSONParse(localStorage.getItem(KEY_USERS) || "null", null);
    if (Array.isArray(existing) && existing.length) return;

    const seed = [
      {
        username: "student",
        password: "1234",
        role: "student",
        fullName: "دانش‌آموز نمونه",
        avatar: "assets/images/avatar-student.png",
        credit: 20000000,
      },
      {
        username: "teacher",
        password: "1234",
        role: "teacher",
        fullName: "معلم نمونه",
        avatar: "assets/images/avatar-teacher.png",
        credit: 20000000,
      },
      {
        username: "admin",
        password: "1234",
        role: "admin",
        fullName: "مدیر سیستم",
        avatar: "assets/images/avatar-admin.png",
        credit: 20000000,
      },
    ];

    localStorage.setItem(KEY_USERS, JSON.stringify(seed));
  };

  const loadUsers = () => safeJSONParse(localStorage.getItem(KEY_USERS) || "[]", []);
  const saveUsers = (users) => localStorage.setItem(KEY_USERS, JSON.stringify(users));

  const getSession = () => safeJSONParse(localStorage.getItem(KEY_SESSION) || "null", null);
  const setSession = (session) => localStorage.setItem(KEY_SESSION, JSON.stringify(session));
  const clearSession = () => localStorage.removeItem(KEY_SESSION);

  const getActiveUser = () => {
    const session = getSession();
    if (!session?.username) return null;
    return loadUsers().find((u) => u.username === session.username) || null;
  };

  const ensureUserCredit = (username) => {
    const users = loadUsers();
    const u = users.find((x) => x.username === username);
    if (!u) return 0;
    if (typeof u.credit !== "number") u.credit = 0;
    saveUsers(users);
    return u.credit;
  };

  const formatMoney = (n) => {
    const num = Number(n || 0);
    return num.toLocaleString("fa-IR");
  };

  // -----------------------------
  // Header: desktop dropdown (categories)
  // -----------------------------
  const initHeaderDropdown = () => {
    const toggle = qs(".nav-dropdown-toggle");
    const parent = toggle?.closest(".has-dropdown");
    const panel = parent ? qs(".dropdown-panel", parent) : null;
    if (!toggle || !parent || !panel) return;

    const close = () => {
      parent.classList.remove("is-open");
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    };

    on(toggle, "click", (e) => {
      e.stopPropagation();
      const open = parent.classList.toggle("is-open");
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    on(document, "click", close);
    on(window, "keydown", (e) => e.key === "Escape" && close());
  };

  // -----------------------------
  // Header: user menu (avatar dropdown)
  // -----------------------------
  const ensureHeaderUserMenu = () => qs("#headerUserMenu");

  const wireMobileAuthSheet = () => {
    let sheet = qs("#mobileAuthSheet");
    if (!sheet) return null;

    const open = () => {
      sheet.hidden = false;
      sheet.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("bs-modal-open");
    };

    const close = () => {
      sheet.hidden = true;
      sheet.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("bs-modal-open");
    };

    // Close handlers
    qsa("[data-sheet-close]", sheet).forEach((el) => on(el, "click", close));
    on(window, "keydown", (e) => e.key === "Escape" && close());

    // Mobile login submit
    const form = qs("#mobileLoginForm", sheet);
    if (form && form.dataset.bsBound !== "1") {
      form.dataset.bsBound = "1";
      on(form, "submit", (e) => {
        e.preventDefault();
        const u = qs("#mobileLoginUsername", sheet)?.value?.trim();
        const p = qs("#mobileLoginPassword", sheet)?.value?.trim();
        const msg = qs("#mobileLoginMsg", sheet);
        const ok = tryLogin(u, p, msg);
        if (!ok) return;
        close();
        updateAuthUI();
      });
    }

    // Logout
    const logoutBtn = qs("#mobileUserLogout", sheet);
    if (logoutBtn && logoutBtn.dataset.bsBound !== "1") {
      logoutBtn.dataset.bsBound = "1";
      on(logoutBtn, "click", () => {
        clearSession();
        close();
        updateAuthUI();
        location.href = "index.html";
      });
    }

    sheet.__open = open;
    sheet.__close = close;
    return sheet;
  };

  // -----------------------------
  // BottomNav: cart badge + auth avatar
  // -----------------------------
  const loadCart = () => safeJSONParse(localStorage.getItem(KEY_CART) || "[]", []);
  const cartQtyTotal = () => loadCart().reduce((sum, it) => sum + Number(it.qty || 0), 0);

  const updateCartBadge = () => {
    const qty = cartQtyTotal();
    const badge = qs("#cartBadge");
    if (!badge) return;
    badge.textContent = String(qty);
    badge.hidden = qty <= 0;
  };

  // -----------------------------
  // Main: Auth UI updater (Header + BottomNav)
  // -----------------------------
  const roleLabel = (role) => {
    if (role === "admin") return "مدیر سیستم";
    if (role === "teacher") return "معلم";
    return "دانش‌آموز/اولیا";
  };

  const formatCredit = (n) => {
    const v = Number(n || 0);
    try { return v.toLocaleString("fa-IR"); } catch { return String(v); }
  };

  const tryLogin = (username, password, msgEl) => {
    const msg = msgEl || null;
    const u = (username || "").trim();
    const p = (password || "").trim();
    if (!u || !p) {
      if (msg) msg.textContent = "نام کاربری و رمز عبور را وارد کنید.";
      return false;
    }
    ensureDemoUsers();
    const users = loadUsers();
    const hit = users.find((x) => x.username === u && String(x.password) === p);
    if (!hit) {
      if (msg) msg.textContent = "نام کاربری یا رمز عبور نادرست است.";
      return false;
    }
    if (msg) msg.textContent = "";
    setSession({ username: hit.username, role: hit.role || "student", ts: Date.now() });
    ensureUserCredit(hit.username);
    return true;
  };

  const updateAuthUI = () => {
    const session = getSession();
    const loggedIn = !!session?.username;
    const activeUser = loggedIn ? getActiveUser() : null;

    // -----------------------------
    // Desktop header: inline login + user menu
    // -----------------------------
    const authBtn = qs("#headerAuthBtn");
    const popover = qs("#headerAuthPopover");
    const loginForm = qs("#headerInlineLoginForm");
    const loginMsg = qs("#headerLoginMsg");
    const userMenu = ensureHeaderUserMenu();
    const userTrigger = qs("#userMenuTrigger");
    const userDropdown = qs("#userMenuDropdown");

    const closePopover = () => {
      if (!popover) return;
      popover.hidden = true;
      authBtn?.setAttribute("aria-expanded", "false");
    };

    const closeUserDropdown = () => {
      if (!userDropdown) return;
      userDropdown.hidden = true;
      userTrigger?.setAttribute("aria-expanded", "false");
    };

    if (!loggedIn) {
      if (authBtn) authBtn.hidden = false;
      if (userMenu) userMenu.hidden = true;
      closeUserDropdown();

      // Bind popover toggle once
      if (authBtn && !authBtn.dataset.bsBound) {
        authBtn.dataset.bsBound = "1";
        on(authBtn, "click", (e) => {
          e.preventDefault();
          const isOpen = popover && !popover.hidden;
          closeUserDropdown();
          if (!popover) return;
          popover.hidden = isOpen ? true : false;
          authBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
          if (!isOpen) qs("#headerLoginUsername")?.focus?.();
        });

        // click outside closes
        on(document, "click", (e) => {
          if (!popover || popover.hidden) return;
          const t = e.target;
          if (t instanceof Node && (popover.contains(t) || authBtn.contains(t))) return;
          closePopover();
        });

        on(window, "keydown", (e) => e.key === "Escape" && closePopover());
      }

      // Bind inline login submit once
      if (loginForm && loginForm.dataset.bsBound !== "1") {
        loginForm.dataset.bsBound = "1";
        on(loginForm, "submit", (e) => {
          e.preventDefault();
          const u = qs("#headerLoginUsername")?.value?.trim();
          const p = qs("#headerLoginPassword")?.value?.trim();
          const ok = tryLogin(u, p, loginMsg);
          if (!ok) return;
          closePopover();
          updateAuthUI();
        });
      }
    } else {
      closePopover();
      if (authBtn) authBtn.hidden = true;
      if (userMenu) userMenu.hidden = false;

      // Fill user menu values
      const avatar = qs("#userMenuAvatar");
      const credit = qs("#userMenuCredit");
      const name = qs("#userMenuName");
      const meta = qs("#userMenuMeta");

      if (avatar) {
        avatar.src = activeUser?.avatar || "assets/images/placeholder.svg";
        avatar.onerror = () => (avatar.src = "assets/images/placeholder.svg");
      }
      if (credit) credit.textContent = `اعتبار: ${formatCredit(activeUser?.credit || 0)}`;
      if (name) name.textContent = activeUser?.fullName || session.username;
      if (meta) meta.textContent = `سمت: ${roleLabel(session.role)}`;

      // Toggle dropdown
      if (userTrigger && userDropdown && userTrigger.dataset.bsBound !== "1") {
        userTrigger.dataset.bsBound = "1";
        on(userTrigger, "click", () => {
          const open = !userDropdown.hidden;
          userDropdown.hidden = open;
          userTrigger.setAttribute("aria-expanded", open ? "false" : "true");
        });

        on(document, "click", (e) => {
          if (userDropdown.hidden) return;
          const t = e.target;
          if (t instanceof Node && (userDropdown.contains(t) || userTrigger.contains(t))) return;
          closeUserDropdown();
        });

        on(window, "keydown", (e) => e.key === "Escape" && closeUserDropdown());
      }

      // Logout
      const logoutBtn = qs("#userMenuLogout");
      if (logoutBtn && logoutBtn.dataset.bsBound !== "1") {
        logoutBtn.dataset.bsBound = "1";
        on(logoutBtn, "click", () => {
          clearSession();
          updateAuthUI();
          location.href = "index.html";
        });
      }
    }

    // -----------------------------
    // Bottom nav: auth button
    // -----------------------------
    const bnAuthBtn = qs("#bnAuthBtn");
    const bnAuthText = qs("#bnAuthText");
    const sheet = wireMobileAuthSheet();

    if (bnAuthBtn && bnAuthText) {
      const ico = qs(".bn-ico", bnAuthBtn);

      if (!loggedIn) {
        bnAuthText.textContent = "ورود";
        if (ico) ico.textContent = "👤";
        bnAuthBtn.onclick = () => sheet?.__open?.();
      } else {
        bnAuthText.textContent = "حساب";
        if (ico) {
          const src = activeUser?.avatar || "assets/images/placeholder.svg";
          ico.innerHTML = `<img class="bn-avatar" alt="آواتار" src="${src}">`;
          const img = qs("img", ico);
          if (img) img.onerror = () => (img.src = "assets/images/placeholder.svg");
        }
        bnAuthBtn.onclick = () => sheet?.__open?.();
      }
    }

    // Fill mobile sheet (logged out vs logged in)
    if (sheet) {
      const form = qs("#mobileLoginForm", sheet);
      const actions = qs("#mobileAccountActions", sheet);
      if (!loggedIn) {
        if (form) form.hidden = false;
        if (actions) actions.hidden = true;
      } else {
        if (form) form.hidden = true;
        if (actions) actions.hidden = false;

        const credit = qs("#mobileUserCredit", sheet);
        const name = qs("#mobileUserName", sheet);
        const meta = qs("#mobileUserMeta", sheet);
        if (credit) credit.textContent = `اعتبار: ${formatCredit(activeUser?.credit || 0)}`;
        if (name) name.textContent = activeUser?.fullName || session.username;
        if (meta) meta.textContent = `سمت: ${roleLabel(session.role)}`;
      }
    }

    updateCartBadge();
  };

  // -----------------------------
  // Home slider (guarded)
  // -----------------------------
  const initHomeSlider = () => {
    const slider = qs(".hero-slider");
    if (!slider) return;
    // Keep whatever markup exists; just ensure no JS crash.
    // If your project has a slider implementation elsewhere, it can be added here later.
  };

  // -----------------------------
  // Dashboard protection (demo)
  // -----------------------------
  const protectDashboard = () => {
    const path = location.pathname.split("/").pop() || "";
    if (!path.startsWith("dashboard")) return;

    const s = getSession();
    if (!s?.username) {
      location.href = "login.html";
      return;
    }

    // role gate
    if (path === "dashboard-admin.html" && s.role !== "admin") location.href = "dashboard.html";
    if (path === "dashboard-teacher.html" && s.role !== "teacher") location.href = "dashboard.html";
  };

  // -----------------------------
  // Boot
  // -----------------------------
  const boot = () => {
    ensureDemoUsers();
    protectDashboard();

    // Important: Auth UI first (so even if other features fail, user sees correct state)
    updateAuthUI();

    // Non-critical inits (guarded)
    try { initHeaderDropdown(); } catch {}
    try { initHomeSlider(); } catch {}

    // Listen for cross-tab auth changes
    on(window, "storage", (e) => {
      if ([KEY_SESSION, KEY_USERS, KEY_CART].includes(e.key)) updateAuthUI();
    });

    // Some pages set session then redirect; on visibility change, refresh UI too
    on(document, "visibilitychange", () => {
      if (!document.hidden) updateAuthUI();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
