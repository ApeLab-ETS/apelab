'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Conteggio utenti
        const { count: userCount, error: userError } = await supabaseClient
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // Conteggio eventi totali
        const { count: eventCount, error: eventError } = await supabaseClient
          .from('feste')
          .select('*', { count: 'exact', head: true });

        if (eventError) throw eventError;

        // Conteggio eventi futuri
        const { count: upcomingCount, error: upcomingError } = await supabaseClient
          .from('feste')
          .select('*', { count: 'exact', head: true })
          .gt('data_inizio', new Date().toISOString().split('T')[0])
          .eq('stato', 'pianificata');

        if (upcomingError) throw upcomingError;

        // Utenti attivi nell'ultimo mese (approssimazione)
        const { count: activeCount, error: activeError } = await supabaseClient
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (activeError) throw activeError;

        setStats({
          totalUsers: userCount || 0,
          totalEvents: eventCount || 0,
          upcomingEvents: upcomingCount || 0,
          activeUsers: activeCount || 0
        });
      } catch (err: any) {
        console.error('Errore durante il recupero delle statistiche:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Panoramica e statistiche dell'applicazione</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Caricamento statistiche...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Utenti Totali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.totalUsers}</div>
              <p className="text-sm text-gray-600 mt-1">Account registrati</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Eventi Totali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.totalEvents}</div>
              <p className="text-sm text-gray-600 mt-1">Feste ed eventi organizzati</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Eventi in Arrivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.upcomingEvents}</div>
              <p className="text-sm text-gray-600 mt-1">Pianificati per il futuro</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Utenti Attivi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.activeUsers}</div>
              <p className="text-sm text-gray-600 mt-1">Ultimi 30 giorni</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attività Recenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Nuovo utente registrato</h4>
                    <p className="text-sm text-gray-600">Marco Rossi si è unito alla piattaforma</p>
                  </div>
                  <div className="text-sm text-gray-500">2 ore fa</div>
                </div>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Evento creato</h4>
                    <p className="text-sm text-gray-600">Nuovo evento: Beach Party - 20 Agosto</p>
                  </div>
                  <div className="text-sm text-gray-500">ieri</div>
                </div>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Modifica ruolo</h4>
                    <p className="text-sm text-gray-600">Lucia Bianchi è diventata organizzatrice</p>
                  </div>
                  <div className="text-sm text-gray-500">2 giorni fa</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prossime Attività</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Summer Vibes Party</h4>
                    <p className="text-sm text-gray-600">15 Luglio 2024 - Bolzano, Centrum</p>
                  </div>
                  <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                    In arrivo
                  </div>
                </div>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Beach Party</h4>
                    <p className="text-sm text-gray-600">20 Agosto 2024 - Lago di Caldaro</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Pianificato
                  </div>
                </div>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Autumn Fest</h4>
                    <p className="text-sm text-gray-600">15 Settembre 2024 - Bolzano, Centro</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Pianificato
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 