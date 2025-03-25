'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Settings, 
  Home, 
  Menu,
  LogOut,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import { supabaseClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  userName: string;
  userEmail: string;
  onLogout: () => Promise<void>;
}

export function Sidebar({ userName, userEmail, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statsExpanded, setStatsExpanded] = useState(true);
  
  // Indicatori di stato
  const isTodayActivity = Math.random() > 0.5; // Simulato
  const hasPendingEvents = true; // Simulato
  
  // Iniziali dell'utente per l'avatar
  const initials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Costruisci la struttura della navigazione
  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: pathname === '/admin/dashboard',
    },
    {
      title: 'Utenti',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      active: pathname === '/admin/users',
    },
    {
      title: 'Eventi',
      href: '/admin/eventi',
      icon: <CalendarDays className="h-5 w-5" />,
      badge: hasPendingEvents ? 'Nuovi' : undefined,
      active: pathname.startsWith('/admin/eventi'),
    },
    {
      title: 'Statistiche',
      isGroup: true,
      expanded: statsExpanded,
      icon: <BarChart3 className="h-5 w-5" />,
      onToggle: () => setStatsExpanded(!statsExpanded),
      items: [
        {
          title: 'Attività',
          href: '/admin/stats/activity',
          active: pathname === '/admin/stats/activity',
          badge: isTodayActivity ? 'Oggi' : undefined,
        },
        {
          title: 'Partecipazioni',
          href: '/admin/stats/partecipazioni',
          active: pathname === '/admin/stats/partecipazioni',
        },
      ],
    },
    {
      title: 'Configurazione',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
      active: pathname === '/admin/settings',
    },
  ];
  
  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };
  
  // Contenuto della sidebar
  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo e intestazione */}
      <div className="pt-6 pb-6 border-b flex items-center justify-center">
        <Link href="/admin/dashboard" className="flex items-center justify-center">
          <span className="bg-orange-500 text-white p-2 rounded-lg mr-2 text-2xl font-bold">A</span>
          <span className="font-bold text-xl">Apelab Admin</span>
        </Link>
      </div>
      
      {/* Menu di navigazione */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              {item.isGroup ? (
                <div className="mb-2">
                  <button
                    onClick={item.onToggle}
                    className="w-full flex items-center justify-between p-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3 font-medium">{item.title}</span>
                    </div>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 transition-transform", 
                        item.expanded ? "transform rotate-180" : ""
                      )} 
                    />
                  </button>
                  
                  {item.expanded && item.items && (
                    <ul className="mt-1 pl-8 space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href || '#'}
                            onClick={closeMobileSidebar}
                            className={cn(
                              "flex items-center justify-between p-2 text-sm rounded-md transition-colors",
                              subItem.active
                                ? "bg-orange-100 text-orange-900 font-medium"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <span>{subItem.title}</span>
                            {subItem.badge && (
                              <span className="ml-auto text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href || '#'}
                  onClick={closeMobileSidebar}
                  className={cn(
                    "flex items-center justify-between p-2 text-sm rounded-md transition-colors",
                    item.active
                      ? "bg-orange-100 text-orange-900 font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
          
          <li className="mt-2">
            <Link
              href="/"
              className="flex items-center p-2 text-sm text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors"
              onClick={closeMobileSidebar}
            >
              <Home className="h-5 w-5" />
              <span className="ml-3">Sito Pubblico</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Profilo utente */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar-placeholder.jpg" alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[160px]">
              {userEmail}
              <span className="ml-2 inline-block px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-sm font-medium">
                ADMIN
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="ml-auto text-muted-foreground hover:text-foreground"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Versione mobile (drawer) */}
      <div className="lg:hidden absolute left-4 top-4 z-30">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Versione desktop (sidebar fissa) */}
      <div className="hidden lg:block w-64 border-r bg-card h-screen sticky top-0 overflow-y-auto">
        <SidebarContent />
      </div>
    </>
  );
} 