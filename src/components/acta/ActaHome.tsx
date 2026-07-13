/**
 * components/acta/ActaHome.tsx
 *
 * Pantalla inicial: listado, búsqueda, crear/editar/eliminar/descargar.
 * Incluye toggle de tema y diseño responsive mejorado para móvil.
 */
import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  Calendar,
  User,
  PackageOpen,
} from 'lucide-react'
import { useActaStore } from '@/lib/acta-store'
import type { Acta } from '@/types/acta'
import { format } from 'date-fns'
import { PdfDownloadButton } from './PdfDownloadButton'
import { toast } from 'sonner'

interface Props {
  onNueva: () => void
  onEditar: (id: string) => void
}

export function ActaHome({ onNueva, onEditar }: Props) {
  const actas = useActaStore((s) => s.actas)
  const eliminarActa = useActaStore((s) => s.eliminarActa)
  const [busqueda, setBusqueda] = useState('')
  const [actaAEliminar, setActaAEliminar] = useState<Acta | null>(null)

  const actasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return actas
    return actas.filter(
      (a) =>
        a.cliente.nombre.toLowerCase().includes(q) ||
        (a.cliente.localidad ?? '').toLowerCase().includes(q),
    )
  }, [actas, busqueda])

  function confirmarEliminacion() {
    if (!actaAEliminar) return
    eliminarActa(actaAEliminar.id)
    toast.success(
      `Acta de "${actaAEliminar.cliente.nombre || 'cliente'}" eliminada.`,
    )
    setActaAEliminar(null)
  }

  return (
    <div className="app-shell">
      <div className="mx-auto w-full max-w-4xl px-3 py-4 space-y-4 sm:px-6 sm:py-6 sm:space-y-6 flex-1">
        {/* HEADER */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo_lebaux.png"
              alt="Lebaux Aberturas"
              className="h-11 w-auto sm:h-14"
            />
            <div className="min-w-0">
              <h1
                className="text-lg sm:text-xl font-bold truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                Actas de Entrega
              </h1>
              <p
                className="text-xs sm:text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Conformidad de servicio · Lebaux
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={onNueva} size="lg">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Nueva Acta</span>
              <span className="sm:hidden">Nueva</span>
            </Button>
          </div>
        </header>

        {/* BUSCADOR */}
        <div className="relative">
          <Input
            placeholder="Buscar por cliente o localidad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
            inputMode="search"
          />
        </div>

        {/* LISTADO DE ACTAS */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: 'var(--text-muted)' }}
            >
              Historial
            </h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {actasFiltradas.length} de {actas.length}
            </span>
          </div>

          {actasFiltradas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                {actas.length === 0 ? (
                  <>
                    <PackageOpen
                      className="h-10 w-10"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Todavía no hay actas guardadas.
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Creá tu primera acta con el botón de arriba.
                    </p>
                    <Button
                      onClick={onNueva}
                      variant="outline"
                      size="sm"
                      className="mt-3"
                    >
                      <Plus className="h-4 w-4" />
                      Crear primera acta
                    </Button>
                  </>
                ) : (
                  <>
                    <Search
                      className="h-8 w-8"
                      style={{ color: 'var(--text-muted)' }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      No se encontraron actas con esa búsqueda.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {actasFiltradas.map((a) => (
                <ActaRow
                  key={a.id}
                  acta={a}
                  onEditar={() => onEditar(a.id)}
                  onEliminar={() => setActaAEliminar(a)}
                />
              ))}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer
          className="pt-4 text-center text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <p>Lebaux Aberturas · AV Alem 1930, Tucumán Capital · 3815729129</p>
          <p className="mt-1">
            Las actas se guardan localmente en tu navegador.
          </p>
        </footer>
      </div>

      {/* DIÁLOGO DE ELIMINACIÓN */}
      <ConfirmDialog
        open={actaAEliminar !== null}
        title="¿Eliminar acta?"
        description={
          <>
            Vas a eliminar el acta de{' '}
            <strong>{actaAEliminar?.cliente.nombre || 'cliente'}</strong>. Esta
            acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmarEliminacion}
        onCancel={() => setActaAEliminar(null)}
      />
    </div>
  )
}

/* ── Fila individual de acta ── */
function ActaRow({
  acta,
  onEditar,
  onEliminar,
}: {
  acta: Acta
  onEditar: () => void
  onEliminar: () => void
}) {
  const totalAberturas = acta.elementos.reduce(
    (acc, e) => acc + (e.cantidad || 0),
    0,
  )
  const puedeGenerar =
    acta.cliente.nombre.trim().length > 0 &&
    acta.elementos.length > 0 &&
    acta.elementos.every(
      (e) => e.descripcion.trim().length > 0 && e.cantidad > 0,
    )

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Info principal: clickable para editar */}
        <button
          onClick={onEditar}
          className="flex-1 text-left min-w-0"
          aria-label={`Editar acta de ${acta.cliente.nombre}`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <FileText className="h-4 w-4 text-amber-brand shrink-0" />
            <h3
              className="font-semibold truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {acta.cliente.nombre || '(sin nombre)'}
            </h3>
          </div>
          <div
            className="flex flex-wrap gap-x-4 gap-y-1 text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(acta.fecha), 'dd/MM/yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[140px]">
                {acta.cliente.localidad || '—'}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <PackageOpen className="h-3 w-3" />
              {acta.elementos.length} fila(s) · {totalAberturas} abertura(s)
            </span>
          </div>
        </button>

        {/* Acciones */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onEditar}>
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Editar</span>
          </Button>

          <PdfDownloadButton
            acta={acta}
            puedeGenerar={puedeGenerar}
            label=""
            variant="outline"
            size="sm"
          />

          <Button
            variant="danger"
            size="sm"
            onClick={onEliminar}
            aria-label="Eliminar acta"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ActaHome
