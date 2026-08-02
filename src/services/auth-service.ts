import { createClient } from "@/lib/supabase/client";

export const authService = {
  /**
   * Continue as a Guest
   */
  async signInAnonymously(displayName: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          display_name: displayName,
          is_guest: true,
        },
      },
    });

    if (error) throw error;
    
    // We should also ensure a profile exists
    if (data.user) {
      await this.syncProfile(data.user.id, {
        displayName,
        isGuest: true,
      });
    }

    return data;
  },

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign in with Apple
   */
  async signInWithApple() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign in with Email/Password
   */
  async signInWithEmail(email: string, password?: string) {
    const supabase = createClient();
    
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      // Magic Link
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
      return data;
    }
  },

  /**
   * Sign Out
   */
  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Sync profile after auth
   */
  async syncProfile(id: string, updates: any) {
    const supabase = createClient();
    
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id,
        ...updates,
        updated_at: new Date().toISOString(),
      });

    if (error) console.error("Error syncing profile:", error);
  },

  /**
   * Get current session
   */
  async getSession() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session;
  },

  /**
   * Get current user
   */
  async getUser() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  },
};
