import { createServerClient } from '@supabase/ssr';
import { type CookieOptions, cookies } from 'next/headers';

// Creazione del client Supabase lato server per componenti e pagine Server Components
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          // La conversione di tipo è necessaria perché il tipo CookieOptions di next/headers
          // è diverso da quello di @supabase/ssr
          cookieStore.set(name, value, options as CookieOptions);
        },
        remove(name, options) {
          cookieStore.delete(name, options as CookieOptions);
        },
      },
    }
  );
} 