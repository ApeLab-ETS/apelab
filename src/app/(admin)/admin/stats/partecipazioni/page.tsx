'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ParticipantsStatusChart } from '@/components/admin/AdminCharts';
import { Badge } from '@/components/ui/badge';
import { Users, CalendarDays, CircleCheck, CircleX, CircleDashed } from 'lucide-react';

export default function PartecipazioniStatsPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simuliamo un caricamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Statistiche Partecipazioni</h1>
        <p className="text-muted-foreground mt-2">
          Analisi delle partecipazioni agli eventi e dei loro stati
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Partecipazioni Totali
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">105</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Richieste di partecipazione totali
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Confermati
                </CardTitle>
                <CircleCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">73</div>
                <p className="text-xs text-muted-foreground mt-1">
                  70% del totale
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Attesa
                </CardTitle>
                <CircleDashed className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">22</div>
                <p className="text-xs text-muted-foreground mt-1">
                  21% del totale
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rifiutati
                </CardTitle>
                <CircleX className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">10</div>
                <p className="text-xs text-muted-foreground mt-1">
                  9% del totale
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Grafici */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Grafico a torta stati */}
            <ParticipantsStatusChart />
          </div>
        </>
      )}
    </div>
  );
} 