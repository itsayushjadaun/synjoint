
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
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

        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (data.session) {
          const user = data.session.user;
          
          // Check if user already exists in our users table
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no record is found
            
          if (fetchError) {
            console.error('Error checking existing user:', fetchError);
          }
          
          if (!existingUser) {
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
              toast.success('Account created successfully!');
            }
          } else {
            // Update existing user's count
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                count: existingUser.count + 1,  // Manually increment instead of using RPC
                picture: user.user_metadata.avatar_url || existingUser.picture
              })
              .eq('id', user.id);
              
            if (updateError) {
              console.error('Error updating user count:', updateError);
            } else {
              toast.success('Successfully signed in!');
            }
          }
        }
        
        // Redirect to home page after processing
        navigate('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing sign in...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-synjoint-blue mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
