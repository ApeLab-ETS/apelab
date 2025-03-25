import Link from "next/link";

export default function FesteListPage() {
  // Mock data per le feste
  const feste = [
    {
      id: 1,
      nome: "Festa di Compleanno",
      descrizione: "Celebrazione del compleanno di Mario",
      data_inizio: "2023-06-15",
      ora_inizio: "18:00",
      luogo: "Via Roma 123, Milano",
      max_partecipanti: 30,
      stato: "pianificata"
    },
    {
      id: 2,
      nome: "Party di Fine Anno",
      descrizione: "Festeggiamo insieme l'arrivo del nuovo anno!",
      data_inizio: "2023-12-31",
      ora_inizio: "22:00",
      luogo: "Piazza del Duomo, Milano",
      max_partecipanti: 100,
      stato: "pianificata"
    },
    {
      id: 3,
      nome: "Ritrovo Alumni",
      descrizione: "Incontro degli ex studenti dell'università",
      data_inizio: "2023-07-20",
      ora_inizio: "19:30",
      luogo: "Bar Centrale, Roma",
      max_partecipanti: 50,
      stato: "pianificata"
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>Feste</h1>
        <Link href="/feste/nuova" style={{
          backgroundColor: '#1d4ed8',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>+ Nuova Festa</span>
        </Link>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Cerca feste..."
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '1rem',
              minWidth: '250px'
            }}
          />
          <select
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            <option value="">Stato: Tutti</option>
            <option value="pianificata">Pianificata</option>
            <option value="in_corso">In corso</option>
            <option value="conclusa">Conclusa</option>
            <option value="annullata">Annullata</option>
          </select>
          <input
            type="date"
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {feste.map((festa) => (
          <div key={festa.id} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              height: '150px',
              backgroundColor: '#93c5fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '4rem', opacity: 0.5 }}>🎉</span>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>{festa.nome}</h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#4b5563',
                marginBottom: '1rem'
              }}>{festa.descrizione}</p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                <div>📅 {festa.data_inizio} - {festa.ora_inizio}</div>
                <div>📍 {festa.luogo}</div>
                <div>👥 Max partecipanti: {festa.max_partecipanti}</div>
              </div>
              <div style={{
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                backgroundColor: 
                  festa.stato === 'pianificata' ? '#dbeafe' : 
                  festa.stato === 'in_corso' ? '#dcfce7' : 
                  festa.stato === 'conclusa' ? '#f3f4f6' : '#fee2e2',
                color: 
                  festa.stato === 'pianificata' ? '#1e40af' : 
                  festa.stato === 'in_corso' ? '#166534' : 
                  festa.stato === 'conclusa' ? '#374151' : '#b91c1c',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                marginBottom: '1rem'
              }}>
                {festa.stato === 'pianificata' ? 'Pianificata' : 
                 festa.stato === 'in_corso' ? 'In corso' : 
                 festa.stato === 'conclusa' ? 'Conclusa' : 'Annullata'}
              </div>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1rem'
              }}>
                <Link href={`/feste/${festa.id}`} style={{
                  flex: '1',
                  padding: '0.5rem',
                  textAlign: 'center',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}>
                  Dettagli
                </Link>
                <Link href={`/feste/${festa.id}/partecipa`} style={{
                  flex: '1',
                  padding: '0.5rem',
                  textAlign: 'center',
                  backgroundColor: '#1d4ed8',
                  borderRadius: '0.25rem',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}>
                  Partecipa
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 