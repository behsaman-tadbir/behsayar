/* bs-ui-header.js — header interactions (desktop) */
(() => {
  "use strict";

  const BS = (window.BS = window.BS || {});
  const { qs, qsa, on, onDelegate, setExpanded, formatFaNumber } = BS.core;
  const { login, logout, isLoggedIn, getCurrentUser } = BS.session;

  BS.ui = BS.ui || {};
  BS.ui.header = BS.ui.header || {};
  const api = BS.ui.header;

  const roleLabel = (role) => {
    switch (role) {
      case "student": return "دانش‌آموز / اولیا";
      case "teacher": return "معلم";
      case "admin": return "مدیر سیستم";
      default: return "کاربر";
    }
  };

  // ----- Auth popover (logged out) -----
  const bindHeaderLoginPopover = () => {
    const btn = qs("#headerLoginBtn");
    const pop = qs("#headerAuthPopover");
    const form = qs("#headerLoginForm");
    const msg = qs("#headerLoginMsg");

    if (!btn || !pop) return;

    const open = () => {
      pop.hidden = false;
      setExpanded(btn, true);
      // focus first input
      const first = qs("input", pop);
      setTimeout(() => first?.focus?.(), 0);
    };

    const close = () => {
      pop.hidden = true;
      setExpanded(btn, false);
      msg && (msg.textContent = "");
      form?.reset?.();
    };

    on(btn, "click", (e) => {
      e.preventDefault();
      pop.hidden ? open() : close();
    });

    on(document, "keydown", (e) => {
      if (e.key === "Escape" && !pop.hidden) close();
    });

    // Click outside closes
    on(document, "click", (e) => {
      if (pop.hidden) return;
      const t = e.target;
      if (pop.contains(t) || btn.contains(t)) return;
      close();
    });

    // Submit login
    on(form, "submit", (e) => {
      e.preventDefault();
      const username = qs("#headerLoginUsername")?.value || "";
      const password = qs("#headerLoginPassword")?.value || "";
      const res = login({ username, password });

      if (!res.ok) {
        if (msg) msg.textContent = res.message || "ورود ناموفق بود.";
        return;
      }

      close();
      api.syncAuthUI();
    });
  };

  // ----- User menu (logged in) -----
  const bindUserMenu = () => {
    const wrap = qs("#headerUserMenu");
    const trigger = qs("#userMenuTrigger");
    const dd = qs("#userMenuDropdown");
    const logoutBtn = qs("#userMenuLogout");

    if (!wrap || !trigger || !dd) return;

    const open = () => {
      dd.hidden = false;
      setExpanded(trigger, true);
    };
    const close = () => {
      dd.hidden = true;
      setExpanded(trigger, false);
    };
    const toggle = () => (dd.hidden ? open() : close());

    on(trigger, "click", (e) => {
      e.preventDefault();
      toggle();
    });

    // outside click
    on(document, "click", (e) => {
      const t = e.target;
      if (dd.hidden) return;
      if (wrap.contains(t)) return;
      close();
    });

    on(document, "keydown", (e) => {
      if (e.key === "Escape" && !dd.hidden) close();
    });

    on(logoutBtn, "click", () => {
      logout();
      close();
      api.syncAuthUI();
    });
  };

  // ----- Categories dropdown (desktop nav) -----
  const bindCategoriesDropdown = () => {
    const toggleBtn = qs(".nav-dropdown-toggle");
    const panel = toggleBtn?.closest(".has-dropdown")?.querySelector(".dropdown-panel");

    if (!toggleBtn || !panel) return;

    const open = () => {
      panel.hidden = false;
      setExpanded(toggleBtn, true);
    };
    const close = () => {
      panel.hidden = true;
      setExpanded(toggleBtn, false);
    };
    const toggle = () => (panel.hidden ? open() : close());

    on(toggleBtn, "click", (e) => {
      e.preventDefault();
      toggle();
    });

    on(document, "click", (e) => {
      const t = e.target;
      if (panel.hidden) return;
      if (panel.contains(t) || toggleBtn.contains(t)) return;
      close();
    });

    on(document, "keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) close();
    });
  };

  // ----- Sync UI based on session -----
  api.syncAuthUI = () => {
    const loginBtn = qs("#headerLoginBtn");
    const pop = qs("#headerAuthPopover");
    const userMenu = qs("#headerUserMenu");

    if (!loginBtn || !userMenu) return;

    const logged = isLoggedIn();
    loginBtn.hidden = logged;
    pop && (pop.hidden = true);
    userMenu.hidden = !logged;

    if (!logged) return;

    const user = getCurrentUser();
    if (!user) return;

    const avatar = qs("#userMenuAvatar");
    const credit = qs("#userMenuCredit");
    const name = qs("#userMenuName");
    const meta = qs("#userMenuMeta");

    if (avatar) avatar.src = user.avatar || "assets/images/placeholder.svg";
    if (credit) credit.textContent = formatFaNumber(user.credit) + " اعتبار";
    if (name) name.textContent = user.fullName || user.username || "—";
    if (meta) meta.textContent = roleLabel(user.role);
  };

  api.bindAll = () => {
    bindHeaderLoginPopover();
    bindUserMenu();
    bindCategoriesDropdown();
  };
})();
