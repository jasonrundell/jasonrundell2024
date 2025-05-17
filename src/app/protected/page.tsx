import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from './profile-client';
export default async function ProtectedPage() {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Error getting user:', authError);
    return redirect("/sign-in?error=not_authenticated");
  }

  // Get the full user data from the database
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email)
    .single();

  if (userError) {
    console.error('Error fetching user data:', userError);
    return redirect("/sign-in?error=user_not_found");
  }
  
  // Handle sign out
  const signOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/sign-in');
  };

  // Ensure the user object has the required structure for the client component
  const clientUser = {
    email: user.email || '',
    app_metadata: user.app_metadata || {}
  };
  
  return <ProfileClient user={clientUser} userData={userData} signOutAction={signOut} />;
}
