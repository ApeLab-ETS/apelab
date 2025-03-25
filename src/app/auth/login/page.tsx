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
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Accedi al tuo account</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@esempio.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/reset-password" className="text-xs text-primary hover:underline">
                  Hai dimenticato la password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Non hai un account?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              Registrati
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 