import { createTheme } from '@/lib/create-theme'

// Tema personalizzato per Apelab con colori orange come primari
export const theme = createTheme({
  theme: {
    colors: {
      primary: {
        DEFAULT: "hsl(24, 95%, 54%)", // orange-500
        foreground: "hsl(0, 0%, 100%)", // white
      },
      secondary: {
        DEFAULT: "hsl(24, 95%, 94%)", // orange-50
        foreground: "hsl(24, 95%, 30%)", // orange-900
      },
      destructive: {
        DEFAULT: "hsl(0, 84%, 60%)",
        foreground: "hsl(0, 0%, 100%)", // white
      },
      muted: {
        DEFAULT: "hsl(220, 14%, 96%)",
        foreground: "hsl(220, 9%, 46%)",
      },
      accent: {
        DEFAULT: "hsl(24, 95%, 94%)", // orange-50
        foreground: "hsl(24, 95%, 30%)", // orange-900
      },
      popover: {
        DEFAULT: "hsl(0, 0%, 100%)",
        foreground: "hsl(222, 47%, 11%)",
      },
      card: {
        DEFAULT: "hsl(0, 0%, 100%)",
        foreground: "hsl(222, 47%, 11%)",
      },
      border: "hsl(214, 32%, 91%)",
      input: "hsl(214, 32%, 91%)",
      ring: "hsl(24, 95%, 54%)", // orange-500
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(222, 47%, 11%)",
    },
    borderRadius: {
      lg: "0.5rem",
      md: "0.4rem",
      sm: "0.25rem",
    },
  },
}) 