export function loadNavbar() {
  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    if (!header) return;

    header.innerHTML = `
       <div class="site-header">
        <nav class="nav-container">
          <input type="checkbox" id="nav-toggle" class="nav-toggle" />
          <label for="nav-toggle" class="nav-toggle-label">☰</label>

          <div class="nav-left">
            <a href="/">Home</a>
            <span class="divider">|</span>
            <a href="#">About</a>
          </div>

          <div class="logo" id="navbar-logo">
            <a href="/index.html">Sienna's Compass</a>
          </div>

          <div class="nav-right">
            <a href="/post/create.html" id="create-link" class="hidden">Create Post</a>
            <a href="/account/login.html" id="login-link">Login</a>
            <span class="divider">|</span>
            <a href="/account/register.html" id="register-link">Register</a>
            <a href="#" id="logout-btn" class="hidden">Logout</a>
          </div>
        </nav>
      </div>
    `;

    /*get the new values*/

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const ownerUsername = "siennasinclair";

    const logoutBtn = document.getElementById("logout-btn");
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const createLink = document.getElementById("create-link");

    if (token) {
      logoutBtn.style.display = "inline";
      loginLink.style.display = "none";
      registerLink.style.display = "none";

      if (username === ownerUsername) {
        createLink.style.display = "inline";
      } else {
        createLink.style.display = "none";
      }
    } else {
      logoutBtn.style.display = "none";
      loginLink.style.display = "inline";
      registerLink.style.display = "inline";
      createLink.style.display = "none";
    }

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("user");
      alert("You have been logged out.");
      window.location.href = "/index.html";
    });
  });
}
