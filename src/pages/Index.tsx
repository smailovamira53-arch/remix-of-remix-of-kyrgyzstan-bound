import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { PopularTours } from '@/components/PopularTours';
import { Excursions } from '@/components/Excursions';
import { AdventurePass } from '@/components/AdventurePass';
import { Activities } from '@/components/Activities';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <PopularTours />
      <Excursions />
      <AdventurePass />
      <Activities />
      <Testimonials />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
