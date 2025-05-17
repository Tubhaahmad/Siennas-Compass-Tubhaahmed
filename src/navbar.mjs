export function loadNavbar() {
  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");

    if (!header) return;

    header.innerHTML = `
  <nav class="nav-container">
      <input type="checkbox" id="nav-toggle" class="nav-toggle" />
      <label for="nav-toggle" class="nav-toggle-label">☰</label>

      <div class="nav-left">
        <a href="/">home</a>
        <a href="#">about</a>
      </div>

      <div class="logo">
        <a href="/index.html">Atlas on Foot</a>
      </div>

      <div class="nav-right">
        <a href="/account/login.html" id="login-link">Login</a>
        <a href="/account/register.html" id="register-link">Register</a>
        <a href="#" id="logout-btn" class="hidden">Logout</a>
      </div>
    </nav>
    `;

    /*get the new buttons*/

    const token = localStorage.getItem("token");
    const logoutBtn = document.getElementById("logout-btn");
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");

    if (token) {
      logoutBtn.style.display = "inline";
      loginLink.style.display = "none";
      registerLink.style.display = "none";
    } else {
      logoutBtn.style.display = "none";
      loginLink.style.display = "inline";
      registerLink.style.display = "inline";
    }

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      alert("You have been logged out.");
      window.location.href = "/index.html";
    });
  });
}
