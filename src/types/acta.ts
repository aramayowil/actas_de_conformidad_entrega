/**
 * types/acta.ts
 *
 * Tipos para el Acta de Entrega y Conformidad de Servicio.
 */

/**
 * Genera un UUID v4. Usa crypto.randomUUID() si está disponible
 * (HTTPS o localhost); si no, usa un fallback con crypto.getRandomValues
 * que funciona en cualquier contexto HTTP.
 */
function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback: RFC 4122 v4 con crypto.getRandomValues
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
  }
  // Último recurso: Math.random (no criptográfico, pero suficiente para ids locales)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface ElementoEntregado {
  id: string
  descripcion: string
  cantidad: number
}

export interface DatosCliente {
  nombre: string
  dni?: string
  telefono?: string
  domicilio?: string
  localidad?: string
}

export interface Acta {
  id: string
  fecha: string // ISO string, serializable en localStorage
  cliente: DatosCliente
  elementos: ElementoEntregado[]
}

export function nuevoElemento(): ElementoEntregado {
  return {
    id: uuid(),
    descripcion: '',
    cantidad: 1,
  }
}

export function nuevaActa(): Acta {
  return {
    id: uuid(),
    fecha: new Date().toISOString(),
    cliente: {
      nombre: '',
      localidad: 'San Miguel de Tucumán, Tucumán',
    },
    elementos: [nuevoElemento()],
  }
}
