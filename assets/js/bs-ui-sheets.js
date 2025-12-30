/* behsayar - bs-ui-sheets.js
 * Bottom sheets (mobile) + generic popover close behaviors.
 */
(() => {
  "use strict";
  const BS = (window.BS = window.BS || {});
  const { qs, qsa, on } = BS;

  const openSheet = (sheetEl) => {
    if (!sheetEl) return;
    sheetEl.classList.add("is-open");
    sheetEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const closeSheet = (sheetEl) => {
    if (!sheetEl) return;
    sheetEl.classList.remove("is-open");
    sheetEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  const toggleSheet = (sheetEl) => {
    if (!sheetEl) return;
    sheetEl.classList.contains("is-open") ? closeSheet(sheetEl) : openSheet(sheetEl);
  };

  const bindSheetClosers = (root = document) => {
    qsa("[data-sheet-close]", root).forEach((el) => {
      on(el, "click", () => {
        const sheet = el.closest(".bottom-sheet");
        closeSheet(sheet);
      });
    });
  };

  // Close popovers/dropdowns on outside click / Escape
  const bindGlobalDismiss = () => {
    on(document, "keydown", (e) => {
      if (e.key !== "Escape") return;
      qsa("[data-dismissable-open='1']").forEach((el) => {
        el.hidden = true;
        el.dataset.dismissableOpen = "0";
      });
      qsa(".bottom-sheet.is-open").forEach((sheet) => closeSheet(sheet));
    });

    on(document, "click", (e) => {
      const t = e.target;

      // Dismiss dropdown/popover if click outside
      qsa("[data-dismissable-open='1']").forEach((el) => {
        if (el.contains(t)) return;
        el.hidden = true;
        el.dataset.dismissableOpen = "0";
      });
    });
  };

  BS.ui = BS.ui || {};
  BS.ui.sheets = {
    openSheet,
    closeSheet,
    toggleSheet,
    bindSheetClosers,
    bindGlobalDismiss,
  };
})();
