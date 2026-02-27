import { motion } from 'framer-motion';
import { Clock, MapPin, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';

interface TourCardProps {
  image: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  description?: string;
  slug?: string;
  maxGroup?: number;
  featured?: boolean;
}

export const TourCard = ({ image, title, location, duration, price, rating, reviewCount, description, slug, maxGroup = 12, featured = false }: TourCardProps) => {
  const { t } = useLanguage();
  const tourLink = slug ? `/tours/${slug}` : '/tours';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.5 }} 
      whileHover={{ scale: 1.03, y: -8 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
    >
      <div className="relative h-56 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {featured && (<span className="absolute top-4 left-4 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">{t.tourCard.featured}</span>)}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-primary-foreground"><Users className="w-4 h-4" /><span className="text-sm">{t.tourCard.maxPeople.replace('{count}', String(maxGroup))}</span></div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-muted-foreground text-sm"><MapPin className="w-3.5 h-3.5" /><span>{location}</span></div>
          <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-secondary text-secondary" /><span className="text-sm font-medium text-foreground">{rating}</span><span className="text-xs text-muted-foreground">({reviewCount})</span></div>
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4"><Clock className="w-3.5 h-3.5" /><span>{duration}</span></div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div><p className="text-xs text-muted-foreground">{t.tourCard.from}</p><p className="text-xl font-bold text-foreground">${price}<span className="text-sm font-normal text-muted-foreground">{t.tourCard.perPerson}</span></p></div>
          <Button size="sm" asChild><Link to={tourLink}>{t.tourCard.viewDetails}</Link></Button>
        </div>
      </div>
    </motion.div>
  );
};
