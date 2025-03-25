'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient, Profile } from '@/lib/supabase/client';
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

export default function UsersAdminPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  // Controlla se l'utente è autenticato e se è admin
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
      console.log('Sessione utente:', session);

      if (!session) {
        router.push('/auth/login?next=/admin/users');
        return;
      }

      // Ottieni il profilo dell'utente per verificare il ruolo
      const { data: profile, error } = await supabaseClient
        .from('utenti')  // Modificato da 'profiles' a 'utenti'
        .select('*')
        .eq('id', session.user.id)
        .single();

      console.log('Profilo utente:', profile, 'Errore:', error);

      if (error || !profile || profile.ruolo !== 'admin') {
        console.log('Non autorizzato - reindirizzamento alla home');
        router.push('/');
        return;
      }

      // Carica gli utenti se l'autenticazione è ok
      fetchUsers();
    };

    checkAuth();
  }, [router]);

  // Recupera gli utenti dal database
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('utenti')  // Modificato da 'profiles' a 'utenti'
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Utenti caricati:', data);
      setUsers(data || []);
    } catch (err: any) {
      console.error('Errore durante il recupero degli utenti:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtra gli utenti in base al termine di ricerca
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cognome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cambia il ruolo dell'utente
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'organizzatore' | 'utente') => {
    try {
      const { error } = await supabaseClient
        .from('utenti')  // Modificato da 'profiles' a 'utenti'
        .update({ ruolo: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      // Aggiorna la lista degli utenti
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ruolo: newRole } : user
      ));
    } catch (err: any) {
      console.error('Errore durante la modifica del ruolo:', err);
      setError(err.message);
    }
  };

  if (!session) {
    return <div className="p-8 text-center">Reindirizzamento al login...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestione Utenti</CardTitle>
          <CardDescription>
            Amministra gli utenti dell'applicazione, modifica i ruoli e gestisci gli account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          {/* Sezione di ricerca */}
          <div className="mb-6">
            <Label htmlFor="search">Cerca utenti</Label>
            <Input
              id="search"
              placeholder="Cerca per email, nome o cognome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Tabella degli utenti */}
          {loading ? (
            <div className="text-center py-8">Caricamento utenti...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">Nessun utente trovato.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-orange-50 text-left">
                    <th className="p-3 border-b">Nome completo</th>
                    <th className="p-3 border-b">Email</th>
                    <th className="p-3 border-b">Telefono</th>
                    <th className="p-3 border-b">Ruolo</th>
                    <th className="p-3 border-b">Data registrazione</th>
                    <th className="p-3 border-b">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {user.nome} {user.cognome}
                      </td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.telefono || '-'}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          user.ruolo === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : user.ruolo === 'organizzatore' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {user.ruolo}
                        </span>
                      </td>
                      <td className="p-3">
                        {new Date(user.created_at).toLocaleDateString('it-IT')}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <select 
                            value={user.ruolo}
                            onChange={(e) => handleRoleChange(
                              user.id, 
                              e.target.value as 'admin' | 'organizzatore' | 'utente'
                            )}
                            className="text-sm rounded border border-gray-300 p-1"
                          >
                            <option value="utente">Utente</option>
                            <option value="organizzatore">Organizzatore</option>
                            <option value="admin">Admin</option>
                          </select>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                          >
                            Dettagli
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