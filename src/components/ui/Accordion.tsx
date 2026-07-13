/**
 * components/ui/Accordion.tsx
 *
 * Sección colapsable para móvil. En desktop se puede forzar a "siempre abierto"
 * pasando `forceOpen` para mantener el layout actual.
 */
import { useState, type ReactNode } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface AccordionSectionProps {
  /** Título corto de la sección */
  title: string
  /** Subtítulo opcional (ej: nombre del cliente cargado) */
  subtitle?: string
  /** Icono a mostrar a la izquierda */
  icon?: ReactNode
  /** Estado controlado: si viene, el padre decide si está abierto */
  open?: boolean
  /** Callback al hacer clic en el header (solo si no es forceOpen) */
  onToggle?: () => void
  /** Si true, siempre abierto (útil para desktop) */
  forceOpen?: boolean
  /** Estado de completitud para mostrar un check verde */
  complete?: boolean
  /** Número de paso (1, 2, 3...) */
  step?: number
  children: ReactNode
}

export function AccordionSection({
  title,
  subtitle,
  icon,
  open,
  onToggle,
  forceOpen = false,
  complete = false,
  step,
  children,
}: AccordionSectionProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = forceOpen || (open !== undefined ? open : internalOpen)

  function handleToggle() {
    if (forceOpen) return
    if (onToggle) {
      onToggle()
    } else {
      setInternalOpen((v) => !v)
    }
  }

  return (
    <div className="accordion-section">
      {!forceOpen && (
        <button
          type="button"
          className="accordion-trigger"
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          <span className="accordion-trigger-left">
            <span className="accordion-trigger-icon">
              {icon ?? (step ? <span className="text-sm font-bold">{step}</span> : null)}
            </span>
            <span className="min-w-0 flex flex-col">
              <span className="accordion-trigger-title">{title}</span>
              {subtitle && <span className="accordion-trigger-subtitle">{subtitle}</span>}
            </span>
          </span>
          <span className="accordion-trigger-right">
            {complete ? (
              <span className="accordion-badge accordion-badge-complete">
                <Check className="h-3 w-3" />
                <span className="ml-0.5">Listo</span>
              </span>
            ) : (
              <span className="accordion-badge">Pendiente</span>
            )}
            <ChevronDown
              className={`h-5 w-5 accordion-chevron ${isOpen ? 'accordion-chevron-open' : ''}`}
            />
          </span>
        </button>
      )}
      <div
        className="accordion-content"
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {forceOpen && (
          <div className="pt-4 pb-1 flex items-center gap-2">
            {icon && <span className="accordion-trigger-icon">{icon}</span>}
            <div>
              <h3 className="accordion-trigger-title">{title}</h3>
              {subtitle && (
                <p className="accordion-trigger-subtitle">{subtitle}</p>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default AccordionSection
