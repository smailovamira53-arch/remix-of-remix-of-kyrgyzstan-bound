import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Star, Check, ChevronDown, Swords, Target, Trophy, Bird, Dog, Flame, Info, Sun, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingFormModal } from '@/components/BookingFormModal';
import { TourGallery } from '@/components/TourGallery';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=800&fit=crop';
const HIGHLIGHT_ICONS = [Swords, Target, Trophy, Bird, Dog, Flame];

const NomadGamesPage = () => {
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dbTour, setDbTour] = useState<{ start_date: string | null; end_date: string | null; status: string; current_bookings: number } | null>(null);
  const { t, isRTL } = useLanguage();
  const pg = t.nomadGamesPage;

  useEffect(() => {
    supabase
      .from('tours')
      .select('start_date, end_date, status, current_bookings')
      .eq('title', 'World Nomad Games 2026')
      .maybeSingle()
      .then(({ data }) => {
        if (data) setDbTour(data);
      });
  }, []);

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={HERO_IMAGE} alt="World Nomad Games 2026" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`absolute top-24 ${isRTL ? 'right-4 md:right-8' : 'left-4 md:left-8'}`}>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />{pg.back}
          </Button>
        </motion.div>
        <span className={`absolute top-24 ${isRTL ? 'left-4 md:left-8' : 'right-4 md:right-8'} px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full`}>{pg.specialEvent}</span>
      </div>

      {/* Content */}
      <div className="container-custom -mt-20 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /><span>{pg.location}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /><span>{pg.duration}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /><span>{pg.countries}</span></div>
              </div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">{pg.title}</h1>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-foreground">{pg.dates}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{pg.description}</p>
            </motion.div>

            {/* Who is it for */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">{pg.whoIsItFor.title}</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {pg.whoIsItFor.items.map((item) => (
                  <li key={item} className="flex items-start gap-3"><Check className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span className="text-muted-foreground">{item}</span></li>
                ))}
              </ul>
            </motion.div>

            {/* Why It Matters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">{pg.whyItMatters.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{pg.whyItMatters.description}</p>
            </motion.div>

            {/* Program Highlights */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">{pg.programHighlights.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pg.programHighlights.items.map((label, i) => {
                  const Icon = HIGHLIGHT_ICONS[i];
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <Icon className="w-6 h-6 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Day by Day Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">{pg.dayByDay.title}</h2>
              <div className="space-y-3">
                {pg.dayByDay.days.map((item, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">{index + 1}</div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                          <p className="font-semibold text-foreground">{item.title}</p>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 pt-2">
                      <p className={`text-sm text-muted-foreground leading-relaxed ${isRTL ? 'pr-[52px]' : 'pl-[52px]'}`}>{item.description}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </motion.div>

            {/* What's Included / Not Included */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">{pg.practical.title}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Check className="w-5 h-5 text-primary" />{pg.practical.includedTitle}</h3>
                  <ul className="space-y-2">
                    {pg.practical.included.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />{pg.practical.notIncludedTitle}</h3>
                  <ul className="space-y-2">
                    {pg.practical.notIncluded.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-muted-foreground mt-0.5 shrink-0">—</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3">{pg.practical.accommodationTitle}</h3>
                <p className="text-sm text-muted-foreground">{pg.practical.accommodationDescription}</p>
              </div>
            </motion.div>

            {/* Packing Tips */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Sun className="w-5 h-5 text-primary" />{pg.packing.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{pg.packing.subtitle}</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {pg.packing.items.map(tip => (
                  <div key={tip} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{tip}</div>
                ))}
              </div>
            </motion.div>

            {/* Optional Experiences */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-primary" />{pg.optional.title}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {pg.optional.items.map(exp => (
                  <div key={exp} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <Star className="w-5 h-5 fill-current text-yellow-400 shrink-0" />
                    <span className="text-sm font-medium text-foreground">{exp}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Gallery */}
            <TourGallery tourTitle="World Nomad Games 2026" />

            {/* Tour Schedule & Status */}
            {dbTour && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-primary" />{pg.schedule.title}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {dbTour.start_date && (
                    <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">{pg.schedule.startDate}</p><p className="font-semibold text-foreground">{new Date(dbTour.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div></div>
                  )}
                  {dbTour.end_date && (
                    <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">{pg.schedule.endDate}</p><p className="font-semibold text-foreground">{new Date(dbTour.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div></div>
                  )}
                  <div className="flex items-center gap-3"><div><p className="text-xs text-muted-foreground">{pg.schedule.status}</p><Badge variant={dbTour.status === 'Open' ? 'default' : dbTour.status === 'Almost Full' ? 'secondary' : 'destructive'}>{dbTour.status}</Badge></div></div>
                  <div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">{pg.schedule.currentBookings}</p><p className="font-semibold text-foreground">{dbTour.current_bookings}</p></div></div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">{pg.booking.priceOnRequest}</p>
                <p className="text-xs text-muted-foreground mt-1">{pg.booking.priceDescription}</p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm"><Calendar className="w-5 h-5 text-primary" /><span className="text-muted-foreground">{pg.booking.dateRange}</span></div>
                <div className="flex items-center gap-3 text-sm"><MapPin className="w-5 h-5 text-primary" /><span className="text-muted-foreground">{pg.location}</span></div>
                <div className="flex items-center gap-3 text-sm"><Star className="w-5 h-5 text-secondary fill-secondary" /><span className="text-muted-foreground">{pg.booking.onceInLifetime}</span></div>
              </div>
              <Button size="lg" className="w-full mb-3" onClick={() => setBookingOpen(true)}>{pg.booking.bookNow}</Button>
              <p className="text-xs text-center text-muted-foreground">{pg.booking.freeCancel}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <BookingFormModal open={bookingOpen} onClose={() => setBookingOpen(false)} tourTitle={pg.title} tourPrice={0} />
      <Footer />
    </div>
  );
};

export default NomadGamesPage;