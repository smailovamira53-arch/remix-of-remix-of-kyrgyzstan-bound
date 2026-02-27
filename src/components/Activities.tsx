import { motion } from 'framer-motion';
import { Compass, Mountain, Snowflake, Tent, Camera, Bike } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { useLanguage } from '@/i18n/LanguageContext';

export const Activities = () => {
  const { t } = useLanguage();

  const activities = [
    { icon: Mountain, title: t.activities.trekking.title, description: t.activities.trekking.description, count: 24 },
    { icon: Compass, title: t.activities.horseRiding.title, description: t.activities.horseRiding.description, count: 18 },
    { icon: Snowflake, title: t.activities.paragliding.title, description: t.activities.paragliding.description, count: 10 },
    { icon: Tent, title: t.activities.yurtCamping.title, description: t.activities.yurtCamping.description, count: 15 },
    { icon: Camera, title: t.activities.photography.title, description: t.activities.photography.description, count: 8 },
    { icon: Bike, title: t.activities.biking.title, description: t.activities.biking.description, count: 12 },
  ];

  return (
    <section className="section-padding bg-sand">
      <div className="container-custom">
        <SectionHeader subtitle={t.activities.subtitle} title={t.activities.title} description={t.activities.description} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <motion.div key={activity.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group bg-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-border/50 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <activity.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{activity.title}</h3>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{t.activities.toursCount.replace('{count}', String(activity.count))}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{activity.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
