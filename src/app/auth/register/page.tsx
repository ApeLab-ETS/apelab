'use client';

import Link from "next/link";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validazione
    if (formData.password !== formData.confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    if (!formData.termsAccepted) {
      setError("Devi accettare i termini e condizioni");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Registrazione dell'utente
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
            cognome: formData.cognome,
            telefono: formData.telefono,
            ruolo: 'utente' // Ruolo di default
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // 2. Inserisci i dati aggiuntivi nella tabella profili se necessario
      // Nota: in molti casi questo passo è gestito da un trigger in Supabase
      if (authData.user) {
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            nome: formData.nome,
            cognome: formData.cognome,
            telefono: formData.telefono,
            ruolo: 'utente',
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error("Errore nell'inserimento del profilo:", profileError);
          // La registrazione è comunque avvenuta, quindi non blocchiamo il processo
        }
      }

      // Reindirizza alla pagina di successo o login
      router.push('/auth/verifica-email');
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
      setError("Si è verificato un errore durante la registrazione. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

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
        
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Mario"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="cognome" style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>Cognome</label>
              <input
                id="cognome"
                name="cognome"
                type="text"
                value={formData.cognome}
                onChange={handleChange}
                placeholder="Rossi"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  fontSize: '1rem'
                }}
                required
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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@esempio.com"
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="telefono" style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Telefono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="confirmPassword" style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Conferma Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem'
          }}>
            <input
              id="termsAccepted"
              name="termsAccepted"
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={handleChange}
              style={{
                width: '1rem',
                height: '1rem'
              }}
              required
            />
            <label htmlFor="termsAccepted" style={{
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
            disabled={isLoading}
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#93c5fd' : '#1d4ed8',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {isLoading ? 'Registrazione in corso...' : 'Registrati'}
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