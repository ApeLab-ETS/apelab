import { createBrowserClient } from '@supabase/ssr';

// Creazione del client Supabase lato browser
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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