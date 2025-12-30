/* behsayar - bs-feature-dashboard.js
 * Demo dashboard protection.
 */
(() => {
  "use strict";
  const BS = (window.BS = window.BS || {});
  const { session } = BS;

  const protectDashboard = () => {
    const isDash = document.body?.classList?.contains("page-dashboard");
    if (!isDash) return;

    const sess = session.getSession();
    if (!sess?.role) {
      window.location.href = "login.html";
      return;
    }

    const role = sess.role;
    const page = document.body.dataset.role || "";
    if (page && page !== role) {
      // redirect to correct dashboard for role
      const map = { student: "dashboard.html", teacher: "dashboard-teacher.html", admin: "dashboard-admin.html" };
      window.location.href = map[role] || "dashboard.html";
    }
  };

  BS.features = BS.features || {};
  BS.features.dashboard = { protectDashboard };
})();
