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
    <div className="p-3 md:p-0">
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
          Panoramica e statistiche dell'applicazione Apelab
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 md:p-4 bg-red-50 text-red-600 rounded-md text-sm md:text-base">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8 md:py-12">
          <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-muted-foreground text-sm md:text-base">Caricamento statistiche...</span>
        </div>
      ) : (
        <>
          {/* Statistiche principali */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Utenti Totali
                </CardTitle>
                <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
                <div className="text-xl md:text-3xl font-bold text-orange-500">{stats.totalUsers}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  Account registrati sulla piattaforma
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Eventi Totali
                </CardTitle>
                <CalendarDays className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
                <div className="text-xl md:text-3xl font-bold text-orange-500">{stats.totalEvents}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  Feste ed eventi organizzati
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Eventi in Arrivo
                </CardTitle>
                <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
                <div className="text-xl md:text-3xl font-bold text-orange-500">{stats.upcomingEvents}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  Pianificati per il futuro
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Utenti Attivi
                </CardTitle>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
                <div className="text-xl md:text-3xl font-bold text-orange-500">{stats.activeUsers}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  Stima corrente
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Grafici */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
            <Card className="col-span-1">
              <CardHeader className="pb-2 p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Attività Utenti</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Monitoraggio delle attività giornaliere
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 md:p-0">
                <div className="h-[200px] md:h-[300px] w-full">
                  <ActivityChart />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="pb-2 p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Eventi Mensili</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Distribuzione degli eventi negli ultimi 6 mesi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 md:p-0">
                <div className="h-[200px] md:h-[300px] w-full">
                  <EventsChart />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
            <Card className="col-span-1">
              <CardHeader className="pb-2 p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Stato Partecipanti</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Distribuzione degli stati di partecipazione
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 md:p-0">
                <div className="h-[200px] md:h-[300px] w-full">
                  <ParticipantsStatusChart />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="pb-2 p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Posizione Eventi</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Distribuzione geografica degli eventi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 md:p-0">
                <div className="h-[200px] md:h-[300px] w-full">
                  <EventsLocationChart />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sezioni inferiori */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Attività recenti */}
            <Card>
              <CardHeader className="pb-2 p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Attività Recenti</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Ultime azioni sulla piattaforma
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentActivities.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start space-x-3 p-3 md:p-4 border-b last:border-0"
                    >
                      <div className="mt-1 bg-white p-1 md:p-1.5 rounded-full border">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm md:text-base font-medium">{activity.title}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-[10px] md:text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Eventi in arrivo */}
            <Card>
              <CardHeader className="pb-2 p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">Eventi in Arrivo</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Prossimi eventi pianificati
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {upcomingEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="flex items-start space-x-3 p-3 md:p-4 border-b last:border-0"
                    >
                      <div className="mt-1 bg-white p-1 md:p-1.5 rounded-full border">
                        <CalendarDays className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm md:text-base font-medium">{event.title}</p>
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">{event.location}</p>
                        <p className="text-[10px] md:text-xs text-gray-400">{event.date}</p>
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