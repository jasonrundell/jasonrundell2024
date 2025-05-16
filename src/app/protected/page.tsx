import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/auth/ui/button';
import { Input } from '@/components/auth/ui/input';
import { Label } from '@/components/auth/ui/label';
import { LogOut } from 'lucide-react';

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

  return (
    <div className="flex-1 w-full flex flex-col items-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userData?.full_name || user.email}</h1>
            <p className="text-gray-500">Your account information</p>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-800">
              {(userData?.full_name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{userData?.full_name || 'User'}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={user.email} 
                readOnly 
                className="mt-1 bg-gray-50"
              />
            </div>
            
            <div>
              <Label>Full Name</Label>
              <Input 
                type="text" 
                value={userData?.full_name || 'Not provided'} 
                readOnly 
                className="mt-1 bg-gray-50"
              />
            </div>
            
            <div>
              <Label>Account Created</Label>
              <Input 
                type="text" 
                value={userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Unknown'} 
                readOnly 
                className="mt-1 bg-gray-50"
              />
            </div>
            
            <div>
              <Label>Authentication Provider</Label>
              <Input 
                type="text" 
                value={user.app_metadata?.provider || 'email'} 
                readOnly 
                className="mt-1 bg-gray-50 capitalize"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
