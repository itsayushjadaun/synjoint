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
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: email.endsWith('@synjoint.com') ? 'admin' : 'user',
          },
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
      
      // IMPORTANT: Always check and ensure user exists in users table
      // Check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (userError) {
        console.error('Error fetching user profile:', userError);
      }
      
      // If no user record in users table, create one
      if (!userData) {
        console.log('User authenticated but no profile found. Creating profile...');
        const newUserData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          role: data.user.email?.endsWith('@synjoint.com') ? 'admin' : 'user',
          count: 1,
          created_at: new Date().toISOString()
        };
        
        const { error: createError } = await supabase
          .from('users')
          .insert(newUserData);
        
        if (createError) {
          console.error('Error creating user profile on login:', createError);
          // Fallback to simpler record if the full one fails
          const { error: fallbackError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.email?.split('@')[0] || 'User',
              role: 'user'
            });
            
          if (fallbackError) {
            console.error('Even simplified user creation failed:', fallbackError);
            console.warn('User authenticated but profile not created. Some functionality may be limited.');
          } else {
            console.log('Simplified user profile created on login');
          }
        } else {
          console.log('User profile created successfully on login');
        }
      } else {
        console.log('User profile found:', userData);
        // Update user count
        const { error: updateError } = await supabase
          .from('users')
          .update({ count: (userData.count || 0) + 1 })
          .eq('id', data.user.id);
        
        if (updateError) {
          console.error('Error updating user count:', updateError);
        }
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Unexpected Sign-in Error:', error);
      return { data: null, error: new Error('Something went wrong. Please try again.') };
    }
  },
  
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
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
