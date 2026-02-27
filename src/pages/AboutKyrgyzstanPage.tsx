import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import { 
  Mountain, Users, MapPin, Snowflake, Tent, Route, Leaf, 
  Trophy, Globe, UtensilsCrossed 
} from 'lucide-react';

const FACT_KEYS = ['population', 'capital', 'leninPeak', 'issykKul', 'yurtCulture', 'silkRoad', 'plantSpecies', 'nomadGames', 'visaFree', 'cuisine'] as const;
const FACT_ICONS = [Users, MapPin, Mountain, Snowflake, Tent, Route, Leaf, Trophy, Globe, UtensilsCrossed];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AboutKyrgyzstanPage = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            {t.aboutKyrgyzstan.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-primary-foreground/80 text-lg max-w-2xl mx-auto"
          >
            {t.aboutKyrgyzstan.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Facts Grid */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FACT_KEYS.map((key, index) => {
              const fact = t.aboutKyrgyzstan.facts[key];
              const Icon = FACT_ICONS[index];
              return (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  className="bg-card rounded-xl p-6 shadow-sm border border-border card-hover"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{fact.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{fact.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default AboutKyrgyzstanPage;