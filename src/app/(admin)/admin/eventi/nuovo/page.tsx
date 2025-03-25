'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NuovoEventoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    data_inizio: '',
    data_fine: '',
    ora_inizio: '',
    location: '',
    stato: 'pianificata',
    prezzo: 0,
    immagine_url: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, stato: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Controlla che i campi obbligatori siano compilati
      if (!formData.titolo || !formData.data_inizio || !formData.location) {
        throw new Error('I campi titolo, data e location sono obbligatori');
      }

      // Formatta i dati per l'inserimento
      const eventData = {
        ...formData,
        prezzo: parseFloat(formData.prezzo.toString()) || 0,
        created_at: new Date().toISOString()
      };

      // Inserisci nel database
      const { data, error } = await supabaseClient
        .from('feste')
        .insert([eventData])
        .select();

      if (error) throw error;

      console.log('Evento creato con successo:', data);
      
      // Reindirizza alla pagina degli eventi
      router.push('/admin/eventi');
      router.refresh();
    } catch (err: any) {
      console.error('Errore durante la creazione dell\'evento:', err);
      setError(err.message || 'Si è verificato un errore durante la creazione dell\'evento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => router.back()}
        >
          ← Torna indietro
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Crea nuovo evento</CardTitle>
            <CardDescription>
              Compila il form sottostante per creare un nuovo evento.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
                <p className="font-medium">Si è verificato un errore:</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titolo">Titolo *</Label>
                  <Input
                    id="titolo"
                    name="titolo"
                    value={formData.titolo}
                    onChange={handleChange}
                    placeholder="Inserisci il titolo dell'evento"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descrizione">Descrizione</Label>
                  <Textarea
                    id="descrizione"
                    name="descrizione"
                    value={formData.descrizione}
                    onChange={handleChange}
                    placeholder="Descrivi l'evento"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_inizio">Data inizio *</Label>
                    <Input
                      id="data_inizio"
                      name="data_inizio"
                      type="date"
                      value={formData.data_inizio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="data_fine">Data fine</Label>
                    <Input
                      id="data_fine"
                      name="data_fine"
                      type="date"
                      value={formData.data_fine}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ora_inizio">Ora inizio</Label>
                    <Input
                      id="ora_inizio"
                      name="ora_inizio"
                      type="time"
                      value={formData.ora_inizio}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prezzo">Prezzo (€)</Label>
                    <Input
                      id="prezzo"
                      name="prezzo"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.prezzo}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Indirizzo o luogo dell'evento"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="stato">Stato</Label>
                  <Select
                    value={formData.stato}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona lo stato dell'evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pianificata">Pianificata</SelectItem>
                      <SelectItem value="in corso">In corso</SelectItem>
                      <SelectItem value="completata">Completata</SelectItem>
                      <SelectItem value="annullata">Annullata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="immagine_url">URL Immagine</Label>
                  <Input
                    id="immagine_url"
                    name="immagine_url"
                    value={formData.immagine_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <CardFooter className="px-0 pb-0 pt-4 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creazione in corso...' : 'Crea Evento'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 