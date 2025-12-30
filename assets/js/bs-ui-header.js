/* behsayar - bs-ui-header.js
 * Desktop header: categories dropdown, inline login popover, user menu dropdown.
 */
(() => {
  "use strict";
  const BS = (window.BS = window.BS || {});
  const { qs, qsa, on } = BS;
  const { session } = BS;

  const bindCategoriesDropdown = () => {
    const btn = qs(".nav-dropdown-toggle");
    const panel = qs(".dropdown-panel");
    if (!btn || !panel) return;

    const setOpen = (open) => {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      panel.dataset.dismissableOpen = open ? "1" : "0";
    };

    // mark dismissable
    panel.dataset.dismissableOpen = "0";

    on(btn, "click", (e) => {
      e.preventDefault();
      setOpen(panel.hidden);
    });

    qsa("a", panel).forEach((a) => on(a, "click", () => setOpen(false)));
  };

  const bindHeaderAuth = () => {
    const authBtn = qs("#headerAuthBtn");
    const pop = qs("#headerAuthPopover");
    const form = qs("#headerInlineLoginForm");
    const msg = qs("#headerLoginMsg");

    const userMenu = qs("#headerUserMenu");
    const trig = qs("#userMenuTrigger");
    const dd = qs("#userMenuDropdown");
    const avatarImg = qs("#userMenuAvatar");

    const creditEl = qs("#userMenuCredit");
    const nameEl = qs("#userMenuName");
    const metaEl = qs("#userMenuMeta");
    const logoutBtn = qs("#userMenuLogout");

    const setPopoverOpen = (open) => {
      if (!pop) return;
      pop.hidden = !open;
      pop.dataset.dismissableOpen = open ? "1" : "0";
      if (authBtn) authBtn.setAttribute("aria-expanded", open ? "true" : "false");
    };

    const setUserMenuOpen = (open) => {
      if (!dd) return;
      dd.hidden = !open;
      dd.dataset.dismissableOpen = open ? "1" : "0";
      if (trig) trig.setAttribute("aria-expanded", open ? "true" : "false");
    };

    // Toggle inline login popover
    on(authBtn, "click", (e) => {
      e.preventDefault();
      if (!pop) return;
      setPopoverOpen(pop.hidden);
    });

    // Toggle user dropdown
    on(trig, "click", (e) => {
      e.preventDefault();
      if (!dd) return;
      setUserMenuOpen(dd.hidden);
    });

    // Inline login submit
    if (form && form.dataset.bsBound !== "1") {
      form.dataset.bsBound = "1";
      on(form, "submit", (e) => {
        e.preventDefault();
        const u = qs("#headerLoginUsername")?.value?.trim();
        const p = qs("#headerLoginPassword")?.value?.trim();
        const res = session.login(u, p);
        if (!res.ok) {
          if (msg) msg.textContent = res.error;
          return;
        }
        if (msg) msg.textContent = "";
        setPopoverOpen(false);
      });
    }

    // Logout
    on(logoutBtn, "click", (e) => {
      e.preventDefault();
      session.clearSession();
      setUserMenuOpen(false);
    });

    const sync = () => {
      const user = session.getCurrentUser();
      const loggedIn = !!user;

      if (authBtn) authBtn.hidden = loggedIn;
      if (pop) setPopoverOpen(false);
      if (userMenu) userMenu.hidden = !loggedIn;

      if (!loggedIn) return;

      if (avatarImg) avatarImg.src = user.avatar || "assets/images/placeholder.svg";
      if (creditEl) creditEl.textContent = "اعتبار: " + session.formatIRR(user.credit) + " ریال";
      if (nameEl) nameEl.textContent = user.fullName || "";
      if (metaEl) metaEl.textContent = user.title || "";
    };

    BS.events.on("bs:session", sync);
    sync();
  };

  BS.ui = BS.ui || {};
  BS.ui.header = { bindCategoriesDropdown, bindHeaderAuth };
})();
