import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Mountain, Waves, Tent, Home, Building, TreePine, Sparkles, Phone, BadgePercent, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { accommodationsData, AccommodationType } from '@/data/accommodationsData';
import { useLanguage } from '@/i18n/LanguageContext';

const REGIONS = ['All', 'Issyk-Kul', 'Naryn', 'Bishkek', 'Jalal-Abad'];

const amenityIcon = (a: string) => {
  const lower = a.toLowerCase();
  if (lower.includes('wifi')) return Wifi;
  if (lower.includes('breakfast') || lower.includes('meals') || lower.includes('coffee') || lower.includes('gourmet')) return Coffee;
  if (lower.includes('mountain') || lower.includes('view') || lower.includes('hiking')) return Mountain;
  if (lower.includes('beach') || lower.includes('pool') || lower.includes('lake') || lower.includes('hot spring') || lower.includes('spa') || lower.includes('shower')) return Waves;
  return Sparkles;
};

const AccommodationsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState<AccommodationType | 'all'>('all');
  const { t, isRTL } = useLanguage();

  const TYPES: { key: AccommodationType | 'all'; label: string; icon: typeof Building }[] = [
    { key: 'all', label: t.accommodations.filters.allTypes, icon: Building },
    { key: 'hotel', label: t.accommodations.filters.hotels, icon: Building },
    { key: 'yurt', label: t.accommodations.filters.yurtCamps, icon: Tent },
    { key: 'guesthouse', label: t.accommodations.filters.guesthouses, icon: Home },
    { key: 'resort', label: t.accommodations.filters.resorts, icon: Waves },
    { key: 'eco-lodge', label: t.accommodations.filters.ecoLodges, icon: TreePine },
  ];

  const filtered = useMemo(() => {
    return accommodationsData.filter(acc => {
      if (selectedRegion !== 'All' && acc.region !== selectedRegion) return false;
      if (selectedType !== 'all' && acc.type !== selectedType) return false;
      return true;
    });
  }, [selectedRegion, selectedType]);

  const perks = [
    { icon: BadgePercent, text: t.accommodations.perks.discount },
    { icon: Plane, text: t.accommodations.perks.transfer },
    { icon: Phone, text: t.accommodations.perks.support },
    { icon: Sparkles, text: t.accommodations.perks.bestPrice },
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Hero */}
      <section className="relative h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&h=900&fit=crop"
          alt="Accommodation in Kyrgyzstan — lakes, mountains, yurts"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-foreground/40 to-foreground/20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6 border border-white/20">
            {t.accommodations.heroBadge}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
            {t.accommodations.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            {t.accommodations.heroSubtitle}
          </p>
        </motion.div>
      </section>

      {/* Marketing Block */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-custom py-10 md:py-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold mb-4">
                {t.accommodations.marketingTitle}
              </h2>
              <p className="text-primary-foreground/85 leading-relaxed">
                {t.accommodations.marketingDescription}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {perks.map(perk => {
                const Icon = perk.icon;
                return (
                  <div key={perk.text} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-primary-foreground/90">{perk.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <div>
              <p className="text-sm text-muted-foreground mb-2 font-medium">{t.accommodations.filters.region}</p>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all duration-200 ${
                      selectedRegion === r
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {r === 'All' ? t.accommodations.filters.all : r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2 font-medium">{t.accommodations.filters.type}</p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map(tp => {
                  const Icon = tp.icon;
                  return (
                    <button
                      key={tp.key}
                      onClick={() => setSelectedType(tp.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border-2 transition-all duration-200 ${
                        selectedType === tp.key
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tp.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            {filtered.length} {filtered.length !== 1
              ? (t.accommodations.propertiesFound || '').replace('{count}', '')
              : (t.accommodations.propertyFound || '').replace('{count}', '')}
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((acc, index) => (
              <motion.div
                key={acc.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={acc.image} alt={acc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} flex items-center gap-1 bg-background/85 backdrop-blur-sm px-2 py-1 rounded-full`}>
                    <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                    <span className="text-xs font-semibold text-foreground">{acc.rating}</span>
                    <span className="text-xs text-muted-foreground">({acc.reviewCount})</span>
                  </div>
                  <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} px-2.5 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full capitalize`}>
                    {acc.type === 'eco-lodge' ? (t.accommodations.filters.ecoLodges || 'Eco Lodge') : acc.type}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1.5">
                    <MapPin className="w-3 h-3" />
                    <span>{acc.location}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {acc.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{acc.shortDescription}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {acc.amenities.slice(0, 3).map(a => {
                      const Icon = amenityIcon(a);
                      return (
                        <span key={a} className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                          <Icon className="w-3 h-3" />{a}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.common.from}</p>
                      <p className="text-lg font-bold text-foreground">${acc.pricePerNight}<span className="text-xs font-normal text-muted-foreground">{t.common.perNight}</span></p>
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/accommodations/${acc.slug}`}>{t.accommodations.bookSave}</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">{t.accommodations.noResults}</p>
              <Button onClick={() => { setSelectedRegion('All'); setSelectedType('all'); }}>{t.common.clearFilters}</Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AccommodationsPage;