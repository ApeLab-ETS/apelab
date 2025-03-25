'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (!session) {
        router.push('/auth/login?next=' + pathname);
        return;
      }

      // Verifica se l'utente è admin
      const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('ruolo')
        .eq('id', session.user.id)
        .single();

      if (error || !profile || profile.ruolo !== 'admin') {
        router.push('/');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdmin();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Verifica autorizzazioni...</p>
        </div>
      </div>
    );
  }

  return isAdmin ? (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-orange-500">Pannello Admin</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin/dashboard" 
                className={`block p-2 rounded-lg hover:bg-orange-50 ${
                  pathname === '/admin/dashboard' ? 'bg-orange-100 text-orange-700' : 'text-gray-700'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/users" 
                className={`block p-2 rounded-lg hover:bg-orange-50 ${
                  pathname === '/admin/users' ? 'bg-orange-100 text-orange-700' : 'text-gray-700'
                }`}
              >
                Gestione Utenti
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/eventi" 
                className={`block p-2 rounded-lg hover:bg-orange-50 ${
                  pathname === '/admin/eventi' ? 'bg-orange-100 text-orange-700' : 'text-gray-700'
                }`}
              >
                Gestione Eventi
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/statistiche" 
                className={`block p-2 rounded-lg hover:bg-orange-50 ${
                  pathname === '/admin/statistiche' ? 'bg-orange-100 text-orange-700' : 'text-gray-700'
                }`}
              >
                Statistiche
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  ) : null;
} 