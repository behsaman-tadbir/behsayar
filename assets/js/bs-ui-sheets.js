/* bs-ui-sheets.js — bottom sheet / popover helpers */
(() => {
  "use strict";

  const BS = (window.BS = window.BS || {});
  const { qs, qsa, on, onDelegate, setExpanded, focusFirst } = BS.core;

  BS.ui = BS.ui || {};
  BS.ui.sheets = BS.ui.sheets || {};
  const api = BS.ui.sheets;

  const OPEN_CLASS = "is-open";

  api.open = (sheet) => {
    if (!sheet) return;
    sheet.classList.add(OPEN_CLASS);
    sheet.setAttribute("aria-hidden", "false");
    // focus into the panel for accessibility
    const panel = qs(".sheet-panel", sheet) || sheet;
    setTimeout(() => focusFirst(panel), 0);
  };

  api.close = (sheet) => {
    if (!sheet) return;
    sheet.classList.remove(OPEN_CLASS);
    sheet.setAttribute("aria-hidden", "true");
  };

  api.toggle = (sheet) => {
    if (!sheet) return;
    sheet.classList.contains(OPEN_CLASS) ? api.close(sheet) : api.open(sheet);
  };

  api.bindSheetClosers = (root = document) => {
    // Close buttons and backdrop clicks
    onDelegate(root, "click", "[data-sheet-close]", (e, target) => {
      const sheet = target.closest(".bottom-sheet");
      api.close(sheet);
    });

    // Escape closes the topmost open sheet
    on(document, "keydown", (e) => {
      if (e.key !== "Escape") return;
      const openSheets = qsa(".bottom-sheet.is-open");
      if (!openSheets.length) return;
      api.close(openSheets[openSheets.length - 1]);
    });
  };

  api.bindDisclosure = ({ trigger, sheet, expanded = false }) => {
    if (!trigger || !sheet) return;
    setExpanded(trigger, expanded);
    on(trigger, "click", () => {
      const willOpen = !sheet.classList.contains(OPEN_CLASS);
      api.toggle(sheet);
      setExpanded(trigger, willOpen);
    });
  };
})();
