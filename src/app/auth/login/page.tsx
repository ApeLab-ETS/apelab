'use client';

import Link from "next/link";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error("Errore durante il login:", err);
      setError("Si è verificato un errore durante il login. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            <span className="text-orange-500">Ape</span>lab
          </h1>
          <p className="text-slate-600 mt-2">Accedi per partecipare ai nostri eventi</p>
        </div>
        
        <Card className="border-orange-100 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center text-slate-800">Bentornato</CardTitle>
            <CardDescription className="text-center">
              Inserisci le tue credenziali per accedere
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200">
                <p className="font-medium">Si è verificato un errore</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@esempio.com"
                  required
                  className="border-slate-300 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <Link href="/auth/reset-password" className="text-xs text-orange-600 hover:text-orange-500 transition-colors">
                    Password dimenticata?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="border-slate-300 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg py-2.5 shadow-md transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Accesso in corso...
                  </>
                ) : 'Accedi'
                }
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
            <div className="w-full border-t border-slate-200 my-1"></div>
            <p className="text-sm text-slate-600 text-center">
              Non hai un account?{' '}
              <Link href="/auth/register" className="text-orange-600 hover:text-orange-500 font-medium transition-colors">
                Registrati
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-lg">
                🎵
              </div>
              <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-lg">
                🍹
              </div>
              <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-lg">
                🎉
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 