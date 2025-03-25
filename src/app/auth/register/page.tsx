'use client';

import Link from "next/link";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      termsAccepted: checked
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validazione
    if (formData.password !== formData.confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    if (!formData.termsAccepted) {
      setError("Devi accettare i termini e condizioni");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Registrazione dell'utente
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
            cognome: formData.cognome,
            telefono: formData.telefono,
            ruolo: 'utente' // Ruolo di default
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // 2. Inserisci i dati aggiuntivi nella tabella profili se necessario
      // Nota: in molti casi questo passo è gestito da un trigger in Supabase
      if (authData.user) {
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            nome: formData.nome,
            cognome: formData.cognome,
            telefono: formData.telefono,
            ruolo: 'utente',
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error("Errore nell'inserimento del profilo:", profileError);
          // La registrazione è comunque avvenuta, quindi non blocchiamo il processo
        }
      }

      // Reindirizza alla pagina di successo o login
      router.push('/auth/verifica-email');
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
      setError("Si è verificato un errore durante la registrazione. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Crea un nuovo account</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Mario"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cognome">Cognome</Label>
                <Input
                  id="cognome"
                  name="cognome"
                  type="text"
                  value={formData.cognome}
                  onChange={handleChange}
                  placeholder="Rossi"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@esempio.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefono">Telefono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+39 123 456 7890"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="termsAccepted" 
                checked={formData.termsAccepted}
                onCheckedChange={handleCheckboxChange}
                required
              />
              <Label htmlFor="termsAccepted" className="text-sm font-normal">
                Accetto i{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  termini e condizioni
                </Link>
              </Label>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Registrazione in corso...' : 'Registrati'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Hai già un account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Accedi
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 