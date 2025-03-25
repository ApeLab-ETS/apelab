import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <Link href="/" className="text-2xl font-bold text-orange-500 no-underline">
            <span className="text-orange-500">Ape</span>lab
          </Link>
        </div>
        
        <div className="flex gap-4">
          <Link href="/eventi" className="text-gray-600 no-underline px-2 py-2 rounded-md transition-colors hover:text-orange-500">
            Eventi
          </Link>
          <Link href="/foto" className="text-gray-600 no-underline px-2 py-2 rounded-md transition-colors hover:text-orange-500">
            Galleria
          </Link>
          <Link href="/chi-siamo" className="text-gray-600 no-underline px-2 py-2 rounded-md transition-colors hover:text-orange-500">
            Chi Siamo
          </Link>
          <Link href="/auth/login" className="text-gray-600 no-underline px-2 py-2 rounded-md transition-colors hover:text-orange-500">
            Accedi
          </Link>
          <Link href="/auth/register" className="bg-orange-500 text-white no-underline px-4 py-2 rounded-md transition-colors hover:bg-orange-600">
            Partecipa
          </Link>
        </div>
      </div>
    </nav>
  );
} 