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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

type EventoFormData = {
  titolo: string;
  descrizione: string;
  data_inizio: string;
  data_fine: string;
  location: string;
  stato: 'pianificata' | 'in_corso' | 'conclusa' | 'annullata';
  immagine_url?: string;
};

export default function NuovoEventoPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<EventoFormData>({
    titolo: '',
    descrizione: '',
    data_inizio: '',
    data_fine: '',
    location: '',
    stato: 'pianificata',
    immagine_url: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Recupera l'utente corrente all'avvio
    const fetchCurrentUser = async () => {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (user && !error) {
        setCurrentUser(user.id);
      } else {
        console.error('Errore nel recuperare l\'utente:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: 'pianificata' | 'in_corso' | 'conclusa' | 'annullata') => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Verifica se l'utente è autenticato
    if (!currentUser) {
      setError('Devi essere autenticato per creare un evento');
      setSubmitting(false);
      return;
    }

    try {
      // Qui possiamo fare controlli sugli altri campi obbligatori prima di inviare al server
      const { data, error } = await supabaseClient
        .from('feste')
        .insert({
          nome: formData.titolo,
          descrizione: formData.descrizione,
          data_inizio: formData.data_inizio,
          ora_inizio: formData.data_inizio ? new Date(formData.data_inizio).toLocaleTimeString('it-IT') : '',
          luogo: formData.location,
          stato: formData.stato,
          immagine_url: formData.immagine_url || '',
          max_partecipanti: 100, // Valore di default
          tags: [], // Array vuoto di default
          creatore_id: currentUser,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Evento creato",
        description: "L'evento è stato creato con successo.",
      });
      
      router.push('/admin/eventi');
    } catch (err: any) {
      console.error('Errore durante la creazione dell\'evento:', err);
      // Mostriamo i dettagli dell'errore per il debug
      setError(`Si è verificato un errore durante il salvataggio: ${err.message || 'Errore sconosciuto'}. Codice: ${err.code || 'N/A'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nuovo Evento</CardTitle>
          <CardDescription>
            Crea un nuovo evento o festa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="titolo">Titolo dell'evento *</Label>
                <Input
                  id="titolo"
                  name="titolo"
                  value={formData.titolo}
                  onChange={handleChange}
                  required
                  placeholder="Inserisci un titolo accattivante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Dove si terrà l'evento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_inizio">Data e ora di inizio *</Label>
                <Input
                  id="data_inizio"
                  name="data_inizio"
                  type="datetime-local"
                  value={formData.data_inizio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fine">Data e ora di fine</Label>
                <Input
                  id="data_fine"
                  name="data_fine"
                  type="datetime-local"
                  value={formData.data_fine}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stato">Stato dell'evento *</Label>
                <Select 
                  value={formData.stato} 
                  onValueChange={(value: 'pianificata' | 'in_corso' | 'conclusa' | 'annullata') => handleSelectChange('stato', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona uno stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pianificata">Pianificata</SelectItem>
                    <SelectItem value="in_corso">In corso</SelectItem>
                    <SelectItem value="conclusa">Conclusa</SelectItem>
                    <SelectItem value="annullata">Annullata</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="immagine_url">URL Immagine</Label>
                <Input
                  id="immagine_url"
                  name="immagine_url"
                  value={formData.immagine_url || ''}
                  onChange={handleChange}
                  placeholder="https://esempio.com/immagine.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descrizione">Descrizione dell'evento *</Label>
              <Textarea
                id="descrizione"
                name="descrizione"
                value={formData.descrizione}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Fornisci una descrizione dettagliata dell'evento"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/eventi')}
                disabled={submitting}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={submitting}
              >
                {submitting ? 'Creazione in corso...' : 'Crea Evento'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 