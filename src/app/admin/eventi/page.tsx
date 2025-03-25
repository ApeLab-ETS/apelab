'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient, Festa } from '@/lib/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Clock, MapPin, Users, Tag, Plus, Trash, Edit, Check, X } from 'lucide-react';

// Whitelist di email autorizzate come admin (per consistenza con le altre pagine)
const ADMIN_EMAILS = [
  'mail@francescomasala.me',
  // Aggiungi altre email se necessario
];

export default function EventiAdminPage() {
  const [eventi, setEventi] = useState<Festa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Festa>>({
    nome: '',
    descrizione: '',
    data_inizio: new Date().toISOString().split('T')[0],
    ora_inizio: '18:00',
    luogo: '',
    max_partecipanti: 50,
    tags: [],
    stato: 'pianificata',
    immagine_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const router = useRouter();

  // Controlla se l'utente è autenticato e se è admin
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);

      if (!session) {
        router.push('/auth/login?next=/admin/eventi');
        return;
      }

      // Verifica se l'utente è nella whitelist degli admin
      const userEmail = session.user.email;
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        console.log('Non autorizzato - email non in whitelist:', userEmail);
        router.push('/');
        return;
      }

      // Carica gli eventi se l'autenticazione è ok
      fetchEventi();
    };

    checkAuth();
  }, [router]);

  // Recupera gli eventi dal database
  const fetchEventi = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('feste')
        .select('*')
        .order('data_inizio', { ascending: true });

      if (error) throw error;
      console.log('Eventi caricati:', data);
      setEventi(data || []);
    } catch (err: any) {
      console.error('Errore durante il recupero degli eventi:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtra gli eventi in base al termine di ricerca
  const filteredEventi = eventi.filter(evento => 
    evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.descrizione.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.luogo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestione del form per l'evento
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !currentEvent.tags?.includes(tagInput.trim())) {
      setCurrentEvent(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setCurrentEvent(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  // Salva l'evento nel database
  const handleSaveEvent = async () => {
    try {
      if (!currentEvent.nome || !currentEvent.data_inizio || !currentEvent.luogo) {
        setError('Nome, data e luogo sono campi obbligatori');
        return;
      }

      if (isEditing && currentEvent.id) {
        // Aggiornamento evento esistente
        const { error } = await supabaseClient
          .from('feste')
          .update({
            nome: currentEvent.nome,
            descrizione: currentEvent.descrizione,
            data_inizio: currentEvent.data_inizio,
            ora_inizio: currentEvent.ora_inizio,
            luogo: currentEvent.luogo,
            max_partecipanti: currentEvent.max_partecipanti,
            stato: currentEvent.stato,
            tags: currentEvent.tags,
            immagine_url: currentEvent.immagine_url
          })
          .eq('id', currentEvent.id);

        if (error) throw error;
        console.log('Evento aggiornato con successo');
      } else {
        // Creazione nuovo evento
        const { error } = await supabaseClient
          .from('feste')
          .insert({
            nome: currentEvent.nome,
            descrizione: currentEvent.descrizione,
            data_inizio: currentEvent.data_inizio,
            ora_inizio: currentEvent.ora_inizio,
            luogo: currentEvent.luogo,
            max_partecipanti: currentEvent.max_partecipanti,
            creatore_id: session.user.id,
            stato: currentEvent.stato,
            tags: currentEvent.tags,
            immagine_url: currentEvent.immagine_url
          });

        if (error) throw error;
        console.log('Nuovo evento creato con successo');
      }

      // Ricarica gli eventi e chiudi il modale
      fetchEventi();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Errore durante il salvataggio dell\'evento:', err);
      setError(err.message);
    }
  };

  // Elimina un evento
  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo evento?')) return;
    
    try {
      const { error } = await supabaseClient
        .from('feste')
        .delete()
        .eq('id', id);

      if (error) throw error;
      console.log('Evento eliminato con successo');
      
      // Ricarica gli eventi
      fetchEventi();
    } catch (err: any) {
      console.error('Errore durante l\'eliminazione dell\'evento:', err);
      setError(err.message);
    }
  };

  // Apri il modale per modificare un evento
  const handleEditEvent = (evento: Festa) => {
    setCurrentEvent(evento);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Apri il modale per creare un nuovo evento
  const handleNewEvent = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Resetta il form
  const resetForm = () => {
    setCurrentEvent({
      nome: '',
      descrizione: '',
      data_inizio: new Date().toISOString().split('T')[0],
      ora_inizio: '18:00',
      luogo: '',
      max_partecipanti: 50,
      tags: [],
      stato: 'pianificata',
      immagine_url: ''
    });
    setTagInput('');
  };

  const getStatoColor = (stato: string) => {
    switch (stato) {
      case 'pianificata': return 'bg-blue-100 text-blue-800';
      case 'in_corso': return 'bg-green-100 text-green-800';
      case 'conclusa': return 'bg-gray-100 text-gray-800';
      case 'annullata': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!session) {
    return <div className="p-8 text-center">Reindirizzamento al login...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Gestione Eventi</CardTitle>
            <CardDescription>
              Crea, modifica e monitora gli eventi della piattaforma
            </CardDescription>
          </div>
          <Button 
            onClick={handleNewEvent} 
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuovo Evento
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Si è verificato un errore</p>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {/* Sezione di ricerca */}
          <div className="mb-6">
            <Label htmlFor="search">Cerca eventi</Label>
            <Input
              id="search"
              placeholder="Cerca per nome, descrizione o luogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Lista degli eventi */}
          {loading ? (
            <div className="text-center py-8">Caricamento eventi...</div>
          ) : filteredEventi.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nessun evento trovato.</p>
              <Button 
                onClick={handleNewEvent} 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" /> Crea il tuo primo evento
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEventi.map((evento) => (
                <Card key={evento.id} className="overflow-hidden">
                  {evento.immagine_url && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={evento.immagine_url} 
                        alt={evento.nome} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{evento.nome}</CardTitle>
                      <Badge className={getStatoColor(evento.stato)}>
                        {evento.stato.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {evento.descrizione}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(evento.data_inizio).toLocaleDateString('it-IT')}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{evento.ora_inizio}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{evento.luogo}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Max {evento.max_partecipanti} partecipanti</span>
                      </div>
                      {evento.tags && evento.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {evento.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="bg-orange-50">
                              <Tag className="h-3 w-3 mr-1" /> {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteEvent(evento.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Elimina
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => handleEditEvent(evento)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Modifica
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modale per creare/modificare eventi */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Modifica evento' : 'Crea nuovo evento'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modifica i dettagli dell\'evento esistente' 
                : 'Compila il form per creare un nuovo evento'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome evento*</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={currentEvent.nome}
                  onChange={handleInputChange}
                  placeholder="Summer Party"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="data_inizio">Data*</Label>
                <Input
                  id="data_inizio"
                  name="data_inizio"
                  type="date"
                  value={currentEvent.data_inizio}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="ora_inizio">Ora</Label>
                <Input
                  id="ora_inizio"
                  name="ora_inizio"
                  type="time"
                  value={currentEvent.ora_inizio}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="luogo">Luogo*</Label>
                <Input
                  id="luogo"
                  name="luogo"
                  value={currentEvent.luogo}
                  onChange={handleInputChange}
                  placeholder="Bolzano, Centrum"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="max_partecipanti">Numero massimo partecipanti</Label>
                <Input
                  id="max_partecipanti"
                  name="max_partecipanti"
                  type="number"
                  min="1"
                  value={currentEvent.max_partecipanti}
                  onChange={handleNumberChange}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="descrizione">Descrizione</Label>
                <Textarea
                  id="descrizione"
                  name="descrizione"
                  value={currentEvent.descrizione}
                  onChange={handleInputChange}
                  placeholder="Descrivi il tuo evento"
                  className="h-24"
                />
              </div>
              
              <div>
                <Label htmlFor="stato">Stato</Label>
                <select
                  id="stato"
                  name="stato"
                  value={currentEvent.stato}
                  onChange={(e) => setCurrentEvent(prev => ({...prev, stato: e.target.value as any}))}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                >
                  <option value="pianificata">Pianificata</option>
                  <option value="in_corso">In corso</option>
                  <option value="conclusa">Conclusa</option>
                  <option value="annullata">Annullata</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="immagine_url">URL immagine copertina</Label>
                <Input
                  id="immagine_url"
                  name="immagine_url"
                  value={currentEvent.immagine_url}
                  onChange={handleInputChange}
                  placeholder="https://esempio.com/immagine.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tag</Label>
                <div className="flex">
                  <Input
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Aggiungi tag e premi Enter"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={handleTagAdd}
                    className="ml-2 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentEvent.tags?.map((tag, index) => (
                    <Badge key={index} className="bg-orange-100 text-orange-800">
                      {tag}
                      <button 
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 text-orange-600 hover:text-orange-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Annulla
            </Button>
            <Button 
              type="button" 
              onClick={handleSaveEvent}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              {isEditing ? 'Aggiorna evento' : 'Crea evento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 