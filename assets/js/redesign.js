// ==========================================================================
// Dark/light toggle for the redesign's color schemes
// ==========================================================================
//
// The masthead's sun/moon button (#theme-toggle) was originally built for
// the legacy toggle in assets/js/_main.js, which drives html[data-theme].
// The redesign's color schemes (_sass/_redesign.scss) key off a different
// attribute, html[data-mode], on purpose (see that file for why data-theme
// was avoided). So this button is repointed here to drive data-mode instead
// - same button, same icon, different attribute underneath.
//
// assets/js/_main.js is loaded as `<script type="module">`, which defers
// its execution until after the document has parsed - meaning it can run
// either before or after this plain, synchronously-executed script,
// depending on network timing. Rather than race to unbind its click
// handler (unreliable either way), this listens on `document` in the
// capture phase with stopImmediatePropagation(), which always runs before
// any bubble-phase handler on the button itself, regardless of which
// script attached its listener first.
(function () {
  var STORAGE_KEY = "color_mode";
  var html = document.documentElement;

  function effectiveMode(mode) {
    if (mode === "auto") {
      return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark" : "light";
    }
    return mode;
  }

  function currentMode() {
    try {
      return localStorage.getItem(STORAGE_KEY) || html.getAttribute("data-mode") || "auto";
    } catch (e) {
      return html.getAttribute("data-mode") || "auto";
    }
  }

  function applyMode(mode) {
    html.setAttribute("data-mode", mode);
    var icon = document.getElementById("theme-icon");
    if (icon) {
      var isDark = effectiveMode(mode) === "dark";
      icon.classList.toggle("fa-moon", isDark);
      icon.classList.toggle("fa-sun", !isDark);
    }
  }

  // Apply any stored preference immediately - overrides the server-rendered
  // color_mode default from _config.yml for a returning visitor who already
  // made a choice.
  applyMode(currentMode());

  // Live-update when mode is "auto" and the OS preference changes.
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (currentMode() === "auto") {
        applyMode("auto");
      }
    });
  }

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest && e.target.closest("#theme-toggle");
    if (!toggle) return;

    e.preventDefault();
    e.stopImmediatePropagation(); // block the legacy data-theme handler in _main.js

    var next = effectiveMode(currentMode()) === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      // localStorage unavailable (private mode, etc.) - the click still
      // toggles for this page view, it just won't persist.
    }
    applyMode(next);
  }, true); // capture phase
})();


// ==========================================================================
// "Moderate" layout - collapsing sidebar rail
// ==========================================================================
// Toggles body.is-scrolled. Inert on "classic"/"extreme" (no CSS there
// reads .is-scrolled), so this is safe to load on every page.
(function () {
  var THRESHOLD = 90; // px of scroll before collapsing

  function update() {
    var scrolled = window.scrollY > THRESHOLD;
    document.body.classList.toggle("is-scrolled", scrolled);
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
})();
