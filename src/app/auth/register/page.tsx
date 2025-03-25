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
      // Registrazione dell'utente con i metadata necessari
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
            cognome: formData.cognome,
            telefono: formData.telefono,
            full_name: `${formData.nome} ${formData.cognome}`, // Aggiungiamo anche il nome completo per comodità
            created_at: new Date().toISOString()
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      console.log('Registrazione completata con successo, dati utente:', authData);

      // Reindirizza alla pagina di verifica email
      router.push('/auth/verifica-email');
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
      setError("Si è verificato un errore durante la registrazione. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex flex-col justify-center items-center py-6 px-4 sm:py-10 sm:px-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            <span className="text-orange-500">Ape</span>lab
          </h1>
          <p className="text-slate-600 mt-2 text-base sm:text-lg">Unisciti alla community di eventi a Bolzano</p>
        </div>

        <Card className="border-orange-100 shadow-xl overflow-hidden w-full">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <CardHeader className="pb-0 pt-5 px-5 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-slate-800">Crea il tuo account</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Registrati per partecipare ai nostri eventi esclusivi
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 px-5 sm:px-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-lg mb-5 text-sm border border-red-200">
                <p className="font-medium">Si è verificato un errore</p>
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="nome" className="text-slate-700 text-sm sm:text-base">Nome</Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Mario"
                    required
                    className="border-slate-300 focus:border-orange-400 focus:ring-orange-400 h-10 sm:h-11"
                  />
                </div>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="cognome" className="text-slate-700 text-sm sm:text-base">Cognome</Label>
                  <Input
                    id="cognome"
                    name="cognome"
                    type="text"
                    value={formData.cognome}
                    onChange={handleChange}
                    placeholder="Rossi"
                    required
                    className="border-slate-300 focus:border-orange-400 focus:ring-orange-400 h-10 sm:h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-slate-700 text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@esempio.com"
                  required
                  className="border-slate-300 focus:border-orange-400 focus:ring-orange-400 h-10 sm:h-11"
                />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="telefono" className="text-slate-700 text-sm sm:text-base">Telefono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+39 123 456 7890"
                  className="border-slate-300 focus:border-orange-400 focus:ring-orange-400 h-10 sm:h-11"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="password" className="text-slate-700 text-sm sm:text-base">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="border-slate-300 focus:border-orange-400 focus:ring-orange-400 h-10 sm:h-11"
                  />
                </div>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 text-sm sm:text-base">Conferma Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="border-slate-300 focus:border-orange-400 focus:ring-orange-400 h-10 sm:h-11"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2 sm:pt-3">
                <Checkbox 
                  id="termsAccepted" 
                  checked={formData.termsAccepted}
                  onCheckedChange={handleCheckboxChange}
                  required
                  className="text-orange-500 border-slate-300 focus:ring-orange-400 h-4 w-4"
                />
                <Label htmlFor="termsAccepted" className="text-xs sm:text-sm font-normal text-slate-700">
                  Accetto i{' '}
                  <Link href="/terms" className="text-orange-600 hover:text-orange-500 transition-colors">
                    termini e condizioni
                  </Link>
                </Label>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg py-2 sm:py-2.5 shadow-md transition-colors mt-2 h-10 sm:h-11"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm sm:text-base">Registrazione in corso...</span>
                  </>
                ) : <span className="text-sm sm:text-base">Registrati</span>
                }
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 sm:space-y-4 pt-2 px-5 pb-5 sm:pb-6 sm:px-6">
            <div className="w-full border-t border-slate-200 my-1"></div>
            <p className="text-xs sm:text-sm text-slate-600 text-center">
              Hai già un account?{' '}
              <Link href="/auth/login" className="text-orange-600 hover:text-orange-500 font-medium transition-colors">
                Accedi
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-base sm:text-lg">
                🎵
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-base sm:text-lg">
                🍹
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-base sm:text-lg">
                🎉
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 