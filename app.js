/* ==========================================================
   Behsayar — app.js (single file, no deps)
   - Seeds demo users (required)
   - Desktop: inline login popover + user dropdown
   - Mobile: bottom bar account button + auth sheet
   Storage:
     bs_users   -> array of demo users
     bs_session -> { username }
   ========================================================== */

(() => {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);
  const stop = (e) => { e.preventDefault(); e.stopPropagation(); };

  const storage = {
    get(key, fallback = null){
      try{
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      }catch{
        return fallback;
      }
    },
    set(key, value){
      localStorage.setItem(key, JSON.stringify(value));
    },
    del(key){
      localStorage.removeItem(key);
    }
  };

  const formatNumber = (n) => {
    const s = String(n ?? 0);
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  };

  // ---------- Demo seed (required) ----------
  const USERS_KEY = "bs_users";
  const SESSION_KEY = "bs_session";

  function seedUsers(){
    const required = [
      {
        username: "1001",
        password: "123",
        role: "student",
        position: "دانش‌آموز",
        fullName: "علی حسینی",
        nationalId: "0016598255",
        fatherName: "حسین",
        credit: 20000000,
        avatar: "images/avatars/1001.png"
      },
      {
        username: "1002",
        password: "123",
        role: "teacher",
        position: "معلم / ولی",
        fullName: "حسین حسینی",
        nationalId: "0025478844",
        fatherName: "پدر علی",
        credit: 30000000,
        avatar: "images/avatars/1002.png"
      },
      {
        username: "1003",
        password: "123",
        role: "admin",
        position: "مدیر سیستم",
        fullName: "علیرضا داداشی",
        nationalId: "0012345678",
        fatherName: "",
        credit: 0,
        avatar: "images/avatars/1003.png"
      }
    ];

    const existing = storage.get(USERS_KEY, []);
    const map = new Map(existing.map(u => [String(u.username), u]));
    let changed = false;

    for (const u of required){
      const key = String(u.username);
      if (!map.has(key)){
        map.set(key, u);
        changed = true;
      }else{
        // Ensure required fields exist (patch, but don't break future edits)
        const curr = map.get(key);
        const patched = { ...u, ...curr };
        // keep password from required unless user changed it? For demo keep required.
        patched.password = u.password;
        map.set(key, patched);
        // changed if missing critical fields
        const critical = ["role","fullName","avatar"];
        if (critical.some(k => !curr?.[k])) changed = true;
      }
    }

    if (changed){
      storage.set(USERS_KEY, Array.from(map.values()));
    }
  }

  function getUsers(){
    return storage.get(USERS_KEY, []);
  }

  function getSession(){
    return storage.get(SESSION_KEY, null);
  }

  function setSession(username){
    storage.set(SESSION_KEY, { username: String(username) });
  }

  function clearSession(){
    storage.del(SESSION_KEY);
  }

  function findUser(username){
    return getUsers().find(u => String(u.username) === String(username)) || null;
  }

  function login(username, password){
    const user = findUser(username);
    if (!user) return { ok:false, message:"کاربری با این نام کاربری پیدا نشد." };
    if (String(user.password) !== String(password)) return { ok:false, message:"رمز عبور اشتباه است." };
    setSession(user.username);
    return { ok:true, user };
  }

  // ---------- UI: open/close primitives ----------
  const ui = {
    backdrop: null,
    openCount: 0,
    showBackdrop(){
      if (!ui.backdrop) ui.backdrop = $('[data-backdrop]');
      if (!ui.backdrop) return;
      ui.backdrop.hidden = false;
      ui.backdrop.style.display = "block";
      ui.openCount++;
    },
    hideBackdrop(){
      if (!ui.backdrop) ui.backdrop = $('[data-backdrop]');
      if (!ui.backdrop) return;
      ui.openCount = Math.max(0, ui.openCount - 1);
      if (ui.openCount === 0){
        ui.backdrop.hidden = true;
        ui.backdrop.style.display = "none";
      }
    }
  };

  // ---------- Desktop: auth popover + user menu ----------
  function bindDesktopAuth(){
    const trigger = $('[data-auth-trigger]');
    const popover = $('[data-auth-popover]');
    const form = $('[data-auth-form]');
    const userChip = $('[data-user-chip]');
    const menuToggle = $('[data-user-menu-toggle]');
    const userMenu = $('[data-user-menu]');
    const logoutBtn = $('[data-logout]');

    if (!trigger || !popover) return;

    const closePopover = () => {
      if (popover.hidden) return;
      popover.hidden = true;
      ui.hideBackdrop();
    };

    const openPopover = () => {
      popover.hidden = false;
      ui.showBackdrop();
      const u = $('#username', popover);
      if (u) u.focus();
    };

    const closeUserMenu = () => {
      if (!userMenu || userMenu.hidden) return;
      userMenu.hidden = true;
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      ui.hideBackdrop();
    };

    const openUserMenu = () => {
      if (!userMenu) return;
      userMenu.hidden = false;
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
      ui.showBackdrop();
    };

    on(trigger, "click", (e) => {
      e.preventDefault();
      if (!popover.hidden) closePopover();
      else openPopover();
      closeUserMenu();
    });

    on(form, "submit", (e) => {
      e.preventDefault();
      const username = $('#username')?.value?.trim();
      const password = $('#password')?.value ?? "";
      const res = login(username, password);
      if (!res.ok){
        toast(res.message);
        return;
      }
      closePopover();
      syncUI();
    });

    on(menuToggle, "click", (e) => {
      e.preventDefault();
      closePopover();
      if (userMenu.hidden) openUserMenu();
      else closeUserMenu();
    });

    on(logoutBtn, "click", (e) => {
      e.preventDefault();
      clearSession();
      closeUserMenu();
      syncUI();
      toast("خارج شدید.");
    });

    // click outside / backdrop
    on(document, "click", (e) => {
      const t = e.target;
      if (!t) return;

      // If clicking inside popover or on trigger, do nothing
      if (!popover.hidden && (popover.contains(t) || trigger.contains(t))) return;
      closePopover();

      if (userMenu && !userMenu.hidden && (userMenu.contains(t) || userChip?.contains(t))) return;
      closeUserMenu();
    });

    on(document, "keydown", (e) => {
      if (e.key !== "Escape") return;
      closePopover();
      closeUserMenu();
      closeMobileSheet();
    });
  }

  // ---------- Mobile: bottom bar + auth sheet ----------
  let mobileSheet = null;

  function openMobileSheet(){
    if (!mobileSheet) mobileSheet = $('[data-mobile-auth-sheet]');
    if (!mobileSheet) return;
    mobileSheet.hidden = false;
    mobileSheet.style.display = "block";
    ui.showBackdrop();
  }

  function closeMobileSheet(){
    if (!mobileSheet) mobileSheet = $('[data-mobile-auth-sheet]');
    if (!mobileSheet || mobileSheet.hidden) return;
    mobileSheet.hidden = true;
    mobileSheet.style.display = "none";
    ui.hideBackdrop();
  }

  function bindMobileAuth(){
    const btn = $('[data-mobile-auth-trigger]');
    const sheetClose = $('[data-sheet-close]');
    const mobileForm = $('[data-mobile-auth-form]');
    const mobileLogout = $('[data-mobile-logout]');

    if (!btn) return;

    on(btn, "click", (e) => {
      e.preventDefault();
      openMobileSheet();
    });

    on(sheetClose, "click", (e) => {
      e.preventDefault();
      closeMobileSheet();
    });

    on(mobileForm, "submit", (e) => {
      e.preventDefault();
      const username = $('#m-username')?.value?.trim();
      const password = $('#m-password')?.value ?? "";
      const res = login(username, password);
      if (!res.ok){
        toast(res.message);
        return;
      }
      closeMobileSheet();
      syncUI();
    });

    on(mobileLogout, "click", (e) => {
      e.preventDefault();
      clearSession();
      syncUI();
      closeMobileSheet();
      toast("خارج شدید.");
    });

    // backdrop click closes
    on(ui.backdrop || $('[data-backdrop]'), "click", () => {
      // close everything
      closeMobileSheet();
      // desktop menus are handled via document click
    });
  }

  // ---------- UI sync ----------
  function syncUI(){
    const session = getSession();
    const user = session ? findUser(session.username) : null;

    // Desktop guest vs user
    const authTrigger = $('[data-auth-trigger]');
    const userChip = $('[data-user-chip]');
    const avatarEl = $('[data-user-avatar]');
    const creditEl = $('[data-user-credit]');
    const nameEl = $('[data-user-name]');
    const roleEl = $('[data-user-role]');

    if (user){
      if (authTrigger) authTrigger.hidden = true;
      if (userChip) userChip.hidden = false;
      if (avatarEl){
        avatarEl.src = user.avatar;
        avatarEl.alt = `آواتار ${user.fullName}`;
      }
      if (creditEl) creditEl.textContent = `${formatNumber(user.credit)} تومان`;
      if (nameEl) nameEl.textContent = user.fullName;
      if (roleEl) roleEl.textContent = user.position || user.role;
    }else{
      if (authTrigger) authTrigger.hidden = false;
      if (userChip) userChip.hidden = true;
    }

    // Mobile bottom bar
    const mobileAvatar = $('[data-mobile-avatar]');
    const mobileIcon = $('[data-mobile-auth-icon]');
    const mobileLabel = $('[data-mobile-auth-label]');

    if (user){
      if (mobileAvatar){
        mobileAvatar.hidden = false;
        mobileAvatar.src = user.avatar;
        mobileAvatar.alt = `آواتار ${user.fullName}`;
      }
      if (mobileIcon) mobileIcon.style.display = "none";
      if (mobileLabel) mobileLabel.textContent = "حساب";
    }else{
      if (mobileAvatar) mobileAvatar.hidden = true;
      if (mobileIcon) mobileIcon.style.display = "inline";
      if (mobileLabel) mobileLabel.textContent = "ورود";
    }

    // Mobile sheet content
    const mobileGuest = $('[data-mobile-guest]');
    const mobileUser = $('[data-mobile-user]');
    const mUA = $('[data-mobile-user-avatar]');
    const mUN = $('[data-mobile-user-name]');
    const mUR = $('[data-mobile-user-role]');
    const mUC = $('[data-mobile-user-credit]');

    if (user){
      if (mobileGuest) mobileGuest.hidden = true;
      if (mobileUser) mobileUser.hidden = false;
      if (mUA){ mUA.src = user.avatar; mUA.alt = `آواتار ${user.fullName}`; }
      if (mUN) mUN.textContent = user.fullName;
      if (mUR) mUR.textContent = user.position || user.role;
      if (mUC) mUC.textContent = `${formatNumber(user.credit)} تومان`;
    }else{
      if (mobileGuest) mobileGuest.hidden = false;
      if (mobileUser) mobileUser.hidden = true;
    }
  }

  // ---------- Tiny toast ----------
  let toastTimer = null;
  function toast(message){
    // Minimal and self-contained; avoid extra DOM until needed
    let el = $('#toast');
    if (!el){
      el = document.createElement("div");
      el.id = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.style.position = "fixed";
      el.style.insetInline = "12px";
      el.style.bottom = "calc(90px + env(safe-area-inset-bottom))";
      el.style.zIndex = "9999";
      el.style.padding = "12px 14px";
      el.style.borderRadius = "16px";
      el.style.border = "1px solid rgba(15,23,42,.12)";
      el.style.background = "rgba(255,255,255,.92)";
      el.style.boxShadow = "0 18px 48px rgba(15,23,42,.14)";
      el.style.color = "rgba(15,23,42,.88)";
      el.style.display = "none";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.style.display = "none";
    }, 2600);
  }

  // ---------- Boot ----------
  function boot(){
    seedUsers();
    // ensure backdrop ref for mobile binding
    ui.backdrop = $('[data-backdrop]');

    bindDesktopAuth();
    bindMobileAuth();
    syncUI();
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  }else{
    boot();
  }
})();
