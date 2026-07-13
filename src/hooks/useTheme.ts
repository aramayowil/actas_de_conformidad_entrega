/**
 * hooks/useTheme.ts
 *
 * Hook para manejar el tema (claro/oscuro) con persistencia en localStorage.
 * Aplica la clase `dark` al <html> para activar las variables CSS correspondientes.
 */
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'lebaux-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark' // SSR fallback
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  // Default: oscuro (como pidió el usuario)
  return 'dark'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  // Aplicar el tema al montar y cada vez que cambie
  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function setLight() {
    setTheme('light')
  }

  function setDark() {
    setTheme('dark')
  }

  return { theme, toggleTheme, setLight, setDark }
}
