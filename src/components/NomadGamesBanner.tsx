import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBanner } from '@/context/BannerContext';

type Banner = {
  id: string;
  text_en: string;
  text_ru: string | null;
  text_es: string | null;
  text_ar: string | null;
  link: string;
  link_label_en: string;
  link_label_ru: string | null;
  link_label_es: string | null;
  link_label_ar: string | null;
};

export const NomadGamesBanner = () => {
  const { language, isRTL } = useLanguage();
  const { setBannerVisible } = useBanner();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setBanners(data as Banner[]);
        }
      });
  }, []);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, paused, next]);

  const handleClose = () => {
    setVisible(false);
    setBannerVisible(false);
  };

  if (!visible || banners.length === 0) return null;

  const b = banners[current];
  const text = (language !== 'en' && b[`text_${language}` as keyof Banner] as string) || b.text_en;
  const linkLabel = (language !== 'en' && b[`link_label_${language}` as keyof Banner] as string) || b.link_label_en;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-white ${isRTL ? 'rtl' : 'ltr'}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1400px] mx-auto px-4 h-9 flex items-center justify-between gap-2">

        {banners.length > 1 && (
          <button
            onClick={() => setCurrent(c => (c - 1 + banners.length) % banners.length)}
            className="shrink-0 hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1 flex items-center justify-center gap-2 text-center min-w-0">
          <span className="text-xs sm:text-sm font-medium truncate">
            🔥 {text}
          </span>
          <Link
            to={b.link}
            className="shrink-0 inline-flex items-center gap-1 bg-white text-amber-600 text-xs font-bold px-2.5 py-0.5 rounded-full hover:bg-amber-50 transition-colors"
          >
            {linkLabel} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="shrink-0 flex items-center gap-1.5">
          {banners.length > 1 && (
            <>
              <div className="flex gap-1">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === current ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <button onClick={next} className="hover:opacity-70 transition-opacity">
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
          <button onClick={handleClose} className="hover:opacity-70 transition-opacity ml-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};