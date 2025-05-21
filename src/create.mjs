import { loadNavbar } from "./navbar.mjs";
loadNavbar();

const token = localStorage.getItem("token");
if (!token) {
  alert("You must be logged in to create a blog post!");
  window.location.href = "/account/login.html";
}

const form = document.getElementById("create-post-form");

/*when the form is submitted */
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // stop page refresh

  /*get user input from the form and trim whitespace */
  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();
  const media = document.getElementById("media").value.trim();

  /* get token and username from localStorage*/
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const apiKey = "35489523-dbb9-48dd-9bfe-d00c2ea7e78b";

  /*making sure required fields are filled*/
  if (!title || !body) {
    alert("Please fill in both the title and the body of the post.");
    return;
  }

  /*build post object*/
  const postInfo = {
    title: title,
    body: body,
  };

  if (media !== "") {
    postInfo.media = {
      url: media,
      alt: "An image for the post",
    };
  }

  console.log("Sending this post to the API:", postInfo);

  /*send the post to the API*/
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${username}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postInfo),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("Blog post created successfully:");
      console.log(data);
    }

    alert("Your blog post was created!");
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Network error:", error);
    alert("There was a problem creating the post. Try again.");
  }
});
