import { GuideCard } from './GuideCard';
import { SectionHeader } from './SectionHeader';
import { useLanguage } from '@/i18n/LanguageContext';

export const Guides = () => {
  const { t } = useLanguage();

  const guides = [
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      name: t.guides?.askar?.name || 'Askar',
      specialties: t.guides?.askar?.specialties || ['Horseback', 'Trekking'],
      languages: ['EN', 'RU', 'KY'],
      dailyRate: 50,
      rating: 4.9,
      reviewCount: 87,
      bio: t.guides?.askar?.bio || 'Expert horseback guide with 15 years of mountain experience.',
    },
    {
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      name: t.guides?.aida?.name || 'Aida',
      specialties: t.guides?.aida?.specialties || ['Cultural Tours', 'City Tours'],
      languages: ['EN', 'FR', 'RU'],
      dailyRate: 40,
      rating: 4.8,
      reviewCount: 124,
      bio: t.guides?.aida?.bio || 'Bishkek & Osh expert with deep cultural knowledge.',
    },
    {
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      name: t.guides?.nurlan?.name || 'Nurlan',
      specialties: t.guides?.nurlan?.specialties || ['Mountain Climbing', 'Pamir'],
      languages: ['EN', 'ES', 'RU'],
      dailyRate: 60,
      rating: 5.0,
      reviewCount: 56,
      bio: t.guides?.nurlan?.bio || 'Certified mountaineer specializing in Pamir expeditions.',
    },
    {
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      name: t.guides?.gulnara?.name || 'Gulnara',
      specialties: t.guides?.gulnara?.specialties || ['Photography', 'Nature'],
      languages: ['EN', 'DE', 'RU'],
      dailyRate: 55,
      rating: 4.9,
      reviewCount: 93,
      bio: t.guides?.gulnara?.bio || 'Professional photographer guiding scenic tours.',
    },
    {
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      name: t.guides?.bakyt?.name || 'Bakyt',
      specialties: t.guides?.bakyt?.specialties || ['Yurt Stays', 'Nomadic Life'],
      languages: ['EN', 'RU', 'KY'],
      dailyRate: 45,
      rating: 4.7,
      reviewCount: 78,
      bio: t.guides?.bakyt?.bio || 'Expert in nomadic traditions and yurt camping.',
    },
    {
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      name: t.guides?.aizhan?.name || 'Aizhan',
      specialties: t.guides?.aizhan?.specialties || ['Skiing', 'Winter Tours'],
      languages: ['EN', 'RU', 'FR'],
      dailyRate: 65,
      rating: 4.8,
      reviewCount: 42,
      bio: t.guides?.aizhan?.bio || 'Winter sports specialist and ski instructor.',
    },
    {
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      name: t.guides?.marat?.name || 'Marat',
      specialties: t.guides?.marat?.specialties || ['Off-road', '4x4 Tours'],
      languages: ['EN', 'RU', 'TR'],
      dailyRate: 70,
      rating: 4.9,
      reviewCount: 65,
      bio: t.guides?.marat?.bio || 'Off-road expert for remote mountain destinations.',
    },
    {
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      name: t.guides?.dinara?.name || 'Dinara',
      specialties: t.guides?.dinara?.specialties || ['Gastronomy', 'Cooking'],
      languages: ['EN', 'RU', 'IT'],
      dailyRate: 50,
      rating: 4.8,
      reviewCount: 89,
      bio: t.guides?.dinara?.bio || 'Culinary guide offering traditional food experiences.',
    },
    {
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
      name: t.guides?.timur?.name || 'Timur',
      specialties: t.guides?.timur?.specialties || ['Biking', 'Cycling'],
      languages: ['EN', 'RU', 'DE'],
      dailyRate: 55,
      rating: 4.7,
      reviewCount: 51,
      bio: t.guides?.timur?.bio || 'Mountain biking expert for all skill levels.',
    },
    {
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      name: t.guides?.cholpon?.name || 'Cholpon',
      specialties: t.guides?.cholpon?.specialties || ['Family Tours', 'Kids'],
      languages: ['EN', 'RU', 'KY'],
      dailyRate: 45,
      rating: 5.0,
      reviewCount: 72,
      bio: t.guides?.cholpon?.bio || 'Specialized in family-friendly adventures.',
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <SectionHeader 
          subtitle={t.guides?.subtitle || 'Our Guides'} 
          title={t.guides?.title || 'Meet Your Expert Guides'} 
          description={t.guides?.description || 'Our certified local guides bring years of experience and passion to make your adventure unforgettable.'} 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {guides.map((guide) => (<GuideCard key={guide.name} {...guide} />))}
        </div>
      </div>
    </section>
  );
};
