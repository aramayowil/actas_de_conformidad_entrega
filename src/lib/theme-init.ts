/**
 * Script inline que se ejecuta antes de que React hidrate.
 * Aplica el tema guardado en localStorage (o el default: oscuro)
 * para evitar parpadeo de tema incorrecto al cargar la página.
 */
export function applyInitialTheme() {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem('lebaux-theme')
  const theme = stored === 'light' || stored === 'dark' ? stored : 'dark'
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
