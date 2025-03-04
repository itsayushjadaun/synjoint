
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
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
              toast.error('Failed to complete sign in. Please try again.');
            } else {
              toast.success('Account created successfully!');
            }
          } else {
            // Update existing user's count
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                count: supabase.rpc('increment_count', { row_id: user.id }),
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
  }, [navigate]);

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
