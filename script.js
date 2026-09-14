
(function(){
  var els = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();

document.querySelectorAll('.reel').forEach((reel) => {

  const video = reel.querySelector('.reel-video');
  const centerPlay = reel.querySelector('.video-play');
  const playPause = reel.querySelector('.play-pause');
  const stop = reel.querySelector('.stop');

  // Center Play button
  centerPlay.addEventListener('click', () => {
    video.play();
  });

  // Play / Pause
  playPause.addEventListener('click', () => {

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }

  });

  // Stop
  stop.addEventListener('click', () => {

    video.pause();
    video.currentTime = 0;

  });

  // Update play/pause icon
  video.addEventListener('play', () => {

    centerPlay.style.opacity = '0';
    centerPlay.style.pointerEvents = 'none';

    playPause.textContent = '❚❚';

  });

  video.addEventListener('pause', () => {

    centerPlay.style.opacity = '1';
    centerPlay.style.pointerEvents = 'auto';

    playPause.textContent = '▶';

  });

  // When video finishes
  video.addEventListener('ended', () => {

    centerPlay.style.opacity = '1';
    centerPlay.style.pointerEvents = 'auto';

    playPause.textContent = '▶';

  });

});