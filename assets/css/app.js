/* app.js — bootstrap (keep tiny, no product logic here) */
(() => {
  "use strict";

  const BS = (window.BS = window.BS || {});
  const { ready } = BS.core;

  const boot = () => {
    BS.session.ensureSeedData();

    // Base UI helpers
    BS.ui?.sheets?.bindSheetClosers?.(document);

    // Bind interactions
    BS.ui?.header?.bindAll?.();
    BS.ui?.bottomnav?.bindAll?.();
    BS.forms?.bindAll?.();

    // Initial UI sync
    BS.ui?.header?.syncAuthUI?.();
    BS.ui?.bottomnav?.sync?.();

    // Features (guarded)
    BS.features?.dashboard?.protectDashboard?.();
    BS.features?.slider?.initHomeSlider?.();

    // Sync across tabs
    window.addEventListener("storage", (e) => {
      if (e.key === "bs_session" || e.key === "bs_cart" || e.key === "bs_users") {
        BS.ui?.header?.syncAuthUI?.();
        BS.ui?.bottomnav?.sync?.();
      }
    });
  };

  ready(boot);
})();
