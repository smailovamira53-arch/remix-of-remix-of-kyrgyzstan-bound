import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: 'Account created!', description: 'Ask an existing admin to assign you the admin role.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetupAdmin = async () => {
    setSettingUp(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-admin');
      if (error) throw error;
      if (data?.success) {
        toast({ title: 'Admin created!', description: 'Email: admin@mountainmagic.com / Password: Admin123!' });
        setEmail('admin@mountainmagic.com');
        setPassword('Admin123!');
      } else {
        throw new Error(data?.error || 'Unknown error');
      }
    } catch (err: any) {
      toast({ title: 'Setup failed', description: err.message, variant: 'destructive' });
    } finally {
      setSettingUp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8">
        <h1 className="font-display text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-center text-sm text-muted-foreground mt-4 hover:underline">
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>

        {/* Temporary setup button - REMOVE AFTER FIRST USE */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full text-sm border-amber-300 text-amber-700 hover:bg-amber-50"
            onClick={handleSetupAdmin}
            disabled={settingUp}
          >
            {settingUp ? 'Setting up...' : '⚡ Setup Admin (admin@mountainmagic.com)'}
          </Button>
          <p className="text-xs text-gray-400 text-center mt-2">Temporary — remove after first use</p>
        </div>
      </div>
    </div>
  );
};
