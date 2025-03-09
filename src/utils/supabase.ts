
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'user';
          password?: string;
          count: number;
          picture?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin' | 'user';
          password?: string;
          count?: number;
          picture?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'user';
          password?: string;
          count?: number;
          picture?: string;
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
};

export const authAPI = {
  signUp: async (email: string, password: string, name: string) => {
    try {
      console.log(`Signing up user: ${email} with name: ${name}`);
      // Sign up with Supabase Auth - EXPLICITLY include type=signup in the redirect URL
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: email.endsWith('@synjoint.com') ? 'admin' : 'user',
          },
          // Make absolutely sure we're specifying type=signup in the redirect
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`
        }
      });

      if (authError) {
        console.error('Sign up error:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error('Failed to create user - no user data returned');
        throw new Error("Failed to create user");
      }

      console.log('Sign up successful, user data:', authData.user);
      return { data: authData, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      console.log(`Attempting to sign in user: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Sign-in Error:', error.message);
        return { data: null, error: new Error('Invalid login credentials.') };
      }

      console.log('User signed in successfully:', data.user);
      
      // IMPORTANT: Check if user exists in users table and create if needed
      let attempts = 0;
      let maxAttempts = 3;
      let userCreated = false;
      
      while (attempts < maxAttempts && !userCreated) {
        attempts++;
        try {
          // Check if user exists in users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();
          
          if (userError) {
            console.error(`Error fetching user profile (attempt ${attempts}/${maxAttempts}):`, userError);
            // Continue to try creating the user
          }
          
          // If no user record in users table, create one
          if (!userData) {
            console.log(`User authenticated but no profile found. Creating profile (attempt ${attempts}/${maxAttempts})...`);
            
            // Try different approaches based on attempt
            if (attempts === 1) {
              // Full approach
              const { error: createError } = await supabase
                .from('users')
                .insert({
                  id: data.user.id,
                  email: data.user.email || '',
                  name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
                  role: data.user.email?.endsWith('@synjoint.com') ? 'admin' : 'user',
                  count: 1,
                  created_at: new Date().toISOString()
                });
                
              if (!createError) {
                console.log("User profile created successfully on login");
                userCreated = true;
              } else {
                console.error(`Creation error (attempt ${attempts}):`, createError);
              }
            } else if (attempts === 2) {
              // Minimal approach
              const { error: minimalError } = await supabase
                .from('users')
                .insert({
                  id: data.user.id,
                  email: data.user.email || '',
                  name: data.user.email?.split('@')[0] || 'User',
                  role: 'user'
                });
                
              if (!minimalError) {
                console.log("Minimal user profile created on login");
                userCreated = true;
              } else {
                console.error(`Minimal creation error (attempt ${attempts}):`, minimalError);
              }
            } else {
              // Last resort approach
              console.log("Using upsert as last resort");
              const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                  id: data.user.id,
                  email: data.user.email || '',
                  name: 'User',
                  role: 'user'
                }, { onConflict: 'id' });
                
              if (!upsertError) {
                console.log("Upsert user profile created on login");
                userCreated = true;
              } else {
                console.error(`Upsert error (attempt ${attempts}):`, upsertError);
                // Even if all creation attempts fail, let the user continue
                console.warn("All user creation attempts failed, but continuing login process");
              }
            }
          } else {
            console.log("User profile found, login successful");
            // User exists, update count
            const { error: updateError } = await supabase
              .from('users')
              .update({ count: (userData.count || 0) + 1 })
              .eq('id', data.user.id);
            
            if (updateError) {
              console.error('Error updating user count:', updateError);
            }
            userCreated = true;
          }
          
          // Break the loop if user was created or found
          if (userCreated) break;
          
          // Wait before retrying
          if (attempts < maxAttempts && !userCreated) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Unexpected error in user creation (attempt ${attempts}):`, error);
        }
      }
      
      // Return successful login even if user creation in public table failed
      // The auth already succeeded, and that's what matters for login
      return { data, error: null };
    } catch (error) {
      console.error('Unexpected Sign-in Error:', error);
      return { data: null, error: new Error('Something went wrong. Please try again.') };
    }
  },
  
  signInWithGoogle: async () => {
    try {
      console.log("Initiating Google sign-in...");
      // Using the new Google client ID from the environment variable
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback?provider=google`
        }
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }
      
      console.log("Google sign-in initiated successfully, redirecting to provider...");
      return { data, error: null };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { data: null, error };
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        return { user: null, error: null };
      }
      
      // Get the user's profile from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (userError) {
        console.error('Error fetching user data:', userError);
      }
      
      return { 
        user: {
          ...session.user,
          profile: userData
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error };
    }
  }
};

export const contactAPI = {
  submitContactForm: async (name: string, email: string, message: string) => {
    try {
      // Create a record in the contacts table
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          name,
          email,
          message,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Send email notification using Supabase Edge Functions (this part would need a separate Edge Function implementation)
      // const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
      //   body: { name, email, message }
      // });
      // 
      // if (emailError) throw emailError;
      
      return { data, error: null };
    } catch (error) {
      console.error('Contact form submission error:', error);
      return { data: null, error };
    }
  }
};
