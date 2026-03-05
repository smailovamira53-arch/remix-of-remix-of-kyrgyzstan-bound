import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, X, Package, Sun, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TourCategory } from '@/data/toursData';
import { TourCard } from '@/components/TourCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTours } from '@/hooks/useTours';

const REGIONS = ['Issyk-Kul', 'Song-Kol', 'Bishkek', 'Karakol', 'Kazakhstan'];

const parseDays = (duration: string | number | null): number => {
  if (!duration) return 0;
  if (typeof duration === 'number') return duration;
  const m = duration.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
};

const ToursPage = () => {
  const [params] = useSearchParams();
  const { t, language, isRTL } = useLanguage();
  const { data: dbTours = [], isLoading } = useTours();

  const initialDestinations = params.get('destinations')?.split(',') || [];
  const initialRegion = initialDestinations.length === 1
    ? REGIONS.find(r => r.toLowerCase() === initialDestinations[0].toLowerCase()) || ''
    : '';

  const categoryFromUrl = (params.get('category') as TourCategory) || 'all';
  const tagFromUrl = params.get('tag') || '';

  const [activeCategory, setActiveCategory] = useState<TourCategory | 'all'>(categoryFromUrl);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState(
    initialDestinations.length > 0 && !initialRegion ? initialDestinations.join(' ') : ''
  );
  const [showFilters, setShowFilters] = useState(true);

  const CATEGORY_TABS: { key: TourCategory | 'all'; label: string; icon: typeof Package }[] = [
    { key: 'all',       label: t.toursPage.categories.all,          icon: Mountain },
    { key: 'package',   label: t.toursPage.categories.packages,     icon: Package  },
    { key: 'day',       label: t.toursPage.categories.dayExcursions, icon: Sun     },
    { key: 'multi-day', label: t.toursPage.categories.multiDay,     icon: Mountain },
  ];

  const DURATIONS = [
    { key: '1-3', label: t.toursPage.durations.d13 },
    { key: '4-7', label: t.toursPage.durations.d47 },
    { key: '8+',  label: t.toursPage.durations.d8  },
  ];

  const PRICE_RANGES = [
    { key: '0-300',   label: t.toursPage.priceRanges.under300 },
    { key: '300-600', label: t.toursPage.priceRanges.mid      },
    { key: '600+',    label: t.toursPage.priceRanges.over600  },
  ];

  const dbToursFormatted = useMemo(() => {
    return dbTours.map(tour => ({
      slug: tour.slug || tour.id,
      image: tour.image_url || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
      title: language === 'ru' ? (tour.title_ru || tour.title)
           : language === 'es' ? (tour.title_es || tour.title)
           : language === 'ar' ? (tour.title_ar || tour.title)
           : tour.title,
      location: 'Kyrgyzstan',
      duration: tour.duration || '1 Day',
      price: tour.price || 0,
      rating: 5.0,
      reviewCount: 0,
      featured: tour.is_featured || false,
      category: (tour.category || 'package') as TourCategory,
      tags: (tour as any).tags || '',
      isFromDB: true,
    }));
  }, [dbTours, language]);

  const allTours = useMemo(() => {
    return [...dbToursFormatted];
  }, [dbToursFormatted]);

  const filtered = useMemo(() => {
    return allTours.filter(tour => {
      if (activeCategory !== 'all' && tour.category !== activeCategory) return false;
      if (tagFromUrl) {
        const tourTags = (tour.tags || '').toLowerCase();
        if (!tourTags.includes(tagFromUrl.toLowerCase())) return false;
      }
      if (selectedRegion) {
        const loc = `${tour.location} ${tour.title}`.toLowerCase();
        if (!loc.includes(selectedRegion.toLowerCase())) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const text = `${tour.title} ${tour.location}`.toLowerCase();
        if (!q.split(' ').some(word => text.includes(word))) return false;
      }
      if (selectedDuration) {
        const days = parseDays(tour.duration);
        if (selectedDuration === '1-3' && days > 3) return false;
        if (selectedDuration === '4-7' && (days < 4 || days > 7)) return false;
        if (selectedDuration === '8+' && days < 8) return false;
      }
      if (selectedPrice) {
        if (selectedPrice === '0-300' && tour.price >= 300) return false;
        if (selectedPrice === '300-600' && (tour.price < 300 || tour.price > 600)) return false;
        if (selectedPrice === '600+' && tour.price < 600) return false;
      }
      return true;
    });
  }, [allTours, activeCategory, tagFromUrl, selectedRegion, selectedDuration, selectedPrice, searchQuery]);

  const hasFilters = selectedRegion || selectedDuration || selectedPrice || searchQuery;

  const clearFilters = () => {
    setSelectedRegion('');
    setSelectedDuration('');
    setSelectedPrice('');
    setSearchQuery('');
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="container-custom">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t.toursPage.backToHome}
          </Link>
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t.toursPage.exploreTitle}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Loading...' : `${filtered.length} ${t.toursPage.toursFound}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORY_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveCategory(tab.key)}
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-300 ${isActive ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/50'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" />
              {t.toursPage.filtersToggle}
            </Button>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-primary hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> {t.toursPage.clearAll}
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t.toursPage.filters.region}</p>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(r => (
                    <button key={r} onClick={() => setSelectedRegion(selectedRegion === r ? '' : r)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedRegion === r ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary/50'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t.toursPage.filters.duration}</p>
                  <div className="flex flex-wrap gap-2">
                    {DURATIONS.map(d => (
                      <button key={d.key} onClick={() => setSelectedDuration(selectedDuration === d.key ? '' : d.key)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedDuration === d.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary/50'}`}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t.toursPage.filters.price}</p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map(p => (
                      <button key={p.key} onClick={() => setSelectedPrice(selectedPrice === p.key ? '' : p.key)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedPrice === p.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary/50'}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(tour => (
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
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">{t.toursPage.noResults}</p>
              <Button onClick={() => { setActiveCategory('all'); clearFilters(); }}>
                {t.toursPage.clearAllFilters}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToursPage;