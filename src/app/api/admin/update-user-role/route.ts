import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API per aggiornare il ruolo di un utente (is_super_admin)
 * Questa API verifica che l'utente chiamante sia autorizzato (super admin)
 */
export async function POST(req: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ 
      error: 'Configurazione Supabase mancante: assicurati di aver impostato SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL nel file .env.local' 
    }, { status: 500 });
  }

  try {
    // Crea un client Supabase con la sessione dell'utente
    const supabase = createServerSupabaseClient();
    
    // Verifica l'autenticazione
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Errore di autenticazione:', sessionError);
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }
    
    // Verifica se l'utente è un super admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Errore nel recuperare l\'utente:', userError);
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }
    
    if (!user.app_metadata?.is_super_admin) {
      console.error('Accesso negato per', user.email);
      return NextResponse.json({ error: 'Accesso negato: richiesti privilegi di Super Admin' }, { status: 403 });
    }
    
    // Leggi i dati dalla richiesta
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 });
    }
    
    const { userId, isSuperAdmin } = body;
    
    if (!userId || typeof isSuperAdmin !== 'boolean') {
      return NextResponse.json({ error: 'Parametri mancanti o non validi' }, { status: 400 });
    }
    
    // Crea un client con la chiave di servizio per operazioni admin
    const adminSupabase = createServerSupabaseClient({ useServiceKey: true });
    
    // Aggiorna i metadati dell'utente
    const { data, error } = await adminSupabase.auth.admin.updateUserById(userId, {
      app_metadata: { is_super_admin: isSuperAdmin }
    });
    
    if (error) {
      console.error('Errore nell\'aggiornare l\'utente:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Ruolo utente aggiornato con successo: ${isSuperAdmin ? 'Super Admin assegnato' : 'Super Admin rimosso'}`,
      user: data.user
    });
  } catch (error: any) {
    console.error('Errore imprevisto:', error);
    return NextResponse.json({ error: error.message || 'Errore sconosciuto' }, { status: 500 });
  }
} 