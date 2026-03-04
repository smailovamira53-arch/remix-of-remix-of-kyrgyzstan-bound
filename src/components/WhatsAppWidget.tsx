import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const managers = [
  {
    name: 'Улукбек',
    langs: 'En / Ru',
    phone: '996707509509',
    avatar: '/team/ulukbek.jpg',
    isImage: true,
  },
  {
    name: 'Руслан',
    langs: 'En / Ru',
    phone: '996703404054',
    avatar: '👨‍💼',
    isImage: false,
  },
];

const WA_MESSAGE = encodeURIComponent('Здравствуйте, я хочу узнать подробнее о туре...');

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.058 9.376L1.058 31.14l5.962-1.966A15.9 15.9 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.294 22.612c-.39 1.098-1.932 2.01-3.148 2.276-.834.178-1.922.32-5.59-1.202-4.694-1.944-7.706-6.716-7.94-7.026-.226-.31-1.896-2.528-1.896-4.822s1.2-3.42 1.626-3.888c.426-.47.93-.586 1.24-.586.31 0 .62.002.89.016.286.014.67-.108.95.724.31.87 1.052 2.962 1.144 3.176.092.214.154.464.03.748-.122.286-.184.464-.368.714-.184.25-.388.558-.554.748-.184.214-.376.446-.162.874.214.428.952 1.572 2.044 2.546 1.404 1.252 2.588 1.64 2.954 1.822.368.184.582.154.796-.092.214-.248.918-1.068 1.162-1.436.244-.368.488-.306.824-.184.336.122 2.132 1.006 2.498 1.19.366.184.61.276.702.428.092.154.092.872-.298 1.97z" />
  </svg>
);

function getBishkekHour(): number {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bishkek',
    hour: 'numeric',
    hour12: false,
  });
  return parseInt(formatter.format(new Date()), 10);
}

function isBishkekOnline(): boolean {
  const hour = getBishkekHour();
  return hour >= 5 && hour < 23;
}

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(isBishkekOnline);

  useEffect(() => {
    const interval = setInterval(() => setOnline(isBishkekOnline()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleManagerClick = (phone: string) => {
    window.open(`https://wa.me/${phone}?text=${WA_MESSAGE}`, '_blank');
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && online && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-72 rounded-2xl shadow-2xl overflow-hidden bg-white mb-2"
          >
            {/* Header */}
            <div className="bg-[#25D366] px-4 py-3 text-white">
              <p className="font-bold text-sm">Mountain Magic Tours</p>
              <p className="text-xs opacity-90">Выберите менеджера</p>
            </div>

            {/* Managers */}
            <div className="p-3 space-y-2">
              {managers.map((m) => (
                <button
                  key={m.phone}
                  onClick={() => handleManagerClick(m.phone)}
                  className="flex items-center gap-3 w-full rounded-xl p-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  {m.isImage ? (
                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">{m.avatar}</span>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.langs}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 pb-3">
              <p className="text-xs text-[#25D366] text-center">Обычно отвечаем в течение 15 минут</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline tooltip */}
      {!online && (
        <div className="bg-white rounded-full px-3 py-1.5 shadow-lg text-xs text-gray-500 whitespace-nowrap">
          Мы offline · Работаем с 05:00 до 23:00
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => online && setOpen((v) => !v)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          online ? 'bg-[#25D366] hover:bg-[#20bd5a] cursor-pointer' : 'bg-gray-400 cursor-not-allowed pointer-events-none'
        }`}
      >
        <WhatsAppIcon />
        {/* Status dot */}
        <span
          className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
            online ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          }`}
        />
      </button>
    </div>
  );
}
