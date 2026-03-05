import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { BookingFormModal } from './BookingFormModal';
import { useTours, getLocalizedField } from '@/hooks/useTours';

export const Excursions = () => {
  const { t, language } = useLanguage();
  const [booking, setBooking] = useState<{ title: string; price: number } | null>(null);

  const { data: allTours, isLoading } = useTours({ category: 'day' });
  const excursions = allTours.slice(0, 3);

  if (isLoading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            subtitle={t.excursions.subtitle}
            title={t.excursions.title}
            description={t.excursions.description}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl h-[400px] bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <SectionHeader
          subtitle={t.excursions.subtitle}
          title={t.excursions.title}
          description={t.excursions.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {excursions.map((tour, index) => {
            const title = getLocalizedField(tour, 'title', language);
            const description = getLocalizedField(tour, 'description', language);
            const image = tour.image_url || tour.gallery_images?.[0] || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop';
            const slug = tour.slug || tour.id;

            return (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl h-[400px]"
              >
                <img
                  src={image}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{tour.duration}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-4 line-clamp-2">
                    {description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-primary-foreground">
                      <span className="text-2xl font-bold">${tour.price}</span>
                      <span className="text-sm opacity-80">{t.common.perPerson}</span>
                    </p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/tours/${slug}`}>
                        <Button size="sm" variant="heroOutline" className="gap-1">
                          View <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="heroOutline"
                        className="gap-1"
                        onClick={() => setBooking({ title, price: tour.price })}
                      >
                        {t.nav.bookNow}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/tours?category=day">
            <Button size="lg" variant="outline" className="gap-2">
              {t.popularTours.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {booking && (
        <BookingFormModal
          open={!!booking}
          onClose={() => setBooking(null)}
          tourTitle={booking.title}
          tourPrice={booking.price}
        />
      )}
    </section>
  );
};