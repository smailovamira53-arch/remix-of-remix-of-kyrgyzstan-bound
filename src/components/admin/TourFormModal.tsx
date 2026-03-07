import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, Upload, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface TourFormModalProps {
  tour: any | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = ['day', 'package', 'multi-day'];
const TAGS = ['trekking', 'horse-riding', 'ski-touring', 'yurt-camping', 'photography-tours', 'mountain-biking'];
const TAG_LABELS: Record<string, string> = {
  'trekking': 'Trekking', 'horse-riding': 'Horse Riding', 'ski-touring': 'Ski Touring',
  'yurt-camping': 'Yurt Camping', 'photography-tours': 'Photography Tours', 'mountain-biking': 'Mountain Biking',
};
const DESTINATION_GROUPS = {
  Kyrgyzstan: ['Issyk-Kul Lake','Ala-Archa Gorge','Song-Kul Lake','Jeti-Oguz Canyon','Karakol','Skazka Canyon','Altyn Arashan','Tash Rabat','Burana Tower','Arslanbob','Osh','Sary-Chelek Lake','Kel-Suu Lake','Lenin Peak Base Camp','Jyrgalan Valley'],
  Kazakhstan: ['Big Almaty Lake','Charyn Canyon','Kolsai Lakes','Kaindy Lake','Almaty','Turkestan'],
  Uzbekistan: ['Tashkent','Samarkand','Bukhara','Khiva'],
};
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const CURRENCIES = ['USD', 'EUR', 'KGS'];

const LANG_BORDER: Record<string, string> = {
  en: 'border-blue-400',
  ru: 'border-green-400',
  es: 'border-orange-400',
  ar: 'border-purple-400',
};
const LANG_BADGE: Record<string, string> = {
  en: 'bg-blue-100 text-blue-700 border-blue-300',
  ru: 'bg-green-100 text-green-700 border-green-300',
  es: 'bg-orange-100 text-orange-700 border-orange-300',
  ar: 'bg-purple-100 text-purple-700 border-purple-300',
};
const LANG_LABEL: Record<string, string> = {
  en: 'EN 🇬🇧', ru: 'RU 🇷🇺', es: 'ES 🇪🇸', ar: 'AR 🇸🇦',
};
const LANGS = ['en', 'ru', 'es', 'ar'] as const;

// ── Одно поле с бейджем языка (без скролла при фокусе) ──────────────────────
const LangTextarea = ({ lang, value, onChange, rows = 4 }: {
  lang: string; value: string; onChange: (v: string) => void; rows?: number;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <div className={`relative border-2 rounded-xl ${LANG_BORDER[lang]} bg-white overflow-hidden`}>
      <span className={`absolute top-2 left-2.5 text-[11px] font-bold px-1.5 py-0.5 rounded border ${LANG_BADGE[lang]} z-10 pointer-events-none select-none`}>
        {LANG_LABEL[lang]}
      </span>
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        dir={lang === 'ar' ? 'rtl' : undefined}
        rows={rows}
        onFocus={() => {/* prevent scroll */}}
        className="w-full pt-8 px-3 pb-2 text-sm bg-transparent resize-none outline-none focus:outline-none border-none"
        style={{ scrollMargin: 0 }}
      />
    </div>
  );
};

const LangInput = ({ lang, value, onChange, placeholder }: {
  lang: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) => (
  <div className={`relative border-2 rounded-xl ${LANG_BORDER[lang]} bg-white overflow-hidden`}>
    <span className={`absolute top-1/2 -translate-y-1/2 left-2.5 text-[11px] font-bold px-1.5 py-0.5 rounded border ${LANG_BADGE[lang]} z-10 pointer-events-none select-none`}>
      {LANG_LABEL[lang]}
    </span>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      dir={lang === 'ar' ? 'rtl' : undefined}
      placeholder={placeholder}
      className="w-full pl-16 pr-3 py-2.5 text-sm bg-transparent outline-none focus:outline-none border-none"
    />
  </div>
);

// ── 4 поля 2×2 ──────────────────────────────────────────────────────────────
const QuadTextarea = ({ label, fieldBase, rows = 4, hint, g, set }: {
  label: string; fieldBase: string; rows?: number; hint?: string;
  g: (k: string) => any; set: (k: string, v: any) => void;
}) => (
  <div>
    <Label className="mb-2 block text-sm font-semibold">
      {label}{hint && <span className="text-gray-400 font-normal text-xs ml-1.5">{hint}</span>}
    </Label>
    <div className="grid grid-cols-2 gap-3">
      {LANGS.map(lang => (
        <LangTextarea key={lang} lang={lang} value={g(`${fieldBase}_${lang}`)} onChange={v => set(`${fieldBase}_${lang}`, v)} rows={rows} />
      ))}
    </div>
  </div>
);

const QuadInput = ({ label, fieldBase, hint, g, set }: {
  label: string; fieldBase: string; hint?: string;
  g: (k: string) => any; set: (k: string, v: any) => void;
}) => (
  <div>
    <Label className="mb-2 block text-sm font-semibold">
      {label}{hint && <span className="text-gray-400 font-normal text-xs ml-1.5">{hint}</span>}
    </Label>
    <div className="grid grid-cols-2 gap-3">
      {LANGS.map(lang => (
        <LangInput key={lang} lang={lang} value={g(`title_${lang}`)} onChange={v => set(`title_${lang}`, v)} />
      ))}
    </div>
  </div>
);

const TourFormModal = ({ tour, onClose, onSaved }: TourFormModalProps) => {
  const isEdit = !!tour;
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});
  const toggleDay = (key: string) => setCollapsedDays(prev => ({ ...prev, [key]: !prev[key] }));

  const parseItinerary = (raw: any) => {
    if (!raw) return [{ day: 1, title: '', description: '' }];
    if (Array.isArray(raw)) return raw.length > 0 ? raw : [{ day: 1, title: '', description: '' }];
    try { return JSON.parse(raw); } catch { return [{ day: 1, title: '', description: '' }]; }
  };

  const [form, setForm] = useState({
    title_en: tour?.title || tour?.title_en || '', title_ru: tour?.title_ru || '', title_es: tour?.title_es || '', title_ar: tour?.title_ar || '',
    description_en: tour?.description || tour?.description_en || '', description_ru: tour?.description_ru || '', description_es: tour?.description_es || '', description_ar: tour?.description_ar || '',
    price: tour?.price || 0, currency: tour?.currency || 'USD', duration: tour?.duration || '',
    max_people: tour?.max_people || 20, difficulty: tour?.difficulty || 'easy', category: tour?.category || 'package',
    is_active: tour?.is_active ?? true, is_featured: tour?.is_featured ?? false, is_event: tour?.is_event ?? false,
    cover_image: tour?.image_url || '', gallery_images: tour?.gallery_images || [],
    start_date: tour?.start_date || '', end_date: tour?.end_date || '', status: tour?.status || 'Open',
    tags: tour?.tags || '', destinations: tour?.destinations || [],
    highlights_en: (tour?.highlights || []).join('\n'),     highlights_ru: (tour?.highlights_ru || []).join('\n'),
    highlights_es: (tour?.highlights_es || []).join('\n'),  highlights_ar: (tour?.highlights_ar || []).join('\n'),
    included_en: (tour?.included || []).join('\n'),         included_ru: (tour?.included_ru || []).join('\n'),
    included_es: (tour?.included_es || []).join('\n'),      included_ar: (tour?.included_ar || []).join('\n'),
    not_included_en: (tour?.not_included || []).join('\n'), not_included_ru: (tour?.not_included_ru || []).join('\n'),
    not_included_es: (tour?.not_included_es || []).join('\n'), not_included_ar: (tour?.not_included_ar || []).join('\n'),
    itinerary_en: parseItinerary(tour?.itinerary),         itinerary_ru: parseItinerary(tour?.itinerary_ru),
    itinerary_es: parseItinerary(tour?.itinerary_es),      itinerary_ar: parseItinerary(tour?.itinerary_ar),
    packing_tips_en: (tour?.packing_tips || []).join('\n'),     packing_tips_ru: (tour?.packing_tips_ru || []).join('\n'),
    packing_tips_es: (tour?.packing_tips_es || []).join('\n'),  packing_tips_ar: (tour?.packing_tips_ar || []).join('\n'),
    // Event fields
    why_it_matters_en: tour?.why_it_matters    || '', why_it_matters_ru: tour?.why_it_matters_ru || '',
    why_it_matters_es: tour?.why_it_matters_es || '', why_it_matters_ar: tour?.why_it_matters_ar || '',
    who_is_it_for_en: (tour?.who_is_it_for || []).join('\n'),     who_is_it_for_ru: (tour?.who_is_it_for_ru || []).join('\n'),
    who_is_it_for_es: (tour?.who_is_it_for_es || []).join('\n'),  who_is_it_for_ar: (tour?.who_is_it_for_ar || []).join('\n'),
    optional_experiences_en: (tour?.optional_experiences || []).join('\n'),     optional_experiences_ru: (tour?.optional_experiences_ru || []).join('\n'),
    optional_experiences_es: (tour?.optional_experiences_es || []).join('\n'),  optional_experiences_ar: (tour?.optional_experiences_ar || []).join('\n'),
  });

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const g = (field: string) => (form as any)[field];
  const splitLines = (s: string) => s.split('\n').map((x: string) => x.trim()).filter(Boolean);

  // Itinerary — добавление/удаление синхронно во всех языках
  const getIt = (lang: string) => g(`itinerary_${lang}`);
  const addDay = () => LANGS.forEach(lang => {
    const days = getIt(lang);
    set(`itinerary_${lang}`, [...days, { day: days.length + 1, title: '', description: '' }]);
  });
  const removeDay = (idx: number) => LANGS.forEach(lang => {
    set(`itinerary_${lang}`, getIt(lang).filter((_: any, i: number) => i !== idx).map((d: any, i: number) => ({ ...d, day: i + 1 })));
  });
  const updateDay = (lang: string, idx: number, field: string, value: string) => {
    set(`itinerary_${lang}`, getIt(lang).map((d: any, i: number) => i === idx ? { ...d, [field]: value } : d));
  };

  // Destinations
  const [expandedDest, setExpandedDest] = useState<string[]>([]);
  const toggleDest = (dest: string) => set('destinations', form.destinations.includes(dest) ? form.destinations.filter((d: string) => d !== dest) : [...form.destinations, dest]);
  const toggleAllDest = (country: string) => {
    const subs = DESTINATION_GROUPS[country as keyof typeof DESTINATION_GROUPS];
    const all = subs.every((s: string) => form.destinations.includes(s));
    set('destinations', all ? form.destinations.filter((d: string) => !subs.includes(d)) : [...new Set([...form.destinations, ...subs])]);
  };

  // Upload
  const uploadImage = async (file: File, isGallery = false) => {
    const setter = isGallery ? setUploadingGallery : setUploading;
    setter(true);
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('tour-images').upload(path, file);
    if (error) { toast({ title: 'Upload failed', description: error.message, variant: 'destructive' }); setter(false); return null; }
    const { data } = supabase.storage.from('tour-images').getPublicUrl(path);
    setter(false); return data.publicUrl;
  };
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const url = await uploadImage(file); if (url) set('cover_image', url);
  };
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.gallery_images.length + files.length > 10) { toast({ title: 'Maximum 10 gallery images', variant: 'destructive' }); return; }
    for (const file of files) { const url = await uploadImage(file, true); if (url) setForm(f => ({ ...f, gallery_images: [...f.gallery_images, url] })); }
  };
  const removeGalleryImage = (idx: number) => setForm(f => ({ ...f, gallery_images: f.gallery_images.filter((_: string, i: number) => i !== idx) }));

  const handleSave = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.title_en.trim())       newErrors.title_en = true;
    if (!form.description_en.trim()) newErrors.description_en = true;
    if (!form.price || Number(form.price) <= 0) newErrors.price = true;
    if (!form.duration.trim())       newErrors.duration = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({ title: 'Заполните обязательные поля', description: 'Поля выделены красным', variant: 'destructive' });
      return;
    }
    setErrors({});
    setSaving(true);
    const slug = form.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const ev = form.is_event;
    const payload: Record<string, unknown> = {
      title: form.title_en, title_en: form.title_en, title_ru: form.title_ru, title_es: form.title_es, title_ar: form.title_ar,
      description: form.description_en, description_en: form.description_en, description_ru: form.description_ru, description_es: form.description_es, description_ar: form.description_ar,
      price: Number(form.price), currency: form.currency, duration: form.duration, max_people: Number(form.max_people),
      difficulty: form.difficulty, category: form.category, is_active: form.is_active, is_featured: form.is_featured, is_event: form.is_event,
      image_url: form.cover_image || null, gallery_images: form.gallery_images,
      start_date: form.start_date || null, end_date: form.end_date || null, status: form.status,
      slug: isEdit ? (tour.slug || slug) : slug, tags: form.tags || '', destinations: form.destinations || [],
      highlights: splitLines(form.highlights_en), highlights_ru: splitLines(form.highlights_ru), highlights_es: splitLines(form.highlights_es), highlights_ar: splitLines(form.highlights_ar),
      included: splitLines(form.included_en), included_ru: splitLines(form.included_ru), included_es: splitLines(form.included_es), included_ar: splitLines(form.included_ar),
      not_included: splitLines(form.not_included_en), not_included_ru: splitLines(form.not_included_ru), not_included_es: splitLines(form.not_included_es), not_included_ar: splitLines(form.not_included_ar),
      itinerary: form.itinerary_en, itinerary_ru: form.itinerary_ru, itinerary_es: form.itinerary_es, itinerary_ar: form.itinerary_ar,
      packing_tips: splitLines(form.packing_tips_en), packing_tips_ru: splitLines(form.packing_tips_ru), packing_tips_es: splitLines(form.packing_tips_es), packing_tips_ar: splitLines(form.packing_tips_ar),
      why_it_matters: ev ? form.why_it_matters_en : '', why_it_matters_ru: ev ? form.why_it_matters_ru : '', why_it_matters_es: ev ? form.why_it_matters_es : '', why_it_matters_ar: ev ? form.why_it_matters_ar : '',
      who_is_it_for: ev ? splitLines(form.who_is_it_for_en) : [], who_is_it_for_ru: ev ? splitLines(form.who_is_it_for_ru) : [], who_is_it_for_es: ev ? splitLines(form.who_is_it_for_es) : [], who_is_it_for_ar: ev ? splitLines(form.who_is_it_for_ar) : [],
      optional_experiences: ev ? splitLines(form.optional_experiences_en) : [], optional_experiences_ru: ev ? splitLines(form.optional_experiences_ru) : [], optional_experiences_es: ev ? splitLines(form.optional_experiences_es) : [], optional_experiences_ar: ev ? splitLines(form.optional_experiences_ar) : [],
      // program_highlights сохраняем пустыми (убрали секции)
      program_highlights: [], program_highlights_ru: [], program_highlights_es: [], program_highlights_ar: [],
    };
    const { error } = isEdit
      ? await supabase.from('tours').update(payload as any).eq('id', tour.id)
      : await supabase.from('tours').insert(payload as any);
    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: isEdit ? 'Тур обновлён!' : 'Тур создан!' }); onSaved(); }
    setSaving(false);
  };

  // ── Маршрут по дням ──────────────────────────────────────────────────────
  const ItinerarySection = () => {
    const enDays = getIt('en');
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold">Маршрут по дням</Label>
          <Button type="button" size="sm" variant="outline" onClick={addDay} className="gap-1 text-xs">
            <Plus className="w-3 h-3" /> Добавить день
          </Button>
        </div>
        <div className="space-y-2">
          {enDays.map((_: any, idx: number) => {
            const dayNum = idx + 1;
            const key = `day_${idx}`;
            const isCollapsed = collapsedDays[key] !== false;
            return (
              <div key={idx} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 cursor-pointer select-none" onClick={() => toggleDay(key)}>
                  <div className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-xs font-bold shrink-0">{dayNum}</div>
                  <span className="flex-1 text-sm font-semibold text-gray-700 truncate">
                    {getIt('en')[idx]?.title || `День ${dayNum}`}
                  </span>
                  <div className="flex items-center gap-2">
                    {enDays.length > 1 && (
                      <button type="button" onClick={e => { e.stopPropagation(); removeDay(idx); }} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isCollapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="p-4 space-y-4 bg-white">
                    {/* Дата — только EN */}
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Дата (необязательно, напр. August 30)</label>
                      <input
                        value={getIt('en')[idx]?.date || ''}
                        onChange={e => updateDay('en', idx, 'date', e.target.value)}
                        placeholder="August 30"
                        className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E3A5F]"
                      />
                    </div>
                    {/* Название дня — 2×2 */}
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-2">Название дня</label>
                      <div className="grid grid-cols-2 gap-3">
                        {LANGS.map(lang => (
                          <div key={lang} className={`relative border-2 rounded-xl ${LANG_BORDER[lang]} bg-white overflow-hidden`}>
                            <span className={`absolute top-1/2 -translate-y-1/2 left-2.5 text-[11px] font-bold px-1.5 py-0.5 rounded border ${LANG_BADGE[lang]} z-10 pointer-events-none select-none`}>
                              {LANG_LABEL[lang]}
                            </span>
                            <input
                              value={getIt(lang)[idx]?.title || ''}
                              onChange={e => updateDay(lang, idx, 'title', e.target.value)}
                              dir={lang === 'ar' ? 'rtl' : undefined}
                              className="w-full pl-16 pr-3 py-2.5 text-sm bg-transparent outline-none focus:outline-none border-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Описание дня — 2×2 */}
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-2">Описание дня</label>
                      <div className="grid grid-cols-2 gap-3">
                        {LANGS.map(lang => (
                          <div key={lang} className={`relative border-2 rounded-xl ${LANG_BORDER[lang]} bg-white overflow-hidden`}>
                            <span className={`absolute top-2 left-2.5 text-[11px] font-bold px-1.5 py-0.5 rounded border ${LANG_BADGE[lang]} z-10 pointer-events-none select-none`}>
                              {LANG_LABEL[lang]}
                            </span>
                            <textarea
                              value={getIt(lang)[idx]?.description || ''}
                              onChange={e => updateDay(lang, idx, 'description', e.target.value)}
                              dir={lang === 'ar' ? 'rtl' : undefined}
                              rows={3}
                              className="w-full pt-8 px-3 pb-2 text-sm bg-transparent resize-none outline-none focus:outline-none border-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50"
      style={{ overflowY: 'scroll' }}  /* scroll на внешнем — не прыгает при фокусе */
    >
      <div className="bg-white w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Шапка */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Редактировать тур' : 'Добавить новый тур'}</h2>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1">
              {LANGS.map(lang => <span key={lang} className={`text-[11px] font-bold px-2 py-0.5 rounded border ${LANG_BADGE[lang]}`}>{LANG_LABEL[lang]}</span>)}
            </div>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
          </div>
        </div>

        {/* Тело — обычный div без overflow, скролл на внешнем оверлее */}
        <div ref={scrollRef} className="px-6 py-6 space-y-7 flex-1 overflow-y-auto">

          {/* ── ТЕКСТОВЫЙ КОНТЕНТ ── */}
          <section className="space-y-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">📝 Текстовый контент</p>

            {/* Название — 2×2 input */}
            <div>
              <Label className="mb-2 block text-sm font-semibold">
                Название тура <span className="text-gray-400 font-normal text-xs ml-1">(EN обязательно)</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {LANGS.map(lang => (
                  <div key={lang} className={`relative border-2 rounded-xl ${lang === 'en' && errors.title_en ? 'border-red-400' : LANG_BORDER[lang]} bg-white overflow-hidden`}>
                    <span className={`absolute top-1/2 -translate-y-1/2 left-2.5 text-[11px] font-bold px-1.5 py-0.5 rounded border ${LANG_BADGE[lang]} z-10 pointer-events-none select-none`}>
                      {LANG_LABEL[lang]}
                    </span>
                    <input
                      value={g(`title_${lang}`)}
                      onChange={e => { set(`title_${lang}`, e.target.value); if (lang === 'en') setErrors(p => ({ ...p, title_en: false })); }}
                      dir={lang === 'ar' ? 'rtl' : undefined}
                      className="w-full pl-16 pr-3 py-3 text-sm bg-transparent outline-none focus:outline-none border-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <QuadTextarea label="Описание" fieldBase="description" rows={5} g={g} set={set} />
            <QuadTextarea label="Highlights" fieldBase="highlights" rows={4} hint="каждый пункт с новой строки" g={g} set={set} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <QuadTextarea label="Включено" fieldBase="included" rows={4} hint="с новой строки" g={g} set={set} />
              <QuadTextarea label="Не включено" fieldBase="not_included" rows={4} hint="с новой строки" g={g} set={set} />
            </div>

            <QuadTextarea label="Что взять с собой" fieldBase="packing_tips" rows={3} hint="с новой строки" g={g} set={set} />

            {/* Маршрут по дням */}
            <ItinerarySection />
          </section>

          {/* ── EVENT ПОЛЯ ── */}
          {form.is_event && (
            <section className="border-2 border-amber-200 bg-amber-50/20 rounded-2xl p-5 space-y-6">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">🏆 Event поля</p>

              {/* Порядок: Почему это важно → Для кого → Дополнительные */}
              <QuadTextarea label="Почему это важно" fieldBase="why_it_matters" rows={4} g={g} set={set} />
              <QuadTextarea label="Для кого этот тур?" fieldBase="who_is_it_for" rows={3} hint="с новой строки" g={g} set={set} />
              <QuadTextarea label="Дополнительные впечатления" fieldBase="optional_experiences" rows={3} hint="с новой строки" g={g} set={set} />
            </section>
          )}

          {/* ── ОСНОВНЫЕ НАСТРОЙКИ ── */}
          <section className="border border-gray-200 rounded-xl p-5 space-y-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">⚙️ Основные настройки</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs mb-1 block">Цена {errors.price && <span className="text-red-500 text-xs">*</span>}</Label>
                <Input type="number" min={0} value={form.price} onChange={e => { set('price', e.target.value); setErrors(p => ({ ...p, price: false })); }} className={errors.price ? 'border-red-400' : ''} />
              </div>
              <div><Label className="text-xs mb-1 block">Валюта</Label>
                <Select value={form.currency} onValueChange={v => set('currency', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Продолжительность {errors.duration && <span className="text-red-500 text-xs">*</span>}</Label>
                <Input value={form.duration} onChange={e => { set('duration', e.target.value); setErrors(p => ({ ...p, duration: false })); }} placeholder="5 Days" className={errors.duration ? 'border-red-400' : ''} />
              </div>
              <div><Label className="text-xs mb-1 block">Макс. людей</Label><Input type="number" min={1} value={form.max_people} onChange={e => set('max_people', e.target.value)} /></div>
              <div><Label className="text-xs mb-1 block">Сложность</Label>
                <Select value={form.difficulty} onValueChange={v => set('difficulty', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs mb-1 block">Категория</Label>
                <Select value={form.category} onValueChange={v => set('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs mb-1 block">Дата начала</Label><Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} /></div>
              <div><Label className="text-xs mb-1 block">Дата окончания</Label><Input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} /></div>
            </div>

            {/* Теги */}
            <div>
              <Label className="text-xs font-bold mb-2 block">Теги активностей</Label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => {
                  const selected = (form.tags || '').split(',').map((t: string) => t.trim()).includes(tag);
                  return (
                    <button key={tag} type="button"
                      onClick={() => { const cur = (form.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean); set('tags', (selected ? cur.filter(t => t !== tag) : [...cur, tag]).join(', ')); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selected ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#1E3A5F]'}`}>
                      {TAG_LABELS[tag]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Destinations */}
            <div>
              <Label className="text-xs font-bold mb-2 block">Направления</Label>
              <div className="space-y-2">
                {(Object.keys(DESTINATION_GROUPS) as (keyof typeof DESTINATION_GROUPS)[]).map(country => {
                  const subs = DESTINATION_GROUPS[country];
                  const allSelected = subs.every((s: string) => form.destinations.includes(s));
                  const someSelected = subs.some((s: string) => form.destinations.includes(s));
                  const isExpanded = expandedDest.includes(country);
                  return (
                    <div key={country} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-2 bg-gray-50">
                        <input type="checkbox" checked={allSelected} ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }} onChange={() => toggleAllDest(country)} className="rounded accent-[#1E3A5F] w-4 h-4" />
                        <span className="text-sm font-semibold flex-1">{country}</span>
                        <button type="button" onClick={() => setExpandedDest(prev => prev.includes(country) ? prev.filter(x => x !== country) : [...prev, country])} className="text-gray-400 hover:text-gray-600">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="px-4 py-2 grid grid-cols-2 md:grid-cols-3 gap-1">
                          {subs.map((sub: string) => (
                            <label key={sub} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input type="checkbox" checked={form.destinations.includes(sub)} onChange={() => toggleDest(sub)} className="rounded accent-[#1E3A5F] w-3.5 h-3.5" />
                              <span className="text-sm text-gray-700">{sub}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {form.destinations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.destinations.map((d: string) => (
                    <span key={d} className="flex items-center gap-1 px-2.5 py-1 bg-[#1E3A5F]/10 text-[#1E3A5F] text-xs rounded-full">
                      {d}<button type="button" onClick={() => toggleDest(d)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 pt-1">
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => set('is_active', v)} /><Label>Активный</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={v => set('is_featured', v)} /><Label>Featured</Label></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_event} onCheckedChange={v => set('is_event', v)} />
                <Label className="flex items-center gap-1.5">
                  Событийный тур
                  {form.is_event && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">EVENT</span>}
                </Label>
              </div>
            </div>
          </section>

          {/* ── ОБЛОЖКА ── */}
          <section className="border border-gray-200 rounded-xl p-4">
            <Label className="font-semibold block mb-3">Обложка тура</Label>
            <div className="flex items-center gap-4">
              {form.cover_image && (
                <div className="relative">
                  <img src={form.cover_image} alt="" className="w-24 h-24 rounded-lg object-cover" />
                  <button onClick={() => set('cover_image', '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </div>
              )}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-green-500 hover:text-green-600 transition-colors">
                <Upload className="w-4 h-4" />{uploading ? 'Загрузка...' : 'Загрузить обложку'}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploading} />
              </label>
            </div>
          </section>

          {/* ── ГАЛЕРЕЯ ── */}
          <section className="border border-gray-200 rounded-xl p-4">
            <Label className="font-semibold block mb-3">Галерея (макс. 10 фото)</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {form.gallery_images.map((url: string, idx: number) => (
                <div key={idx} className="relative group">
                  <img src={url} alt="" className="w-full aspect-square rounded-lg object-cover" />
                  <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              {form.gallery_images.length < 10 && (
                <label className="cursor-pointer flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-green-500 hover:text-green-600 transition-colors">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">{uploadingGallery ? 'Загрузка...' : 'Добавить'}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                </label>
              )}
            </div>
          </section>

          {/* Отступ снизу для кнопок */}
          <div className="h-4" />
        </div>

        {/* Кнопки — sticky снизу */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-xl z-20">
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#16a34a] hover:bg-[#15803d]">
            {saving ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать тур'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourFormModal;