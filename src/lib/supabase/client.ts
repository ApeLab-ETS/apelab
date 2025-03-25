import { createBrowserClient } from '@supabase/ssr';
import { type User } from '@supabase/supabase-js';

// Creazione del client Supabase lato browser
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Re-export del tipo User da Supabase per comodità
export type { User };

// Tipo per il profilo utente
export type Profile = {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  email?: string;
  username?: string;
  bio?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
  is_super_admin?: boolean;
};

// Tipi per le tabelle del database
export type Festa = {
  id: number;
  nome: string;
  descrizione: string;
  data_inizio: string;
  ora_inizio: string;
  luogo: string;
  max_partecipanti: number;
  creatore_id: string;
  stato: 'pianificata' | 'in_corso' | 'conclusa' | 'annullata';
  tags: string[];
  immagine_url: string;
};

export type Partecipazione = {
  id: number;
  festa_id: number;
  user_id: string;
  stato: 'confermato' | 'in_attesa' | 'rifiutato';
  note: string;
  created_at: string;
};

export type Notifica = {
  id: number;
  user_id: string;
  festa_id: number;
  tipo: 'invito' | 'promemoria' | 'aggiornamento';
  messaggio: string;
  letta: boolean;
  created_at: string;
}; 