/**
 * components/ui/ThemeToggle.tsx
 *
 * Botón para alternar entre tema claro y oscuro.
 */
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface Props {
  className?: string
}

export function ThemeToggle({ className = '' }: Props) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
      className="btn btn-ghost btn-icon"
      style={{
        border: '1px solid var(--border-default)',
      }}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}

export default ThemeToggle
