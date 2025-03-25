'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import EventoDettaglio from './EventoDettaglio';

export default function Page() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Caricamento...</div>}>
      <EventoDettaglio id={id} />
    </Suspense>
  );
} 