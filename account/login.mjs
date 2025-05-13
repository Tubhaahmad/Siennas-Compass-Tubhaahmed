const LOGIN_URL = "https://v2.api.noroff.dev/auth/login";
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
  /*Sending the login info to the API*/
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });

    /*Turn the response into data we can use*/
    const data = await response.json();

    if (!response.ok) {
      alert("Login failed. Please check your email and password!.");
      return;
    }

    /*This is to tell the user they logged in*/
    localStorage.setItem("token", data.data.accessToken);
    localStorage.setItem("username", data.data.name);

    alert("You are logged in!");

    /*This is to go back to the homepage*/
    window.location.href = "../index.html";
  } catch (error) {
    console.log("Something went wrong:", error);
    alert("Something went wrong. Try again later.");
  }
});
