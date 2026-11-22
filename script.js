(() => {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll(".project-card");
  const projectCount = document.getElementById("project-count");
  const dialog = document.getElementById("project-dialog");
  const dialogClose = document.getElementById("dialog-close");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogDescription = document.getElementById("dialog-description");
  const dialogKicker = document.getElementById("dialog-kicker");
  const dialogTags = document.getElementById("dialog-tags");
  const dialogLink = document.getElementById("dialog-link");

  const projectDetails = {
    chat: {
      name: "F-Chat",
      status: "In development",
      description: "F-Chat is a web communication project built around real-time messaging and calling. Its development explores Supabase-based features, web notifications, and a better chatting experience.",
      tags: ["Communication", "Web app", "Supabase"],
      url: null
    },
    ai: {
      name: "F-Intelligence",
      status: "In development",
      description: "F-Intelligence is a place to experiment with artificial intelligence, learn how models work, and build practical AI-powered experiences through small, iterative projects.",
      tags: ["AI", "Experiments", "Learning"],
      url: null
    },
    base: {
      name: "F-Base",
      status: "Prototype",
      description: "F-Base explores how a custom backend, authentication flow, and data storage could work together as a foundation for other F-Series experiences. This is an experimental prototype, not a production service.",
      tags: ["Backend", "Data", "Prototype"],
      url: "https://github.com/ifaizan2487-dev/F-Base"
    }
  };

  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#080d19" : "#f7f9fd";
  }

  try {
    const savedTheme = localStorage.getItem("f-series-theme");
    if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);
  } catch (_) { /* Theme persistence is optional in restricted browsers. */ }

  themeButton.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try { localStorage.setItem("f-series-theme", nextTheme); } catch (_) {}
  });

  function closeMenu() {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  }

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("is-open", !expanded);
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const chosen = button.dataset.filter;
      let count = 0;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      projectCards.forEach((card) => {
        const matches = chosen === "all" || card.dataset.category === chosen;
        card.hidden = !matches;
        if (matches) count += 1;
      });
      projectCount.textContent = `${String(count).padStart(2, "0")} ${count === 1 ? "project" : "projects"}`;
    });
  });

  document.querySelectorAll("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = projectDetails[button.dataset.modal];
      if (!item) return;
      dialogKicker.textContent = item.status.toUpperCase() + " / PROJECT DETAILS";
      dialogTitle.textContent = item.name;
      dialogDescription.textContent = item.description;
      dialogTags.replaceChildren();
      item.tags.forEach((tag) => {
        const label = document.createElement("span");
        label.textContent = tag;
        dialogTags.append(label);
      });
      dialogLink.hidden = !item.url;
      if (item.url) dialogLink.href = item.url;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else alert(`${item.name}\n\n${item.description}`);
    });
  });
  dialogClose.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
