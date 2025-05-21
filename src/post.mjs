import { loadNavbar } from "./navbar.mjs";
loadNavbar();

/* getting the ID of a specific post from the URL*/
const postId = new URLSearchParams(window.location.search).get("id");

/*get login info that was saved when the user was logged in*/
const ownerUsername = "siennasinclair";
const storedUsername = localStorage.getItem("username");
const token = localStorage.getItem("token");

const apiKey = "35489523-dbb9-48dd-9bfe-d00c2ea7e78b";
const postUrl = `https://v2.api.noroff.dev/blog/posts/${ownerUsername}/${postId}`;

/* getting blog post from the API*/
async function getBlogPost() {
  try {
    const response = await fetch(postUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error("Could not get blog post from API");
    }

    const post = json.data;

    /* to show the blog post title on the page*/
    document.getElementById("post-title").textContent = post.title;

    /*to show the image for the blog post*/
    const image = document.getElementById("post-image");

    /*to show when it was published*/
    document.getElementById("post-meta").textContent = `By ${
      post.author.name
    } | Published: ${new Date(post.created).toLocaleDateString()}`;

    /*to show the blog post text*/
    document.getElementById("post-body").innerHTML = post.body.replace(
      /\n/g,
      "<br>"
    );

    /*if the post has an image, use it. If not, show a placeholder image*/
    if (post.media && post.media.url) {
      image.src = post.media.url;
      image.alt = post.media.alt || "Blog post image"; /*OR*/
    }

    /* edit button only if the user logged is is the blog owner*/
    if (token && storedUsername === ownerUsername) {
      const editContainer = document.querySelector(".edit-container");

      const editBtn = document.createElement("a");
      editBtn.href = `/post/edit.html?id=${postId}`;
      editBtn.textContent = "Edit this post";
      editBtn.className = "edit-post-btn";

      editContainer.appendChild(editBtn);
    }

    /*share button*/
    const shareBtn = document.getElementById("copy-link-btn");
    const message = document.getElementById("copy-message");

    /*share button functionality*/

    shareBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("The blog post link has been copied!");
      });
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    document.querySelector(
      ".post-container"
    ).innerHTML = `<p></p>Error: ${error.message}</p>`;
  }
}

getBlogPost();
