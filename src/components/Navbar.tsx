import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBanner } from '@/context/BannerContext';
import logoMmt from '@/assets/logo-header.png';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();
  const { bannerVisible } = useBanner();

  const primaryItems = [
    { label: t.nav.home, href: '/' },
    { 
      label: t.nav.tours, 
      href: '/tours',
      submenu: [
        { label: t.nav.tourPackages,  href: '/tours?category=package'  },
        { label: t.nav.dayExcursions, href: '/tours?category=day'       },
        { label: t.nav.multiDayTours, href: '/tours?category=multi-day' },
      ]
    },
    { label: t.nav.adventure || 'Expeditions', href: '/expeditions' },
    { label: t.nav.contact, href: '/contact' },
  ];

  const moreItems = [
    { label: t.nav.guides || 'Guides', href: '/guides' },
    { label: t.nav.travelTips || 'Travel Tips', href: '/travel-tips' },
    { label: t.nav.aboutKyrgyzstan, href: '/about' },
  ];

  const allItems: Array<{ label: string; href: string; submenu?: Array<{ label: string; href: string }> }> = [
    ...primaryItems.slice(0, -1),
    ...moreItems,
    primaryItems[primaryItems.length - 1],
  ];

  const renderDesktopItem = (item: typeof primaryItems[0]) => (
    <div
      key={item.label}
      className="relative"
      onMouseEnter={() => item.submenu && setActiveSubmenu(item.label)}
      onMouseLeave={() => setActiveSubmenu(null)}
    >
      <Link
        to={item.href}
        className={`nav-link px-3 xl:px-4 py-2 text-sm font-medium flex items-center gap-1 whitespace-nowrap transition-colors ${item.href === '/contact' ? 'bg-primary text-primary-foreground rounded-lg hover:bg-primary/90' : ''}`}
      >
        {item.label}
        {item.submenu && <ChevronDown className="w-3 h-3" />}
      </Link>

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
  );

  return (
    <nav className={`fixed ${bannerVisible ? 'top-[36px]' : 'top-0'} left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 transition-all duration-300`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          <Link to="/" className="flex-shrink-0">
            <img
              src={logoMmt}
              alt="Mountain Magic Tours"
              className="h-[70px] md:h-[70px] w-auto object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />
          </Link>

          <div className={`hidden lg:flex items-center gap-0.5 xl:gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {primaryItems.slice(0, -1).map(renderDesktopItem)}

            <div
              className="relative"
              onMouseEnter={() => setActiveSubmenu('more')}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button className="nav-link px-3 xl:px-4 py-2 text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                {t.nav.exploreMore || 'Explore More'}
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {activeSubmenu === 'more' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} pt-2`}
                  >
                    <div className="bg-card rounded-lg shadow-lg border border-border p-2 min-w-[200px]">
                      {moreItems.map((subItem) => (
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

            {renderDesktopItem(primaryItems[primaryItems.length - 1])}
          </div>

          <div className={`hidden lg:flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LanguageSwitcher />
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 space-y-2">
              {allItems.map((item) => (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};