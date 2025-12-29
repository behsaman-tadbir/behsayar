document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Header dropdown (desktop)
  // =========================
  const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
  const dropdownParent = dropdownToggle?.closest(".has-dropdown");

  const closeDropdown = () => {
    if (!dropdownParent) return;
    dropdownParent.classList.remove("is-open");
    dropdownToggle?.setAttribute("aria-expanded", "false");
  };

  if (dropdownToggle && dropdownParent) {
    dropdownToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const nowOpen = dropdownParent.classList.toggle("is-open");
      dropdownToggle.setAttribute("aria-expanded", nowOpen ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
      if (!dropdownParent.contains(event.target)) closeDropdown();
    });

    dropdownToggle.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown();
        dropdownToggle.focus();
      }
    });
  }

  // =========================
  // Auth Demo (localStorage) - Static MVP
  // =========================
  const STORAGE_USERS = "bs_users";
  const STORAGE_SESSION = "bs_session";
  const STORAGE_CART = "bs_cart";

  // =========================
  // Catalog + Cart + Wallet + Transactions (Demo-first)
  // ظاهر واقعی، پشت پرده نمایشی (localStorage)
  // =========================
  const STORAGE_WALLETS = "bs_wallets";
  const STORAGE_TX = "bs_transactions";

  const CATALOG = [
    { id:"math-boost", title:"کلاس تقویتی ریاضی", provider:"بهسایار", price: 490000, image:"assets/images/products/math-boost.png" },
    { id:"digital-skills", title:"دوره مهارت‌های دیجیتال", provider:"بهسایار", price: 750000, image:"assets/images/products/digital-skills.png" },
    { id:"english-teens", title:"زبان انگلیسی نوجوان", provider:"بهسایار", price: 690000, image:"assets/images/products/english-teens.png" },
    { id:"academic-counseling", title:"مشاوره تحصیلی", provider:"بهسایار", price: 420000, image:"assets/images/products/academic-counseling.png" },
    { id:"online-exam-grade9", title:"آزمون آنلاین پایه نهم", provider:"بهسایار", price: 280000, image:"assets/images/products/online-exam-grade9.png" },
    { id:"online-science", title:"کلاس آنلاین علوم", provider:"بهسایار", price: 560000, image:"assets/images/products/online-science.png" },
    { id:"public-speaking", title:"دوره مهارت سخنوری", provider:"بهسایار", price: 610000, image:"assets/images/products/public-speaking.png" },

    { id:"gaj-math10", title:"پکیج ریاضی دهم", provider:"گاج", price: 1250000, image:"assets/images/products/gaj-math10.png" },
    { id:"kheili-sabz-bio11", title:"پکیج زیست یازدهم", provider:"خیلی سبز", price: 1490000, image:"assets/images/products/kheili-sabz-bio11.png" },
    { id:"ghalamchi-adab-konkur", title:"پکیج ادبیات کنکور", provider:"قلم‌چی", price: 1690000, image:"assets/images/products/ghalamchi-adab-konkur.png" },
  ];

  const catalogById = Object.fromEntries(CATALOG.map((p)=>[p.id,p]));

  const money = (n) => {
    const num = Number(n || 0);
    try { return num.toLocaleString("fa-IR"); } catch { return String(num); }
  };

  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }
  function saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function normalizeCart(raw) {
    if (!Array.isArray(raw)) return [];
    // legacy support: ["id1","id2"] -> qty=1 each
    if (raw.length && typeof raw[0] === "string") {
      const map = {};
      raw.forEach((id)=>{ map[id]=(map[id]||0)+1; });
      return Object.entries(map).map(([id,qty])=>({id,qty}));
    }
    // new format: [{id,qty}]
    return raw
      .filter((x)=>x && typeof x.id === "string")
      .map((x)=>({ id:x.id, qty: Math.max(1, Number(x.qty||1)) }));
  }

  function loadCart() {
    return normalizeCart(loadJSON(STORAGE_CART, []));
  }
  function saveCart(cart) { saveJSON(STORAGE_CART, cart); }

  function cartQtyTotal(cart) {
    return cart.reduce((sum, it)=> sum + (Number(it.qty)||0), 0);
  }

  function updateCartBadges() {
    const cart = loadCart();
    const count = cartQtyTotal(cart);

    const bnBadge = document.getElementById("bnCartBadge");
    const headerBadge = document.getElementById("headerCartBadge");

    [bnBadge, headerBadge].forEach((el)=>{
      if (!el) return;
      if (count > 0) {
        el.hidden = false;
        el.textContent = String(count);
      } else {
        el.hidden = true;
        el.textContent = "0";
      }
    });
  }

  function addToCart(productId, qty=1) {
    const product = catalogById[productId];
    if (!product) return;

    const cart = loadCart();
    const found = cart.find((x)=>x.id===productId);
    if (found) found.qty += qty;
    else cart.push({ id: productId, qty: Math.max(1, qty) });
    saveCart(cart);
    updateCartBadges();
  }

  function setCartQty(productId, qty) {
    const cart = loadCart();
    const item = cart.find((x)=>x.id===productId);
    if (!item) return;
    item.qty = Math.max(1, Number(qty||1));
    saveCart(cart);
    updateCartBadges();
  }

  function removeFromCart(productId) {
    const cart = loadCart().filter((x)=>x.id!==productId);
    saveCart(cart);
    updateCartBadges();
  }

  function clearCart() {
    saveCart([]);
    updateCartBadges();
  }

  function getActiveUser() {
    try {
      const session = JSON.parse(localStorage.getItem(STORAGE_SESSION) || "null");
      if (!session || !session.username) return null;
      return session;
    } catch { return null; }
  }

  function ensureWalletFor(username) {
    const wallets = loadJSON(STORAGE_WALLETS, {});
    if (!wallets[username]) {
      wallets[username] = { limit: 20000000, available: 20000000 };
      saveJSON(STORAGE_WALLETS, wallets);
    }
    return wallets[username];
  }

  function setWallet(username, wallet) {
    const wallets = loadJSON(STORAGE_WALLETS, {});
    wallets[username] = wallet;
    saveJSON(STORAGE_WALLETS, wallets);
  }

  function listTransactions() {
    return loadJSON(STORAGE_TX, []);
  }
  function saveTransactions(txs) { saveJSON(STORAGE_TX, txs); }

  function newTxId() {
    return "TX-" + Math.random().toString(16).slice(2,10).toUpperCase();
  }

  function addTransaction(tx) {
    const txs = listTransactions();
    txs.unshift(tx);
    saveTransactions(txs);
  }

  function formatDateISO(d) {
    const y=d.getFullYear();
    const m=String(d.getMonth()+1).padStart(2,"0");
    const day=String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  }

  function buildInstallmentSchedule(total, months) {
    const m = Math.max(1, Number(months||3));
    const per = Math.floor(total / m);
    const rem = total - per*m;
    const now = new Date();
    const schedule = [];
    for (let i=1;i<=m;i++){
      const due = new Date(now.getFullYear(), now.getMonth()+i, now.getDate());
      const amount = per + (i===m ? rem : 0);
      schedule.push({ n:i, dueDate: formatDateISO(due), amount, status:"pending" });
    }
    return schedule;
  }

  function renderTransactions(el, txs, mode="user") {
    if (!el) return;
    if (!txs.length) {
      el.innerHTML = `<div style="padding:12px;border-radius:16px;background:rgba(15,23,42,.03);border:1px solid rgba(15,23,42,.08);color:rgba(15,23,42,.72);font-weight:650;line-height:1.9;">هنوز تراکنشی ثبت نشده است.</div>`;
      return;
    }
    el.innerHTML = txs.map((t)=>{
      const items = (t.items||[]).map((it)=>{
        const p = catalogById[it.id];
        const name = p ? p.title : it.id;
        return `${name} × ${it.qty}`;
      }).join("، ");
      const method = t.method==="credit" ? "اعتباری/اقساط" : "آنلاین";
      return `
        <div class="card" style="border-radius:18px;padding:12px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <div style="font-weight:950;">${t.id} • ${method}</div>
            <div style="font-weight:1000;">${money(t.total)} تومان</div>
          </div>
          ${mode==="admin" ? `<div style="margin-top:6px;color:rgba(15,23,42,.72);font-weight:650;">کاربر: ${t.username} • نقش: ${t.role}</div>` : ``}
          <div style="margin-top:6px;color:rgba(15,23,42,.72);font-weight:650;line-height:1.9;">${items}</div>
          <div style="margin-top:6px;color:rgba(15,23,42,.62);font-weight:650;">تاریخ: ${t.createdAt}</div>
          ${t.method==="credit" && t.installments ? `
            <div style="margin-top:10px;padding:10px;border-radius:16px;background:rgba(56,189,248,.10);border:1px solid rgba(56,189,248,.18);">
              <div style="font-weight:900;margin-bottom:6px;">اقساط ماهانه (${t.installments.months} ماه)</div>
              <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;">
                ${t.installments.schedule.map(s=>`<div style="display:flex;justify-content:space-between;gap:10px;"><span>قسط ${s.n} • ${s.dueDate}</span><b>${money(s.amount)}</b></div>`).join("")}
              </div>
            </div>
          `:``}
        </div>
      `;
    }).join("");
  }

  function renderCartPage() {
    const wrap = document.getElementById("cartItems");
    if (!wrap) return;

    const cart = loadCart();
    const countEl = document.getElementById("cartCount");
    const totalEl = document.getElementById("cartTotal");
    const emptyHint = document.getElementById("cartEmptyHint");
    const goCheckoutBtn = document.getElementById("goCheckoutBtn");

    if (!cart.length) {
      wrap.innerHTML = "";
      if (countEl) countEl.textContent = "0";
      if (totalEl) totalEl.textContent = money(0);
      if (emptyHint) emptyHint.style.display = "block";
      if (goCheckoutBtn) goCheckoutBtn.setAttribute("aria-disabled","true");
      return;
    }
    if (emptyHint) emptyHint.style.display = "none";
    if (goCheckoutBtn) goCheckoutBtn.removeAttribute("aria-disabled");

    let total = 0;
    wrap.innerHTML = cart.map((it)=>{
      const p = catalogById[it.id] || { title: it.id, provider:"—", price:0, image:"assets/images/placeholder.svg" };
      const line = p.price * it.qty;
      total += line;
      return `
        <div class="cart-item" data-product-id="${it.id}">
          <div class="ci-media"><img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.svg';"></div>
          <div class="ci-main">
            <div class="ci-title">${p.title}</div>
            <div class="ci-meta">${p.provider}</div>
            <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
              <div class="qty" aria-label="تعداد">
                <button type="button" class="js-qty-minus" aria-label="کم کردن">−</button>
                <span class="qty-num">${it.qty}</span>
                <button type="button" class="js-qty-plus" aria-label="زیاد کردن">+</button>
              </div>
              <button type="button" class="btn btn-secondary js-remove-item" style="padding:8px 12px;border-radius:14px;">حذف</button>
            </div>
          </div>
          <div class="ci-price">${money(line)} تومان</div>
        </div>
      `;
    }).join("");

    if (countEl) countEl.textContent = String(cartQtyTotal(cart));
    if (totalEl) totalEl.textContent = money(total);
  }

  function renderCheckoutPage() {
    const summary = document.getElementById("checkoutSummary");
    if (!summary) return;

    const cart = loadCart();
    let total = 0;
    const lines = cart.map((it)=>{
      const p = catalogById[it.id];
      if (!p) return "";
      const line = p.price * it.qty;
      total += line;
      return `<div style="display:flex;justify-content:space-between;gap:10px;"><span>${p.title} × ${it.qty}</span><b>${money(line)}</b></div>`;
    }).filter(Boolean).join("");

    if (!cart.length) {
      summary.innerHTML = `<div style="padding:12px;border-radius:16px;background:rgba(15,23,42,.03);border:1px solid rgba(15,23,42,.08);color:rgba(15,23,42,.72);font-weight:650;line-height:1.9;">سبد شما خالی است. <a href="services.html">رفتن به محصولات</a></div>`;
      return;
    }

    summary.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${lines}
        <div style="margin-top:8px;padding-top:10px;border-top:1px solid rgba(15,23,42,.10);display:flex;justify-content:space-between;gap:10px;font-weight:1000;">
          <span>جمع کل</span><span>${money(total)} تومان</span>
        </div>
      </div>
    `;

    const orderTotal = document.getElementById("orderTotal");
    if (orderTotal) orderTotal.textContent = money(total);

    const user = getActiveUser();
    const creditPanel = document.getElementById("creditPanel");
    const creditAvailableEl = document.getElementById("creditAvailable");
    const installmentMonths = document.getElementById("installmentMonths");
    const installmentsWrap = document.getElementById("installmentsTableWrap");
    const payOnlineBtn = document.getElementById("payOnlineBtn");
    const payCreditBtn = document.getElementById("payCreditBtn");
    const gatewayPanel = document.getElementById("gatewayPanel");
    const confirmOnlineBtn = document.getElementById("confirmOnlineBtn");
    const confirmCreditBtn = document.getElementById("confirmCreditBtn");
    const checkoutMsg = document.getElementById("checkoutMsg");

    const ensureAuthOrHint = () => {
      if (user) return true;
      if (checkoutMsg) {
        checkoutMsg.style.display="block";
        checkoutMsg.textContent = "برای نهایی‌سازی خرید باید وارد شوید.";
      }
      return false;
    };

    function renderInstallments(months) {
      if (!installmentsWrap) return;
      const m = Number(months||3);
      const schedule = buildInstallmentSchedule(total, m);
      installmentsWrap.innerHTML = `
        <div style="font-weight:900;">زمان‌بندی اقساط (ماهانه)</div>
        <table aria-label="جدول اقساط">
          <thead><tr><th>قسط</th><th>تاریخ</th><th>مبلغ</th></tr></thead>
          <tbody>
            ${schedule.map(s=>`<tr><td>${s.n}</td><td>${s.dueDate}</td><td>${money(s.amount)}</td></tr>`).join("")}
          </tbody>
        </table>
      `;
      return schedule;
    }

    let currentSchedule = renderInstallments(installmentMonths ? installmentMonths.value : 3);

    installmentMonths?.addEventListener("change", ()=>{
      currentSchedule = renderInstallments(installmentMonths.value);
    });

    payOnlineBtn?.addEventListener("click", ()=>{
      if (!ensureAuthOrHint()) return;
      if (checkoutMsg) checkoutMsg.style.display="none";
      if (gatewayPanel) gatewayPanel.style.display="block";
      if (creditPanel) creditPanel.style.display="none";
    });

    payCreditBtn?.addEventListener("click", ()=>{
      if (!ensureAuthOrHint()) return;
      if (checkoutMsg) checkoutMsg.style.display="none";
      if (gatewayPanel) gatewayPanel.style.display="none";
      if (creditPanel) creditPanel.style.display="block";

      const w = ensureWalletFor(user.username);
      if (creditAvailableEl) creditAvailableEl.textContent = money(w.available);

      // disable if not enough
      if (confirmCreditBtn) {
        confirmCreditBtn.disabled = w.available < total;
        confirmCreditBtn.style.opacity = confirmCreditBtn.disabled ? ".6" : "1";
      }
      if (w.available < total && installmentsWrap) {
        installmentsWrap.insertAdjacentHTML("afterbegin",
          `<div style="margin-bottom:8px;padding:10px;border-radius:14px;background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.22);font-weight:750;">اعتبار کافی نیست. (نمایشی)</div>`
        );
      }
    });

    confirmOnlineBtn?.addEventListener("click", ()=>{
      if (!user) return;
      const tx = {
        id: newTxId(),
        username: user.username,
        role: user.role,
        method: "online",
        items: cart.map(it=>({id:it.id, qty:it.qty, unitPrice:(catalogById[it.id]?.price||0)})),
        total,
        createdAt: formatDateISO(new Date()),
        status: "paid"
      };
      addTransaction(tx);
      clearCart();
      if (gatewayPanel) gatewayPanel.style.display="none";
      if (checkoutMsg) {
        checkoutMsg.style.display="block";
        checkoutMsg.textContent = "پرداخت آنلاین با موفقیت ثبت شد (نمایشی). انتقال به داشبورد...";
      }
      setTimeout(()=>{
        if (user.role==="admin") location.href="dashboard-admin.html";
        else if (user.role==="teacher") location.href="dashboard-teacher.html";
        else location.href="dashboard.html";
      }, 700);
    });

    confirmCreditBtn?.addEventListener("click", ()=>{
      if (!user) return;
      const w = ensureWalletFor(user.username);
      const months = Number(installmentMonths?.value || 3);
      const schedule = buildInstallmentSchedule(total, months);

      if (w.available < total) {
        if (checkoutMsg) {
          checkoutMsg.style.display="block";
          checkoutMsg.textContent = "اعتبار کافی نیست (نمایشی).";
        }
        return;
      }

      w.available = w.available - total;
      setWallet(user.username, w);

      const tx = {
        id: newTxId(),
        username: user.username,
        role: user.role,
        method: "credit",
        items: cart.map(it=>({id:it.id, qty:it.qty, unitPrice:(catalogById[it.id]?.price||0)})),
        total,
        createdAt: formatDateISO(new Date()),
        status: "confirmed",
        installments: { months, schedule }
      };
      addTransaction(tx);
      clearCart();

      if (creditPanel) creditPanel.style.display="none";
      if (checkoutMsg) {
        checkoutMsg.style.display="block";
        checkoutMsg.textContent = "خرید اعتباری با موفقیت ثبت شد و از اعتبار کسر گردید (نمایشی). انتقال به داشبورد...";
      }
      setTimeout(()=>{
        if (user.role==="admin") location.href="dashboard-admin.html";
        else if (user.role==="teacher") location.href="dashboard-teacher.html";
        else location.href="dashboard.html";
      }, 700);
    });
  }

  function hydrateProductPage() {
    const titleEl = document.getElementById("productTitle");
    if (!titleEl) return;

    const params = new URLSearchParams(location.search);
    const pid = params.get("pid") || "gaj-math10";
    const p = catalogById[pid] || catalogById["gaj-math10"];

    titleEl.textContent = (p?.title || "محصول");
    const priceEl = document.getElementById("productPrice");
    if (priceEl) priceEl.textContent = `${money(p?.price || 0)} تومان`;

    const providerEl = document.getElementById("productProvider");
    if (providerEl) providerEl.textContent = p?.provider || "بهسایار";

    const imgEl = document.getElementById("productImage");
    if (imgEl) {
      imgEl.src = p?.image || "assets/images/placeholder.svg";
      imgEl.alt = p?.title || "محصول";
      imgEl.onerror = function(){ this.onerror=null; this.src="assets/images/placeholder.svg"; };
    }

    // ensure add-to-cart button has correct pid
    const addBtn = document.querySelector(".js-add-to-cart");
    if (addBtn) addBtn.setAttribute("data-product-id", pid);
  }

  function renderDashboards() {
    const user = getActiveUser();
    // student dashboard wallet + transactions
    const walletAvailable = document.getElementById("walletAvailable");
    const walletLimit = document.getElementById("walletLimit");
    if (user && walletAvailable && walletLimit) {
      const w = ensureWalletFor(user.username);
      walletAvailable.textContent = money(w.available);
      walletLimit.textContent = money(w.limit);
    }

    const myTxEl = document.getElementById("myTransactions");
    if (user && myTxEl) {
      const txs = listTransactions().filter(t=>t.username===user.username);
      renderTransactions(myTxEl, txs, "user");

      const clearBtn = document.getElementById("clearMyTransactionsBtn");
      clearBtn?.addEventListener("click", ()=>{
        const all = listTransactions().filter(t=>t.username!==user.username);
        saveTransactions(all);
        renderTransactions(myTxEl, [], "user");
      });
    }

    const teacherTx = document.getElementById("teacherTransactions");
    if (user && teacherTx) {
      const txs = listTransactions().filter(t=>t.username===user.username);
      renderTransactions(teacherTx, txs, "user");
    }

    const adminTx = document.getElementById("adminTransactions");
    if (adminTx) {
      const txs = listTransactions();
      renderTransactions(adminTx, txs, "admin");
    }
  }

  // Global: handle add-to-cart buttons anywhere
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest(".js-add-to-cart");
    if (!btn) return;
    const pid = btn.getAttribute("data-product-id");
    if (!pid) return;
    addToCart(pid, 1);

    // micro feedback (no toasts library)
    btn.classList.add("is-added");
    const prev = btn.textContent;
    btn.textContent = "اضافه شد ✓";
    setTimeout(()=>{ btn.textContent = prev; btn.classList.remove("is-added"); }, 700);
  });


  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }

  function setSession(user) {
    localStorage.setItem(
      STORAGE_SESSION,
      JSON.stringify({
        username: user.username,
        role: user.role,
      })
    );
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_SESSION));
    } catch {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_SESSION);
  }

  function ensureDemoUsers() {
    // Fixed demo accounts (exactly three active users)
    const demoUsers = [
      { username: "1001", password: "123", role: "student", name: "دانش‌آموز دمو" },
      { username: "1002", password: "123", role: "teacher", name: "دبیر دمو" },
      { username: "1003", password: "123", role: "admin", name: "مدیر سیستم دمو" },
    ];

    // Ensure these demo users always exist (keep other registered demo users too)
    const existing = loadUsers();
    const filtered = existing.filter((u) => !demoUsers.some((d) => d.username === u.username));
    saveUsers([...filtered, ...demoUsers]);

    // If a previous session doesn't match demo users, clear it.
    const session = getSession();
    if (session && !demoUsers.some((u) => u.username === session.username)) {
      clearSession();
    }
  }

  // Seed demo users immediately
  ensureDemoUsers();

  function redirectByRole(role) {
    if (role === "admin") {
      location.href = "dashboard-admin.html";
      return;
    }
    if (role === "teacher") {
      location.href = "dashboard-teacher.html";
      return;
    }
    location.href = "dashboard.html";
  }

  // ✅ این تابع، هم هدر و هم BottomNav را آپدیت می‌کند
  function updateAuthLinksUI() {
    const session = getSession();
    const loggedIn = !!(session && session.username);

    // -------- Desktop Header Auth Button --------
    const headerAuthLink = document.getElementById("headerAuthLink");
    const headerAuthText = document.getElementById("headerAuthText");

    if (headerAuthLink && headerAuthText) {
      if (loggedIn) {
        headerAuthText.textContent = "داشبورد";
        headerAuthLink.setAttribute("aria-label", "داشبورد");

        if (session.role === "admin") headerAuthLink.href = "dashboard-admin.html";
        else if (session.role === "teacher") headerAuthLink.href = "dashboard-teacher.html";
        else headerAuthLink.href = "dashboard.html";
      } else {
        headerAuthText.textContent = "ثبت‌نام / ورود";
        headerAuthLink.href = "login.html";
        headerAuthLink.setAttribute("aria-label", "ثبت‌نام / ورود");
      }
    }

    // -------- Mobile Bottom Nav Auth --------
    const bnAuthLink = document.getElementById("bnAuthLink");
    const bnAuthText = document.getElementById("bnAuthText");

    if (bnAuthLink && bnAuthText) {
      if (loggedIn) {
        bnAuthText.textContent = "داشبورد";
        bnAuthLink.setAttribute("aria-label", "داشبورد");

        if (session.role === "admin") bnAuthLink.href = "dashboard-admin.html";
        else if (session.role === "teacher") bnAuthLink.href = "dashboard-teacher.html";
        else bnAuthLink.href = "dashboard.html";
      } else {
        bnAuthText.textContent = "ورود";
        bnAuthLink.href = "login.html";
        bnAuthLink.setAttribute("aria-label", "ورود");
      }
    }
  }

  // اگر دکمه خروج در داشبوردها وجود داشت
  function wireLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn || logoutBtn.__wired) return;

    logoutBtn.__wired = true;
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearSession();
      updateAuthLinksUI();
      location.href = "index.html";
    });
  }

  function wireRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const msg = document.getElementById("registerMsg");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("regUsername")?.value.trim();
      const password = document.getElementById("regPassword")?.value.trim();
      const phone = document.getElementById("regPhone")?.value.trim();
      const nationalId = document.getElementById("regNationalId")?.value.trim();
      const role = document.getElementById("regRole")?.value; // student | teacher

      if (!username || !password || !phone || !nationalId || !role) {
        if (msg) msg.textContent = "لطفاً همه فیلدها را کامل کنید.";
        return;
      }

      if (!/^\d{10}$/.test(nationalId)) {
        if (msg) msg.textContent = "کد ملی باید دقیقاً ۱۰ رقم باشد.";
        return;
      }

      if (!/^\d{11}$/.test(phone)) {
        if (msg) msg.textContent = "شماره همراه باید دقیقاً ۱۱ رقم باشد.";
        return;
      }

      // جلوگیری از ساخت ادمین با ثبت‌نام
      if (role === "admin") {
        if (msg) msg.textContent = "ثبت‌نام مدیر سیستم مجاز نیست.";
        return;
      }

      const users = loadUsers();
      const exists = users.some(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
      if (exists) {
        if (msg)
          msg.innerHTML =
            'این نام کاربری قبلاً ثبت شده است. لطفاً <a href="login.html">وارد شوید</a>.';
        return;
      }

      const newUser = {
        username,
        password,
        phone,
        nationalId,
        role,
        createdAt: Date.now(),
      };

      users.push(newUser);
      saveUsers(users);

      setSession(newUser);
      updateAuthLinksUI(); // ✅ بلافاصله UI آپدیت شود

      if (msg) msg.style.color = "#166534";
      if (msg) msg.textContent = "ثبت‌نام موفق بود. انتقال...";

      setTimeout(() => {
        redirectByRole(newUser.role);
      }, 600);
    });
  }

  function wireLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const msg = document.getElementById("loginMsg");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername")?.value.trim();
      const password = document.getElementById("loginPassword")?.value.trim();

      if (!username || !password) {
        if (msg) msg.textContent = "نام کاربری و رمز عبور را وارد کنید.";
        return;
      }

      // Admin demo login (no register) — fixed demo credentials
      if (username === "1003" && password === "123") {
        setSession({ username: "1003", role: "admin" });
        updateAuthLinksUI(); // ✅

        if (msg) {
          msg.style.color = "#166534";
          msg.textContent = "ورود مدیر سیستم موفق. انتقال...";
        }
        setTimeout(() => {
          location.href = "dashboard-admin.html";
        }, 400);
        return;
      }

      const users = loadUsers();
      const user = users.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() &&
          u.password === password
      );

      if (!user) {
        if (msg) msg.style.color = "#b45309";
        if (msg)
          msg.innerHTML =
            'حسابی با این اطلاعات پیدا نشد. لطفاً <a href="register.html">ثبت‌نام</a> کنید.';
        return;
      }

      setSession(user);
      updateAuthLinksUI(); // ✅

      if (msg) msg.style.color = "#166534";
      if (msg) msg.textContent = "ورود موفق. انتقال...";

      setTimeout(() => {
        redirectByRole(user.role);
      }, 500);
    });
  }

  function protectDashboard() {
    const file = (location.pathname.split("/").pop() || "").toLowerCase();
    const session = getSession();

    const protectedPages = [
      "dashboard.html",
      "dashboard-teacher.html",
      "dashboard-admin.html",
    ];
    if (!protectedPages.includes(file)) return;

    if (!session || !session.username) {
      location.href = "login.html";
      return;
    }

    // role guards
    if (file === "dashboard-admin.html" && session.role !== "admin") {
      location.href = "dashboard.html";
      return;
    }

    if (file === "dashboard-teacher.html" && session.role !== "teacher") {
      location.href = "dashboard.html";
      return;
    }

    // if user is on dashboard.html but role is not student
    if (file === "dashboard.html" && session.role === "admin") {
      location.href = "dashboard-admin.html";
      return;
    }
    if (file === "dashboard.html" && session.role === "teacher") {
      location.href = "dashboard-teacher.html";
      return;
    }
  }

  // =========================
  // Mobile Bottom Nav + Sheet
  // =========================
  const catsBtn = document.getElementById("bnCatsBtn");
  const catsSheet = document.getElementById("mobileCatsSheet");
  const cartBadge = document.getElementById("bnCartBadge");

  const openSheet = () => {
    if (!catsSheet || !catsBtn) return;
    catsSheet.classList.add("is-open");
    catsSheet.setAttribute("aria-hidden", "false");
    catsBtn.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
  };

  const closeSheet = () => {
    if (!catsSheet || !catsBtn) return;
    catsSheet.classList.remove("is-open");
    catsSheet.setAttribute("aria-hidden", "true");
    catsBtn.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
  };

  if (catsBtn && catsSheet) {
    catsBtn.addEventListener("click", () => {
      const isOpen = catsSheet.classList.contains("is-open");
      isOpen ? closeSheet() : openSheet();
    });

    catsSheet.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.matches("[data-sheet-close]")) closeSheet();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSheet();
    });
  }

    // Cart badge
  updateCartBadges();

  // =========================
  // Home Post Slider (every 3s)
  // =========================
  const slides = Array.from(document.querySelectorAll(".post-slide"));
  const dotsWrap = document.getElementById("sliderDots");

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "dot";
      d.type = "button";
      d.setAttribute("aria-label", `اسلاید ${i + 1}`);
      d.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(d);
    });

    const dots = Array.from(dotsWrap.querySelectorAll(".dot"));
    let idx = slides.findIndex((s) => s.classList.contains("is-active"));
    if (idx < 0) idx = 0;

    function render() {
      slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    }

    function goTo(i) {
      idx = i % slides.length;
      render();
      restart();
    }

    let timer = null;
    function start() {
      timer = setInterval(() => {
        idx = (idx + 1) % slides.length;
        render();
      }, 3000);
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function restart() {
      stop();
      start();
    }

    const slider = document.querySelector(".post-slider");
    if (slider) {
      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      slider.addEventListener("focusin", stop);
      slider.addEventListener("focusout", start);
    }

    render();
    start();
  }

  // =========================
  // Init (Order matters)
  // =========================
  updateAuthLinksUI();
  wireLogout();
  wireRegisterForm();
  wireLoginForm();
  protectDashboard();
  // Cart/Checkout/Transactions demo
  updateCartBadges();
  renderCartPage();
  renderCheckoutPage();
  hydrateProductPage();
  renderDashboards();
});
