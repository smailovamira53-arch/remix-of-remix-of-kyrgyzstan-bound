import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toursData } from '@/data/toursData';
import { TourCard } from '@/components/TourCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageContext';

const ACTIVITY_TYPES = [
  { key: 'trekking', label: 'Trekking' },
  { key: 'horse-riding', label: 'Horse Riding' },
  { key: 'ski-touring', label: 'Ski Touring' },
  { key: 'yurt-camping', label: 'Yurt Camping' },
  { key: 'photography', label: 'Photography Tours' },
  { key: 'mountain-biking', label: 'Mountain Biking' },
];

const REGIONS = [
  'Issyk-Kul', 'Song-Kol', 'Bishkek', 'Karakol', 'Kazakhstan',
];

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

  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    return toursData.filter(tour => {
      if (selectedType && !matchesType(tour, selectedType)) return false;

      if (selectedRegion) {
        const loc = `${tour.location} ${tour.title}`.toLowerCase();
        if (!loc.includes(selectedRegion.toLowerCase())) return false;
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
  }, [selectedType, selectedRegion, selectedDuration, selectedPrice]);

  const hasFilters = selectedType || selectedRegion || selectedDuration || selectedPrice;

  const clearFilters = () => {
    setSelectedType('');
    setSelectedRegion('');
    setSelectedDuration('');
    setSelectedPrice('');
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

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {selectedType ? ACTIVITY_TYPES.find(a => a.key === selectedType)?.label || 'All Tours' : 'All Tours'}
              </h1>
              <p className="text-muted-foreground">{filtered.length} tour{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Filter Tours</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>

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
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToursPage;
