import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { useLanguage } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Shield,
  Car,
  Banknote,
  Heart,
  Stethoscope,
} from 'lucide-react';

const TravelTipsPage = () => {
  const { t, isRTL } = useLanguage();

  const sections = [
    {
      id: 'visa',
      icon: FileText,
      title: t.travelTips.visa.title,
      items: t.travelTips.visa.items,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'safety',
      icon: Shield,
      title: t.travelTips.safety.title,
      items: t.travelTips.safety.items,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      id: 'transport',
      icon: Car,
      title: t.travelTips.transport.title,
      items: t.travelTips.transport.items,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      id: 'currency',
      icon: Banknote,
      title: t.travelTips.currency.title,
      items: t.travelTips.currency.items,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      id: 'culture',
      icon: Heart,
      title: t.travelTips.culture.title,
      items: t.travelTips.culture.items,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      id: 'health',
      icon: Stethoscope,
      title: t.travelTips.health.title,
      items: t.travelTips.health.items,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-primary/5 py-16 md:py-24">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                FAQ
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                {t.travelTips.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.travelTips.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* FAQ Sections */}
        <section className="py-16 md:py-24">
          <div className="container-custom max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={section.id}
                    className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="py-5 hover:no-underline">
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`p-3 rounded-lg ${section.bg}`}>
                          <section.icon className={`w-6 h-6 ${section.color}`} />
                        </div>
                        <span className="font-display text-lg md:text-xl font-semibold text-foreground text-left">
                          {section.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <Separator className="mb-4" />
                      <ul className={`space-y-3 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                        {section.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className={`flex items-start gap-3 text-muted-foreground ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                          >
                            <span className={`mt-2 w-1.5 h-1.5 rounded-full ${section.bg.replace('50', '500')} flex-shrink-0`} 
                                  style={{ backgroundColor: `var(--${section.color.split('-')[1]}-500, currentColor)` }} />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default TravelTipsPage;
