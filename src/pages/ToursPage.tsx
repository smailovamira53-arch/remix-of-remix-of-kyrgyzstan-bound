import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TourCategory } from '@/data/toursData';
import { TourCard } from '@/components/TourCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTours } from '@/hooks/useTours';

const DESTINATION_GROUPS = {
  Kyrgyzstan: [
    'Issyk-Kul Lake', 'Ala-Archa Gorge', 'Song-Kul Lake', 'Jeti-Oguz Canyon',
    'Karakol', 'Skazka Canyon', 'Altyn Arashan', 'Tash Rabat', 'Burana Tower',
    'Arslanbob', 'Osh', 'Sary-Chelek Lake', 'Kel-Suu Lake', 'Lenin Peak Base Camp',
    'Jyrgalan Valley',
  ],
  Kazakhstan: ['Big Almaty Lake', 'Charyn Canyon', 'Kolsai Lakes', 'Kaindy Lake', 'Almaty', 'Turkestan'],
  Uzbekistan: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'],
};

const TAGS = [
  { key: 'trekking',          label: 'Trekking' },
  { key: 'horse-riding',      label: 'Horse Riding' },
  { key: 'ski-touring',       label: 'Ski Touring' },
  { key: 'yurt-camping',      label: 'Yurt Camping' },
  { key: 'photography-tours', label: 'Photography Tours' },
  { key: 'mountain-biking',   label: 'Mountain Biking' },
];

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

  const initialDests = params.get('destinations')?.split(',').map(d => d.trim()) || [];
  const categoryFromUrl = (params.get('category') as TourCategory) || 'all';
  const tagFromUrl = params.get('tag') || '';

  const [activeCategory, setActiveCategory] = useState<TourCategory | 'all'>(categoryFromUrl);
  const [selectedDests, setSelectedDests] = useState<string[]>(initialDests);
  const [selectedTags, setSelectedTags] = useState<string[]>(tagFromUrl ? [tagFromUrl] : []);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCountries, setExpandedCountries] = useState<string[]>([]);

  const CATEGORY_TABS = [
    { key: 'all' as const,       label: t.toursPage.categories.all },
    { key: 'package' as const,   label: t.toursPage.categories.packages },
    { key: 'day' as const,       label: t.toursPage.categories.dayExcursions },
    { key: 'multi-day' as const, label: t.toursPage.categories.multiDay },
  ];

  const DURATIONS = [
    { key: '1-3', label: t.toursPage.durations.d13 },
    { key: '4-7', label: t.toursPage.durations.d47 },
    { key: '8+',  label: t.toursPage.durations.d8  },
  ];

  const dbToursFormatted = useMemo(() => dbTours.map(tour => ({
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
    destinations: (tour as any).destinations || [],
    isEvent: tour.is_event ?? false,
    difficulty: tour.difficulty,
    difficulty: (tour as any).difficulty ?? undefined,
  })), [dbTours, language]);

  const filtered = useMemo(() => dbToursFormatted.filter(tour => {
    if (activeCategory !== 'all' && tour.category !== activeCategory) return false;
    if (selectedTags.length > 0) {
      const tourTags = (tour.tags || '').toLowerCase();
      if (!selectedTags.some(tag => tourTags.includes(tag.toLowerCase()))) return false;
    }
    if (selectedDests.length > 0) {
      const tourDests: string[] = tour.destinations || [];
      const tourTitle = tour.title.toLowerCase();
      const hasMatch = selectedDests.some(dest =>
        tourDests.some(d => d.toLowerCase().includes(dest.toLowerCase())) ||
        tourTitle.includes(dest.toLowerCase())
      );
      if (!hasMatch) return false;
    }
    if (selectedDuration) {
      const days = parseDays(tour.duration);
      if (selectedDuration === '1-3' && days > 3) return false;
      if (selectedDuration === '4-7' && (days < 4 || days > 7)) return false;
      if (selectedDuration === '8+' && days < 8) return false;
    }
    return true;
  }), [dbToursFormatted, activeCategory, selectedTags, selectedDests, selectedDuration]);

  const hasFilters = selectedDests.length > 0 || selectedTags.length > 0 || !!selectedDuration || activeCategory !== 'all';

  const clearFilters = () => {
    setSelectedDests([]);
    setSelectedTags([]);
    setSelectedDuration('');
    setActiveCategory('all');
  };

  const toggleDest = (dest: string) =>
    setSelectedDests(prev => prev.includes(dest) ? prev.filter(d => d !== dest) : [...prev, dest]);

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const toggleCountry = (country: string) =>
    setExpandedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );

  const toggleAllCountry = (country: string) => {
    const subs = DESTINATION_GROUPS[country as keyof typeof DESTINATION_GROUPS];
    const allSelected = subs.every(s => selectedDests.includes(s));
    if (allSelected) {
      setSelectedDests(prev => prev.filter(d => !subs.includes(d)));
    } else {
      setSelectedDests(prev => [...new Set([...prev, ...subs])]);
    }
  };

  const activeFilterCount =
    selectedDests.length +
    selectedTags.length +
    (selectedDuration ? 1 : 0) +
    (activeCategory !== 'all' ? 1 : 0);

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

          {/* Кнопка фильтра */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-foreground hover:border-primary/40'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t.toursPage.filtersToggle}
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-primary hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> {t.toursPage.clearAll}
              </button>
            )}
          </div>

          {/* Панель фильтров */}
          {showFilters && (
            <div className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-6">

              {/* Tour Type */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tour Type</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveCategory(tab.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        activeCategory === tab.key
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border text-foreground hover:border-primary/50 hover:text-primary'
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Destination</p>
                <div className="space-y-2">
                  {(Object.keys(DESTINATION_GROUPS) as (keyof typeof DESTINATION_GROUPS)[]).map(country => {
                    const subs = DESTINATION_GROUPS[country];
                    const allSelected = subs.every(s => selectedDests.includes(s));
                    const someSelected = subs.some(s => selectedDests.includes(s));
                    const isExpanded = expandedCountries.includes(country);
                    return (
                      <div key={country} className="border border-border rounded-xl overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                            onChange={() => toggleAllCountry(country)}
                            className="rounded accent-primary w-4 h-4"
                          />
                          <span className="text-sm font-semibold text-foreground flex-1">{country}</span>
                          <button onClick={() => toggleCountry(country)} className="text-muted-foreground hover:text-foreground p-1">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="px-4 py-2 grid grid-cols-2 md:grid-cols-3 gap-1">
                            {subs.map(sub => (
                              <label key={sub} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedDests.includes(sub)}
                                  onChange={() => toggleDest(sub)}
                                  className="rounded accent-primary w-3.5 h-3.5 flex-shrink-0"
                                />
                                <span className="text-sm text-foreground">{sub}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {selectedDests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedDests.map(d => (
                      <span key={d} className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {d}
                        <button onClick={() => toggleDest(d)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity Type */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Activity Type</p>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button key={tag.key} onClick={() => toggleTag(tag.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selectedTags.includes(tag.key)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border text-foreground hover:border-primary/50 hover:text-primary'
                      }`}>
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Duration</p>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map(d => (
                    <button key={d.key} onClick={() => setSelectedDuration(selectedDuration === d.key ? '' : d.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selectedDuration === d.key
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border text-foreground hover:border-primary/50 hover:text-primary'
                      }`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Туры */}
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
                  isEvent={tour.isEvent}
                  difficulty={tour.difficulty}
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