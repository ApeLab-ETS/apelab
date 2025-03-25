import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility per combinare classi CSS con Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formattare la data in formato italiano
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

// Formattare l'ora
export function formatTime(timeString: string): string {
  // Assumendo che timeString sia nel formato "HH:MM:SS"
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
}

// Generare un array di stato delle feste per i filtri
export function getStatiFesta() {
  return [
    { value: "pianificata", label: "Pianificata" },
    { value: "in_corso", label: "In corso" },
    { value: "conclusa", label: "Conclusa" },
    { value: "annullata", label: "Annullata" },
  ];
}

// Generare un array di stato delle partecipazioni per i filtri
export function getStatiPartecipazione() {
  return [
    { value: "confermato", label: "Confermato" },
    { value: "in_attesa", label: "In attesa" },
    { value: "rifiutato", label: "Rifiutato" },
  ];
}

// Utility per truncare un testo lungo
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
} 