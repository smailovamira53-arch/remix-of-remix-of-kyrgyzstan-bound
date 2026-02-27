import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { motion } from 'framer-motion';
import { 
  Mountain, Users, MapPin, Snowflake, Tent, Route, Leaf, 
  Trophy, Globe, UtensilsCrossed 
} from 'lucide-react';

const facts = [
  {
    icon: Users,
    title: 'Population',
    description: 'Home to approximately 7 million people, a vibrant mix of Kyrgyz, Uzbek, Russian, and other ethnicities sharing a rich cultural tapestry.',
  },
  {
    icon: MapPin,
    title: 'Capital City',
    description: 'Bishkek — a leafy, modern capital at the foot of the Tien Shan mountains, blending Soviet-era architecture with buzzing bazaars and cafés.',
  },
  {
    icon: Mountain,
    title: 'Lenin Peak — 7,134 m',
    description: 'One of the highest peaks in Central Asia, Lenin Peak draws mountaineers from around the world to its challenging yet accessible summit.',
  },
  {
    icon: Snowflake,
    title: 'Issyk-Kul Never Freezes',
    description: 'The world\'s second-largest alpine lake never freezes despite harsh winters — its name means "warm lake" in Kyrgyz. A natural wonder at 1,607 m altitude.',
  },
  {
    icon: Tent,
    title: 'Nomadic Yurt Culture',
    description: 'Kyrgyz people have lived in portable felt yurts for millennia. Today you can stay in traditional yurt camps and experience genuine nomadic hospitality.',
  },
  {
    icon: Route,
    title: 'Ancient Silk Road',
    description: 'Kyrgyzstan was a key corridor of the Great Silk Road. Caravanserais, petroglyphs, and the Burana Tower still echo centuries of trade and cultural exchange.',
  },
  {
    icon: Leaf,
    title: '4,000+ Plant Species',
    description: 'From walnut forests — the largest natural ones on Earth — to alpine meadows bursting with wildflowers, Kyrgyzstan is a biodiversity hotspot.',
  },
  {
    icon: Trophy,
    title: 'World Nomad Games 2026',
    description: 'Cholpon-Ata hosts the World Nomad Games in September 2026 — an epic celebration of traditional sports including horseback games, eagle hunting, and wrestling.',
  },
  {
    icon: Globe,
    title: 'Visa-Free for 60+ Countries',
    description: 'Citizens of over 60 countries enjoy visa-free entry for up to 60 days, making Kyrgyzstan one of the most accessible destinations in Central Asia.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Legendary Cuisine',
    description: 'Savor beshbarmak (hand-pulled noodles with horse meat), plov, manti, and kumis — fermented mare\'s milk considered the drink of warriors.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AboutKyrgyzstanPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            About Kyrgyzstan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-primary-foreground/80 text-lg max-w-2xl mx-auto"
          >
            Interesting facts about one of Central Asia's most spectacular and welcoming countries — updated for 2026.
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
            {facts.map((fact) => (
              <motion.div
                key={fact.title}
                variants={itemVariants}
                className="bg-card rounded-xl p-6 shadow-sm border border-border card-hover"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <fact.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{fact.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{fact.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default AboutKyrgyzstanPage;
