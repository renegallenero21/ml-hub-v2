// ============================================================
//  ML HUB — Supabase Configuration
//  Project: renegallenero21's Project
//  URL: https://fhzltitadyigkcgbjqnj.supabase.co
// ============================================================

const SUPABASE_URL  = "https://fhzltitadyigkcgbjqnj.supabase.co";
const SUPABASE_KEY  = "sb_publishable_9QH4g9n68cDBqcgp-fp41A_jWYuPFj-";   // publishable / anon key — safe for browser

// Initialize Supabase client
const _db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// -------------------------------------------------------
//  AUTH HELPERS
// -------------------------------------------------------

async function supaSignUp(email, password) {
  const { data, error } = await _db.auth.signUp({ email, password });
  return { data, error };
}

async function supaLogin(email, password) {
  const { data, error } = await _db.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function supaLogout() {
  const { error } = await _db.auth.signOut();
  return { error };
}

async function supaGetUser() {
  const { data: { user } } = await _db.auth.getUser();
  return user;
}

// Listen for auth state changes
_db.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    currentUser = null;
    showPage('page-welcome');
  }
});
