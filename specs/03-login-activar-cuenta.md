# SPEC 03 — Login `/login` y activación de cuenta `/activate` (mockups `login.dc.html` y `activar-cuenta.dc.html`)

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-09-20
> **Objetivo:** Implementar las pantallas de login y activación de cuenta como rutas `/login` y `/activate`, visualmente idénticas a los mockups pero sin el selector Personal/Familia, con validación básica de formularios y navegación al feed, sin autenticación real.

## Por qué

Retoma lo que SPEC 01 dejó fuera de alcance (login/logout visual) e introduce los primeros formularios interactivos de la app: client components con validación, patrón que reusarán crear publicación y vincular padre. `activar-cuenta` es el punto de entrada de familias y su enlace ya figura en el login del mockup.

## Alcance

**In:**

- `app/login/page.tsx` nuevo (server): layout de dos paneles — izquierdo con gradiente `155deg #F6A98E→#EC7E62`, círculos decorativos, logo OpenDayCare, titular "El día de cada niño, compartido con su familia." y footer "🌿 Guardería Sala Soles"; derecho con el formulario sobre fondo `#FBF4EC`.
- `app/components/LoginForm.tsx` nuevo (client): EMAIL, CONTRASEÑA, "¿Olvidaste tu contraseña?" (`href="#"`), CTA "Iniciar sesión" → `/` tras validación, enlace "Activá tu cuenta" → `/activate`. Sin selector "INGRESO COMO".
- `app/activate/page.tsx` nuevo (server): tarjeta centrada (max 440px) con logo, "Bienvenida a OpenDayCare", tarjeta de invitación "Mateo · Sala Soles" y `ActivateForm`.
- `app/components/ActivateForm.tsx` nuevo (client): CÓDIGO DE INVITACIÓN, EMAIL, CREAR CONTRASEÑA, checkbox de autorización de fotos, CTA "Activar mi cuenta" → `/` tras validación, enlace "Iniciar sesión" → `/login`.
- `app/data/invitation.ts` nuevo: mock tipado de la invitación.
- `app/components/Sidebar.tsx` modificado: botón "Cerrar sesión" enlaza a `/login`.

**Out of scope (para specs futuras):**

- Autenticación real, credenciales, sesiones y persistencia.
- Pantalla familia-feed (el mockup existe; irá en su propia spec) y recuperación de contraseña.
- Validación del código de invitación contra datos (solo campo requerido).
- Rutas de Avisos, Mi cuenta, crear publicación (siguen `href="#"`).
- Responsive/móvil.

## Modelo de datos

```ts
// app/data/invitation.ts
export type Invitation = {
  childName: string;   // "Mateo"
  classroom: string;   // "Sala Soles"
  initial: string;     // "M"
  avatar: { bg: string; color: string }; // "#A9D9E8" · "#1F7A93"
  code: string;        // "7K4P9"
  email: string;       // "lucia.fernandez@gmail.com"
};
export const invitation: Invitation = { /* valores del mockup */ };
```

El login no introduce datos nuevos: el email demo (`caro@opendaycare.com`) vive como valor inicial del estado de `LoginForm`.

## Plan de implementación

1. Crear `app/data/invitation.ts` con el mock tipado. Verificar: `npx tsc --noEmit`.
2. Crear `app/components/LoginForm.tsx`: estado controlado (email inicia con el valor demo del mockup, contraseña vacía), validación al enviar (email requerido + formato, contraseña requerida), errores inline bajo el campo, submit válido → `router.push("/")`.
3. Crear `app/login/page.tsx`: grid `1.05fr 1fr` con el panel de branding del mockup y `LoginForm`.
4. Crear `app/components/ActivateForm.tsx`: valores iniciales del mockup (código "7K4P9", email de Lucía, contraseña "contraseña", checkbox marcado), validación (todos requeridos, formato email, checkbox obligatorio), submit válido → `router.push("/")`.
5. Crear `app/activate/page.tsx`: tarjeta centrada con datos de `invitation` y `ActivateForm`.
6. Modificar `app/components/Sidebar.tsx`: `href="/login"` en "Cerrar sesión".
7. Chequeo final: `npx eslint app`, `npx tsc --noEmit`, `npm run build` y comparación visual lado a lado con ambos mockups.

## Criterios de aceptación

- [x] `/login` y `/activate` cargan con `npm run dev` sin errores en consola. (✅ verificado: 0 errores de consola en ambas rutas, title "OpenDayCare")
- [x] `/login` no renderiza el selector "INGRESO COMO" ni los botones Personal/Familia. (✅ verificado: grep sin matches en `app/login` y `app/components`; snapshot de Playwright sin esos nodos)
- [x] `/login` es 1:1 con el mockup: panel izquierdo con gradiente y copy, campos EMAIL/CONTRASEÑA, "¿Olvidaste tu contraseña?" y CTA "Iniciar sesión". (✅ verificado: screenshot vs `login.dc.html` — layout, gradiente, copy y campos idénticos salvo el selector eliminado por decisión; corregido color de enlaces a `#C5503A`)
- [x] Un submit inválido (email vacío o mal formado, contraseña vacía, checkbox desmarcado) muestra error inline y no navega. (✅ verificado: login con "no-es-un-email" + password vacía muestra "Ingresá un email válido." y "La contraseña es requerida." sin navegar; activate con "email-roto" muestra error inline y con consent desmarcado muestra "Debés autorizar para continuar.", sin navegar)
- [x] Un submit válido en ambos formularios navega a `/`. (✅ verificado: click en "Iniciar sesión" y en "Activar mi cuenta" con datos válidos lleva a `http://localhost:3000/`)
- [x] "Activá tu cuenta" en `/login` enlaza a `/activate`, y "Iniciar sesión" en `/activate` enlaza a `/login`. (✅ verificado: snapshot muestra `/url: /activate` y `/url: /login` respectivamente)
- [x] `/activate` es 1:1 con el mockup: tarjeta "Te invitaron a seguir a / Mateo · Sala Soles", código "7K4P9", email de Lucía y checkbox de autorización. (✅ verificado: screenshot vs `activar-cuenta.dc.html` — logo, tarjeta de invitación, campos precargados, consent marcado en verde y CTA idénticos)
- [x] El botón "Cerrar sesión" del Sidebar navega a `/login`. (✅ verificado: snapshot muestra `/url: /login`; click navega a `http://localhost:3000/login`)
- [x] `npx eslint app`, `npx tsc --noEmit` y `npm run build` pasan sin errores. (✅ verificado: eslint y tsc con salida vacía; build genera `/login` y `/activate` como rutas estáticas)

## Decisiones

- **Sí:** rutas `/login` + `/activate` — inglés, consistente con `/kids` (SPEC 02).
- **Sí:** eliminar el selector Personal/Familia — decisión del usuario; login unificado.
- **Sí:** validación básica sin auth real — no hay backend; las credenciales demo van en una spec futura de autenticación.
- **Sí:** ambos CTA navegan a `/` — familia-feed tendrá su propia spec.
- **Sí:** "¿Olvidaste tu contraseña?" como visual `href="#"` — no existe pantalla de recovery.
- **Sí:** "Cerrar sesión" → `/login` — cierra el ciclo de navegación app → login.
- **Sí:** mock tipado `app/data/invitation.ts` — convención de SPEC 01/02.
- **Sí:** páginas server + formularios client — patrón `KidsList` de SPEC 02.
- **Sí:** valores iniciales de inputs iguales al mockup (email demo, código, contraseña "contraseña", checkbox marcado) — fidelidad 1:1.
- **Sí:** fondo `#FBF4EC` y bordes `#EADFD0` propios de estos mockups — cada pantalla fiel a su mockup, como el conteo en SPEC 02.
- **Sí:** errores inline con borde `#C5503A` y texto `#C5413A` — tokens ya presentes en los mockups.
- **No:** reglas de fortaleza de contraseña — no especificadas; solo campo requerido.
- **No:** validación del código de invitación contra datos — sin backend.
- **No:** metadata por página — se centraliza en `layout.tsx` (convención).
- **No:** librerías de iconos ni de formularios — SVGs inline y validación manual simple; cero dependencias nuevas.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `references/` está gitignored y no existe en clones frescos | Colores, textos y valores clave quedan descritos en esta spec |
| Los mockups no definen estados de error | Estilo de error fijado aquí con tokens existentes (`#C5503A`/`#C5413A`) |

## Lo que **no** entra en esta spec

- Autenticación real, sesiones y recuperación de contraseña.
- Pantalla familia-feed y el resto de rutas pendientes.
- Validación del código de invitación contra backend.
- Versión móvil/responsive.

Cada una de esas, si llega, va en su propia spec.
