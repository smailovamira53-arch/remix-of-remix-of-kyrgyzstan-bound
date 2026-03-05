import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Sun, Mountain, Clock, Users } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTours, getLocalizedField, SupabaseTour } from '@/hooks/useTours';
import { TourCategory } from '@/data/toursData';

const CATEGORY_TABS: { key: TourCategory | 'all'; label: string; icon: typeof Package }[] = [
  { key: 'all',       label: 'All',            icon: Mountain },
  { key: 'package',   label: 'Tour Packages',  icon: Package  },
  { key: 'day',       label: 'Day Excursions', icon: Sun      },
  { key: 'multi-day', label: 'Multi-Day',      icon: Mountain },
];

const TourSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="flex justify-between pt-2">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const SupabaseTourCard = ({ tour }: { tour: SupabaseTour }) => {
  const { language } = useLanguage();

  const title = getLocalizedField(tour, 'title', language);
  const description = getLocalizedField(tour, 'description', language);
  const image = tour.image_url || tour.gallery_images?.[0] || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop';
  const slug = tour.slug || tour.id;

  const difficultyColor: Record<string, string> = {
    easy:     'bg-green-100 text-green-700',
    moderate: 'bg-yellow-100 text-yellow-700',
    hard:     'bg-red-100 text-red-700',
  };

  return (
    <Link
      to={`/tours/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop';
          }}
        />
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${difficultyColor[tour.difficulty] || 'bg-gray-100 text-gray-600'}`}>
          {tour.difficulty}
        </span>
        {tour.is_featured && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            ⭐ Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} /> max {tour.max_people}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">from</span>
            <span className="text-xl font-bold text-primary ml-1">${tour.price}</span>
          </div>
          <span className="flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
            View <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export const PopularTours = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<TourCategory | 'all'>('all');

  const { data: tours, isLoading: loading, error } = useTours(
    activeCategory === 'all' ? undefined : { category: activeCategory }
  );

  return (
    <section className="section-padding bg-snow">
      <div className="container-custom">
        <SectionHeader
          subtitle={t.popularTours.subtitle}
          title={t.popularTours.title}
          description={t.popularTours.description}
        />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORY_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary-foreground' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="text-center py-10 text-red-500">
            <p>Не удалось загрузить туры. Обновите страницу.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading
            ? [1, 2, 3].map(i => <TourSkeleton key={i} />)
            : tours.map(tour => <SupabaseTourCard key={tour.id} tour={tour} />)
          }
          {!loading && !error && tours.length === 0 && (
            <div className="col-span-3 text-center py-10 text-gray-400">
              <p>В этой категории пока нет туров.</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/tours">
            <Button size="lg" variant="outline" className="gap-2">
              {t.popularTours.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};