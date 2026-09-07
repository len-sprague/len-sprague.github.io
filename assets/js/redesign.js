// Toggles body.is-scrolled, used by the "moderate" redesign layout to collapse
// its sidebar rail after a short scroll. Inert on "classic"/"extreme" (no CSS
// there reads .is-scrolled), so this is safe to load on every page.
(function () {
  var THRESHOLD = 90; // px of scroll before collapsing

  function update() {
    var scrolled = window.scrollY > THRESHOLD;
    document.body.classList.toggle("is-scrolled", scrolled);
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
})();
