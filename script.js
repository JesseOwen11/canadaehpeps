/* CanadaEhPeps — script.js (theme toggle + hamburger + support popup) */

/* theme toggle */
(function(){
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var icon = btn.querySelector('.theme-toggle-icon');
  var meta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(t){
    if(t === 'dark'){
      root.setAttribute('data-theme','dark'); root.style.colorScheme = 'dark';
      icon.innerHTML = '☼'; btn.setAttribute('aria-pressed','true');
      if(meta) meta.setAttribute('content','#170F0F');
    } else {
      root.setAttribute('data-theme','light'); root.style.colorScheme = 'light';
      icon.innerHTML = '☽'; btn.setAttribute('aria-pressed','false');
      if(meta) meta.setAttribute('content','#F5E7D9');
    }
  }
  btn.addEventListener('click', function(){
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
  applyTheme('dark');
})();

/* hamburger menu */
(function(){
  var b = document.getElementById('menu-toggle');
  var p = document.getElementById('mobile-menu');
  if(!b || !p) return;
  function close(){ p.setAttribute('data-open','false'); b.setAttribute('aria-expanded','false'); }
  function open(){ p.setAttribute('data-open','true'); b.setAttribute('aria-expanded','true'); }
  b.addEventListener('click', function(){ p.getAttribute('data-open') === 'true' ? close() : open(); });
  p.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
})();

/* support popup — anchored under the clicked Support link */
(function(){
  var o = document.getElementById('support-overlay');
  var pop = document.getElementById('support-pop');
  var cb = document.getElementById('support-close');
  if(!o || !pop || !cb) return;
  function isOpen(){ return o.getAttribute('data-open') === 'true'; }
  function close(){ o.setAttribute('data-open','false'); }
  function positionUnder(el){
    var rectEl = el;
    if(el.closest && el.closest('#mobile-menu')){
      rectEl = document.getElementById('menu-toggle') || el;
    }
    var r = rectEl.getBoundingClientRect();
    var w = Math.min(340, window.innerWidth - 24);
    pop.style.width = w + 'px';
    var left = r.left + r.width / 2 - w / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
    var top = r.bottom + 10;
    var h = pop.offsetHeight || 240;
    if(top + h > window.innerHeight - 12){ top = Math.max(12, r.top - h - 10); }
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }
  document.querySelectorAll('[data-support-open]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      positionUnder(a);
      o.setAttribute('data-open','true');
    });
  });
  cb.addEventListener('click', close);
  o.addEventListener('click', function(e){ if(e.target === o) close(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && isOpen()) close(); });
  window.addEventListener('scroll', function(){ if(isOpen()) close(); }, {passive:true});
  window.addEventListener('resize', function(){ if(isOpen()) close(); });
})();
