/* behsayar - bs-ui-bottomnav.js
 * Bottom nav: categories sheet + auth sheet + cart badge + avatar label.
 */
(() => {
  "use strict";
  const BS = (window.BS = window.BS || {});
  const { qs, on } = BS;
  const { session } = BS;
  const sheets = BS.ui?.sheets;

  const bindCatsSheet = () => {
    const btn = qs("#bnCatsBtn");
    const sheet = qs("#mobileCatsSheet");
    if (!btn || !sheet || !sheets) return;
    on(btn, "click", () => sheets.toggleSheet(sheet));
  };

  const bindAuthSheet = () => {
    const btn = qs("#bnAuthBtn");
    const sheet = qs("#mobileAuthSheet");
    if (!btn || !sheet || !sheets) return;

    const loginForm = qs("#mobileLoginForm", sheet);
    const loginMsg = qs("#mobileLoginMsg", sheet);

    const loggedOutView = loginForm; // form itself
    const loggedInView = qs("#mobileAccountActions", sheet);

    const creditEl = qs("#mobileUserCredit", sheet);
    const nameEl = qs("#mobileUserName", sheet);
    const metaEl = qs("#mobileUserMeta", sheet);
    const logoutBtn = qs("#mobileUserLogout", sheet);

    const iconSpan = qs(".bn-ico", btn);
    const txtSpan = qs("#bnAuthText", btn);

    const showLoggedOut = () => {
      if (loggedOutView) loggedOutView.hidden = false;
      if (loggedInView) loggedInView.hidden = true;
      if (btn) btn.setAttribute("aria-label", "ورود");
    };

    const showLoggedIn = () => {
      if (loggedOutView) loggedOutView.hidden = true;
      if (loggedInView) loggedInView.hidden = false;
      if (btn) btn.setAttribute("aria-label", "حساب");
    };

    const sync = () => {
      const user = session.getCurrentUser();

      if (!user) {
        if (txtSpan) txtSpan.textContent = "ورود";
        if (iconSpan) iconSpan.textContent = "👤";
        return;
      }

      if (txtSpan) txtSpan.textContent = "حساب";
      if (iconSpan) {
        iconSpan.innerHTML = `<img class="bn-avatar" alt="آواتار" src="${user.avatar || "assets/images/placeholder.svg"}">`;
      }

      if (creditEl) creditEl.textContent = "اعتبار: " + session.formatIRR(user.credit) + " ریال";
      if (nameEl) nameEl.textContent = user.fullName || "";
      if (metaEl) metaEl.textContent = user.title || "";
    };

    on(btn, "click", () => {
      sheets.openSheet(sheet);
      const user = session.getCurrentUser();
      user ? showLoggedIn() : showLoggedOut();
      sync();
    });

    if (loginForm && loginForm.dataset.bsBound !== "1") {
      loginForm.dataset.bsBound = "1";
      on(loginForm, "submit", (e) => {
        e.preventDefault();
        const u = qs("#mobileLoginUsername")?.value?.trim();
        const p = qs("#mobileLoginPassword")?.value?.trim();
        const res = session.login(u, p);
        if (!res.ok) {
          if (loginMsg) loginMsg.textContent = res.error;
          return;
        }
        if (loginMsg) loginMsg.textContent = "";
        showLoggedIn();
        sync();
      });
    }

    on(logoutBtn, "click", (e) => {
      e.preventDefault();
      session.clearSession();
      showLoggedOut();
      sync();
    });

    BS.events.on("bs:session", sync);
    sync();
  };

  const syncCartBadge = () => {
    const badge = qs("#bnCartBadge");
    if (!badge) return;
    const n = session.getCartCount();
    badge.textContent = String(n);
    badge.hidden = n <= 0;
  };

  BS.events.on("bs:session", syncCartBadge);

  BS.ui = BS.ui || {};
  BS.ui.bottomnav = { bindCatsSheet, bindAuthSheet, syncCartBadge };
})();
