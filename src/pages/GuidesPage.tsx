import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Guides } from '@/components/Guides';
import { BackToTop } from '@/components/BackToTop';
import { useLanguage } from '@/i18n/LanguageContext';

const GuidesPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <div className="bg-primary/5 py-16">
          <div className="container-custom text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.guides?.pageTitle || 'Our Guides'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.guides?.pageDescription || 'Discover our team of certified local guides ready to show you the best of Kyrgyzstan.'}
            </p>
          </div>
        </div>
        <Guides />
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default GuidesPage;
