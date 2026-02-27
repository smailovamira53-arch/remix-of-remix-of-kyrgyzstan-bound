import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Star, Check, ChevronDown, Swords, Target, Trophy, Bird, Dog, Flame, Info, Sun, Backpack, Camera, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingFormModal } from '@/components/BookingFormModal';
import { TourGallery } from '@/components/TourGallery';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=800&fit=crop';

const programHighlights = [
  { icon: Swords, label: 'Equestrian Sports (Kok Boru, Races)' },
  { icon: Target, label: 'Archery & Mounted Archery' },
  { icon: Trophy, label: 'Traditional Wrestling (Alysh, Kurash)' },
  { icon: Bird, label: 'Falconry & Eagle Hunting (Burkut Saluu)' },
  { icon: Dog, label: 'Taigan Dog Races' },
  { icon: Flame, label: 'Nomadic Traditions & Ethno Village' },
];

const timeline = [
  { date: 'August 30', title: 'Day 1 — Arrival in Bishkek', description: 'Teams and officials arrive via Manas International Airport. Premium transport transfers to carefully selected hotels. 💡 Take an evening walk in the city center to feel Kyrgyzstan\'s vibe and capture your first memories.' },
  { date: 'August 31', title: 'Day 2 — Grand Opening Ceremony', description: 'A dynamic showcase celebrating the cultural heritage of all participating nations: music, dance, and traditional costumes. Our guides will share fascinating stories and highlight must-see moments. Experience the spirit of nomadic civilizations.' },
  { date: 'September 1', title: 'Day 3 — Move to Issyk-Kul', description: 'Comfortable premium bus transfer. Scenic stops along the way: Burana Tower, petroglyphs, picturesque canyons — perfect for photos. Check-in at lakeside resort or yurt-style lodge. 💡 Guides will point out the best photo angles.' },
  { date: 'September 2', title: 'Day 4 — Sports & Culture Begin', description: 'Sports: Kok Boru, Alysh, Toguz Korgool, Mangala, Tayak Tartysh. Culture: Opening of "Universe of Nomads" and International Scientific Conference. Ethno Village: Demonstrative games and cultural performances.' },
  { date: 'September 3', title: 'Day 5 — Festival Activities', description: 'Sports: Kok Boru, Kazakh Kuresi, Kyrgyz Kurosh, Armwrestling. Ethno Village: Ordo, Tug of War, Burkut Saluu (eagle hunting), Taigan Races, archery. 💡 Don\'t miss the eagle shows and interactive masterclasses!' },
  { date: 'September 4', title: 'Day 6 — Evening Continuation', description: 'Sports: Kok Boru, Kurash, Sambo, Toguz Korgool. Culture: Evening continuation of "Universe of Nomads" festival. Ethno Village: Ordo, Tug of War, mounted archery shows (Kyrgyz and Hungarian).' },
  { date: 'September 5', title: 'Day 7 — Final Events', description: 'Sports: Kok Boru, Er Enish, flat racing, Kunan Chabysh. Culture: Evening closing ceremony of "Universe of Nomads". Ethno Village: Strongman contests and interactive shows. 💡 This is the most dynamic day — keep your camera ready!' },
  { date: 'September 6', title: 'Day 8 — Closing Ceremony', description: 'Sports: Kok Boru, Er Enish, Jorgo Salysh, final horse races. "The Great Struggle of Nomads" — final combat shows. Official closing ceremony of the VI World Nomad Games. Celebration, festive atmosphere, and photos with participants.' },
  { date: 'September 7', title: 'Day 9 — Return to Bishkek', description: 'Comfortable premium transfer with a lunch stop along the way. Free time in Bishkek. Farewell dinner featuring local cuisine and sharing memories of the trip.' },
  { date: 'September 8', title: 'Day 10 — Departure', description: '✈ Fly home. Airport transfer for departure. End of tour.' },
];

const included = [
  'Accommodation (3–4★ or similar)',
  'Daily breakfasts / lunch / dinner',
  'All premium transfers',
  'English-speaking guide & coordination',
  'Event access & festival areas',
  'Water during the entire tour',
];

const notIncluded = [
  'International flights',
  'Visa fees',
  'Personal expenses',
];

const packingTips = [
  'Comfortable walking shoes (venues are large)',
  'Light jacket or windbreaker (cool evenings near the lake)',
  'Sunscreen & sunglasses (strong mountain sun)',
  'Hat or scarf (sun protection & cultural respect)',
  'Power bank / extra battery (long festival days)',
  'Reusable water bottle',
  'Small backpack or crossbody bag',
];

const optionalExperiences = [
  'VIP seating at key competitions',
  'Eagle handling & archery workshop',
  'Professional photo assistance',
  'Post-tour extensions (Karakol / Son-Kul)',
];

const NomadGamesPage = () => {
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dbTour, setDbTour] = useState<{ start_date: string | null; end_date: string | null; status: string; current_bookings: number } | null>(null);

  useEffect(() => {
    supabase
      .from('tours')
      .select('start_date, end_date, status, current_bookings')
      .eq('title', 'World Nomad Games 2026')
      .maybeSingle()
      .then(({ data }) => {
        if (data) setDbTour(data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={HERO_IMAGE} alt="World Nomad Games 2026 — nomadic culture and competitions" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-24 left-4 md:left-8">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
        </motion.div>
        <span className="absolute top-24 right-4 md:right-8 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full">🔥 Special Event</span>
      </div>

      {/* Content */}
      <div className="container-custom -mt-20 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /><span>Bishkek → Issyk-Kul</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /><span>10 Days / 9 Nights</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /><span>89+ Countries</span></div>
              </div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">World Nomad Games 2026 – Epic Nomadic Culture & Competitions</h1>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-foreground">August 30 – September 8, 2026</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">A global event with 89+ countries gathering in the breathtaking Tien Shan mountains and along the shores of Issyk-Kul Lake. Experience opening ceremonies, epic competitions, and a living cultural festival — more than sports, it's ethnic performances, live music, nomadic marketplaces, and national cuisine from across Central Asia.</p>
            </motion.div>

            {/* Who is it for */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Who Is It For?</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {['Cultural explorers', 'Adventure lovers', 'Photographers', 'Solo travelers & couples'].map((item) => (
                  <li key={item} className="flex items-start gap-3"><Check className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span className="text-muted-foreground">{item}</span></li>
                ))}
              </ul>
            </motion.div>

            {/* Why It Matters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Why It Matters</h2>
              <p className="text-muted-foreground leading-relaxed">More than sports — the World Nomad Games are a celebration of living heritage. Expect ethnic performances, live music from across Central Asia, bustling marketplaces with handcrafted goods, and authentic national cuisine. It's a once-in-a-lifetime cultural immersion.</p>
            </motion.div>

            {/* Program Highlights */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">Program Highlights</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {programHighlights.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <Icon className="w-6 h-6 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Day by Day Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">Day by Day</h2>
              <div className="space-y-3">
                {timeline.map((item, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">{index + 1}</div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                          <p className="font-semibold text-foreground">{item.title}</p>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 pt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed pl-[52px]">{item.description}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </motion.div>

            {/* What's Included / Not Included */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">Practical Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Check className="w-5 h-5 text-primary" />What's Included</h3>
                  <ul className="space-y-2">
                    {included.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Not Included</h3>
                  <ul className="space-y-2">
                    {notIncluded.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-muted-foreground mt-0.5 shrink-0">—</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3">Accommodation</h3>
                <p className="text-sm text-muted-foreground">Bishkek: city hotel (3–4★) · Issyk-Kul: lakeside resort or yurt-style lodge · Premium coaches / minivans · Small group format</p>
              </div>
            </motion.div>

            {/* Packing Tips */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Sun className="w-5 h-5 text-primary" />Weather & Packing Tips</h2>
              <p className="text-sm text-muted-foreground mb-4">Warm days, cool evenings near Lake Issyk-Kul.</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {packingTips.map(tip => (
                  <div key={tip} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{tip}</div>
                ))}
              </div>
            </motion.div>

            {/* Optional Experiences */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-primary" />Optional Experiences</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {optionalExperiences.map(exp => (
                  <div key={exp} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <Star className="w-5 h-5 fill-current text-yellow-400 shrink-0" />
                    <span className="text-sm font-medium text-foreground">{exp}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Gallery */}
            <TourGallery tourTitle="World Nomad Games 2026" />

            {/* Tour Schedule & Status */}
            {dbTour && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-primary" />Tour Schedule & Status</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {dbTour.start_date && (
                    <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Start Date</p><p className="font-semibold text-foreground">{new Date(dbTour.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div></div>
                  )}
                  {dbTour.end_date && (
                    <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">End Date</p><p className="font-semibold text-foreground">{new Date(dbTour.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div></div>
                  )}
                  <div className="flex items-center gap-3"><div><p className="text-xs text-muted-foreground">Status</p><Badge variant={dbTour.status === 'Open' ? 'default' : dbTour.status === 'Almost Full' ? 'secondary' : 'destructive'}>{dbTour.status}</Badge></div></div>
                  <div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Current Bookings</p><p className="font-semibold text-foreground">{dbTour.current_bookings}</p></div></div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">Price available upon request</p>
                <p className="text-xs text-muted-foreground mt-1">Each journey is individually tailored depending on group size, accommodation category and selected experiences.</p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm"><Calendar className="w-5 h-5 text-primary" /><span className="text-muted-foreground">Aug 30 – Sep 8, 2026</span></div>
                <div className="flex items-center gap-3 text-sm"><MapPin className="w-5 h-5 text-primary" /><span className="text-muted-foreground">Bishkek → Issyk-Kul</span></div>
                <div className="flex items-center gap-3 text-sm"><Star className="w-5 h-5 text-secondary fill-secondary" /><span className="text-muted-foreground">Once-in-a-lifetime event</span></div>
              </div>
              <Button size="lg" className="w-full mb-3" onClick={() => setBookingOpen(true)}>Book Now</Button>
              <p className="text-xs text-center text-muted-foreground">Free cancellation up to 48 hours before</p>
            </motion.div>
          </div>
        </div>
      </div>

      <BookingFormModal open={bookingOpen} onClose={() => setBookingOpen(false)} tourTitle="World Nomad Games 2026" tourPrice={0} />
      <Footer />
    </div>
  );
};

export default NomadGamesPage;
