import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, Shield, Mountain, Award, FileCheck, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingFormModal } from '@/components/BookingFormModal';
import { useLanguage } from '@/i18n/LanguageContext';

const difficultyColor = (d: string) => {
  if (d === 'Expert' || d === 'Экспертная' || d === 'Experto' || d === 'متقدمة') return 'bg-destructive/10 text-destructive';
  if (d === 'Hard' || d === 'Сложная' || d === 'Difícil' || d === 'صعبة') return 'bg-orange-100 text-orange-700';
  return 'bg-primary/10 text-primary';
};

const EXPEDITION_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop',
];

const EXPEDITION_SLUGS = ['peak-lenin-base-camp', 'khan-tengri-summit', 'tien-shan-heli-trek', 'ala-too-mountaineering', 'pamir-highway-expedition'];
const EXPEDITION_PRICES = [2500, 3500, 1800, 1200, 2200];
const EXPEDITION_RATINGS = [4.9, 4.8, 5.0, 4.7, 4.9];
const EXPEDITION_REVIEWS = [34, 18, 22, 41, 27];
const EXPEDITION_DIFFICULTIES = ['hard', 'expert', 'moderate', 'hard', 'moderate'] as const;
const EXPEDITION_MAX_GROUPS = [8, 6, 10, 8, 10];

const WHY_ICONS = [Users, Shield, Mountain, FileCheck];
const WHY_KEYS = ['guides', 'safety', 'groups', 'permits'] as const;

const ExpeditionsPage = () => {
  const [booking, setBooking] = useState<{ title: string; price: number } | null>(null);
  const { t, isRTL } = useLanguage();

  const difficultyLabel = (key: typeof EXPEDITION_DIFFICULTIES[number]) => {
    return t.expeditions.difficulty[key] || key;
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Hero */}
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

      {/* Expedition Cards */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">{t.expeditions.sectionTitle}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.expeditions.sectionDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.expeditions.items.map((exp, index) => (
              <motion.div
                key={EXPEDITION_SLUGS[index]}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={EXPEDITION_IMAGES[index]} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} px-3 py-1 text-xs font-semibold rounded-full ${difficultyColor(difficultyLabel(EXPEDITION_DIFFICULTIES[index]))}`}>
                    {difficultyLabel(EXPEDITION_DIFFICULTIES[index])}
                  </span>
                  <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full`}>
                    <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                    <span className="text-xs font-medium text-foreground">{EXPEDITION_RATINGS[index]}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{exp.description}</p>

                  <div className="flex items-center gap-3 text-muted-foreground text-sm mb-4">
                    <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /><span>{exp.duration}</span></div>
                    <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /><span>{t.common.max} {EXPEDITION_MAX_GROUPS[index]}</span></div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.common.from}</p>
                      <p className="text-xl font-bold text-foreground">${EXPEDITION_PRICES[index].toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/expeditions/${EXPEDITION_SLUGS[index]}`}>{t.common.details}</Link>
                      </Button>
                      <Button size="sm" onClick={() => setBooking({ title: exp.title, price: EXPEDITION_PRICES[index] })}>
                        {t.common.bookNow}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">{t.expeditions.whyTitle}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.expeditions.whyDescription}</p>
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

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">{t.expeditions.ctaTitle}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">{t.expeditions.ctaDescription}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact" className="gap-2">{t.expeditions.ctaButton} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {booking && (
        <BookingFormModal open={!!booking} onClose={() => setBooking(null)} tourTitle={booking.title} tourPrice={booking.price} />
      )}
    </div>
  );
};

export default ExpeditionsPage;