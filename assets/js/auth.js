// auth.js (legacy-friendly)
// This project primarily uses assets/js/main.js for demo auth/session.
// This file remains as a thin fallback (no external deps, no logic drift).

(() => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  // If main.js already attached handlers, do nothing.
  if (form.dataset.bsAuthBound === "1") return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername")?.value.trim();
    const password = document.getElementById("loginPassword")?.value.trim();
    const msg = document.getElementById("loginMsg");

    const DEMO = [
      { username: "1001", password: "123", role: "student" },
      { username: "1002", password: "123", role: "teacher" },
      { username: "1003", password: "123", role: "admin" },
    ];

    const ok = DEMO.find(u => u.username === username && u.password === password);
    if (!ok) {
      if (msg) msg.textContent = "نام کاربری یا رمز عبور نادرست است.";
      return;
    }

    // Same keys as main.js (demo session)
    localStorage.setItem("bs_session", JSON.stringify({ username: ok.username, role: ok.role, ts: Date.now() }));

    // Route by role (aligned with existing dashboards)
    const target = ok.role === "admin" ? "dashboard-admin.html"
      : ok.role === "teacher" ? "dashboard-teacher.html"
      : "dashboard.html";

    window.location.href = target;
  });

  form.dataset.bsAuthBound = "1";
})();
