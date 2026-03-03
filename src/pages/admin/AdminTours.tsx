import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import TourFormModal from '@/components/admin/TourFormModal';

interface Tour {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  duration: string;
  is_active: boolean;
  is_featured: boolean;
  image_url: string | null;
  [key: string]: any;
}

const AdminTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const fetchTours = useCallback(async () => {
    const { data } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
    if (data) setTours(data as Tour[]);
  }, []);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('tours').delete().eq('id', deleteId);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Tour deleted' }); fetchTours(); }
    setDeleteId(null);
  };

  const filtered = tours.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
        <Button onClick={() => { setEditTour(null); setShowForm(true); }} className="bg-[#16a34a] hover:bg-[#15803d] gap-2">
          <Plus className="w-4 h-4" /> Add New Tour
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search tours by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(tour => (
                <TableRow key={tour.id}>
                  <TableCell>
                    {tour.image_url ? (
                      <img src={tour.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{tour.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{tour.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {tour.price > 0 ? `${tour.price} ${tour.currency}` : 'On request'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{tour.duration}</TableCell>
                  <TableCell>
                    <Badge className={tour.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                      {tour.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditTour(tour); setShowForm(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(tour.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {search ? 'No tours match your search.' : 'No tours yet. Click "Add New Tour" to create one.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tour?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The tour will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tour form modal */}
      {showForm && (
        <TourFormModal
          tour={editTour}
          onClose={() => { setShowForm(false); setEditTour(null); }}
          onSaved={() => { setShowForm(false); setEditTour(null); fetchTours(); }}
        />
      )}
    </div>
  );
};

export default AdminTours;
