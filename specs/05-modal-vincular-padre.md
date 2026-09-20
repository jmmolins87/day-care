# SPEC 05 — Modal "Vincular padre" en `/kids/[id]` (mockup `vincular-padre.dc.html`)

> **Estado:** Aprobado
> **Depende de:** SPEC 02, SPEC 03, SPEC 04
> **Fecha:** 2026-09-20
> **Objetivo:** Implementar la vinculación de padre como modal que se abre con el CTA "Vincular otro padre" de `/kids/[id]`, 1:1 con `vincular-padre.dc.html`, con código de invitación estático "7K4P9" y validación solo en frontend, sin persistencia ni cambios en la lista de tutores.

## Por qué

Retoma el CTA que SPEC 02 dejó como `href="#"` y convierte el mockup `vincular-padre.dc.html` (página suelta) en una modal sobre el perfil del niño, siguiendo el patrón de modal de SPEC 04. Reutiliza el código de invitación de SPEC 03 y cierra el flujo visual iniciado en `/activate`.

## Alcance

**In:**

- `app/components/LinkParentModal.tsx` nuevo (client): CTA "Vincular otro padre" (mismo visual actual: círculo dashed 40px `#D8CBBA`, icono + `#B0A290`, texto `#C5503A`) + overlay (`rgba(63,54,46,.45)`, `role="dialog"`, `aria-modal`) y tarjeta del mockup.
- Tarjeta 1:1 con `vincular-padre.dc.html`: max-width 480px, fondo `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra `0 20px 50px -24px rgba(63,54,46,.35)`. Header con título "Vincular padre" (Fredoka 600, 18px, `#3F362E`), subtítulo dinámico "a {nombre del niño}" (13px, `#A89A8B`) y botón X (34×34, radio 10px, fondo `#F0E6D8`, icono `#94887B`).
- Banner info: fondo `#E3ECFB`, radio 14px, icono círculo-info `#4E72C8`, texto 13.5px `#3F5694`: "Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {nombre del niño}."
- Campos: NOMBRE DEL PADRE/MADRE (input, placeholder "Ej. Diego Fernández"), EMAIL (input email, placeholder "correo@ejemplo.com"), ambos con inputs blancos radio 14px, borde 1.5px `#EADFD0`, padding 13px 16px, fuente 15px, placeholder `#B6A99B`.
- PARENTESCO: 3 pills (Mamá, Papá, Tutor/a) flex 1, radio 999px, padding 11px, peso 800, 14px — **sin preselección**; seleccionada: borde `#9FB8EC`, fondo `#CCD8F4`, texto `#4E72C8`; no seleccionada: borde `#ECE0D0`, fondo `#FFFDF9`, texto `#6E6359`.
- Caja de código: fondo `#FBF1D6`, borde 1.5px dashed `#E6D08A`, radio 16px, label "CÓDIGO DE INVITACIÓN" (`#A88526`), código "7K4P9" (Fredoka 600, 34px, letter-spacing 7px, `#8A7234`) y "Vence en 7 días" (13px, `#A88526`).
- CTA "Enviar invitación": ancho completo, padding 14px, radio 14px, gradiente `180deg #F4977E→#EE8164`, texto blanco 15.5px peso 800, icono enviar, sombra `0 10px 22px -8px rgba(238,129,100,.7)`.
- Validación al enviar, solo frontend: nombre requerido; email requerido y con formato; parentesco requerido. Errores inline bajo el campo (borde `#C5503A` en inputs, texto `#C5413A`; en PARENTESCO solo texto bajo la fila), patrón de SPEC 03/04.
- Cierre de la modal: botón X, tecla Escape y click en el fondo; no se cierra con clicks dentro de la tarjeta.
- `app/kids/[id]/page.tsx` modificado: el `<Link href="#">` "Vincular otro padre" se sustituye por `<LinkParentModal childName={child.name} />`.

**Out of scope (para specs futuras):**

- Persistencia, API o envío real del correo (backend).
- Añadir el tutor PENDIENTE a la lista de tutores del perfil, siquiera en memoria.
- Caducidad real del código ni regeneración.
- Pantallas editar niño, resumen del día, avisos, mi cuenta.
- Responsive/móvil.

## Modelo de datos

No introduce datos nuevos: reutiliza `children` de SPEC 02 (nombre vía prop `childName`) y `invitation.code` de SPEC 03 ("7K4P9", única fuente del código).

```ts
// Estado local del formulario en LinkParentModal.tsx (client)
type Relationship = "mother" | "father" | "guardian"; // labels: Mamá, Papá, Tutor/a

type LinkParentForm = {
  parentName: string;     // "Ej. Diego Fernández"
  email: string;          // "correo@ejemplo.com"
  relationship: "" | Relationship; // inicia vacío: sin preselección
};
```

El formulario no produce ni persiste un objeto `Guardian`: Enviar valida y cierra.

## Plan de implementación

1. Crear `app/components/LinkParentModal.tsx`: estado abierto/cerrado, trigger con el visual actual del CTA, overlay y tarjeta 1:1 con campos, pills y caja de código aún sin lógica. Verificar: abre con el CTA y cierra con X, Escape y click en el fondo (no con clicks dentro de la tarjeta).
2. Implementar la selección de PARENTESCO: pills inician sin selección, clic marca exclusiva con el estilo seleccionado del mockup.
3. Implementar la validación al enviar: nombre requerido; email requerido y con formato; parentesco requerido; errores inline bajo cada campo; submit válido cierra la modal.
4. Modificar `app/kids/[id]/page.tsx`: sustituir el `<Link href="#">` por `<LinkParentModal childName={child.name} />`; la página sigue siendo server component.
5. Chequeo final: `npx eslint app`, `npx tsc --noEmit`, `npm run build` y comparación visual de la modal abierta contra `references/pantallas/vincular-padre.dc.html`.

## Criterios de aceptación

- [ ] El CTA "Vincular otro padre" de `/kids/mateo-fernandez` abre la modal conservando su visual actual (círculo dashed, icono +, texto `#C5503A`).
- [ ] La modal es 1:1 con el mockup: tarjeta 480px `#FBF4EC` con borde `#ECE0D0`, header con título y subtítulo "a Mateo Fernández", banner azul con "…Solo verá el feed de Mateo.", inputs con sus placeholders, 3 pills, caja de código dashed con "7K4P9" y "Vence en 7 días", y CTA gradiente "Enviar invitación".
- [ ] La modal se cierra con X, Escape y click en el fondo, y no se cierra al hacer click dentro de la tarjeta.
- [ ] Las 3 pills de PARENTESCO inician sin selección; al clicar una toma el estilo seleccionado (`#CCD8F4`/`#4E72C8`/borde `#9FB8EC`) y se desmarca la anterior.
- [ ] Enviar con nombre vacío, email vacío o mal formado, o sin parentesco, muestra el error inline bajo el campo y no cierra la modal.
- [ ] Un submit válido cierra la modal sin persistir nada ni añadir el tutor a la lista del perfil.
- [ ] En otro niño (p. ej. Valentina), subtítulo y banner usan su nombre ("a Valentina" / "Solo verá el feed de Valentina.").
- [ ] El perfil no sufre regresiones: banner de alergias, tabla, Lucía ACTIVA y Diego PENDIENTE en el de Mateo (SPEC 02).
- [ ] `npx eslint app`, `npx tsc --noEmit` y `npm run build` pasan sin errores.

## Decisiones

- **Sí:** modal sobre `/kids/[id]` con el CTA existente como trigger — mismo patrón que SPEC 04; el mockup es página suelta pero se integra como modal.
- **Sí:** código de invitación estático "7K4P9" reutilizando `invitation.code` (SPEC 03) — decisión del usuario; coherente con `/activate`.
- **Sí:** "Enviar invitación" solo valida y cierra — decisión del usuario; la vinculación real va en la spec de API.
- **Sí:** CTA uniforme "Vincular otro padre" para todos los niños — decisión del usuario; cero lógica de copy.
- **Sí:** PARENTESCO sin preselección y requerido — decisión del usuario (el mockup muestra "Mamá" activa, pero se exige elección explícita).
- **Sí:** subtítulo y banner dinámicos con el nombre del niño — la modal sirve para los 8 perfiles.
- **Sí:** cierre por X + Escape + click en fondo — convención de SPEC 04.
- **Sí:** errores inline con borde `#C5503A` y texto `#C5413A` — tokens ya fijados por SPEC 03; en PARENTESCO, texto bajo la fila.
- **Sí:** trigger + modal en un único client component con prop `childName` — `app/kids/[id]/page.tsx` sigue siendo server component.
- **No:** generación aleatoria del código — decisión del usuario.
- **No:** añadir el tutor PENDIENTE a la lista en memoria — decisión del usuario; evita convertir guardians en estado de cliente.
- **No:** librerías de formularios o diálogos — todo manual, cero dependencias.
- **No:** metadata por página — se centraliza en `layout.tsx` (convención).

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `references/` está gitignored y no existe en clones frescos | Colores, textos y medidas de la tarjeta quedan descritos en esta spec |
| El mockup muestra "Mamá" preseleccionada | Desviación deliberada y documentada (decisión del usuario): sin preselección |
| El mockup es página suelta, sin overlay ni estados de error | Overlay `rgba(63,54,46,.45)` y errores con tokens de SPEC 03/04 |

## Lo que **no** entra en esta spec

- Persistencia, API y envío real del correo.
- Añadir el tutor a la lista del perfil (ni en memoria).
- Caducidad/regeneración del código de invitación.
- Editar niño, resumen del día, avisos, mi cuenta.
- Versión móvil/responsive.

Cada una de esas, si llega, va en su propia spec.
