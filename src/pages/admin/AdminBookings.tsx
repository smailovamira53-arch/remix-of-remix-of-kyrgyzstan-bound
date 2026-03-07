import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Trash2, ChevronDown, ChevronUp, Users, Phone, Mail, MessageSquare, Copy, Check } from 'lucide-react';

type Booking = {
  id: string;
  tour_id: string | null;
  tour_date_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  people_count: number;
  language: string;
  status: 'new' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  tour?: { title: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
  new:       'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<string, string> = {
  new:       'Новый',
  confirmed: 'Подтверждён',
  cancelled: 'Отменён',
  completed: 'Завершён',
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };
  const waLink = (phone: string) =>
    `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*, tour:tours(title)')
      .order('created_at', { ascending: false });
    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await supabase.from('bookings').update({ status }).eq('id', id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as Booking['status'] } : b));
    setUpdatingId(null);
  };

  const saveAdminNotes = async (id: string, admin_notes: string) => {
    await supabase.from('bookings').update({ admin_notes }).eq('id', id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, admin_notes } : b));
  };

  const deleteBooking = async () => {
    if (!deleteId) return;
    await supabase.from('bookings').delete().eq('id', deleteId);
    setBookings(prev => prev.filter(b => b.id !== deleteId));
    setDeleteId(null);
  };

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      (b.phone || '').includes(search);
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Счётчики по статусам
  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Бронирования</h1>
        <span className="text-sm text-gray-500">{bookings.length} всего</span>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {(['new', 'confirmed', 'cancelled', 'completed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
            className={`rounded-xl border p-4 text-left transition-all hover:border-[#15803d]/50 ${
              filterStatus === s ? 'border-[#15803d] bg-[#15803d]/5' : 'border-gray-200 bg-white'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{counts[s] || 0}</p>
            <p className="text-sm text-gray-500 mt-0.5">{STATUS_LABELS[s]}</p>
          </button>
        ))}
      </div>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск по имени, email, телефону..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="confirmed">Подтверждённые</SelectItem>
            <SelectItem value="cancelled">Отменённые</SelectItem>
            <SelectItem value="completed">Завершённые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Список */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          Загрузка...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          Бронирования не найдены
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => {
            const isExpanded = expandedId === booking.id;
            return (
              <div key={booking.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                {/* Строка */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Раскрыть */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                    className="text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Имя + тур */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{booking.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {(booking.tour as any)?.title || '—'} · {new Date(booking.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>

                  {/* Кол-во людей */}
                  <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500 shrink-0">
                    <Users className="w-3.5 h-3.5" />
                    {booking.people_count}
                  </div>

                  {/* Статус */}
                  <Select
                    value={booking.status}
                    onValueChange={val => updateStatus(booking.id, val)}
                    disabled={updatingId === booking.id}
                  >
                    <SelectTrigger className={`w-36 h-7 text-xs font-semibold border-0 rounded-full px-3 ${STATUS_COLORS[booking.status]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новый</SelectItem>
                      <SelectItem value="confirmed">Подтверждён</SelectItem>
                      <SelectItem value="cancelled">Отменён</SelectItem>
                      <SelectItem value="completed">Завершён</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Удалить */}
                  <button
                    onClick={() => setDeleteId(booking.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Раскрытая часть */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-4">
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {/* Email + копировать */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <a href={`mailto:${booking.email}`} className="hover:text-[#15803d] truncate flex-1">{booking.email}</a>
                        <button onClick={() => copyToClipboard(booking.email)} className="text-gray-300 hover:text-[#15803d] transition-colors shrink-0" title="Копировать">
                          {copiedText === booking.email ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {/* Телефон + WhatsApp + копировать */}
                      {booking.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                          <a href={waLink(booking.phone)} target="_blank" rel="noopener noreferrer" className="hover:text-[#25d366] font-medium flex-1" title="Открыть WhatsApp">
                            {booking.phone}
                          </a>
                          <button onClick={() => copyToClipboard(booking.phone!)} className="text-gray-300 hover:text-[#15803d] transition-colors shrink-0" title="Копировать">
                            {copiedText === booking.phone ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-gray-400 shrink-0" />
                        {booking.people_count} чел. · Язык: {booking.language?.toUpperCase()}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="text-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Комментарий клиента</p>
                        <p className="text-gray-600 bg-white rounded-lg px-3 py-2 border border-gray-200">{booking.notes}</p>
                      </div>
                    )}

                    {/* Заметки админа */}
                    <div className="text-sm">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Заметки администратора
                      </p>
                      <textarea
                        defaultValue={booking.admin_notes || ''}
                        onBlur={e => saveAdminNotes(booking.id, e.target.value)}
                        rows={2}
                        placeholder="Добавить заметку..."
                        className="w-full text-sm text-gray-600 bg-white rounded-lg px-3 py-2 border border-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-[#15803d]"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Диалог удаления */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить бронирование?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBooking} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBookings;