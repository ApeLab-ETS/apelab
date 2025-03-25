import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col lg:flex">
        <h1 className="text-4xl font-bold mb-4 text-center">Benvenuto nell'App Gestione Feste</h1>
        <p className="text-lg opacity-80 max-w-[700px] text-center mb-8">
          Organizza, gestisci e partecipa a eventi in modo semplice e veloce. Una soluzione completa per ogni tipo di festa.
        </p>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 w-full max-w-md">
          <Link 
            href="/auth/login" 
            className="px-4 py-2 rounded bg-blue-600 text-white text-center hover:bg-blue-700 transition-colors"
          >
            Accedi
          </Link>
          <Link 
            href="/auth/register" 
            className="px-4 py-2 rounded border border-gray-300 text-center hover:bg-gray-100 transition-colors"
          >
            Registrati
          </Link>
        </div>
      </div>

      <div className="mt-20 grid gap-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Funzionalità principali</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-2">Crea Feste</h3>
            <p className="text-sm opacity-80">Organizza facilmente eventi e invita amici e conoscenti.</p>
          </div>
          <div className="p-6 rounded-lg border bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-2">Gestisci Partecipazioni</h3>
            <p className="text-sm opacity-80">Tieni traccia di chi parteciperà ai tuoi eventi.</p>
          </div>
          <div className="p-6 rounded-lg border bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-2">Ricevi Notifiche</h3>
            <p className="text-sm opacity-80">Resta aggiornato sugli eventi a cui sei invitato.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
