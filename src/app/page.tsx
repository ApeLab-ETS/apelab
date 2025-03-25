'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type Evento = {
  id: string;
  titolo: string;
  descrizione: string;
  data_inizio: string;
  data_fine: string;
  location: string;
  stato: string;
  passato?: boolean;
};

export default function Home() {
  const [eventoInEvidenza, setEventoInEvidenza] = useState<Evento | null>(null);
  const [prossimiEventi, setProssimiEventi] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventi() {
      setLoading(true);
      try {
        // Recupera gli eventi futuri ordinati per data
        const { data: eventiFuturi, error: errorFuturi } = await supabaseClient
          .from('feste')
          .select('*')
          .gte('data_inizio', new Date().toISOString())
          .order('data_inizio', { ascending: true });

        if (errorFuturi) throw errorFuturi;

        // Se non ci sono eventi futuri, recupera gli eventi passati più recenti
        if (!eventiFuturi || eventiFuturi.length === 0) {
          const { data: eventiPassati, error: errorPassati } = await supabaseClient
            .from('feste')
            .select('*')
            .lt('data_inizio', new Date().toISOString())
            .order('data_inizio', { ascending: false }) // Ordine decrescente per ottenere i più recenti
            .limit(3); // Limitiamo a 3 eventi

          if (errorPassati) throw errorPassati;

          // Mappa i campi dal database ai nomi utilizzati nel frontend per eventi passati
          const eventiPassatiMappati = eventiPassati?.map(evento => ({
            id: evento.id,
            titolo: evento.nome || '',
            descrizione: evento.descrizione || '',
            data_inizio: evento.data_inizio || '',
            data_fine: evento.data_fine || '',
            location: evento.luogo || '',
            stato: evento.stato || '',
            passato: true, // Aggiungiamo un flag per indicare che è un evento passato
          })) || [];

          if (eventiPassatiMappati.length > 0) {
            setEventoInEvidenza(eventiPassatiMappati[0]);
            setProssimiEventi(eventiPassatiMappati); // Tutti gli eventi passati (massimo 3)
          }
        } else {
          // Mappa i campi dal database ai nomi utilizzati nel frontend per eventi futuri
          const eventiFuturiMappati = eventiFuturi?.map(evento => ({
            id: evento.id,
            titolo: evento.nome || '',
            descrizione: evento.descrizione || '',
            data_inizio: evento.data_inizio || '',
            data_fine: evento.data_fine || '',
            location: evento.luogo || '',
            stato: evento.stato || '',
            passato: false,
          })) || [];

          // Il primo evento è quello in evidenza
          if (eventiFuturiMappati.length > 0) {
            setEventoInEvidenza(eventiFuturiMappati[0]);
            setProssimiEventi(eventiFuturiMappati.slice(0, 3)); // Primi 3 eventi
          }
        }
      } catch (err) {
        console.error('Errore durante il recupero degli eventi:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEventi();
  }, []);

  // Formatta la data in formato italiano
  const formatData = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* Banner evento in primo piano */}
      {eventoInEvidenza && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 text-center">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <p className="font-medium inline-block">
              {eventoInEvidenza.passato ? '🏆 Evento recente: ' : '🎉 Prossimo evento: '}
              <span className="font-bold">{eventoInEvidenza.titolo}</span> - {formatData(eventoInEvidenza.data_inizio)}
            </p>
          </div>
        </div>
      )}
      
      <header className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Hero section con CTA */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
            <span className="text-orange-500">Apelab</span> Eventi
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-10">
            Le feste più vibranti di Bolzano, con DJ incredibili,
            aperitivi esclusivi e la miglior atmosfera per il pubblico giovane.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/eventi"
              className="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg shadow-lg hover:bg-orange-600 transition-all"
            >
              Scopri gli Eventi
            </a>
            <a
              href="/auth/login"
              className="px-8 py-3 bg-white text-orange-500 font-medium border border-orange-200 rounded-lg shadow-sm hover:bg-orange-50 transition-all"
            >
              Accedi
            </a>
          </div>
        </div>

        {/* Card evento in evidenza */}
        {eventoInEvidenza && (
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
            <div className="md:flex">
              <div className="md:w-2/5 bg-orange-100 flex items-center justify-center p-12">
                <span className="text-9xl">🎉</span>
              </div>
              <div className="md:w-3/5 p-8">
                <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold">Evento in evidenza</div>
                <h2 className="text-3xl font-extrabold tracking-tight mt-1 mb-3">{eventoInEvidenza.titolo}</h2>
                <p className="text-slate-600 mb-6">
                  {eventoInEvidenza.descrizione}
                </p>
                <div className="flex flex-col space-y-2 mb-6 text-slate-700">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span> {formatData(eventoInEvidenza.data_inizio)}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📍</span> {eventoInEvidenza.location}
                  </div>
                </div>
                <Link href={`/eventi/${eventoInEvidenza.id}`} className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow-md hover:bg-orange-600 transition-all">
                  Scopri di più
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* I nostri eventi */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Cosa Aspettarsi ai Nostri Eventi
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🎵
              </div>
              <h3 className="text-xl font-semibold mb-3">Musica Coinvolgente</h3>
              <p className="text-slate-600">
                I migliori DJ della città ti faranno ballare tutta la notte con selezioni musicali
                che spaziano dall'elettronica all'hip-hop, passando per i tormentoni del momento.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🍹
              </div>
              <h3 className="text-xl font-semibold mb-3">Drink Esclusivi</h3>
              <p className="text-slate-600">
                Cocktail speciali e aperitivi innovativi preparati dai nostri bartender esperti,
                per un'esperienza di gusto che accompagna la tua serata.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6 text-2xl">
                👥
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Vibrante</h3>
              <p className="text-slate-600">
                Una comunità giovane e dinamica con cui condividere momenti indimenticabili
                in un'atmosfera accogliente e sempre stimolante.
              </p>
            </div>
          </div>
        </div>
        
        {/* Prossimi eventi */}
        {prossimiEventi.length > 0 && (
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
              {prossimiEventi[0].passato ? 'Eventi Recenti' : 'Prossimi Eventi'}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {prossimiEventi.map(evento => (
                <div key={evento.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-40 bg-orange-100 flex items-center justify-center">
                    <span className="text-6xl">🎉</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{evento.titolo}</h3>
                    <div className="flex flex-col space-y-2 mb-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <span className="mr-2">📅</span> {formatData(evento.data_inizio)}
                        {evento.passato && <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Concluso</span>}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📍</span> {evento.location}
                      </div>
                    </div>
                    <Link href={`/eventi/${evento.id}`} className="inline-block w-full text-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg shadow-sm hover:bg-orange-600 transition-all">
                      {evento.passato ? 'Scopri come è stato' : 'Dettagli'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link href="/eventi" className="inline-block px-6 py-3 bg-white text-orange-500 font-medium border border-orange-200 rounded-lg shadow-sm hover:bg-orange-50 transition-all">
                Vedi tutti gli eventi
              </Link>
            </div>
          </div>
        )}
        
        {/* Gallery Eventi */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Eventi Che Creano Ricordi
                </h2>
                <p className="text-white text-opacity-90 text-lg mb-8">
                  Dal 2020 organizziamo le feste più memorabili di Bolzano, creando spazi 
                  dove la musica, le persone e il divertimento si fondono in un'esperienza unica.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-3">
                    <div className="text-2xl font-bold text-white">13</div>
                    <div className="text-white text-opacity-80 text-sm">Eventi all'anno</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-3">
                    <div className="text-2xl font-bold text-white">1200+</div>
                    <div className="text-white text-opacity-80 text-sm">Partecipanti felici</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-3">
                    <div className="text-2xl font-bold text-white">5+</div>
                    <div className="text-white text-opacity-80 text-sm">Location esclusive</div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                <img src="/images/event1.jpg" alt="Evento" className="rounded-lg shadow-lg h-40 w-full object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/400x300/FFBB5C/FFF?text=Apelab'} />
                <img src="/images/event2.jpg" alt="Evento" className="rounded-lg shadow-lg h-40 w-full object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/400x300/FF9B50/FFF?text=Eventi'} />
                <img src="/images/event3.jpg" alt="Evento" className="rounded-lg shadow-lg h-40 w-full object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/400x300/E25E3E/FFF?text=Musica'} />
                <img src="/images/event4.jpg" alt="Evento" className="rounded-lg shadow-lg h-40 w-full object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/400x300/C63D2F/FFF?text=Aperitivi'} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">👩‍🦰</span>
              </div>
              <div>
                <p className="text-slate-600 text-lg mb-4 italic">
                  "Gli eventi di Apelab sono semplicemente i migliori di Bolzano! L'atmosfera è incredibile, 
                  la musica sempre perfetta e conosci sempre persone nuove e interessanti. Ogni festa è un'esperienza 
                  unica, non vedo l'ora del prossimo evento!"
                </p>
                <div>
                  <p className="font-bold text-slate-900">Laura Bianchi</p>
                  <p className="text-orange-500">Partecipante regolare</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-orange-400">Ape</span>lab
              </h2>
              <p className="text-slate-400 mt-2">Eventi che creano ricordi a Bolzano</p>
            </div>
            
            <div className="flex gap-6">
              <a href="/eventi" className="text-slate-300 hover:text-white">Eventi</a>
              <a href="/foto" className="text-slate-300 hover:text-white">Galleria</a>
              <a href="/chi-siamo" className="text-slate-300 hover:text-white">Chi Siamo</a>
              <a href="/contatti" className="text-slate-300 hover:text-white">Contatti</a>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Apelab. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
