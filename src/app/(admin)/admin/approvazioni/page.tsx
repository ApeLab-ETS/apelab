"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { title } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from '@supabase/supabase-js';
import { 
  CheckCircle2, 
  XCircle,
  Filter,
  RefreshCw,
  UserCheck,
  UserX
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminApprovazioniPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [processingUsers, setProcessingUsers] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Verifica sessione
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Sessione non trovata. Effettua il login.');
        return;
      }
      
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

  // Gestione dell'approvazione utente
  async function handleApprovalChange(userId: string, isApproved: boolean) {
    try {
      setProcessingUsers(prev => ({ ...prev, [userId]: true }));
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch("/api/admin/update-user-approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isApproved
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Errore nell'aggiornamento dell'approvazione");
      }
      
      const data = await response.json();
      
      // Aggiorna la lista degli utenti
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, user_metadata: { ...user.user_metadata, approved_for_party: isApproved } } 
            : user
        )
      );
      
      setSuccessMessage(`${isApproved ? 'Approvato' : 'Rimosso'} con successo l'accesso alla festa per l'utente`);
    } catch (error: any) {
      console.error("Errore nell'aggiornamento dell'approvazione:", error);
      setError(error.message || "Impossibile aggiornare lo stato di approvazione");
    } finally {
      setProcessingUsers(prev => ({ ...prev, [userId]: false }));
    }
  }

  // Filtra gli utenti in base al termine di ricerca e allo stato di approvazione
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatches = 
      user.email?.toLowerCase().includes(searchLower) ||
      user.user_metadata?.first_name?.toLowerCase().includes(searchLower) ||
      user.user_metadata?.last_name?.toLowerCase().includes(searchLower);
    
    if (filter === "all") return nameMatches;
    if (filter === "approved") return nameMatches && user.user_metadata?.approved_for_party === true;
    if (filter === "not_approved") return nameMatches && user.user_metadata?.approved_for_party !== true;
    
    return nameMatches;
  });

  // Funzione per visualizzare il nome dell'utente
  const getUserName = (user: any) => {
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Utente';
  };

  // Statistiche
  const totalUsers = users.length;
  const approvedUsers = users.filter(user => user.user_metadata?.approved_for_party === true).length;
  const pendingUsers = totalUsers - approvedUsers;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <h1 className={title({ size: "sm", color: "orange" })}>Approvazioni Festa</h1>
        <p className="text-gray-500 mb-6">
          Gestisci l'accesso degli utenti alla prossima festa
        </p>
      </div>

      {/* Statistiche */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Utenti Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              <span className="flex items-center">
                Approvati <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              <span className="flex items-center">
                In Attesa <XCircle className="ml-2 h-4 w-4 text-orange-500" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Messaggi */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          <p className="font-medium">Si è verificato un errore:</p>
          <p>{error}</p>
          <Button 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white" 
            onClick={fetchUsers}
          >
            Riprova
          </Button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-md border border-green-200">
          <p className="font-medium">Operazione completata</p>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Filtri e Ricerca */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:flex lg:items-center lg:space-x-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Cerca utenti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select 
            value={filter} 
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtra per stato" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli utenti</SelectItem>
              <SelectItem value="approved">Solo approvati</SelectItem>
              <SelectItem value="not_approved">Solo in attesa</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            className="bg-orange-500 hover:bg-orange-600 flex-none"
            onClick={fetchUsers}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Caricamento...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Aggiorna
              </>
            )}
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
                    Stato
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
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
                      {user.app_metadata?.is_super_admin && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                          Admin
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.user_metadata?.approved_for_party ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approvato
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          In attesa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {user.user_metadata?.approved_for_party ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={processingUsers[user.id]}
                            onClick={() => handleApprovalChange(user.id, false)}
                            className="flex items-center"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Rimuovi
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            disabled={processingUsers[user.id]}
                            onClick={() => handleApprovalChange(user.id, true)}
                            className="flex items-center bg-green-500 hover:bg-green-600"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approva
                          </Button>
                        )}
                      </div>
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