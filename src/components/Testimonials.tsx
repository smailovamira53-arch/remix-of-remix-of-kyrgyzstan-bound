import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { useLanguage } from '@/i18n/LanguageContext';

const testimonials = [
  { name: 'Sarah Mitchell', location: 'United States', avatar: 'SM', rating: 5, text: 'The Song-Kul overnight experience was absolutely magical. Waking up in a yurt with horses grazing outside and the sunrise over the lake – it\'s a memory I\'ll cherish forever.', tour: '10-Day Silk Road Explorer' },
  { name: 'Thomas Bergmann', location: 'Germany', avatar: 'TB', rating: 5, text: 'Incredibly well-organized tour with knowledgeable guides. The Jeti-Oguz horse trek exceeded all expectations. The landscapes are simply otherworldly!', tour: 'Horse Trekking Adventure' },
  { name: 'Yuki Tanaka', location: 'Japan', avatar: 'YT', rating: 5, text: 'Kyrgyzstan was not on my radar until a friend recommended this tour. Now it\'s my favorite travel destination. The hospitality and natural beauty are unmatched.', tour: '7-Day Issyk-Kul Adventure' },
];

export const Testimonials = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <SectionHeader subtitle={t.testimonials.subtitle} title={t.testimonials.title} description={t.testimonials.description} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }} className="bg-card rounded-2xl p-6 border border-border/50 relative">
              <div className="absolute -top-4 right-6 w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Quote className="w-4 h-4 text-primary-foreground" /></div>
              <div className="flex gap-1 mb-4">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-secondary text-secondary" />))}</div>
              <p className="text-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
              <p className="text-xs text-primary font-medium bg-primary/10 inline-block px-3 py-1 rounded-full mb-4">{testimonial.tour}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium text-foreground">{testimonial.avatar}</div>
                <div><p className="font-medium text-foreground">{testimonial.name}</p><p className="text-sm text-muted-foreground">{testimonial.location}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
