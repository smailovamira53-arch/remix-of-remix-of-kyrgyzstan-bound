import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeroSearchForm } from '@/components/HeroSearchForm';
import { useLanguage } from '@/i18n/LanguageContext';
import heroImage from '@/assets/hero-issyk-kul.jpg';
import tourSongKul from '@/assets/tour-song-kul.jpg';
import tourHorseTrek from '@/assets/tour-horse-trek.jpg';
import tourYurtCamp from '@/assets/tour-yurt-camp.jpg';
import tourAlaArcha from '@/assets/tour-ala-archa.jpg';

const slideImages = [heroImage, tourSongKul, heroImage, tourYurtCamp, tourHorseTrek];

export const Hero = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const slides = [
    { image: slideImages[0], title: t.heroSlides?.slide1 || 'Kyrgyzstan: Feel the Air of Nomads' },
    { image: slideImages[1], title: t.heroSlides?.slide2 || 'Discover Ancient Nomadic Culture' },
    { image: slideImages[2], title: t.heroSlides?.slide3 || 'Pristine Alpine Lakes & Adventures' },
    { image: slideImages[3], title: t.heroSlides?.slide4 || 'Join World Nomad Games 2026 – September in Cholpon-Ata!' },
    { image: slideImages[4], title: t.heroSlides?.slide5 || 'Epic Treks & Horseback Journeys' },
  ];

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow background */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="hero-gradient absolute inset-0" />
          <div className="absolute inset-0 bg-foreground/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container-custom text-center pt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-sm text-primary-foreground text-sm font-medium rounded-full mb-6 border border-primary-foreground/20">
            {t.hero.badge}
          </span>

          {/* Animated slide title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 leading-tight"
            >
              {slides[current].title}
            </motion.h1>
          </AnimatePresence>

          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">{t.hero.description}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="hero" size="xl">{t.hero.exploreTours}</Button>
            <Button variant="heroOutline" size="xl">{t.hero.planTrip}</Button>
          </div>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-primary-foreground w-8' : 'bg-primary-foreground/40'}`}
            />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="max-w-4xl mx-auto">
          <HeroSearchForm />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
          {[
            { value: '500+', label: t.hero.stats.travelers },
            { value: '50+', label: t.hero.stats.tours },
            { value: '4.9', label: t.hero.stats.rating },
            { value: '10+', label: t.hero.stats.experience },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
        </div>
      </motion.div>
    </section>
  );
};
