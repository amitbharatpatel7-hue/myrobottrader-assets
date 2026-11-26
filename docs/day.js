/* "How a day works" on how.html: an illustration of the rules, drawn step by step.
   The lines are invented shapes, not market data, and no money figure is shown. */
(function () {
  var svg = document.getElementById('day-svg');
  if (!svg) return;
  var list = document.getElementById('day-steps'), count = document.getElementById('day-count');
  var play = document.getElementById('day-play'), tabs = document.querySelectorAll('.day-tabs button');
  var NS = 'http://www.w3.org/2000/svg', day = 0, step = 0, timer = null;

  function series(anchors) {
    var out = [];
    for (var i = 0; i < 40; i++) {
      var a = anchors[0], b = anchors[anchors.length - 1];
      for (var k = 0; k < anchors.length - 1; k++) {
        if (i >= anchors[k][0] && i <= anchors[k + 1][0]) { a = anchors[k]; b = anchors[k + 1]; break; }
      }
      var t = b[0] === a[0] ? 0 : (i - a[0]) / (b[0] - a[0]);
      var pinned = i === a[0] || i === b[0];
      out.push(a[1] + (b[1] - a[1]) * t + (pinned ? 0 : 0.28 * Math.sin(i * 2.3) + 0.16 * Math.sin(i * 0.9 + 1)));
    }
    return out;
  }

  var DAYS = [
    { prev: 100, lo: 98.5, hi: 110.5, up: true, rangeHi: 106.2, rangeLo: 104.4, entry: 5, stop: 104.4, exit: 39,
      inWord: 'buys', outWord: 'sells before the close',
      s: series([[0, 105], [1, 106.2], [2, 104.4], [3, 105.6], [5, 106.6], [12, 107.4], [20, 106.9], [29, 108.3], [39, 108.9]]),
      steps: [
        ['14:30', 'A share opens well above yesterday’s close, on news.', 1, 0],
        ['14:30 to 14:45', 'The robot waits 15 minutes and marks the high and low so far.', 4, 0],
        ['After 14:45', 'Price closes above that early high. The robot buys.', 6, 1],
        ['Same moment', 'It sets a stop at the early low. If price falls there, it sells.', 6, 2],
        ['Afternoon', 'The robot does nothing more. The rules have no profit target.', 30, 2],
        ['Before the close', 'It sells. Nothing is held overnight.', 40, 3]
      ] },
    { prev: 100, lo: 92.5, hi: 101.5, up: false, rangeHi: 96.9, rangeLo: 95.2, entry: 5, stop: 96.9, exit: 14,
      inWord: 'sells short', outWord: 'stopped out',
      s: series([[0, 96], [1, 96.9], [2, 95.2], [3, 96.1], [5, 94.9], [9, 94.2], [14, 96.9], [25, 97.6], [39, 98.1]]),
      steps: [
        ['14:30', 'A share opens well below yesterday’s close, on news.', 1, 0],
        ['14:30 to 14:45', 'The robot waits 15 minutes and marks the high and low so far.', 4, 0],
        ['After 14:45', 'Price closes below that early low. The robot sells short.', 6, 1],
        ['Same moment', 'It sets a stop at the early high. If price rises there, it buys back.', 6, 2],
        ['Later', 'Price turns and reaches the stop. The robot buys back at a loss and is done with that share for the day.', 15, 3]
      ] },
    { prev: 100, lo: 97, hi: 103, up: true, quiet: true,
      s: series([[0, 100.6], [10, 100.1], [22, 100.9], [39, 100.4]]),
      steps: [
        ['14:30', 'No share on the list opens far enough from yesterday’s close.', 1, 0],
        ['All day', 'The robot does nothing.', 40, 0]
      ] }
  ];

  function el(name, attrs, text) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    svg.appendChild(n);
    return n;
  }

  function draw() {
    var d = DAYS[day], last = d.steps.length - 1, cur = d.steps[step], shown = cur[2], stage = cur[3];
    var X = function (i) { return 30 + i * (580 / 39); };
    var Y = function (p) { return 372 - (p - d.lo) / (d.hi - d.lo) * 344; };
    var font = { 'font-size': 17, 'font-family': 'Poppins,system-ui,sans-serif' };
    function label(x, y, fill, anchor, text, bold) {
      var a = { x: x, y: y, fill: fill, 'text-anchor': anchor };
      for (var k in font) a[k] = font[k];
      if (bold) a['font-weight'] = 700;
      el('text', a, text);
    }
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (!d.quiet && step >= 1) el('rect', { x: 30, y: Y(d.rangeHi), width: X(3) - 30, height: Y(d.rangeLo) - Y(d.rangeHi), fill: '#2E2E36' });
    var pY = Y(d.prev);
    el('line', { x1: 30, y1: pY, x2: 610, y2: pY, stroke: '#B4B4BF', 'stroke-width': 1.5, 'stroke-dasharray': '5 6' });
    label(606, pY + (d.s[0] > d.prev ? 20 : -9), '#B4B4BF', 'end', 'yesterday’s close');
    if (stage >= 2) {
      el('line', { x1: 30, y1: Y(d.stop), x2: 610, y2: Y(d.stop), stroke: '#FF5CCB', 'stroke-width': 2, 'stroke-dasharray': '3 5' });
      label(606, Y(d.stop) + (d.up ? 20 : -9), '#FF5CCB', 'end', 'stop');
    }
    var pts = d.s.slice(0, shown).map(function (p, i) { return X(i).toFixed(1) + ',' + Y(p).toFixed(1); });
    if (shown === 1) pts.push((X(0) + 0.1).toFixed(1) + ',' + Y(d.s[0]).toFixed(1));
    el('polyline', { points: pts.join(' '), fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    if (stage >= 1) {
      el('circle', { cx: X(d.entry), cy: Y(d.s[d.entry]), r: 8, fill: '#00E87A', stroke: '#0B0B0D', 'stroke-width': 3 });
      label(X(d.entry) + 14, Y(d.s[d.entry]) + (d.up ? 24 : -14), '#00E87A', 'start', d.inWord, true);
    }
    if (stage >= 3) {
      el('circle', { cx: X(d.exit), cy: Y(d.s[d.exit]), r: 8, fill: '#EA00AB', stroke: '#0B0B0D', 'stroke-width': 3 });
      label(Math.max(X(d.exit) - 14, 200), Y(d.s[d.exit]) - 14, '#FF5CCB', 'end', d.outWord, true);
    }
    svg.setAttribute('aria-label', 'Illustration, step ' + (step + 1) + ' of ' + d.steps.length + ': ' + cur[1]);

    list.textContent = '';
    d.steps.forEach(function (s, i) {
      var li = document.createElement('li'), t = document.createElement('span'), p = document.createElement('span');
      t.className = 't'; t.textContent = s[0]; p.textContent = s[1];
      li.className = i === step ? 'now' : (i < step ? 'done' : 'todo');
      if (i === step) li.setAttribute('aria-current', 'step');
      li.appendChild(t); li.appendChild(p); list.appendChild(li);
    });
    count.textContent = 'Step ' + (step + 1) + ' of ' + d.steps.length;
    play.textContent = timer ? 'Pause' : (step === last ? 'Replay' : 'Play');
    for (var i = 0; i < tabs.length; i++) tabs[i].setAttribute('aria-pressed', i === day ? 'true' : 'false');
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function go(n) { stop(); step = Math.max(0, Math.min(DAYS[day].steps.length - 1, n)); draw(); }

  document.getElementById('day-back').addEventListener('click', function () { go(step - 1); });
  document.getElementById('day-next').addEventListener('click', function () { go(step + 1); });
  play.addEventListener('click', function () {
    var last = DAYS[day].steps.length - 1;
    if (timer) { stop(); draw(); return; }
    if (step === last) step = 0;
    timer = setInterval(function () {
      if (step + 1 >= last) { step = last; stop(); } else { step += 1; }
      draw();
    }, 1600);
    draw();
  });
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () { stop(); day = +this.getAttribute('data-day'); step = 0; draw(); });
  }
  draw();
})();
