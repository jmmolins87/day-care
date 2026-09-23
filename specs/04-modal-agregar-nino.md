# SPEC 04 — Modal "Agregar niño" en `/kids` (mockup `agregar-nino.dc.html`)

> **Estado:** Implementado
> **Depende de:** SPEC 02
> **Fecha:** 2026-09-20
> **Objetivo:** Implementar el alta de niño como modal que se abre con el botón "Agregar niño" de `/kids` (icono coral y texto blanco), con mock de salas, máscara `dd/mm/aaaa` para la fecha de nacimiento y validación solo en frontend, sin persistencia.

## Por qué

Retoma el botón que SPEC 02 dejó como `href="#"` y convierte el mockup `agregar-nino.dc.html` (una página suelta) en una modal sobre `/kids`. Introduce además el mock de salas, que reutilizarán las specs de editar niño y resumen del día, y el primer campo con máscara de la app.

## Alcance

**In:**

- `app/data/classrooms.ts` nuevo: mock tipado con 4 salas — Soles, Lunas, Estrellas y Nubes — y `defaultClassroomId = "soles"`.
- `app/components/AddKidModal.tsx` nuevo (client): botón "Agregar niño" (mismo gradiente `#F4977E→#EE8164`, icono con stroke `#C5503A` y texto blanco) + overlay y tarjeta del mockup.
- Tarjeta 1:1 con `agregar-nino.dc.html`: max-width 520px, fondo `#FBF4EC`, borde `#ECE0D0`, radio 24px, header con Cancelar (`#94887B`, peso 700) / título "Agregar niño" (Fredoka 600, 18px, `#3F362E`) / Guardar (`#D9583C`, peso 800).
- Campos: NOMBRE COMPLETO (input, requerido), FECHA DE NACIMIENTO (input con máscara, requerido), SALA (select nativo estilado, requerido, "Soles" preseleccionada), ALERGIAS (ETIQUETAS) (input, opcional) y NOTAS MÉDICAS (textarea, opcional).
- Máscara de fecha: al teclear solo admite dígitos, inserta `/` automáticamente tras el día y el mes y limita a 10 caracteres (`20102022` → `20/10/2022`).
- Validación al enviar, solo frontend: nombre requerido; fecha con calendario real válida y no posterior a hoy; sala requerida. Errores inline bajo el campo (borde `#C5503A`, texto `#C5413A`), patrón de SPEC 03.
- Cierre de la modal: botón Cancelar, tecla Escape y click en el fondo; Guardar con datos válidos cierra la modal.
- `app/kids/page.tsx` modificado: el `<Link href="#">` "Agregar niño" se sustituye por el trigger de `AddKidModal`.

**Out of scope (para specs futuras):**

- Persistencia, API o creación real del niño (backend).
- Añadir el niño creado a la lista de `/kids`, siquiera en memoria.
- Pantallas editar niño, vincular padre, resumen del día, avisos, mi cuenta.
- Validación de rango de edad (0–6 años) y validación en servidor.
- Responsive/móvil.

## Modelo de datos

```ts
// app/data/classrooms.ts
export type Classroom = { id: string; name: string };

export const classrooms: Classroom[] = [
  { id: "soles", name: "Soles" },
  { id: "lunas", name: "Lunas" },
  { id: "estrellas", name: "Estrellas" },
  { id: "nubes", name: "Nubes" },
];

export const defaultClassroomId = "soles";
```

```ts
// Estado local del formulario en AddKidModal.tsx (client)
type AddKidForm = {
  name: string;        // "Ej. Martina López"
  birthDate: string;   // mascarado "dd/mm/aaaa"
  classroomId: string; // defaultClassroomId al abrir
  allergies: string;   // texto libre, "Ej. Cacahuete, Lactosa"
  medicalNotes: string;
};
```

El formulario no produce ni persiste un objeto `Child`: Guardar valida y cierra. El mapeo a `Child` llegará con la spec de backend.

## Plan de implementación

1. Crear `app/data/classrooms.ts` con el tipo y el mock de las 4 salas. Verificar: `npx tsc --noEmit`.
2. Crear `app/components/AddKidModal.tsx`: estado abierto/cerrado, trigger con los nuevos colores, overlay (`rgba(63,54,46,.45)`, `role="dialog"`, `aria-modal`) y tarjeta con los 5 campos aún sin lógica. Verificar: abre con el botón y cierra con Cancelar, Escape y click en el fondo (no con clicks dentro de la tarjeta).
3. Implementar la máscara de fecha en el `onChange`: filtrar no-dígitos, máximo 8 dígitos e insertar `/` tras las posiciones 2 y 4.
4. Implementar la validación al enviar: nombre requerido; fecha requerida, calendario real (día/mes/año posibles, año de 4 dígitos) y no futura; sala requerida; errores inline bajo cada campo; submit válido cierra la modal.
5. Modificar `app/kids/page.tsx`: sustituir el `<Link href="#">` por `<AddKidModal />`; la página sigue siendo server component.
6. Chequeo final: `npx eslint app`, `npx tsc --noEmit`, `npm run build` y comparación visual de la modal abierta contra `references/pantallas/agregar-nino.dc.html`.

## Criterios de aceptación

- [x] El botón "Agregar niño" de `/kids` abre la modal y muestra icono con stroke `#C5503A` y texto blanco sobre el gradiente `#F4977E→#EE8164`.
- [x] La modal es 1:1 con el mockup: tarjeta `#FBF4EC` de 520px con borde `#ECE0D0`, header Cancelar/título/Guardar, labels uppercase 12px `#94887B`, inputs blancos radio 14px con borde `#EADFD0` y placeholders "Ej. Martina López", "dd/mm/aaaa", "Ej. Cacahuete, Lactosa", "Indicaciones, medicación, contactos…".
- [x] La modal se cierra con Cancelar, Escape y click en el fondo, y no se cierra al hacer click dentro de la tarjeta.
- [x] El select SALA lista las 4 salas del mock con chevron como el del mockup y "Soles" preseleccionada al abrir.
- [x] Escribir `20102022` en la fecha produce `20/10/2022`; no acepta letras ni más de 10 caracteres.
- [x] Guardar con nombre vacío, o fecha vacía/inválida (`32/13/2026`, `01/01/2030`), muestra el error inline bajo el campo y no cierra la modal.
- [x] Alergias y notas médicas vacías no bloquean el guardado.
- [x] Corregir los campos con error y reenviar pasa la validación y cierra la modal (sin persistencia ni cambios en la lista).
- [x] `/kids` sigue mostrando las 8 tarjetas, el buscador y el divisor "SALA SOLES · 8 niños" sin regresiones (SPEC 02).
- [x] `npx eslint app`, `npx tsc --noEmit` y `npm run build` pasan sin errores.

## Decisiones

- **Sí:** icono `#C5503A` + texto blanco en el botón — decisión del usuario; el icono resalta sobre el gradiente sin romper el estilo.
- **Sí:** modal con overlay sobre `/kids` en vez de ruta propia `/agregar-nino` — decisión del usuario; el mockup es una página suelta pero se integra como modal.
- **Sí:** Guardar solo cierra la modal — sin backend; la creación real va en la spec de API.
- **Sí:** obligatorios = nombre, fecha y sala; alergias y notas médicas opcionales — aclarado con el usuario (las alergias son input, no textarea).
- **Sí:** mock de 4 salas (Soles, Lunas, Estrellas, Nubes) con "Soles" preseleccionada — decisión del usuario; coincide con la mockup y los niños existentes.
- **Sí:** select nativo estilado (`appearance-none` + chevron SVG del mockup) — accesible y sin librerías.
- **Sí:** máscara manual (filtrar dígitos + insertar `/`) — cero dependencias nuevas, convención de SPEC 03.
- **Sí:** fecha válida de calendario y no futura; sin rango de edad — decisión del usuario; el rango 0–6 podrá añadirse con el backend.
- **Sí:** cierre por Cancelar + Escape + click en fondo — decisión del usuario.
- **Sí:** errores inline con borde `#C5503A` y texto `#C5413A` — tokens ya fijados por SPEC 03.
- **Sí:** trigger + modal en un único client component (`AddKidModal`) — `app/kids/page.tsx` sigue siendo server component.
- **No:** librerías de formularios, máscara o diálogos (react-hook-form, imask, headlessui) — todo manual, cero dependencias.
- **No:** añadir el niño a la lista en memoria — decidido con el usuario; evita convertir `children` a estado de cliente.
- **No:** toast/banner de confirmación tras guardar.
- **No:** metadata por página — se centraliza en `layout.tsx` (convención).

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `references/` está gitignored y no existe en clones frescos | Colores, textos y medidas de la tarjeta quedan descritos en esta spec |
| El mockup no define overlay ni estados de error | Overlay `rgba(63,54,46,.45)` y errores con tokens de SPEC 03 (`#C5503A`/`#C5413A`) |
| El menú desplegado de un select nativo varía entre navegadores | Aceptado; el control cerrado es 1:1 con el mockup |

## Lo que **no** entra en esta spec

- Persistencia, API y creación real del niño.
- Añadir el niño a la lista de `/kids` (ni en memoria).
- Editar niño, vincular padre y demás pantallas pendientes.
- Validación de rango de edad y validación en servidor.
- Versión móvil/responsive.

Cada una de esas, si llega, va en su propia spec.
