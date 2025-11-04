import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// --- CONSTANTS ---
const DOCUMENTS_BUCKET_NAME = 'user-documents';

export type UserRole = 'resident' | 'store' | 'service_provider' | 'rider' | 'admin';

// Interface for all required data during registration
export interface SignUpUserData {
  full_name: string;
  phone_number: string;
  role: UserRole;
  service_category?: string;
  
  // Resident-specific data (optional for other roles)
  address?: string;
  proof_of_address_type?: string;
  identification_type?: string;
  proof_of_address?: File | null;
  identification_document?: File | null;
}

// Interface matching the new 'user_onboarding' table structure
export interface UserProfile {
  id: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  approval_status: 'pending' | 'approved' | 'rejected';
  service_category?: string;
  
  // Resident Fields (URLs to files are stored here)
  address?: string;
  proof_of_address_type?: string;
  proof_of_address_url?: string;
  identification_type?: string;
  identification_document_url?: string;
  
  // Other fields like:
  hours_of_operation?: string;
  created_at: string;
}

// --- FILE UPLOAD HELPER ---
async function uploadFile(file: File, userId: string, folder: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(DOCUMENTS_BUCKET_NAME)
        .upload(filePath, file);

    if (uploadError) {
        throw new Error(`File upload failed for ${file.name}: ${uploadError.message}`);
    }

    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
        .from(DOCUMENTS_BUCKET_NAME)
        .getPublicUrl(filePath);

    return publicUrl;
}


export const authHelpers = {
  async signUp(email: string, password: string, userData: SignUpUserData) {
    // 1. Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
        throw error;
    }
    
    // CRITICAL CHECK 1: Ensure user was created
    if (!data.user) {
        throw new Error("User creation failed. Check email or Supabase Auth logs.");
    }
    
    // --- FINAL FIX: FORCE SESSION RECOGNITION ---
    // This explicit call forces the client to reload the JWT from localStorage 
    // before the RPC call, ensuring the token is present for auth.uid().
    await supabase.auth.getSession();
    
    const userId = data.user.id;
    let proofUrl: string | undefined;
    let idUrl: string | undefined;

    // 2. Handle file uploads for RESIDENT role
    if (userData.role === 'resident' && userData.proof_of_address && userData.identification_document) {
      proofUrl = await uploadFile(
          userData.proof_of_address, 
          userId, 
          'proofs_of_address'
      );
      
      idUrl = await uploadFile(
          userData.identification_document, 
          userId, 
          'identification_documents'
      );
    }
    
    // 3. Call the RPC function (Should now have a valid token in the header)
    const { error: profileError } = await supabase.rpc('handle_user_onboarding_insert', {
      _full_name: userData.full_name,
      _phone_number: userData.phone_number,
      _role: userData.role,
      
      // Pass ALL 9 arguments to the RPC function, using null for optional fields
      _address: userData.role === 'resident' ? userData.address : null,
      _proof_of_address_type: userData.role === 'resident' ? userData.proof_of_address_type : null,
      _proof_of_address_url: proofUrl || null, 
      _identification_type: userData.role === 'resident' ? userData.identification_type : null,
      _identification_document_url: idUrl || null,
      _service_category: userData.role === 'service_provider' ? userData.service_category : null,
    });

    if (profileError) {
        console.error("RPC Insert Failed. User created in auth, but profile insert failed:", profileError);
        throw profileError;
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
      .from('user_onboarding')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as UserProfile;
  },
};