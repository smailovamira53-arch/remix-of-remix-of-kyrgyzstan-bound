import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ChevronDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface BookingFormModalProps {
  open: boolean;
  onClose: () => void;
  tourTitle: string;
  tourPrice: number;
  tourId?: string;
}

const COUNTRY_CODES = [
  { code: '+996', country: 'KG', label: 'KG +996', placeholder: '700 000 000' },
  { code: '+7',   country: 'RU', label: 'RU +7',   placeholder: '900 000 0000' },
  { code: '+7',   country: 'KZ', label: 'KZ +7',   placeholder: '700 000 0000' },
  { code: '+998', country: 'UZ', label: 'UZ +998', placeholder: '90 000 0000' },
  { code: '+1',   country: 'US', label: 'US +1',   placeholder: '202 000 0000' },
  { code: '+44',  country: 'GB', label: 'GB +44',  placeholder: '7700 000000' },
  { code: '+49',  country: 'DE', label: 'DE +49',  placeholder: '151 000 0000' },
  { code: '+33',  country: 'FR', label: 'FR +33',  placeholder: '6 00 00 00 00' },
  { code: '+34',  country: 'ES', label: 'ES +34',  placeholder: '600 000 000' },
  { code: '+39',  country: 'IT', label: 'IT +39',  placeholder: '320 000 0000' },
  { code: '+31',  country: 'NL', label: 'NL +31',  placeholder: '6 0000 0000' },
  { code: '+41',  country: 'CH', label: 'CH +41',  placeholder: '78 000 0000' },
  { code: '+43',  country: 'AT', label: 'AT +43',  placeholder: '650 000 0000' },
  { code: '+48',  country: 'PL', label: 'PL +48',  placeholder: '500 000 000' },
  { code: '+380', country: 'UA', label: 'UA +380', placeholder: '50 000 0000' },
  { code: '+90',  country: 'TR', label: 'TR +90',  placeholder: '530 000 0000' },
  { code: '+86',  country: 'CN', label: 'CN +86',  placeholder: '130 0000 0000' },
  { code: '+81',  country: 'JP', label: 'JP +81',  placeholder: '90 0000 0000' },
  { code: '+82',  country: 'KR', label: 'KR +82',  placeholder: '10 0000 0000' },
  { code: '+91',  country: 'IN', label: 'IN +91',  placeholder: '90000 00000' },
  { code: '+966', country: 'SA', label: 'SA +966', placeholder: '50 000 0000' },
  { code: '+971', country: 'AE', label: 'AE +971', placeholder: '50 000 0000' },
  { code: '+61',  country: 'AU', label: 'AU +61',  placeholder: '400 000 000' },
  { code: '+55',  country: 'BR', label: 'BR +55',  placeholder: '11 90000 0000' },
];

// ── Мини-календарь ────────────────────────────────────────────────────────
const DateRangePicker = ({
  startDate, endDate, onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su'];
  const toStr = (d: Date) => d.toISOString().split('T')[0];
  const toStrDay = (day: number) => toStr(new Date(year, month, day));

  const handleDay = (day: number) => {
    const clicked = new Date(year, month, day);
    if (clicked < today) return;
    const str = toStrDay(day);
    if (!startDate || (startDate && endDate)) {
      onChange(str, '');
    } else {
      const s = str < startDate ? str : startDate;
      const e = str < startDate ? startDate : str;
      onChange(s, e);
    }
  };

  return (
    <div className="bg-white border border-border rounded-xl p-3 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-lg leading-none">‹</button>
        <span className="text-sm font-semibold">{MONTHS[month]} {year}</span>
        <button type="button" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-lg leading-none">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] text-muted-foreground py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`_${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const str = toStrDay(day);
          const past = new Date(year, month, day) < today;
          const isStart = str === startDate;
          const isEnd = str === endDate;
          const inRange = !!startDate && !!endDate && str > startDate && str < endDate;
          return (
            <button key={day} type="button" disabled={past} onClick={() => handleDay(day)}
              className={[
                'h-7 text-xs w-full transition-all',
                past ? 'text-muted-foreground/30 cursor-not-allowed' : 'cursor-pointer',
                isStart || isEnd ? 'bg-primary text-primary-foreground rounded font-bold' : '',
                inRange ? 'bg-primary/15' : '',
                !past && !isStart && !isEnd ? 'hover:bg-primary/10' : '',
              ].join(' ')}
            >{day}</button>
          );
        })}
      </div>
      <p className="text-[10px] text-center text-muted-foreground mt-2">
        {!startDate ? 'Select arrival date' : !endDate ? 'Select departure date' : '✓ Dates selected'}
      </p>
    </div>
  );
};

// ── Основной компонент ────────────────────────────────────────────────────
export const BookingFormModal = ({
  open, onClose, tourTitle, tourPrice, tourId,
}: BookingFormModalProps) => {
  const { toast } = useToast();
  const { t, language, isRTL } = useLanguage();

  const [form, setForm] = useState({
    name: '', email: '', phoneCode: '+996', phoneNumber: '', people: '1', message: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCodePicker, setShowCodePicker] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const selectedCountry = COUNTRY_CODES.find(c => c.code === form.phoneCode) || COUNTRY_CODES[0];
  const formatDateRange = () => !startDate ? '' : !endDate ? startDate : `${startDate} → ${endDate}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phoneNumber.trim()) return;

    setSending(true);
    try {
      const fullPhone = form.phoneCode + form.phoneNumber.replace(/\s/g, '');
      const notesArr = [
        form.message,
        formatDateRange() ? `Dates: ${formatDateRange()}` : '',
      ].filter(Boolean);

      const { error } = await supabase.from('bookings').insert({
  tour_id:      tourId ?? null,
  name:         form.name.trim(),
  email:        form.email.trim(),
  phone:        fullPhone,
  people_count: parseInt(form.people) || 1,
  language:     language,
  notes:        notesArr.length ? notesArr.join('\n') : null,
  status:       'new',
});

      if (error) {
        toast({ title: 'Error saving booking', description: error.message, variant: 'destructive' });
        return;
      }

      toast({
        title: t.bookingForm.successTitle,
        description: t.bookingForm.successDescription,
      });

      // сброс
      setForm({ name: '', email: '', phoneCode: '+996', phoneNumber: '', people: '1', message: '' });
      setStartDate('');
      setEndDate('');
      setShowCalendar(false);
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => { onClose(); setShowCalendar(false); setShowCodePicker(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`bg-card rounded-2xl p-6 md:p-8 shadow-2xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}
            onClick={e => { e.stopPropagation(); setShowCodePicker(false); }}
          >
            {/* Заголовок */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {t.bookingForm.title.replace('{tour}', '')}
                </h2>
                <p className="text-sm text-primary font-medium truncate max-w-[280px]">{tourTitle}</p>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 shrink-0 mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Имя */}
              <div>
                <Label htmlFor="bk-name">{t.bookingForm.name} *</Label>
                <Input id="bk-name" value={form.name}
                  onChange={e => update('name', e.target.value)} required maxLength={100} />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="bk-email">{t.bookingForm.email} *</Label>
                <Input id="bk-email" type="email" value={form.email}
                  onChange={e => update('email', e.target.value)} required maxLength={255} />
              </div>

              {/* Телефон */}
              <div>
                <Label>{t.bookingForm.phone} *</Label>
                <div className="flex gap-2">
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setShowCodePicker(!showCodePicker); setShowCalendar(false); }}
                      className="flex items-center gap-1 h-10 px-3 rounded-md border border-input bg-background text-sm hover:bg-muted font-medium whitespace-nowrap"
                    >
                      {selectedCountry.label}
                      <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5" />
                    </button>
                    {showCodePicker && (
                      <div
                        className="absolute top-full left-0 mt-1 z-50 bg-white border border-border rounded-xl shadow-xl w-44 max-h-56 overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                      >
                        {COUNTRY_CODES.map((c, i) => (
                          <button key={i} type="button"
                            onClick={() => { update('phoneCode', c.code); setShowCodePicker(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors ${c.code === form.phoneCode ? 'text-primary font-semibold' : ''}`}
                          >
                            <span>{c.country}</span>
                            <span className="text-muted-foreground">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={e => update('phoneNumber', e.target.value.replace(/[^0-9\s]/g, ''))}
                    required
                    placeholder={selectedCountry.placeholder}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Даты */}
              <div>
                <Label>{t.bookingForm.dates}</Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setShowCalendar(!showCalendar); setShowCodePicker(false); }}
                    className="w-full flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background text-sm hover:bg-muted transition-colors text-left"
                  >
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className={formatDateRange() ? 'text-foreground flex-1' : 'text-muted-foreground flex-1'}>
                      {formatDateRange() || 'Select travel dates'}
                    </span>
                    {startDate && (
                      <span
                        role="button"
                        onClick={e => { e.stopPropagation(); setStartDate(''); setEndDate(''); }}
                        className="text-muted-foreground hover:text-foreground text-base leading-none"
                      >×</span>
                    )}
                  </button>
                  {showCalendar && (
                    <div className="absolute top-full left-0 mt-1 z-50 w-full" onClick={e => e.stopPropagation()}>
                      <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(s, e) => {
                          setStartDate(s);
                          setEndDate(e);
                          if (s && e) setTimeout(() => setShowCalendar(false), 300);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Кол-во людей */}
              <div>
                <Label htmlFor="bk-people">{t.bookingForm.people}</Label>
                <Input id="bk-people" type="number" min={1} max={50}
                  value={form.people} onChange={e => update('people', e.target.value)} />
              </div>

              {/* Сообщение */}
              <div>
                <Label htmlFor="bk-msg">{t.bookingForm.message}</Label>
                <Textarea id="bk-msg" value={form.message}
                  onChange={e => update('message', e.target.value)}
                  rows={3} maxLength={1000} placeholder={t.bookingForm.messagePlaceholder} />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? t.bookingForm.submitting : t.bookingForm.submit}
              </Button>

              <p className="text-xs text-center text-muted-foreground">{t.bookingForm.note}</p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};