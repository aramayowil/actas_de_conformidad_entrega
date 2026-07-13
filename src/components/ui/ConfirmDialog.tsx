/**
 * components/ui/ConfirmDialog.tsx
 *
 * Diálogo de confirmación simple para eliminar actas.
 */
import type { ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {description}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className="!bg-red-600 hover:!bg-red-700"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
