import { loadNavbar } from "./navbar.mjs";
loadNavbar();
const postId = new URLSearchParams(window.location.search).get("id");

if (!postId) {
  alert("No blog post ID was found in the URL.");
  window.location.href = "/index.html";
}

/*to get the login info that was saved earlier*/
const username = localStorage.getItem("username");
const token = localStorage.getItem("token");
const apiKey = "35489523-dbb9-48dd-9bfe-d00c2ea7e78b";

/*the link to the blog post we want to edit*/
const postUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

const form = document.getElementById("edit-post-form");

/*when the page loads, getting the info of the post from the API*/
async function loadPostData() {
  try {
    const response = await fetch(postUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const post = data.data;

    /*to fill in the form with the blog posts current information*/
    /*first get the input field for the titl, then the value the user typed ine*/
    document.getElementById("title").value = post.title;
    document.getElementById("body").value = post.body;

    /*if the post has an img and a link to that img, then find the media input box and fill it with the image url*/
    if (post.media) {
      if (post.media.url) {
        let mediaInput = document.getElementById("media");
        mediaInput.value = post.media.url;
      }
    }
  } catch (error) {
    alert("Something went wrong when loading the blog post.");
  }

  /*when form is submitted, send the updates to the API*/
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    /*to get the new values from the form*/
    const newTitle = document.getElementById("title").value;
    const newBody = document.getElementById("body").value;
    const newMedia = document.getElementById("media").value;

    /*putting the new info in an object*/
    const updatedPost = {
      title: newTitle,
      body: newBody,
    };
    if (newMedia.trim() !== "") {
      updatedPost.media = {
        url: newMedia,
        alt: "Updated image",
      };
    }

    try {
      const response = await fetch(postUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        alert("Blog post is updated!");
        window.location.href = `/index.html?id=${postId}`;
      } else {
        const errorData = await response.json();
        console.error("Update error:", errorData);
        alert("Could not update post. Try again.");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("There was an error when updating the post.");
    }
  });
}

/*Delete blog post*/
const deleteButton = document.getElementById("delete-post");

deleteButton.addEventListener("click", async function () {
  const confirmDelete = confirm("Are you sure you want to delete this post?");

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(postUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Blog post is deleted!");
      window.location.href = "/index.html";
    } else {
      const errorData = await response.json();
      console.error("Delete error:", errorData);
      alert("Could not delete the post.");
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    alert("Error: Cannot delete the post.");
  }
});

loadPostData();
