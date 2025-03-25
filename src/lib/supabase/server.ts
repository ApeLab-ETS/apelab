import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Creazione del client Supabase lato server per componenti e pagine Server Components
export function createServerSupabaseClient() {
  // In Next.js 15+, cookies() restituisce una Promise che non funziona
  // direttamente con l'API di @supabase/ssr. Usiamo quindi un'implementazione più
  // semplice che evita problemi di tipo.
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          // @ts-ignore - Sappiamo che cookieStore.get è disponibile
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          // @ts-ignore - Sappiamo che cookieStore.set è disponibile
          cookieStore.set(name, value, options);
        },
        remove(name, options) {
          // @ts-ignore - Sappiamo che cookieStore.delete è disponibile
          cookieStore.delete(name, options);
        },
      },
    }
  );
} 