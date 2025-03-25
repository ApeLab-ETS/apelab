import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
      <div>
        <Link href="/" className="text-2xl font-bold text-blue-700 no-underline">
          Gestione Feste
        </Link>
      </div>
      
      <div className="flex gap-4">
        <Link href="/feste" className="text-gray-600 no-underline px-2 py-2 rounded-md transition-colors">
          Feste
        </Link>
        <Link href="/auth/login" className="text-gray-600 no-underline px-2 py-2 rounded-md transition-colors">
          Accedi
        </Link>
        <Link href="/auth/register" className="bg-blue-700 text-white no-underline px-4 py-2 rounded-md transition-colors">
          Registrati
        </Link>
      </div>
    </nav>
  );
} 