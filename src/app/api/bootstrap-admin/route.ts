import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ 
      error: 'Configurazione Supabase mancante: assicurati di aver impostato SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL nel file .env.local' 
    }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Per motivi di sicurezza, questa funzionalità è stata disabilitata. Configura i ruoli utente direttamente dal dashboard di Supabase.',
    howTo: 'Vai su auth.users nel dashboard di Supabase e modifica i metadati dell\'utente (campo app_metadata) per aggiungere is_super_admin: true'
  }, { status: 403 });
} 