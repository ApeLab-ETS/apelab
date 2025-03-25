import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      textAlign: 'center',
      minHeight: 'calc(100vh - 4rem)'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          Benvenuto nell'App Gestione Feste
        </h1>
        <p style={{
          fontSize: '1.25rem',
          opacity: 0.8,
          maxWidth: '700px',
          margin: '0 auto 2rem auto'
        }}>
          Organizza, gestisci e partecipa a eventi in modo semplice e veloce. Una soluzione completa per ogni tipo di festa.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          maxWidth: '400px',
          margin: '0 auto',
          marginBottom: '3rem'
        }}>
          <Link href="/auth/login" style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            backgroundColor: '#1d4ed8',
            color: 'white',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'background-color 0.2s'
          }}>
            Accedi
          </Link>
          <Link href="/auth/register" style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: '1px solid #d1d5db',
            color: '#111827',
            textDecoration: 'none',
            textAlign: 'center',
            transition: 'background-color 0.2s'
          }}>
            Registrati
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: '3rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem'
        }}>Funzionalità principali</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px'
        }}>
          <div style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>Crea Feste</h3>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.8
            }}>Organizza facilmente eventi e invita amici e conoscenti.</p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>Gestisci Partecipazioni</h3>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.8
            }}>Tieni traccia di chi parteciperà ai tuoi eventi.</p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>Ricevi Notifiche</h3>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.8
            }}>Resta aggiornato sugli eventi a cui sei invitato.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
