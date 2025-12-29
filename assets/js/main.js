document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Header dropdowns (desktop) - supports multiple
  // =========================
  const dropdownToggles = Array.from(document.querySelectorAll(".nav-dropdown-toggle"));

  const closeAllDropdowns = () => {
    dropdownToggles.forEach((toggle) => {
      const parent = toggle.closest(".has-dropdown");
      if (!parent) return;
      parent.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  };

  if (dropdownToggles.length) {
    dropdownToggles.forEach((toggle) => {
      const parent = toggle.closest(".has-dropdown");
      if (!parent) return;

      toggle.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = parent.classList.contains("is-open");
        closeAllDropdowns();

        if (!isOpen) {
          parent.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", closeAllDropdowns);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllDropdowns();
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
    { id:"math-boost", title:"کلاس تقویتی ریاضی", provider:"بهسایار", category:"online", categoryLabel:"کلاس‌های آنلاین", price:490000, oldPrice:720000, image:"assets/images/products/math-boost.png" },
    { id:"digital-skills", title:"دوره مهارت‌های دیجیتال", provider:"بهسایار", category:"skills", categoryLabel:"مهارت‌ها", price:750000, oldPrice:920000, image:"assets/images/products/digital-skills.png" },
    { id:"english-teens", title:"زبان انگلیسی نوجوان", provider:"بهسایار", category:"online", categoryLabel:"کلاس‌های آنلاین", price:690000, oldPrice:840000, image:"assets/images/products/english-teens.png" },
    { id:"academic-counseling", title:"مشاوره تحصیلی", provider:"بهسایار", category:"skills", categoryLabel:"مهارت‌ها", price:420000, oldPrice:520000, image:"assets/images/products/academic-counseling.png" },
    { id:"online-exam-grade9", title:"آزمون آنلاین پایه نهم", provider:"بهسایار", category:"mid1", categoryLabel:"متوسطه اول", price:280000, oldPrice:350000, image:"assets/images/products/online-exam-grade9.png" },
    { id:"online-science", title:"کلاس آنلاین علوم", provider:"بهسایار", category:"online", categoryLabel:"کلاس‌های آنلاین", price:560000, oldPrice:690000, image:"assets/images/products/online-science.png" },
    { id:"public-speaking", title:"دوره مهارت سخنوری", provider:"بهسایار", category:"skills", categoryLabel:"مهارت‌ها", price:610000, oldPrice:790000, image:"assets/images/products/public-speaking.png" },
    { id:"gaj-math10", title:"پکیج ریاضی دهم", provider:"گاج", category:"mid2", categoryLabel:"متوسطه دوم", price:1250000, oldPrice:1490000, image:"assets/images/products/gaj-math10.png" },
    { id:"kheili-sabz-bio11", title:"پکیج زیست یازدهم", provider:"خیلی سبز", category:"mid2", categoryLabel:"متوسطه دوم", price:1490000, oldPrice:1750000, image:"assets/images/products/kheili-sabz-bio11.png" },
    { id:"ghalamchi-adab-konkur", title:"پکیج ادبیات کنکور", provider:"قلم‌چی", category:"konkur", categoryLabel:"کنکور و دانشگاه", price:1690000, oldPrice:1980000, image:"assets/images/products/ghalamchi-adab-konkur.png" },
    { id:"porsh-physics-konkur", title:"پکیج فیزیک کنکور", provider:"پرش", category:"konkur", categoryLabel:"کنکور و دانشگاه", price:1590000, oldPrice:1890000, image:"assets/images/products/porsh-physics-konkur.png" },
    { id:"pre-reading-1", title:"پکیج فارسی اول دبستان", provider:"بهسایار", category:"pre", categoryLabel:"پیش‌دبستان و دبستان", price:420000, oldPrice:520000, image:"assets/images/products/pre-reading-1.png" },
    { id:"pre-math-2", title:"پکیج ریاضی دوم دبستان", provider:"بهسایار", category:"pre", categoryLabel:"پیش‌دبستان و دبستان", price:460000, oldPrice:590000, image:"assets/images/products/pre-math-2.png" },
    { id:"pre-science-3", title:"علوم سوم دبستان (کارگاهی)", provider:"بهسایار", category:"pre", categoryLabel:"پیش‌دبستان و دبستان", price:490000, oldPrice:640000, image:"assets/images/products/pre-science-3.png" },
    { id:"mid1-math-7", title:"ریاضی هفتم (آموزش + تمرین)", provider:"بهسایار", category:"mid1", categoryLabel:"متوسطه اول", price:560000, oldPrice:720000, image:"assets/images/products/mid1-math-7.png" },
    { id:"mid1-arabi-8", title:"عربی هشتم (جمع‌بندی)", provider:"بهسایار", category:"mid1", categoryLabel:"متوسطه اول", price:520000, oldPrice:690000, image:"assets/images/products/mid1-arabi-8.png" },
    { id:"mid1-farsi-9", title:"فارسی نهم (آزمون و تحلیل)", provider:"بهسایار", category:"mid1", categoryLabel:"متوسطه اول", price:590000, oldPrice:790000, image:"assets/images/products/mid1-farsi-9.png" },
    { id:"mid2-math-10", title:"ریاضی دهم (تقویتی)", provider:"بهسایار", category:"mid2", categoryLabel:"متوسطه دوم", price:690000, oldPrice:920000, image:"assets/images/products/mid2-math-10.png" },
    { id:"mid2-chem-11", title:"شیمی یازدهم (مسئله‌محور)", provider:"بهسایار", category:"mid2", categoryLabel:"متوسطه دوم", price:740000, oldPrice:990000, image:"assets/images/products/mid2-chem-11.png" },
    { id:"mid2-phys-12", title:"فیزیک دوازدهم (جمع‌بندی)", provider:"بهسایار", category:"mid2", categoryLabel:"متوسطه دوم", price:790000, oldPrice:1050000, image:"assets/images/products/mid2-phys-12.png" },
    { id:"konkur-plan", title:"برنامه‌ریزی کنکور (شخصی‌سازی)", provider:"بهسایار", category:"konkur", categoryLabel:"کنکور و دانشگاه", price:890000, oldPrice:1190000, image:"assets/images/products/konkur-plan.png" },
    { id:"konkur-exam-pack", title:"پک آزمون آنلاین کنکور (ماهانه)", provider:"بهسایار", category:"konkur", categoryLabel:"کنکور و دانشگاه", price:350000, oldPrice:450000, image:"assets/images/products/konkur-exam-pack.png" },
    { id:"konkur-analysis", title:"تحلیل آزمون و رفع اشکال کنکور", provider:"بهسایار", category:"konkur", categoryLabel:"کنکور و دانشگاه", price:520000, oldPrice:690000, image:"assets/images/products/konkur-analysis.png" },
    { id:"online-shad-elem", title:"کلاس آنلاین شاد برای دبستان", provider:"بهسایار", category:"online", categoryLabel:"کلاس‌های آنلاین", price:590000, oldPrice:780000, image:"assets/images/products/online-shad-elem.png" },
    { id:"online-private-math", title:"کلاس خصوصی آنلاین ریاضی", provider:"بهسایار", category:"online", categoryLabel:"کلاس‌های آنلاین", price:990000, oldPrice:1290000, image:"assets/images/products/online-private-math.png" },
    { id:"online-group-english", title:"کلاس گروهی آنلاین زبان", provider:"بهسایار", category:"online", categoryLabel:"کلاس‌های آنلاین", price:720000, oldPrice:980000, image:"assets/images/products/online-group-english.png" },
    { id:"skills-study-method", title:"روش‌های مطالعه و یادگیری سریع", provider:"بهسایار", category:"skills", categoryLabel:"مهارت‌ها", price:430000, oldPrice:590000, image:"assets/images/products/skills-study-method.png" },
    { id:"skills-memory", title:"تقویت حافظه و تمرکز (۶ جلسه)", provider:"بهسایار", category:"skills", categoryLabel:"مهارت‌ها", price:480000, oldPrice:650000, image:"assets/images/products/skills-memory.png" },
    { id:"skills-time", title:"مدیریت زمان و برنامه‌ریزی", provider:"بهسایار", category:"skills", categoryLabel:"مهارت‌ها", price:390000, oldPrice:520000, image:"assets/images/products/skills-time.png" }
  ];

const CATEGORIES = [
  { key:"all", label:"همه دسته‌ها" },
  { key:"pre", label:"پیش‌دبستان و دبستان" },
  { key:"mid1", label:"متوسطه اول" },
  { key:"mid2", label:"متوسطه دوم" },
  { key:"konkur", label:"کنکور و دانشگاه" },
  { key:"online", label:"کلاس‌های آنلاین" },
  { key:"skills", label:"مهارت‌ها" },
];

const SEARCH_PAGES = [
  { title:"صفحه اصلی", url:"index.html", kind:"page" },
  { title:"محصولات", url:"services.html", kind:"page" },
  { title:"تماس با ما", url:"contact.html", kind:"page" },
  { title:"درباره بهسایار", url:"about.html", kind:"page" },
  { title:"اخبار", url:"news.html", kind:"page" },
];

function normalizeQuery(q){
  return String(q||"").trim().replace(/\s+/g," ");
}

function getQueryParam(name){
  try{
    const u = new URL(window.location.href);
    return u.searchParams.get(name) || "";
  }catch{ return ""; }
}

function setQueryParam(name, value){
  try{
    const u = new URL(window.location.href);
    if (!value) u.searchParams.delete(name);
    else u.searchParams.set(name, value);
    window.history.replaceState({}, "", u.toString());
  }catch{}
}

function createEl(tag, attrs={}, children=[]){
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  });
  children.forEach((c)=> el.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return el;
}

// =========================
// Global Search (Products + Pages) - Demo-first but real-feel
// =========================
function initGlobalSearch(){
  const inputs = document.querySelectorAll('.header-search input[type="search"]');
  if (!inputs.length) return;

  inputs.forEach((input)=>{
    input.setAttribute("autocomplete","off");
    const form = input.closest("form");
    if (!form) return;
    form.classList.add("has-search-results");

    // results panel
    let panel = form.querySelector(".search-results");
    if (!panel){
      panel = createEl("div", { class:"search-results", role:"listbox", "aria-label":"نتایج جستجو", hidden:"" });
      form.appendChild(panel);
    }

    const closePanel = ()=>{
      panel.setAttribute("hidden","");
      panel.innerHTML = "";
    };

    const openPanel = ()=>{
      panel.removeAttribute("hidden");
    };

    const renderResults = (q)=>{
      const query = normalizeQuery(q);
      if (query.length < 2) { closePanel(); return; }

      const qLower = query.toLowerCase();
      const prodMatches = CATALOG
        .filter(p => (p.title + " " + p.provider + " " + (p.categoryLabel||"")).toLowerCase().includes(qLower))
        .slice(0, 6);

      const pageMatches = SEARCH_PAGES
        .filter(p => p.title.toLowerCase().includes(qLower))
        .slice(0, 4);

      panel.innerHTML = "";

      if (!prodMatches.length && !pageMatches.length){
        panel.appendChild(createEl("div",{class:"sr-empty"},["نتیجه‌ای پیدا نشد"]));
        openPanel();
        return;
      }

      if (prodMatches.length){
        panel.appendChild(createEl("div",{class:"sr-group"},["محصولات"]));
        prodMatches.forEach((p)=>{
          const a = createEl("a",{class:"sr-item", href:`product.html?pid=${encodeURIComponent(p.id)}`, role:"option"});
          a.appendChild(createEl("span",{class:"sr-title"},[p.title]));
          a.appendChild(createEl("span",{class:"sr-meta"},[p.provider]));
          panel.appendChild(a);
        });
      }

      if (pageMatches.length){
        panel.appendChild(createEl("div",{class:"sr-group"},["صفحات"]));
        pageMatches.forEach((p)=>{
          const a = createEl("a",{class:"sr-item", href:p.url, role:"option"});
          a.appendChild(createEl("span",{class:"sr-title"},[p.title]));
          a.appendChild(createEl("span",{class:"sr-meta"},["صفحه"]));
          panel.appendChild(a);
        });
      }

      openPanel();
    };

    input.addEventListener("input", (e)=> renderResults(e.target.value));
    input.addEventListener("focus", (e)=> renderResults(e.target.value));

    document.addEventListener("click", (e)=>{
      if (!form.contains(e.target)) closePanel();
    });

    input.addEventListener("keydown", (e)=>{
      if (e.key === "Escape") { closePanel(); input.blur(); }
    });

    form.addEventListener("submit", (e)=>{
      // route to services with query
      e.preventDefault();
      const q = normalizeQuery(input.value);
      if (!q) return;
      window.location.href = `services.html?q=${encodeURIComponent(q)}`;
    });
  });
}

// =========================
// Services page: render products + filters (category, search, sort)
// =========================
function initServicesListing(){
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const searchInput = document.getElementById("productsSearch");
  const catSelect = document.getElementById("productsCategory");
  const sortSelect = document.getElementById("productsSort");

  // hydrate category select
  if (catSelect && catSelect.options.length <= 1){
    CATEGORIES.forEach((c)=>{
      const opt = document.createElement("option");
      opt.value = c.key;
      opt.textContent = c.label;
      catSelect.appendChild(opt);
    });
  }

  const qpQ = normalizeQuery(getQueryParam("q"));
  const qpCat = getQueryParam("cat");
  if (searchInput && qpQ) searchInput.value = qpQ;
  if (catSelect && qpCat) catSelect.value = qpCat;

  const render = ()=>{
    const q = normalizeQuery(searchInput?.value || "");
    const cat = catSelect?.value || "all";
    const sort = sortSelect?.value || "suggested";

    let list = [...CATALOG];
    if (cat && cat !== "all"){
      list = list.filter(p => p.category === cat);
    }
    if (q){
      const qLower = q.toLowerCase();
      list = list.filter(p => (p.title + " " + p.provider + " " + (p.categoryLabel||"")).toLowerCase().includes(qLower));
    }

    if (sort === "cheap") list.sort((a,b)=> (a.price||0) - (b.price||0));
    else if (sort === "expensive") list.sort((a,b)=> (b.price||0) - (a.price||0));
    else if (sort === "newest") list.sort((a,b)=> (b.id||"").localeCompare(a.id||""));
    // suggested: keep catalog order

    // render
    grid.innerHTML = "";
    if (!list.length){
      grid.appendChild(createEl("div",{class:"card sr-empty", style:"padding:14px;border-radius:16px;"},["محصولی مطابق فیلترها پیدا نشد."]));
      return;
    }

    list.forEach((p)=>{
      const card = createEl("article",{class:"product-card product-card--grid", "data-product-id":p.id});
      const media = createEl("div",{class:"product-media"});
      const img = createEl("img",{alt:p.title, loading:"lazy", src:p.image, onerror:"this.onerror=null;this.src='assets/images/placeholder.svg';"});
      media.appendChild(img);

      const name = createEl("div",{class:"product-name"},[p.title]);
      const meta = createEl("div",{class:"product-meta"},[`${p.provider} • ${p.categoryLabel || ""}`]);
      const prices = createEl("div",{class:"product-prices"});
      prices.appendChild(createEl("span",{class:"price-new"},[money(p.price)]));
      if (p.oldPrice && p.oldPrice > p.price){
        prices.appendChild(createEl("span",{class:"price-old"},[money(p.oldPrice)]));
      }

      const actions = createEl("div",{class:"product-actions"});
      actions.appendChild(createEl("a",{class:"btn btn-secondary", href:`product.html?pid=${encodeURIComponent(p.id)}`},["مشاهده"]));
      const btn = createEl("button",{class:"btn btn-primary js-add-to-cart", type:"button", "data-product-id":p.id},["افزودن به سبد"]);
      actions.appendChild(btn);

      card.appendChild(media);
      card.appendChild(name);
      card.appendChild(meta);
      card.appendChild(prices);
      card.appendChild(actions);
      grid.appendChild(card);
    });

    // keep URL in sync for shareable demo
    if (q) setQueryParam("q", q); else setQueryParam("q","");
    if (cat && cat !== "all") setQueryParam("cat", cat); else setQueryParam("cat","");
  };

  [searchInput, catSelect, sortSelect].forEach((el)=> el && el.addEventListener("input", render));
  [catSelect, sortSelect].forEach((el)=> el && el.addEventListener("change", render));

  render();
}

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
              <div class="tx-installments">
                ${t.installments.schedule.map(s=>`<div class="tx-installment-row"><span>قسط ${s.n} • ${s.dueDate}</span><b>${money(s.amount)}</b></div>`).join("")}
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
  
    updateCartBadges();
  }

  
  function initCartPage() {
    const wrap = document.getElementById("cartItems");
    if (!wrap) return;
    if (wrap.dataset.bound === "1") return;
    wrap.dataset.bound = "1";

    wrap.addEventListener("click", (e) => {
      const plus = e.target.closest(".js-qty-plus");
      const minus = e.target.closest(".js-qty-minus");
      const remove = e.target.closest(".js-remove-item");
      if (!plus && !minus && !remove) return;

      const row = e.target.closest(".cart-item");
      const productId = row?.dataset?.productId;
      if (!productId) return;

      let cart = loadCart();
      const found = cart.find((x) => x.id === productId);

      if (remove) {
        cart = cart.filter((x) => x.id !== productId);
      } else if (found) {
        if (plus) found.qty = Number(found.qty || 1) + 1;
        if (minus) found.qty = Math.max(1, Number(found.qty || 1) - 1);
      }

      saveCart(cart);
      updateCartBadges();
      renderCartPage();
    });
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

    if (!headerAuthLink || !headerAuthText) return;
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

    if (!bnAuthLink || !bnAuthText) return;
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
  initCartPage();
  renderCheckoutPage();
  hydrateProductPage();
  renderDashboards();
});
