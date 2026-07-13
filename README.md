# Lebaux Aberturas — Actas de Entrega y Conformidad

Aplicación para generar y administrar **Actas de Entrega y Conformidad de Servicio**
para Lebaux Aberturas. Incluye **tema oscuro/claro** y un **diseño responsive tipo
acordeón** optimizado para uso desde móviles.

## Stack

- **Vite** 8 + **React** 19 + **TypeScript** 5
- **Tailwind CSS** 4 (vía plugin `@tailwindcss/vite`)
- **Zustand** (estado global + persistencia en `localStorage`)
- **@react-pdf/renderer** (generación del PDF en cliente)
- **lucide-react** (íconos)
- **date-fns** (formateo de fechas)
- **sonner** (notificaciones toast)

## Características

### Tema oscuro / claro
- **Tema oscuro por defecto**.
- Botón de toggle (ícono luna/sol) en la esquina superior derecha.
- La preferencia se guarda en `localStorage` (clave `lebaux-theme`).
- Sin parpadeo al cargar: el tema se aplica antes de hidratar React.

### Diseño responsive
- **Desktop (≥640px)**: layout clásico con tres Cards abiertas simultáneamente
  (Datos del cliente, Detalle de aberturas, Resumen).
- **Móvil (<640px)**: las tres secciones se muestran como **acordeón**:
  1. **Datos del cliente** — abre primero. Al completar el nombre muestra
     "Listo" y un botón "Continuar a aberturas".
  2. **Detalle de aberturas** — se abre automáticamente al continuar. Las filas
     de aberturas se apilan verticalmente con labels claros. Al completar todas
     muestra "Ver resumen y generar PDF".
  3. **Resumen y descarga** — muestra el resumen y los botones Guardar / PDF /
     Guardar y volver.
- Cada sección colapsada muestra un badge de estado: **Pendiente** o **Listo**.
- Barra inferior fija en móvil con botones Guardar y PDF siempre accesibles.

### Accesibilidad y móvil
- Touch targets de mínimo 44px de altura.
- Inputs con `font-size: 16px` para evitar zoom automático en iOS.
- `inputMode` configurado (numeric, tel, search) para teclados adecuados.
- `aria-expanded` y `aria-label` en todos los botones interactivos.
- Autocomplete habilitado en campos del cliente.

### Persistencia
- Todas las actas se guardan en `localStorage` (clave `lebaux-actas-storage`)
  vía el middleware `persist` de Zustand. Sobreviven recargas del navegador.

### PDF
- Replica el layout del archivo `Acta_de_Entrega_[cliente].pdf`:
  header con logo, bloque Fecha/Localidad/Cliente/Estado, tres secciones
  (Objeto, Detalle de elementos, Condiciones técnicas), y firmas.
- El archivo se descarga como `Acta_de_Entrega_[cliente].pdf`.

## Cómo correrlo

```bash
# 1) Instalar dependencias
npm install
# o con bun:
bun install

# 2) Levantar el dev server
npm run dev
# → http://localhost:5173

# 3) Build de producción
npm run build

# 4) Previsualizar el build
npm run preview
```

## Estructura del proyecto

```
vite-app/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── public/
│   └── logo_lebaux.png
└── src/
    ├── main.tsx               # Entry + aplicar tema inicial
    ├── App.tsx                # Navegación home <-> form
    ├── index.css              # Tailwind + variables CSS (light/dark)
    ├── vite-env.d.ts
    ├── types/
    │   └── acta.ts            # Tipos + helpers (nuevaActa, nuevoElemento)
    ├── lib/
    │   └── acta-store.ts      # Zustand store persistido
    ├── hooks/
    │   └── useTheme.ts        # Hook para tema oscuro/claro
    └── components/
        ├── ui/
        │   ├── Button.tsx
        │   ├── Card.tsx
        │   ├── Input.tsx
        │   ├── Label.tsx
        │   ├── Textarea.tsx
        │   ├── Accordion.tsx       # Sección colapsable
        │   ├── ConfirmDialog.tsx
        │   └── ThemeToggle.tsx     # Botón luna/sol
        └── acta/
            ├── ActaHome.tsx       # Pantalla inicial
            ├── ActaForm.tsx       # Form (acordeón móvil / cards desktop)
            ├── ActaPdfLayout.tsx  # Layout PDF
            └── PdfDownloadButton.tsx
```

## Notas

- Toda la app corre 100% en el cliente (sin backend).
- Para resetear el historial: `localStorage.removeItem('lebaux-actas-storage')`
- Para resetear el tema: `localStorage.removeItem('lebaux-theme')`
# actas_de_entrega
