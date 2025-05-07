
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState('Processing authentication...');
  const [toastShown, setToastShown] = useState(false); // Track if toast has been shown

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback handling started");
        console.log("Current URL:", window.location.href);
        setStatus('Verifying your authentication...');
        
        // Check if there's an error in the URL (like from an expired link)
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          console.error('Auth error:', error, errorDescription);
          if (!toastShown) {
            toast.error(errorDescription || 'Authentication failed. Please try again.');
            setToastShown(true);
          }
          navigate('/login');
          return;
        }

        // Parse URL to check for provider info
        const urlParams = new URLSearchParams(location.search);
        const type = urlParams.get('type');
        const provider = urlParams.get('provider');
        
        if (provider === 'google') {
          console.log('Google authentication callback detected');
          setStatus('Google authentication confirmed! Setting up your account...');
        } else if (type === 'signup') {
          console.log(`Email signup confirmation detected`);
          setStatus('Email confirmed! Setting up your account...');
          if (!toastShown) {
            toast.success('Email confirmed successfully!');
            setToastShown(true);
          }
        } else if (type === 'recovery' || type === 'invite') {
          console.log(`Email ${type} callback detected`);
          if (!toastShown) {
            toast.success('Email confirmed successfully!');
            setToastShown(true);
          }
        }

        // Get current session after confirmation
        const { data, error: sessionError } = await supabase.auth.getSession();
        console.log("Session data:", data);
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (data?.session) {
          const user = data.session.user;
          console.log("Session user found:", user);
          setStatus('Creating your user profile...');
          
          // Ensure user record exists in users table
          let userCreated = false;
          let attempts = 0;
          
          while (!userCreated && attempts < 3) {
            attempts++;
            console.log(`Attempt ${attempts} to create user record`);
            userCreated = await ensureUserRecord(user);
            
            if (!userCreated && attempts < 3) {
              // Wait a bit before retry
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          if (userCreated) {
            setStatus('Account setup complete!');
            // Ensure we give enough time for the database operations to complete
            setTimeout(() => {
              console.log("Auth callback completed, redirecting to home page");
              navigate('/');
            }, 1500);
          } else {
            console.error("Failed to create user record after multiple attempts");
            if (!toastShown) {
              toast.error('Account setup failed. Please contact support.');
              setToastShown(true);
            }
            navigate('/login');
          }
        } else {
          console.log("No session found in callback");
          if (!toastShown) {
            toast.error('No active session found. Please try logging in again.');
            setToastShown(true);
          }
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        if (!toastShown) {
          toast.error('Authentication failed. Please try again.');
          setToastShown(true);
        }
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
        console.log("User metadata:", user.user_metadata);
        
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
          
          // Create new user record with multiple fallback approaches
          try {
            // Get user info from metadata
            const name = user.user_metadata?.name || 
                         user.user_metadata?.full_name || 
                         user.email?.split('@')[0] || 
                         'User';
            const email = user.email || '';
            const picture = user.user_metadata?.avatar_url || null;
            const role = email.endsWith('@synjoint.com') ? 'admin' : 'user';
            
            console.log("Creating user with data:", { name, email, picture, role });
            
            // Create user with comprehensive data
            const userData = {
              id: user.id,
              email: email,
              name: name,
              role: role,
              count: 1,
              picture: picture,
              created_at: new Date().toISOString()
            };

            const { error: insertError } = await supabase
              .from('users')
              .insert(userData);
              
            if (insertError) {
              console.error('Error creating user record:', insertError);
              
              // Try minimal required fields approach
              console.log("Trying minimal user record creation");
              const { error: minimalInsertError } = await supabase
                .from('users')
                .insert({
                  id: user.id,
                  email: email,
                  name: name,
                  role: role
                });
                
              if (minimalInsertError) {
                console.error('Minimal insert also failed:', minimalInsertError);
                
                // Try upsert approach as a last resort
                console.log("Trying upsert approach");
                const { error: upsertError } = await supabase
                  .from('users')
                  .upsert({
                    id: user.id,
                    email: email,
                    name: name,
                    role: role
                  }, { onConflict: 'id' });
                  
                if (upsertError) {
                  console.error('Upsert approach also failed:', upsertError);
                  return false;
                } else {
                  console.log("Upsert user record created successfully");
                  if (!toastShown) {
                    toast.success('Account created successfully!');
                    setToastShown(true);
                  }
                  return true;
                }
              } else {
                console.log("Minimal user record created successfully");
                if (!toastShown) {
                  toast.success('Account created successfully!');
                  setToastShown(true);
                }
                return true;
              }
            } else {
              console.log("User record created successfully");
              if (!toastShown) {
                toast.success('Account created successfully!');
                setToastShown(true);
              }
              return true;
            }
          } catch (createError) {
            console.error('Unexpected error creating user:', createError);
            return false;
          }
        } else {
          console.log("User already exists in users table, updating count and picture if needed");
          // Update existing user's count and picture if available
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              count: (existingUser.count || 0) + 1,
              picture: user.user_metadata?.avatar_url || existingUser.picture,
              name: user.user_metadata?.name || user.user_metadata?.full_name || existingUser.name
            })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating user data:', updateError);
            // Even if update fails, the user exists, so return true
            console.log("Update failed but user exists, continuing");
          } else {
            console.log("User data updated successfully");
          }
          if (!toastShown) {
            toast.success('Successfully signed in!');
            setToastShown(true);
          }
          return true;
        }
      } catch (error) {
        console.error('Error ensuring user record exists:', error);
        return false;
      }
    };

    handleAuthCallback();
  }, [navigate, location, toastShown]); // Added toastShown to dependencies

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full dark:bg-gray-800 dark:text-white">
        <h2 className="text-2xl font-semibold mb-4">
          {isProcessing ? status : "Processing complete"}
        </h2>
        {isProcessing && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-synjoint-blue mx-auto"></div>
          </div>
        )}
        {!isProcessing && status.includes('complete') && (
          <p className="mt-4 text-green-600 dark:text-green-400">Your account is ready! Redirecting you to the home page...</p>
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
