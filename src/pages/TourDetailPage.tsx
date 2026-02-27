import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Star, Users, Check, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getTourBySlug } from '@/data/toursData';
import { TourGallery } from '@/components/TourGallery';
import { BookingFormModal } from '@/components/BookingFormModal';
import { useLanguage } from '@/i18n/LanguageContext';

const TourDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [bookingOpen, setBookingOpen] = useState(false);
  const tour = slug ? getTourBySlug(slug) : undefined;

  if (!tour) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t.tourDetail?.notFound || 'Tour not found'}</h1>
          <p className="text-muted-foreground mb-8">{t.tourDetail?.notFoundDescription || 'The tour you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/')}>{t.tourDetail?.backToTours || 'Back to Tours'}</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={tour.image} 
          alt={tour.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-24 left-4 md:left-8"
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.tourDetail?.back || 'Back'}
          </Button>
        </motion.div>

        {/* Featured Badge */}
        {tour.featured && (
          <span className="absolute top-24 right-4 md:right-8 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full">
            {t.tourCard.featured}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="container-custom -mt-20 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border"
            >
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{t.tourCard.maxPeople.replace('{count}', String(tour.maxGroup))}</span>
                </div>
              </div>
              
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {tour.title}
              </h1>
              
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-secondary text-secondary" />
                <span className="text-lg font-semibold">{tour.rating}</span>
                <span className="text-muted-foreground">({tour.reviewCount} {t.guides?.reviews || 'reviews'})</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {tour.fullDescription}
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                {t.tourDetail?.highlights || 'Tour Highlights'}
              </h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Itinerary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                {t.tourDetail?.itinerary || 'Day-by-Day Itinerary'}
              </h2>
              <div className="space-y-6">
                {tour.itinerary.map((day, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {day.day}
                      </div>
                      {index < tour.itinerary.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="font-semibold text-foreground mb-2">
                        {t.tourDetail?.day || 'Day'} {day.day}: {day.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Gallery */}
            <TourGallery tourTitle={tour.title} />

            {/* Included / Not Included */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    {t.tourDetail?.included || "What's Included"}
                  </h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    {t.tourDetail?.notIncluded || 'Not Included'}
                  </h3>
                  <ul className="space-y-2">
                    {tour.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Booking Card */}
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
                  <span className="text-3xl font-bold text-foreground">${tour.price}</span>
                  <span className="text-muted-foreground">{t.tourCard.perPerson}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">{tour.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">{t.tourCard.maxPeople.replace('{count}', String(tour.maxGroup))}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Star className="w-5 h-5 text-secondary fill-secondary" />
                  <span className="text-muted-foreground">{tour.rating} ({tour.reviewCount} {t.guides?.reviews || 'reviews'})</span>
                </div>
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
        tourTitle={tour.title}
        tourPrice={tour.price}
      />
      <Footer />
    </div>
  );
};

export default TourDetailPage;
