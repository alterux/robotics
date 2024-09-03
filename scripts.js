document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  // Background image rotation setup
  const backgroundElement = document.querySelector(".background-image");
  const images = [
    "media/assembly1.webp",
    "media/assembly2.webp",
    "media/seven.webp",
  ];
  let currentIndex = 0;

  function changeBackground() {
    backgroundElement.style.opacity = 0;
    setTimeout(() => {
      backgroundElement.style.backgroundImage = `url(${images[currentIndex]})`;
      backgroundElement.style.opacity = 0.5;
      currentIndex = (currentIndex + 1) % images.length;
      setTimeout(changeBackground, 5000);
    }, 1000);
  }

  changeBackground(); // Start the background animation

  // Load header content
  fetch("header.html")
    .then((response) =>
      response.ok
        ? response.text()
        : Promise.reject(`HTTP error! status: ${response.status}`)
    )
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
      setupNavigation();
      highlightCurrentPage();
    })
    .catch((error) => console.error("Error loading header:", error));

  // Load footer content and set up theme toggle
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      const footer = document.querySelector("footer");
      if (footer) {
        footer.innerHTML = data;
        document.querySelectorAll(".theme-toggle").forEach((toggle) => {
          toggle.addEventListener("click", toggleTheme);
        });
        updateThemeToggleText();
      }
    })
    .catch((error) => console.error("Error loading footer:", error));

  // Theme management
  function updateThemeToggleText() {
    const isDarkMode = document.body.classList.contains("dark-mode");
    const toggleText = isDarkMode
      ? "Switch to Light Mode"
      : "Switch to Dark Mode";
    const toggleIcon = isDarkMode ? "☀️" : "🌙";
    document.querySelectorAll(".theme-toggle").forEach((toggle) => {
      toggle.innerHTML = `${toggleIcon} <span>${toggleText}</span>`;
    });
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode")
      ? "dark-mode"
      : "light-mode";
    localStorage.setItem("theme", theme);
    updateThemeToggleText();
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) document.body.classList.add(savedTheme);
  updateThemeToggleText();

  // Page specific setup
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname.endsWith("/")
  ) {
    document.body.classList.add("index-page");
  }

  // Setup navigation functionality
  function setupNavigation() {
    const headerContainer = document.querySelector("header .container");
    if (!headerContainer) {
      console.error("Header container not found");
      return;
    }

    // Create and append hamburger button
    const hamburger = document.createElement("button");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = "<div></div><div></div><div></div>";
    document.body.appendChild(hamburger);

    // Create nav overlay and add cloned links and mobile theme toggle
    const navOverlay = document.createElement("div");
    navOverlay.classList.add("nav-overlay");
    document.body.appendChild(navOverlay);

    const navLinks = headerContainer.querySelector(".nav-links");
    if (navLinks) navOverlay.appendChild(navLinks.cloneNode(true));

    const mobileThemeToggle = document.createElement("button");
    mobileThemeToggle.id = "mobile-theme-toggle";
    mobileThemeToggle.classList.add("theme-toggle");
    mobileThemeToggle.innerHTML = "🌙 <span>Switch to Dark Mode</span>";
    mobileThemeToggle.addEventListener("click", toggleTheme);
    navOverlay.appendChild(mobileThemeToggle);

    // Hamburger menu toggle functionality
    function toggleMenu() {
      const menuOpen = navOverlay.classList.toggle("open");
      if (!menuOpen && document.body.classList.contains("index-page")) {
        homeButton.classList.toggle("hidden", window.scrollY <= 100);
      } else {
        homeButton.classList.remove("hidden");
      }
      hamburger.classList.toggle("open", menuOpen);
      document.body.style.overflow = menuOpen ? "hidden" : ""; // Prevent or restore scrolling
      navOverlay.style.display = menuOpen ? "flex" : "none";
      navOverlay.style.opacity = menuOpen ? "1" : "0";
      updateThemeToggleText();
    }

    hamburger.addEventListener("click", toggleMenu);
    navOverlay.addEventListener("click", (event) => {
      if (event.target === navOverlay) toggleMenu();
    });

    // Update hamburger visibility based on window width
    function updateHamburgerVisibility() {
      if (window.innerWidth > 768) {
        hamburger.style.display = "none"; // Hide hamburger on desktop
      } else {
        hamburger.style.display = "flex"; // Show hamburger on mobile
      }
    }

    window.addEventListener("resize", updateHamburgerVisibility);
    updateHamburgerVisibility(); // Initial check

    // Home button behavior
    const homeButton = document.getElementById("home-button");
    if (homeButton && document.body.classList.contains("index-page")) {
      homeButton.classList.add("hidden"); // Hide initially
    }
    if (homeButton) {
      homeButton.addEventListener("click", function (e) {
        if (document.body.classList.contains("index-page")) {
          // On index page: close menu (if open) and scroll to top
          e.preventDefault();
          if (navOverlay.classList.contains("open")) {
            toggleMenu(); // Close menu if open
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          // On other pages: redirect to index page
          window.location.href = "index.html";
        }
      });
    }

    // Update home button visibility on scroll
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
      if (document.body.classList.contains("index-page")) {
        homeButton.classList.toggle("hidden", scrollPosition <= 100);
        // Slide menu items based on scroll position
        const navLinks = document.querySelector(".nav-links");
        navLinks.style.transform =
          scrollPosition > 100
            ? "translateX(0)"
            : `translateX(-${homeButton.offsetWidth}px)`;
      } else {
        homeButton.classList.remove("hidden");
      }
    });
  }

  function highlightCurrentPage() {
    const currentPath = window.location.pathname.split("/").pop();
    document
      .querySelectorAll(".nav-links a, .nav-overlay a")
      .forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === currentPath
        );
      });
  }
});
