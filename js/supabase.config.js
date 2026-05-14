// =====================================================
// Supabase Configuration (SENSITIVE - DO NOT COMMIT)
// =====================================================
// This file contains sensitive API credentials
// Copy this file as supabase.config.js and add your credentials
// Never commit supabase.config.js to version control

const SUPABASE_CONFIG = {
  url: 'https://xprztwchhoopkpmoiwdh.supabase.co',
  anonKey: 'sb_publishable_1yNJb7umrgVZ_ihVSe6Qsg_Wv29Q_Ap',
  options: {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: { 'x-application-name': 'nadi-scsh' }
    }
  }
};

// Initialize Supabase client
if (typeof window.supabaseClient === 'undefined' && typeof window.supabase !== 'undefined') {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    SUPABASE_CONFIG.options
  );
}
