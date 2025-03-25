import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API per ottenere tutti gli utenti tramite Supabase Admin API
 * Questa API verifica che l'utente chiamante sia autorizzato (super admin)
 */
export async function GET(req: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ 
      error: 'Configurazione Supabase mancante: assicurati di aver impostato SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL nel file .env.local' 
    }, { status: 500 });
  }

  try {
    // Crea un client Supabase con la sessione dell'utente
    const supabase = createServerSupabaseClient();
    
    // Verifica l'autenticazione dell'utente che fa la richiesta
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }
    
    // Verifica se l'utente è un super admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }
    
    if (!user.app_metadata?.is_super_admin) {
      console.error('Accesso all\'API utenti negato per', user.email, 'manca il ruolo super_admin');
      return NextResponse.json({ error: 'Accesso negato: richiesti privilegi di Super Admin' }, { status: 403 });
    }
    
    // Crea un client con la chiave di servizio per operazioni admin
    const adminSupabase = createServerSupabaseClient({ useServiceKey: true });
    
    // Recupera tutti gli utenti (massimo 100 per prestazioni)
    const { data, error } = await adminSupabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });
    
    if (error) {
      console.error('Errore nel recupero degli utenti:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ users: data.users });
  } catch (error: any) {
    console.error('Errore imprevisto:', error);
    return NextResponse.json({ error: error.message || 'Errore sconosciuto' }, { status: 500 });
  }
} 