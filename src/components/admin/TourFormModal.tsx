import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  'trekking': 'Trekking',
  'horse-riding': 'Horse Riding',
  'ski-touring': 'Ski Touring',
  'yurt-camping': 'Yurt Camping',
  'photography-tours': 'Photography Tours',
  'mountain-biking': 'Mountain Biking',
};
const DESTINATION_GROUPS = {
  Kyrgyzstan: [
    'Issyk-Kul Lake', 'Ala-Archa Gorge', 'Song-Kul Lake', 'Jeti-Oguz Canyon',
    'Karakol', 'Skazka Canyon', 'Altyn Arashan', 'Tash Rabat', 'Burana Tower',
    'Arslanbob', 'Osh', 'Sary-Chelek Lake', 'Kel-Suu Lake', 'Lenin Peak Base Camp',
    'Jyrgalan Valley',
  ],
  Kazakhstan: ['Big Almaty Lake', 'Charyn Canyon', 'Kolsai Lakes', 'Kaindy Lake', 'Almaty', 'Turkestan'],
  Uzbekistan: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'],
};

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const CURRENCIES = ['USD', 'EUR', 'KGS'];

const TourFormModal = ({ tour, onClose, onSaved }: TourFormModalProps) => {
  const isEdit = !!tour;
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const parseItinerary = (raw: any) => {
    if (!raw) return [{ day: 1, title: '', description: '' }];
    if (Array.isArray(raw)) return raw.length > 0 ? raw : [{ day: 1, title: '', description: '' }];
    try { return JSON.parse(raw); } catch { return [{ day: 1, title: '', description: '' }]; }
  };

  const [form, setForm] = useState({
    title_en: tour?.title || tour?.title_en || '',
    title_ru: tour?.title_ru || '',
    title_es: tour?.title_es || '',
    title_ar: tour?.title_ar || '',
    description_en: tour?.description || tour?.description_en || '',
    description_ru: tour?.description_ru || '',
    description_es: tour?.description_es || '',
    description_ar: tour?.description_ar || '',
    price: tour?.price || 0,
    currency: tour?.currency || 'USD',
    duration: tour?.duration || '',
    max_people: tour?.max_people || 20,
    difficulty: tour?.difficulty || 'easy',
    category: tour?.category || 'package',
    is_active: tour?.is_active ?? true,
    is_featured: tour?.is_featured ?? false,
    cover_image: tour?.image_url || '',
    gallery_images: tour?.gallery_images || [],
    start_date: tour?.start_date || '',
    end_date: tour?.end_date || '',
    status: tour?.status || 'Open',
    tags: tour?.tags || '',
    destinations: tour?.destinations || [],
    // EN
    itinerary: parseItinerary(tour?.itinerary),
    highlights: (tour?.highlights || []).join('\n'),
    included: (tour?.included || []).join('\n'),
    not_included: (tour?.not_included || []).join('\n'),
    // RU
    itinerary_ru: parseItinerary(tour?.itinerary_ru),
    highlights_ru: (tour?.highlights_ru || []).join('\n'),
    included_ru: (tour?.included_ru || []).join('\n'),
    not_included_ru: (tour?.not_included_ru || []).join('\n'),
    // ES
    itinerary_es: parseItinerary(tour?.itinerary_es),
    highlights_es: (tour?.highlights_es || []).join('\n'),
    included_es: (tour?.included_es || []).join('\n'),
    not_included_es: (tour?.not_included_es || []).join('\n'),
    // AR
    itinerary_ar: parseItinerary(tour?.itinerary_ar),
    highlights_ar: (tour?.highlights_ar || []).join('\n'),
    included_ar: (tour?.included_ar || []).join('\n'),
    not_included_ar: (tour?.not_included_ar || []).join('\n'),
  });

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  // EN itinerary helpers
  const addDay = () => {
    set('itinerary', [...form.itinerary, { day: form.itinerary.length + 1, title: '', description: '' }]);
  };
  const removeDay = (idx: number) => {
    set('itinerary', form.itinerary.filter((_: any, i: number) => i !== idx).map((d: any, i: number) => ({ ...d, day: i + 1 })));
  };
  const updateDay = (idx: number, field: string, value: string) => {
    set('itinerary', form.itinerary.map((d: any, i: number) => i === idx ? { ...d, [field]: value } : d));
  };

  // Other lang itinerary helper
  const updateDayLang = (lang: string, idx: number, field: string, value: string) => {
    set(lang, (form as any)[lang].map((d: any, i: number) => i === idx ? { ...d, [field]: value } : d));
  };

  // Destinations helpers
  const [expandedDestCountries, setExpandedDestCountries] = useState<string[]>([]);
  const toggleDestCountry = (country: string) => {
    setExpandedDestCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };
  const toggleDest = (dest: string) => {
    const current: string[] = form.destinations;
    const updated = current.includes(dest) ? current.filter(d => d !== dest) : [...current, dest];
    set('destinations', updated);
  };
  const toggleAllDestCountry = (country: string) => {
    const subs = DESTINATION_GROUPS[country as keyof typeof DESTINATION_GROUPS];
    const allSelected = subs.every(s => form.destinations.includes(s));
    if (allSelected) {
      set('destinations', form.destinations.filter((d: string) => !subs.includes(d)));
    } else {
      set('destinations', [...new Set([...form.destinations, ...subs])]);
    }
  };

  const uploadImage = async (file: File, isGallery = false) => {
    const setter = isGallery ? setUploadingGallery : setUploading;
    setter(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
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
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) set('cover_image', url);
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

  const removeGalleryImage = (idx: number) => {
    setForm(f => ({ ...f, gallery_images: f.gallery_images.filter((_: string, i: number) => i !== idx) }));
  };

  const splitLines = (s: string) => s.split('\n').map((x: string) => x.trim()).filter(Boolean);

  const handleSave = async () => {
    if (!form.title_en.trim()) {
      toast({ title: 'English title is required', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const slug = form.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload: Record<string, unknown> = {
      title: form.title_en,
      title_en: form.title_en,
      title_ru: form.title_ru || '',
      title_es: form.title_es || '',
      title_ar: form.title_ar || '',
      description: form.description_en || '',
      description_en: form.description_en || '',
      description_ru: form.description_ru || '',
      description_es: form.description_es || '',
      description_ar: form.description_ar || '',
      price: Number(form.price),
      currency: form.currency,
      duration: form.duration || '',
      max_people: Number(form.max_people),
      difficulty: form.difficulty,
      category: form.category,
      is_active: form.is_active,
      is_featured: form.is_featured,
      image_url: form.cover_image || null,
      gallery_images: form.gallery_images,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
      slug: isEdit ? (tour.slug || slug) : slug,
      tags: form.tags || '',
      destinations: form.destinations || [],
      // EN
      itinerary: form.itinerary,
      highlights: splitLines(form.highlights),
      included: splitLines(form.included),
      not_included: splitLines(form.not_included),
      // RU
      itinerary_ru: form.itinerary_ru,
      highlights_ru: splitLines(form.highlights_ru),
      included_ru: splitLines(form.included_ru),
      not_included_ru: splitLines(form.not_included_ru),
      // ES
      itinerary_es: form.itinerary_es,
      highlights_es: splitLines(form.highlights_es),
      included_es: splitLines(form.included_es),
      not_included_es: splitLines(form.not_included_es),
      // AR
      itinerary_ar: form.itinerary_ar,
      highlights_ar: splitLines(form.highlights_ar),
      included_ar: splitLines(form.included_ar),
      not_included_ar: splitLines(form.not_included_ar),
    };

    const { error } = isEdit
      ? await supabase.from('tours').update(payload as any).eq('id', tour.id)
      : await supabase.from('tours').insert(payload as any);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: isEdit ? 'Tour updated!' : 'Tour created!' });
      onSaved();
    }
    setSaving(false);
  };

  // ── Reusable itinerary block ──────────────────────────────────────────────
  const ItineraryBlock = ({
    lang,
    days,
    onAdd,
    onRemove,
    onUpdate,
    dayLabel,
    titlePlaceholder,
    descPlaceholder,
    heading,
    dir,
  }: {
    lang: string;
    days: any[];
    onAdd?: () => void;
    onRemove?: (i: number) => void;
    onUpdate: (i: number, field: string, val: string) => void;
    dayLabel: string;
    titlePlaceholder: string;
    descPlaceholder: string;
    heading: string;
    dir?: string;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base font-semibold">{heading}</Label>
        {onAdd && (
          <Button type="button" size="sm" variant="outline" onClick={onAdd} className="gap-1">
            <Plus className="w-4 h-4" /> Add Day
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {days.map((day: any, idx: number) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-gray-700">{dayLabel} {day.day}</span>
              {onRemove && days.length > 1 && (
                <button onClick={() => onRemove(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <Input
              placeholder={titlePlaceholder}
              value={day.title}
              onChange={e => onUpdate(idx, 'title', e.target.value)}
              dir={dir}
            />
            <Textarea
              placeholder={descPlaceholder}
              value={day.description}
              onChange={e => onUpdate(idx, 'description', e.target.value)}
              rows={2}
              dir={dir}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Tour' : 'Add New Tour'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* ── Языковые вкладки ── */}
          <Tabs defaultValue="en">
            <TabsList className="mb-3">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ru">Russian</TabsTrigger>
              <TabsTrigger value="es">Spanish</TabsTrigger>
              <TabsTrigger value="ar">Arabic</TabsTrigger>
            </TabsList>

            {/* ENGLISH */}
            <TabsContent value="en" className="space-y-4">
              <div>
                <Label>Title (English) <span className="text-red-500">*</span></Label>
                <Input value={form.title_en} onChange={e => set('title_en', e.target.value)} placeholder="Tour title in English" />
              </div>
              <div>
                <Label>Description (English)</Label>
                <Textarea value={form.description_en} onChange={e => set('description_en', e.target.value)} placeholder="Description in English" rows={4} />
              </div>
              <div>
                <Label>Highlights (each item on new line)</Label>
                <Textarea value={form.highlights} onChange={e => set('highlights', e.target.value)} placeholder={"Ride through meadows\nStay in yurts\nSunrise over lake"} rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>What's Included (each item on new line)</Label>
                  <Textarea value={form.included} onChange={e => set('included', e.target.value)} placeholder={"Accommodation\nMeals\nGuide"} rows={5} />
                </div>
                <div>
                  <Label>Not Included (each item on new line)</Label>
                  <Textarea value={form.not_included} onChange={e => set('not_included', e.target.value)} placeholder={"Flights\nPersonal expenses\nTips"} rows={5} />
                </div>
              </div>
              <ItineraryBlock
                lang="itinerary"
                days={form.itinerary}
                onAdd={addDay}
                onRemove={removeDay}
                onUpdate={updateDay}
                dayLabel="Day"
                heading="Itinerary (Day by Day)"
                titlePlaceholder="Day title (e.g. Arrival in Bishkek)"
                descPlaceholder="Day description..."
              />
            </TabsContent>

            {/* RUSSIAN */}
            <TabsContent value="ru" className="space-y-4">
              <div>
                <Label>Название тура (Russian)</Label>
                <Input value={form.title_ru} onChange={e => set('title_ru', e.target.value)} placeholder="Название тура на русском" />
              </div>
              <div>
                <Label>Описание (Russian)</Label>
                <Textarea value={form.description_ru} onChange={e => set('description_ru', e.target.value)} placeholder="Описание на русском" rows={4} />
              </div>
              <div>
                <Label>Highlights — каждый пункт с новой строки</Label>
                <Textarea value={form.highlights_ru} onChange={e => set('highlights_ru', e.target.value)} placeholder={"Верховая езда\nНочёвка в юрте\nРассвет над озером"} rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Включено — каждый пункт с новой строки</Label>
                  <Textarea value={form.included_ru} onChange={e => set('included_ru', e.target.value)} placeholder={"Проживание\nПитание\nГид"} rows={5} />
                </div>
                <div>
                  <Label>Не включено — каждый пункт с новой строки</Label>
                  <Textarea value={form.not_included_ru} onChange={e => set('not_included_ru', e.target.value)} placeholder={"Авиабилеты\nЛичные расходы\nЧаевые"} rows={5} />
                </div>
              </div>
              <ItineraryBlock
                lang="itinerary_ru"
                days={form.itinerary_ru}
                onUpdate={(i, f, v) => updateDayLang('itinerary_ru', i, f, v)}
                dayLabel="День"
                heading="Маршрут по дням"
                titlePlaceholder="Название дня (напр. Приезд в Бишкек)"
                descPlaceholder="Описание дня..."
              />
            </TabsContent>

            {/* SPANISH */}
            <TabsContent value="es" className="space-y-4">
              <div>
                <Label>Título (Spanish)</Label>
                <Input value={form.title_es} onChange={e => set('title_es', e.target.value)} placeholder="Título del tour en español" />
              </div>
              <div>
                <Label>Descripción (Spanish)</Label>
                <Textarea value={form.description_es} onChange={e => set('description_es', e.target.value)} placeholder="Descripción en español" rows={4} />
              </div>
              <div>
                <Label>Highlights — cada punto en nueva línea</Label>
                <Textarea value={form.highlights_es} onChange={e => set('highlights_es', e.target.value)} placeholder={"Paseo a caballo\nNoche en yurta\nAmanecer sobre el lago"} rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Incluido — cada punto en nueva línea</Label>
                  <Textarea value={form.included_es} onChange={e => set('included_es', e.target.value)} placeholder={"Alojamiento\nComidas\nGuía"} rows={5} />
                </div>
                <div>
                  <Label>No incluido — cada punto en nueva línea</Label>
                  <Textarea value={form.not_included_es} onChange={e => set('not_included_es', e.target.value)} placeholder={"Vuelos\nGastos personales\nPropinas"} rows={5} />
                </div>
              </div>
              <ItineraryBlock
                lang="itinerary_es"
                days={form.itinerary_es}
                onUpdate={(i, f, v) => updateDayLang('itinerary_es', i, f, v)}
                dayLabel="Día"
                heading="Itinerario día a día"
                titlePlaceholder="Título del día (ej. Llegada a Bishkek)"
                descPlaceholder="Descripción del día..."
              />
            </TabsContent>

            {/* ARABIC */}
            <TabsContent value="ar" className="space-y-4" dir="rtl">
              <div>
                <Label>العنوان (Arabic)</Label>
                <Input value={form.title_ar} onChange={e => set('title_ar', e.target.value)} placeholder="عنوان الجولة بالعربية" dir="rtl" />
              </div>
              <div>
                <Label>الوصف (Arabic)</Label>
                <Textarea value={form.description_ar} onChange={e => set('description_ar', e.target.value)} placeholder="الوصف بالعربية" rows={4} dir="rtl" />
              </div>
              <div>
                <Label>Highlights — كل نقطة في سطر جديد</Label>
                <Textarea value={form.highlights_ar} onChange={e => set('highlights_ar', e.target.value)} placeholder={"ركوب الخيل\nالإقامة في الخيمة\nشروق الشمس على البحيرة"} rows={4} dir="rtl" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>ما يشمله البرنامج — كل نقطة في سطر</Label>
                  <Textarea value={form.included_ar} onChange={e => set('included_ar', e.target.value)} placeholder={"الإقامة\nالوجبات\nمرشد"} rows={5} dir="rtl" />
                </div>
                <div>
                  <Label>ما لا يشمله البرنامج — كل نقطة في سطر</Label>
                  <Textarea value={form.not_included_ar} onChange={e => set('not_included_ar', e.target.value)} placeholder={"تذاكر الطيران\nالمصاريف الشخصية\nالإكراميات"} rows={5} dir="rtl" />
                </div>
              </div>
              <ItineraryBlock
                lang="itinerary_ar"
                days={form.itinerary_ar}
                onUpdate={(i, f, v) => updateDayLang('itinerary_ar', i, f, v)}
                dayLabel="اليوم"
                heading="البرنامج اليومي"
                titlePlaceholder="عنوان اليوم"
                descPlaceholder="وصف اليوم..."
                dir="rtl"
              />
            </TabsContent>
          </Tabs>

          {/* ── Основные поля ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Price</Label>
              <Input type="number" min={0} value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={v => set('currency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (e.g. "5 Days")</Label>
              <Input value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="5 Days" />
            </div>
            <div>
              <Label>Max People</Label>
              <Input type="number" min={1} value={form.max_people} onChange={e => set('max_people', e.target.value)} />
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={form.difficulty} onValueChange={v => set('difficulty', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Label className="mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => {
                  const selected = (form.tags || '').split(',').map((t: string) => t.trim()).includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const current = (form.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean);
                        const updated = selected ? current.filter(t => t !== tag) : [...current, tag];
                        set('tags', updated.join(', '));
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selected
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-[#1E3A5F] hover:text-[#1E3A5F]'
                      }`}
                    >
                      {TAG_LABELS[tag]}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Destinations */}
            <div className="sm:col-span-2 lg:col-span-3">
              <Label className="mb-2 block">Destinations (места тура)</Label>
              <div className="space-y-2">
                {(Object.keys(DESTINATION_GROUPS) as (keyof typeof DESTINATION_GROUPS)[]).map(country => {
                  const subs = DESTINATION_GROUPS[country];
                  const allSelected = subs.every(s => form.destinations.includes(s));
                  const someSelected = subs.some(s => form.destinations.includes(s));
                  const isExpanded = expandedDestCountries.includes(country);
                  return (
                    <div key={country} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-2 bg-gray-50">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                          onChange={() => toggleAllDestCountry(country)}
                          className="rounded accent-[#1E3A5F] w-4 h-4"
                        />
                        <span className="text-sm font-semibold text-gray-800 flex-1">{country}</span>
                        <button type="button" onClick={() => toggleDestCountry(country)} className="text-gray-400 hover:text-gray-600">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="px-4 py-2 grid grid-cols-2 md:grid-cols-3 gap-1">
                          {subs.map(sub => (
                            <label key={sub} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.destinations.includes(sub)}
                                onChange={() => toggleDest(sub)}
                                className="rounded accent-[#1E3A5F] w-3.5 h-3.5 flex-shrink-0"
                              />
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
                      {d}
                      <button type="button" onClick={() => toggleDest(d)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
            </div>
          </div>

          {/* ── Toggles ── */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={v => set('is_active', v)} />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_featured} onCheckedChange={v => set('is_featured', v)} />
              <Label>Featured</Label>
            </div>
          </div>

          {/* ── Обложка ── */}
          <div>
            <Label>Cover Image</Label>
            <div className="mt-1 flex items-center gap-4">
              {form.cover_image ? (
                <div className="relative">
                  <img src={form.cover_image} alt="" className="w-24 h-24 rounded-lg object-cover" />
                  <button onClick={() => set('cover_image', '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : null}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-green-500 hover:text-green-600 transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload cover'}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* ── Галерея ── */}
          <div>
            <Label>Gallery Images (max 10)</Label>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-3">
              {form.gallery_images.map((url: string, idx: number) => (
                <div key={idx} className="relative group">
                  <img src={url} alt="" className="w-full aspect-square rounded-lg object-cover" />
                  <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {form.gallery_images.length < 10 && (
                <label className="cursor-pointer flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-green-500 hover:text-green-600 transition-colors">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">{uploadingGallery ? 'Uploading...' : 'Add'}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                </label>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#16a34a] hover:bg-[#15803d]">
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Tour'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourFormModal;