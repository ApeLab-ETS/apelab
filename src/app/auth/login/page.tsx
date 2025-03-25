import Link from "next/link";

export default function LoginPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 4rem)',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>Accedi al tuo account</h1>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="email@esempio.com"
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor="password" style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>Password</label>
              <Link href="/auth/reset-password" style={{
                fontSize: '0.75rem',
                color: '#1d4ed8',
                textDecoration: 'none'
              }}>
                Hai dimenticato la password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#1d4ed8',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Accedi
          </button>
        </form>
        
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          Non hai un account?{' '}
          <Link href="/auth/register" style={{
            color: '#1d4ed8',
            textDecoration: 'none'
          }}>
            Registrati
          </Link>
        </div>
      </div>
    </div>
  );
} 