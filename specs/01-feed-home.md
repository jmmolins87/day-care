# SPEC 01 — Home `/` con feed estático (plantilla `feed.dc.html`)

> **Estado:** Implementado
> **Depende de:** ninguna
> **Fecha:** 2026-09-20
> **Objetivo:** Implementar la pantalla de `references/pantallas/feed.dc.html` como home `/`, visualmente idéntica al mockup, con datos mock estáticos, sin autenticación ni base de datos.

## Por qué

Es la primera pantalla de la app y sienta dos bases para las specs siguientes: los tokens de diseño (paleta crema/coral, Fredoka + Nunito) en `globals.css`, y el componente `Sidebar`, que se repite en Niños, Avisos y Mi cuenta.

## Alcance

**In:**

- `app/page.tsx` reescrito como home `/`: sidebar + encabezado ("Buenas, Caro") + tarjeta "Comparte un momento…" + divisor "PUBLICADO HOY" + lista de 3 publicaciones.
- `app/components/Sidebar.tsx` nuevo: marca OpenDayCare, botón "Nueva publicación", nav (Feed activo, Niños, Avisos, Mi cuenta), footer de usuaria "Caro Giménez" con botón de salir.
- `app/components/PostCard.tsx` nuevo: tarjeta de publicación con soporte para los 3 tipos del mockup (`achievement`, `activity`, `announcement` — mostrados en UI como LOGRO, ACTIVIDAD, ANUNCIO) y foto placeholder opcional.
- `app/data/posts.ts` nuevo: mock tipado con usuaria, sala y las 3 publicaciones.
- `app/globals.css` modificado: tokens de la paleta del mockup en `@theme inline`, estilos base (fondo `#F6ECDF`, scrollbar) y eliminación del bloque dark-mode de la plantilla.
- `app/layout.tsx` modificado: Fredoka y Nunito con `next/font/google`, `lang="es"`, metadata de OpenDayCare.

**Out of scope (para specs futuras):**

- Autenticación y logout (`login.dc.html`).
- Base de datos, API o persistencia: los datos viven solo en `app/data/posts.ts`.
- Rutas reales de Niños, Avisos, Mi cuenta, crear/detalle publicación y foto: los enlaces quedan como placeholders.
- Interactividad: corazones, comentarios y "Editar" son solo visuales.
- Adaptación responsive/móvil.
- Fotos reales: el área de foto es el placeholder punteado del mockup.

## Modelo de datos

```ts
// app/data/posts.ts
export type PostTipo = "achievement" | "activity" | "announcement";

export type Post = {
  id: string;
  type: PostTipo;
  author: string;
  avatarInitial?: string;
  postedTime: string;
  postedBy: string;
  recipients: string;
  content: string;
  photo?: { caption: string };
  likes: number;
  comments: number;
};

export type PostCardProps = { post: Post };

export const currentUser = { initial: "C", name: "Caro Giménez", role: "Maestra · Soles" };
export const classroom = { name: "Sala Soles", childCount: 12, date: "martes 17 jun" };
export const posts: Post[] = [ /* the 3 posts from the mockup, in order: achievement 14:20, activity 09:40, announcement 07:50 */ ];

// Internal code (English) → display label (Spanish)
export const typeLabel: Record<PostTipo, string> = {
  achievement: "LOGRO",
  activity: "ACTIVIDAD",
  announcement: "ANUNCIO",
};
```

## Plan de implementación

1. Crear `app/data/posts.ts` con los tipos y el mock (usuaria, sala, 3 publicaciones). Verificar: `npx tsc --noEmit`.
2. Reescribir `app/globals.css`: tokens `@theme inline` con la paleta (fondo `#F6ECDF`, panel `#FFFDF9`, borde `#ECE0D0`, coral `#F4977E`/`#EE8164`, acentos `#D9583C`/`#E0654A`, textos `#3F362E`/`#A89A8B`), body con Nunito, scrollbar del mockup; eliminar el bloque `prefers-color-scheme: dark`.
3. Actualizar `app/layout.tsx`: Fredoka (400–700) y Nunito (400–800) vía `next/font/google` como variables CSS, `lang="es"`, metadata `title: "OpenDayCare"`.
4. Crear `app/components/Sidebar.tsx` (248px, sticky, `#FFFDF9`): logo con gradiente `155deg #F8C3A8→#F2937A`, botón "Nueva publicación" con gradiente `180deg #F4977E→#EE8164`, nav con Feed activo (`#FBE3D8`/`#D9583C`), footer de usuaria y botón salir. Feed enlaza a `/`; el resto usa `href="#"`.
5. Crear `app/components/PostCard.tsx`: header (avatar 44px, nombre en Fredoka, hora, badge pill según tipo: achievement `#CFEBD8`/`#3E9B6C` → pinta "LOGRO", activity `#C7E7F1`/`#2E89A6` → pinta "ACTIVIDAD", announcement `#CCD8F4`/`#4E72C8` → pinta "ANUNCIO"), "Para: …", texto, foto placeholder punteada opcional (200px, `#F4ECE1`, borde `1.5px dashed #DBCDBA`), footer con corazones, comentarios y "Editar". SVGs inline copiados del mockup.
6. Reescribir `app/page.tsx` (Server Component): Sidebar + main de 760px con kicker "GUARDERÍA · SALA SOLES", h1 "Buenas, Caro", "12 niños · martes 17 jun", tarjeta "Comparte un momento…", divisor "PUBLICADO HOY" y `posts.map(PostCard)`. Verificar: `npm run dev` → http://localhost:3000.
7. Ajuste fino visual contra `references/pantallas/feed.dc.html` (sombras rgba, letter-spacing, radios) y chequeo final: `npx eslint app` y `npx tsc --noEmit` sin errores.

## Criterios de aceptación

- [x] `/` carga con `npm run dev` sin errores en la consola del navegador. (✅ verificado: HTTP 200, 0 errores en consola del navegador, title "OpenDayCare")
- [x] Fondo general `#F6ECDF`; sidebar `#FFFDF9` de 248px con borde derecho `#ECE0D0`, fijo al hacer scroll. (✅ verificado: `var(--color-bg)` = `#F6ECDF` en globals.css; sidebar `w-[248px] bg-[#FFFDF9] border-r border-[#ECE0D0] sticky top-0 h-screen` en Sidebar.tsx)
- [x] Títulos en Fredoka y cuerpo en Nunito, cargadas con `next/font` (sin `<link>` a Google Fonts). (✅ verificado: `next/font/google` con Fredoka y Nunito en layout.tsx; `font-['Fredoka']` en títulos; 0 `<link>` a fonts.googleapis.com; docs Next.js confirman self-hosting automático)
- [x] El ítem "Feed" del nav aparece activo (`#FBE3D8`/`#D9583C`); Niños, Avisos y Mi cuenta en estilo inactivo. (✅ verificado: Feed `bg-[#FBE3D8] text-[#D9583C] font-[800]`; resto `bg-transparent text-[#6E6359] font-[600]`)
- [x] Se renderizan los 3 posts con badges LOGRO, ACTIVIDAD y ANUNCIO, y contadores 3/1, 5/2 y 8/0 corazones/comentarios. (✅ verificado: snapshot confirma 3 posts con textos LOGRO/ACTIVIDAD/ANUNCIO y contadores correctos)
- [x] El post de actividad muestra el placeholder punteado con "Foto · pintando con témperas". (✅ verificado: snapshot confirma link con texto "Foto · pintando con témperas" en post 2)
- [x] Ningún enlace navega fuera de `/` (Feed → `/`, resto → `#`). (✅ verificado: snapshot `/url: /` solo en Feed; resto `/url: "#"`)
- [x] `npx eslint app` y `npx tsc --noEmit` pasan sin errores. (✅ verificado: 0 errores eslint, 0 errores tsc)
- [x] Comparación lado a lado con el mockup: layout, espaciados, colores y tipografías sin diferencias perceptibles. (✅ verificado: screenshot vs feed.png — layout idéntico, colores coinciden, tipografías y badges correctos)

## Decisiones

- **Sí:** mock tipado en `app/data/posts.ts` — se sustituye por una API futura sin tocar componentes.
- **No:** textos hardcodeados en el JSX — mezcla datos y vista.
- **Sí:** `Sidebar` y `PostCard` como componentes — se reutilizan en specs futuras.
- **No:** header y tarjeta "Comparte un momento…" como componentes — específicos del home.
- **Sí:** Tailwind v4 con tokens `@theme` + valores arbitrarios — convención del repo.
- **No:** CSS inline literal del mockup — no escala al resto de pantallas.
- **Sí:** SVGs inline copiados del mockup — cero dependencias nuevas.
- **No:** librería de iconos (lucide-react) — no está en el proyecto y alteraría el look.
- **Sí:** eliminar el bloque dark-mode de la plantilla — el mockup es solo claro y el look debe ser idéntico.
- **Sí:** enlaces `href="#"` para pantallas inexistentes — cada ruta real irá en su propia spec.
- **No:** páginas stub "en construcción" — amplían el alcance sin valor visual.
- **Sí:** todo estático, sin estado ni handlers.
- **Sí:** solo desktop, sin media queries.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `references/` está gitignored y no existe en clones frescos | Los valores clave (colores, medidas, textos) quedan descritos en esta spec |
| Sombras y letter-spacing sutiles no cubiertos por clases estándar | Valores arbitrarios (`shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]`, `tracking-[.8px]`) y verificación lado a lado |

## Lo que **no** entra en esta spec

- Autenticación (login/logout) y base de datos/API.
- Rutas reales de Niños, Avisos, Mi cuenta, crear/detalle publicación, foto.
- Interactividad (corazones, comentarios, editar, publicar).
- Versión móvil/responsive.
- Fotos reales en las publicaciones.

Cada una de esas, si llega, va en su propia spec.
