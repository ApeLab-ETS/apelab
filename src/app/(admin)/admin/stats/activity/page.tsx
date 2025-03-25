'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityChart } from '@/components/admin/AdminCharts';
import { Badge } from '@/components/ui/badge';
import { Users, CalendarDays, Clock, TrendingUp } from 'lucide-react';
import { supabaseClient } from '@/lib/supabase/client';

type ActivityData = {
  day: string;
  date: string;
  logins: number;
  partecipazioni: number;
  views: number;
};

export default function ActivityStatsPage() {
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // In un'implementazione reale, questi dati verrebbero dal database
        // Per ora, generiamo dati di esempio
        const last7Days = generateLast7DaysData();
        setActivityData(last7Days);
      } catch (error) {
        console.error('Errore durante il recupero dei dati di attività:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Generazione dati di esempio per gli ultimi 7 giorni
  const generateLast7DaysData = (): ActivityData[] => {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const result: ActivityData[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayName = days[date.getDay()];
      const dateString = date.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'short'
      });
      
      result.push({
        day: dayName,
        date: dateString,
        logins: Math.floor(Math.random() * 20) + 5,
        partecipazioni: Math.floor(Math.random() * 10) + 1,
        views: Math.floor(Math.random() * 50) + 20
      });
    }
    
    return result;
  };
  
  // Calcolo totali e medie
  const getTotals = () => {
    if (!activityData.length) return { logins: 0, partecipazioni: 0, views: 0 };
    
    return activityData.reduce((acc, day) => {
      return {
        logins: acc.logins + day.logins,
        partecipazioni: acc.partecipazioni + day.partecipazioni,
        views: acc.views + day.views
      };
    }, { logins: 0, partecipazioni: 0, views: 0 });
  };
  
  const totals = getTotals();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Statistiche Attività</h1>
        <p className="text-muted-foreground mt-2">
          Monitoraggio dell'attività degli utenti negli ultimi 7 giorni
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-muted-foreground">Caricamento statistiche...</span>
        </div>
      ) : (
        <>
          {/* Statistiche riepilogative */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Accessi Totali
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{totals.logins}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(totals.logins / 7)} accessi in media al giorno
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Partecipazioni
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{totals.partecipazioni}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(totals.partecipazioni / 7)} richieste in media al giorno
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Visualizzazioni
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{totals.views}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(totals.views / 7)} visite in media al giorno
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Grafico attività */}
          <div className="mb-8">
            <ActivityChart />
          </div>
          
          {/* Tabella attività giornaliera */}
          <Card>
            <CardHeader>
              <CardTitle>Dettaglio Attività Giornaliera</CardTitle>
              <CardDescription>
                Breakdown delle attività per ogni giorno degli ultimi 7 giorni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Giorno</th>
                      <th className="text-center py-3 px-4 font-medium text-sm">Data</th>
                      <th className="text-center py-3 px-4 font-medium text-sm">Accessi</th>
                      <th className="text-center py-3 px-4 font-medium text-sm">Partecipazioni</th>
                      <th className="text-center py-3 px-4 font-medium text-sm">Visualizzazioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityData.map((day, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 text-sm">{day.day}</td>
                        <td className="py-3 px-4 text-center text-sm">{day.date}</td>
                        <td className="py-3 px-4 text-center text-sm">
                          <Badge variant="outline" className="bg-blue-50">
                            {day.logins}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-sm">
                          <Badge variant="outline" className="bg-orange-50">
                            {day.partecipazioni}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-sm">
                          <Badge variant="outline" className="bg-green-50">
                            {day.views}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 