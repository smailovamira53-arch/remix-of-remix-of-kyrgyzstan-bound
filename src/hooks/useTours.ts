import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Tour {
  id: string;
  slug: string;
  title_en: string;
  title_ru: string | null;
  title_es: string | null;
  title_ar: string | null;
  description_en: string | null;
  description_ru: string | null;
  description_es: string | null;
  description_ar: string | null;
  price: number;
  currency: string | null;
  duration_days: number | null;
  max_people: number | null;
  difficulty: string | null;
  category: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  cover_image: string | null;
  gallery_images: string[] | null;
  created_at: string | null;
}

export const useTours = () => {
  return useQuery({
    queryKey: ['tours'],
    queryFn: async (): Promise<Tour[]> => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Tour[];
    },
  });
};

export const useTourBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['tour', slug],
    queryFn: async (): Promise<Tour> => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('title', slug)
        .limit(1)
        .single() as { data: any; error: any };
      if (error) throw error;
      return data as unknown as Tour;
    },
    enabled: !!slug,
  });
};