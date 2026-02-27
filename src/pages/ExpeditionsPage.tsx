import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, Shield, Mountain, Award, FileCheck, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingFormModal } from '@/components/BookingFormModal';

interface Expedition {
  slug: string;
  image: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  priceLabel: string;
  rating: number;
  reviewCount: number;
  difficulty: string;
  maxGroup: number;
  description: string;
}

const expeditions: Expedition[] = [
  {
    slug: 'peak-lenin-base-camp',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    title: 'Peak Lenin Base Camp Expedition',
    location: 'Pamir-Alay, Osh Region',
    duration: '21 Days',
    price: 2500,
    priceLabel: 'From $2,500',
    rating: 4.9,
    reviewCount: 34,
    difficulty: 'Hard',
    maxGroup: 8,
    description: 'Trek to the base camp of Peak Lenin (7,134m), one of the most accessible 7,000m peaks in the world. Acclimatization hikes, glacier crossings, and breathtaking Pamir views.',
  },
  {
    slug: 'khan-tengri-summit',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    title: 'Khan Tengri Summit Climb',
    location: 'Central Tien Shan',
    duration: '18 Days',
    price: 3500,
    priceLabel: 'From $3,500',
    rating: 4.8,
    reviewCount: 18,
    difficulty: 'Expert',
    maxGroup: 6,
    description: 'Attempt the stunning marble pyramid of Khan Tengri (7,010m). Technical ice and snow climbing with experienced high-altitude guides. Helicopter access to base camp.',
  },
  {
    slug: 'tien-shan-heli-trek',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=600&fit=crop',
    title: 'Tien Shan Helicopter + Trek Combo',
    location: 'Inylchek Glacier',
    duration: '7 Days',
    price: 1800,
    priceLabel: 'From $1,800',
    rating: 5.0,
    reviewCount: 22,
    difficulty: 'Moderate',
    maxGroup: 10,
    description: 'Fly by helicopter deep into the Tien Shan range, then trek through pristine glacial valleys. Witness the Southern Inylchek Glacier and Merzbacher Lake up close.',
  },
  {
    slug: 'ala-too-mountaineering',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop',
    title: 'Ala-Too Range Multi-Day Mountaineering',
    location: 'Kyrgyz Ala-Too, Bishkek',
    duration: '10 Days',
    price: 1200,
    priceLabel: 'From $1,200',
    rating: 4.7,
    reviewCount: 41,
    difficulty: 'Hard',
    maxGroup: 8,
    description: 'Climb multiple peaks in the Kyrgyz Ala-Too range right above Bishkek. Technical rope work, glacier travel, and summit attempts with panoramic views.',
  },
  {
    slug: 'pamir-highway-expedition',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=600&fit=crop',
    title: 'Pamir Highway Overland Expedition',
    location: 'Osh – Pamir – Dushanbe',
    duration: '14 Days',
    price: 2200,
    priceLabel: 'From $2,200',
    rating: 4.9,
    reviewCount: 27,
    difficulty: 'Moderate',
    maxGroup: 10,
    description: 'Drive the legendary Pamir Highway — the second-highest international road in the world. Remote villages, high passes over 4,600m, and raw Central Asian wilderness.',
  },
];

const whyChoose = [
  { icon: Users, title: 'Professional Guides', description: 'Certified mountaineers with 10+ years of high-altitude experience in the Tien Shan and Pamir ranges.' },
  { icon: Shield, title: 'Safety First', description: 'Comprehensive safety protocols, satellite communication, medical kits, and evacuation plans on every expedition.' },
  { icon: Mountain, title: 'Small Groups', description: 'Maximum 6–10 participants per expedition for personalized attention and minimal environmental impact.' },
  { icon: FileCheck, title: 'All Permits Included', description: 'Border zone permits, national park fees, and all bureaucratic paperwork handled by our team.' },
];

const difficultyColor = (d: string) => {
  if (d === 'Expert') return 'bg-destructive/10 text-destructive';
  if (d === 'Hard') return 'bg-orange-100 text-orange-700';
  return 'bg-primary/10 text-primary';
};

const ExpeditionsPage = () => {
  const [booking, setBooking] = useState<{ title: string; price: number } | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&h=900&fit=crop"
          alt="Extreme expeditions in Kyrgyzstan mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-foreground/40 to-foreground/20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <span className="inline-block px-4 py-1.5 bg-destructive/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6 border border-white/20">
            🏔️ For Real Adventurers
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
            Extreme Expeditions in Kyrgyzstan
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            High peaks, technical climbs, remote wilderness — push your limits in the heart of Central Asia
          </p>
        </motion.div>
      </section>

      {/* Expedition Cards */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">Our Expeditions</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Choose your challenge — from moderate treks to expert-level summit attempts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expeditions.map((exp, index) => (
              <motion.div
                key={exp.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full ${difficultyColor(exp.difficulty)}`}>
                    {exp.difficulty}
                  </span>
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                    <span className="text-xs font-medium text-foreground">{exp.rating}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{exp.description}</p>

                  <div className="flex items-center gap-3 text-muted-foreground text-sm mb-4">
                    <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /><span>{exp.duration}</span></div>
                    <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /><span>Max {exp.maxGroup}</span></div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="text-xl font-bold text-foreground">${exp.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/expeditions/${exp.slug}`}>Details</Link>
                      </Button>
                      <Button size="sm" onClick={() => setBooking({ title: exp.title, price: exp.price })}>
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">Why Choose Our Expeditions</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">We combine world-class mountaineering expertise with deep local knowledge</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 text-center border border-border/50 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">Ready for the Challenge?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">Contact us to discuss your expedition goals — we'll build a custom plan for your team.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact" className="gap-2">Get in Touch <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {booking && (
        <BookingFormModal open={!!booking} onClose={() => setBooking(null)} tourTitle={booking.title} tourPrice={booking.price} />
      )}
    </div>
  );
};

export default ExpeditionsPage;
