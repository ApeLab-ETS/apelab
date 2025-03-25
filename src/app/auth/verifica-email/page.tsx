'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerificaEmailPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-8">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="text-6xl mx-auto mb-4">
            ✉️
          </div>
          <CardTitle>Controlla la tua email</CardTitle>
          <CardDescription className="text-base">
            Abbiamo inviato un link di conferma al tuo indirizzo email.
            <br />Per completare la registrazione, clicca sul link presente nell'email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Se non hai ricevuto l'email, controlla la cartella spam o 
            <Button variant="link" className="text-primary px-1 h-auto">
              richiedi un nuovo link
            </Button>.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/auth/login">
              Torna alla pagina di login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 