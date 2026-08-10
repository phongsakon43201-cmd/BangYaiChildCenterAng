/* ==========================================================================
   Bang Yai Child Development Center MIS - Supabase Client Integration
   Supabase Database & Authentication Service Provider
   ========================================================================== */

const SUPABASE_CONFIG = {
  url: "https://ytkplzdrckhprzfmemyy.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0a3BsemRyY2tocHJ6Zm1lbXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjg0NTUsImV4cCI6MjEwMTk0NDQ1NX0.qE4S0ZUYMV1cGe5jucu5WFNfa_FV21xk6zb2dFYiuqU"
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.init();
  }

  init() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log('✅ Supabase client initialized successfully with URL:', SUPABASE_CONFIG.url);
    } else {
      console.warn('⚠️ Supabase JS SDK not loaded yet. Will initialize on demand.');
    }
  }

  getClient() {
    if (!this.client && window.supabase) {
      this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    }
    return this.client;
  }

  // Supabase Auth: Sign In with Email & Password
  async signIn(email, password) {
    const client = this.getClient();
    if (!client) {
      return { error: { message: 'Supabase Client is not available' } };
    }
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
      });
      return { data, error };
    } catch (err) {
      return { error: err };
    }
  }

  // Supabase Auth: Sign Up new user with role metadata
  async signUp(email, password, role, fullName) {
    const client = this.getClient();
    if (!client) {
      return { error: { message: 'Supabase Client is not available' } };
    }
    try {
      const { data, error } = await client.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            role: role,
            full_name: fullName
          }
        }
      });
      return { data, error };
    } catch (err) {
      return { error: err };
    }
  }

  // Supabase Auth: Sign Out
  async signOut() {
    const client = this.getClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout notice:', err);
      }
    }
  }

  // Supabase Auth: Get Current Session
  async getSession() {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      return data?.session || null;
    } catch (err) {
      return null;
    }
  }
}

window.supabaseService = new SupabaseService();
