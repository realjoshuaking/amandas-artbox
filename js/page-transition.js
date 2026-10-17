// Amanda's Artbox — page transitions: the whole page (header, content,
// background) fades out together and fades back in together. No flash,
// no mid-fade snap.
(function () {
  var FADE_MS = 300; // matches the CSS transition duration
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fade in: the <head> inline script hid the page before first paint.
  // Wait for a painted frame of the hidden state so the fade always runs.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      setTimeout(function () { root.classList.remove("is-fading"); }, 40);
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
    if (reduceMotion) { window.location.href = url.href; return; }
    root.classList.add("is-fading");
    setTimeout(function () { window.location.href = url.href; }, FADE_MS);
  });
})();
