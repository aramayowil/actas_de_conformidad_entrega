/**
 * components/acta/PdfDownloadButton.tsx
 *
 * Genera el PDF on-demand al hacer clic. No renderiza nada del PDF hasta
 * que el usuario lo pide.
 */
import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { ActaPdfLayout } from './ActaPdfLayout'
import type { Acta } from '@/types/acta'
import { Button } from '@/components/ui/Button'
import { Loader2, Download } from 'lucide-react'

interface Props {
  acta: Acta
  puedeGenerar: boolean
  label?: string
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

function sanitizarNombreArchivo(nombre: string): string {
  return (nombre || 'cliente')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-_]/g, '')
    .slice(0, 60)
}

export function PdfDownloadButton({
  acta,
  puedeGenerar,
  label = 'Generar PDF',
  variant = 'primary',
  size = 'default',
  className = '',
}: Props) {
  const [generando, setGenerando] = useState(false)

  async function handleGenerar() {
    if (!puedeGenerar || generando) return
    setGenerando(true)
    try {
      const blob = await pdf(<ActaPdfLayout acta={acta} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Acta_de_Entrega_${sanitizarNombreArchivo(acta.cliente.nombre)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error al generar PDF:', err)
    } finally {
      setGenerando(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleGenerar}
      disabled={!puedeGenerar || generando}
      variant={variant}
      size={size}
      className={className}
    >
      {generando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {generando ? 'Generando PDF...' : label}
    </Button>
  )
}

export default PdfDownloadButton
