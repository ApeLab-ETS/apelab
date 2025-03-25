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
  stato: string;
  prezzo: number;
  immagine_url?: string;
};

export default function ModificaEventoForm({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<EventoFormData>({
    titolo: '',
    descrizione: '',
    data_inizio: '',
    data_fine: '',
    location: '',
    stato: 'pianificata',
    prezzo: 0,
    immagine_url: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvento();
  }, [id]);

  const fetchEvento = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('feste')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        // Formatta le date per l'input type="datetime-local"
        const formatDateForInput = (dateString: string) => {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        };

        setFormData({
          titolo: data.titolo || '',
          descrizione: data.descrizione || '',
          data_inizio: data.data_inizio ? formatDateForInput(data.data_inizio) : '',
          data_fine: data.data_fine ? formatDateForInput(data.data_fine) : '',
          location: data.location || '',
          stato: data.stato || 'pianificata',
          prezzo: data.prezzo || 0,
          immagine_url: data.immagine_url || '',
        });
      }
    } catch (err: any) {
      console.error('Errore nel recupero dell\'evento:', err);
      setError('Non è stato possibile recuperare i dati dell\'evento.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
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

    try {
      const { error } = await supabaseClient
        .from('feste')
        .update({
          titolo: formData.titolo,
          descrizione: formData.descrizione,
          data_inizio: formData.data_inizio,
          data_fine: formData.data_fine,
          location: formData.location,
          stato: formData.stato,
          prezzo: formData.prezzo,
          immagine_url: formData.immagine_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Evento aggiornato",
        description: "L'evento è stato aggiornato con successo.",
      });
      
      router.push('/admin/eventi');
    } catch (err: any) {
      console.error('Errore durante l\'aggiornamento dell\'evento:', err);
      setError('Si è verificato un errore durante il salvataggio. Riprova più tardi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">Caricamento dati evento...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Modifica Evento</CardTitle>
          <CardDescription>
            Aggiorna i dettagli dell'evento esistente.
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
                <Label htmlFor="prezzo">Prezzo (€)</Label>
                <Input
                  id="prezzo"
                  name="prezzo"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prezzo}
                  onChange={handleNumberChange}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stato">Stato dell'evento *</Label>
                <Select 
                  value={formData.stato} 
                  onValueChange={(value: string) => handleSelectChange('stato', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona uno stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pianificata">Pianificata</SelectItem>
                    <SelectItem value="in corso">In corso</SelectItem>
                    <SelectItem value="completata">Completata</SelectItem>
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
                {submitting ? 'Salvataggio...' : 'Salva modifiche'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 