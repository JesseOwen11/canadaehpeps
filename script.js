/* CanadaEhPeps — script.js */

/* active nav pill — the page you're on keeps its white pill (incl. Account) */
(function(){
  var path = window.location.pathname.split('/').pop() || 'index.html';
  function samePage(href){
    if(!href || href.charAt(0) === '#') return false;
    var file = href.split('/').pop().split('?')[0].split('#')[0];
    if(file === '') file = 'index.html';
    return file === path;
  }
  document.querySelectorAll('.navlinks a, #mobile-menu a, a.icon-btn[href="account.html"]').forEach(function(a){
    if(samePage(a.getAttribute('href'))){ a.classList.add('nav-active'); }
  });
})();

/* one-click action buttons — solid red with white text (matched by label) */
(function(){
  function mark(){
    document.querySelectorAll('button, input[type="submit"], input[type="button"]').forEach(function(b){
      var t = ((b.textContent || '') + ' ' + (b.value || '')).trim().toLowerCase();
      if(t === 'update email' || t === 'update password' || t === 'save address' || t === 'sign out' || t === 'delete my account'){
        b.classList.add('acct-red-btn');
      }
    });
  }
  mark();
  setTimeout(mark, 300);
  setTimeout(mark, 1000);
})();

/* admin top bar — User accounts button turns white while its view is open */
(function(){
  var barBtn = document.getElementById('users-bar-btn');
  var usersTab = document.getElementById('users-tab');
  if(!barBtn || !usersTab) return;
  new MutationObserver(function(){
    barBtn.classList.toggle('bar-active', usersTab.style.display !== 'none');
  }).observe(usersTab, { attributes: true, attributeFilter: ['style'] });
})();

/* View cart button — make sure Group Buys has one, and it's always readable */
(function(){
  var path = window.location.pathname.split('/').pop() || 'index.html';
  if(path !== 'bulk-orders.html' && path !== 'group-buys.html') return;

  var existing = null;
  document.querySelectorAll('a').forEach(function(a){
    if((a.textContent || '').trim().toLowerCase().indexOf('view cart') !== -1){ existing = a; }
  });
  if(existing){ existing.classList.add('view-cart-btn'); return; }

  var footer = document.querySelector('footer');
  if(!footer) return;
  var wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.style.paddingTop = '10px';
  wrap.style.paddingBottom = '46px';
  var cta = document.createElement('div');
  cta.className = 'cart-cta';
  var link = document.createElement('a');
  link.className = 'btn btn-ghost view-cart-btn';
  link.href = 'cart.html';
  link.textContent = 'View cart →';
  cta.appendChild(link);
  wrap.appendChild(cta);
  footer.parentNode.insertBefore(wrap, footer);
})();

/* REMOVE SHIPPING ESTIMATOR and all shipping-estimate wording */
(function(){
  var path = window.location.pathname.split('/').pop() || 'index.html';

  if(path === 'cart.html'){
    document.querySelectorAll('h3').forEach(function(h){
      if((h.textContent || '').trim().toLowerCase() === 'shipping estimate'){
        var box = h.parentElement;
        if(box){ box.style.display = 'none'; }
      }
    });
    document.querySelectorAll('.section-head p').forEach(function(p){
      if((p.textContent || '').toLowerCase().indexOf('estimate shipping') !== -1){
        p.textContent = 'Bulk products and group-buy kits together, eh. Review and place the order — nothing is owed until we confirm.';
      }
    });
  }

  if(path === 'bulk-orders.html'){
    document.querySelectorAll('h4').forEach(function(h4){
      if((h4.textContent || '').trim().toLowerCase() === 'shipping'){
        var term = h4.parentElement;
        var p = term ? term.querySelector('p') : null;
        if(p){ p.textContent = 'Canada Post from Ontario, discreet packaging.'; }
      }
    });
  }
})();

/* theme toggle */
(function(){
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  if(!btn) return;
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
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('cep_theme', next); } catch(e){}
  });
  var saved = null;
  try { saved = localStorage.getItem('cep_theme'); } catch(e){}
  applyTheme(saved === 'light' ? 'light' : 'dark');
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

/* support popup */
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

/* account UI — sign-in bubble with Forgot password? */
(function(){
  var SUPABASE_URL = 'https://wbarnmxyagkomxndorzd.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_0_6PjuyD0hcS2BGB-dEMTg_G7GuwFCR';

  function loggedInSync(){
    try{
      for(var i=0;i<localStorage.length;i++){
        var k = localStorage.key(i);
        if(k && /^sb-.*-auth-token$/.test(k)){
          var v = localStorage.getItem(k);
          if(v && v.indexOf('access_token') !== -1){ return true; }
        }
      }
    }catch(e){}
    return false;
  }

  var css =
  'a.acct-pill{display:inline-flex; align-items:center; gap:7px; width:auto; height:auto; padding:8px 15px; border:2px solid var(--ink); border-radius:999px; background:var(--panel); transition:all .15s;}' +
  'a.acct-pill:hover{background:var(--plum); border-color:var(--plum); color:#fff;}' +
  'a.acct-pill svg{width:15px; height:15px;}' +
  '.acct-pill-label{font-family:"Space Mono",monospace; font-size:0.6rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:inherit;}' +
  'a.acct-logout{background:var(--bg);}' +
  'a.icon-btn[href="account.html"]:not(.acct-pill){visibility:visible !important;}' +
  '.authm-overlay{position:fixed; inset:0; background:rgba(23,15,15,0.55); display:none; align-items:center; justify-content:center; z-index:200; padding:18px;}' +
  '.authm-overlay[data-open="true"]{display:flex;}' +
  '.authm{position:relative; background:var(--panel); border:2px solid var(--ink); border-radius:var(--r-lg); padding:30px 26px 26px; width:100%; max-width:410px; box-shadow:0 18px 50px rgba(0,0,0,0.35);}' +
  '.authm-close{position:absolute; top:10px; right:10px;}' +
  '.authm h3{font-size:1.4rem; margin-bottom:16px;}' +
  '.authm-tabs{display:flex; gap:8px; margin-bottom:16px;}' +
  '.authm-tab{flex:1; padding:10px 6px; border-radius:var(--r-pill); border:2px solid var(--ink); background:var(--bg); font-family:"Space Mono",monospace; font-size:0.6rem; font-weight:700; cursor:pointer; color:var(--ink-soft); text-transform:uppercase; letter-spacing:0.04em;}' +
  '.authm-tab.active{background:var(--plum); color:#fff; border-color:var(--plum);}' +
  '.authm .field-input{margin-bottom:12px;}' +
  '.authm-msg{color:var(--rust-deep); font-size:0.8rem; font-weight:700; margin-top:10px; min-height:1.1em;}' +
  '.authm-msg.ok{color:var(--ink-soft);}' +
  '.authm-forgot{display:block; margin:12px auto 0; background:none; border:none; color:var(--rust-deep); font-family:"Space Mono",monospace; font-size:0.68rem; font-weight:700; cursor:pointer; text-decoration:underline; padding:0;}' +
  '.authm-note{font-size:0.72rem; color:var(--ink-soft); margin-top:12px; font-weight:500; line-height:1.45;}';
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var acctLink = document.querySelector('a.icon-btn[href="account.html"]');
  if(acctLink){
    acctLink.classList.add('acct-pill');
    var label = document.createElement('span');
    label.className = 'acct-pill-label';
    label.textContent = 'Account';
    acctLink.appendChild(label);
    acctLink.setAttribute('title', 'Your account');
  }

  var overlay = document.createElement('div');
  overlay.className = 'authm-overlay';
  overlay.id = 'authm-overlay';
  overlay.setAttribute('data-open', 'false');
  overlay.innerHTML =
    '<div class="authm" role="dialog" aria-label="Sign in or create account">' +
      '<button class="icon-btn authm-close" id="authm-close" aria-label="Close">✕</button>' +
      '<h3>Your account</h3>' +
      '<div class="authm-tabs">' +
        '<button class="authm-tab active" id="authm-tab-signin" type="button">Sign in</button>' +
        '<button class="authm-tab" id="authm-tab-create" type="button">Create account</button>' +
      '</div>' +
      '<input class="field-input" id="authm-email" type="email" autocomplete="email" placeholder="Email">' +
      '<input class="field-input" id="authm-pass" type="password" autocomplete="current-password" placeholder="Password">' +
      '<button class="btn btn-primary" id="authm-btn" style="width:100%;">Sign in</button>' +
      '<div class="authm-msg" id="authm-msg"></div>' +
      '<button class="authm-forgot" id="authm-forgot" type="button">Forgot password?</button>' +
      '<p class="authm-note">Free account — saves your shipping details and order history. No email verification needed. Passwords are at least 8 characters.</p>' +
    '</div>';
  document.body.appendChild(overlay);

  var db = null;
  function getDb(){
    if(!db && window.supabase){ db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); }
    return db;
  }

  var mode = 'signin';
  var msg = document.getElementById('authm-msg');
  var authBtn = document.getElementById('authm-btn');

  function setMode(m){
    mode = m;
    document.getElementById('authm-tab-signin').classList.toggle('active', m === 'signin');
    document.getElementById('authm-tab-create').classList.toggle('active', m === 'create');
    authBtn.textContent = m === 'signin' ? 'Sign in' : 'Create account';
    document.getElementById('authm-pass').setAttribute('autocomplete', m === 'signin' ? 'current-password' : 'new-password');
    msg.classList.remove('ok');
    msg.textContent = '';
  }
  function openModal(){ overlay.setAttribute('data-open','true'); msg.textContent=''; }
  function closeModal(){ overlay.setAttribute('data-open','false'); }

  document.getElementById('authm-tab-signin').addEventListener('click', function(){ setMode('signin'); });
  document.getElementById('authm-tab-create').addEventListener('click', function(){ setMode('create'); });
  /* the ✕ is the ONLY way to dismiss the bubble (besides signing in) */
  document.getElementById('authm-close').addEventListener('click', closeModal);

  if(acctLink){
    acctLink.addEventListener('click', function(e){
      e.preventDefault();
      var d = getDb();
      if(!d){ window.location.href = 'account.html'; return; }
      d.auth.getSession().then(function(r){
        if(r.data && r.data.session){ window.location.href = 'account.html'; }
        else { openModal(); }
      });
    });
  }

  authBtn.addEventListener('click', function(){
    var d = getDb();
    if(!d){ msg.textContent = 'Connection problem — refresh and try again.'; return; }
    var email = document.getElementById('authm-email').value.trim();
    var pass = document.getElementById('authm-pass').value;
    msg.classList.remove('ok');
    msg.textContent = '';
    if(!email || !pass){ msg.textContent = 'Enter your email and password.'; return; }
    if(pass.length < 8){ msg.textContent = 'Password must be at least 8 characters.'; return; }
    authBtn.disabled = true;

    if(mode === 'signin'){
      d.auth.signInWithPassword({ email: email, password: pass }).then(function(r){
        if(r.error){
          msg.textContent = 'Could not sign in — check your email and password.';
          authBtn.disabled = false;
          return;
        }
        window.location.href = 'index.html';
      });
    } else {
      d.auth.signUp({ email: email, password: pass }).then(function(r){
        if(r.error){
          msg.textContent = 'Could not create account: ' + r.error.message;
          authBtn.disabled = false;
          return;
        }
        if(r.data.session){
          d.from('profiles').insert({ id: r.data.user.id, email: email }).then(function(){
            window.location.href = 'index.html';
          });
        } else {
          msg.classList.add('ok');
          msg.textContent = 'Account created — now sign in.';
          setMode('signin');
          authBtn.disabled = false;
        }
      });
    }
  });

  document.getElementById('authm-pass').addEventListener('keydown', function(e){
    if(e.key === 'Enter'){ authBtn.click(); }
  });

  /* Forgot password? — email a reset link */
  document.getElementById('authm-forgot').addEventListener('click', function(){
    var d = getDb();
    if(!d){ msg.textContent = 'Connection problem — refresh and try again.'; return; }
    var email = document.getElementById('authm-email').value.trim();
    msg.classList.remove('ok');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      msg.textContent = 'Type your account email in the box above first, then click "Forgot password?".';
      return;
    }
    msg.textContent = 'Sending reset link…';
    d.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/account.html' }).then(function(r){
      if(r.error){
        msg.textContent = 'Could not send reset link: ' + r.error.message;
      } else {
        msg.classList.add('ok');
        msg.textContent = 'Reset link sent to ' + email + '. Check your inbox (and spam folder).';
      }
    });
  });

  /* Log out pill — built synchronously so it appears with the page, no pop-in */
  function buildLogout(){
    if(!acctLink || document.querySelector('a.acct-logout')) return;
    var out = document.createElement('a');
    out.href = '#';
    out.className = 'acct-pill acct-logout';
    out.setAttribute('title', 'Log out');
    var lbl = document.createElement('span');
    lbl.className = 'acct-pill-label';
    lbl.textContent = 'Log out';
    out.appendChild(lbl);
    out.addEventListener('click', function(e){
      e.preventDefault();
      var d = getDb();
      if(d){ d.auth.signOut().then(function(){ window.location.reload(); }); }
    });
    acctLink.parentNode.insertBefore(out, acctLink.nextSibling);
  }
  if(loggedInSync()){ buildLogout(); }

  /* background check: reconcile if the instant read and the real session disagree */
  (function(){
    var d = getDb();
    if(!d || !acctLink) return;
    d.auth.getSession().then(function(r){
      var has = !!(r.data && r.data.session);
      var el = document.querySelector('a.acct-logout');
      if(has && !el){ buildLogout(); }
      else if(!has && el){ el.parentNode.removeChild(el); }
    });
  })();

  if(!window.supabase){
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    document.head.appendChild(s);
  }
})();
