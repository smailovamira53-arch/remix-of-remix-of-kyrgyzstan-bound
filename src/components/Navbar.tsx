import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';
import logoMmt from '@/assets/logo-header-blue.png';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();

  const navItems = [
    { label: t.nav.home, href: '/' },
    { 
      label: t.nav.tours, 
      href: '/tours',
      submenu: [
        { label: t.nav.tourPackages, href: '/tours/packages' },
        { label: t.nav.dayExcursions, href: '/tours/excursions' },
        { label: t.nav.multiDayTours, href: '/tours/multi-day' },
      ]
    },
    { label: t.nav.adventure, href: '/adventure' },
    { label: t.nav.guides || 'Guides', href: '/guides' },
    { label: t.nav.travelTips || 'Travel Tips', href: '/travel-tips' },
    { label: t.nav.accommodations, href: '/accommodations' },
    { label: t.nav.aboutKyrgyzstan, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
  ];

  return (
    <nav className="fixed top-[36px] left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={logoMmt} 
              alt="Mountain Magic Tours" 
              className="h-[50px] md:h-[58px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.label)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  to={item.href}
                  className="nav-link px-4 py-2 text-sm font-medium flex items-center gap-1"
                >
                  {item.label}
                  {item.submenu && <ChevronDown className="w-3 h-3" />}
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {item.submenu && activeSubmenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} pt-2`}
                    >
                      <div className="bg-card rounded-lg shadow-lg border border-border p-2 min-w-[200px]">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons & Language Switcher */}
          <div className={`hidden lg:flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LanguageSwitcher />
            <Button variant="ghost" size="sm">
              {t.nav.signIn}
            </Button>
            <Button variant="default" size="sm">
              {t.nav.bookNow}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <div className="container-custom py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className="block px-4 py-3 text-foreground font-medium hover:bg-muted rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.submenu && (
                    <div className={`${isRTL ? 'pr-4' : 'pl-4'} space-y-1`}>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-2 border-t border-border">
                <Button variant="outline" className="w-full">
                  {t.nav.signIn}
                </Button>
                <Button className="w-full">
                  {t.nav.bookNow}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
