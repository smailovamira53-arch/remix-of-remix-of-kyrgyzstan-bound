import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, DollarSign, CalendarCheck, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, featured: 0, totalBookings: 0 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('tours').select('*');
      if (data) {
        setStats({
          total: data.length,
          active: data.filter(t => t.is_active).length,
          featured: data.filter(t => t.is_featured).length,
          totalBookings: data.reduce((s, t) => s + t.current_bookings, 0),
        });
      }
    })();
  }, []);

  const cards = [
    { label: 'Total Tours', value: stats.total, icon: Map, color: 'text-green-600' },
    { label: 'Active Tours', value: stats.active, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Featured Tours', value: stats.featured, icon: DollarSign, color: 'text-amber-600' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'text-purple-600' },
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
