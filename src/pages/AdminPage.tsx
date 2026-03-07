import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLogin } from '@/components/AdminLogin';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, LogOut, ArrowLeft, Star, Calendar, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import TourFormModal from '@/components/TourFormModal';
import type { Tables } from '@/integrations/supabase/types';

type Tour = Tables<'tours'>;

const AdminPage = () => {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const { toast } = useToast();

  const checkRole = useCallback(async (userId: string) => {
    const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
    if (data) { setIsAdmin(true); return; }
    const { data: mgr } = await supabase.rpc('has_role', { _user_id: userId, _role: 'manager' });
    if (mgr) setIsAdmin(true);
    else {
      setIsAdmin(false);
      toast({ title: 'Access denied', description: 'You do not have admin or manager role.', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) setTimeout(() => checkRole(session.user.id), 0);
      else setIsAdmin(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) checkRole(session.user.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [checkRole]);

  const fetchTours = useCallback(async () => {
    const { data } = await supabase
      .from('tours')
      .select('*')
      // Событийные туры первыми, потом по дате создания
      .order('is_event', { ascending: false })
      .order('created_at', { ascending: false });
    if (data) setTours(data);
  }, []);

  useEffect(() => { if (isAdmin) fetchTours(); }, [isAdmin, fetchTours]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tour?')) return;
    const { error } = await supabase.from('tours').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Tour deleted' });
    fetchTours();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  const openCreate = () => { setEditingTour(null); setModalOpen(true); };
  const openEdit = (tour: Tour) => { setEditingTour(tour); setModalOpen(true); };
  const handleSaved = () => { setModalOpen(false); fetchTours(); };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return <AdminLogin onLogin={() => supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if (session?.user) checkRole(session.user.id); })} />;
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-lg text-muted-foreground">Access denied. Admin or Manager role required.</p>
      <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
    </div>
  );

  // Разделяем туры на event и обычные для отображения
  const eventTours = tours.filter(t => (t as any).is_event);
  const regularTours = tours.filter(t => !(t as any).is_event);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="font-display text-xl font-bold">Tour Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{session.user.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Верхняя панель */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">{tours.length} Tour{tours.length !== 1 ? 's' : ''}</h2>
            {eventTours.length > 0 && (
              <p className="text-sm text-amber-600 flex items-center gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
                {eventTours.length} event tour{eventTours.length !== 1 ? 's' : ''} (shown first)
              </p>
            )}
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Add Tour
          </Button>
        </div>

        {/* ── Event туры ── */}
        {eventTours.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-amber-700">Event Tours</h3>
              <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                Always shown first on Tours page
              </span>
            </div>
            <div className="space-y-3">
              {eventTours.map(tour => (
                <TourRow
                  key={tour.id}
                  tour={tour}
                  onEdit={() => openEdit(tour)}
                  onDelete={() => handleDelete(tour.id)}
                  isEvent
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Обычные туры ── */}
        {regularTours.length > 0 && (
          <div>
            {eventTours.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-gray-600">Regular Tours</h3>
              </div>
            )}
            <div className="space-y-3">
              {regularTours.map(tour => (
                <TourRow
                  key={tour.id}
                  tour={tour}
                  onEdit={() => openEdit(tour)}
                  onDelete={() => handleDelete(tour.id)}
                />
              ))}
            </div>
          </div>
        )}

        {tours.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No tours yet. Click "Add Tour" to create one.
          </p>
        )}
      </main>

      {/* ── TourFormModal ── */}
      {modalOpen && (
        <TourFormModal
          tour={editingTour}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

// ── Отдельный компонент строки тура ─────────────────────────────────────────
const TourRow = ({
  tour,
  onEdit,
  onDelete,
  isEvent = false,
}: {
  tour: Tour;
  onEdit: () => void;
  onDelete: () => void;
  isEvent?: boolean;
}) => {
  const statusColors: Record<string, string> = {
    Open: 'bg-green-100 text-green-700',
    'Almost Full': 'bg-yellow-100 text-yellow-700',
    Closed: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`bg-card border rounded-lg p-4 flex items-center gap-4 ${
      isEvent ? 'border-amber-300 bg-amber-50/30' : 'border-border'
    }`}>
      {/* Обложка */}
      {(tour as any).image_url ? (
        <img
          src={(tour as any).image_url}
          alt=""
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{isEvent ? '🏆' : '🗺️'}</span>
        </div>
      )}

      {/* Инфо */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-semibold truncate">{tour.title}</h3>
          {isEvent && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 font-medium flex-shrink-0">
              EVENT
            </span>
          )}
          {(tour as any).is_featured && (
            <Star className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${statusColors[tour.status] || 'bg-gray-100 text-gray-600'}`}>
            {tour.status}
          </span>
          {!(tour as any).is_active && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 flex-shrink-0">
              Inactive
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-3">
          <span>${tour.price} · {tour.duration}</span>
          {tour.start_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(tour.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
          <span className="text-gray-400">{tour.current_bookings} bookings</span>
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex gap-2 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;