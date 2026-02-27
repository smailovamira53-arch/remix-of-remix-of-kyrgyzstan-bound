import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, X, Package, Sun, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toursData, TourCategory } from '@/data/toursData';
import { TourCard } from '@/components/TourCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageContext';

const CATEGORY_TABS: { key: TourCategory | 'all'; label: string; icon: typeof Package; description: string }[] = [
  { key: 'all', label: 'All Tours', icon: Mountain, description: 'Browse all available tours' },
  { key: 'package', label: 'Tour Packages', icon: Package, description: 'All-inclusive premium packages' },
  { key: 'day', label: 'Day Excursions', icon: Sun, description: 'Short 1-day trips' },
  { key: 'multi-day', label: 'Multi-Day Tours', icon: Mountain, description: '3+ day adventures' },
];

const ACTIVITY_TYPES = [
  { key: 'trekking', label: 'Trekking' },
  { key: 'horse-riding', label: 'Horse Riding' },
  { key: 'ski-touring', label: 'Ski Touring' },
  { key: 'yurt-camping', label: 'Yurt Camping' },
  { key: 'photography', label: 'Photography Tours' },
  { key: 'mountain-biking', label: 'Mountain Biking' },
];

const REGIONS = ['Issyk-Kul', 'Song-Kol', 'Bishkek', 'Karakol', 'Kazakhstan'];

const DURATIONS = [
  { key: '1-3', label: '1–3 Days' },
  { key: '4-7', label: '4–7 Days' },
  { key: '8+', label: '8+ Days' },
];

const PRICE_RANGES = [
  { key: '0-300', label: 'Under $300' },
  { key: '300-600', label: '$300–$600' },
  { key: '600+', label: '$600+' },
];

const matchesType = (tour: typeof toursData[0], type: string) => {
  const text = `${tour.title} ${tour.fullDescription} ${tour.highlights.join(' ')}`.toLowerCase();
  const map: Record<string, string[]> = {
    'trekking': ['trek', 'hike', 'hiking', 'trekking'],
    'horse-riding': ['horse', 'horseback', 'riding'],
    'ski-touring': ['ski', 'snow', 'winter'],
    'yurt-camping': ['yurt', 'camp', 'camping'],
    'photography': ['photo', 'photography', 'camera'],
    'mountain-biking': ['bike', 'biking', 'cycling'],
  };
  return (map[type] || []).some(kw => text.includes(kw));
};

const parseDays = (duration: string): number => {
  const m = duration.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
};

const ToursPage = () => {
  const [params] = useSearchParams();
  const { t } = useLanguage();
  const initialType = params.get('type') || '';
  const initialDestinations = params.get('destinations')?.split(',') || [];
  const initialRegion = initialDestinations.length === 1
    ? REGIONS.find(r => r.toLowerCase() === initialDestinations[0].toLowerCase()) || ''
    : '';

  const [activeCategory, setActiveCategory] = useState<TourCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState(
    initialDestinations.length > 0 && !initialRegion ? initialDestinations.join(' ') : ''
  );
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    return toursData.filter(tour => {
      if (activeCategory !== 'all' && tour.category !== activeCategory) return false;
      if (selectedType && !matchesType(tour, selectedType)) return false;
      if (selectedRegion) {
        const loc = `${tour.location} ${tour.title}`.toLowerCase();
        if (!loc.includes(selectedRegion.toLowerCase())) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const text = `${tour.title} ${tour.location} ${tour.fullDescription}`.toLowerCase();
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
  }, [activeCategory, selectedType, selectedRegion, selectedDuration, selectedPrice, searchQuery]);

  const hasFilters = selectedType || selectedRegion || selectedDuration || selectedPrice || searchQuery;

  const clearFilters = () => {
    setSelectedType('');
    setSelectedRegion('');
    setSelectedDuration('');
    setSelectedPrice('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="container-custom">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Explore Our Tours</h1>
            <p className="text-muted-foreground">{filtered.length} tour{filtered.length !== 1 ? 's' : ''} found</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORY_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-300 ${
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

          {/* Filters toggle */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-primary hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Activity Type</p>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_TYPES.map(a => (
                    <button key={a.key} onClick={() => setSelectedType(selectedType === a.key ? '' : a.key)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedType === a.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary/50'}`}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Region</p>
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
                  <p className="text-sm text-muted-foreground mb-2">Duration</p>
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
                  <p className="text-sm text-muted-foreground mb-2">Price Range</p>
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
              <p className="text-lg text-muted-foreground mb-4">No tours match your filters.</p>
              <Button onClick={() => { setActiveCategory('all'); clearFilters(); }}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToursPage;
