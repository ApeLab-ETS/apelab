'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase/client';

type Evento = {
  id: string;
  titolo: string;
  descrizione: string;
  data_inizio: string;
  data_fine: string;
  location: string;
  stato: string;
  max_partecipanti: number;
  creatore_id: string;
  created_at: string;
  updated_at: string;
};

export default function DettaglioEventoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPartecipante, setIsPartecipante] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [numPartecipanti, setNumPartecipanti] = useState(0);

  useEffect(() => {
    // Recupera l'utente corrente
    const getUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setCurrentUser(user?.id || null);
    };

    getUser();
    fetchEvento();
  }, [id]);

  // Recupera i dettagli dell'evento
  const fetchEvento = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('feste')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) {
        setError('Evento non trovato');
        return;
      }
      
      // Mappa i campi dal database ai nomi utilizzati nel frontend
      const eventoMappato: Evento = {
        id: data.id,
        titolo: data.nome || '',
        descrizione: data.descrizione || '',
        data_inizio: data.data_inizio || '',
        data_fine: data.data_fine || '',
        location: data.luogo || '',
        stato: data.stato || '',
        max_partecipanti: data.max_partecipanti || 0,
        creatore_id: data.creatore_id || '',
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
      };
      
      setEvento(eventoMappato);
      
      // Controlla se l'utente è già partecipante
      if (currentUser) {
        const { data: partecipazione, error: partError } = await supabaseClient
          .from('partecipazioni')
          .select('*')
          .eq('festa_id', id)
          .eq('utente_id', currentUser)
          .single();
        
        setIsPartecipante(!!partecipazione);
      }
      
      // Conta i partecipanti
      const { count, error: countError } = await supabaseClient
        .from('partecipazioni')
        .select('*', { count: 'exact', head: true })
        .eq('festa_id', id)
        .eq('stato', 'confermato');
      
      if (!countError && count !== null) {
        setNumPartecipanti(count);
      }
    } catch (err: any) {
      console.error('Errore durante il recupero dell\'evento:', err);
      setError('Si è verificato un errore durante il recupero dell\'evento.');
    } finally {
      setLoading(false);
    }
  };

  // Gestisce la partecipazione all'evento
  const handlePartecipa = async () => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    
    try {
      const { error } = await supabaseClient
        .from('partecipazioni')
        .insert({
          festa_id: id,
          utente_id: currentUser,
          stato: 'in_attesa',
          data_partecipazione: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setIsPartecipante(true);
      setNumPartecipanti(prev => prev + 1);
      
      // Crea una notifica per l'utente
      await supabaseClient
        .from('notifiche')
        .insert({
          utente_id: currentUser,
          festa_id: id,
          messaggio: `Hai richiesto di partecipare all'evento "${evento?.titolo}". Riceverai una conferma presto.`,
          letta: false,
          created_at: new Date().toISOString()
        });
    } catch (err: any) {
      console.error('Errore durante la richiesta di partecipazione:', err);
      setError('Si è verificato un errore durante la richiesta di partecipazione.');
    }
  };

  // Formatta la data in formato leggibile
  const formatData = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Formatta l'ora in formato leggibile
  const formatOra = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Ottieni la classe del badge in base allo stato
  const getStatoBadgeClass = (stato: string) => {
    switch (stato) {
      case 'pianificata':
        return 'bg-blue-100 text-blue-800';
      case 'in_corso':
        return 'bg-green-100 text-green-800';
      case 'conclusa':
        return 'bg-gray-100 text-gray-800';
      case 'annullata':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };
  
  // Testo leggibile per lo stato
  const getStatoTesto = (stato: string) => {
    switch (stato) {
      case 'pianificata': return 'Pianificata';
      case 'in_corso': return 'In corso';
      case 'conclusa': return 'Conclusa';
      case 'annullata': return 'Annullata';
      default: return stato;
    }
  };
  
  // Funzione per verificare se l'evento è in corso
  const isEventoFuturo = (dataInizio: string) => {
    return new Date(dataInizio) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-slate-600">Caricamento dettagli evento...</p>
        </div>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 text-red-600 p-8 rounded-xl shadow-md inline-block">
            <h1 className="text-2xl font-bold mb-4">{error || 'Evento non trovato'}</h1>
            <p className="mb-6">L'evento che stai cercando non esiste o è stato rimosso.</p>
            <Link href="/eventi" className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow-sm hover:bg-orange-600 transition-all">
              Torna agli Eventi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-orange-500">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-slate-400">/</span>
                  <Link href="/eventi" className="text-sm font-medium text-slate-700 hover:text-orange-500">
                    Eventi
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-slate-400">/</span>
                  <span className="text-sm font-medium text-orange-500 truncate max-w-[200px]">
                    {evento.titolo}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Header con titolo e stato */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{evento.titolo}</h1>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatoBadgeClass(evento.stato)}`}>
                {getStatoTesto(evento.stato)}
              </span>
            </div>
          </div>
          
          {isEventoFuturo(evento.data_inizio) && evento.stato === 'pianificata' && (
            <div className="mt-4 md:mt-0">
              {isPartecipante ? (
                <div className="px-6 py-3 bg-green-100 text-green-800 font-medium rounded-lg inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Partecipazione Richiesta
                </div>
              ) : (
                <button
                  onClick={handlePartecipa}
                  className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow-md hover:bg-orange-600 transition-all inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                  </svg>
                  Partecipa all'evento
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Contenuto principale con due colonne */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonna principale - descrizione evento */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Dettagli dell'Evento</h2>
              
              <div className="prose max-w-none text-slate-700">
                <p className="whitespace-pre-line">{evento.descrizione}</p>
              </div>
            </div>
          </div>
          
          {/* Sidebar con le informazioni importanti */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Informazioni Evento</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="mr-3 text-orange-500 text-xl">📅</span>
                  <div>
                    <h4 className="font-medium text-slate-900">Data e ora</h4>
                    <p className="text-slate-700">{formatData(evento.data_inizio)}</p>
                    <p className="text-slate-700">Dalle ore {formatOra(evento.data_inizio)}</p>
                    {evento.data_fine && (
                      <p className="text-slate-700">
                        {evento.data_inizio.split('T')[0] === evento.data_fine.split('T')[0]
                          ? `fino alle ore ${formatOra(evento.data_fine)}`
                          : `fino al ${formatData(evento.data_fine)} ore ${formatOra(evento.data_fine)}`}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="mr-3 text-orange-500 text-xl">📍</span>
                  <div>
                    <h4 className="font-medium text-slate-900">Location</h4>
                    <p className="text-slate-700">{evento.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="mr-3 text-orange-500 text-xl">👥</span>
                  <div>
                    <h4 className="font-medium text-slate-900">Partecipanti</h4>
                    <p className="text-slate-700">{numPartecipanti} / {evento.max_partecipanti}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Share event */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Condividi Evento</h3>
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-500 text-white rounded-md p-2 text-sm hover:bg-blue-600 transition-colors">
                  Facebook
                </button>
                <button className="flex-1 bg-blue-400 text-white rounded-md p-2 text-sm hover:bg-blue-500 transition-colors">
                  Twitter
                </button>
                <button className="flex-1 bg-green-500 text-white rounded-md p-2 text-sm hover:bg-green-600 transition-colors">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link href="/eventi" className="inline-block px-6 py-3 bg-white text-orange-500 font-medium border border-orange-200 rounded-lg shadow-sm hover:bg-orange-50 transition-all mr-4">
            Torna agli Eventi
          </Link>
          
          {evento.stato === 'pianificata' && !isPartecipante && (
            <button
              onClick={handlePartecipa}
              className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow-md hover:bg-orange-600 transition-all"
            >
              Partecipa all'evento
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 