import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type ClientOptions = {
  useServiceKey?: boolean;
};

/**
 * Crea un client Supabase per il server
 * @param options Opzioni per la creazione del client
 * @param options.useServiceKey Se true, usa la chiave di servizio invece della chiave anonima
 * @returns Client Supabase
 */
export function createServerSupabaseClient(options: ClientOptions = {}) {
  // In Next.js 15+, cookies() restituisce una Promise che non funziona
  // direttamente con l'API di @supabase/ssr. Usiamo quindi un'implementazione più
  // semplice che evita problemi di tipo.
  const cookieStore = cookies();
  
  // Decidi quale chiave utilizzare in base alle opzioni
  const supabaseKey = options.useServiceKey
    ? process.env.SUPABASE_SERVICE_ROLE_KEY! // Chiave di servizio per operazioni admin
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Chiave anonima per operazioni standard
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey,
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