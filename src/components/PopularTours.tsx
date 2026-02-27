import { useState, useMemo } from 'react';
import { TourCard } from './TourCard';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Sun, Mountain } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { toursData, TourCategory } from '@/data/toursData';

const CATEGORY_TABS: { key: TourCategory | 'all'; label: string; icon: typeof Package }[] = [
  { key: 'all', label: 'All', icon: Mountain },
  { key: 'package', label: 'Tour Packages', icon: Package },
  { key: 'day', label: 'Day Excursions', icon: Sun },
  { key: 'multi-day', label: 'Multi-Day', icon: Mountain },
];

export const PopularTours = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<TourCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return toursData;
    return toursData.filter(tour => tour.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="section-padding bg-snow">
      <div className="container-custom">
        <SectionHeader subtitle={t.popularTours.subtitle} title={t.popularTours.title} description={t.popularTours.description} />

        {/* Category Tabs */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((tour) => (
            <TourCard
              key={tour.slug}
              image={tour.image}
              title={tour.title}
              location={tour.location}
              duration={tour.duration}
              price={tour.price}
              rating={tour.rating}
              reviewCount={tour.reviewCount}
              featured={tour.featured}
              slug={tour.slug}
            />
          ))}
        </div>
        <div className="text-center">
          <a href="/tours">
            <Button size="lg" variant="outline" className="gap-2">{t.popularTours.viewAll}<ArrowRight className="w-4 h-4" /></Button>
          </a>
        </div>
      </div>
    </section>
  );
};
