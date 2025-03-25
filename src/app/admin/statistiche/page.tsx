'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AlertCircle, Users, CalendarClock, MapPin, Calendar } from 'lucide-react';

// Whitelist di email autorizzate come admin (per consistenza con le altre pagine)
const ADMIN_EMAILS = [
  'mail@francescomasala.me',
  // Aggiungi altre email se necessario
];

type StatisticheData = {
  utentiTotali: number;
  eventiTotali: number;
  eventiPassati: number;
  eventiFuturi: number;
  eventiPerMese: Record<string, number>;
  eventiPerLuogo: Record<string, number>;
  eventiPerStato: Record<string, number>;
  mediaPartecipanti: number;
};

export default function StatisticheAdminPage() {
  const [stats, setStats] = useState<StatisticheData>({
    utentiTotali: 0,
    eventiTotali: 0,
    eventiPassati: 0,
    eventiFuturi: 0,
    eventiPerMese: {},
    eventiPerLuogo: {},
    eventiPerStato: {},
    mediaPartecipanti: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Controlla se l'utente è autenticato e se è admin
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (!session) {
        router.push('/auth/login?next=/admin/statistiche');
        return;
      }

      // Verifica se l'utente è nella whitelist degli admin
      const userEmail = session.user.email;
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        console.log('Non autorizzato - email non in whitelist:', userEmail);
        router.push('/');
        return;
      }

      // Carica le statistiche se l'autenticazione è ok
      fetchStatistiche();
    };

    checkAuth();
  }, [router]);

  // Recupera le statistiche
  const fetchStatistiche = async () => {
    setLoading(true);
    try {
      // Ottieni la data corrente in formato ISO (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      
      // 1. Conteggio utenti totali
      const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers();
      const utentiTotali = userData?.users?.length || 0;

      if (userError) {
        console.warn("Errore nel recupero degli utenti:", userError);
      }

      // 2. Ottieni tutti gli eventi
      const { data: eventiData, error: eventiError } = await supabaseClient
        .from('feste')
        .select('*');

      if (eventiError) throw eventiError;
      
      // Calcola le statistiche degli eventi
      const eventi = eventiData || [];
      const eventiTotali = eventi.length;
      const eventiPassati = eventi.filter(e => e.data_inizio < today).length;
      const eventiFuturi = eventi.filter(e => e.data_inizio >= today).length;
      
      // Statistiche eventi per mese
      const eventiPerMese: Record<string, number> = {};
      eventi.forEach(evento => {
        const mese = evento.data_inizio.substring(0, 7); // YYYY-MM
        eventiPerMese[mese] = (eventiPerMese[mese] || 0) + 1;
      });
      
      // Statistiche eventi per luogo
      const eventiPerLuogo: Record<string, number> = {};
      eventi.forEach(evento => {
        eventiPerLuogo[evento.luogo] = (eventiPerLuogo[evento.luogo] || 0) + 1;
      });
      
      // Statistiche eventi per stato
      const eventiPerStato: Record<string, number> = {};
      eventi.forEach(evento => {
        eventiPerStato[evento.stato] = (eventiPerStato[evento.stato] || 0) + 1;
      });
      
      // Media partecipanti
      const totalMaxPartecipanti = eventi.reduce((sum, evento) => sum + evento.max_partecipanti, 0);
      const mediaPartecipanti = eventiTotali > 0 ? Math.round(totalMaxPartecipanti / eventiTotali) : 0;
      
      // Aggiorna lo state con tutte le statistiche calcolate
      setStats({
        utentiTotali,
        eventiTotali,
        eventiPassati,
        eventiFuturi,
        eventiPerMese,
        eventiPerLuogo,
        eventiPerStato,
        mediaPartecipanti
      });
      
      console.log('Statistiche caricate:', {
        utentiTotali,
        eventiTotali,
        eventiPassati,
        eventiFuturi,
        eventiPerMese,
        eventiPerLuogo,
        eventiPerStato,
        mediaPartecipanti
      });
    } catch (err: any) {
      console.error('Errore durante il recupero delle statistiche:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per formattare un mese YYYY-MM in formato leggibile (es. "Maggio 2024")
  const formatMese = (mese: string) => {
    if (!mese) return '';
    try {
      const [anno, mese_num] = mese.split('-');
      const data = new Date(parseInt(anno), parseInt(mese_num) - 1, 1);
      return data.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    } catch (e) {
      return mese;
    }
  };

  // Funzione per formattare lo stato dell'evento
  const formatStato = (stato: string) => {
    switch (stato) {
      case 'pianificata': return 'Pianificata';
      case 'in_corso': return 'In corso';
      case 'conclusa': return 'Conclusa';
      case 'annullata': return 'Annullata';
      default: return stato;
    }
  };

  // Converte un oggetto { key: value } in un array di oggetti [{ name: key, value: value }]
  // e lo ordina per value in ordine decrescente
  const prepareChartData = (data: Record<string, number>, formatter?: (key: string) => string) => {
    return Object.entries(data)
      .map(([key, value]) => ({ 
        name: formatter ? formatter(key) : key, 
        value 
      }))
      .sort((a, b) => b.value - a.value);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Statistiche</h1>
        <p className="text-gray-600 mt-2">
          Panoramica delle statistiche relative a utenti ed eventi
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Si è verificato un errore</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Caricamento statistiche...</div>
      ) : (
        <>
          {/* Statistiche generali */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-2" /> Utenti Totali
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.utentiTotali}</div>
                <p className="text-sm text-gray-600 mt-1">Account registrati</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> Eventi Totali
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.eventiTotali}</div>
                <p className="text-sm text-gray-600 mt-1">Eventi organizzati</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2" /> Eventi Futuri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.eventiFuturi}</div>
                <p className="text-sm text-gray-600 mt-1">In programma</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-2" /> Media Partecipanti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.mediaPartecipanti}</div>
                <p className="text-sm text-gray-600 mt-1">Per evento</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Statistiche dettagliate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Eventi per Mese</CardTitle>
                <CardDescription>Distribuzione degli eventi nei mesi</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.eventiPerMese).length === 0 ? (
                  <div className="text-center py-6 text-gray-500">Nessun dato disponibile</div>
                ) : (
                  <div className="space-y-2">
                    {prepareChartData(stats.eventiPerMese, formatMese).map(({ name, value }) => (
                      <div key={name} className="flex items-center">
                        <div className="w-36 font-medium">{name}</div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-100 rounded-full h-4">
                            <div 
                              className="bg-orange-500 h-4 rounded-full" 
                              style={{ width: `${Math.min(100, (value / Math.max(...Object.values(stats.eventiPerMese))) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-8 text-right ml-2">{value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Eventi per Stato</CardTitle>
                <CardDescription>Distribuzione degli eventi per stato</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.eventiPerStato).length === 0 ? (
                  <div className="text-center py-6 text-gray-500">Nessun dato disponibile</div>
                ) : (
                  <div className="space-y-4">
                    {prepareChartData(stats.eventiPerStato, formatStato).map(({ name, value }) => (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{name}</span>
                          <span>{value} ({Math.round((value / stats.eventiTotali) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div 
                            className="bg-orange-500 h-2.5 rounded-full" 
                            style={{ width: `${(value / stats.eventiTotali) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Eventi per Luogo</CardTitle>
              <CardDescription>Luoghi più frequenti per gli eventi</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.eventiPerLuogo).length === 0 ? (
                <div className="text-center py-6 text-gray-500">Nessun dato disponibile</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prepareChartData(stats.eventiPerLuogo).slice(0, 9).map(({ name, value }) => (
                    <div key={name} className="bg-orange-50 p-4 rounded-lg flex items-center">
                      <div className="bg-orange-100 p-2 rounded-md mr-3">
                        <MapPin className="h-5 w-5 text-orange-700" />
                      </div>
                      <div>
                        <div className="font-medium line-clamp-1">{name}</div>
                        <div className="text-sm text-gray-600">{value} eventi</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-md mr-4">
                <AlertCircle className="h-6 w-6 text-orange-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-orange-800 mb-1">Suggerimenti per migliorare</h3>
                <p className="text-gray-700 mb-4">
                  In base alle statistiche raccolte, ecco alcuni suggerimenti per migliorare l'organizzazione degli eventi:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Le location più popolari sono quelle dove gli eventi hanno maggior successo</li>
                  <li>Pianifica gli eventi con anticipo, specialmente per i mesi con maggiore affluenza</li>
                  <li>Monitora il tasso di partecipazione per ottimizzare il numero di posti disponibili</li>
                  <li>Verifica i motivi di eventuali cancellazioni per migliorare i prossimi eventi</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 