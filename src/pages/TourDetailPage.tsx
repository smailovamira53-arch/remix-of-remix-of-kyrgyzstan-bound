import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Star, Users, Check, X, Calendar, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getTourBySlug } from '@/data/toursData';
import { TourGallery } from '@/components/TourGallery';
import { BookingFormModal } from '@/components/BookingFormModal';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

// ── Переводы подписей по языку ────────────────────────────────────────────
const UI: Record<string, Record<string, string>> = {
  en: {
    back: 'Back',
    highlights: 'Tour Highlights',
    itinerary: 'Day by Day',
    day: 'Day',
    included: "What's Included",
    notIncluded: 'Not Included',
    packingTips: 'Packing Tips',
    whoIsItFor: 'Who Is It For?',
    whyItMatters: 'Why It Matters',
    optionalExp: 'Optional Experiences',
    gallery: 'Photo Gallery',
    from: 'From',
    perPerson: '/ person',
    maxPeople: 'Max {count} people',
    difficulty: 'Difficulty',
    bookNow: 'Book Now',
    freeCancel: 'Free cancellation up to 48 hours before',
    featured: 'Featured',
    newTour: 'New tour',
    notFound: 'Tour not found',
    notFoundDesc: 'The tour you are looking for does not exist.',
    backToTours: 'Back to Tours',
    loading: 'Loading...',
  },
  ru: {
    back: 'Назад',
    highlights: 'Особенности тура',
    itinerary: 'День за днём',
    day: 'День',
    included: 'Включено',
    notIncluded: 'Не включено',
    packingTips: 'Что взять с собой',
    whoIsItFor: 'Для кого этот тур?',
    whyItMatters: 'Почему это важно',
    optionalExp: 'Дополнительные впечатления',
    gallery: 'Галерея',
    from: 'От',
    perPerson: '/ чел.',
    maxPeople: 'Макс. {count} чел.',
    difficulty: 'Сложность',
    bookNow: 'Забронировать',
    freeCancel: 'Бесплатная отмена за 48 часов до начала',
    featured: 'Рекомендуем',
    newTour: 'Новый тур',
    notFound: 'Тур не найден',
    notFoundDesc: 'Тур, который вы ищете, не существует.',
    backToTours: 'К турам',
    loading: 'Загрузка...',
  },
  es: {
    back: 'Volver',
    highlights: 'Aspectos destacados',
    itinerary: 'Día a día',
    day: 'Día',
    included: 'Incluido',
    notIncluded: 'No incluido',
    packingTips: 'Qué empacar',
    whoIsItFor: '¿Para quién es?',
    whyItMatters: 'Por qué importa',
    optionalExp: 'Experiencias opcionales',
    gallery: 'Galería de fotos',
    from: 'Desde',
    perPerson: '/ persona',
    maxPeople: 'Máx. {count} personas',
    difficulty: 'Dificultad',
    bookNow: 'Reservar',
    freeCancel: 'Cancelación gratuita hasta 48 horas antes',
    featured: 'Destacado',
    newTour: 'Tour nuevo',
    notFound: 'Tour no encontrado',
    notFoundDesc: 'El tour que busca no existe.',
    backToTours: 'Ver todos los tours',
    loading: 'Cargando...',
  },
  ar: {
    back: 'رجوع',
    highlights: 'أبرز المميزات',
    itinerary: 'البرنامج اليومي',
    day: 'اليوم',
    included: 'ما يشمله البرنامج',
    notIncluded: 'ما لا يشمله',
    packingTips: 'ماذا تحزم',
    whoIsItFor: 'لمن هذا الجولة؟',
    whyItMatters: 'لماذا يهم',
    optionalExp: 'تجارب اختيارية',
    gallery: 'معرض الصور',
    from: 'من',
    perPerson: '/ شخص',
    maxPeople: 'أقصى {count} أشخاص',
    difficulty: 'مستوى الصعوبة',
    bookNow: 'احجز الآن',
    freeCancel: 'إلغاء مجاني حتى 48 ساعة قبل البداية',
    featured: 'مميز',
    newTour: 'جولة جديدة',
    notFound: 'الجولة غير موجودة',
    notFoundDesc: 'الجولة التي تبحث عنها غير موجودة.',
    backToTours: 'العودة إلى الجولات',
    loading: 'جارٍ التحميل...',
  },
};

const TourDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [dbTourFull, setDbTourFull] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(true);
  // Для сворачиваемых дней маршрута
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});
const toggleDay = (idx: number) => setOpenDays(prev => ({ ...prev, [idx]: !prev[idx] }));
const [lightbox, setLightbox] = useState<{ images: string[]; idx: number } | null>(null);
const openLightbox = (images: string[], idx: number) => setLightbox({ images, idx });
const closeLightbox = () => setLightbox(null);
const prevPhoto = () => setLightbox(prev => prev ? { ...prev, idx: (prev.idx - 1 + prev.images.length) % prev.images.length } : null);
const nextPhoto = () => setLightbox(prev => prev ? { ...prev, idx: (prev.idx + 1) % prev.images.length } : null);

  const staticTour = slug ? getTourBySlug(slug) : undefined;
  const ui = UI[language] || UI.en;
  const isRtl = language === 'ar';

  useEffect(() => {
    if (!slug) return;
    setLoadingDb(true);
    supabase.from('tours').select('*').eq('slug', slug).maybeSingle()
      .then(({ data }) => { setDbTourFull(data); setLoadingDb(false); });
  }, [slug]);

  if (loadingDb) return (
    <div className="min-h-screen"><Navbar />
      <div className="container-custom py-32 text-center"><p className="text-muted-foreground">{UI.en.loading}</p></div>
      <Footer />
    </div>
  );

  // ── DB тур ────────────────────────────────────────────────────────────────
  if (dbTourFull) {
    // Контент по языку
    const pick = (en: any, ru: any, es: any, ar: any) =>
      language === 'ru' ? ru || en
      : language === 'es' ? es || en
      : language === 'ar' ? ar || en
      : en;

    const title       = pick(dbTourFull.title_en || dbTourFull.title, dbTourFull.title_ru, dbTourFull.title_es, dbTourFull.title_ar);
    const description = pick(dbTourFull.description_en || dbTourFull.description, dbTourFull.description_ru, dbTourFull.description_es, dbTourFull.description_ar);
    const highlights  = pick(dbTourFull.highlights, dbTourFull.highlights_ru, dbTourFull.highlights_es, dbTourFull.highlights_ar) || [];
    const included    = pick(dbTourFull.included, dbTourFull.included_ru, dbTourFull.included_es, dbTourFull.included_ar) || [];
    const notIncluded = pick(dbTourFull.not_included, dbTourFull.not_included_ru, dbTourFull.not_included_es, dbTourFull.not_included_ar) || [];
    const itinerary   = pick(dbTourFull.itinerary, dbTourFull.itinerary_ru, dbTourFull.itinerary_es, dbTourFull.itinerary_ar) || [];
    const packingTips = pick(dbTourFull.packing_tips, dbTourFull.packing_tips_ru, dbTourFull.packing_tips_es, dbTourFull.packing_tips_ar) || [];
    const whoIsItFor  = pick(dbTourFull.who_is_it_for, dbTourFull.who_is_it_for_ru, dbTourFull.who_is_it_for_es, dbTourFull.who_is_it_for_ar) || [];
    const whyItMatters = pick(dbTourFull.why_it_matters, dbTourFull.why_it_matters_ru, dbTourFull.why_it_matters_es, dbTourFull.why_it_matters_ar) || '';
    const optionalExp = pick(dbTourFull.optional_experiences, dbTourFull.optional_experiences_ru, dbTourFull.optional_experiences_es, dbTourFull.optional_experiences_ar) || [];
    const gallery: string[] = dbTourFull.gallery_images || [];

    return (
      <div className="min-h-screen bg-background" dir={isRtl ? 'rtl' : undefined}>
        <Navbar />

        {/* Hero */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={dbTourFull.image_url || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop'} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-24 left-4 md:left-8">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="bg-background/80 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />{ui.back}
            </Button>
          </motion.div>
          {dbTourFull.is_featured && (
            <span className="absolute top-24 right-4 md:right-8 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full">{ui.featured}</span>
          )}
        </div>

        <div className="container-custom -mt-20 relative z-10 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Заголовок */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /><span>Kyrgyzstan</span></div>
                  {dbTourFull.duration && <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /><span>{dbTourFull.duration}</span></div>}
                  {dbTourFull.max_people && <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /><span>{ui.maxPeople.replace('{count}', dbTourFull.max_people)}</span></div>}
                  {dbTourFull.difficulty && <Badge variant="outline">{dbTourFull.difficulty}</Badge>}
                </div>
                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">{title}</h1>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 fill-current text-yellow-400" />
                  <span className="text-lg font-semibold">5.0</span>
                  <span className="text-muted-foreground">({ui.newTour})</span>
                </div>
                {description && <p className="text-muted-foreground leading-relaxed">{description}</p>}
              </motion.div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">{ui.highlights}</h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {highlights.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Маршрут по дням — сворачиваемые карточки */}
              {itinerary.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">{ui.itinerary}</h2>
                  <div className="space-y-3">
                    {itinerary.map((day: any, index: number) => {
                      const isOpen = openDays[index] === true;
                      return (
                        <div key={index} className={`border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-primary/40' : 'border-border'}`}>
                          {/* Заголовок дня — кликабельный */}
                          <button
                            type="button"
                            onClick={() => toggleDay(index)}
                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                          >
                            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                              {day.day || index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              {day.date && <p className="text-xs text-muted-foreground">{day.date}</p>}
                              <p className="font-semibold text-foreground truncate">
                                {ui.day} {day.day || index + 1} — {day.title}
                              </p>
                            </div>
                            {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                          </button>
                          {/* Описание */}
                          {isOpen && day.description && (
                            <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border">
                              {day.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Included / Not Included */}
              {(included.length > 0 || notIncluded.length > 0) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" /> {ui.included}
                    </h3>
                    <ul className="space-y-2">
                      {included.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-500" /> {ui.notIncluded}
                    </h3>
                    <ul className="space-y-2">
                      {notIncluded.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Packing Tips */}
              {packingTips.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">🎒 {ui.packingTips}</h2>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {packingTips.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Event поля */}
              {dbTourFull.is_event && (
                <>
                  {whoIsItFor.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                      <h2 className="font-display text-xl font-bold text-foreground mb-4">{ui.whoIsItFor}</h2>
                      <ul className="space-y-2">
                        {whoIsItFor.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                  {whyItMatters && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                      <h2 className="font-display text-xl font-bold text-foreground mb-4">{ui.whyItMatters}</h2>
                      <p className="text-muted-foreground leading-relaxed">{whyItMatters}</p>
                    </motion.div>
                  )}
                  {optionalExp.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                      <h2 className="font-display text-xl font-bold text-foreground mb-4">{ui.optionalExp}</h2>
                      <ul className="space-y-2">
                        {optionalExp.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </>
              )}

              {/* Gallery */}
              {gallery.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">{ui.gallery}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.map((url: string, i: number) => (
                      <button key={i} onClick={() => openLightbox(gallery, i)} className="overflow-hidden rounded-lg group focus:outline-none">
                        <img src={url} alt={`${title} ${i + 1}`} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">{ui.from}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">${dbTourFull.price}</span>
                    <span className="text-muted-foreground">{ui.perPerson}</span>
                  </div>
                  {dbTourFull.currency && dbTourFull.currency !== 'USD' && <span className="text-xs text-muted-foreground">{dbTourFull.currency}</span>}
                </div>
                <div className="space-y-4 mb-6">
                  {dbTourFull.duration && <div className="flex items-center gap-3 text-sm"><Calendar className="w-5 h-5 text-primary" /><span className="text-muted-foreground">{dbTourFull.duration}</span></div>}
                  {dbTourFull.max_people && <div className="flex items-center gap-3 text-sm"><Users className="w-5 h-5 text-primary" /><span className="text-muted-foreground">{ui.maxPeople.replace('{count}', dbTourFull.max_people)}</span></div>}
                  {dbTourFull.difficulty && <div className="flex items-center gap-3 text-sm"><Info className="w-5 h-5 text-primary" /><span className="text-muted-foreground">{ui.difficulty}: {dbTourFull.difficulty}</span></div>}
                </div>
                <Button size="lg" className="w-full mb-3" onClick={() => setBookingOpen(true)}>{ui.bookNow}</Button>
                <p className="text-xs text-center text-muted-foreground">{ui.freeCancel}</p>
              </motion.div>
            </div>
          </div>
        </div>

        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
            <button onClick={e => { e.stopPropagation(); prevPhoto(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button onClick={e => { e.stopPropagation(); nextPhoto(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10">
              <ArrowLeft className="w-6 h-6 rotate-180" />
            </button>
            <button onClick={closeLightbox} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <img src={lightbox.images[lightbox.idx]} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">{lightbox.idx + 1} / {lightbox.images.length}</p>
          </div>
        )}
        <BookingFormModal open={bookingOpen} onClose={() => setBookingOpen(false)} tourTitle={title} tourPrice={dbTourFull.price} tourId={dbTourFull.id} />
        <Footer />
      </div>
    );
  }

  // ── Static тур ────────────────────────────────────────────────────────────
  if (!staticTour) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="container-custom py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{ui.notFound}</h1>
          <p className="text-muted-foreground mb-8">{ui.notFoundDesc}</p>
          <Button onClick={() => navigate('/tours')}>{ui.backToTours}</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tour = staticTour;
  return (
    <div className="min-h-screen bg-background" dir={isRtl ? 'rtl' : undefined}>
      <Navbar />
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-24 left-4 md:left-8">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />{ui.back}
          </Button>
        </motion.div>
        {tour.featured && <span className="absolute top-24 right-4 md:right-8 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full">{ui.featured}</span>}
      </div>

      <div className="container-custom -mt-20 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /><span>{tour.location}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /><span>{tour.duration}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /><span>{ui.maxPeople.replace('{count}', String(tour.maxGroup))}</span></div>
              </div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">{tour.title}</h1>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-current text-yellow-400" />
                <span className="text-lg font-semibold">{tour.rating}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{tour.fullDescription}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">{ui.highlights}</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {tour.highlights.map((h, i) => <li key={i} className="flex items-start gap-3"><Check className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span className="text-muted-foreground">{h}</span></li>)}
              </ul>
            </motion.div>

            {/* Маршрут по дням — сворачиваемый */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">{ui.itinerary}</h2>
              <div className="space-y-3">
                {tour.itinerary.map((day, index) => {
                  const isOpen = openDays[index] === true;
                  return (
                    <div key={index} className={`border rounded-xl overflow-hidden ${isOpen ? 'border-primary/40' : 'border-border'}`}>
                      <button type="button" onClick={() => toggleDay(index)} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors text-left">
                        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">{day.day}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{ui.day} {day.day} — {day.title}</p>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                      </button>
                      {isOpen && <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border">{day.description}</div>}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <TourGallery tourTitle={tour.title} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
              <Card className="border-border"><CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Check className="w-5 h-5 text-green-600" />{ui.included}</h3>
                <ul className="space-y-2">{tour.included.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />{item}</li>)}</ul>
              </CardContent></Card>
              <Card className="border-border"><CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><X className="w-5 h-5 text-red-500" />{ui.notIncluded}</h3>
                <ul className="space-y-2">{tour.notIncluded.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />{item}</li>)}</ul>
              </CardContent></Card>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">{ui.from}</p>
                <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-foreground">${tour.price}</span><span className="text-muted-foreground">{ui.perPerson}</span></div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm"><Calendar className="w-5 h-5 text-primary" /><span className="text-muted-foreground">{tour.duration}</span></div>
                <div className="flex items-center gap-3 text-sm"><Users className="w-5 h-5 text-primary" /><span className="text-muted-foreground">{ui.maxPeople.replace('{count}', String(tour.maxGroup))}</span></div>
                <div className="flex items-center gap-3 text-sm"><Star className="w-5 h-5 fill-current text-yellow-400" /><span className="text-muted-foreground">{tour.rating}</span></div>
              </div>
              <Button size="lg" className="w-full mb-3" onClick={() => setBookingOpen(true)}>{ui.bookNow}</Button>
              <p className="text-xs text-center text-muted-foreground">{ui.freeCancel}</p>
            </motion.div>
          </div>
        </div>
      </div>
      <BookingFormModal open={bookingOpen} onClose={() => setBookingOpen(false)} tourTitle={tour.title} tourPrice={tour.price} />
      <Footer />
    </div>
  );
};

export default TourDetailPage;