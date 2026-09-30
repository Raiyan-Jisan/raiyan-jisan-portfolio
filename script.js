/**
 * ============================================================================
 * SCRIPT.JS - Md Raiyan Bin Jisan Portfolio
 * Plain vanilla JavaScript (no external libraries or build tools required)
 * Handles theme toggling, mobile navigation, scroll-reveal, email copying,
 * and contact interactions with beginner-friendly comments.
 * ============================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------------------------
     1. Theme Management (Dark / Light Mode)
     Checks localStorage first, then system preference, and updates <html>
     -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
     1. Theme Management (Dark / Light Mode)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const rootElement = document.documentElement;

  function applyTheme(theme) {
    rootElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("portfolio_theme", theme);
    } catch (error) {
      // Ignore storage errors
    }

    if (themeToggleBtn) {
      const isDark = theme === "dark";
      themeToggleBtn.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
      themeToggleBtn.setAttribute(
        "title",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("portfolio_theme");
  } catch (error) {
    savedTheme = null;
  }

  const initialTheme = savedTheme || "light";
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      const currentTheme =
        rootElement.getAttribute("data-theme") || "light";

      const newTheme =
        currentTheme === "dark" ? "light" : "dark";

      applyTheme(newTheme);
    });
  }

  /* --------------------------------------------------------------------------
     2. Mobile Navigation Toggle
     Opens and closes navigation menu on mobile screens
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("nav-links");

  if (mobileMenuBtn && navLinks) {
    // Toggle menu visibility
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      mobileMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when a link inside is clicked
    const links = navLinks.querySelectorAll(".nav-link");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !mobileMenuBtn.contains(event.target)
      ) {
        navLinks.classList.remove("open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu when user presses Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.focus();
      }
    });
  }


  /* --------------------------------------------------------------------------
     3. Active Navigation Spy on Scroll
     Updates active class on nav links as user scrolls through sections
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const allNavLinks = document.querySelectorAll(".nav-link");

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        allNavLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavOnScroll, { passive: true });
  highlightNavOnScroll(); // Run once on page load


  /* --------------------------------------------------------------------------
     4. Scroll Reveal Animations (IntersectionObserver)
     Adds smooth fade-and-lift effect as elements scroll into view
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target); // Once revealed, stop observing
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers without IntersectionObserver
    revealElements.forEach((el) => el.classList.add("reveal-visible"));
  }


  /* --------------------------------------------------------------------------
     5. Toast Notification Utility
     Shows a transient notification message (e.g. for copied email)
     -------------------------------------------------------------------------- */
  const toast = document.getElementById("toast");
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("toast-show");

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove("toast-show");
    }, 2800);
  }


  /* --------------------------------------------------------------------------
     6. Copy Email to Clipboard
     Copies Raiyan's email address and provides visual confirmation
     -------------------------------------------------------------------------- */
  const copyEmailButtons = document.querySelectorAll(".js-copy-email");

  copyEmailButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const emailToCopy = btn.getAttribute("data-email") || "raiyanjisan0@gmail.com";

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback using temporary textarea element
          const tempTextarea = document.createElement("textarea");
          tempTextarea.value = emailToCopy;
          tempTextarea.style.position = "fixed";
          tempTextarea.style.opacity = "0";
          document.body.appendChild(tempTextarea);
          tempTextarea.focus();
          tempTextarea.select();
          document.execCommand("copy");
          document.body.removeChild(tempTextarea);
        }
        showToast("Email copied to clipboard: " + emailToCopy);
      } catch (err) {
        showToast("Email: " + emailToCopy);
      }
    });
  });


  /* --------------------------------------------------------------------------
     7. Quick Contact Form Handling
     Prepares email client with subject and message addressed to Raiyan
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById("quick-contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("sender-name");
      const emailInput = document.getElementById("sender-email");
      const messageInput = document.getElementById("sender-message");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!message) {
        showToast("Please enter a message.");
        return;
      }

      // Construct mailto URI
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name || "Visitor"}`);
      const body = encodeURIComponent(
        `Hi Raiyan,\n\n${message}\n\nFrom: ${name || "Anonymous"} (${email || "No email provided"})`
      );
      const mailtoUrl = `mailto:raiyanjisan0@gmail.com?subject=${subject}&body=${body}`;

      // Open email client
      window.location.href = mailtoUrl;
      showToast("Opening your email client...");
    });
  }

  /* --------------------------------------------------------------------------
     8. Image Error Fallback Handler
     If profile.jpg is missing or moved, gracefully displays a neat placeholder
     -------------------------------------------------------------------------- */
  const profileImg = document.getElementById("hero-profile-img");
  if (profileImg) {
    profileImg.addEventListener("error", () => {
      // Replaces with an SVG avatar fallback if the image fails to load
      profileImg.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160' width='160' height='160'><rect width='100%' height='100%' fill='%231e293b'/><circle cx='80' cy='60' r='32' fill='%233b82f6'/><path d='M32 140 C32 105, 52 95, 80 95 C108 95, 128 105, 128 140 Z' fill='%233b82f6'/></svg>";
    });
  }
});
