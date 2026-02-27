import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLogin } from '@/components/AdminLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, LogOut, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

type Tour = Tables<'tours'>;

const emptyForm = {
  title: '', description: '', price: 0, duration: '', image_url: '',
  start_date: '', end_date: '', status: 'Open' as string, current_bookings: 0,
};

const AdminPage = () => {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      if (session?.user) {
        setTimeout(() => checkRole(session.user.id), 0);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) checkRole(session.user.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [checkRole]);

  const fetchTours = useCallback(async () => {
    const { data } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
    if (data) setTours(data);
  }, []);

  useEffect(() => { if (isAdmin) fetchTours(); }, [isAdmin, fetchTours]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('tour-images').upload(path, file);
    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } else {
      const { data } = supabase.storage.from('tour-images').getPublicUrl(path);
      setForm(f => ({ ...f, image_url: data.publicUrl }));
      toast({ title: 'Image uploaded!' });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      duration: form.duration,
      image_url: form.image_url || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
      current_bookings: Number(form.current_bookings),
    };

    if (editingId) {
      const { error } = await supabase.from('tours').update(payload).eq('id', editingId);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Tour updated!' });
    } else {
      const { error } = await supabase.from('tours').insert(payload);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Tour created!' });
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    fetchTours();
  };

  const handleEdit = (tour: Tour) => {
    setForm({
      title: tour.title,
      description: tour.description,
      price: tour.price,
      duration: tour.duration,
      image_url: tour.image_url || '',
      start_date: tour.start_date || '',
      end_date: tour.end_date || '',
      status: tour.status,
      current_bookings: tour.current_bookings,
    });
    setEditingId(tour.id);
    setShowForm(true);
  };

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return <AdminLogin onLogin={() => supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if (session?.user) checkRole(session.user.id); })} />;
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <p className="text-lg text-muted-foreground">Access denied. Admin or Manager role required.</p>
      <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-primary hover:underline flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Home</Link>
          <h1 className="font-display text-xl font-bold">Tour Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{session.user.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">{tours.length} Tour{tours.length !== 1 ? 's' : ''}</h2>
          <Button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }} className="gap-2">
            <Plus className="w-4 h-4" /> Add Tour
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
            <h3 className="font-semibold">{editingId ? 'Edit Tour' : 'New Tour'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <Label>Duration</Label>
                <Input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 5 days" />
              </div>
              <div>
                <Label>Price ($)</Label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Almost Full">Almost Full</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>
              <div>
                <Label>Current Bookings</Label>
                <Input type="number" value={form.current_bookings} onChange={e => setForm(f => ({ ...f, current_bookings: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-20 rounded object-cover" />}
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tours.map(tour => (
            <div key={tour.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
              {tour.image_url && <img src={tour.image_url} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{tour.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tour.status === 'Open' ? 'bg-green-100 text-green-700' : tour.status === 'Almost Full' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {tour.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">${tour.price} · {tour.duration} · {tour.current_bookings} bookings</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(tour)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(tour.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
          {tours.length === 0 && <p className="text-center text-muted-foreground py-8">No tours yet. Click "Add Tour" to create one.</p>}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
