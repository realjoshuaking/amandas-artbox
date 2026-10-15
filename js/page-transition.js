/* Page transitions: fade out on link click, fade in on load. */
(function () {
  var FADE_MS = 350;

  // Fade in: hide immediately (JS is running), then reveal on next frames.
  document.body.classList.add("is-fading");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.remove("is-fading");
    });
  });

  // Back/forward cache can restore the faded-out state; always reveal.
  window.addEventListener("pageshow", function () {
    document.body.classList.remove("is-fading");
  });

  document.addEventListener("click", function (e) {
    // Let modified clicks (new tab etc.) behave natively.
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
    // Pure in-page anchor: no transition needed.
    if (url.pathname === window.location.pathname && !url.search && url.hash) return;
    e.preventDefault();
    document.body.classList.add("is-fading");
    setTimeout(function () { window.location.href = url.href; }, FADE_MS);
  });
})();
