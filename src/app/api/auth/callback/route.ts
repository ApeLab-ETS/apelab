import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
            try {
              cookieStore.set(name, value, options);
            } catch (error) {
              // Ignora errori durante il settaggio dei cookie
            }
          },
          remove(name: string, options: { path: string; domain?: string }) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 });
            } catch (error) {
              // Ignora errori durante la rimozione dei cookie
            }
          },
        },
      }
    );

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Errore durante lo scambio del codice per la sessione:", error);
      }
    } catch (error) {
      console.error("Errore durante l'autenticazione:", error);
    }
  }

  // Reindirizza l'utente alla pagina successiva
  return NextResponse.redirect(`${origin}${next}`);
} 