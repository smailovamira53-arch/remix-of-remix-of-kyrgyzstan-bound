import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TourCard } from '@/components/TourCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTours, getLocalizedField } from '@/hooks/useTours';

const SearchResultsPage = () => {
  const [params] = useSearchParams();
  const { t, language } = useLanguage();

  // ── Параметры из строки запроса ───────────────────────────────────────────
  // Пример URL: /search?destinations=bishkek,osh&adults=2&children=1
  const selectedDests = params.get('destinations')?.split(',').filter(Boolean) || [];
  const adults        = Number(params.get('adults')   || 2);
  const children      = Number(params.get('children') || 0);
  const totalTravelers = adults + children;

  // ── Загружаем ВСЕ активные туры из Supabase ───────────────────────────────
  const { data: allTours, isLoading, error } = useTours();

  // ── Фильтрация на клиенте ─────────────────────────────────────────────────
  const results = useMemo(() => {
    let tours = allTours;

    // 1. Фильтр по направлению (ищем в title, description на языке пользователя)
    if (selectedDests.length > 0) {
      const destsLower = selectedDests.map((d) => d.toLowerCase().trim());
      tours = tours.filter((tour) => {
        const title = getLocalizedField(tour, 'title', language).toLowerCase();
        const desc  = getLocalizedField(tour, 'description', language).toLowerCase();
        const cat   = (tour.category || '').toLowerCase();
        const tags  = (tour.tags || '').toLowerCase();
        return destsLower.some(
          (d) => title.includes(d) || desc.includes(d) || cat.includes(d) || tags.includes(d)
        );
      });
    }

    // 2. Фильтр по размеру группы
    tours = tours.filter((tour) => totalTravelers <= (tour.max_people || 99));

    return tours;
  }, [allTours, selectedDests, totalTravelers, language]);

  // ── Рендер ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="container-custom">

          {/* Кнопка назад */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.common?.backToHome || 'Back to Home'}
          </Link>

          {/* Заголовок */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t.searchResults?.title || 'Search Results'}
          </h1>

          {/* Подзаголовок с параметрами поиска */}
          <p className="text-muted-foreground mb-8">
            {selectedDests.length > 0 && (
              <span>{t.searchResults?.destinations || 'Destinations'}: {selectedDests.join(', ')} · </span>
            )}
            {adults} {adults === 1
              ? (t.searchResults?.adult  || 'adult')
              : (t.searchResults?.adults || 'adults')}
            {children > 0 && (
              <>, {children} {children === 1
                ? (t.searchResults?.child    || 'child')
                : (t.searchResults?.children || 'children')}
              </>
            )}
            {' · '}
            {isLoading
              ? (t.searchResults?.searching || 'Searching...')
              : `${results.length} ${results.length === 1
                  ? (t.searchResults?.tourFound  || 'tour found')
                  : (t.searchResults?.toursFound || 'tours found')}`
            }
          </p>

          {/* Состояние загрузки */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl bg-muted animate-pulse h-80"
                />
              ))}
            </div>
          )}

          {/* Ошибка */}
          {!isLoading && error && (
            <div className="text-center py-16">
              <p className="text-lg text-destructive mb-4">
                {t.searchResults?.error || 'Something went wrong. Please try again.'}
              </p>
              <Link to="/">
                <Button>{t.searchResults?.browseAll || 'Browse All Tours'}</Button>
              </Link>
            </div>
          )}

          {/* Результаты */}
          {!isLoading && !error && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((tour) => (
                <TourCard
                  key={tour.id}
                  image={tour.image_url || ''}
                  title={getLocalizedField(tour, 'title', language)}
                  location={tour.category}
                  duration={tour.duration}
                  price={tour.price}
                  rating={4.8}
                  reviewCount={0}
                  description={getLocalizedField(tour, 'description', language)}
                  slug={tour.slug}
                  maxGroup={tour.max_people}
                  featured={tour.is_featured}
                />
              ))}
            </div>
          )}

          {/* Ничего не найдено */}
          {!isLoading && !error && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-2">
                {t.searchResults?.noResults || 'No tours match your criteria.'}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {t.searchResults?.tryAdjusting || 'Try adjusting your filters or explore all tours.'}
              </p>
              <Link to="/tours">
                <Button>{t.searchResults?.browseAll || 'Browse All Tours'}</Button>
              </Link>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;