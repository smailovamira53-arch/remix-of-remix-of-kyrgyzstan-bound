import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Send, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import logoFooter from '@/assets/logo-footer-white.png';

export const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    explore: [
      { label: t.footer.links.tourPackages, href: '/tours/packages' },
      { label: t.footer.links.dayExcursions, href: '/tours/excursions' },
      { label: t.footer.links.multiDayTours, href: '/tours/multi-day' },
      { label: t.footer.links.adventureActivities, href: '/adventure' },
      { label: t.footer.links.adventurePass, href: '/adventure-pass' },
    ],
    destinations: [
      { label: t.footer.links.issykKul, href: '/destinations/issyk-kul' },
      { label: t.footer.links.songKul, href: '/destinations/song-kul' },
      { label: t.footer.links.alaArcha, href: '/destinations/ala-archa' },
      { label: t.footer.links.jetiOguz, href: '/destinations/jeti-oguz' },
      { label: t.footer.links.bishkek, href: '/destinations/bishkek' },
    ],
    company: [
      { label: t.footer.links.aboutUs, href: '/about' },
      { label: t.footer.links.ourTeam, href: '/team' },
      { label: t.footer.links.travelBlog, href: '/blog' },
      { label: t.footer.links.careers, href: '/careers' },
      { label: t.footer.links.contact, href: '/contact' },
    ],
    support: [
      { label: t.footer.links.faqs, href: '/faq' },
      { label: t.footer.links.bookingTerms, href: '/terms' },
      { label: t.footer.links.privacyPolicy, href: '/privacy' },
      { label: t.footer.links.travelInsurance, href: '/insurance' },
      { label: t.footer.links.visaInfo, href: '/visa' },
    ],
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="border-b border-primary-foreground/10">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-2">{t.footer.newsletter.title}</h3>
              <p className="text-primary-foreground/70">{t.footer.newsletter.description}</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input type="email" placeholder={t.footer.newsletter.placeholder} className="flex-1 md:w-72 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/40" />
              <Button variant="accent" size="lg" className="gap-2">
                <Send className="w-4 h-4" />
                {t.footer.newsletter.subscribe}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img src={logoFooter} alt="Mountain Magic Tours" className="w-[180px] sm:w-[220px] md:w-[280px] h-auto" />
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6 max-w-xs">{t.footer.brand.description}</p>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" />Bishkek, Kyrgyzstan</p>
              <a href="https://wa.me/996703404054" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-foreground transition-colors"><Phone className="w-4 h-4" />+996 703 404 054</a>
              <a href="mailto:Mountainmagictours@gmail.com" className="flex items-center gap-2 hover:text-primary-foreground transition-colors"><Mail className="w-4 h-4" />Mountainmagictours@gmail.com</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.explore}</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.label}><Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.destinations}</h4>
            <ul className="space-y-2">
              {footerLinks.destinations.map((link) => (
                <li key={link.label}><Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.company}</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}><Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.support}</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}><Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">{t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/996703404054" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 hover:scale-110 transition-all duration-300"><MessageCircle className="w-5 h-5" /></a>
            <a href="https://www.instagram.com/mountain_magic_tours?igsh=MXdrYzZuOTB0Yzc1NQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 hover:scale-110 transition-all duration-300"><Instagram className="w-5 h-5" /></a>
            <a href="https://youtube.com/@mountainmagictours?si=qdUAWqH3eZfXk6O5" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 hover:scale-110 transition-all duration-300"><Youtube className="w-5 h-5" /></a>
            <a href="https://www.facebook.com/mountainmagictours" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 hover:scale-110 transition-all duration-300"><Facebook className="w-5 h-5" /></a>
            <a href="mailto:Mountainmagictours@gmail.com" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 hover:scale-110 transition-all duration-300"><Mail className="w-5 h-5" /></a>
            <a href="https://linkedin.com/company/mountain-magic-tours" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 hover:scale-110 transition-all duration-300"><Linkedin className="w-5 h-5" /></a>
            <a href="https://tripadvisor.com/mountainmagictours" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 hover:scale-110 transition-all duration-300"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="6.5" cy="13.5" r="2.5"/><circle cx="17.5" cy="13.5" r="2.5"/><path d="M12 2C6.48 2 2 6 2 11c0 2.76 1.12 5.26 2.93 7.07L12 22l7.07-3.93C20.88 16.26 22 13.76 22 11c0-5-4.48-9-10-9zm0 2c3.5 0 6.64 1.84 8.38 4.62A7.96 7.96 0 0017.5 8a7.96 7.96 0 00-5.5 2.2A7.96 7.96 0 006.5 8a7.96 7.96 0 00-2.88.62C5.36 5.84 8.5 4 12 4z"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
