# SPEC 02 — Niños `/kids` y perfil `/kids/[id]` (mockups `ninos.dc.html` y `perfil-nino.dc.html`)

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-09-20
> **Objetivo:** Implementar las pantallas de lista de niños y perfil de niño como rutas `/kids` y `/kids/[id]`, visualmente idénticas a los mockups, con datos mock estáticos, sin lógica ni persistencia.

## Por qué

Es la segunda y tercera pantalla de la app. Reutilizan el `Sidebar` y los tokens de SPEC 01, y sientan el modelo de datos de niños que usarán las specs futuras (agregar/editar niño, vincular padre, resumen del día).

## Alcance

**In:**

- `app/kids/page.tsx` nuevo: encabezado (kicker "GESTIÓN", h1 "Niños", botón "Agregar niño"), buscador visual, divisor "SALA SOLES · 8 niños" y grid de 2 columnas con 8 tarjetas.
- `app/kids/[id]/page.tsx` nuevo: perfil completo del mockup con `generateStaticParams` para los 8 slugs; slug desconocido → `notFound()`.
- `app/components/KidCard.tsx` nuevo: tarjeta reutilizable (avatar con inicial y color, nombre, meta, badge pill o chevron) con el hover del mockup.
- `app/components/KidsList.tsx` nuevo: client component con búsqueda por nombre en frontend.
- `app/components/Sidebar.tsx` modificado: nueva prop `active` para marcar el ítem activo; "Niños" enlaza a `/kids`.
- `app/page.tsx` modificado: pasa `active="feed"` al `Sidebar` (sin cambios visuales).
- `app/data/children.ts` nuevo: mock tipado con los 8 niños del mockup; Mateo 1:1 con `perfil-nino.dc.html`, el resto con perfiles plausibles generados.
- `app/data/allergies.ts` nuevo: enum `AllergyKey` con 8 tipos de alergías y sus colores.

**Out of scope (para specs futuras):**

- Pantallas `agregar-nino`, `vincular-padre`, `resumen-dia`, `avisos`, `mi-cuenta`: sus enlaces quedan `href="#"`.
- Interactividad de botones ("Agregar niño", "Editar", "Resumen del día", "Vincular otro padre").
- Base de datos, API o persistencia.
- Responsive/móvil.
- Unificar el conteo "8 vs 12 niños" entre home y `/kids`.

## Modelo de datos

```ts
// app/data/allergies.ts
export type AllergyKey =
  | "mani" | "lactosa" | "gluten" | "frutos_secos"
  | "huevos" | "mariscos" | "soja" | "otro";

export type AllergyDef = { label: string; bg: string; color: string };
export const allergies: Record<AllergyKey, AllergyDef> = { ... };

// app/data/children.ts
export type Child = {
  slug: string;
  initial: string;
  name: string;
  ageLabel: string;
  parentSummary: string;
  allergies: AllergyKey[];
  avatar: { bg: string; color: string };
  profile: {
    subtitle: string;
    allergyNotes?: string;
    birthDate: string;
    classroom: string;
    enrollment: string;
    guardians: Guardian[];
  };
};

export function getChildBadge(child: Child): ChildBadge | undefined;
export const children: Child[] = [ /* 8 niños */ ];
```

Valores fijos del mockup (por si `references/` no existe):

- Avatares: M/L `#A9D9E8`·`#1F7A93`, S/E `#F4B8CC`·`#C44A7A`, B/O `#B9DEC4`·`#3E8B62`, V `#F4DC8E`·`#9A7B1E`, T `#C9B6E8`·`#7B5FC0`.
- Badges: MANÍ y LACTOSA `#FBD8CC`/`#D9684A`, VINCULAR `#F9D2DE`/`#C56486`. Sin badge → chevron `#CBB89F`.
- Pills de padres: ACTIVA `#CFEBD8`/`#3E9B6C`, PENDIENTE `#F7E7A6`/`#9A7B1E`.
- Banner alergias: fondo `#FBDAD6`, icono `#F4A8A0`, título `#C5413A`, texto `#B25249`.
- Perfil de Mateo: nacimiento "12 mar 2022", sala "Soles", ingreso "feb 2025", Lucía (ACTIVA) y Diego (PENDIENTE).

## Plan de implementación

1. ✅ Crear `app/data/allergies.ts` con enum `AllergyKey` y colores por tipo.
2. ✅ Crear `app/data/children.ts` con los tipos y el mock de los 8 niños (Mateo 1:1 al mockup; los otros 7 con datos plausibles). `getChildBadge()` deriva badge de alergías o estado VINCULAR.
3. ✅ Modificar `app/components/Sidebar.tsx`: prop requerida `active`; "Niños" enlaza a `/kids`. Actualizar `app/page.tsx` con `active="feed"`.
4. ✅ Crear `app/components/KidCard.tsx` con hover CSS puro.
5. ✅ Crear `app/components/KidsList.tsx`: client component con búsqueda por nombre en frontend.
6. ✅ Crear `app/kids/page.tsx` con `KidsList`.
7. ✅ Crear `app/kids/[id]/page.tsx` con `generateStaticParams` y perfil completo.
8. ✅ Chequeo final: `npx eslint app`, `npx tsc --noEmit` y `npm run build` sin errores.

## Criterios de aceptación

- [x] `/kids` y `/kids/mateo-fernandez` cargan con `npm run dev` sin errores en consola.
- [x] "Niños" aparece activo (`#FBE3D8`/`#D9583C`) en ambas rutas nuevas, y "Feed" sigue activo en `/` (sin regresión visual en la home).
- [x] `/kids` muestra kicker "GESTIÓN", h1 "Niños", botón "Agregar niño", buscador funcional y divisor "SALA SOLES · 8 niños".
- [x] Se renderizan 8 tarjetas en grid de 2 columnas: Mateo con badge MANÍ, Tomás con LACTOSA, Valentina con VINCULAR y las otras 5 con chevron.
- [x] El hover de cada tarjeta cambia el borde a `#F2A78E` y eleva 2px.
- [x] Cada tarjeta enlaza a su propio `/kids/<slug>` y el perfil muestra el nombre del niño clicado.
- [x] `/kids/mateo-fernandez` es 1:1 con el mockup: banner de alergias, tabla "12 mar 2022 / Soles / feb 2025", botón "Resumen del día", Lucía con pill ACTIVA, Diego con PENDIENTE y CTA "Vincular otro padre".
- [x] Los niños sin alergias no muestran el banner, y Valentina muestra solo el CTA de vincular (sin padres).
- [x] Un slug inválido (p. ej. `/kids/pepe`) devuelve 404.
- [x] "Volver a Niños" navega a `/kids`; "Agregar niño", "Editar", "Resumen del día" y "Vincular otro padre" son `href="#"`.
- [x] `npx eslint app` y `npx tsc --noEmit` pasan sin errores.
- [x] `npm run build` genera las 8 rutas estáticamente.

## Decisiones

- **Sí:** rutas `/kids` + `/kids/[id]` — el usuario prefirió nombres de carpeta en inglés.
- **Sí:** mock completo para los 8 niños — cada tarjeta abre un perfil coherente; solo Mateo está definido en el mockup y el resto es generado plausible.
- **Sí:** `Sidebar` con prop `active` — el ítem activo depende de la página; cambio mínimo sobre SPEC 01 sin alterar el look de la home.
- **Sí:** conteo fiel a cada mockup (8 en `/kids`, 12 en home) — inconsistencia documentada; se unifica cuando exista una fuente de datos real.
- **Sí:** hover de tarjetas incluido — es CSS puro del mockup (`.kid:hover`), sin estado ni handlers.
- **Sí:** `generateStaticParams` + `notFound()` — patrón Next 16 para slugs conocidos; `params` es Promise y se espera con `await`.
- **Sí:** CTA "Vincular otro padre" con el mismo texto para todos los niños — uniforme; el copy fino se ajusta en la spec de vinculación.
- **Sí:** enum `AllergyKey` con colores por tipo — reutilizable para futuras specs (agregar niño, editar niño).
- **Sí:** búsqueda frontend en `KidsList` (client component) — sin conexión con backend.
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
- Interactividad de botones.
- Base de datos, API o persistencia.
- Versión móvil/responsive.
- Unificación del conteo de niños entre home y `/kids`.

Cada una de esas, si llega, va en su propia spec.
