'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { title } from '@/components/primitives';

export default function AdminDebugPage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Verifica se le variabili d'ambiente necessarie sono configurate
    // Spostiamo il controllo su window all'interno dell'useEffect per evitare problemi di hydration
    const isLocalhost = typeof window !== 'undefined' && 
      window.location.host.includes('localhost');
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isLocalhost && !isDevelopment) {
      setConfigError('Questa pagina è disponibile solo in ambiente di sviluppo');
      setIsLoading(false);
      return;
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setConfigError('Configurazione Supabase mancante. Assicurati di avere configurato il file .env.local con le chiavi necessarie.');
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          setError('Nessuna sessione attiva');
          return;
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        setUser(user);
      } catch (err: any) {
        console.error('Errore durante il controllo dell\'autenticazione:', err);
        setError('Errore: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [supabase]);

  if (configError) {
    return (
      <div className="p-8">
        <h1 className={title({ size: "lg", color: "orange" })}>Configurazione Supabase</h1>
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
          <p className="font-medium">Errore di configurazione:</p>
          <p>{configError}</p>
          <div className="mt-4 bg-white p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Soluzione:</h2>
            <p>1. Crea un file <code>.env.local</code> nella root del progetto</p>
            <p>2. Aggiungi queste variabili (prendendole dal dashboard di Supabase):</p>
            <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-x-auto">
              NEXT_PUBLIC_SUPABASE_URL=https://tuo-id-progetto.supabase.co<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=tua-chiave-pubblica<br/>
              SUPABASE_SERVICE_ROLE_KEY=tua-chiave-servizio
            </pre>
            <p className="mt-2">3. Riavvia il server di sviluppo</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className={title({ size: "lg", color: "orange" })}>Diagnostica Admin</h1>
        <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded">
          Caricamento informazioni utente...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className={title({ size: "lg", color: "orange" })}>Diagnostica Admin</h1>
      
      {error ? (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      ) : (
        <div className="mt-4">
          <div className="bg-green-50 p-4 rounded mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Utente autenticato</h2>
            <div className="bg-white p-4 rounded shadow-sm overflow-auto">
              <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Configurazione ruolo Super Admin</h2>
            <p className="mb-2">Per impostare un utente come Super Admin:</p>
            <ol className="list-decimal list-inside mb-4">
              <li className="mb-1">Accedi al <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Dashboard di Supabase</a></li>
              <li className="mb-1">Seleziona il tuo progetto</li>
              <li className="mb-1">Vai a "Authentication" &gt; "Users"</li>
              <li className="mb-1">Clicca sull'utente che vuoi modificare</li>
              <li className="mb-1">Nell'attributo "app_metadata", aggiungi: <code className="bg-gray-100 px-1 py-0.5 rounded">{"\"is_super_admin\": true"}</code></li>
              <li>Salva le modifiche</li>
            </ol>
            <p className="text-sm text-gray-600">Nota: L'aggiunta di un utente come Super Admin dovrebbe essere fatta solo se necessario e per utenti fidati.</p>
          </div>
        </div>
      )}
    </div>
  );
} 