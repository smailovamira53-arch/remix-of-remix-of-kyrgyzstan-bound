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
import { X, Upload, Trash2, Plus } from 'lucide-react';

interface TourFormModalProps {
  tour: any | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = ['day', 'package', 'multi-day'];
const DIFFICULTIES = ['easy', 'moderate', 'hard'];
const CURRENCIES = ['USD', 'EUR', 'KGS'];
const LANGS = [
  { key: 'en', label: 'English', titleField: 'title_en', descField: 'description_en' },
  { key: 'ru', label: 'Russian', titleField: 'title_ru', descField: 'description_ru' },
  { key: 'es', label: 'Spanish', titleField: 'title_es', descField: 'description_es' },
  { key: 'ar', label: 'Arabic', titleField: 'title_ar', descField: 'description_ar' },
] as const;

const TourFormModal = ({ tour, onClose, onSaved }: TourFormModalProps) => {
  const isEdit = !!tour;
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Парсим itinerary
  const parseItinerary = (raw: any) => {
    if (!raw) return [{ day: 1, title: '', description: '' }];
    if (Array.isArray(raw)) return raw;
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
    itinerary: parseItinerary(tour?.itinerary),
    included: (tour?.included || []).join('\n'),
    not_included: (tour?.not_included || []).join('\n'),
    highlights: (tour?.highlights || []).join('\n'),
  });

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  // Itinerary helpers
  const addDay = () => {
    const newDay = { day: form.itinerary.length + 1, title: '', description: '' };
    set('itinerary', [...form.itinerary, newDay]);
  };

  const removeDay = (idx: number) => {
    const updated = form.itinerary
      .filter((_: any, i: number) => i !== idx)
      .map((d: any, i: number) => ({ ...d, day: i + 1 }));
    set('itinerary', updated);
  };

  const updateDay = (idx: number, field: string, value: string) => {
    const updated = form.itinerary.map((d: any, i: number) =>
      i === idx ? { ...d, [field]: value } : d
    );
    set('itinerary', updated);
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

  const handleSave = async () => {
    if (!form.title_en.trim()) {
      toast({ title: 'English title is required', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const slug = form.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const payload: Record<string, unknown> = {
      title: form.title_en,
      title_ru: form.title_ru || '',
      title_es: form.title_es || '',
      title_ar: form.title_ar || '',
      description: form.description_en || '',
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
      itinerary: form.itinerary,
      included: form.included.split('\n').map((s: string) => s.trim()).filter(Boolean),
      not_included: form.not_included.split('\n').map((s: string) => s.trim()).filter(Boolean),
      highlights: form.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean),
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Tour' : 'Add New Tour'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Переводы */}
          <Tabs defaultValue="en">
            <TabsList className="mb-3">
              {LANGS.map(l => (
                <TabsTrigger key={l.key} value={l.key}>{l.label}</TabsTrigger>
              ))}
            </TabsList>
            {LANGS.map(l => (
              <TabsContent key={l.key} value={l.key} className="space-y-3">
                <div>
                  <Label>Title ({l.label}) {l.key === 'en' && <span className="text-red-500">*</span>}</Label>
                  <Input
                    value={(form as any)[l.titleField]}
                    onChange={e => set(l.titleField, e.target.value)}
                    placeholder={`Tour title in ${l.label}`}
                    dir={l.key === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <Label>Description ({l.label})</Label>
                  <Textarea
                    value={(form as any)[l.descField]}
                    onChange={e => set(l.descField, e.target.value)}
                    placeholder={`Description in ${l.label}`}
                    rows={4}
                    dir={l.key === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Основные поля */}
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
            <div>
              <Label>Tags (через запятую)</Label>
              <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="trekking, horse-riding" />
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

          {/* Toggles */}
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

          {/* Обложка */}
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

          {/* Галерея */}
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

          {/* Маршрут по дням */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Itinerary (Day by Day)</Label>
              <Button type="button" size="sm" variant="outline" onClick={addDay} className="gap-1">
                <Plus className="w-4 h-4" /> Add Day
              </Button>
            </div>
            <div className="space-y-3">
              {form.itinerary.map((day: any, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-700">Day {day.day}</span>
                    {form.itinerary.length > 1 && (
                      <button onClick={() => removeDay(idx)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder="Day title (e.g. Arrival in Bishkek)"
                    value={day.title}
                    onChange={e => updateDay(idx, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Day description..."
                    value={day.description}
                    onChange={e => updateDay(idx, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Включено / Не включено */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>What's Included (каждый пункт с новой строки)</Label>
              <Textarea
                value={form.included}
                onChange={e => set('included', e.target.value)}
                placeholder={"Accommodation\nMeals\nGuide"}
                rows={5}
              />
            </div>
            <div>
              <Label>Not Included (каждый пункт с новой строки)</Label>
              <Textarea
                value={form.not_included}
                onChange={e => set('not_included', e.target.value)}
                placeholder={"Flights\nPersonal expenses\nTips"}
                rows={5}
              />
            </div>
          </div>

          {/* Highlights */}
          <div>
            <Label>Highlights (каждый пункт с новой строки)</Label>
            <Textarea
              value={form.highlights}
              onChange={e => set('highlights', e.target.value)}
              placeholder={"Ride through mountain meadows\nStay in traditional yurts\nSunrise over Son Kul Lake"}
              rows={4}
            />
          </div>

        </div>

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