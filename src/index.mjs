import { loadNavbar } from "./navbar.mjs";
loadNavbar();

const ownerUsername = "siennasinclair";

/*gets blog posts from the API*/
async function fetchBlogPosts() {
  /*to get the login info from local storage*/
  const token = localStorage.getItem("token");
  const apiKey = "35489523-dbb9-48dd-9bfe-d00c2ea7e78b";

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
      `https://v2.api.noroff.dev/blog/posts/${ownerUsername}`,
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
        : "https://images.pexels.com/photos/14452399/pexels-photo-14452399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    const imageAlt =
      post.media && post.media.alt
        ? post.media.alt
        : "Preview image for blog post titled: ${post.title";

    card.innerHTML =
      `<img src="${imageUrl}" alt="${imageAlt}">` +
      `<h3 class="post-title">${post.title}</h3>` +
      `<p class="post-preview">${post.body}</p>` +
      `<a class="read-more" href="post/index.html?id=${post.id}">read more</a>`;

    grid.appendChild(card);
  }
}

function revealOnScroll() {
  const cards = document.querySelectorAll(".blog-post-card");

  const triggerPoint = window.innerHeight * 0.9;

  cards.forEach((card) => {
    const cardTop = card.getBoundingClientRect().top;

    if (cardTop < triggerPoint) {
      card.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* CAROUSEL*/

const slides = document.querySelectorAll(".slide");
function showCarouselPosts(blogPosts) {
  const slideContainer = document.querySelector(".slides");
  slideContainer.innerHTML = "";

  for (let i = 0; i < 3 && i < blogPosts.length; i++) {
    const post = blogPosts[i];

    const imageUrl =
      post.media?.url ||
      "https://images.pexels.com/photos/14452399/pexels-photo-14452399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    const imageAlt =
      post.media?.alt || "Preview image for blog post titled: ${post.title";

    const slide = document.createElement("div");
    slide.classList.add("slide");

    /*reuse your blog card structure*/
    slide.innerHTML = `
      <div class="blog-post-card">
    <img src="${imageUrl}" alt="${imageAlt}">
    <h3 class="post-title">${post.title}</h3>
    <p class="post-preview">${post.body}</p>
    <a class="read-more" href="post/index.html?id=${post.id}">read more</a>
  </div>
    `;

    slideContainer.appendChild(slide);
  }
}

let slideIndex = 0;

/*show the slide at the current index*/
function showSlide(index) {
  const slideContainer = document.querySelector(".slides");
  const totalSlides = document.querySelectorAll(".slide").length;

  if (index >= totalSlides) {
    index = 0;
  } else if (index < 0) {
    index = totalSlides - 1;
  }

  slideIndex = index;

  const slideWidth = slideContainer.clientWidth;
  slideContainer.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
}

/*go to next slide*/

function nextSlide() {
  showSlide(slideIndex + 1);
}

/*go to previous slide*/
function prevSlide() {
  showSlide(slideIndex - 1);
}

/*set up the buttons*/

function initializeSlider() {
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);
  }

  /*Show first slide on page load*/
  showSlide(slideIndex);
}

/*on page load*/

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Page loaded - RUNNING fetchBlogPosts()!!!!");

  const posts = await fetchBlogPosts();
  console.log("Blog posts:", posts);

  renderPostGrid(posts);
  showCarouselPosts(posts);
  initializeSlider();

  const heroText = document.querySelector(".hero-text-container");
  if (heroText) {
    setTimeout(() => {
      heroText.classList.add("show");
    }, 300);
  }
});
