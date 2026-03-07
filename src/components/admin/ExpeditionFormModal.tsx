import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, Upload, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface ExpeditionFormModalProps {
  expedition: any | null;
  onClose: () => void;
  onSaved: () => void;
}

const DIFFICULTIES = ['easy', 'moderate', 'hard', 'expert'];
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

// ── Многострочное поле с бейджем языка ──────────────────────────────────────
const LangTextarea = ({ lang, value, onChange, rows = 4 }: {
  lang: string; value: string; onChange: (v: string) => void; rows?: number;
}) => (
  <div className={`relative border-2 rounded-xl ${LANG_BORDER[lang]} bg-white overflow-hidden`}>
    <span className={`absolute top-2 left-2.5 text-[11px] font-bold px-1.5 py-0.5 rounded border ${LANG_BADGE[lang]} z-10 pointer-events-none select-none`}>
      {LANG_LABEL[lang]}
    </span>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      dir={lang === 'ar' ? 'rtl' : undefined}
      rows={rows}
      className="w-full pt-8 px-3 pb-2 text-sm bg-transparent resize-none outline-none focus:outline-none border-none"
    />
  </div>
);

// ── Однострочное поле с бейджем языка ───────────────────────────────────────
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

// ── Сетка 2×2 для textarea ───────────────────────────────────────────────────
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
        <LangTextarea
          key={lang} lang={lang}
          value={g(`${fieldBase}_${lang}`) || ''}
          onChange={v => set(`${fieldBase}_${lang}`, v)}
          rows={rows}
        />
      ))}
    </div>
  </div>
);

// ── Сетка 2×2 для input ──────────────────────────────────────────────────────
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
        <LangInput
          key={lang} lang={lang}
          value={g(`${fieldBase}_${lang}`) || ''}
          onChange={v => set(`${fieldBase}_${lang}`, v)}
        />
      ))}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────

const ExpeditionFormModal = ({ expedition, onClose, onSaved }: ExpeditionFormModalProps) => {
  const isEdit = !!expedition;
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
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
    // Названия
    title_en: expedition?.title_en || '',
    title_ru: expedition?.title_ru || '',
    title_es: expedition?.title_es || '',
    title_ar: expedition?.title_ar || '',
    // Описания
    description_en: expedition?.description_en || '',
    description_ru: expedition?.description_ru || '',
    description_es: expedition?.description_es || '',
    description_ar: expedition?.description_ar || '',
    // Локации
    location_en: expedition?.location_en || '',
    location_ru: expedition?.location_ru || '',
    location_es: expedition?.location_es || '',
    location_ar: expedition?.location_ar || '',
    // Highlights
    highlights_en: (expedition?.highlights_en || []).join('\n'),
    highlights_ru: (expedition?.highlights_ru || []).join('\n'),
    highlights_es: (expedition?.highlights_es || []).join('\n'),
    highlights_ar: (expedition?.highlights_ar || []).join('\n'),
    // Включено
    included_en: (expedition?.included_en || []).join('\n'),
    included_ru: (expedition?.included_ru || []).join('\n'),
    included_es: (expedition?.included_es || []).join('\n'),
    included_ar: (expedition?.included_ar || []).join('\n'),
    // Не включено
    not_included_en: (expedition?.not_included_en || []).join('\n'),
    not_included_ru: (expedition?.not_included_ru || []).join('\n'),
    not_included_es: (expedition?.not_included_es || []).join('\n'),
    not_included_ar: (expedition?.not_included_ar || []).join('\n'),
    // Маршрут по дням
    itinerary_en: parseItinerary(expedition?.itinerary_en),
    itinerary_ru: parseItinerary(expedition?.itinerary_ru),
    itinerary_es: parseItinerary(expedition?.itinerary_es),
    itinerary_ar: parseItinerary(expedition?.itinerary_ar),
    // Числовые поля
    price: expedition?.price || 0,
    currency: expedition?.currency || 'USD',
    duration: expedition?.duration || '',
    duration_days: expedition?.duration_days || '',
    max_people: expedition?.max_people || 8,
    difficulty: expedition?.difficulty || 'moderate',
    cover_image: expedition?.cover_image || '',
    gallery_images: expedition?.gallery_images || [],
    slug: expedition?.slug || '',
    is_active: expedition?.is_active ?? true,
    is_featured: expedition?.is_featured ?? false,
    sort_order: expedition?.sort_order || 0,
  });

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const g = (field: string) => (form as any)[field];
  const splitLines = (s: string) => s.split('\n').map((x: string) => x.trim()).filter(Boolean);

  // ── Маршрут по дням ──────────────────────────────────────────────────────
  const getIt = (lang: string) => g(`itinerary_${lang}`);

  const addDay = () => LANGS.forEach(lang => {
    const days = getIt(lang);
    set(`itinerary_${lang}`, [...days, { day: days.length + 1, title: '', description: '' }]);
  });

  const removeDay = (idx: number) => LANGS.forEach(lang => {
    set(`itinerary_${lang}`,
      getIt(lang)
        .filter((_: any, i: number) => i !== idx)
        .map((d: any, i: number) => ({ ...d, day: i + 1 }))
    );
  });

  const updateDay = (lang: string, idx: number, field: string, value: string) => {
    set(`itinerary_${lang}`, getIt(lang).map((d: any, i: number) =>
      i === idx ? { ...d, [field]: value } : d
    ));
  };

  // ── Загрузка фото ────────────────────────────────────────────────────────
  const uploadImage = async (file: File, isGallery = false) => {
    const setter = isGallery ? setUploadingGallery : setUploading;
    setter(true);
    const path = `expeditions/${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('tour-images').upload(path, file);
    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
      setter(false);
      return null;
    }
    const { data } = supabase.storage.from('tour-images').getPublicUrl(path);
    setter(false);
    return data.publicUrl;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const url = await uploadImage(file); if (url) set('cover_image', url);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.gallery_images.length + files.length > 10) {
      toast({ title: 'Maximum 10 gallery images', variant: 'destructive' });
      return;
    }
    for (const file of files) {
      const url = await uploadImage(file, true);
      if (url) setForm(f => ({ ...f, gallery_images: [...f.gallery_images, url] }));
    }
  };

  const removeGalleryImage = (idx: number) =>
    setForm(f => ({ ...f, gallery_images: f.gallery_images.filter((_: string, i: number) => i !== idx) }));

  // ── Сохранение ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title_en.trim()) {
      toast({ title: 'Заполните название на английском', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const slug = form.slug ||
      form.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      title_en: form.title_en, title_ru: form.title_ru, title_es: form.title_es, title_ar: form.title_ar,
      description_en: form.description_en, description_ru: form.description_ru,
      description_es: form.description_es, description_ar: form.description_ar,
      location_en: form.location_en, location_ru: form.location_ru,
      location_es: form.location_es, location_ar: form.location_ar,
      highlights_en: splitLines(form.highlights_en), highlights_ru: splitLines(form.highlights_ru),
      highlights_es: splitLines(form.highlights_es), highlights_ar: splitLines(form.highlights_ar),
      included_en: splitLines(form.included_en), included_ru: splitLines(form.included_ru),
      included_es: splitLines(form.included_es), included_ar: splitLines(form.included_ar),
      not_included_en: splitLines(form.not_included_en), not_included_ru: splitLines(form.not_included_ru),
      not_included_es: splitLines(form.not_included_es), not_included_ar: splitLines(form.not_included_ar),
      itinerary_en: form.itinerary_en, itinerary_ru: form.itinerary_ru,
      itinerary_es: form.itinerary_es, itinerary_ar: form.itinerary_ar,
      price: Number(form.price),
      currency: form.currency,
      duration: form.duration,
      duration_days: form.duration_days ? Number(form.duration_days) : null,
      max_people: Number(form.max_people),
      difficulty: form.difficulty,
      cover_image: form.cover_image || null,
      gallery_images: form.gallery_images,
      slug: isEdit ? (expedition.slug || slug) : slug,
      is_active: form.is_active,
      is_featured: form.is_featured,
      sort_order: Number(form.sort_order),
    };

    const { error } = isEdit
      ? await supabase.from('expeditions').update(payload).eq('id', expedition.id)
      : await supabase.from('expeditions').insert(payload);

    if (error) toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    else { toast({ title: isEdit ? 'Экспедиция обновлена!' : 'Экспедиция создана!' }); onSaved(); }
    setSaving(false);
  };

  // ── Секция маршрута по дням ──────────────────────────────────────────────
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
                {/* Заголовок дня */}
                <div
                  className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 cursor-pointer select-none"
                  onClick={() => toggleDay(key)}
                >
                  <div className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {dayNum}
                  </div>
                  <span className="flex-1 text-sm font-semibold text-gray-700 truncate">
                    {getIt('en')[idx]?.title || `День ${dayNum}`}
                  </span>
                  <div className="flex items-center gap-2">
                    {enDays.length > 1 && (
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); removeDay(idx); }}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isCollapsed
                      ? <ChevronDown className="w-4 h-4 text-gray-400" />
                      : <ChevronUp className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </div>

                {/* Содержимое дня */}
                {!isCollapsed && (
                  <div className="p-4 space-y-4 bg-white">
                    {/* Дата */}
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">
                        Дата (необязательно, напр. August 30)
                      </label>
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

  // ── РЕНДЕР ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50"
      style={{ overflowY: 'scroll' }}
    >
      <div className="bg-white w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Шапка */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Редактировать экспедицию' : 'Добавить новую экспедицию'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1">
              {LANGS.map(lang => (
                <span key={lang} className={`text-[11px] font-bold px-2 py-0.5 rounded border ${LANG_BADGE[lang]}`}>
                  {LANG_LABEL[lang]}
                </span>
              ))}
            </div>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
          </div>
        </div>

        {/* Тело */}
        <div className="px-6 py-6 space-y-7 flex-1 overflow-y-auto">

          {/* ── ТЕКСТОВЫЙ КОНТЕНТ ── */}
          <section className="space-y-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">📝 Текстовый контент</p>

            {/* Название — 2×2 */}
            <div>
              <Label className="mb-2 block text-sm font-semibold">
                Название экспедиции <span className="text-gray-400 font-normal text-xs ml-1">(EN обязательно)</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {LANGS.map(lang => (
                  <div key={lang} className={`relative border-2 rounded-xl ${LANG_BORDER[lang]} bg-white overflow-hidden`}>
                    <span className={`absolute top-1/2 -translate-y-1/2 left-2.5 text-[11px] font-bold px-1.5 py-0.5 rounded border ${LANG_BADGE[lang]} z-10 pointer-events-none select-none`}>
                      {LANG_LABEL[lang]}
                    </span>
                    <input
                      value={g(`title_${lang}`) || ''}
                      onChange={e => set(`title_${lang}`, e.target.value)}
                      dir={lang === 'ar' ? 'rtl' : undefined}
                      className="w-full pl-16 pr-3 py-3 text-sm bg-transparent outline-none focus:outline-none border-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Локация — 2×2 */}
            <QuadInput label="Локация" fieldBase="location" hint="напр. Tian Shan, Kyrgyzstan" g={g} set={set} />

            {/* Описание — 2×2 */}
            <QuadTextarea label="Описание" fieldBase="description" rows={5} g={g} set={set} />

            {/* Highlights */}
            <QuadTextarea label="Highlights" fieldBase="highlights" rows={4} hint="каждый пункт с новой строки" g={g} set={set} />

            {/* Включено / Не включено */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <QuadTextarea label="Включено" fieldBase="included" rows={4} hint="с новой строки" g={g} set={set} />
              <QuadTextarea label="Не включено" fieldBase="not_included" rows={4} hint="с новой строки" g={g} set={set} />
            </div>

            {/* Маршрут по дням */}
            <ItinerarySection />
          </section>

          {/* ── ОСНОВНЫЕ НАСТРОЙКИ ── */}
          <section className="border border-gray-200 rounded-xl p-5 space-y-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">⚙️ Основные настройки</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs mb-1 block">Цена</Label>
                <Input type="number" min={0} value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Валюта</Label>
                <Select value={form.currency} onValueChange={v => set('currency', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Продолжительность</Label>
                <Input value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="14 Days" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Кол-во дней</Label>
                <Input type="number" min={1} value={form.duration_days} onChange={e => set('duration_days', e.target.value)} placeholder="14" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Макс. людей</Label>
                <Input type="number" min={1} value={form.max_people} onChange={e => set('max_people', e.target.value)} />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Сложность</Label>
                <Select value={form.difficulty} onValueChange={v => set('difficulty', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Порядок сортировки</Label>
                <Input type="number" min={0} value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Slug (URL)</Label>
                <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto" />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 pt-1">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => set('is_active', v)} />
                <Label>Активная</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={v => set('is_featured', v)} />
                <Label>Featured</Label>
              </div>
            </div>
          </section>

          {/* ── ОБЛОЖКА ── */}
          <section className="border border-gray-200 rounded-xl p-4">
            <Label className="font-semibold block mb-3">Обложка экспедиции</Label>
            <div className="flex items-center gap-4">
              {form.cover_image && (
                <div className="relative">
                  <img src={form.cover_image} alt="" className="w-24 h-24 rounded-lg object-cover" />
                  <button
                    onClick={() => set('cover_image', '')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-green-500 hover:text-green-600 transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? 'Загрузка...' : 'Загрузить обложку'}
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
                  <button
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
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

          <div className="h-4" />
        </div>

        {/* Кнопки — sticky снизу */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white z-20">
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#16a34a] hover:bg-[#15803d]">
            {saving ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать экспедицию'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpeditionFormModal;