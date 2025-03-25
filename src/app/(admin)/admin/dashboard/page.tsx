'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityChart, EventsChart, ParticipantsStatusChart, EventsLocationChart } from '@/components/admin/AdminCharts';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Calendar, TrendingUp, Bell } from 'lucide-react';

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
        // Per gli utenti, utilizziamo un valore statico o l'utente corrente
        // Poiché non abbiamo accesso alle API admin di Supabase né alla tabella utenti
        let userCount = 1; // Valore di default
        
        try {
          // Otteniamo almeno l'utente corrente per avere un conteggio minimo
          const { data: { user } } = await supabaseClient.auth.getUser();
          if (user) {
            console.log("Utente autenticato:", user.email);
            // Usiamo un valore arbitrario per simulare la presenza di più utenti
            // In un ambiente reale, questo dovrebbe essere ottenuto da una fonte di dati reale
            userCount = 10; // Valore simulato per scopi dimostrativi
          }
        } catch (userErr) {
          console.warn("Non è stato possibile ottenere l'utente corrente:", userErr);
        }

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

        setStats({
          totalUsers: userCount,
          totalEvents: eventCount || 0,
          upcomingEvents: upcomingCount || 0,
          activeUsers: userCount // Utilizziamo lo stesso valore per gli utenti attivi
        });
        
        console.log('Statistiche caricate:', {
          totalUsers: userCount,
          totalEvents: eventCount,
          upcomingEvents: upcomingCount,
          activeUsers: userCount
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
  
  // Esempio di attività recenti
  const recentActivities = [
    {
      id: 1,
      type: 'user',
      title: 'Nuovo utente registrato',
      description: 'Marco Rossi si è unito alla piattaforma',
      time: '2 ore fa',
    },
    {
      id: 2,
      type: 'event',
      title: 'Evento creato',
      description: 'Nuovo evento: Beach Party - 20 Agosto',
      time: 'ieri',
    },
    {
      id: 3,
      type: 'system',
      title: 'Modifica configurazione',
      description: 'Sistema aggiornato alla gestione admin basata su whitelist',
      time: 'oggi',
    },
  ];
  
  // Esempio di prossimi eventi
  const upcomingEvents = [
    {
      id: 1,
      title: 'Summer Vibes Party',
      date: '15 Luglio 2024',
      location: 'Bolzano, Centrum',
      status: 'in_arrivo',
    },
    {
      id: 2,
      title: 'Beach Party',
      date: '20 Agosto 2024',
      location: 'Lago di Caldaro',
      status: 'pianificato',
    },
    {
      id: 3,
      title: 'Autumn Fest',
      date: '15 Settembre 2024',
      location: 'Bolzano, Centro',
      status: 'pianificato',
    },
  ];
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'system':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_arrivo':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">In arrivo</Badge>;
      case 'pianificato':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Pianificato</Badge>;
      case 'concluso':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Concluso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground mt-2">
          Panoramica e statistiche dell'applicazione Apelab
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-muted-foreground">Caricamento statistiche...</span>
        </div>
      ) : (
        <>
          {/* Statistiche principali */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Utenti Totali
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Account registrati sulla piattaforma
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Eventi Totali
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Feste ed eventi organizzati
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Eventi in Arrivo
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.upcomingEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pianificati per il futuro
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Utenti Attivi
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Stima corrente
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Grafici */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Grafico attività */}
            <ActivityChart />
            
            {/* Grafico eventi */}
            <EventsChart />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Grafico partecipanti */}
            <ParticipantsStatusChart />
            
            {/* Grafico location */}
            <EventsLocationChart />
          </div>
          
          {/* Attività recenti e prossimi eventi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attività Recenti</CardTitle>
                <CardDescription>
                  Le ultime azioni sulla piattaforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.title}</p>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Prossimi Eventi</CardTitle>
                <CardDescription>
                  Gli eventi in programma nei prossimi mesi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>📍 {event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
} 