/* behsayar - bs-session.js
 * Demo auth/session/cart helpers.
 * Keys:
 *  - bs_session: { username, role, ts }
 *  - bs_users:   [{ username, password, role, fullName, avatar, credit, title }]
 *  - bs_cart:    [{ id, qty }]
 */
(() => {
  "use strict";
  const BS = (window.BS = window.BS || {});
  const { store } = BS;

  const KEYS = {
    session: "bs_session",
    users: "bs_users",
    cart: "bs_cart",
  };

  const DEFAULT_USERS = [
    { username: "1001", password: "123", role: "student", fullName: "دانش‌آموز نمونه", title: "دانش‌آموز", credit: 20000000, avatar: "assets/images/placeholder.svg" },
    { username: "1002", password: "123", role: "teacher", fullName: "معلم نمونه", title: "معلم", credit: 35000000, avatar: "assets/images/placeholder.svg" },
    { username: "1003", password: "123", role: "admin", fullName: "مدیر سیستم", title: "مدیر", credit: 99000000, avatar: "assets/images/placeholder.svg" },
  ];

  const ensureUsers = () => {
    const users = store.get(KEYS.users, null);
    if (Array.isArray(users) && users.length) return users;
    store.set(KEYS.users, DEFAULT_USERS);
    return DEFAULT_USERS;
  };

  const getUsers = () => ensureUsers();

  const getSession = () => store.get(KEYS.session, null);

  const setSession = (sess) => {
    store.set(KEYS.session, sess);
    BS.events.emit("bs:session", { session: sess });
  };

  const clearSession = () => {
    store.del(KEYS.session);
    BS.events.emit("bs:session", { session: null });
  };

  const getUser = (username) => getUsers().find((u) => u.username === username) || null;

  const getCurrentUser = () => {
    const s = getSession();
    if (!s?.username) return null;
    return getUser(s.username);
  };

  const formatIRR = (n) => {
    const num = Number(n || 0);
    try { return num.toLocaleString("fa-IR"); } catch { return String(num); }
  };

  const getCartCount = () => {
    const cart = store.get(KEYS.cart, []);
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
  };

  const login = (username, password) => {
    const u = getUser(String(username || "").trim());
    if (!u || String(u.password) !== String(password || "").trim()) {
      return { ok: false, error: "نام کاربری یا رمز عبور نادرست است." };
    }
    setSession({ username: u.username, role: u.role, ts: Date.now() });
    return { ok: true, user: u };
  };

  const register = ({ username, password, role = "student", fullName = "کاربر جدید" }) => {
    const un = String(username || "").trim();
    const pw = String(password || "").trim();
    if (!un || !pw) return { ok: false, error: "نام کاربری و رمز عبور الزامی است." };

    const users = getUsers();
    if (users.some((u) => u.username === un)) return { ok: false, error: "این نام کاربری قبلاً ثبت شده است." };

    const newUser = { username: un, password: pw, role, fullName, title: role === "teacher" ? "معلم" : role === "admin" ? "مدیر" : "دانش‌آموز", credit: 20000000, avatar: "assets/images/placeholder.svg" };
    const next = [...users, newUser];
    store.set(KEYS.users, next);
    setSession({ username: newUser.username, role: newUser.role, ts: Date.now() });
    return { ok: true, user: newUser };
  };

  // Public API
  BS.session = {
    KEYS,
    ensureUsers,
    getUsers,
    getSession,
    setSession,
    clearSession,
    getUser,
    getCurrentUser,
    login,
    register,
    getCartCount,
    formatIRR,
  };
})();
