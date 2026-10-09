/* =========================================================
   main.js – shared by every page
   1. Mobile navigation (hamburger) toggle
   2. Highlight the current page in the navigation
   3. Footer year
   4. Fade-in sections on scroll
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* ---------- 1. Mobile navigation toggle ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("primary-nav");

  // Open or close the mobile menu and keep the ARIA state in sync
  function setMenuOpen(isOpen) {
    siteNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  if (navToggle && siteNav) {
    // CLICK: hamburger button toggles the menu
    navToggle.addEventListener("click", function () {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    // CLICK: close the menu after choosing a link (mobile)
    siteNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        setMenuOpen(false);
      }
    });

    // KEYDOWN: Escape closes the menu
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });

    // RESIZE: reset the menu when switching to the desktop layout
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) {
        setMenuOpen(false);
      }
    });
  }


  /* ---------- 2. Highlight the current page ---------- */

  // Work out the current file name, e.g. "about.html" ("/" means index.html)
  function getCurrentPage() {
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf("/") + 1);
    return fileName === "" ? "index.html" : fileName;
  }

  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll(".nav-list a");

  navLinks.forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });


  /* ---------- 3. Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ---------- 4. Fade-in sections on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);   // animate only once
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Older browsers: just show everything
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
});
