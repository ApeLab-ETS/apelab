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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// Tipo per gli eventi (feste)
type Evento = {
  id: string;
  titolo: string;
  descrizione: string;
  data_inizio: string;
  data_fine: string;
  location: string;
  stato: string;
  prezzo: number;
  immagine_url?: string;
  created_at: string;
};

export default function EventiAdminPage() {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchEventi();
  }, []);

  const fetchEventi = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('feste')
        .select('*')
        .order('data_inizio', { ascending: false });

      if (error) throw error;
      
      console.log('Eventi recuperati:', data);
      setEventi(data || []);
    } catch (err: any) {
      console.error('Errore durante il recupero degli eventi:', err);
      setError('Si è verificato un errore durante il recupero degli eventi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvento = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo evento?')) return;
    
    try {
      const { error } = await supabaseClient
        .from('feste')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setEventi(eventi.filter(evento => evento.id !== id));
      toast({
        title: "Evento eliminato",
        description: "L'evento è stato eliminato con successo.",
      });
    } catch (err: any) {
      console.error('Errore durante l\'eliminazione dell\'evento:', err);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione dell'evento.",
        variant: "destructive",
      });
    }
  };

  // Filtra gli eventi in base al termine di ricerca
  const filteredEventi = eventi.filter(evento => 
    evento.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.descrizione.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatoBadgeClass = (stato: string) => {
    switch (stato.toLowerCase()) {
      case 'pianificata':
        return 'bg-blue-100 text-blue-800';
      case 'in corso':
        return 'bg-green-100 text-green-800';
      case 'completata':
        return 'bg-gray-100 text-gray-800';
      case 'annullata':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const handleCreateEvento = () => {
    router.push('/admin/eventi/nuovo');
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestione Eventi</CardTitle>
          <CardDescription>
            Amministra gli eventi e le feste dell'applicazione.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          {/* Sezione di ricerca e azioni */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Cerca eventi</Label>
              <Input
                id="search"
                placeholder="Cerca per titolo, descrizione o location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Button 
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600"
                onClick={handleCreateEvento}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuovo Evento
              </Button>
            </div>
          </div>

          {/* Tabella degli eventi */}
          {loading ? (
            <div className="text-center py-8">Caricamento eventi...</div>
          ) : filteredEventi.length === 0 ? (
            <div className="text-center py-8">Nessun evento trovato.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-orange-50 text-left">
                    <th className="p-3 border-b">Titolo</th>
                    <th className="p-3 border-b">Data</th>
                    <th className="p-3 border-b">Location</th>
                    <th className="p-3 border-b">Stato</th>
                    <th className="p-3 border-b">Prezzo</th>
                    <th className="p-3 border-b">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEventi.map((evento) => (
                    <tr key={evento.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{evento.titolo}</td>
                      <td className="p-3">
                        {new Date(evento.data_inizio).toLocaleDateString('it-IT')}
                        {evento.data_fine && evento.data_fine !== evento.data_inizio && (
                          <span> - {new Date(evento.data_fine).toLocaleDateString('it-IT')}</span>
                        )}
                      </td>
                      <td className="p-3">{evento.location}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatoBadgeClass(evento.stato)}`}>
                          {evento.stato}
                        </span>
                      </td>
                      <td className="p-3">
                        {evento.prezzo > 0 ? `€${evento.prezzo.toFixed(2)}` : 'Gratuito'}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => router.push(`/admin/eventi/modifica/${evento.id}`)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 text-red-500 hover:text-red-700 hover:border-red-300"
                            onClick={() => handleDeleteEvento(evento.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 