import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/i18n/LanguageContext';

export type SupabaseTour = {
  id: string;
  slug: string;
  title: string | null;
  title_en: string;
  title_ru: string | null;
  title_es: string | null;
  title_ar: string | null;
  description: string | null;
  description_en: string | null;
  description_ru: string | null;
  description_es: string | null;
  description_ar: string | null;
  price: number;
  duration: string;
  difficulty: string;
  category: string;
  image_url: string | null;
  gallery_images: string[];
  is_featured: boolean;
  is_active: boolean;
  max_people: number;
  currency: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  current_bookings: number;
  tags: string;
};

export function getLocalizedField(
  tour: SupabaseTour,
  field: 'title' | 'description',
  lang: Language
): string {
  if (field === 'title') {
    if (lang === 'ru' && tour.title_ru) return tour.title_ru;
    if (lang === 'es' && tour.title_es) return tour.title_es;
    if (lang === 'ar' && tour.title_ar) return tour.title_ar;
    return tour.title_en || tour.title || '';
  }
  if (lang === 'ru' && tour.description_ru) return tour.description_ru;
  if (lang === 'es' && tour.description_es) return tour.description_es;
  if (lang === 'ar' && tour.description_ar) return tour.description_ar;
  return tour.description_en || tour.description || '';
}

type UseToursOptions = {
  featured?: boolean;
  category?: string;
};

export function useTours(options?: UseToursOptions) {
  const [data, setData] = useState<SupabaseTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTours() {
      try {
        setIsLoading(true);
        let query = supabase
          .from('tours')
          .select('*')
          .eq('is_active', true);

        if (options?.featured) query = query.eq('is_featured', true);
        if (options?.category) query = query.eq('category', options.category);

        const { data: result, error: err } = await query;
        if (err) throw err;
        setData((result as unknown as SupabaseTour[]) || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTours();
  }, [options?.featured, options?.category]);

  return { data, isLoading, error };
}