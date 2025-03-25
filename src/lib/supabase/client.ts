import { createClient } from '@supabase/supabase-js';

// Creazione del client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipi per il database
export type Profile = {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  ruolo: 'admin' | 'organizzatore' | 'utente';
  telefono: string;
  avatar_url: string;
  created_at: string;
};

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