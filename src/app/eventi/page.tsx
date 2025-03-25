'use client';

import { Suspense } from 'react';
import EventiLista from './EventiLista';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Caricamento...</div>}>
      <EventiLista />
    </Suspense>
  );
} 