import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, Shield, Mountain, FileCheck, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingFormModal } from '@/components/BookingFormModal';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

// ── Типы ────────────────────────────────────────────────────────────────────
interface Expedition {
  id: string;
  slug: string | null;
  cover_image: string | null;
  price: number;
  currency: string;
  duration: string | null;
  max_people: number | null;
  difficulty: string | null;
  rating: number | null;
  review_count: number | null;
  is_active: boolean;
  sort_order: number;
  // Локализованные поля
  title_en: string; title_ru: string | null; title_es: string | null; title_ar: string | null;
  description_en: string | null; description_ru: string | null; description_es: string | null; description_ar: string | null;
  location_en: string | null; location_ru: string | null; location_es: string | null; location_ar: string | null;
}

// ── Хелпер: получить поле на нужном языке ───────────────────────────────────
const getLang = (exp: Expedition, field: string, lang: string): string => {
  const key = `${field}_${lang}` as keyof Expedition;
  return (exp[key] as string) || (exp[`${field}_en` as keyof Expedition] as string) || '';
};

// ── Цвет сложности ──────────────────────────────────────────────────────────
const difficultyColor = (d: string | null) => {
  if (!d) return 'bg-gray-100 text-gray-600';
  if (d === 'expert') return 'bg-red-100 text-red-700';
  if (d === 'hard') return 'bg-orange-100 text-orange-700';
  if (d === 'moderate') return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-600';
};

const WHY_ICONS = [Users, Shield, Mountain, FileCheck];
const WHY_KEYS = ['guides', 'safety', 'groups', 'permits'] as const;

// ────────────────────────────────────────────────────────────────────────────

const ExpeditionsPage = () => {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<{ title: string; price: number } | null>(null);
  const { t, language, isRTL } = useLanguage();

  // Загружаем только активные экспедиции, сортируем по sort_order
  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('expeditions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data) setExpeditions(data as Expedition[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const lang = language || 'en';

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&h=900&fit=crop"
          alt="Extreme expeditions in Kyrgyzstan mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-foreground/40 to-foreground/20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <span className="inline-block px-4 py-1.5 bg-destructive/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6 border border-white/20">
            {t.expeditions.heroBadge}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
            {t.expeditions.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {t.expeditions.heroSubtitle}
          </p>
        </motion.div>
      </section>

      {/* ── Карточки экспедиций ── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t.expeditions.sectionTitle}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.expeditions.sectionDescription}
            </p>
          </div>

          {/* Скелетон пока грузится */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border/50 animate-pulse">
                  <div className="h-56 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Нет экспедиций */}
          {!loading && expeditions.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Mountain className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No expeditions available</p>
              <p className="text-sm mt-1">Check back soon for upcoming expeditions</p>
            </div>
          )}

          {/* Карточки */}
          {!loading && expeditions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expeditions.map((exp, index) => {
                const title = getLang(exp, 'title', lang);
                const description = getLang(exp, 'description', lang);
                const location = getLang(exp, 'location', lang);
                const slug = exp.slug || exp.id;

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
                  >
                    {/* Фото */}
                    <div className="relative h-56 overflow-hidden">
                      {exp.cover_image ? (
                        <img
                          src={exp.cover_image}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Mountain className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Сложность */}
                      {exp.difficulty && (
                        <span className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} px-3 py-1 text-xs font-semibold rounded-full ${difficultyColor(exp.difficulty)}`}>
                          {exp.difficulty}
                        </span>
                      )}

                      {/* Рейтинг */}
                      {exp.rating && (
                        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full`}>
                          <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                          <span className="text-xs font-medium text-foreground">{exp.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Контент */}
                    <div className="p-5">
                      {/* Локация */}
                      {location && (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{location}</span>
                        </div>
                      )}

                      {/* Название */}
                      <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                      </h3>

                      {/* Описание */}
                      {description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
                      )}

                      {/* Длительность и группа */}
                      <div className="flex items-center gap-3 text-muted-foreground text-sm mb-4">
                        {exp.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{exp.duration}</span>
                          </div>
                        )}
                        {exp.max_people && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{t.common.max} {exp.max_people}</span>
                          </div>
                        )}
                      </div>

                      {/* Цена и кнопки */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">{t.common.from}</p>
                          <p className="text-xl font-bold text-foreground">
                            {exp.price > 0 ? `$${exp.price.toLocaleString()}` : 'On request'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/expeditions/${slug}`}>{t.common.details}</Link>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setBooking({ title, price: exp.price })}
                          >
                            {t.common.bookNow}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Section ── */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t.expeditions.whyTitle}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.expeditions.whyDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_KEYS.map((key, index) => {
              const Icon = WHY_ICONS[index];
              const item = t.expeditions.whyItems[key];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 text-center border border-border/50 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            {t.expeditions.ctaTitle}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            {t.expeditions.ctaDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact" className="gap-2">
                {t.expeditions.ctaButton} <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {booking && (
        <BookingFormModal
          open={!!booking}
          onClose={() => setBooking(null)}
          tourTitle={booking.title}
          tourPrice={booking.price}
        />
      )}
    </div>
  );
};

export default ExpeditionsPage;