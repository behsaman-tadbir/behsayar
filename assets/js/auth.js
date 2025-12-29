document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const error = document.getElementById("loginError");

  if (username === "110110" && password === "110110") {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("role", role);

    if (role === "admin") {
      window.location.href = "dashboard-admin.html";
    } else {
      window.location.href = "dashboard-user.html";
    }
  } else {
    error.textContent = "نام کاربری یا رمز عبور نادرست است";
  }
});
