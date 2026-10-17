// Amanda's Artbox — smooth page transitions.
// The <head> inline script hides <main>/<footer> before first paint, so the
// fade-in below starts from invisible with no flash. Fade-out runs to
// completion before navigating, so there is no mid-fade snap.
(function () {
  var FADE_OUT_MS = 250; // matches the CSS transition duration
  var root = document.documentElement;

  // Fade in: reveal on the next frames; the transition does the work.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      root.classList.remove("is-fading");
    });
  });

  // Back/forward cache restores: fade back in smoothly.
  window.addEventListener("pageshow", function () {
    root.classList.remove("is-fading");
  });

  document.addEventListener("click", function (e) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var link = e.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || link.target === "_blank") return;
    if (/^(mailto|tel|sms):/i.test(href)) return;
    var url;
    try { url = new URL(href, window.location.href); }
    catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && !url.search && url.hash) return;
    e.preventDefault();
    root.classList.add("is-fading");
    setTimeout(function () { window.location.href = url.href; }, FADE_OUT_MS);
  });
})();
