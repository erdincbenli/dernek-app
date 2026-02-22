// small UX helpers
(function () {
  // highlight current sidebar item
  const path = window.location.pathname;
  document.querySelectorAll(".app-sidebar a.list-group-item").forEach(a => {
    const href = a.getAttribute("href");
    if (href && href !== "/" && path.startsWith(href)) a.classList.add("active");
  });
})();
