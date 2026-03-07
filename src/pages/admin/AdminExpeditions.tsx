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
import ExpeditionFormModal from '@/components/admin/ExpeditionFormModal';

interface Expedition {
  id: string;
  title_en: string;
  location_en: string | null;
  price: number;
  currency: string;
  duration: string | null;
  difficulty: string | null;
  is_active: boolean;
  is_featured: boolean;
  cover_image: string | null;
  [key: string]: any;
}

const AdminExpeditions = () => {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editExpedition, setEditExpedition] = useState<Expedition | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const fetchExpeditions = useCallback(async () => {
    const { data } = await supabase
      .from('expeditions')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setExpeditions(data as Expedition[]);
  }, []);

  useEffect(() => { fetchExpeditions(); }, [fetchExpeditions]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('expeditions').delete().eq('id', deleteId);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Expedition deleted' }); fetchExpeditions(); }
    setDeleteId(null);
  };

  const filtered = expeditions.filter(e =>
    (e.title_en || '').toLowerCase().includes(search.toLowerCase())
  );

  const difficultyColor = (d: string | null) => {
    if (!d) return 'bg-gray-100 text-gray-600';
    if (d === 'expert') return 'bg-red-100 text-red-700';
    if (d === 'hard') return 'bg-orange-100 text-orange-700';
    if (d === 'moderate') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expeditions</h1>
        <Button
          onClick={() => { setEditExpedition(null); setShowForm(true); }}
          className="bg-[#16a34a] hover:bg-[#15803d] gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Expedition
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search expeditions..."
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
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(exp => (
                <TableRow key={exp.id}>
                  <TableCell>
                    {exp.cover_image ? (
                      <img src={exp.cover_image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{exp.title_en}</TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-[150px] truncate">{exp.location_en || '—'}</TableCell>
                  <TableCell>
                    {exp.price > 0 ? `${exp.price} ${exp.currency}` : 'On request'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{exp.duration || '—'}</TableCell>
                  <TableCell>
                    <Badge className={`${difficultyColor(exp.difficulty)} hover:opacity-90`}>
                      {exp.difficulty || '—'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={exp.is_active
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                      {exp.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setEditExpedition(exp); setShowForm(true); }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setDeleteId(exp.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {search ? 'No expeditions match your search.' : 'No expeditions yet. Click "Add New Expedition" to create one.'}
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
            <AlertDialogTitle>Delete expedition?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The expedition will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Expedition form modal */}
      {showForm && (
        <ExpeditionFormModal
          expedition={editExpedition}
          onClose={() => { setShowForm(false); setEditExpedition(null); }}
          onSaved={() => { setShowForm(false); setEditExpedition(null); fetchExpeditions(); }}
        />
      )}
    </div>
  );
};

export default AdminExpeditions;