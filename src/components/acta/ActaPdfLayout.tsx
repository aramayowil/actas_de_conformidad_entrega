/**
 * components/acta/ActaPdfLayout.tsx
 *
 * PDF del Acta de Entrega y Conformidad de Servicio.
 * Rediseñado con la paleta corporativa y disposición de firmas ampliada.
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

/* ── Paleta de Colores Corporativa Unificada (Ajustada al Logo) ── */
const BRAND = '#E5933A' // Naranja fiel al espíritu del logo, con el contraste técnico justo para líneas y badges
const TEXT_DARK = '#2A2C2E' // Gris carbón industrial (derivado de tus letras, evita el negro duro y tosco)
const TEXT_MUTED = '#686B6D' // Gris medio idéntico al de la tipografía "LEBAUX" para datos secundarios
const BORDER = '#DCE0E2' // Gris claro para líneas divisorias limpias
const ROW_ALT = '#FDF9F3' // Fondo alterno de filas, un crema cálido y sutil
const TABLE_HEADER_BG = '#F4EFE6' // Fondo de la cabecera de tabla, armonizado con el ícono del logo
const SECTION_BG = '#4A4D4F'

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

/* ── Estilos Corregidos y Optimizados ── */
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    color: TEXT_DARK,
    padding: 30,
    fontSize: 9.5,
    lineHeight: 1.4,
  },

  /* ── HEADER AJUSTADO Y EQUILIBRADO ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Ubica los elementos al tope superior
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: BRAND,
    marginBottom: 15,
  },
  headerLeft: {
    width: '40%',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '60%',
    gap: 1,
  },
  headerLogo: {
    width: 170,
    height: 42,
    objectFit: 'contain',
  },
  headerTitulo: {
    fontSize: 19,
    fontWeight: 'bold',
    color: BRAND,
    textAlign: 'right',
    letterSpacing: 0.5,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  headerEmpresaDato: {
    fontSize: 10,
    color: TEXT_MUTED,
    textAlign: 'right',
    marginTop: 0,
  },

  /* ── BLOQUE DE DATOS ── */
  datosGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 8,
    marginBottom: 10,
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
    paddingHorizontal: 8,
  },

  /* ── TABLA ELEMENTOS ── */
  tablaHeader: {
    flexDirection: 'row',
    backgroundColor: TABLE_HEADER_BG,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: TEXT_DARK,
    borderBottomWidth: 1.5,
    borderBottomColor: BRAND,
  },
  tablaRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    alignItems: 'center',
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
  colEstado: { width: 120, textAlign: 'right', fontSize: 9 },
  estadoBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    color: BRAND,
    borderWidth: 1,
    borderColor: BRAND,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: 'center',
  },

  /* ── CONDICIONES Y ALERTAS ── */
  notaDestacada: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: TEXT_DARK,
    backgroundColor: '#FFF4E0',
    borderLeftWidth: 3,
    borderLeftColor: BRAND,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
    marginHorizontal: 8,
  },
  condicionesIntro: {
    fontSize: 9.5,
    color: TEXT_DARK,
    textAlign: 'justify',
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  bulletDot: {
    width: 12,
    fontSize: 9.5,
    color: BRAND,
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: TEXT_DARK,
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  notaAlerta: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 6,
    marginBottom: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  notaAlertaTexto: {
    fontSize: 9,
    color: TEXT_DARK,
    textAlign: 'justify',
    lineHeight: 1.4,
  },

  /* ── SECCIÓN DE FIRMAS EXPANDIDA ── */
  firmasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 130,
    paddingHorizontal: 20,
  },
  firmaBox: {
    width: '42%',
    borderTopWidth: 1,
    borderTopColor: TEXT_DARK,
    paddingTop: 6,
    alignItems: 'center',
  },
  firmaRol: {
    fontSize: 8.5,
    color: TEXT_MUTED,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
})

interface DatoLineaProps {
  label: string
  valor?: string
}

function DatoLinea({ label, valor }: DatoLineaProps) {
  return (
    <View style={styles.datoFila}>
      <Text style={styles.datoLabel}>{label}:</Text>
      <Text style={styles.datoValor}>{valor || ''}</Text>
    </View>
  )
}

export function ActaPdfLayout({ acta }: { acta: Acta }) {
  const cantidadTotal = totalAberturas(acta)
  const nombreCliente = acta.cliente.nombre || '_______________'
  const localidad = acta.cliente.localidad || 'San Miguel de Tucumán, Tucumán'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER REESTRUCTURADO ── */}
        <View style={styles.header}>
          {/* Columna Izquierda: Logo (Ubicado arriba a la izquierda) */}
          <View style={styles.headerLeft}>
            <Image src="/logo_lebaux.png" style={styles.headerLogo} />
          </View>

          {/* Columna Derecha: Título en Grande y Datos de Contacto */}
          <View style={styles.headerRight}>
            <Text style={styles.headerTitulo}>Acta de Entrega</Text>
            <Text style={styles.headerEmpresaDato}>LEBAUX SRL</Text>
            <Text style={styles.headerEmpresaDato}>
              Av. Alem 1930 - San Miguel de Tucumán
            </Text>
            <Text style={styles.headerEmpresaDato}>Tel: (381) 572-9129</Text>
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
          Las especificaciones sobre la instalación y el alcance de las
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
            materiales específicos de fijación, la mano de obra especializada y
            la correspondiente garantía del trabajo realizado.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>Sellado perimetral:</Text> El
            sellado hermético perimetral se realiza estrictamente con silicona
            neutra y poliuretano expandido hasta un máximo de 1 cm de
            espesor/luz. Cualquier terminación estética posterior (como
            mampostería, yeso o pintura), correrá por cuenta exclusiva del
            cliente mediante servicios externos.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>Límite de la garantía:</Text>{' '}
            La cobertura de la garantía técnica del servicio no contempla, bajo
            núngun concepto, la rotura posterior de los vidrios.
          </Text>
        </View>

        {/* ── BLOQUES DE OBSERVACIÓN ── */}
        <View style={styles.notaAlerta} wrap={false}>
          <Text style={styles.notaAlertaTexto}>
            <Text style={{ fontWeight: 'bold' }}>
              OBSERVACIÓN - INSTALACIÓN DE PAÑO FIJO POR TERCEROS:
            </Text>{' '}
            La empresa NO se responsabiliza por fallas, filtraciones o una mala
            colocación en paños fijos cuando la instalación sea realizada por un
            tercero.
          </Text>
        </View>

        <View style={styles.notaAlerta} wrap={false}>
          <Text style={styles.notaAlertaTexto}>
            <Text style={{ fontWeight: 'bold' }}>
              OBSERVACIÓN - REGULACIÓN POR TERCEROS:
            </Text>{' '}
            La empresa NO se responsabiliza por desajustes o la mala regulación
            posterior de puertas y hojas si la instalación o manipulación es
            ejecutada por personal ajeno a nuestra firma.
          </Text>
        </View>

        {/* ── ESPACIO DE FIRMAS CON MARGEN AMPLIADO ── */}
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
