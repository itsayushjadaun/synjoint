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


// Type definitions for database tables
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
    // Check if the user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: email.endsWith('@synjoint.com') ? 'admin' : 'user',
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    // Insert user profile into the `users` table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: email.endsWith('@synjoint.com') ? 'admin' : 'user',
        count: 1,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting user into the users table:', insertError);
    }

    return { data: authData, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

  
signIn: async (email: string, password: string) => {
  try {
    // Attempt to sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Sign-in Error:', error.message);
      return { data: null, error: new Error(error.message || 'Invalid login credentials. Please try again.') };
    }

    console.log('User signed in successfully:', data.user);
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected Sign-in Error:', error);
    return { data: null, error: new Error('Something went wrong. Please try again.') };
  }
}

  
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
