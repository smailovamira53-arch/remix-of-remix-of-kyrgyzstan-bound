import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toursData } from '@/data/toursData';
import { TourCard } from '@/components/TourCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageContext';

const SearchResultsPage = () => {
  const [params] = useSearchParams();
  const { t } = useLanguage();

  const selectedDests = params.get('destinations')?.split(',') || [];
  const adults = Number(params.get('adults') || 2);
  const children = Number(params.get('children') || 0);
  const totalTravelers = adults + children;

  const filteredTours = useMemo(() => {
    if (selectedDests.length === 0) return toursData;

    const destsLower = selectedDests.map(d => d.toLowerCase());

    return toursData.filter(tour => {
      const loc = tour.location.toLowerCase();
      const title = tour.title.toLowerCase();
      const desc = tour.fullDescription.toLowerCase();
      return destsLower.some(d => loc.includes(d) || title.includes(d) || desc.includes(d));
    });
  }, [selectedDests]);

  // Filter by group size
  const results = filteredTours.filter(tour => totalTravelers <= tour.maxGroup);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="container-custom">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Search Results
          </h1>

          <p className="text-muted-foreground mb-8">
            {selectedDests.length > 0 && (
              <span>Destinations: {selectedDests.join(', ')} · </span>
            )}
            {adults} adult{adults > 1 ? 's' : ''}
            {children > 0 && `, ${children} child${children > 1 ? 'ren' : ''}`}
            {' '}· {results.length} tour{results.length !== 1 ? 's' : ''} found
          </p>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(tour => (
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
              <p className="text-lg text-muted-foreground mb-4">No tours match your criteria.</p>
              <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or explore all tours.</p>
              <Link to="/">
                <Button>Browse All Tours</Button>
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
