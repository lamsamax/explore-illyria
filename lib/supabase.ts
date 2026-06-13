import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Tour = {
  id: number;
  name: string;
  image: string;
  location: string;
  duration: string;
  activity: string;
  difficulty: string;
  price: number | null;
  price_label: string;
  category: string;
  tag: string;
  tag_color: string;
  color: string;
  desc: string;
  highlights: string[];
  included: string[];
  not_included: string[];
  long_desc: string;
};
