/**
 * components/acta/ActaForm.tsx
 *
 * Formulario de Acta de Entrega con diseño responsive:
 *  - Desktop (sm+): layout actual con Cards abiertas.
 *  - Móvil (<sm): acordeón con 3 secciones colapsables:
 *    1) Datos del cliente
 *    2) Detalle de aberturas
 *    3) Resumen y acciones
 *  Al cargar el formulario, la sección de Cliente está abierta.
 *  Cuando el usuario agrega la primera abertura, la sección de Cliente
 *  se colapsa automáticamente y se abre la de Aberturas.
 */
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { AccordionSection } from '@/components/ui/Accordion'
import { PdfDownloadButton } from './PdfDownloadButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  FileText,
  User,
  PackageOpen,
  CheckCircle2,
} from 'lucide-react'
import { useActaStore } from '@/lib/acta-store'
import {
  nuevaActa,
  nuevoElemento,
  type Acta,
  type ElementoEntregado,
} from '@/types/acta'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Props {
  actaId?: string
  onVolver: () => void
}

/* ── Breakpoint helper: true si la pantalla es >= 640px ── */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 640px)').matches : true,
  )
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

export function ActaForm({ actaId, onVolver }: Props) {
  const store = useActaStore()
  const isDesktop = useIsDesktop()

  const existente = actaId ? store.obtenerActa(actaId) : undefined
  const [acta, setActa] = useState<Acta>(() => existente ?? nuevaActa())

  /* ── Estado del acordeón (solo móvil) ── */
  // Sección activa: 'cliente' | 'aberturas' | 'resumen' | ''
  const [seccionAbierta, setSeccionAbierta] = useState<'cliente' | 'aberturas' | 'resumen' | ''>(
    // Si estamos editando un acta con datos, arrancamos en "aberturas"
    existente && existente.cliente.nombre ? 'aberturas' : 'cliente',
  )

  /* ── Acciones ── */
  function updateCliente<K extends keyof Acta['cliente']>(campo: K, valor: Acta['cliente'][K]) {
    setActa((prev) => ({
      ...prev,
      cliente: { ...prev.cliente, [campo]: valor },
    }))
  }

  function updateElemento(id: string, patch: Partial<ElementoEntregado>) {
    setActa((prev) => ({
      ...prev,
      elementos: prev.elementos.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }

  function addElemento() {
    setActa((prev) => ({
      ...prev,
      elementos: [...prev.elementos, nuevoElemento()],
    }))
    // En móvil, al agregar la primera abertura colapsamos Cliente y abrimos Aberturas
    if (!isDesktop && acta.elementos.length === 1 && seccionAbierta === 'cliente') {
      setSeccionAbierta('aberturas')
    }
  }

  function removeElemento(id: string) {
    setActa((prev) => ({
      ...prev,
      elementos: prev.elementos.filter((e) => e.id !== id),
    }))
  }

  /* ── Validación ── */
  const clienteCompleto = acta.cliente.nombre.trim().length > 0
  const aberturasCompletas =
    acta.elementos.length > 0 &&
    acta.elementos.every((e) => e.descripcion.trim().length > 0 && e.cantidad > 0)
  const puedeGenerar = clienteCompleto && aberturasCompletas
  const puedeGuardar = clienteCompleto

  /* ── Guardar ── */
  function handleGuardar() {
    if (!puedeGuardar) {
      toast.error('Ingresá al menos el nombre del cliente para guardar.')
      return
    }
    const aGuardar: Acta = { ...acta, fecha: new Date().toISOString() }
    if (existente) {
      store.actualizarActa(aGuardar)
      toast.success('Acta actualizada correctamente.')
    } else {
      store.crearActa(aGuardar)
      toast.success('Acta guardada en el historial.')
    }
    setActa(aGuardar)
  }

  function handleGuardarYVolver() {
    if (!puedeGuardar) {
      toast.error('Ingresá al menos el nombre del cliente para guardar.')
      return
    }
    const aGuardar: Acta = { ...acta, fecha: new Date().toISOString() }
    if (existente) {
      store.actualizarActa(aGuardar)
    } else {
      store.crearActa(aGuardar)
    }
    toast.success('Acta guardada. Volviendo al historial.')
    onVolver()
  }

  /* ── Subtítulos para el acordeón ── */
  const clienteSubtitle = clienteCompleto
    ? `${acta.cliente.nombre}${acta.cliente.localidad ? ' · ' + acta.cliente.localidad : ''}`
    : 'Ingresá el nombre del cliente'
  const totalAberturas = acta.elementos.reduce((acc, e) => acc + (e.cantidad || 0), 0)
  const aberturasSubtitle = `${acta.elementos.length} fila(s) · ${totalAberturas} abertura(s)`

  /* ═══════════════════════════════════════════════════════
     RENDERIZADO
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="app-shell">
      <div className="mx-auto w-full max-w-4xl px-3 py-4 space-y-4 pb-32 sm:px-6 sm:py-6 sm:space-y-6 sm:pb-6">
        {/* HEADER */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" onClick={onVolver} aria-label="Volver">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {existente ? 'Editar Acta' : 'Nueva Acta de Entrega'}
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              Acta de Entrega y Conformidad de Servicio
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* BOTÓN "GUARDAR Y VOLVER" en desktop */}
        {isDesktop && (
          <div className="flex items-center justify-end">
            <Button variant="outline" onClick={handleGuardarYVolver} disabled={!puedeGuardar}>
              <Save className="h-4 w-4" />
              Guardar y volver
            </Button>
          </div>
        )}

        {/* ─── DESKTOP: Layout actual con Cards abiertas ─── */}
        {isDesktop ? (
          <div className="space-y-6">
            {/* DATOS DEL CLIENTE */}
            <Card>
              <CardHeader>
                <CardTitle>Datos del cliente</CardTitle>
                <CardDescription>
                  Información básica que aparecerá en el encabezado del acta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClienteFields acta={acta} updateCliente={updateCliente} />
              </CardContent>
            </Card>

            {/* DETALLE DE ABERTURAS */}
            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <CardTitle>Detalle de aberturas entregadas</CardTitle>
                  <CardDescription>
                    Indicá descripción y cantidad de cada elemento entregado y probado.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addElemento}>
                  <Plus className="h-4 w-4" />
                  Agregar fila
                </Button>
              </CardHeader>
              <CardContent>
                <AberturasFields
                  acta={acta}
                  updateElemento={updateElemento}
                  removeElemento={removeElemento}
                  addElemento={addElemento}
                />
              </CardContent>
            </Card>

            {/* RESUMEN */}
            <Card className="bg-neutral-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-brand" />
                  Resumen del acta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResumenContent acta={acta} />
              </CardContent>
            </Card>

            {/* ACCIONES en desktop */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleGuardar} disabled={!puedeGuardar} className="flex-1">
                <Save className="h-4 w-4" />
                Guardar
              </Button>
              <PdfDownloadButton
                acta={acta}
                puedeGenerar={puedeGenerar}
                label="Descargar PDF"
                variant="primary"
                className="flex-1"
              />
            </div>
          </div>
        ) : (
          /* ─── MÓVIL: Acordeón con secciones colapsables ─── */
          <div className="space-y-3">
            <AccordionSection
              title="Datos del cliente"
              subtitle={clienteSubtitle}
              icon={<User className="h-5 w-5" />}
              step={1}
              open={seccionAbierta === 'cliente'}
              onToggle={() =>
                setSeccionAbierta(seccionAbierta === 'cliente' ? '' : 'cliente')
              }
              complete={clienteCompleto}
              forceOpen={false}
            >
              <div className="pt-4">
                <ClienteFields acta={acta} updateCliente={updateCliente} />
                {clienteCompleto && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-4"
                    onClick={() => setSeccionAbierta('aberturas')}
                  >
                    Continuar a aberturas
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                )}
              </div>
            </AccordionSection>

            <AccordionSection
              title="Detalle de aberturas"
              subtitle={aberturasSubtitle}
              icon={<PackageOpen className="h-5 w-5" />}
              step={2}
              open={seccionAbierta === 'aberturas'}
              onToggle={() =>
                setSeccionAbierta(seccionAbierta === 'aberturas' ? '' : 'aberturas')
              }
              complete={aberturasCompletas}
              forceOpen={false}
            >
              <div className="pt-4">
                <AberturasFields
                  acta={acta}
                  updateElemento={updateElemento}
                  removeElemento={removeElemento}
                  addElemento={addElemento}
                  isMobile
                />
                {aberturasCompletas && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-4"
                    onClick={() => setSeccionAbierta('resumen')}
                  >
                    Ver resumen y generar PDF
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                )}
              </div>
            </AccordionSection>

            <AccordionSection
              title="Resumen y descarga"
              subtitle={puedeGenerar ? 'Listo para generar PDF' : 'Completá los pasos anteriores'}
              icon={<FileText className="h-5 w-5" />}
              step={3}
              open={seccionAbierta === 'resumen'}
              onToggle={() =>
                setSeccionAbierta(seccionAbierta === 'resumen' ? '' : 'resumen')
              }
              complete={puedeGenerar}
              forceOpen={false}
            >
              <div className="pt-4 space-y-4">
                <ResumenContent acta={acta} />
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleGuardar}
                  disabled={!puedeGuardar}
                >
                  <Save className="h-4 w-4" />
                  Guardar acta
                </Button>
                <PdfDownloadButton
                  acta={acta}
                  puedeGenerar={puedeGenerar}
                  label="Descargar PDF"
                  variant="primary"
                  size="lg"
                  className="w-full"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleGuardarYVolver}
                  disabled={!puedeGuardar}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Guardar y volver al historial
                </Button>
              </div>
            </AccordionSection>
          </div>
        )}

        {/* ACCIONES FIJAS (móvil, barra inferior) */}
        {!isDesktop && (
          <div
            className="fixed inset-x-0 bottom-0 z-10 px-3 py-3"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderTop: '1px solid var(--border-default)',
            }}
          >
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={handleGuardar}
                disabled={!puedeGuardar}
                className="flex-1"
              >
                <Save className="h-4 w-4" />
                Guardar
              </Button>
              <PdfDownloadButton
                acta={acta}
                puedeGenerar={puedeGenerar}
                label="PDF"
                variant="primary"
                className="flex-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTES REUTILIZABLES
   ═══════════════════════════════════════════════════════ */

function ClienteFields({
  acta,
  updateCliente,
}: {
  acta: Acta
  updateCliente: <K extends keyof Acta['cliente']>(campo: K, valor: Acta['cliente'][K]) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="cliente-nombre">
          Nombre del cliente <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cliente-nombre"
          placeholder="Nombre completo del cliente"
          value={acta.cliente.nombre}
          onChange={(e) => updateCliente('nombre', e.target.value)}
          autoComplete="name"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cliente-dni">DNI (opcional)</Label>
        <Input
          id="cliente-dni"
          placeholder="Número de documento"
          value={acta.cliente.dni ?? ''}
          onChange={(e) => updateCliente('dni', e.target.value)}
          inputMode="numeric"
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cliente-telefono">Teléfono (opcional)</Label>
        <Input
          id="cliente-telefono"
          placeholder="Ej: 381 572 9129"
          value={acta.cliente.telefono ?? ''}
          onChange={(e) => updateCliente('telefono', e.target.value)}
          inputMode="tel"
          autoComplete="tel"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="cliente-localidad">Localidad</Label>
        <Input
          id="cliente-localidad"
          placeholder="San Miguel de Tucumán, Tucumán"
          value={acta.cliente.localidad ?? ''}
          onChange={(e) => updateCliente('localidad', e.target.value)}
          autoComplete="address-level2"
        />
      </div>
    </div>
  )
}

function AberturasFields({
  acta,
  updateElemento,
  removeElemento,
  addElemento,
  isMobile = false,
}: {
  acta: Acta
  updateElemento: (id: string, patch: Partial<ElementoEntregado>) => void
  removeElemento: (id: string) => void
  addElemento: () => void
  isMobile?: boolean
}) {
  return (
    <div className="space-y-3">
      {/* Header de tabla (desktop) */}
      {!isMobile && (
        <div className="hidden sm:grid grid-cols-[60px_1fr_120px_40px] gap-2 text-xs font-semibold uppercase tracking-wide px-1" style={{ color: 'var(--text-muted)' }}>
          <span>Cantidad</span>
          <span>Descripción de la abertura</span>
          <span>Estado</span>
          <span></span>
        </div>
      )}

      {acta.elementos.map((el, idx) => (
        <div
          key={el.id}
          className="rounded-lg p-3"
          style={{
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          {isMobile ? (
            /* ── Layout móvil: stacked verticalmente ── */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Abertura #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeElemento(el.id)}
                  disabled={acta.elementos.length <= 1}
                  className="btn btn-ghost btn-sm !min-h-9 !p-2 text-red-600"
                  aria-label="Quitar fila"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-[80px_1fr] gap-2">
                <div>
                  <Label htmlFor={`cantidad-${el.id}`} className="text-xs">
                    Cantidad
                  </Label>
                  <Input
                    id={`cantidad-${el.id}`}
                    type="number"
                    min={1}
                    placeholder="0"
                    value={el.cantidad || ''}
                    onChange={(e) =>
                      updateElemento(el.id, { cantidad: Number(e.target.value) || 0 })
                    }
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <Label htmlFor={`estado-${el.id}`} className="text-xs">
                    Estado
                  </Label>
                  <div
                    className="flex items-center justify-center h-[44px] rounded-md px-2 text-xs font-semibold"
                    style={{
                      border: '1px solid var(--border-amber)',
                      backgroundColor: 'var(--bg-amber-soft)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    Verificado y Probado
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor={`desc-${el.id}`} className="text-xs">
                  Descripción
                </Label>
                <Textarea
                  id={`desc-${el.id}`}
                  placeholder="Ej: Aberturas corredizas 3 hojas 3 guías. Medidas: 307 x 176."
                  value={el.descripcion}
                  onChange={(e) => updateElemento(el.id, { descripcion: e.target.value })}
                />
              </div>
            </div>
          ) : (
            /* ── Layout desktop: grid horizontal ── */
            <div className="grid grid-cols-[60px_1fr_120px_40px] gap-2 items-start">
              <Input
                id={`cantidad-${el.id}`}
                type="number"
                min={1}
                placeholder="0"
                className="w-[60px]"
                value={el.cantidad || ''}
                onChange={(e) =>
                  updateElemento(el.id, { cantidad: Number(e.target.value) || 0 })
                }
              />
              <Textarea
                id={`desc-${el.id}`}
                placeholder="Ej: Aberturas corredizas 3 hojas 3 guías. Medidas: 307 x 176."
                value={el.descripcion}
                onChange={(e) => updateElemento(el.id, { descripcion: e.target.value })}
              />
              <div
                className="flex items-center justify-center h-9 rounded-md px-2 text-xs font-semibold"
                style={{
                  border: '1px solid var(--border-amber)',
                  backgroundColor: 'var(--bg-amber-soft)',
                  color: 'var(--accent-primary)',
                }}
              >
                Verificado y Probado
              </div>
              <button
                type="button"
                onClick={() => removeElemento(el.id)}
                disabled={acta.elementos.length <= 1}
                className="btn btn-ghost btn-icon text-red-600"
                aria-label="Quitar fila"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={addElemento}
        className="w-full"
        style={{ border: '1px dashed var(--border-default)' }}
      >
        <Plus className="h-4 w-4" />
        Agregar otra abertura
      </Button>
    </div>
  )
}

function ResumenContent({ acta }: { acta: Acta }) {
  const totalAberturas = acta.elementos.reduce((acc, e) => acc + (e.cantidad || 0), 0)
  return (
    <div className="text-sm space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
      <FilaResumen label="Cliente" valor={acta.cliente.nombre || '—'} />
      <FilaResumen label="Fecha" valor={format(new Date(acta.fecha), 'dd/MM/yyyy')} />
      <FilaResumen label="Localidad" valor={acta.cliente.localidad || '—'} />
      <FilaResumen label="Cantidad de filas" valor={String(acta.elementos.length)} />
      <FilaResumen label="Total de aberturas" valor={String(totalAberturas)} />
    </div>
  )
}

function FilaResumen({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-medium" style={{ color: 'var(--text-muted)' }}>
        {label}:
      </span>
      <span style={{ color: 'var(--text-primary)' }} className="text-right">
        {valor}
      </span>
    </div>
  )
}

export default ActaForm
