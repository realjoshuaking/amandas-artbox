/* STASHED 2026-10-17 — page fade transitions, cut at Joshua's direction.
   Restore: copy this file back to js/page-transition.js, re-add
   <script src="js/page-transition.js"></script> before </body> on all four
   pages, re-add <script>document.documentElement.classList.add("is-fading");</script>
   after the viewport meta in each <head>, and re-add this CSS:

     html { background: #f6f1e6; }
     body { transition: opacity 0.3s ease; }
     html.is-fading body { opacity: 0; }
     @media (prefers-reduced-motion: reduce) { body { transition: none; } }

   Joshua's note for a future version: no white/black flash between pages —
   he wants a seamless direct fade from one page into the next.
*/
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
