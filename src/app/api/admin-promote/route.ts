import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Una funzione segreta temporanea per promuovere un utente ad admin
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const secretKey = searchParams.get('key');
  
  // Chiave segreta - cambiala immediatamente dopo aver promosso il tuo utente!
  const SECRET_KEY = 'temp_secret_key_change_me';
  
  // Controlla che la chiave sia corretta
  if (secretKey !== SECRET_KEY) {
    console.log('Tentativo di accesso non autorizzato');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  
  try {
    const supabase = createServerSupabaseClient();
    
    // Prima verifica se l'utente esiste
    const { data: user, error: fetchError } = await supabase
      .from('utenti')
      .select('*')
      .eq('email', email)
      .single();
    
    if (fetchError) {
      console.error('Errore recupero utente:', fetchError);
      return NextResponse.json({ 
        error: 'User not found', 
        details: fetchError.message 
      }, { status: 404 });
    }
    
    // Poi aggiorna il ruolo a 'admin'
    const { error: updateError } = await supabase
      .from('utenti')
      .update({ ruolo: 'admin' })
      .eq('email', email);
      
    if (updateError) {
      console.error('Errore aggiornamento utente:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update user', 
        details: updateError.message 
      }, { status: 500 });
    }
    
    console.log(`Utente ${email} promosso a admin`);
    return NextResponse.json({ 
      success: true, 
      message: `User ${email} promoted to admin` 
    });
  } catch (err) {
    console.error('Errore promozione utente:', err);
    return NextResponse.json({ 
      error: 'Server error', 
      details: (err as Error).message 
    }, { status: 500 });
  }
} 