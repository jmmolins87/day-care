# SPEC 06 — Modal "Nueva publicación" desde el sidebar del feed (mockup `crear-publicacion.dc.html`)

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-09-20
> **Objetivo:** Implementar la creación de publicación como modal que abre el botón "Nueva publicación" del Sidebar, 1:1 con `crear-publicacion.dc.html`, con selección múltiple de niños (excluyente con "Toda la sala"), tipo de selección única y drag & drop de fotos con previews locales, todo con mocks y sin persistencia.

## Por qué

Retoma el botón "Nueva publicación" que SPEC 01 dejó estático en el Sidebar y convierte la página suelta `crear-publicacion.dc.html` en modal, siguiendo el patrón de SPEC 04/05. Introduce el mock de tipos de publicación (7 tipos con par pastel/sólido), que reutilizarán las specs de feed dinámico y avisos, y la primera zona de drag & drop de la app.

## Alcance

**In:**

- `app/data/postTypes.ts` nuevo: mock tipado con los 7 tipos del mockup (Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio), cada uno con su par pastel (chip sin seleccionar) y su color sólido (chip seleccionado, texto blanco).
- `app/components/CreatePostModal.tsx` nuevo (client): botón "Nueva publicación" (mismo gradiente `180deg #F4977E→#EE8164` actual del Sidebar) + overlay (`rgba(63,54,46,.45)`, `role="dialog"`, `aria-modal`) y tarjeta del mockup.
- Tarjeta 1:1: max-width 580px, fondo `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra `0 20px 50px -24px rgba(63,54,46,.35)`. Header con Cancelar (`#94887B`, peso 700, 15px) / "Nueva publicación" (Fredoka 600, 18px, `#3F362E`) / Publicar (`#D9583C`, peso 800, 15px).
- PARA: 8 chips, uno por niño de `children.ts` (avatar circular 26px con `{bg, color}` e `initial` del niño) + chip "Toda la sala". Selección múltiple de niños, sin preselección; "Toda la sala" excluyente: activarla desmarca a los niños y marcar a un niño la desactiva. Chip sin marcar: borde `#ECE0D0`, fondo `#FFFDF9`, texto `#6E6359`; marcado: borde y fondo `#3F362E`, texto blanco (el avatar conserva su color).
- TIPO: 7 chips de selección única, sin preselección. Sin seleccionar: par pastel del tipo; seleccionado: fondo sólido con texto blanco.
- DESCRIPCIÓN: textarea blanco, radio 14px, borde 1.5px `#EADFD0`, min-height 120px, `resize: vertical`, placeholder "Contá cómo le fue hoy…", abre vacío.
- FOTOS: fila de tiles 96×96 (radio 14px, gap 12px, wrap). Abre con el tile placeholder del mockup (icono de imagen `#CBB89F` sobre `#F4ECE1`) + tile "Agregar" (dashed `#DBCDBA`, icono + `#C5503A`, texto "Agregar").
- Drag & drop sobre la zona FOTOS: soltar archivos de imagen añade tiles con preview real vía `URL.createObjectURL`; durante `dragover` el tile "Agregar" realza su borde a `#C5503A`; arrastrar un tile sobre otro los reordena; la X de cada tile lo quita. Click en "Agregar" abre el selector nativo (input file oculto, `accept="image/*"`, múltiple). `URL.revokeObjectURL` al quitar un tile y al cerrar la modal.
- Validación al Publicar, solo frontend: PARA (al menos 1 niño o "Toda la sala"), TIPO y descripción requeridos. Errores inline: texto `#C5413A` bajo la fila en PARA y TIPO (patrón PARENTESCO de SPEC 05); textarea con borde `#C5503A` y texto `#C5413A` debajo. Submit válido cierra la modal sin persistir.
- Cierre de la modal: botón Cancelar, tecla Escape y click en el fondo; no se cierra con clicks dentro de la tarjeta.
- `app/components/Sidebar.tsx` modificado: el botón "Nueva publicación" (línea 55) se sustituye por `<CreatePostModal />`; el resto del Sidebar no cambia.

**Out of scope (para specs futuras):**

- Persistencia, API o creación real del post; el post no se añade al feed, siquiera en memoria.
- Subida real de archivos: las fotos viven solo como object URLs durante la sesión de la modal.
- Tope de cantidad de fotos, recorte/redimensión y captions por foto.
- Feed dinámico, pantallas avisos, resumen del día, mi cuenta.
- Responsive/móvil.

## Modelo de datos

```ts
// app/data/postTypes.ts
export type PostTypeKey =
  | "food" | "nap" | "activity" | "achievement" | "mood" | "photo" | "announcement";

export type PostType = {
  key: PostTypeKey;
  label: string;                       // "Comida", "Siesta", …
  soft: { bg: string; color: string }; // chip sin seleccionar
  solid: string;                       // fondo del chip seleccionado (texto blanco)
};

export const postTypes: PostType[] = [
  { key: "food",         label: "Comida",    soft: { bg: "#F4DC8E", color: "#9A7B1E" }, solid: "#9A7B1E" },
  { key: "nap",          label: "Siesta",    soft: { bg: "#E7DCF6", color: "#7B5FC0" }, solid: "#7B5FC0" },
  { key: "activity",     label: "Actividad", soft: { bg: "#C7E7F1", color: "#2E89A6" }, solid: "#2E89A6" },
  { key: "achievement",  label: "Logro",     soft: { bg: "#CFEBD8", color: "#3E9B6C" }, solid: "#3E9B6C" },
  { key: "mood",         label: "Ánimo",     soft: { bg: "#F9D2DE", color: "#C56486" }, solid: "#C56486" },
  { key: "photo",        label: "Foto",      soft: { bg: "#FBD8CC", color: "#D9684A" }, solid: "#D9684A" },
  { key: "announcement", label: "Anuncio",   soft: { bg: "#CCD8F4", color: "#4E72C8" }, solid: "#4E72C8" },
];
```

```ts
// Estado local del formulario en CreatePostModal.tsx (client)
type PhotoPreview = {
  id: string;
  url: string | null; // null → tile placeholder del mockup; string → URL.createObjectURL
};

type CreatePostForm = {
  selectedChildSlugs: string[]; // multi-selección, abre vacío
  allClassroom: boolean;        // "Toda la sala", excluyente con selectedChildSlugs
  type: "" | PostTypeKey;       // selección única, abre vacío
  description: string;          // abre vacío
  photos: PhotoPreview[];       // abre con [{ id: "mock", url: null }]
};
```

El formulario no produce ni persiste un `Post`: Publicar valida y cierra. Reutiliza `children` de SPEC 02 para los chips (`initial`, `name`, `avatar`).

## Plan de implementación

1. Crear `app/data/postTypes.ts` con el tipo y los 7 tipos. Verificar: `npx tsc --noEmit`.
2. Crear `app/components/CreatePostModal.tsx`: estado abierto/cerrado, trigger con el gradiente actual, overlay y tarjeta 1:1 con PARA (chips desde `children`), TIPO, textarea y fila FOTOS aún sin lógica. Verificar: abre con el botón y cierra con Cancelar, Escape y click en el fondo (no con clicks dentro de la tarjeta).
3. Implementar la selección de PARA: toggle múltiple de niños, "Toda la sala" excluyente en ambos sentidos, chips con estados marcado/sin marcar.
4. Implementar la selección de TIPO: selección única con estilo pastel/sólido.
5. Implementar FOTOS: input file oculto + click en "Agregar" que añade previews; drop sobre la fila que añade previews (filtrar `image/*`, ignorar el resto); reordenado arrastrando tiles; X que quita un tile; `revokeObjectURL` al quitar y al cerrar.
6. Implementar la validación al enviar: PARA, TIPO y descripción requeridos; errores inline; submit válido cierra la modal.
7. Modificar `app/components/Sidebar.tsx`: sustituir el botón "Nueva publicación" por `<CreatePostModal />`.
8. Chequeo final: `npx eslint app`, `npx tsc --noEmit`, `npm run build` y comparación visual de la modal abierta contra `references/pantallas/crear-publicacion.dc.html`.

## Criterios de aceptación

- [ ] El botón "Nueva publicación" del sidebar conserva el gradiente `#F4977E→#EE8164` y abre la modal; el resto del Sidebar no cambia (nav, footer, usuaria).
- [ ] La modal es 1:1 con el mockup: tarjeta 580px `#FBF4EC` con borde `#ECE0D0`, header Cancelar/"Nueva publicación"/Publicar, labels uppercase 12px `#94887B`, chips, textarea y fila FOTOS con los colores del diseño.
- [ ] La modal se cierra con Cancelar, Escape y click en el fondo, y no se cierra al hacer click dentro de la tarjeta.
- [ ] PARA muestra los 8 niños de `children.ts` con su avatar `{bg, color}` + "Toda la sala", todo sin preselección al abrir.
- [ ] Se pueden marcar varios niños a la vez; marcar a un niño desactiva "Toda la sala"; activar "Toda la sala" desmarca a todos los niños.
- [ ] TIPO acepta un solo chip: el seleccionado pasa a fondo sólido con texto blanco y el resto queda en pastel.
- [ ] El textarea abre vacío con el placeholder "Contá cómo le fue hoy…".
- [ ] FOTOS abre con el tile placeholder + tile "Agregar"; click en "Agregar" abre el selector nativo y las imágenes elegidas aparecen como tiles con preview.
- [ ] Soltar 1 o más imágenes sobre la zona FOTOS las añade como tiles sin perder las existentes; los archivos que no son imagen se ignoran.
- [ ] Arrastrar un tile sobre otro los reordena; la X de un tile lo quita; durante `dragover` el tile "Agregar" muestra el realce de borde `#C5503A`.
- [ ] Publicar sin niños (ni "Toda la sala"), sin tipo o con descripción vacía muestra los errores inline y no cierra la modal.
- [ ] Corregir los errores y reenviar cierra la modal sin añadir nada al feed ni persistir nada.
- [ ] `/` no sufre regresiones: encabezado, tarjeta "Compartí un momento…", divisor y los 3 posts del feed (SPEC 01).
- [ ] `npx eslint app`, `npx tsc --noEmit` y `npm run build` pasan sin errores.

## Decisiones

- **Sí:** modal desde el botón del sidebar — decisión del usuario; el mockup enlaza Cancelar/Publicar de vuelta al feed.
- **Sí:** los 8 niños de `children.ts` como chips — decisión del usuario; un único origen de datos y la fila hace wrap.
- **Sí:** sin preselección en PARA y TIPO — decisión del usuario; elección explícita (mismo criterio que SPEC 05).
- **Sí:** "Toda la sala" excluyente en ambos sentidos — decisión del usuario; un post no duplica destinatarios.
- **Sí:** TIPO de selección única, seleccionado = sólido + texto blanco, sin seleccionar = pastel — decisión del usuario; lectura de Comida/Actividad del mockup y coherente con el feed (un post, un tipo).
- **Sí:** matriz de color completada con la regla `solid = soft.color`; pastel de Comida `#F4DC8E` (oro pastel ya presente en la paleta) y de Actividad `#C7E7F1` (badge ACTIVIDAD del feed) — el mockup solo define 2 sólidos y 5 pastels.
- **Sí:** chip "Toda la sala" marcado con el mismo estilo oscuro que los niños (`#3F362E`) — extensión simétrica; el mockup no lo muestra marcado.
- **Sí:** DnD nativo (drag events + input file oculto) con `URL.createObjectURL` — cero dependencias; `revokeObjectURL` al quitar/cerrar evita fugas de memoria.
- **Sí:** el tile placeholder de foto participa del array de fotos (`url: null`) — se quita y reordena como cualquier tile.
- **Sí:** Publicar valida (PARA + TIPO + descripción) y cierra sin persistir — patrón SPEC 04/05; el post real va en la spec de API.
- **Sí:** errores inline: texto bajo la fila en PARA/TIPO (patrón PARENTESCO de SPEC 05), borde + texto en textarea (tokens de SPEC 03).
- **Sí:** realce de borde `#C5503A` en "Agregar" durante `dragover` — affordance mínima para el drop, no definida en el mockup.
- **No:** reordenar chips de PARA o TIPO arrastrando — el DnD de reordenado es solo para fotos.
- **No:** tope de fotos, captions o subida real de archivos.
- **No:** añadir el post al feed (ni en memoria) ni toast/banner de confirmación.
- **No:** librerías de DnD, formularios o diálogos (dnd-kit, react-hook-form, headlessui) — todo manual, cero dependencias.
- **No:** metadata por página — se centraliza en `layout.tsx` (convención).

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `references/` está gitignored y no existe en clones frescos | Colores, textos y medidas de la tarjeta quedan descritos en esta spec |
| El mockup solo define 2 chips sólidos y 5 pastels (faltan 7 estilos) | Matriz completada con la regla `solid = soft.color` y pastels ya presentes en la paleta; documentada en Decisiones |
| El mockup no muestra overlay, estados de error ni "Toda la sala" marcado | Overlay `rgba(63,54,46,.45)`, tokens de error de SPEC 03 y estilo oscuro simétrico |
| HTML5 DnD mezcla drops de archivos y drags internos de tiles | Flujos separados: archivos vía `dataTransfer.files`, tiles internos vía un tipo propio en `dataTransfer` |

## Lo que **no** entra en esta spec

- Persistencia, API y añadido del post al feed.
- Subida real de fotos, tope de cantidad y captions.
- Avisos, resumen del día, mi cuenta.
- Versión móvil/responsive.

Cada una de esas, si llega, va en su propia spec.
