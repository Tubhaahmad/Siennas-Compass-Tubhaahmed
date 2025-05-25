import { loadNavbar } from "../src/navbar.mjs";
loadNavbar();

const form = document.getElementById("login-form");

/* do this when the form is submitted*/
form.addEventListener("submit", async function (event) {
  /*Stop the page from refreshing*/
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginInfo = {
    email: email,
    password: password, // use the exact one you registered with
  };
  /*sending the login info to the API*/
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });

    /*turn the response into data we can use*/
    const data = await response.json();

    if (!response.ok) {
      alert("Login failed. Please check your email and password!.");
      return;
    }

    /*this is to tell the user they logged in*/
    localStorage.setItem("token", data.data.accessToken);
    localStorage.setItem("username", data.data.name);
    localStorage.setItem("user", JSON.stringify(data.data));

    alert("You are logged in!");

    /*this is to go back to the homepage*/
    window.location.href = "../index.html";
  } catch (error) {
    alert("Something went wrong. Try again later.");
  }
});
