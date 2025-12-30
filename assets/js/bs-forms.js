/* behsayar - bs-forms.js
 * Login/Register page forms (full pages).
 */
(() => {
  "use strict";
  const BS = (window.BS = window.BS || {});
  const { qs, on } = BS;
  const { session } = BS;

  const redirectDashboard = () => {
    const role = session.getSession()?.role;
    const map = { student: "dashboard.html", teacher: "dashboard-teacher.html", admin: "dashboard-admin.html" };
    window.location.href = map[role] || "dashboard.html";
  };

  const bindLoginPage = () => {
    const form = qs("#loginForm");
    if (!form || form.dataset.bsBound === "1") return;
    form.dataset.bsBound = "1";

    const msg = qs("#loginMsg");
    on(form, "submit", (e) => {
      e.preventDefault();
      const u = qs("#loginUsername")?.value?.trim();
      const p = qs("#loginPassword")?.value?.trim();
      const res = session.login(u, p);
      if (!res.ok) {
        if (msg) msg.textContent = res.error;
        return;
      }
      if (msg) msg.textContent = "ورود موفق بود.";
      redirectDashboard();
    });
  };

  const bindRegisterPage = () => {
    const form = qs("#registerForm");
    if (!form || form.dataset.bsBound === "1") return;
    form.dataset.bsBound = "1";

    const msg = qs("#registerMsg");

    on(form, "submit", (e) => {
      e.preventDefault();
      const u = qs("#regUsername")?.value?.trim();
      const p = qs("#regPassword")?.value?.trim();
      const role = qs("#regRole")?.value?.trim() || "student";
      const fullName = `کاربر ${u || ""}`.trim();

      const res = session.register({ username: u, password: p, role, fullName });
      if (!res.ok) {
        if (msg) msg.textContent = res.error;
        return;
      }
      if (msg) msg.textContent = "ثبت‌نام انجام شد.";
      redirectDashboard();
    });
  };

  BS.forms = { bindLoginPage, bindRegisterPage };
})();
