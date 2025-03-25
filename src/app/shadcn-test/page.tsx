'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function ShadcnTestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Test Componenti Shadcn UI</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card con tutti i componenti */}
        <Card>
          <CardHeader>
            <CardTitle>Card di Test</CardTitle>
            <CardDescription>Questa card contiene componenti Shadcn UI per verificarne il funzionamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Inserisci il tuo nome" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@esempio.com" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm font-normal">
                Accetto i termini e condizioni
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Invia</Button>
          </CardFooter>
        </Card>
        
        {/* Buttons di vari stili */}
        <Card>
          <CardHeader>
            <CardTitle>Varianti Button</CardTitle>
            <CardDescription>Test dei vari stili di button disponibili</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 