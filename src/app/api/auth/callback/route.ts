import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const supabase = createServerSupabaseClient();

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