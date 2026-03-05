import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const widgetTranslations = {
  en: {
    title: 'Mountain Magic Tours',
    subtitle: 'Choose a manager',
    footer: 'We usually reply within 15 minutes',
    message: 'Hello, I would like to know more about the tour...',
    workingHours: 'Working hours: 05:00 – 23:00 (Bishkek)',
    offline: "We're offline · Back at 05:00",
    phrases: [
      'I know the perfect tour for you 🏔️',
      'Save time — write to us now',
      "Let's plan your Kyrgyzstan adventure!",
    ],
  },
  ru: {
    title: 'Mountain Magic Tours',
    subtitle: 'Выберите менеджера',
    footer: 'Обычно отвечаем в течение 15 минут',
    message: 'Здравствуйте, я хочу узнать подробнее о туре...',
    workingHours: 'Время работы: 05:00 – 23:00 (Бишкек)',
    offline: 'Мы offline · Работаем с 05:00',
    phrases: [
      'Знаю идеальный тур для вас 🏔️',
      'Экономьте время — напишите нам',
      'Спланируем ваше приключение!',
    ],
  },
  es: {
    title: 'Mountain Magic Tours',
    subtitle: 'Elige un manager',
    footer: 'Solemos responder en 15 minutos',
    message: 'Hola, me gustaría saber más sobre el tour...',
    workingHours: 'Horario: 05:00 – 23:00 (Bishkek)',
    offline: 'Estamos offline · Volvemos a las 05:00',
    phrases: [
      'Conozco el tour perfecto para ti 🏔️',
      'Ahorra tiempo — escríbenos ahora',
      '¡Planifiquemos tu aventura!',
    ],
  },
  ar: {
    title: 'Mountain Magic Tours',
    subtitle: 'اختر مديراً',
    footer: 'نرد عادةً خلال 15 دقيقة',
    message: 'مرحباً، أريد معرفة المزيد عن الجولة...',
    workingHours: 'ساعات العمل: 05:00 – 23:00 (بيشكك)',
    offline: 'نحن غير متصلين · نعود الساعة 05:00',
    phrases: [
      'أعرف الجولة المثالية لك 🏔️',
      'وفّر وقتك — اكتب لنا الآن',
      'لنخطط لمغامرتك!',
    ],
  },
};

const managers = [
  {
    name: 'Улукбек',
    role: 'Tour Manager',
    langs: 'En / Ru',
    phone: '996707509509',
    photo: '/team/ulukbek.jpg',
  },
  {
    name: 'Руслан',
    role: 'Tour Manager',
    langs: 'En / Ru',
    phone: '996703404054',
    photo: '/team/ruslan.jpeg',
  },
];

function getBishkekHour(): number {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bishkek',
    hour: 'numeric',
    hour12: false,
  });
  return parseInt(formatter.format(new Date()), 10);
}

function isOnlineNow(): boolean {
  const h = getBishkekHour();
  return h >= 5 && h < 23;
}

const WhatsAppIcon = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [online, setOnline] = useState(isOnlineNow);
  const [activeManagerIndex, setActiveManagerIndex] = useState(0);
  const { language } = useLanguage();
  const tr = widgetTranslations[language] || widgetTranslations.en;

  // Check online status every minute
  useEffect(() => {
    const interval = setInterval(() => setOnline(isOnlineNow()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Rotating phrases cycle — each phrase from a different manager
  useEffect(() => {
    if (isOpen) return;

    const showNext = () => {
      setShowBubble(true);
      setTimeout(() => {
        setShowBubble(false);
        setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % tr.phrases.length);
          setActiveManagerIndex((i) => (i + 1) % managers.length);
        }, 400);
      }, 3000);
    };

    const initialTimeout = setTimeout(showNext, 2000);
    const interval = setInterval(showNext, 6400);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isOpen, tr.phrases.length]);

  const handleManagerClick = useCallback(
    (phone: string) => {
      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(tr.message)}`,
        '_blank'
      );
      setIsOpen(false);
    },
    [tr.message]
  );

  const handleFabClick = () => {
    setIsOpen((o) => !o);
    setShowBubble(false);
  };

  const currentPhrase = online ? tr.phrases[phraseIndex] : tr.offline;
  const bubbleManager = managers[activeManagerIndex];

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-80 rounded-2xl shadow-2xl overflow-hidden bg-white border border-gray-100"
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ backgroundColor: '#1E3A5F' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <WhatsAppIcon size={22} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{tr.title}</p>
                  <p className="text-xs text-white/60">{tr.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={14} className="text-white" />
              </button>
            </div>

            {/* Managers */}
            <div className="p-3 space-y-1">
              {managers.map((m) => (
                <button
                  key={m.phone}
                  onClick={() => handleManagerClick(m.phone)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        online ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {m.role} · {m.langs}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <WhatsAppIcon size={16} />
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-[11px] text-gray-500 text-center">
                {tr.workingHours}
              </p>
              <p className="text-[11px] text-gray-400 text-center mt-0.5">
                {tr.footer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble + FAB row */}
      <div className="flex items-center gap-2">
        {/* Chat-style message bubble with manager avatar */}
        <AnimatePresence>
          {showBubble && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="flex items-end gap-2 cursor-pointer"
              onClick={handleFabClick}
            >
              {/* Manager avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={bubbleManager.photo}
                  alt={bubbleManager.name}
                  className="w-8 h-8 rounded-full object-cover shadow-md"
                />
                {online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              {/* Message bubble */}
              <div className="bg-white rounded-2xl rounded-bl-md shadow-lg px-4 py-2.5 max-w-[210px] border border-gray-100">
                <p className="text-[11px] font-medium text-gray-700 leading-relaxed">
                  {currentPhrase}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5">{bubbleManager.name}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB button — #1E3A5F */}
        <button
          onClick={handleFabClick}
          className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 text-white ${
            online
              ? 'hover:scale-110 hover:shadow-xl'
              : 'opacity-70 hover:opacity-90 hover:scale-105'
          }`}
          style={{ backgroundColor: '#1E3A5F' }}
        >
          {/* Online pulse dot */}
          {online && !isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-green-400">
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={26} /> : <WhatsAppIcon size={26} />}
          </motion.div>
        </button>
      </div>
    </div>
  );
}
