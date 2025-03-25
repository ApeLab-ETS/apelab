'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Sidebar } from '@/components/admin/Sidebar';

const inter = Inter({ subsets: ["latin"] });

// Componente interno che gestisce il contenuto dell'admin
function AdminContent({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push('/auth/login');
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (!session) {
        router.push('/auth/login?next=' + pathname);
        return;
      }

      // Ottieni l'utente corrente
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        console.log('Utente non trovato nella sessione');
        router.push('/auth/login?next=' + pathname);
        return;
      }

      // Verifica se l'utente è un super admin
      if (!user.app_metadata?.is_super_admin) {
        console.log('Accesso negato: l\'utente non è un super admin', {
          userId: user.id,
          email: user.email,
          metadata: user.app_metadata
        });
        router.push('/');
        return;
      }

      // Ottieni nome utente dalle metadata o usa l'email
      const firstName = user.user_metadata?.nome || '';
      const lastName = user.user_metadata?.cognome || '';
      const displayName = firstName && lastName 
        ? `${firstName} ${lastName}` 
        : user.email?.split('@')[0] || '';
        
      setUserName(displayName);
      setUserEmail(user.email || '');
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

  // Se siamo qui, l'utente è autenticato e ha i permessi di admin
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        userName={userName} 
        userEmail={userEmail} 
        onLogout={handleLogout} 
      />
      
      {/* Contenuto principale */}
      <div className="flex-1">
        <div className="container mx-auto p-6 md:p-8 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
}

// Layout principale che evita problemi di hydration
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminContent>{children}</AdminContent>;
} 