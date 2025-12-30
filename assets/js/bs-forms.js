/* bs-forms.js — dedicated auth pages (login/register) */
(() => {
  "use strict";

  const BS = (window.BS = window.BS || {});
  const { qs, on } = BS.core;
  const { login, register } = BS.session;

  BS.forms = BS.forms || {};
  const api = BS.forms;

  const bindLoginPage = () => {
    const form = qs("#loginForm");
    if (!form) return;

    const msg = qs("#loginMsg");
    on(form, "submit", (e) => {
      e.preventDefault();
      const username = qs("#loginUsername")?.value || "";
      const password = qs("#loginPassword")?.value || "";
      const res = login({ username, password });
      if (!res.ok) {
        msg && (msg.textContent = res.message || "ورود ناموفق بود.");
        return;
      }
      msg && (msg.textContent = "ورود موفق. در حال انتقال…");
      // Keep it simple: return to home
      setTimeout(() => (window.location.href = "index.html"), 300);
    });
  };

  const bindRegisterPage = () => {
    const form = qs("#registerForm");
    if (!form) return;

    const msg = qs("#registerMsg");
    on(form, "submit", (e) => {
      e.preventDefault();
      const username = qs("#regUsername")?.value || "";
      const password = qs("#regPassword")?.value || "";
      const phone = qs("#regPhone")?.value || "";
      const nationalId = qs("#regNationalId")?.value || "";
      const role = qs("#regRole")?.value || "";
      const fullName = qs("#regFullName")?.value || username;

      const res = register({ username, password, role, fullName, phone, nationalId });
      if (!res.ok) {
        msg && (msg.textContent = res.message || "ثبت‌نام ناموفق بود.");
        return;
      }
      msg && (msg.textContent = "ثبت‌نام موفق. در حال انتقال…");
      setTimeout(() => (window.location.href = "index.html"), 300);
    });
  };

  api.bindAll = () => {
    bindLoginPage();
    bindRegisterPage();
  };
})();
