import { loadNavbar } from "./navbar.mjs";
loadNavbar();

console.log("index.mjs is connected!!!!!!!!!!!!!!");

/*gets blog posts from the API*/
async function fetchBlogPosts() {
  /*to get the login info from local storage*/
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "siennasinclair";
  const apiKey = "35489523-dbb9-48dd-9bfe-d00c2ea7e78b";

  console.log("Token from localStorage:", token);

  const headers = {
    "X-Noroff-API-Key": apiKey,
    "Content-Type": "application/json",
  };

  /*if logged in, add the authorization header*/
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  /*sending request to get posts*/
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${username}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(
        "Could not get blog posts. Status code: " + response.status
      );
    }
    /*return list of blog posts*/
    return json.data;
  } catch (error) {
    console.error("Error getting blog posts:", error);
    return [];
  }
}

/*function to show the blog posts grid*/
function renderPostGrid(blogPosts) {
  const grid = document.getElementById("post-grid");
  grid.innerHTML = "";

  for (let i = 0; i < 12 && i < blogPosts.length; i++) {
    const post = blogPosts[i];

    const card = document.createElement("div");
    card.className = "blog-post-card";

    /*?. checks if media exists before trying .url. If it doesn’t exist, it uses a placeholder image instead*/
    const imageUrl =
      post.media && post.media.url
        ? post.media.url
        : "https://images.unsplash.com/photo-1581291519195-ef11498d1cf5?auto=format&fit=crop&w=600&q=80";
    const imageAlt =
      post.media && post.media.alt ? post.media.alt : "Blog post image";

    card.innerHTML =
      `<img src="${imageUrl}" alt="${imageAlt}">` +
      `<p class="post-date">${post.created}</p>` +
      `<h3 class="post-title">${post.title}</h3>` +
      `<p class="post-subtitle">${post.body}</p>` +
      `<a class="read-more" href="post/index.html?id=${post.id}">read more</a>`;

    grid.appendChild(card);
  }
}

/* CAROUSEL*/

const slides = document.querySelectorAll(".slide");
let slideIndex = 0;

function showCarouselPosts(blogPosts) {
  const slideContainer = document.querySelector(".slides");
  slideContainer.innerHTML = "";

  let postNumber = 0;

  while (postNumber < 3 && postNumber < blogPosts.length) {
    const post = blogPosts[postNumber];

    /*?. checks if media exists before trying .url. If it doesn’t exist, it uses a placeholder image instead*/
    const imageUrl =
      post.media && post.media.url
        ? post.media.url
        : "https://images.unsplash.com/photo-1581291519195-ef11498d1cf5?auto=format&fit=crop&w=600&q=80";
    const imageAlt =
      post.media && post.media.alt ? post.media.alt : "Blog post image";

    let slideHTML = '<div class="slide blog-post-card">';
    slideHTML += '<img src="' + imageUrl + '" alt="' + imageAlt + '">';
    slideHTML += '<p class="post-date">' + post.created + "</p>";
    slideHTML += '<h3 class="post-title">' + post.title + "</h3>";
    slideHTML += '<p class="post-subtitle">' + post.body + "</p>";
    slideHTML +=
      '<a class="read-more" href="post/index.html?id=' +
      post.id +
      '">read more</a>';
    slideHTML += "</div>";

    slideContainer.innerHTML += slideHTML;

    postNumber = postNumber + 1;
  }
}

//initializeSlider();

function initializeSlider() {
  if (slides.length > 0) {
    slides[slideIndex].classList.add("displaySlide");
  }

  document.querySelector(".prev").addEventListener("click", prevSlide);
  document.querySelector(".next").addEventListener("click", nextSlide);
}

function showSlide(index) {
  if (index >= slides.length) {
    slideIndex = 0;
  } else if (index < 0) {
    slideIndex = slides.length - 1;
  }
  slides.forEach((slide) => {
    slide.classList.remove("displaySlide");
  });
  slides[slideIndex].classList.add("displaySlide");
}

function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Page loaded - RUNNING fetchBlogPosts()!!!!");
  const posts = await fetchBlogPosts();
  console.log("Blog posts:", posts);

  renderPostGrid(posts);
});
