// Curseur du comparatif avant/après, fourni par Thomas tel quel : la
// position suit le curseur, et un balayage d'introduction se joue quand la
// section arrive à l'écran (pas si le système demande moins de mouvement).
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.aulne-ba .ba-compare').forEach(function (box) {
    if (box.dataset.ready) return; box.dataset.ready = '1';
    var input = box.querySelector('input'), tb = box.querySelector('.ba-t-before'), ta = box.querySelector('.ba-t-after');
    function set(v) { box.style.setProperty('--pos', v + '%'); tb.style.opacity = v < 14 ? 0 : 1; ta.style.opacity = v > 86 ? 0 : 1; }
    input.addEventListener('input', function () { set(+input.value); });
    set(50);
    if (reduce || !('IntersectionObserver' in window)) return;
    var touched = false;
    input.addEventListener('pointerdown', function () { touched = true; });
    input.addEventListener('keydown', function () { touched = true; });
    // Balayage d'introduction quand la section arrive à l'écran
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return; io.disconnect();
      var keys = [[0, 50], [700, 85], [1500, 18], [2300, 50]], start = performance.now() + 300;
      function ease(t) { return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }
      function tick(now) {
        if (touched) return;
        var t = now - start;
        if (t < 0) return requestAnimationFrame(tick);
        for (var i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
          var v = keys[i-1][1] + (keys[i][1] - keys[i-1][1]) * ease((t - keys[i-1][0]) / (keys[i][0] - keys[i-1][0]));
          input.value = v; set(v); return requestAnimationFrame(tick);
        }
        input.value = 50; set(50);
      }
      requestAnimationFrame(tick);
    }, { threshold: .4 });
    io.observe(box);
  });
})();
