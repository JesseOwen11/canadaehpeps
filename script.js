/* CanadaEhPeps — script.js */

/* active nav pill — the page you're on keeps its white pill */
(function(){
  var path = window.location.pathname.split('/').pop() || 'index.html';
  function samePage(href){
    if(!href || href.charAt(0) === '#') return false;
    var file = href.split('/').pop().split('?')[0].split('#')[0];
    if(file === '') file = 'index.html';
    return file === path;
  }
  document.querySelectorAll('.navlinks a, #mobile-menu a').forEach(function(a){
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

/* ============================================================
   SUPPORT HEADPHONES BUTTON — sits LEFT of the dark-mode button
   (so the dark-mode button is to its right) on every screen size,
   and opens the Support popup.
   ============================================================ */
(function(){
  var cluster = document.querySelector('nav .icon-cluster');
  var themeBtn = document.getElementById('theme-toggle');
  if(!cluster || !themeBtn) return;
  if(cluster.querySelector('.support-headphones')) return;
  var btn = document.createElement('button');
  btn.className = 'icon-btn support-headphones';
  btn.type = 'button';
  btn.setAttribute('data-support-open','');
  btn.setAttribute('aria-label','Support');
  btn.setAttribute('title','Support');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z"/></svg>';
  themeBtn.insertAdjacentElement('beforebegin', btn);
})();

/* ============================================================
   HAMBURGER MENU — order is:
   1) Log in/Log out + Account
   2) page links (mobile only)
   3) FAQ, Learn, Terms, Privacy, Refund policy
   Support is NOT here — it's the headphones button in the bar.
   ============================================================ */
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

  var menu = document.getElementById('mobile-menu');
  if(!menu) return;

  /* pull the original nav links out of the menu */
  var originalLinks = [];
  while(menu.firstChild){ originalLinks.push(menu.firstChild); menu.removeChild(menu.firstChild); }

  /* group 1 — Log in/Log out + Account (always first) */
  var authWrap = document.createElement('div');
  authWrap.className = 'mm-auth';

  var authLink = document.createElement('a');
  authLink.href = '#';
  authLink.textContent = loggedInSync() ? 'Log out' : 'Log in';
  authWrap.appendChild(authLink);

  var acctA = document.createElement('a');
  acctA.href = 'account.html';
  acctA.textContent = 'Account';
  authWrap.appendChild(acctA);

  menu.appendChild(authWrap);

  authLink.addEventListener('click', function(e){
    e.preventDefault();
    if(loggedInSync()){
      if(window.supabase){
        var d = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        d.auth.signOut().then(function(){ window.location.reload(); });
      }
    } else {
      if(typeof window.openSignInModal === 'function'){
        window.openSignInModal();
      } else {
        var pill = document.querySelector('a.icon-btn[href="account.html"]');
        if(pill){ pill.click(); }
      }
    }
  });

  /* group 2 — the page nav links (Support dropped, FAQ moved to info group) */
  var navWrap = document.createElement('div');
  navWrap.className = 'mm-navlinks';
  var faqLink = null;
  originalLinks.forEach(function(node){
    if(node.nodeType !== 1) return;
    if(node.hasAttribute && node.hasAttribute('data-support-open')) return; /* Support now lives in the bar */
    var href = node.getAttribute('href') || '';
    if(href === 'faq.html'){ faqLink = node; return; }
    navWrap.appendChild(node);
  });
  menu.appendChild(navWrap);

  /* group 3 — info links: FAQ, Learn, Terms, Privacy, Refund policy */
  var extraWrap = document.createElement('div');
  extraWrap.className = 'mm-extra';
  if(faqLink){ extraWrap.appendChild(faqLink); }
  var extras = [
    {text:'Learn', href:'learn.html'},
    {text:'Terms', href:'terms.html'},
    {text:'Privacy', href:'privacy.html'},
    {text:'Refund policy', href:'refunds.html'}
  ];
  extras.forEach(function(item){
    var a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.text;
    extraWrap.appendChild(a);
  });
  menu.appendChild(extraWrap);
})();

/* hamburger open/close */
(function(){
  var b = document.getElementById('menu-toggle');
  var p = document.getElementById('mobile-menu');
  if(!b || !p) return;
  function close(){ p.setAttribute('data-open','false'); b.setAttribute('aria-expanded','false'); }
  function open(){ p.setAttribute('data-open','true'); b.setAttribute('aria-expanded','true'); }
  b.addEventListener('click', function(){ p.getAttribute('data-open') === 'true' ? close() : open(); });
  p.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setTimeout(close, 50); });
  });
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

/* account UI — sign-in bubble with Forgot password? + password eye */
(function(){
  var SUPABASE_URL = 'https://wbarnmxyagkomxndorzd.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_0_6PjuyD0hcS2BGB-dEMTg_G7GuwFCR';

  /* password show/hide eye icons */
  var EYE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYE_OFF_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

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
  '.authm .pass-wrap{position:relative; display:block; width:100%; margin-bottom:12px;}' +
  '.authm .pass-wrap input{width:100%; padding-right:46px; margin-bottom:0;}' +
  '.authm .pass-eye{position:absolute; right:7px; top:50%; transform:translateY(-50%); width:32px; height:32px; border:none; background:none; cursor:pointer; color:var(--ink-soft); display:flex; align-items:center; justify-content:center; border-radius:50%;}' +
  '.authm .pass-eye:hover{color:var(--ink); background:rgba(122,43,43,0.10);}' +
  '.authm .pass-eye svg{width:20px; height:20px;}' +
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
      '<span class="pass-wrap">' +
        '<input class="field-input" id="authm-pass" type="password" autocomplete="current-password" placeholder="Password">' +
        '<button type="button" class="pass-eye" data-target="authm-pass" aria-label="Show password">' + EYE_SVG + '</button>' +
      '</span>' +
      '<button class="btn btn-primary" id="authm-btn" style="width:100%;">Sign in</button>' +
      '<div class="authm-msg" id="authm-msg"></div>' +
      '<button class="authm-forgot" id="authm-forgot" type="button">Forgot password?</button>' +
      '<p class="authm-note">Free account — saves your shipping details and order history. No email verification needed. Passwords are at least 8 characters.</p>' +
    '</div>';
  document.body.appendChild(overlay);

  /* show/hide password eye for the sign-in popup */
  var passEye = overlay.querySelector('.pass-eye');
  if(passEye){
    passEye.addEventListener('click', function(){
      var input = document.getElementById(passEye.getAttribute('data-target'));
      if(!input) return;
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      passEye.innerHTML = showing ? EYE_SVG : EYE_OFF_SVG;
      passEye.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  }

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
  window.openSignInModal = openModal;

  document.getElementById('authm-tab-signin').addEventListener('click', function(){ setMode('signin'); });
  document.getElementById('authm-tab-create').addEventListener('click', function(){ setMode('create'); });
  document.getElementById('authm-close').addEventListener('click', closeModal);

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

  if(!window.supabase){
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    document.head.appendChild(s);
  }
})();
