import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'

// Aplicar tema antes de renderizar (evita flash de tema incorrecto)
const stored = localStorage.getItem('lebaux-theme')
const theme = stored === 'light' || stored === 'dark' ? stored : 'dark'
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" richColors />
  </StrictMode>,
)
