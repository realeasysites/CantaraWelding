(function () {
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle'), nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { var o = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', o); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); } });
  }

  // Gallery
  var g = document.getElementById('gallery'), all = window.GALLERY || [], shown = [];
  var CAT = { railings: 'Railings', stairs: 'Stairs & Landings', structural: 'Structural Steel', canopies: 'Canopies', equipment: 'Equipment & Custom' };
  var featuredSizes = ['wide', 'tall', '', '', 'wide', '', '', 'tall', '', 'wide', '', ''];

  function render(list, featured) {
    shown = list; g.innerHTML = '';
    list.forEach(function (item, i) {
      var fig = document.createElement('figure');
      fig.className = 'tile ' + (featured ? (featuredSizes[i] || '') : '');
      fig.dataset.i = i;
      var img = document.createElement('img'); img.src = '/images/' + item.img; img.alt = item.title; img.loading = 'lazy';
      var cap = document.createElement('figcaption');
      var b = document.createElement('b'); b.textContent = item.title;
      var s = document.createElement('span'); s.textContent = CAT[item.cat] || '';
      cap.appendChild(b); cap.appendChild(s); fig.appendChild(img); fig.appendChild(cap); g.appendChild(fig);
    });
  }

  if (g) {
    if (g.dataset.mode === 'featured') {
      render(all.filter(function (x) { return x.featured; }).sort(function (a, b) { return a.featured - b.featured; }), true);
    } else {
      render(all, false);
      var f = document.getElementById('filters');
      if (f) f.addEventListener('click', function (e) {
        var btn = e.target.closest('button'); if (!btn) return;
        f.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === btn); });
        var c = btn.dataset.cat;
        render(c === 'all' ? all : all.filter(function (x) { return x.cat === c; }), false);
      });
    }

    // Lightbox
    var lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p'), cur = 0;
    function show(i) { cur = (i + shown.length) % shown.length; lbImg.src = '/images/' + shown[cur].img; lbImg.alt = shown[cur].title; lbCap.textContent = shown[cur].title; }
    function open(i) { show(i); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); }
    function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
    g.addEventListener('click', function (e) { var t = e.target.closest('.tile'); if (t) open(+t.dataset.i); });
    lb.querySelector('.lb-close').onclick = close;
    lb.querySelector('.lb-prev').onclick = function () { show(cur - 1); };
    lb.querySelector('.lb-next').onclick = function () { show(cur + 1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  // Service links preselect the project type
  var sel = document.getElementById('projectType');
  document.querySelectorAll('[data-project]').forEach(function (a) {
    a.addEventListener('click', function () { if (sel) sel.value = a.getAttribute('data-project'); });
  });

  // Quote form
  var form = document.getElementById('quoteForm'), status = document.getElementById('formStatus');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.phone) { status.className = 'form-status err'; status.textContent = 'Please add your name and phone number.'; return; }
    var btn = form.querySelector('button'); btn.disabled = true; btn.textContent = 'Sending…';
    fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.j.error || 'Something went wrong.');
        form.reset(); status.className = 'form-status ok';
        status.textContent = "You're on the board — we'll be in touch soon. Want to speed it up? Text photos of the job to (207) 651-8730.";
      })
      .catch(function (err) { status.className = 'form-status err'; status.textContent = err.message + ' You can also call or text (207) 651-8730.'; })
      .finally(function () { btn.disabled = false; btn.textContent = 'Send My Quote Request'; });
  });
})();
