import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const widgetTranslations = {
  en: {
    title: 'Mountain Magic Tours',
    subtitle: 'Choose a manager',
    footer: 'We usually reply within 15 minutes',
    message: 'Hello, I would like to know more about the tour...',
  },
  ru: {
    title: 'Mountain Magic Tours',
    subtitle: 'Выберите менеджера',
    footer: 'Обычно отвечаем в течение 15 минут',
    message: 'Здравствуйте, я хочу узнать подробнее о туре...',
  },
  es: {
    title: 'Mountain Magic Tours',
    subtitle: 'Elige un manager',
    footer: 'Solemos responder en 15 minutos',
    message: 'Hola, me gustaría saber más sobre el tour...',
  },
  ar: {
    title: 'Mountain Magic Tours',
    subtitle: 'اختر مديراً',
    footer: 'نرد عادةً خلال 15 دقيقة',
    message: 'مرحباً، أريد معرفة المزيد عن الجولة...',
  },
};

const managers = [
  { name: 'Улукбек', role: 'En / Ru', phone: '996707509509', photo: '/team/ulukbek.jpg' },
  { name: 'Руслан',  role: 'En / Ru', phone: '996703404054', photo: '/team/ruslan.jpeg' },
];

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const tr = widgetTranslations[language] || widgetTranslations.en;

  const handleManagerClick = (phone: string) => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(tr.message)}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-72 rounded-2xl shadow-2xl overflow-hidden bg-white"
          >
            {/* Header — тёмно-синий цвет сайта #1E3A5F */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#1E3A5F' }}>
              <div>
                <p className="font-semibold text-sm text-white">{tr.title}</p>
                <p className="text-xs text-white/70">{tr.subtitle}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-opacity">
                <X size={18} />
              </button>
            </div>

            {/* Managers */}
            <div className="p-3 space-y-1">
              {managers.map((m) => (
                <button
                  key={m.phone}
                  onClick={() => handleManagerClick(m.phone)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                >
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2"
                    style={{ borderColor: '#AFC7D9' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.role}</p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100">
              <p className="text-xs text-center" style={{ color: '#1E3A5F' }}>{tr.footer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB кнопка — тёмно-синяя */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        style={{ backgroundColor: '#1E3A5F' }}
      >
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-green-400">
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
        </span>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <X size={28} color="white" /> : <WhatsAppIcon />}
        </motion.div>
      </button>
    </div>
  );
}