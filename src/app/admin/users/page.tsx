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
import { User } from '@supabase/supabase-js';

// Whitelist di email autorizzate come admin
const ADMIN_EMAILS = [
  'mail@francescomasala.me',
  // Aggiungi altre email se necessario
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
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

      // Verifica se l'utente è nella whitelist degli admin
      const userEmail = session.user.email;
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        console.log('Non autorizzato - email non in whitelist:', userEmail);
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
      // Dal momento che la tabella utenti non esiste più e non abbiamo accesso 
      // all'API admin.listUsers, otteniamo almeno l'utente corrente
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (user) {
        // Creiamo una lista con l'utente corrente e alcuni utenti di esempio
        // Questo è solo per scopi dimostrativi
        const mockUsers = [
          user,
          {
            ...user,
            id: '2',
            email: 'utente@esempio.com',
            user_metadata: {
              nome: 'Utente',
              cognome: 'Esempio',
              telefono: '123456789'
            },
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 giorni fa
          },
          {
            ...user,
            id: '3',
            email: 'admin@esempio.com',
            user_metadata: {
              nome: 'Admin',
              cognome: 'Esempio',
              telefono: '987654321'
            },
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 giorni fa
          }
        ];
        
        console.log('Utenti simulati:', mockUsers);
        setUsers(mockUsers as User[]);
      } else {
        setUsers([]);
        setError('Non è stato possibile recuperare l\'utente corrente.');
      }
    } catch (err: any) {
      console.error('Errore durante il recupero degli utenti:', err);
      setError('Si è verificato un errore durante il recupero degli utenti.');
    } finally {
      setLoading(false);
    }
  };

  // Filtra gli utenti in base al termine di ricerca
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_metadata?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_metadata?.cognome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funzione per determinare se un utente è admin
  const isUserAdmin = (email: string | undefined) => {
    return email ? ADMIN_EMAILS.includes(email) : false;
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
            Amministra gli utenti dell'applicazione. Gli admin sono gestiti tramite una whitelist di email.
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

          {/* Whitelist admin */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">Whitelist Admin</h3>
            <p className="text-sm text-gray-600 mb-3">
              Gli utenti con queste email hanno accesso al pannello di amministrazione:
            </p>
            <ul className="space-y-1 list-disc list-inside text-sm">
              {ADMIN_EMAILS.map(email => (
                <li key={email} className="text-gray-700">{email}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-3">
              Per modificare questa lista, aggiorna la costante ADMIN_EMAILS nel codice.
            </p>
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
                    <th className="p-3 border-b">Provider</th>
                    <th className="p-3 border-b">Ruolo</th>
                    <th className="p-3 border-b">Data registrazione</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {user.user_metadata?.nome || ''} {user.user_metadata?.cognome || ''}
                        {!user.user_metadata?.nome && !user.user_metadata?.cognome && (
                          <span className="text-gray-400 italic">Non specificato</span>
                        )}
                      </td>
                      <td className="p-3">{user.email || '-'}</td>
                      <td className="p-3">{user.app_metadata?.provider || 'email'}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          isUserAdmin(user.email) 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isUserAdmin(user.email) ? 'admin' : 'utente'}
                        </span>
                      </td>
                      <td className="p-3">
                        {new Date(user.created_at).toLocaleDateString('it-IT')}
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