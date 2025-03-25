import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Festa, Notifica, Partecipazione, Profile } from '../supabase/client';

interface AppState {
  // Stato utente
  user: Profile | null;
  setUser: (user: Profile | null) => void;
  
  // Stato feste
  feste: Festa[];
  setFeste: (feste: Festa[]) => void;
  addFesta: (festa: Festa) => void;
  updateFesta: (id: number, festa: Partial<Festa>) => void;
  removeFesta: (id: number) => void;
  
  // Stato notifiche
  notifiche: Notifica[];
  setNotifiche: (notifiche: Notifica[]) => void;
  addNotifica: (notifica: Notifica) => void;
  markNotificaAsRead: (id: number) => void;
  unreadNotificheCount: () => number;
  
  // Stato partecipazioni
  partecipazioni: Partecipazione[];
  setPartecipazioni: (partecipazioni: Partecipazione[]) => void;
  addPartecipazione: (partecipazione: Partecipazione) => void;
  updatePartecipazione: (id: number, partecipazione: Partial<Partecipazione>) => void;
  
  // Filtri e stato UI
  activeFilter: {
    stato?: string;
    luogo?: string;
    data?: string;
    searchTerm?: string;
  };
  setActiveFilter: (filter: Partial<AppState['activeFilter']>) => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Stato utente
      user: null,
      setUser: (user) => set({ user }),

      // Stato feste
      feste: [],
      setFeste: (feste) => set({ feste }),
      addFesta: (festa) => set((state) => ({ feste: [...state.feste, festa] })),
      updateFesta: (id, updated) => set((state) => ({
        feste: state.feste.map((festa) => 
          festa.id === id ? { ...festa, ...updated } : festa
        ),
      })),
      removeFesta: (id) => set((state) => ({
        feste: state.feste.filter((festa) => festa.id !== id),
      })),

      // Stato notifiche
      notifiche: [],
      setNotifiche: (notifiche) => set({ notifiche }),
      addNotifica: (notifica) => set((state) => ({ 
        notifiche: [notifica, ...state.notifiche],
      })),
      markNotificaAsRead: (id) => set((state) => ({
        notifiche: state.notifiche.map((notifica) =>
          notifica.id === id ? { ...notifica, letta: true } : notifica
        ),
      })),
      unreadNotificheCount: () => {
        const { notifiche } = get();
        return notifiche.filter((notifica) => !notifica.letta).length;
      },

      // Stato partecipazioni
      partecipazioni: [],
      setPartecipazioni: (partecipazioni) => set({ partecipazioni }),
      addPartecipazione: (partecipazione) => set((state) => ({ 
        partecipazioni: [...state.partecipazioni, partecipazione],
      })),
      updatePartecipazione: (id, updated) => set((state) => ({
        partecipazioni: state.partecipazioni.map((partecipazione) => 
          partecipazione.id === id ? { ...partecipazione, ...updated } : partecipazione
        ),
      })),

      // Filtri e stato UI
      activeFilter: {},
      setActiveFilter: (filter) => set((state) => ({ 
        activeFilter: { ...state.activeFilter, ...filter },
      })),
      resetFilters: () => set({ activeFilter: {} }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        user: state.user,
        activeFilter: state.activeFilter,
      }),
    }
  )
); 