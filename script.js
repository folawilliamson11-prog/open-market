document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
     MOBILE NAVIGATION
     ========================================= */

  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".nav-links");

  if (nav && navLinks) {
    const menuButton = document.createElement("button");

    menuButton.className = "menu-button";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    nav.appendChild(menuButton);

    menuButton.addEventListener("click", function () {
      const menuIsOpen = navLinks.classList.toggle("nav-open");

      menuButton.classList.toggle("menu-open", menuIsOpen);
      menuButton.setAttribute("aria-expanded", String(menuIsOpen));

      if (menuIsOpen) {
        menuButton.setAttribute("aria-label", "Close navigation menu");
      } else {
        menuButton.setAttribute("aria-label", "Open navigation menu");
      }
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("nav-open");
        menuButton.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        navLinks.classList.remove("nav-open");
        menuButton.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }

  /* =========================================
     SMOOTH INTERNAL LINKS
     ========================================= */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        target.setAttribute("tabindex", "-1");
        target.focus({
          preventScroll: true
        });
      }
    });
  });

  /* =========================================
     ACTIVE NAVIGATION
     ========================================= */

  const sections = document.querySelectorAll("main section[id]");
  const internalNavigationLinks =
    document.querySelectorAll('.nav-links a[href^="#"]');

  if (
    sections.length > 0 &&
    internalNavigationLinks.length > 0 &&
    "IntersectionObserver" in window
  ) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          const activeSectionId = entry.target.getAttribute("id");

          internalNavigationLinks.forEach(function (link) {
            const isActive =
              link.getAttribute("href") === `#${activeSectionId}`;

            link.classList.toggle("active-link", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* =========================================
     SCROLL REVEAL
     ========================================= */

  const revealElements = document.querySelectorAll(
    ".card, .job, .project-shell, .process-item, " +
    ".persona-card, .phone-grid article, .solution, " +
    ".highlight, .outcome-panel, .disclaimer"
  );

  revealElements.forEach(function (element) {
    element.classList.add("reveal");
  });

  if (
    revealElements.length > 0 &&
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("revealed");
    });
  }

  /* =========================================
     BACK TO TOP BUTTON
     ========================================= */

  const backToTopButton = document.createElement("button");

  backToTopButton.className = "back-to-top";
  backToTopButton.type = "button";
  backToTopButton.setAttribute("aria-label", "Return to the top of the page");
  backToTopButton.innerHTML = "↑";

  document.body.appendChild(backToTopButton);

  window.addEventListener(
    "scroll",
    function () {
      backToTopButton.classList.toggle(
        "back-to-top-visible",
        window.scrollY > 600
      );
    },
    { passive: true }
  );

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* =========================================
     EXTERNAL LINKS
     ========================================= */

  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    const linkAddress = new URL(link.href);

    if (linkAddress.hostname !== window.location.hostname) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  /* =========================================
     AUTOMATIC COPYRIGHT YEAR
     ========================================= */

  document.querySelectorAll("footer p").forEach(function (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace(
      /©\s*\d{4}/,
      `© ${new Date().getFullYear()}`
    );
  });
});
