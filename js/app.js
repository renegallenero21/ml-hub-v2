// ============================================================
//  ML HUB — App Logic
//  Handles: routing, auth, grid, modal, likes, comments
// ============================================================

let currentUser  = null;
let currentId    = null;
let activeFilter = 'All';

// ===========================
//  PAGE ROUTING
// ===========================
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

async function guestAccess() {
  currentUser = { email: 'guest@ml-hub.io' };
  loadDash();
  showPage('page-dashboard');
}

// ===========================
//  AUTH TAB SWITCH
// ===========================
function switchTab(mode) {
  document.getElementById('tab-login').classList.toggle('active',  mode === 'login');
  document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
  document.getElementById('signup-fields').style.display = mode === 'signup' ? 'block' : 'none';
  document.getElementById('auth-btn').textContent = mode === 'login' ? 'Login' : 'Create Account';
  document.getElementById('auth-msg').innerHTML = '';
}

// ===========================
//  AUTH HANDLER (Supabase)
// ===========================
async function handleAuth() {
  const email   = document.getElementById('auth-email').value.trim();
  const pass    = document.getElementById('auth-pass').value;
  const isSignup = document.getElementById('signup-fields').style.display === 'block';
  const msgEl   = document.getElementById('auth-msg');

  // Client-side validation
  if (!email || !pass) {
    msgEl.innerHTML = '<div class="msg err">⚠ Please fill in all fields.</div>'; return;
  }
  if (!email.includes('@')) {
    msgEl.innerHTML = '<div class="msg err">⚠ Invalid email address.</div>'; return;
  }
  if (pass.length < 6) {
    msgEl.innerHTML = '<div class="msg err">⚠ Password must be at least 6 characters.</div>'; return;
  }

  if (isSignup) {
    const pass2 = document.getElementById('auth-pass2').value;
    if (pass !== pass2) {
      msgEl.innerHTML = '<div class="msg err">⚠ Passwords do not match.</div>'; return;
    }
  }

  msgEl.innerHTML = '<div class="msg loading">⏳ Connecting to Supabase...</div>';
  document.getElementById('auth-btn').disabled = true;

  if (isSignup) {
    const { data, error } = await supaSignUp(email, pass);
    document.getElementById('auth-btn').disabled = false;
    if (error) {
      msgEl.innerHTML = `<div class="msg err">⚠ ${error.message}</div>`;
    } else {
      msgEl.innerHTML = '<div class="msg ok">✓ Account created! Logging you in...</div>';
      currentUser = { email };
      setTimeout(() => { loadDash(); showPage('page-dashboard'); }, 800);
    }
  } else {
    const { data, error } = await supaLogin(email, pass);
    document.getElementById('auth-btn').disabled = false;
    if (error) {
      msgEl.innerHTML = `<div class="msg err">⚠ ${error.message}</div>`;
    } else {
      currentUser = { email };
      loadDash();
      showPage('page-dashboard');
    }
  }
}

// ===========================
//  LOGOUT
// ===========================
async function handleLogout() {
  await supaLogout();
  currentUser = null;
  showPage('page-welcome');
  showToast('Logged out successfully');
}

// ===========================
//  DASHBOARD
// ===========================
function loadDash() {
  const email = currentUser?.email || 'guest@ml-hub.io';
  document.getElementById('nav-email').textContent  = email;
  document.getElementById('nav-avatar').textContent = email[0].toUpperCase();
  document.getElementById('cmt-avatar').textContent = email[0].toUpperCase();
  renderGrid();
  updateMeta();
}

function setFilter(tag, el) {
  activeFilter = tag;
  document.querySelectorAll('.fchip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderGrid();
}

function getFiltered() {
  const q = (document.getElementById('search-inp')?.value || '').toLowerCase();
  return PAPERS.filter(p => {
    const matchFilter = activeFilter === 'All' || p.tag === activeFilter;
    const matchQuery  = !q || p.title.toLowerCase().includes(q)
                           || p.authors.toLowerCase().includes(q)
                           || p.institution.toLowerCase().includes(q)
                           || p.tags.some(t => t.toLowerCase().includes(q));
    return matchFilter && matchQuery;
  });
}

function renderGrid() {
  const grid   = document.getElementById('research-grid');
  const noRes  = document.getElementById('no-results');
  const papers = getFiltered();

  if (!papers.length) {
    grid.innerHTML = '';
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';

  grid.innerHTML = papers.map(p => `
    <div class="r-card" onclick="openModal(${p.id})">
      <div class="r-card-top">
        <span class="r-tag">${p.tag}</span>
        <span class="r-year">${p.year}</span>
      </div>
      <div class="r-title">${p.title}</div>
      <div class="r-authors">${p.authors.split(',')[0].trim()}${p.authors.includes(',') ? ' et al.' : ''}</div>
      <div class="r-institution">${p.institution}</div>
      <div class="r-abstract">${p.abstract.substring(0, 130)}...</div>
      <div class="r-pills">${p.tags.map(t => `<span class="r-pill">${t}</span>`).join('')}</div>
      <div class="r-footer">
        <div class="r-btns">
          <button class="r-btn ${p.liked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike(${p.id})">
            ♥ <span id="rlikes-${p.id}">${p.likes}</span>
          </button>
          <button class="r-btn" onclick="event.stopPropagation(); openModal(${p.id})">
            💬 <span id="rcmts-${p.id}">${p.comments.length}</span>
          </button>
        </div>
        <div style="display:flex;align-items:center;gap:.6rem;">
          <span class="r-cite">📚 ${p.citations.toLocaleString()}</span>
          <button class="r-view">View →</button>
        </div>
      </div>
    </div>
  `).join('');
}

function updateMeta() {
  document.getElementById('meta-likes').textContent = PAPERS.reduce((a, p) => a + p.likes, 0);
  document.getElementById('meta-cmts').textContent  = PAPERS.reduce((a, p) => a + p.comments.length, 0);
}

// ===========================
//  LIKES
// ===========================
function toggleLike(id) {
  const p = PAPERS.find(x => x.id === id);
  if (!p) return;
  p.liked  = !p.liked;
  p.likes += p.liked ? 1 : -1;

  // Update card
  const rl = document.getElementById('rlikes-' + id);
  if (rl) rl.textContent = p.likes;

  // Update modal if open
  if (currentId === id) {
    document.getElementById('m-likes').textContent = p.likes;
    document.getElementById('m-like-btn').classList.toggle('liked', p.liked);
  }
  updateMeta();
  showToast(p.liked ? '♥ Liked!' : 'Unliked');
}

// ===========================
//  MODAL
// ===========================
function openModal(id) {
  currentId = id;
  const p   = PAPERS.find(x => x.id === id);
  if (!p) return;

  document.getElementById('m-tag').textContent         = p.tag;
  document.getElementById('m-year').textContent        = p.year;
  document.getElementById('m-title').textContent       = p.title;
  document.getElementById('m-authors').textContent     = p.authors;
  document.getElementById('m-institution').textContent = p.institution;
  document.getElementById('m-journal').textContent     = p.journal;
  document.getElementById('m-doi').textContent         = p.doi;
  document.getElementById('m-cites').textContent       = p.citations.toLocaleString();
  document.getElementById('m-likes').textContent       = p.likes;
  document.getElementById('m-abstract').textContent    = p.abstract;
  document.getElementById('m-methodology').textContent = p.methodology;
  document.getElementById('m-results').textContent     = p.results;
  document.getElementById('m-impact').textContent      = p.impact;

  document.getElementById('m-like-btn').className = 'act-btn' + (p.liked ? ' liked' : '');
  document.getElementById('m-url').textContent    = `https://ml-hub.vercel.app/paper/${id}`;

  document.getElementById('m-contributions').innerHTML =
    p.keyContributions.map(c => `<li>${c}</li>`).join('');

  document.getElementById('m-tags').innerHTML =
    p.tags.map(t => `<span class="dtag">${t}</span>`).join('');

  // Reset to abstract tab
  switchDTab('abstract', document.querySelector('.dtab'));

  renderComments(id);
  document.getElementById('modal').classList.add('open');
  document.querySelector('.modal-box').scrollTop = 0;
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  currentId = null;
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

// ===========================
//  DETAIL TABS
// ===========================
function switchDTab(name, el) {
  document.querySelectorAll('.dtab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dcontent').forEach(c => c.classList.remove('active'));

  if (el) el.classList.add('active');
  else {
    const order = ['abstract','contributions','methodology','results','impact'];
    const i     = order.indexOf(name);
    const tabs  = document.querySelectorAll('.dtab');
    if (tabs[i]) tabs[i].classList.add('active');
  }
  const target = document.getElementById('dt-' + name);
  if (target) target.classList.add('active');
}

// ===========================
//  COMMENTS
// ===========================
function renderComments(id) {
  const p   = PAPERS.find(x => x.id === id);
  const el  = document.getElementById('comments-list');
  document.getElementById('m-cmt-count').textContent = p.comments.length + ' comment' + (p.comments.length !== 1 ? 's' : '');

  if (!p.comments.length) {
    el.innerHTML = '<div class="no-cmt">No comments yet — start the discussion!</div>';
    return;
  }
  el.innerHTML = p.comments.map(c => `
    <div class="cmt-item">
      <div class="cmt-user">${c.user}</div>
      <div class="cmt-text">${escHtml(c.text)}</div>
      <div class="cmt-time">${c.time}</div>
    </div>
  `).join('');
}

function submitComment() {
  if (currentId === null) return;
  const inp  = document.getElementById('cmt-inp');
  const text = inp.value.trim();
  if (!text) { inp.focus(); return; }

  const user = currentUser?.email || 'guest@ml-hub.io';
  const p    = PAPERS.find(x => x.id === currentId);
  p.comments.push({
    user,
    text,
    time: new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
  });
  inp.value = '';
  renderComments(currentId);

  const rc = document.getElementById('rcmts-' + currentId);
  if (rc) rc.textContent = p.comments.length;
  updateMeta();
  showToast('Comment posted!');
}

// ===========================
//  SHARE / COPY
// ===========================
function copyLink() {
  const url = document.getElementById('m-url').textContent;
  navigator.clipboard.writeText(url).catch(() => {});
  showToast('🔗 Link copied to clipboard!');
}

// ===========================
//  UTILITIES
// ===========================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => { t.style.display = 'none'; }, 2400);
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
