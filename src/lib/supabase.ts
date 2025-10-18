import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type UserRole = 'resident' | 'store' | 'service_provider' | 'rider' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  is_outside_estate: boolean;
  is_approved: boolean;
  hours_of_operation?: string;
  service_category?: string;
  created_at: string;
  updated_at: string;
}

export const authHelpers = {
  async signUp(email: string, password: string, userData: {
    full_name: string;
    phone_number: string;
    role: UserRole;
    is_outside_estate: boolean;
    service_category?: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: userData,
      },
    });

    if (error) throw error;
    
    // Create profile after signup
    if (data.user) {
      const profileData: any = {
        id: data.user.id,
        full_name: userData.full_name,
        phone_number: userData.phone_number,
        role: userData.role,
        is_outside_estate: userData.is_outside_estate,
        is_approved: false,
      };
      
      if (userData.service_category) {
        profileData.service_category = userData.service_category;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (profileError) throw profileError;
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },
};