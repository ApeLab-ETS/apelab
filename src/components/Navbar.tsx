import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ 
      backgroundColor: 'white', 
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link href="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: '#1d4ed8',
          textDecoration: 'none'
        }}>
          Gestione Feste
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/feste" style={{ 
          color: '#4b5563', 
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '0.25rem',
          transition: 'background-color 0.2s'
        }}>
          Feste
        </Link>
        <Link href="/auth/login" style={{ 
          color: '#4b5563', 
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '0.25rem',
          transition: 'background-color 0.2s'
        }}>
          Accedi
        </Link>
        <Link href="/auth/register" style={{ 
          backgroundColor: '#1d4ed8',
          color: 'white',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          transition: 'background-color 0.2s'
        }}>
          Registrati
        </Link>
      </div>
    </nav>
  );
} 