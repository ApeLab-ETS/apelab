'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase/client';
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

// Metadata per sostituire completamente il layout principale
export const metadata = {
  layout: 'admin',
};

// Whitelist di email autorizzate come admin
const ADMIN_EMAILS = [
  'mail@francescomasala.me',
  // Aggiungi altre email se necessario
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push('/auth/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (!session) {
        router.push('/auth/login?next=' + pathname);
        return;
      }

      // Verifica se l'email dell'utente è nella whitelist
      const email = session.user.email;
      if (!email || !ADMIN_EMAILS.includes(email)) {
        console.log('Non autorizzato - email non in whitelist:', email);
        router.push('/');
        return;
      }

      // Ottieni nome utente dalle metadata o usa l'email
      const firstName = session.user.user_metadata?.nome || '';
      const lastName = session.user.user_metadata?.cognome || '';
      const displayName = firstName && lastName 
        ? `${firstName} ${lastName}` 
        : email.split('@')[0];
        
      setUserName(displayName);
      setUserEmail(email);
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
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen m-0 antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* Header Admin */}
          <header className="bg-orange-500 text-white shadow-md">
            <div className="container mx-auto px-4 py-3">
              <div className="flex justify-between items-center">
                {/* Logo e titolo */}
                <div className="font-bold text-xl text-white">
                  <Link href="/admin/dashboard" className="text-white hover:text-white hover:no-underline">
                    Apelab/Admin
                  </Link>
                </div>
                
                {/* Pulsante hamburger per mobile */}
                <button 
                  className="md:hidden p-2 focus:outline-none text-white" 
                  onClick={toggleMobileMenu}
                  aria-label="Menu mobile"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                
                {/* Navigazione desktop */}
                <div className="hidden md:flex items-center space-x-6">
                  <nav className="flex items-center space-x-6">
                    <Link 
                      href="/admin/dashboard" 
                      className={`text-white hover:text-white hover:underline ${
                        pathname === '/admin/dashboard' ? 'font-semibold border-b-2 border-white pb-1' : ''
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/admin/users" 
                      className={`text-white hover:text-white hover:underline ${
                        pathname === '/admin/users' ? 'font-semibold border-b-2 border-white pb-1' : ''
                      }`}
                    >
                      Utenti
                    </Link>
                    <Link 
                      href="/admin/eventi" 
                      className={`text-white hover:text-white hover:underline ${
                        pathname === '/admin/eventi' ? 'font-semibold border-b-2 border-white pb-1' : ''
                      }`}
                    >
                      Eventi
                    </Link>
                    <Link 
                      href="/" 
                      className="text-white hover:text-white hover:underline"
                    >
                      Sito Pubblico
                    </Link>
                  </nav>
                  
                  <div className="ml-6 border-l border-orange-400 pl-6 flex items-center">
                    <div className="mr-4">
                      <div className="font-medium text-white">{userName}</div>
                      <div className="text-xs text-orange-200">{userEmail}</div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-white bg-orange-600 hover:bg-orange-700 px-3 py-1.5 rounded text-sm flex items-center"
                      aria-label="Logout"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Menu mobile */}
              {mobileMenuOpen && (
                <div className="md:hidden mt-4 pb-2 border-t border-orange-400 pt-3">
                  <nav className="flex flex-col space-y-3">
                    <Link 
                      href="/admin/dashboard" 
                      className={`text-white px-2 py-1 rounded ${pathname === '/admin/dashboard' ? 'bg-orange-600 font-medium' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/admin/users" 
                      className={`text-white px-2 py-1 rounded ${pathname === '/admin/users' ? 'bg-orange-600 font-medium' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Utenti
                    </Link>
                    <Link 
                      href="/admin/eventi" 
                      className={`text-white px-2 py-1 rounded ${pathname === '/admin/eventi' ? 'bg-orange-600 font-medium' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Eventi
                    </Link>
                    <Link 
                      href="/" 
                      className="text-white px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sito Pubblico
                    </Link>
                    
                    <div className="border-t border-orange-400 pt-3 mt-2 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{userName}</div>
                        <div className="text-xs text-orange-200">{userEmail}</div>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="text-white bg-orange-600 hover:bg-orange-700 px-3 py-1.5 rounded text-sm flex items-center"
                        aria-label="Logout"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </header>
          
          {/* Contenuto principale */}
          <main className="flex-grow">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
} 