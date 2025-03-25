import Link from "next/link";

export default function RegisterPage() {
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
        maxWidth: '500px',
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
        }}>Crea un nuovo account</h1>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="nome" style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>Nome</label>
              <input
                id="nome"
                type="text"
                placeholder="Mario"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="cognome" style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>Cognome</label>
              <input
                id="cognome"
                type="text"
                placeholder="Rossi"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

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
            <label htmlFor="telefono" style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Telefono</label>
            <input
              id="telefono"
              type="tel"
              placeholder="+39 123 456 7890"
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Password</label>
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="confirmPassword" style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Conferma Password</label>
            <input
              id="confirmPassword"
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
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem'
          }}>
            <input
              id="terms"
              type="checkbox"
              style={{
                width: '1rem',
                height: '1rem'
              }}
            />
            <label htmlFor="terms" style={{
              fontSize: '0.875rem'
            }}>
              Accetto i{' '}
              <Link href="/terms" style={{
                color: '#1d4ed8',
                textDecoration: 'none'
              }}>
                termini e condizioni
              </Link>
            </label>
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
            Registrati
          </button>
        </form>
        
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          Hai già un account?{' '}
          <Link href="/auth/login" style={{
            color: '#1d4ed8',
            textDecoration: 'none'
          }}>
            Accedi
          </Link>
        </div>
      </div>
    </div>
  );
} 