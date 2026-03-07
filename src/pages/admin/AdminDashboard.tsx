import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, DollarSign, CalendarCheck, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTours: 0,
    activeTours: 0,
    totalBookings: 0,
    newBookings: 0,
    totalExpeditions: 0,
    activeExpeditions: 0,
  });

  useEffect(() => {
    (async () => {
      const [toursRes, bookingsRes, expeditionsRes] = await Promise.all([
        supabase.from('tours').select('is_active'),
        supabase.from('bookings').select('status'),
        supabase.from('expeditions').select('is_active'),
      ]);

      const tours = toursRes.data || [];
      const bookings = bookingsRes.data || [];
      const expeditions = expeditionsRes.data || [];

      setStats({
        totalTours:        tours.length,
        activeTours:       tours.filter(t => t.is_active).length,
        totalBookings:     bookings.length,
        newBookings:       bookings.filter(b => b.status === 'new').length,
        totalExpeditions:  expeditions.length,
        activeExpeditions: expeditions.filter(e => e.is_active).length,
      });
    })();
  }, []);

  const cards = [
    { label: 'Total Tours', value: stats.totalTours, sub: `${stats.activeTours} active`, icon: Map, color: 'text-green-600' },
    { label: 'Expeditions', value: stats.totalExpeditions, sub: `${stats.activeExpeditions} active`, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'New Bookings', value: stats.newBookings, sub: 'awaiting confirmation', icon: CalendarCheck, color: 'text-amber-600' },
    { label: 'Total Bookings', value: stats.totalBookings, sub: 'all time', icon: DollarSign, color: 'text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Card key={c.label} className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{c.label}</CardTitle>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
