import { motion } from 'framer-motion';
import { Globe, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

interface GuideCardProps {
  image: string;
  name: string;
  specialties: string[];
  languages: string[];
  dailyRate: number;
  rating: number;
  reviewCount: number;
  bio?: string;
}

export const GuideCard = ({ image, name, specialties, languages, dailyRate, rating, reviewCount, bio }: GuideCardProps) => {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.5 }} 
      whileHover={{ scale: 1.02, y: -4 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
    >
      <div className="relative h-64 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display text-xl font-semibold text-white mb-1">{name}</h3>
          <div className="flex items-center gap-1 text-white/90">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-xs text-white/70">({reviewCount} {t.guides?.reviews || 'reviews'})</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {specialties.map((specialty, index) => (
            <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {specialty}
            </span>
          ))}
        </div>
        
        {bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{bio}</p>}
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <Globe className="w-4 h-4" />
          <span>{languages.join(' / ')}</span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-xl font-bold text-foreground">${dailyRate}</span>
            <span className="text-sm text-muted-foreground">/{t.guides?.perDay || 'day'}</span>
          </div>
          <Button size="sm">{t.guides?.bookGuide || 'Book Guide'}</Button>
        </div>
      </div>
    </motion.div>
  );
};
