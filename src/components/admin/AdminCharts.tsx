'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Dati di esempio per i grafici
const activityData = [
  { name: 'Lun', utenti: 4, partecipazioni: 3 },
  { name: 'Mar', utenti: 7, partecipazioni: 5 },
  { name: 'Mer', utenti: 5, partecipazioni: 4 },
  { name: 'Gio', utenti: 6, partecipazioni: 8 },
  { name: 'Ven', utenti: 9, partecipazioni: 11 },
  { name: 'Sab', utenti: 15, partecipazioni: 12 },
  { name: 'Dom', utenti: 8, partecipazioni: 6 },
];

const eventiData = [
  { month: 'Gen', eventi: 2 },
  { month: 'Feb', eventi: 3 },
  { month: 'Mar', eventi: 2 },
  { month: 'Apr', eventi: 4 },
  { month: 'Mag', eventi: 3 },
  { month: 'Giu', eventi: 5 },
  { month: 'Lug', eventi: 7 },
  { month: 'Ago', eventi: 6 },
  { month: 'Set', eventi: 4 },
  { month: 'Ott', eventi: 3 },
  { month: 'Nov', eventi: 5 },
  { month: 'Dic', eventi: 8 },
];

const partecipantiPerStatoData = [
  { name: 'Confermati', value: 35 },
  { name: 'In attesa', value: 12 },
  { name: 'Annullati', value: 8 },
  { name: 'No-show', value: 5 },
];

const COLORS = ['#16a34a', '#f97316', '#ef4444', '#94a3b8'];

export function ActivityChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Attività Settimanale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activityData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }} 
              />
              <Bar dataKey="utenti" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="partecipazioni" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventsChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Eventi per Mese</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={eventiData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="eventi" 
                stroke="#f97316" 
                activeDot={{ r: 8 }} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ParticipantsStatusChart() {
  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Stato Partecipanti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={partecipantiPerStatoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {partecipantiPerStatoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }} 
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventsLocationChart() {
  const locationData = [
    { name: 'Centro', value: 12 },
    { name: 'Gries', value: 8 },
    { name: 'Novacella', value: 5 },
    { name: 'Altri', value: 3 },
  ];

  const LOCATION_COLORS = ['#0ea5e9', '#f97316', '#a855f7', '#94a3b8'];

  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Eventi per Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={LOCATION_COLORS[index % LOCATION_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }} 
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 