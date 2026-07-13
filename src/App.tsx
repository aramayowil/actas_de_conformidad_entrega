/**
 * App.tsx
 *
 * Página principal. Maneja dos vistas con estado local:
 *   - 'home'  → listado + búsqueda + crear/eliminar/descargar
 *   - 'form'  → formulario (alta o edición)
 */
import { useState } from 'react'
import { ActaHome } from '@/components/acta/ActaHome'
import { ActaForm } from '@/components/acta/ActaForm'

type Vista = { tipo: 'home' } | { tipo: 'form'; actaId?: string }

export default function App() {
  const [vista, setVista] = useState<Vista>({ tipo: 'home' })

  if (vista.tipo === 'form') {
    // Usamos key para que el formulario se remonte cuando cambia actaId
    return (
      <ActaForm
        key={vista.actaId ?? 'nueva'}
        actaId={vista.actaId}
        onVolver={() => setVista({ tipo: 'home' })}
      />
    )
  }

  return (
    <ActaHome
      onNueva={() => setVista({ tipo: 'form' })}
      onEditar={(id) => setVista({ tipo: 'form', actaId: id })}
    />
  )
}
