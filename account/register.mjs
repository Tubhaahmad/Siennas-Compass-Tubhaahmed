import { loadNavbar } from "../src/navbar.mjs";
loadNavbar();

console.log("The register page is working!!!!!!!");

const form = document.getElementById("register-form");

/*when the form is submitted, run this code*/
form.addEventListener("submit", function (event) {
  event.preventDefault(); /*stops the page from refreshing when the form is submitted*/

  /*get the values that are typed into the input fields of the form*/
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  /*check if the email is a noroff student email*/
  const userInfo = {
    name: username,
    email: email,
    password: password,
  };

  /*username registration validation*/
  const namePattern = /^[a-zA-Z0-9_]+$/;
  if (!namePattern.test(username)) {
    alert("Name can only contain numbers, letters and underscores.");
    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    alert("Please use a @stud.noroff.no student email!");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  async function registerUser() {
    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("API error:", data);
        alert("Could not register. Try another email or username.");
        return;
      }

      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("username", data.data.name);
      localStorage.setItem("user", JSON.stringify(data.data));

      /*if registring user worked*/
      alert("Account is created! You can log in.");
      window.location.href = "/account/login.html";
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  registerUser();
});
