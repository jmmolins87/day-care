# SPEC 02 — Niños `/ninos` y perfil `/ninos/[slug]` (mockups `ninos.dc.html` y `perfil-nino.dc.html`)

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-09-20
> **Objetivo:** Implementar las pantallas de lista de niños y perfil de niño como rutas `/ninos` y `/ninos/[slug]`, visualmente idénticas a los mockups, con datos mock estáticos, sin lógica ni persistencia.

## Por qué

Es la segunda y tercera pantalla de la app. Reutilizan el `Sidebar` y los tokens de SPEC 01, y sientan el modelo de datos de niños que usarán las specs futuras (agregar/editar niño, vincular padre, resumen del día).

## Alcance

**In:**

- `app/ninos/page.tsx` nuevo: encabezado (kicker "GESTIÓN", h1 "Niños", botón "Agregar niño"), buscador visual, divisor "SALA SOLES · 8 niños" y grid de 2 columnas con 8 tarjetas.
- `app/ninos/[slug]/page.tsx` nuevo: perfil completo del mockup con `generateStaticParams` para los 8 slugs; slug desconocido → `notFound()`.
- `app/components/KidCard.tsx` nuevo: tarjeta reutilizable (avatar con inicial y color, nombre, meta, badge pill o chevron) con el hover del mockup.
- `app/components/Sidebar.tsx` modificado: nueva prop `active` para marcar el ítem activo; "Niños" enlaza a `/ninos`.
- `app/page.tsx` modificado: pasa `active="feed"` al `Sidebar` (sin cambios visuales).
- `app/data/children.ts` nuevo: mock tipado con los 8 niños del mockup; Mateo 1:1 con `perfil-nino.dc.html`, el resto con perfiles plausibles generados.

**Out of scope (para specs futuras):**

- Pantallas `agregar-nino`, `vincular-padre`, `resumen-dia`, `avisos`, `mi-cuenta`: sus enlaces quedan `href="#"`.
- Buscador funcional (filtrado): solo visual.
- Interactividad de botones ("Agregar niño", "Editar", "Resumen del día", "Vincular otro padre").
- Base de datos, API o persistencia.
- Responsive/móvil.
- Unificar el conteo "8 vs 12 niños" entre home y `/ninos`.

## Modelo de datos

```ts
// app/data/children.ts
export type GuardianStatus = "active" | "pending";

export type Guardian = {
  initial: string;      // "L"
  name: string;         // "Lucía Fernández"
  relation: string;     // "Mamá · activa"
  status: GuardianStatus;
};

export type ChildBadge = { label: string; bg: string; color: string }; // MANÍ / LACTOSA / VINCULAR

export type Child = {
  slug: string;           // "mateo-fernandez"
  initial: string;        // "M"
  name: string;           // "Mateo Fernández"
  ageLabel: string;       // "3 años"
  parentSummary: string;  // "2 padres vinculados"
  badge?: ChildBadge;
  avatar: { bg: string; color: string };  // "#A9D9E8" / "#1F7A93"
  profile: {
    subtitle: string;     // "3 años · Sala Soles"
    allergies?: { text: string };  // banner condicional
    birthDate: string;    // "12 mar 2022"
    classroom: string;    // "Soles"
    enrollment: string;   // "feb 2025"
    guardians: Guardian[];
  };
};

export const children: Child[] = [ /* 8, en el orden del mockup */ ];

export const guardianStatusLabel: Record<GuardianStatus, string> = {
  active: "ACTIVA",
  pending: "PENDIENTE",
};
```

Valores fijos del mockup (por si `references/` no existe):

- Avatares: M/L `#A9D9E8`·`#1F7A93`, S/E `#F4B8CC`·`#C44A7A`, B/O `#B9DEC4`·`#3E8B62`, V `#F4DC8E`·`#9A7B1E`, T `#C9B6E8`·`#7B5FC0`.
- Badges: MANÍ y LACTOSA `#FBD8CC`/`#D9684A`, VINCULAR `#F9D2DE`/`#C56486`. Sin badge → chevron `#CBB89F`.
- Pills de padres: ACTIVA `#CFEBD8`/`#3E9B6C`, PENDIENTE `#F7E7A6`/`#9A7B1E`.
- Banner alergias: fondo `#FBDAD6`, icono `#F4A8A0`, título `#C5413A`, texto `#B25249`.
- Perfil de Mateo: nacimiento "12 mar 2022", sala "Soles", ingreso "feb 2025", Lucía (ACTIVA) y Diego (PENDIENTE).

## Plan de implementación

1. Crear `app/data/children.ts` con los tipos y el mock de los 8 niños (Mateo 1:1 al mockup; los otros 7 con datos plausibles: fechas, padres según su `parentSummary`, Valentina con `guardians: []`). Verificar: `npx tsc --noEmit`.
2. Modificar `app/components/Sidebar.tsx`: prop requerida `active: "feed" | "ninos" | "avisos" | "cuenta"`; el ítem activo pinta `bg-[#FBE3D8] text-[#D9583C] font-[800]`, el resto queda inactivo; "Niños" pasa de `href="#"` a `/ninos`. Actualizar `app/page.tsx` con `active="feed"`. Verificar: `/` sin cambios visuales.
3. Crear `app/components/KidCard.tsx`: tarjeta del mockup (radius 18, padding 16, borde `#ECE0D0`, sombra `0 4px 14px -12px rgba(120,90,60,.5)`) con hover CSS puro `hover:border-[#F2A78E] hover:-translate-y-[2px] transition`; avatar 48px Fredoka 19; nombre Fredoka 16; meta 13 `#A89A8B`; badge pill o chevron; enlaza a `/ninos/<slug>`.
4. Crear `app/ninos/page.tsx` (Server Component): `Sidebar active="ninos"` + main de 880px con kicker "GESTIÓN", h1 "Niños", botón "Agregar niño" (gradiente `#F4977E→#EE8164`), buscador (lupa `#B0A290`, placeholder "Buscar niño…" en `#B6A99B`, no funcional), divisor "SALA SOLES · 8 niños" con línea `#E7DAC8`, grid `grid-cols-2 gap-[14px]` con `children.map(KidCard)`.
5. Crear `app/ninos/[slug]/page.tsx`: `generateStaticParams()` devuelve los 8 slugs; props tipadas como `PageProps<"/ninos/[slug]">` con `const { slug } = await params` (convención Next 16); lookup en el mock con `notFound()` si no existe. Layout de 820px: link "Volver a Niños" (`#94887B`) → `/ninos`; cabecera (avatar 84px, nombre Fredoka 28, subtítulo, botón "Editar"); banner de alergias solo si `profile.allergies`; tabla de 3 filas (labels `#94887B`, valores `#3F362E`, separador `#F0E6D8`); columna fija de 300px con botón "Resumen del día" (`#3F362E`) y tarjeta "PADRES VINCULADOS" con pills y CTA punteado "Vincular otro padre".
6. Ajuste fino visual contra `ninos.dc.html` y `perfil-nino.dc.html`, y chequeo final: `npx eslint app`, `npx tsc --noEmit` y `npm run build` sin errores.

## Criterios de aceptación

- [ ] `/ninos` y `/ninos/mateo-fernandez` cargan con `npm run dev` sin errores en consola.
- [ ] "Niños" aparece activo (`#FBE3D8`/`#D9583C`) en ambas rutas nuevas, y "Feed" sigue activo en `/` (sin regresión visual en la home).
- [ ] `/ninos` muestra kicker "GESTIÓN", h1 "Niños", botón "Agregar niño", buscador visual y divisor "SALA SOLES · 8 niños".
- [ ] Se renderizan 8 tarjetas en grid de 2 columnas: Mateo con badge MANÍ, Tomás con LACTOSA, Valentina con VINCULAR y las otras 5 con chevron.
- [ ] El hover de cada tarjeta cambia el borde a `#F2A78E` y eleva 2px.
- [ ] Cada tarjeta enlaza a su propio `/ninos/<slug>` y el perfil muestra el nombre del niño clicado (clic en Sofía → perfil de Sofía).
- [ ] `/ninos/mateo-fernandez` es 1:1 con el mockup: banner de alergias, tabla "12 mar 2022 / Soles / feb 2025", botón "Resumen del día", Lucía con pill ACTIVA, Diego con PENDIENTE y CTA "Vincular otro padre".
- [ ] Los niños sin alergias no muestran el banner (p. ej. Sofía), y Valentina muestra solo el CTA de vincular (sin padres).
- [ ] Un slug inválido (p. ej. `/ninos/pepe`) devuelve 404.
- [ ] "Volver a Niños" navega a `/ninos`; "Agregar niño", "Editar", "Resumen del día" y "Vincular otro padre" son `href="#"`.
- [ ] `npx eslint app` y `npx tsc --noEmit` pasan sin errores.
- [ ] Comparación lado a lado con ambos mockups: layout, espaciados, colores y tipografías sin diferencias perceptibles.

## Decisiones

- **Sí:** rutas `/ninos` + `/ninos/[slug]` — decisión del usuario ("son [slug]").
- **Sí:** mock completo para los 8 niños — cada tarjeta abre un perfil coherente; solo Mateo está definido en el mockup y el resto es generado plausible.
- **Sí:** `Sidebar` con prop `active` — el ítem activo depende de la página; cambio mínimo sobre SPEC 01 sin alterar el look de la home.
- **Sí:** conteo fiel a cada mockup (8 en `/ninos`, 12 en home) — inconsistencia documentada; se unifica cuando exista una fuente de datos real.
- **Sí:** hover de tarjetas incluido — es CSS puro del mockup (`.kid:hover`), sin estado ni handlers.
- **Sí:** `generateStaticParams` + `notFound()` — patrón Next 16 para slugs conocidos; `params` es Promise y se espera con `await`.
- **Sí:** CTA "Vincular otro padre" con el mismo texto para todos los niños — uniforme; el copy fino se ajusta en la spec de vinculación.
- **No:** buscador funcional — "solo estilos" según el usuario.
- **No:** datos hardcodeados en el JSX — convención de SPEC 01 (mock tipado en `app/data/`).
- **No:** librería de iconos — SVGs inline copiados del mockup.
- **No:** metadata por página — la home tampoco la tiene; se centraliza en `layout.tsx`.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `references/` está gitignored y no existe en clones frescos | Colores, medidas y textos clave quedan descritos en esta spec |
| Los 7 perfiles no presentes en el mockup son inventados | Marcados como mock en `app/data/children.ts`; se sustituyen por API futura sin tocar componentes |
| Inconsistencia "8 vs 12 niños" entre mockups | Cada pantalla fiel a su mockup; documentada para reconciliar con datos reales |

## Lo que **no** entra en esta spec

- Pantallas de agregar/editar niño, vincular padre, resumen del día, avisos y mi cuenta.
- Buscador funcional e interactividad de botones.
- Base de datos, API o persistencia.
- Versión móvil/responsive.
- Unificación del conteo de niños entre home y `/ninos`.

Cada una de esas, si llega, va en su propia spec.
