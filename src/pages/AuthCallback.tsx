
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback handling started");
        
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
        
        if (type === 'signup' || type === 'recovery' || type === 'invite') {
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
          
          // Check if user already exists in our users table
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (fetchError) {
            console.error('Error checking existing user:', fetchError);
          }
          
          if (!existingUser) {
            console.log("Creating new user record in users table");
            // Create new user record
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email || '',
                name: user.user_metadata.name || user.email?.split('@')[0] || 'User',
                role: user.email?.endsWith('@synjoint.com') ? 'admin' : 'user',
                picture: user.user_metadata.avatar_url,
                count: 1,
                created_at: new Date().toISOString()
              });
              
            if (insertError) {
              console.error('Error creating user record:', insertError);
              // Don't fail the sign-in process if this fails
              console.warn("User authenticated but profile not created. Some functionality may be limited.");
              toast.warning('Account created but profile setup incomplete.');
            } else {
              console.log("User record created successfully");
              toast.success('Account created successfully!');
            }
          } else {
            console.log("User already exists in users table, updating count");
            // Update existing user's count
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                count: (existingUser.count || 0) + 1,  // Use existing count or default to 0
                picture: user.user_metadata.avatar_url || existingUser.picture
              })
              .eq('id', user.id);
              
            if (updateError) {
              console.error('Error updating user count:', updateError);
            } else {
              console.log("User count updated successfully");
              toast.success('Successfully signed in!');
            }
          }
          
          // Ensure we give enough time for the database operations to complete
          setTimeout(() => {
            console.log("Auth callback completed, redirecting to home page");
            navigate('/');
          }, 1000);
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

    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {isProcessing ? "Completing sign in..." : "Processing complete"}
        </h2>
        {isProcessing && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-synjoint-blue mx-auto"></div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
