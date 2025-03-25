type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

interface ColorConfig {
  DEFAULT: string
  foreground?: string
}

interface ColorsConfig {
  primary: ColorConfig
  secondary?: ColorConfig
  destructive?: ColorConfig
  muted?: ColorConfig
  accent?: ColorConfig
  popover?: ColorConfig
  card?: ColorConfig
  border?: string
  input?: string
  ring?: string
  background?: string
  foreground?: string
}

interface BorderRadiusConfig {
  lg?: string
  md?: string
  sm?: string
}

interface ThemeConfig {
  colors: ColorsConfig
  borderRadius?: BorderRadiusConfig
}

export interface Theme {
  theme: ThemeConfig
}

/**
 * Crea un tema personalizzato per shadcn/ui
 * @param theme Configurazione del tema
 * @returns Tema configurato
 */
export function createTheme(theme: DeepPartial<Theme>): Theme {
  return {
    theme: {
      colors: {
        primary: {
          DEFAULT: theme.theme?.colors?.primary?.DEFAULT || 'hsl(222.2, 47.4%, 11.2%)',
          foreground: theme.theme?.colors?.primary?.foreground || 'hsl(210, 40%, 98%)',
        },
        secondary: {
          DEFAULT: theme.theme?.colors?.secondary?.DEFAULT || 'hsl(210, 40%, 96.1%)',
          foreground: theme.theme?.colors?.secondary?.foreground || 'hsl(222.2, 47.4%, 11.2%)',
        },
        destructive: {
          DEFAULT: theme.theme?.colors?.destructive?.DEFAULT || 'hsl(0, 84%, 60%)',
          foreground: theme.theme?.colors?.destructive?.foreground || 'hsl(210, 40%, 98%)',
        },
        muted: {
          DEFAULT: theme.theme?.colors?.muted?.DEFAULT || 'hsl(210, 40%, 96.1%)',
          foreground: theme.theme?.colors?.muted?.foreground || 'hsl(215.4, 16.3%, 46.9%)',
        },
        accent: {
          DEFAULT: theme.theme?.colors?.accent?.DEFAULT || 'hsl(210, 40%, 96.1%)',
          foreground: theme.theme?.colors?.accent?.foreground || 'hsl(222.2, 47.4%, 11.2%)',
        },
        popover: {
          DEFAULT: theme.theme?.colors?.popover?.DEFAULT || 'hsl(0, 0%, 100%)',
          foreground: theme.theme?.colors?.popover?.foreground || 'hsl(222.2, 84%, 4.9%)',
        },
        card: {
          DEFAULT: theme.theme?.colors?.card?.DEFAULT || 'hsl(0, 0%, 100%)',
          foreground: theme.theme?.colors?.card?.foreground || 'hsl(222.2, 84%, 4.9%)',
        },
        border: theme.theme?.colors?.border || 'hsl(214.3, 31.8%, 91.4%)',
        input: theme.theme?.colors?.input || 'hsl(214.3, 31.8%, 91.4%)',
        ring: theme.theme?.colors?.ring || 'hsl(222.2, 84%, 4.9%)',
        background: theme.theme?.colors?.background || 'hsl(0, 0%, 100%)',
        foreground: theme.theme?.colors?.foreground || 'hsl(222.2, 84%, 4.9%)',
      },
      borderRadius: {
        lg: theme.theme?.borderRadius?.lg || '0.5rem',
        md: theme.theme?.borderRadius?.md || '0.4rem',
        sm: theme.theme?.borderRadius?.sm || '0.25rem',
      },
    },
  }
} 