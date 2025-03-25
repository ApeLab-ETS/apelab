import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API per aggiornare lo stato di approvazione di un utente per la festa
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
    
    const { userId, isApproved } = body;
    
    if (!userId || typeof isApproved !== 'boolean') {
      return NextResponse.json({ error: 'Parametri mancanti o non validi' }, { status: 400 });
    }
    
    // Crea un client con la chiave di servizio per operazioni admin
    const adminSupabase = createServerSupabaseClient({ useServiceKey: true });
    
    // Recupera i metadati utente esistenti
    const { data: userData, error: fetchError } = await adminSupabase.auth.admin.getUserById(userId);
    
    if (fetchError) {
      console.error('Errore nel recuperare i dati dell\'utente:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Prepara i nuovi metadati utente
    const currentMetadata = userData.user.user_metadata || {};
    const updatedMetadata = {
      ...currentMetadata,
      approved_for_party: isApproved
    };
    
    // Aggiorna i metadati dell'utente
    const { data, error } = await adminSupabase.auth.admin.updateUserById(userId, {
      user_metadata: updatedMetadata
    });
    
    if (error) {
      console.error('Errore nell\'aggiornare l\'utente:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Stato di approvazione aggiornato con successo: ${isApproved ? 'Utente approvato per la festa' : 'Approvazione rimossa'}`,
      user: data.user
    });
  } catch (error: any) {
    console.error('Errore imprevisto:', error);
    return NextResponse.json({ error: error.message || 'Errore sconosciuto' }, { status: 500 });
  }
} 