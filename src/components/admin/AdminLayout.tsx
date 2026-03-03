import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { AdminLogin } from '@/components/AdminLogin';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Map, CalendarCheck, Settings, LogOut, Menu, X, Mountain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Tours', icon: Map, path: '/admin/tours' },
  { label: 'Bookings', icon: CalendarCheck, path: '/admin/bookings' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminLayout = () => {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const checkRole = useCallback(async (userId: string) => {
    const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
    if (data) { setIsAdmin(true); return; }
    const { data: mgr } = await supabase.rpc('has_role', { _user_id: userId, _role: 'manager' });
    if (mgr) setIsAdmin(true);
    else {
      setIsAdmin(false);
      toast({ title: 'Access denied', description: 'Admin or Manager role required.', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess?.user) setTimeout(() => checkRole(sess.user.id), 0);
      else setIsAdmin(false);
    });
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      if (sess?.user) checkRole(sess.user.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [checkRole]);

  useEffect(() => {
    if (!loading && session && isAdmin && location.pathname === '/admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [loading, session, isAdmin, location.pathname, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!session) return (
    <AdminLogin onLogin={() => supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) checkRole(s.user.id);
    })} />
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <p className="text-lg text-gray-500">Access denied. Admin or Manager role required.</p>
      <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#15803d] text-white flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/20">
          <Mountain className="w-7 h-7 text-white/90" />
          <span className="font-bold text-lg leading-tight">Mountain Magic<br />Tours</span>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/20 px-4 py-4 space-y-3">
          <p className="text-xs text-white/60 truncate">{session.user.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <span className="font-semibold text-gray-800">Admin Panel</span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
