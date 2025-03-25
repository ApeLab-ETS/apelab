"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { title } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from '@supabase/supabase-js';

export default function AdminUsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAuthAndFetchUsers();
  }, []);

  async function checkAuthAndFetchUsers() {
    try {
      setIsLoading(true);
      // Verifica sessione
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Sessione non trovata. Effettua il login.');
        return;
      }
      
      fetchUsers();
    } catch (error: any) {
      console.error("Errore di autenticazione:", error);
      setError(error.message || "Errore sconosciuto durante l'autenticazione");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchUsers() {
    try {
      setError(null);
      const response = await fetch("/api/admin/users");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Errore nel caricamento degli utenti");
      }
      
      const data = await response.json();
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
        console.log("Utenti caricati:", data.users.length);
      } else {
        setUsers([]);
        console.warn("Formato risposta API non valido o nessun utente trovato");
      }
    } catch (error: any) {
      console.error("Errore nel caricamento degli utenti:", error);
      setError(error.message || "Impossibile caricare gli utenti");
    } finally {
      setIsLoading(false);
    }
  }

  // Filtra gli utenti in base al termine di ricerca
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.user_metadata?.first_name?.toLowerCase().includes(searchLower) ||
      user.user_metadata?.last_name?.toLowerCase().includes(searchLower)
    );
  });

  // Funzione per visualizzare il nome dell'utente
  const getUserName = (user: any) => {
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Utente';
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <h1 className={title({ size: "sm", color: "orange" })}>Gestione Utenti</h1>
        <p className="text-gray-500 mb-6">
          Gestisci gli utenti e i loro ruoli nel sistema
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          <p className="font-medium">Si è verificato un errore:</p>
          <p>{error}</p>
          <Button 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white" 
            onClick={checkAuthAndFetchUsers}
          >
            Riprova
          </Button>
        </div>
      )}

      {/* Ricerca */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Cerca utenti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={fetchUsers}
            disabled={isLoading}
          >
            {isLoading ? 'Caricamento...' : 'Aggiorna'}
          </Button>
        </div>
      </div>

      {/* Tabella utenti */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8">Caricamento utenti...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">Nessun utente trovato</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ruolo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getUserName(user)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {user.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.app_metadata?.is_super_admin ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                        {user.app_metadata?.is_super_admin ? "Super Admin" : "Utente standard"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 