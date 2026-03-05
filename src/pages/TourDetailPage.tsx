import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Star, Users, Check, X, Calendar, Info } from 'lucide-react';
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

const TourDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [dbTourFull, setDbTourFull] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(true);

  // Static tour from code
  const staticTour = slug ? getTourBySlug(slug) : undefined;

  // Load tour from Supabase by slug or id
  useEffect(() => {
    if (!slug) return;
    setLoadingDb(true);
    supabase
  .from('tours')
  .select('*')
  .eq('slug', slug)
  .maybeSingle()
     .then(({ data, error }) => {
  console.log('Tour data:', data);
  console.log('Tour error:', error);
  console.log('Slug:', slug);
  setDbTourFull(data);
  setLoadingDb(false);
});
  }, [slug]);

  // Show loading
  if (loadingDb) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-32 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // If DB tour found — show DB tour page
  if (dbTourFull) {
    const title =
  language === 'ru' ? dbTourFull.title_ru || dbTourFull.title
  : language === 'es' ? dbTourFull.title_es || dbTourFull.title
  : language === 'ar' ? dbTourFull.title_ar || dbTourFull.title
  : dbTourFull.title;

const description =
  language === 'ru' ? dbTourFull.description_ru || dbTourFull.description
  : language === 'es' ? dbTourFull.description_es || dbTourFull.description
  : language === 'ar' ? dbTourFull.description_ar || dbTourFull.description
  : dbTourFull.description;

    const gallery: string[] = dbTourFull.gallery_images || [];

    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
          src={dbTourFull.image_url || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-24 left-4 md:left-8"
          >
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="bg-background/80 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.tourDetail?.back || 'Back'}
            </Button>
          </motion.div>
          {dbTourFull.is_featured && (
            <span className="absolute top-24 right-4 md:right-8 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full">
              {t.tourCard.featured}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="container-custom -mt-20 relative z-10 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border"
              >
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Kyrgyzstan</span>
                  </div>
                  {dbTourFull.duration && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{dbTourFull.duration}</span>
                    </div>
                  )}
                  {dbTourFull.max_people && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Max {dbTourFull.max_people} people</span>
                    </div>
                  )}
                  {dbTourFull.difficulty && (
                    <Badge variant="outline">{dbTourFull.difficulty}</Badge>
                  )}
                </div>

                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {title}
                </h1>

                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 fill-current text-yellow-400" />
                  <span className="text-lg font-semibold">5.0</span>
                  <span className="text-muted-foreground">(New tour)</span>
                </div>

                {description && (
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                )}
              </motion.div>

              {/* Highlights */}
{dbTourFull.highlights?.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border"
  >
    <h2 className="font-display text-xl font-bold text-foreground mb-4">
      {t.tourDetail?.highlights || 'Tour Highlights'}
    </h2>
    <ul className="grid md:grid-cols-2 gap-3">
      {dbTourFull.highlights.map((item: string, i: number) => (
        <li key={i} className="flex items-start gap-3">
          <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>
)}
              {/* Itinerary */}
              {dbTourFull.itinerary && dbTourFull.itinerary.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border"
                >
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">Day-by-Day Itinerary</h2>
                  <div className="space-y-6">
                    {dbTourFull.itinerary.map((day: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            {day.day}
                          </div>
                          {index < dbTourFull.itinerary.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="pb-6">
                          <h3 className="font-semibold text-foreground mb-2">Day {day.day}: {day.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Included / Not Included */}
              {(dbTourFull.included?.length > 0 || dbTourFull.not_included?.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" /> What's Included
                    </h3>
                    <ul className="space-y-2">
                      {(dbTourFull.included || []).map((item: string, i: number) => (
  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
    {item}
  </li>
))}
                    </ul>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-500" /> Not Included
                    </h3>
                    <ul className="space-y-2">
                      {(dbTourFull.not_included || []).map((item: string, i: number) => (
  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
    {item}
  </li>
))}
                    </ul>
                  </div>
                </motion.div>
              )}
              {/* Gallery from Supabase Storage */}
              {gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border"
                >
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">Photo Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.map((url: string, i: number) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${title} photo ${i + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24"
              >
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">{t.tourCard.from}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">
                      ${dbTourFull.price}
                    </span>
                    <span className="text-muted-foreground">{t.tourCard.perPerson}</span>
                  </div>
                  {dbTourFull.currency && dbTourFull.currency !== 'USD' && (
                    <span className="text-xs text-muted-foreground">{dbTourFull.currency}</span>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  {dbTourFull.duration && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{dbTourFull.duration}</span>
                    </div>
                  )}
                  {dbTourFull.max_people && (
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Max {dbTourFull.max_people} people</span>
                    </div>
                  )}
                  {dbTourFull.difficulty && (
                    <div className="flex items-center gap-3 text-sm">
                      <Info className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Difficulty: {dbTourFull.difficulty}</span>
                    </div>
                  )}
                </div>

                <Button size="lg" className="w-full mb-3" onClick={() => setBookingOpen(true)}>
                  {t.common.bookNow}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  {t.tourDetail?.freeCancel || 'Free cancellation up to 48 hours before'}
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <BookingFormModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          tourTitle={title}
          tourPrice={dbTourFull.price}
        />
        <Footer />
      </div>
    );
  }

  // Static tour
  if (!staticTour) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t.tourDetail?.notFound || 'Tour not found'}</h1>
          <p className="text-muted-foreground mb-8">{t.tourDetail?.notFoundDescription || 'The tour you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/tours')}>{t.tourDetail?.backToTours || 'Back to Tours'}</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tour = staticTour;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-24 left-4 md:left-8">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.tourDetail?.back || 'Back'}
          </Button>
        </motion.div>
        {tour.featured && (
          <span className="absolute top-24 right-4 md:right-8 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full">
            {t.tourCard.featured}
          </span>
        )}
      </div>

      <div className="container-custom -mt-20 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /><span>{tour.location}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /><span>{tour.duration}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /><span>{t.tourCard.maxPeople.replace('{count}', String(tour.maxGroup))}</span></div>
              </div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">{tour.title}</h1>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-current text-yellow-400" />
                <span className="text-lg font-semibold">{tour.rating}</span>
                <span className="text-muted-foreground">({tour.reviewCount} {t.guides?.reviews || 'reviews'})</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{tour.fullDescription}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">{t.tourDetail?.highlights || 'Tour Highlights'}</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">{t.tourDetail?.itinerary || 'Day-by-Day Itinerary'}</h2>
              <div className="space-y-6">
                {tour.itinerary.map((day, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{day.day}</div>
                      {index < tour.itinerary.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                    </div>
                    <div className="pb-6">
                      <h3 className="font-semibold text-foreground mb-2">{t.tourDetail?.day || 'Day'} {day.day}: {day.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <TourGallery tourTitle={tour.title} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Check className="w-5 h-5 text-green-600" />{t.tourDetail?.included || "What's Included"}</h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><X className="w-5 h-5 text-red-500" />{t.tourDetail?.notIncluded || 'Not Included'}</h3>
                  <ul className="space-y-2">
                    {tour.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">{t.tourCard.from}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">${tour.price}</span>
                  <span className="text-muted-foreground">{t.tourCard.perPerson}</span>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm"><Calendar className="w-5 h-5 text-primary" /><span className="text-muted-foreground">{tour.duration}</span></div>
                <div className="flex items-center gap-3 text-sm"><Users className="w-5 h-5 text-primary" /><span className="text-muted-foreground">{t.tourCard.maxPeople.replace('{count}', String(tour.maxGroup))}</span></div>
                <div className="flex items-center gap-3 text-sm"><Star className="w-5 h-5 fill-current text-yellow-400" /><span className="text-muted-foreground">{tour.rating} ({tour.reviewCount} {t.guides?.reviews || 'reviews'})</span></div>
              </div>
              <Button size="lg" className="w-full mb-3" onClick={() => setBookingOpen(true)}>{t.common.bookNow}</Button>
              <p className="text-xs text-center text-muted-foreground">{t.tourDetail?.freeCancel || 'Free cancellation up to 48 hours before'}</p>
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
