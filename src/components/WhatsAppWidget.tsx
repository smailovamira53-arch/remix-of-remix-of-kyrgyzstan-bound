import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const widgetTranslations = {
  en: {
    title: 'Mountain Magic Tours',
    subtitle: 'Choose a manager',
    workingHours: 'Working hours: 05:00–23:00 (Bishkek time)',
    offlineNote: "We're offline · Back at 05:00",
    offlineBadge: 'Offline',
    placeholder: 'Write your message...',
    defaultMessage: 'Hello! I would like to know more about your tours.',
    chatGreeting: 'Hello! How can I help you? 😊',
    rotating: [
      'I know the perfect tour for you 🏔️',
      'Save time — write to us now ✍️',
      "Let's plan your Kyrgyzstan adventure!",
    ],
  },
  ru: {
    title: 'Mountain Magic Tours',
    subtitle: 'Выберите менеджера',
    workingHours: 'Рабочее время: 05:00–23:00 (по Бишкеку)',
    offlineNote: 'Офлайн · Вернёмся в 05:00',
    offlineBadge: 'Офлайн',
    placeholder: 'Напишите ваше сообщение...',
    defaultMessage: 'Здравствуйте! Хочу узнать подробнее о ваших турах.',
    chatGreeting: 'Здравствуйте! Чем могу помочь? 😊',
    rotating: [
      'Я знаю, какой тур вы ищете 🏔️',
      'Сэкономьте время — напишите нам ✍️',
      'Планируем ваше приключение в Кыргызстане!',
    ],
  },
  es: {
    title: 'Mountain Magic Tours',
    subtitle: 'Elige un manager',
    workingHours: 'Horario: 05:00–23:00 (hora de Biskek)',
    offlineNote: 'Offline · Volvemos a las 05:00',
    offlineBadge: 'Offline',
    placeholder: 'Escribe tu mensaje...',
    defaultMessage: 'Hola! Me gustaría saber más sobre sus tours.',
    chatGreeting: '¡Hola! ¿En qué puedo ayudarte? 😊',
    rotating: [
      'Sé el tour perfecto para ti 🏔️',
      'Ahorra tiempo — escríbenos ahora ✍️',
      '¡Planifiquemos tu aventura en Kirguistán!',
    ],
  },
  ar: {
    title: 'Mountain Magic Tours',
    subtitle: 'اختر مديراً',
    workingHours: 'ساعات العمل: 05:00–23:00 (توقيت بيشكيك)',
    offlineNote: 'غير متصل · نعود في 05:00',
    offlineBadge: 'غير متصل',
    placeholder: 'اكتب رسالتك...',
    defaultMessage: 'مرحباً! أريد معرفة المزيد عن جولاتكم.',
    chatGreeting: 'مرحباً! كيف يمكنني مساعدتك؟ 😊',
    rotating: [
      'أعرف الجولة المثالية لك 🏔️',
      'وفّر وقتك — راسلنا الآن ✍️',
      'لنخطط لمغامرتك في قيرغيزستان!',
    ],
  },
};

const managers = [
  { name: 'Улукбек', role: 'En / Ru', phone: '996707509509', photo: '/team/ulukbek.jpg', hours: '05:00–23:00' },
  { name: 'Руслан',  role: 'En / Ru', phone: '996703404054', photo: '/team/ruslan.jpeg', hours: '05:00–23:00' },
];

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function isOnlineNow(): boolean {
  const now = new Date();
  const bishkekHour = (now.getUTCHours() + 6) % 24;
  return bishkekHour >= 5 && bishkekHour < 23;
}

export default function WhatsAppWidget() {
  const { language } = useLanguage();

  // Не показываем в админке
  if (window.location.pathname.startsWith('/admin')) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [activeManager, setActiveManager] = useState<(typeof managers)[0] | null>(null);
  const [message, setMessage] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showPhrase, setShowPhrase] = useState(false);
  const online = isOnlineNow();
  const inputRef = useRef<HTMLInputElement>(null);

  const tr = widgetTranslations[language as keyof typeof widgetTranslations] || widgetTranslations.en;

  useEffect(() => {
    if (isOpen) { setShowPhrase(false); return; }
    let idx = phraseIndex;
    const showNext = () => {
      setPhraseIndex(idx);
      setShowPhrase(true);
      setTimeout(() => { setShowPhrase(false); idx = (idx + 1) % tr.rotating.length; }, 4000);
    };
    const init = setTimeout(showNext, 10000);
    const loop = setInterval(showNext, 30000);
    return () => { clearTimeout(init); clearInterval(loop); };
  }, [isOpen]);

  useEffect(() => {
    if (activeManager) {
      setMessage('');
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [activeManager]);

  const handleFabClick = () => {
    setIsOpen(prev => !prev);
    if (isOpen) setActiveManager(null);
  };

  const handleSend = (phone: string) => {
    const text = message.trim() || tr.defaultMessage;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-20 sm:right-6 z-[9999] flex flex-col items-end gap-3">

      {/* Всплывающая фраза с аватаркой */}
      <AnimatePresence>
        {showPhrase && !isOpen && (
          <motion.div
            key={phraseIndex}
            initial={{ opacity: 0, x: 16, scale: 0.93 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="flex items-center gap-2 bg-white rounded-2xl shadow-xl px-3 py-2.5 border border-gray-100"
            style={{ maxWidth: 'min(260px, calc(100vw - 88px))' }}
          >
            <img
              src={managers[phraseIndex % managers.length].photo}
              alt={managers[phraseIndex % managers.length].name}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2"
              style={{ borderColor: '#AFC7D9' }}
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800">{managers[phraseIndex % managers.length].name}</p>
              <p className="text-xs text-gray-600 leading-snug">{tr.rotating[phraseIndex]}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Список менеджеров */}
        {isOpen && !activeManager && (
          <motion.div
            key="main-popup"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl shadow-2xl overflow-hidden bg-white"
            style={{ width: 'min(288px, calc(100vw - 32px))' }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#1E3A5F' }}>
              <div>
                <p className="font-semibold text-sm text-white">{tr.title}</p>
                <p className="text-xs text-white/70">{tr.subtitle}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-1 -mr-1">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 space-y-1">
              {managers.map(m => (
                <button
                  key={m.phone}
                  onClick={() => setActiveManager(m)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group"
                >
                  <div className="relative flex-shrink-0">
                    <img src={m.photo} alt={m.name} className="w-11 h-11 rounded-full object-cover border-2" style={{ borderColor: '#AFC7D9' }} />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: online ? '#22c55e' : '#9ca3af' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.role} · {m.hours}</p>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-gray-100" style={{ backgroundColor: online ? undefined : '#fef3c7' }}>
              {online
                ? <p className="text-xs text-center text-gray-400">{tr.workingHours}</p>
                : <p className="text-xs text-center font-medium" style={{ color: '#92400e' }}>{tr.offlineNote}</p>
              }
            </div>
          </motion.div>
        )}

        {/* Чат с менеджером */}
        {isOpen && activeManager && (
          <motion.div
            key="chat-popup"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl shadow-2xl overflow-hidden bg-white flex flex-col"
            style={{ width: 'min(288px, calc(100vw - 32px))' }}
          >
            <div className="px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: '#1E3A5F' }}>
              <button onClick={() => setActiveManager(null)} className="text-white/70 hover:text-white transition-colors flex-shrink-0 p-1 -ml-1">
                <ArrowLeft size={18} />
              </button>
              <div className="relative flex-shrink-0">
                <img src={activeManager.photo} alt={activeManager.name} className="w-9 h-9 rounded-full object-cover border-2 border-white/30" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: online ? '#22c55e' : '#9ca3af' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">{activeManager.name}</p>
                <p className="text-white/60 text-xs truncate">{activeManager.hours} · {activeManager.role}</p>
              </div>
              <button onClick={() => { setActiveManager(null); setIsOpen(false); }} className="text-white/60 hover:text-white transition-colors flex-shrink-0 p-1 -mr-1">
                <X size={16} />
              </button>
            </div>

            <div className="px-3 pt-5 pb-2">
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-white text-sm leading-relaxed" style={{ backgroundColor: '#1E3A5F' }}>
                {tr.chatGreeting}
              </div>
            </div>

            <div className="px-3 pb-3 pt-2">
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:border-blue-300 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && message.trim()) handleSend(activeManager.phone); }}
                  placeholder={tr.placeholder}
                  style={{ fontSize: 16 }}
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 min-w-0"
                />
                <button
                  onClick={() => handleSend(activeManager.phone)}
                  disabled={!message.trim()}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                  style={{ backgroundColor: message.trim() ? '#1E3A5F' : '#e5e7eb' }}
                >
                  <Send size={15} color={message.trim() ? 'white' : '#9ca3af'} className="translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB кнопка */}
      <motion.button
        onClick={handleFabClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="relative rounded-full shadow-xl flex items-center justify-center"
        style={{ width: 52, height: 52, backgroundColor: online ? '#1E3A5F' : '#6b7280' }}
        aria-label="WhatsApp"
      >
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ backgroundColor: online ? '#22c55e' : '#9ca3af' }}>
          {online && <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />}
        </span>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <X size={24} color="white" /> : <WhatsAppIcon size={24} />}
        </motion.div>
      </motion.button>

      {/* Офлайн подпись */}
      <AnimatePresence>
        {!online && !isOpen && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-center text-gray-500 bg-white/90 rounded-lg px-2 py-1 shadow-sm border border-gray-100 leading-tight"
            style={{ maxWidth: 130 }}
          >
            {tr.offlineNote}
          </motion.p>
        )}
      </AnimatePresence>

    </div>
  );
}