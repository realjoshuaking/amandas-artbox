/* About page background: plays the ink-bleed video once, then swaps to
   the last frame as a still image. Both share the .about-bg geometry,
   so the swap is pixel-identical with no flash or resize. */
(function () {
  var video = document.getElementById("about-bg-video");
  var still = document.getElementById("about-bg-still");
  if (!video || !still) return;

  function showStill() {
    if (still.classList.contains("show")) return;
    still.classList.add("show");
    video.classList.add("hide");
    try {
      video.pause();
      video.removeAttribute("src");
      video.load();
    } catch (e) { /* release the video resource; the still stays */ }
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    showStill();
    return;
  }

  video.addEventListener("ended", showStill);
  video.addEventListener("error", showStill);

  // If autoplay is blocked, fall back to the still frame immediately.
  var attempt = video.play();
  if (attempt && typeof attempt.catch === "function") {
    attempt.catch(showStill);
  }
})();
