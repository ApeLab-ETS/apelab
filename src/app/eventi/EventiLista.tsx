'use client';

import { useState, useEffect } from 'react';
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
  passato?: boolean;
};

export default function EventiLista() {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [eventiMostrati, setEventiMostrati] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtri
  const [searchTerm, setSearchTerm] = useState('');
  const [statoFilter, setStatoFilter] = useState('');
  const [dataFilter, setDataFilter] = useState('');
  const [tempoFilter, setTempoFilter] = useState('tutti'); // 'futuri', 'passati', 'tutti'

  useEffect(() => {
    fetchEventi();
  }, []);

  // Recupera gli eventi dal database
  const fetchEventi = async () => {
    setLoading(true);
    try {
      // Recupera tutti gli eventi ordinati per data
      const { data, error } = await supabaseClient
        .from('feste')
        .select('*')
        .order('data_inizio', { ascending: false }); // Ordine decrescente per avere i più recenti prima

      if (error) throw error;
      
      const now = new Date().toISOString();
      
      // Mappa i campi dal database ai nomi utilizzati nel frontend
      const eventiMappati = data?.map(evento => {
        const isPassato = evento.data_inizio < now;
        return {
          id: evento.id,
          titolo: evento.nome || '',
          descrizione: evento.descrizione || '',
          data_inizio: evento.data_inizio || '',
          data_fine: evento.data_fine || '',
          location: evento.luogo || '',
          stato: evento.stato || '',
          max_partecipanti: evento.max_partecipanti || 0,
          passato: isPassato,
        };
      }) || [];
      
      // Ordina gli eventi: prima i futuri (in ordine crescente), poi i passati (in ordine decrescente)
      const eventiOrdinati = [
        ...eventiMappati.filter(e => !e.passato).sort((a, b) => new Date(a.data_inizio).getTime() - new Date(b.data_inizio).getTime()),
        ...eventiMappati.filter(e => e.passato)
      ];
      
      setEventi(eventiOrdinati);
      setEventiMostrati(eventiOrdinati);
    } catch (err: any) {
      console.error('Errore durante il recupero degli eventi:', err);
      setError('Si è verificato un errore durante il recupero degli eventi.');
    } finally {
      setLoading(false);
    }
  };
  
  // Applica i filtri agli eventi
  useEffect(() => {
    let risultatiFiltrati = eventi;
    
    // Filtro per tempo (futuro/passato)
    if (tempoFilter !== 'tutti') {
      risultatiFiltrati = risultatiFiltrati.filter(evento => 
        tempoFilter === 'futuri' ? !evento.passato : evento.passato
      );
    }
    
    // Filtro per termine di ricerca (titolo, descrizione, location)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      risultatiFiltrati = risultatiFiltrati.filter(evento => 
        evento.titolo.toLowerCase().includes(term) ||
        evento.descrizione.toLowerCase().includes(term) ||
        evento.location.toLowerCase().includes(term)
      );
    }
    
    // Filtro per stato
    if (statoFilter) {
      risultatiFiltrati = risultatiFiltrati.filter(evento => 
        evento.stato === statoFilter
      );
    }
    
    // Filtro per data
    if (dataFilter) {
      const dataScelta = new Date(dataFilter);
      dataScelta.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte
      
      risultatiFiltrati = risultatiFiltrati.filter(evento => {
        const dataInizio = new Date(evento.data_inizio);
        dataInizio.setHours(0, 0, 0, 0); // Confronta solo la data, non l'ora
        
        const dataFine = evento.data_fine ? new Date(evento.data_fine) : null;
        if (dataFine) dataFine.setHours(23, 59, 59, 999); // Fine della giornata
        
        // L'evento è in corso nella data selezionata se:
        // - La data di inizio è prima o uguale alla data selezionata E
        // - Non c'è data di fine O la data di fine è dopo o uguale alla data selezionata
        return dataInizio <= dataScelta && (!dataFine || dataFine >= dataScelta);
      });
    }
    
    setEventiMostrati(risultatiFiltrati);
  }, [eventi, searchTerm, statoFilter, dataFilter, tempoFilter]);

  // Formatta la data in formato leggibile
  const formatData = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Formatta l'ora in formato leggibile
  const formatOra = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">I Nostri Eventi</h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Scopri tutti gli eventi organizzati da Apelab. Filtra per data o stato 
            per trovare l'evento perfetto per te.
          </p>
        </div>
        
        {/* Filtri */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
                Cerca
              </label>
              <input
                type="text"
                id="search"
                placeholder="Cerca eventi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="md:w-48">
              <label htmlFor="stato" className="block text-sm font-medium text-slate-700 mb-1">
                Stato
              </label>
              <select
                id="stato"
                value={statoFilter}
                onChange={(e) => setStatoFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Tutti gli stati</option>
                <option value="pianificata">Pianificata</option>
                <option value="in_corso">In corso</option>
                <option value="conclusa">Conclusa</option>
                <option value="annullata">Annullata</option>
              </select>
            </div>
            
            <div className="md:w-48">
              <label htmlFor="data" className="block text-sm font-medium text-slate-700 mb-1">
                Data
              </label>
              <input
                type="date"
                id="data"
                value={dataFilter}
                onChange={(e) => setDataFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="md:w-48">
              <label htmlFor="tempo" className="block text-sm font-medium text-slate-700 mb-1">
                Tempo
              </label>
              <select
                id="tempo"
                value={tempoFilter}
                onChange={(e) => setTempoFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="tutti">Tutti</option>
                <option value="futuri">Futuri</option>
                <option value="passati">Passati</option>
              </select>
            </div>
            
            <div className="md:w-40 self-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatoFilter('');
                  setDataFilter('');
                  setTempoFilter('tutti');
                }}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Resetta filtri
              </button>
            </div>
          </div>
        </div>
        
        {/* Risultati */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-slate-600">Caricamento eventi...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : eventiMostrati.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-slate-600">Nessun evento trovato con i filtri selezionati.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatoFilter('');
                setDataFilter('');
                setTempoFilter('tutti');
              }}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Mostra tutti gli eventi
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventiMostrati.map(evento => (
              <div key={evento.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className={`h-40 ${evento.passato ? 'bg-slate-100' : 'bg-orange-100'} flex items-center justify-center`}>
                  <span className="text-6xl">{evento.passato ? '🏆' : '🎉'}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-slate-900">{evento.titolo}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${evento.passato ? 'bg-gray-100 text-gray-800' : getStatoBadgeClass(evento.stato)}`}>
                      {evento.passato ? 'Concluso' : getStatoTesto(evento.stato)}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 mb-4 line-clamp-2">{evento.descrizione}</p>
                  
                  <div className="flex flex-col space-y-2 mb-5 text-sm">
                    <div className="flex items-start">
                      <span className="mr-2 text-orange-500">📅</span> 
                      <div>
                        <div>{formatData(evento.data_inizio)}</div>
                        {evento.data_fine && evento.data_fine !== evento.data_inizio && (
                          <div className="text-slate-500">fino al {formatData(evento.data_fine)}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-orange-500">🕒</span> 
                      <div>
                        <div>Dalle {formatOra(evento.data_inizio)}</div>
                        {evento.data_fine && (
                          <div className="text-slate-500">alle {formatOra(evento.data_fine)}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-orange-500">📍</span> {evento.location}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-orange-500">👥</span> Max partecipanti: {evento.max_partecipanti}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    {evento.passato ? (
                      // CTA per evento passato
                      <Link href={`/eventi/${evento.id}`} className="w-full inline-block text-center px-4 py-2 bg-slate-700 text-white font-medium rounded-lg shadow-sm hover:bg-slate-800 transition-all">
                        Scopri come è stato
                      </Link>
                    ) : (
                      // CTA per evento futuro
                      <>
                        <Link href={`/eventi/${evento.id}`} className="flex-1 inline-block text-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg shadow-sm hover:bg-orange-600 transition-all">
                          Dettagli
                        </Link>
                        {evento.stato === 'pianificata' && (
                          <Link href={`/eventi/${evento.id}`} className="flex-1 inline-block text-center px-4 py-2 bg-white text-orange-500 font-medium border border-orange-200 rounded-lg shadow-sm hover:bg-orange-50 transition-all">
                            Partecipa
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Link per tornare alla home */}
        <div className="mt-12 text-center">
          <Link href="/" className="inline-block px-6 py-3 bg-white text-orange-500 font-medium border border-orange-200 rounded-lg shadow-sm hover:bg-orange-50 transition-all">
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
} 