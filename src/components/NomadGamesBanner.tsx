import { Flame, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';

export const NomadGamesBanner = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#EAB308] text-[#1a1a00]">
      <div className="container-custom py-2 flex items-center justify-center gap-3 text-center flex-wrap">
        <Flame className="w-5 h-5 shrink-0 animate-pulse" />
        <p className="text-sm md:text-base font-bold tracking-tight">
          {t.nomadGames?.banner || "🏇 Don't miss World Nomad Games 2026 (September)! Combine with your tour – epic nomadic culture & competitions!"}
        </p>
        <Button
          size="sm"
          className="bg-[#1a1a00] text-[#EAB308] hover:bg-[#2a2a00] h-7 px-3 text-xs font-bold rounded-full"
        >
          {t.nomadGames?.explore || 'Explore'}
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};
