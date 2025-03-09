
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback handling started");
        setStatus('Verifying your authentication...');
        
        // Check if there's an error in the URL (like from an expired link)
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          console.error('Auth error:', error, errorDescription);
          toast.error(errorDescription || 'Authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        // Check if this is an email confirmation callback from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const type = urlParams.get('type');
        
        if (type === 'signup') {
          console.log(`Email signup confirmation detected`);
          setStatus('Email confirmed! Setting up your account...');
          toast.success('Email confirmed successfully!');
        } else if (type === 'recovery' || type === 'invite') {
          console.log(`Email ${type} callback detected`);
          toast.success('Email confirmed successfully!');
        }

        // Get current session after confirmation
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (data.session) {
          const user = data.session.user;
          console.log("Session user found:", user);
          setStatus('Creating your user profile...');
          
          // CRITICAL: Always ensure user record exists in users table
          const userCreated = await ensureUserRecord(user);
          
          if (userCreated) {
            setStatus('Account setup complete!');
            // Ensure we give enough time for the database operations to complete
            setTimeout(() => {
              console.log("Auth callback completed, redirecting to home page");
              navigate('/');
            }, 1500);
          } else {
            console.error("Failed to create user record");
            toast.error('Account setup failed. Please contact support.');
            navigate('/login');
          }
        } else {
          console.log("No session found in callback");
          toast.error('No active session found. Please try logging in again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    // Helper function to ensure user record exists - returns true if successful
    const ensureUserRecord = async (user) => {
      try {
        if (!user || !user.id) {
          console.error('Invalid user data for database entry');
          return false;
        }

        console.log("Ensuring user record exists for:", user.id);
        
        // Check if user already exists in users table
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (fetchError) {
          console.error('Error checking existing user:', fetchError);
          return false;
        }
        
        if (!existingUser) {
          console.log("Creating new user record in users table");
          // Create new user record with proper error handling
          
          try {
            // Create new user record with minimal required fields first
            const userData = {
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              role: user.email?.endsWith('@synjoint.com') ? 'admin' : 'user'
            };

            const { error: insertError } = await supabase
              .from('users')
              .insert(userData);
              
            if (insertError) {
              console.error('Error creating user record:', insertError);
              console.error('Insert error details:', JSON.stringify(insertError));
              
              // If the insert failed, try a more complete record
              console.log("Trying complete user record creation");
              const { error: completeInsertError } = await supabase
                .from('users')
                .insert({
                  id: user.id,
                  email: user.email || '',
                  name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                  role: user.email?.endsWith('@synjoint.com') ? 'admin' : 'user',
                  count: 1,
                  created_at: new Date().toISOString()
                });
                
              if (completeInsertError) {
                console.error('Complete insert also failed:', completeInsertError);
                return false;
              } else {
                console.log("Complete user record created successfully");
                toast.success('Account created successfully!');
                return true;
              }
            } else {
              console.log("User record created successfully");
              toast.success('Account created successfully!');
              return true;
            }
          } catch (createError) {
            console.error('Unexpected error creating user:', createError);
            return false;
          }
        } else {
          console.log("User already exists in users table, updating count");
          // Update existing user's count
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              count: (existingUser.count || 0) + 1,
              picture: user.user_metadata?.avatar_url || existingUser.picture
            })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating user count:', updateError);
            return false;
          } else {
            console.log("User count updated successfully");
            toast.success('Successfully signed in!');
            return true;
          }
        }
      } catch (error) {
        console.error('Error ensuring user record exists:', error);
        return false;
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">
          {isProcessing ? status : "Processing complete"}
        </h2>
        {isProcessing && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-synjoint-blue mx-auto"></div>
          </div>
        )}
        {!isProcessing && status.includes('complete') && (
          <p className="mt-4 text-green-600">Your account is ready! Redirecting you to the home page...</p>
        )}
        {!isProcessing && !status.includes('complete') && (
          <div>
            <p className="mt-4 text-red-500">There was an issue processing your authentication.</p>
            <button 
              className="mt-4 px-4 py-2 bg-synjoint-blue text-white rounded hover:bg-opacity-90"
              onClick={() => navigate('/login')}
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
