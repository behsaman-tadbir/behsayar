/* bs-session.js — demo auth/session/user/cart (localStorage)
 * Contract:
 *  - users: bs_users (array)
 *  - session: bs_session ({userId, role, at})
 *  - cart: bs_cart (array of {id, qty})
 */
(() => {
  "use strict";

  const BS = (window.BS = window.BS || {});
  const { safeJsonParse } = BS.core;

  BS.session = BS.session || {};
  const api = BS.session;

  const KEY_USERS = "bs_users";
  const KEY_SESSION = "bs_session";
  const KEY_CART = "bs_cart";

  const defaultUsers = [
    { id: "1001", username: "student", password: "123", role: "student", fullName: "دانش‌آموز نمونه", credit: 20000000, avatar: "assets/images/avatar-student.png" },
    { id: "2001", username: "teacher", password: "123", role: "teacher", fullName: "معلم نمونه", credit: 12000000, avatar: "assets/images/avatar-teacher.png" },
    { id: "3001", username: "admin",   password: "123", role: "admin",   fullName: "مدیر سیستم",   credit: 50000000, avatar: "assets/images/avatar-admin.png" },
  ];

  const read = (key, fallback) => safeJsonParse(localStorage.getItem(key), fallback);
  const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  const ensureUsers = () => {
    const users = read(KEY_USERS, null);
    if (Array.isArray(users) && users.length) return users;
    write(KEY_USERS, defaultUsers);
    return defaultUsers;
  };

  const saveUsers = (users) => write(KEY_USERS, users);

  const findUser = (identifier) => {
    const users = ensureUsers();
    const id = String(identifier || "").trim();
    return users.find(u => u.username === id || u.id === id) || null;
  };

  api.getUsers = () => ensureUsers();

  api.getSession = () => read(KEY_SESSION, null);

  api.isLoggedIn = () => {
    const s = api.getSession();
    return !!(s && s.userId);
  };

  api.getCurrentUser = () => {
    const s = api.getSession();
    if (!s?.userId) return null;
    const users = ensureUsers();
    return users.find(u => u.id === s.userId) || null;
  };

  api.login = ({ username, password }) => {
    const u = findUser(username);
    if (!u) return { ok: false, message: "کاربری با این مشخصات پیدا نشد." };
    if (String(password || "") !== String(u.password)) return { ok: false, message: "رمز عبور اشتباه است." };

    write(KEY_SESSION, { userId: u.id, role: u.role, at: Date.now() });
    return { ok: true, user: u };
  };

  api.register = ({ username, password, role, fullName, phone, nationalId }) => {
    const users = ensureUsers();
    const u = String(username || "").trim();
    if (!u) return { ok: false, message: "نام کاربری لازم است." };
    if (findUser(u)) return { ok: false, message: "این نام کاربری قبلاً ثبت شده است." };
    if (!String(password || "").trim()) return { ok: false, message: "رمز عبور لازم است." };
    if (!String(role || "").trim()) return { ok: false, message: "نقش را انتخاب کنید." };

    const newUser = {
      id: String(Date.now()),
      username: u,
      password: String(password),
      role: String(role),
      fullName: String(fullName || u),
      credit: 20000000,
      phone: String(phone || ""),
      nationalId: String(nationalId || ""),
      avatar: "assets/images/avatar-user.png"
    };

    users.push(newUser);
    saveUsers(users);
    write(KEY_SESSION, { userId: newUser.id, role: newUser.role, at: Date.now() });
    return { ok: true, user: newUser };
  };

  api.logout = () => {
    localStorage.removeItem(KEY_SESSION);
    return { ok: true };
  };

  api.getCartCount = () => {
    const cart = read(KEY_CART, []);
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
  };

  api.setCart = (items) => write(KEY_CART, Array.isArray(items) ? items : []);

  api.ensureSeedData = () => {
    ensureUsers();
    if (!localStorage.getItem(KEY_CART)) write(KEY_CART, []);
  };
})();
