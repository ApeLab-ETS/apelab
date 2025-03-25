'use client';

import Link from "next/link";

export default function VerificaEmailPage() {
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
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          ✉️
        </div>
        
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>Controlla la tua email</h1>
        
        <p style={{
          fontSize: '1rem',
          color: '#4b5563',
          marginBottom: '1.5rem'
        }}>
          Abbiamo inviato un link di conferma al tuo indirizzo email.
          Per completare la registrazione, clicca sul link presente nell'email.
        </p>
        
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Se non hai ricevuto l'email, controlla la cartella spam o 
          <button style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: '#1d4ed8',
            textDecoration: 'underline',
            cursor: 'pointer',
            marginLeft: '0.25rem'
          }}>
            richiedi un nuovo link
          </button>.
        </p>
        
        <Link href="/auth/login" style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: '#1d4ed8',
          color: 'white',
          borderRadius: '0.25rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          Torna alla pagina di login
        </Link>
      </div>
    </div>
  );
} 