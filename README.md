# Applicazione Gestione Feste

Un'applicazione completa per la gestione di feste ed eventi. Permette di creare, organizzare e partecipare a feste, con funzionalità di notifica, gestione partecipanti e molto altro.

## Stack Tecnologico

- **Frontend**: Next.js 14 con TypeScript
- **Backend**: Supabase
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Componenti UI**: Shadcn/UI

## Funzionalità Principali

- Autenticazione completa (login, registrazione, recupero password)
- Gestione profilo utente
- Creazione e gestione feste
- Sistema di partecipazione agli eventi
- Notifiche per inviti e aggiornamenti
- Dashboard amministrativa
- Funzionalità aggiuntive (calendario, QR code, condivisione social)

## Installazione

1. Clona il repository:
```bash
git clone [repository-url]
cd applicazione-gestione-feste
```

2. Installa le dipendenze:
```bash
npm install
```

3. Configura le variabili d'ambiente:
```bash
cp .env.local.example .env.local
```
Poi modifica il file `.env.local` con le tue credenziali Supabase.

4. Avvia il server di sviluppo:
```bash
npm run dev
```

## Struttura del Database

L'applicazione utilizza Supabase come backend e database con le seguenti tabelle:

- **Profili**: Gestione utenti e ruoli
- **Feste**: Informazioni sugli eventi
- **Partecipazioni**: Gestione partecipanti
- **Notifiche**: Sistema di notifiche

## Sviluppo

Per contribuire al progetto:

1. Crea un branch per la tua feature:
```bash
git checkout -b feature/nome-feature
```

2. Fai le modifiche e committa:
```bash
git commit -m "Descrizione delle modifiche"
```

3. Pusha il branch:
```bash
git push origin feature/nome-feature
```

4. Apri una Pull Request

## Licenza

[MIT](LICENSE)
