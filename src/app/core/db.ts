
import type { Database } from "./db-types";
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_KEY!);


