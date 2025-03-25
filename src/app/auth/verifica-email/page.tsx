'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerificaEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex flex-col justify-center items-center py-6 px-4 sm:py-10 sm:px-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            <span className="text-orange-500">Ape</span>lab
          </h1>
          <p className="text-slate-600 mt-2 text-base sm:text-lg">Quasi fatto! Un ultimo passo</p>
        </div>
        
        <Card className="border-orange-100 shadow-xl overflow-hidden text-center w-full">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <CardHeader className="pb-2 pt-5 px-5 sm:px-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4">
              ✉️
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">Controlla la tua email</CardTitle>
            <CardDescription className="text-sm sm:text-base text-slate-600 mt-2">
              Abbiamo inviato un link di conferma al tuo indirizzo email.
              <br className="hidden sm:inline" />Per completare la registrazione, clicca sul link presente nell'email.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-5 sm:px-6 pt-2">
            <div className="bg-orange-50 text-orange-800 p-3 sm:p-4 rounded-lg mx-auto max-w-md border border-orange-100 mb-4">
              <p className="text-xs sm:text-sm">
                <span className="font-medium">Suggerimento: </span> 
                Se non vedi l'email, controlla anche nella cartella spam.
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Non hai ricevuto l'email?{' '}
              <Button variant="link" className="text-orange-600 hover:text-orange-500 px-1 h-auto transition-colors underline-offset-4 text-xs sm:text-sm">
                Invia nuovamente
              </Button>
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-5 sm:pb-6 px-5 sm:px-6 pt-3">
            <Button 
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg py-2 sm:py-2.5 shadow-md transition-colors h-10 sm:h-11 w-full sm:w-auto"
            >
              <Link href="/auth/login">
                <span className="text-sm sm:text-base">Torna alla pagina di login</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="flex items-center justify-center space-x-4 mt-6 sm:mt-8">
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
      </div>
    </div>
  );
} 