/* bs-feature-dashboard.js — lightweight route protection for dashboard pages */
(() => {
  "use strict";

  const BS = (window.BS = window.BS || {});
  const { qs } = BS.core;
  const { isLoggedIn, getCurrentUser } = BS.session;

  BS.features = BS.features || {};
  BS.features.dashboard = BS.features.dashboard || {};

  const protectDashboard = () => {
    // Detect dashboard pages by body class or presence of dashboard root
    const isDashboard = document.body.classList.contains("page-dashboard") || !!qs("[data-dashboard]");
    if (!isDashboard) return;

    if (!isLoggedIn()) {
      window.location.href = "login.html";
      return;
    }

    // Optionally enforce role-based access later (demo)
    const user = getCurrentUser();
    if (!user) window.location.href = "login.html";
  };

  BS.features.dashboard.protectDashboard = protectDashboard;
})();
