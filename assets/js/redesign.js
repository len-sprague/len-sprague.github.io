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
// its execution relative to plain scripts like this one in a way that
// isn't safe to assume an order for - in testing, its ready-handler
// actually ran *after* the window "load" event fired, the opposite of
// what the HTML spec's module-deferral rules would suggest. That legacy
// code still runs unconditionally and can write html[data-theme] and
// swap #theme-icon's class - harmless to the actual page colors (see
// _sass/_redesign.scss section 3 for why), but not to the icon, which
// has no such protection.
//
// Rather than chase a reliable "runs after the legacy code" event - there
// isn't one - the icon just heals itself: a MutationObserver watches its
// class and re-derives the correct icon any time something external
// changes it, regardless of when that happens. Only the click itself is
// actually blocked (capture-phase + stopImmediatePropagation, which don't
// depend on script ordering either), since that's the one case where
// letting the legacy write happen at all - even briefly - would be a
// visible flash of the wrong icon on every single click.
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

  function syncIcon() {
    var icon = document.getElementById("theme-icon");
    if (!icon) return;
    var wantDark = effectiveMode(currentMode()) === "dark";
    // Idempotent: if the icon already matches, this is a no-op and the
    // MutationObserver below won't re-fire for it - no infinite loop.
    if (icon.classList.contains("fa-moon") !== wantDark) {
      icon.classList.toggle("fa-moon", wantDark);
      icon.classList.toggle("fa-sun", !wantDark);
    }
  }

  function applyMode(mode) {
    html.setAttribute("data-mode", mode);
    syncIcon();
  }

  // Apply any stored preference immediately - overrides the server-rendered
  // color_mode default from _config.yml for a returning visitor who already
  // made a choice.
  applyMode(currentMode());

  // Self-heal the icon against any later external change (see file header).
  var themeIcon = document.getElementById("theme-icon");
  if (themeIcon && window.MutationObserver) {
    new MutationObserver(syncIcon).observe(themeIcon, { attributes: true, attributeFilter: ["class"] });
  }

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
    e.stopImmediatePropagation(); // block the legacy data-theme click handler in _main.js

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
