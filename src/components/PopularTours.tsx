import { TourCard } from './TourCard';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

import tourYurtCamp from '@/assets/tour-yurt-camp.jpg';
import tourHorseTrek from '@/assets/tour-horse-trek.jpg';
import tourSongKul from '@/assets/tour-song-kul.jpg';

export const PopularTours = () => {
  const { t } = useLanguage();

  const tours = [
    { 
      image: tourYurtCamp, 
      title: t.tours.issykKulAdventure.title, 
      location: t.tours.issykKulAdventure.location, 
      duration: t.tours.issykKulAdventure.duration, 
      description: "Explore pristine Issyk-Kul lake, mountains, yurts and nomadic life.",
      slug: "issyk-kul-adventure",
      price: 890, 
      rating: 4.9, 
      reviewCount: 127, 
      featured: true 
    },
    { 
      image: tourHorseTrek, 
      title: t.tours.horseTrekking.title, 
      location: t.tours.horseTrekking.location, 
      duration: t.tours.horseTrekking.duration, 
      description: "Ride through stunning red canyons of Jeti-Oguz with traditional Kyrgyz lunch.",
      slug: "jeti-oguz-horse-trek",
      price: 450, 
      rating: 4.8, 
      reviewCount: 89 
    },
    { 
      image: tourSongKul, 
      title: t.newTours.songKolKarakol.title, 
      location: t.newTours.songKolKarakol.location, 
      duration: t.newTours.songKolKarakol.duration, 
      description: t.newTours.songKolKarakol.description,
      slug: "song-kol-karakol-weekly",
      price: 450, 
      rating: 4.9, 
      reviewCount: 64
    },
    { 
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop", 
      title: t.newTours.almatyBishkek.title, 
      location: t.newTours.almatyBishkek.location, 
      duration: t.newTours.almatyBishkek.duration, 
      description: t.newTours.almatyBishkek.description,
      slug: "almaty-bishkek-adventure",
      price: 990, 
      rating: 4.8, 
      reviewCount: 45,
      featured: true
    },
    { 
      image: tourHorseTrek, 
      title: t.newTours.horsebackSongKol.title, 
      location: t.newTours.horsebackSongKol.location, 
      duration: t.newTours.horsebackSongKol.duration, 
      description: t.newTours.horsebackSongKol.description,
      slug: "horseback-song-kol-3day",
      price: 220, 
      rating: 4.7, 
      reviewCount: 38
    },
  ];

  return (
    <section className="section-padding bg-snow">
      <div className="container-custom">
        <SectionHeader subtitle={t.popularTours.subtitle} title={t.popularTours.title} description={t.popularTours.description} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tours.map((tour) => (<TourCard key={tour.slug} {...tour} />))}
        </div>
        <div className="text-center">
          <Button size="lg" variant="outline" className="gap-2">{t.popularTours.viewAll}<ArrowRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </section>
  );
};

