/* bs-ui-bottomnav.js — mobile bottom navigation + mobile auth sheet */
(() => {
  "use strict";

  const BS = (window.BS = window.BS || {});
  const { qs, qsa, on, onDelegate, formatFaNumber } = BS.core;
  const { login, logout, isLoggedIn, getCurrentUser, getCartCount } = BS.session;
  const sheets = BS.ui?.sheets;

  BS.ui = BS.ui || {};
  BS.ui.bottomnav = BS.ui.bottomnav || {};
  const api = BS.ui.bottomnav;

  const roleLabel = (role) => {
    switch (role) {
      case "student": return "دانش‌آموز / اولیا";
      case "teacher": return "معلم";
      case "admin": return "مدیر سیستم";
      default: return "کاربر";
    }
  };

  const syncCartBadge = () => {
    const badge = qs("#bnCartBadge");
    if (!badge) return;
    const count = getCartCount();
    if (count > 0) {
      badge.hidden = false;
      badge.textContent = String(count);
    } else {
      badge.hidden = true;
      badge.textContent = "0";
    }
  };

  const syncBottomAuth = () => {
    const btn = qs("#bnAuthBtn");
    const txt = qs("#bnAuthText");
    if (!btn || !txt) return;

    const ico = btn.querySelector(".bn-ico");
    const logged = isLoggedIn();

    if (!logged) {
      txt.textContent = "ورود";
      if (ico) {
        ico.innerHTML = "👤";
      }
      return;
    }

    const user = getCurrentUser();
    txt.textContent = "حساب";
    if (ico) {
      const src = user?.avatar || "assets/images/placeholder.svg";
      ico.innerHTML = `<img class="bn-avatar" src="${src}" alt="آواتار">`;
    }
  };

  const syncMobileSheetUser = () => {
    const loggedOutForm = qs("#mobileLoginForm");
    const loggedInBox = qs("#mobileUserBox");

    if (!loggedOutForm || !loggedInBox) return;

    const logged = isLoggedIn();
    loggedOutForm.hidden = logged;
    loggedInBox.hidden = !logged;

    if (!logged) return;

    const user = getCurrentUser();
    if (!user) return;

    const credit = qs("#mobileUserCredit");
    const name = qs("#mobileUserName");
    const meta = qs("#mobileUserMeta");

    if (credit) credit.textContent = "اعتبار: " + formatFaNumber(user.credit);
    if (name) name.textContent = user.fullName || user.username || "—";
    if (meta) meta.textContent = roleLabel(user.role);
  };

  const bindCatsSheet = () => {
    const btn = qs("#bnCatsBtn");
    const sheet = qs("#mobileCatsSheet");
    if (!btn || !sheet || !sheets) return;
    on(btn, "click", () => sheets.open(sheet));
  };

  const bindAuthSheet = () => {
    const btn = qs("#bnAuthBtn");
    const sheet = qs("#mobileAuthSheet");
    if (!btn || !sheet || !sheets) return;

    on(btn, "click", () => {
      sheets.open(sheet);
      // keep sync every time it opens
      syncMobileSheetUser();
    });

    // Login submit inside sheet
    const form = qs("#mobileLoginForm");
    const msg = qs("#mobileLoginMsg");
    on(form, "submit", (e) => {
      e.preventDefault();
      const username = qs("#mobileLoginUsername")?.value || "";
      const password = qs("#mobileLoginPassword")?.value || "";
      const res = login({ username, password });

      if (!res.ok) {
        if (msg) msg.textContent = res.message || "ورود ناموفق بود.";
        return;
      }
      if (msg) msg.textContent = "";
      form.reset();
      syncBottomAuth();
      syncMobileSheetUser();
      // Keep the sheet open to show account menu immediately (better UX)
    });

    const logoutBtn = qs("#mobileUserLogout");
    on(logoutBtn, "click", () => {
      logout();
      syncBottomAuth();
      syncMobileSheetUser();
    });
  };

  api.sync = () => {
    syncCartBadge();
    syncBottomAuth();
    syncMobileSheetUser();
  };

  api.bindAll = () => {
    bindCatsSheet();
    bindAuthSheet();
    syncCartBadge();
    syncBottomAuth();
  };
})();
