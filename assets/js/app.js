/* behsayar - app.js
 * Bootstraps modules. Keep this file tiny.
 */
(() => {
  "use strict";
  const BS = (window.BS = window.BS || {});
  const { ui, features, forms } = BS;

  const boot = () => {
    // Global dismiss + sheet closers
    ui?.sheets?.bindSheetClosers?.(document);
    ui?.sheets?.bindGlobalDismiss?.();

    // Header / bottom nav
    ui?.header?.bindCategoriesDropdown?.();
    ui?.header?.bindHeaderAuth?.();
    ui?.bottomnav?.bindCatsSheet?.();
    ui?.bottomnav?.bindAuthSheet?.();
    ui?.bottomnav?.syncCartBadge?.();

    // Page forms
    forms?.bindLoginPage?.();
    forms?.bindRegisterPage?.();

    // Features
    features?.slider?.initHomeSlider?.();
    features?.dashboard?.protectDashboard?.();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
