import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Wifi, Coffee, Mountain, Waves, Sparkles, BadgePercent, Plane, Phone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingFormModal } from '@/components/BookingFormModal';
import { getAccommodationBySlug } from '@/data/accommodationsData';

const amenityIcon = (a: string) => {
  const lower = a.toLowerCase();
  if (lower.includes('wifi')) return Wifi;
  if (lower.includes('breakfast') || lower.includes('meals') || lower.includes('coffee') || lower.includes('gourmet')) return Coffee;
  if (lower.includes('mountain') || lower.includes('view') || lower.includes('hiking')) return Mountain;
  if (lower.includes('beach') || lower.includes('pool') || lower.includes('lake') || lower.includes('hot spring') || lower.includes('spa') || lower.includes('shower')) return Waves;
  return Sparkles;
};

const AccommodationDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const acc = slug ? getAccommodationBySlug(slug) : undefined;

  if (!acc) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 container-custom text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Accommodation Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
          <Button asChild><Link to="/accommodations">Browse Accommodations</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = acc.gallery && acc.gallery.length > 0 ? acc.gallery : [acc.image];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <img src={images[activeImage]} alt={acc.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-24 left-4 md:left-8">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
        </motion.div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="container-custom -mt-10 relative z-10 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container-custom pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <MapPin className="w-4 h-4" />
                <span>{acc.location}</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">{acc.type === 'eco-lodge' ? 'Eco Lodge' : acc.type}</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">{acc.title}</h1>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-current text-yellow-400" />
                <span className="text-lg font-semibold">{acc.rating}</span>
                <span className="text-muted-foreground">({acc.reviewCount} reviews)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{acc.fullDescription}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {acc.amenities.map(a => {
                  const Icon = amenityIcon(a);
                  return (
                    <div key={a} className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                      <Icon className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">{a}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Reviews */}
            {acc.reviews && acc.reviews.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">Guest Reviews</h2>
                <div className="space-y-4">
                  {acc.reviews.map((review, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">{review.name.charAt(0)}</div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[...Array(review.rating)].map((_, j) => (
                            <Star key={j} className="w-3.5 h-3.5 fill-current text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24 space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Price per night</p>
                <p className="text-3xl font-bold text-foreground">${acc.pricePerNight}<span className="text-base font-normal text-muted-foreground">/night</span></p>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: BadgePercent, text: '10–15% off when booking through us' },
                  { icon: Plane, text: 'Free Manas airport transfer' },
                  { icon: Phone, text: '24/7 support in KG/RU/EN' },
                ].map(perk => {
                  const Icon = perk.icon;
                  return (
                    <div key={perk.text} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">{perk.text}</p>
                    </div>
                  );
                })}
              </div>

              <Button className="w-full" size="lg" onClick={() => setBookingOpen(true)}>
                Book Through Us — Save 10%
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/contact">Ask a Question</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      {bookingOpen && (
        <BookingFormModal open={bookingOpen} onClose={() => setBookingOpen(false)} tourTitle={acc.title} tourPrice={acc.pricePerNight} />
      )}
    </div>
  );
};

export default AccommodationDetailPage;
