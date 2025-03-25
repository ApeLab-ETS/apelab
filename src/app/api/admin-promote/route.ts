import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * API Temporanea che simula la promozione di un utente ad admin
 * 
 * COME USARE:
 * 1. Apri nel browser: /api/admin-promote?email=mail@francescomasala.me&key=temp_secret_key_change_me
 * 2. Assicurati di sostituire l'email con quella dell'utente da promuovere
 * 3. IMPORTANTE: Dopo aver promosso il tuo utente, cambia immediatamente la SECRET_KEY
 *    per motivi di sicurezza o elimina completamente questo file!
 * 
 * FUNZIONAMENTO:
 * - In questa versione, la funzione non modifica effettivamente il database
 * - Invece, mostra come dovresti modificare il codice per aggiungere un utente alla whitelist
 * - La whitelist si trova in src/app/admin/layout.tsx
 */
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
    // Questa versione è solo dimostrativa e non apporta modifiche effettive
    // In un'implementazione reale, dovresti modificare il file layout.tsx
    // o mantenere la whitelist admin in un database
    
    console.log(`Simulazione promozione utente: ${email}`);
    
    // In questa versione semplificata, non verifichiamo l'esistenza dell'utente
    // poiché le API admin potrebbero non essere disponibili con l'ANON_KEY
    
    return NextResponse.json({ 
      success: true, 
      message: `Per promuovere ${email} a admin, aggiungi questa email alla whitelist in src/app/admin/layout.tsx`,
      instructions: [
        "1. Apri il file src/app/admin/layout.tsx",
        "2. Trova l'array ADMIN_EMAILS",
        `3. Aggiungi '${email}' all'array`,
        "4. Salva il file e riavvia l'applicazione se necessario"
      ]
    });
  } catch (err) {
    console.error('Errore:', err);
    return NextResponse.json({ 
      error: 'Server error', 
      details: (err as Error).message 
    }, { status: 500 });
  }
} 