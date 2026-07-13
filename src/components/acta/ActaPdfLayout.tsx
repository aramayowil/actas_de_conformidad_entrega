/**
 * components/acta/ActaPdfLayout.tsx
 *
 * PDF del Acta de Entrega y Conformidad de Servicio.
 * Diseño calcado del archivo "Acta_de_Entrega_Gonzalo.pdf".
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'
import type { Acta } from '@/types/acta'

/* ── Paleta ── */
const BRAND = '#B07A2C'
const BRAND_DARK = '#8A5A18'
const TEXT_DARK = '#1F1F1F'
const TEXT_MUTED = '#555555'
const BORDER = '#D9D9D9'
const ROW_ALT = '#FAF7F2'
const TABLE_HEADER_BG = '#E8DBC4'
const SECTION_BG = '#3D3D3D'

/* ── Helpers ── */
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

function formatFechaLarga(iso: string): string {
  try {
    const d = new Date(iso)
    return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
  } catch {
    return iso
  }
}

function totalAberturas(acta: Acta): number {
  return acta.elementos.reduce((acc, e) => acc + (e.cantidad || 0), 0)
}

function pluralizar(n: number, singular: string, plural: string) {
  return n === 1 ? singular : plural
}

/* ── Estilos ── */
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    color: TEXT_DARK,
    padding: 36,
    fontSize: 9.5,
    lineHeight: 1.4,
  },

  /* ── HEADER ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: BRAND,
  },
  headerLogo: {
    height: 56,
    width: 130,
    objectFit: 'contain',
    objectPosition: 'left center',
  },
  headerEmpresaDato: {
    fontSize: 8,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  headerTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: TEXT_DARK,
    textAlign: 'right',
    letterSpacing: 0.3,
  },
  headerSubtitulo: {
    fontSize: 8,
    fontWeight: 'bold',
    color: BRAND_DARK,
    textAlign: 'right',
    letterSpacing: 0.6,
    marginTop: 3,
  },

  /* ── BLOQUE DE DATOS ── */
  datosGrid: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  datoFila: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'baseline',
  },
  datoLabel: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: TEXT_DARK,
    width: 90,
  },
  datoValor: {
    fontSize: 9.5,
    color: TEXT_DARK,
    flex: 1,
  },

  /* ── SECCIONES ── */
  seccionTitulo: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: SECTION_BG,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 2,
  },
  parrafo: {
    fontSize: 9.5,
    color: TEXT_DARK,
    textAlign: 'justify',
    marginBottom: 6,
    lineHeight: 1.45,
  },

  /* ── TABLA ELEMENTOS ── */
  tablaHeader: {
    flexDirection: 'row',
    backgroundColor: TABLE_HEADER_BG,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: TEXT_DARK,
    borderRadius: 2,
  },
  tablaRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    alignItems: 'flex-start',
  },
  tablaRowAlt: {
    backgroundColor: ROW_ALT,
  },
  colCantidad: {
    width: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 10,
  },
  colDescripcion: { flex: 1, paddingHorizontal: 8, fontSize: 9.5 },
  colEstado: { width: 110, textAlign: 'center', fontSize: 9 },
  estadoBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    color: BRAND_DARK,
    borderWidth: 0.75,
    borderColor: BRAND_DARK,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: 'center',
  },

  /* ── CONDICIONES ── */
  notaDestacada: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: TEXT_DARK,
    backgroundColor: '#FFF4E0',
    borderLeftWidth: 3,
    borderLeftColor: BRAND_DARK,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  condicionesIntro: {
    fontSize: 9.5,
    color: TEXT_DARK,
    textAlign: 'justify',
    marginBottom: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    width: 12,
    fontSize: 9.5,
    color: BRAND_DARK,
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: TEXT_DARK,
    textAlign: 'justify',
    lineHeight: 1.4,
  },

  /* ── FIRMAS ── */
  firmasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
  },
  firmaBox: {
    width: '42%',
    borderTopWidth: 1,
    borderTopColor: TEXT_DARK,
    paddingTop: 4,
    alignItems: 'center',
  },
  firmaNombre: {
    fontSize: 10,
    fontWeight: 'bold',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  firmaRol: {
    fontSize: 8,
    color: TEXT_MUTED,
  },
})

/* ── Sub-componentes ── */
function DatoLinea({ label, valor }: { label: string; valor?: string }) {
  return (
    <View style={styles.datoFila}>
      <Text style={styles.datoLabel}>{label}:</Text>
      <Text style={styles.datoValor}>{valor || ''}</Text>
    </View>
  )
}

/* ── Documento ── */
export function ActaPdfLayout({ acta }: { acta: Acta }) {
  const cantidadTotal = totalAberturas(acta)
  const nombreCliente = acta.cliente.nombre || '_______________'
  const localidad = acta.cliente.localidad || 'San Miguel de Tucumán, Tucumán'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Image src="/logo_lebaux.png" style={styles.headerLogo} />
            <Text style={styles.headerEmpresaDato}>
              AV Alem 1930, Tucumán Capital
            </Text>
            <Text style={styles.headerEmpresaDato}>
              3815729129 · lebauxaberturas1930@gmail.com
            </Text>
          </View>
          <View>
            <Text style={styles.headerTitulo}>LEBAUX ABERTURAS</Text>
            <Text style={styles.headerSubtitulo}>
              ACTA DE ENTREGA Y CONFORMIDAD DE SERVICIO
            </Text>
          </View>
        </View>

        {/* ── BLOQUE DE DATOS ── */}
        <View style={styles.datosGrid}>
          <DatoLinea label="Fecha" valor={formatFechaLarga(acta.fecha)} />
          <DatoLinea label="Localidad" valor={localidad} />
          <DatoLinea label="Cliente" valor={nombreCliente} />
          <DatoLinea label="Estado" valor="Entregado en conformidad" />
        </View>

        {/* ── 1. OBJETO DEL ACTA ── */}
        <Text style={styles.seccionTitulo}>1. OBJETO DEL ACTA</Text>
        <Text style={styles.parrafo}>
          Por medio de la presente, se deja constancia formal de la entrega y
          recepción de las estructuras que se detallan a continuación. El
          receptor declara haber verificado y constatado el correcto estado
          estético, estructural y el funcionamiento óptimo de cada uno de los
          componentes al momento de su recepción física.
        </Text>

        {/* ── 2. DETALLE DE LOS ELEMENTOS ENTREGADOS ── */}
        <Text style={styles.seccionTitulo}>
          2. DETALLE DE LOS ELEMENTOS ENTREGADOS
        </Text>
        <View style={styles.tablaHeader}>
          <Text style={styles.colCantidad}>Cantidad</Text>
          <Text style={styles.colDescripcion}>Descripción de la Abertura</Text>
          <Text style={styles.colEstado}>Estado de Prueba</Text>
        </View>
        {acta.elementos.map((e, idx) => (
          <View
            key={e.id}
            style={[styles.tablaRow, idx % 2 === 1 ? styles.tablaRowAlt : {}]}
          >
            <Text style={styles.colCantidad}>{e.cantidad}</Text>
            <Text style={styles.colDescripcion}>{e.descripcion || '—'}</Text>
            <View style={styles.colEstado}>
              <Text style={styles.estadoBadge}>Verificado y Probado</Text>
            </View>
          </View>
        ))}

        <Text style={styles.parrafo}>
          El cliente {nombreCliente} recibe en conformidad la totalidad de las{' '}
          {cantidadTotal} {pluralizar(cantidadTotal, 'abertura', 'aberturas')},{' '}
          habiendo realizado las pruebas pertinentes de apertura, cierre y
          encuadre en presencia del personal técnico encargado del transporte y
          entrega.
        </Text>

        {/* ── 3. CONDICIONES TÉCNICAS ── */}
        <Text style={styles.seccionTitulo}>
          3. CONDICIONES TÉCNICAS Y COBERTURA DEL SERVICIO
        </Text>
        <Text style={styles.notaDestacada}>
          IMPORTANTE: NO NOS HACEMOS CARGO DE VANOS EN FALSA ESCUADRA.
        </Text>
        <Text style={styles.condicionesIntro}>
          Las especificaciones relativas a la instalación y al alcance de las
          responsabilidades técnicas contratadas se rigen bajo las siguientes
          cláusulas operativas:
        </Text>

        <View style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>Instalación técnica:</Text> Se
            realizan exclusivamente colocaciones en seco.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>Exclusiones de obra:</Text> No
            se realizan trabajos de mampostería ni albañilería bajo ninguna
            circunstancia.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>Naturaleza del servicio:</Text>{' '}
            La colocación se ejecuta bajo expreso pedido y consentimiento del
            cliente.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>
              Alcance de la prestación:
            </Text>{' '}
            El servicio integral de instalación incluye la totalidad de los
            materiales específicos de fijación, la mano de obra especializada,
            el sellado hermético perimetral y la correspondiente garantía del
            trabajo realizado.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>Límite de la garantía:</Text>{' '}
            La cobertura de la garantía técnica del servicio no contempla, bajo
            ningún concepto, la rotura posterior de los vidrios.
          </Text>
        </View>

        {/* ── FIRMAS ── */}
        <View style={styles.firmasRow} wrap={false}>
          <View style={styles.firmaBox}>
            <Text style={styles.firmaRol}>D.N.I. / Firma del Receptor</Text>
          </View>
          <View style={styles.firmaBox}>
            <Text style={styles.firmaRol}>Firma Autorizada / Responsable</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ActaPdfLayout
