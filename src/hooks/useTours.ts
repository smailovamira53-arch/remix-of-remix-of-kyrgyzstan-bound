import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/i18n/LanguageContext';

export type SupabaseTour = {
  id: string;
  slug: string;
  title: string;
  title_ru: string;
  title_es: string;
  title_ar: string;
  description: string;
  description_ru: string;
  description_es: string;
  description_ar: string;
  price: number;
  duration: string;
  difficulty: string;
  category: string;
  image_url: string | null;
  gallery_images: string[];
  is_featured: boolean;
  is_active: boolean;
  is_event: boolean;
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
  if (lang === 'en') return tour[field] || '';
  const key = `${field}_${lang}` as keyof SupabaseTour;
  const val = tour[key] as string;
  return val && val.trim() !== '' ? val : tour[field] || '';
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
        setData((result as SupabaseTour[]) || []);
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