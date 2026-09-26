# SPEC 07 — Tabla `daycares` en Supabase con patrón de migraciones CLI

> **Estado:** Implementado
> **Depende de:** Ninguna
> **Fecha:** 2026-09-26
> **Objetivo:** Crear la tabla `daycares` (sección 1 de `07-DB-Schema/opendaycare-database-schema.md`) en el proyecto remoto de Supabase mediante una migración versionada con Supabase CLI, con seed inicial de 4 guarderías (principal: Guardería Sala Soles), sin RLS y sin tocar `app/`.

## Por qué

Es la primera tabla del esquema y sirve como prueba del patrón de migraciones que usará todo el proyecto. Fija la convención (archivos SQL versionados en `supabase/migrations/`, DDL idempotente, verificación remota) antes de crear las 12 tablas restantes. Incluye un seed mínimo de 4 filas para probar lectura de datos reales desde el primer día; la protagonista es Guardería Sala Soles, sede de los mocks de las specs 01–06. No toca la app porque las specs 01–06 trabajan con mocks sin persistencia.

## Alcance

**In:**

- Nuevo `supabase/migrations/<timestamp>_create_daycares.sql` con `CREATE EXTENSION IF NOT EXISTS pgcrypto;` + `CREATE TABLE public.daycares (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text, created_at timestamptz NOT NULL DEFAULT now())`.
- Seed en la misma migración: `INSERT INTO public.daycares (name)` con 4 filas — "Guardería Sala Soles" (principal), "Guardería Sala Lunas", "Guardería Sala Estrellas" y "Guardería Sala Arcoíris" (relleno temporal).
- Inicialización mínima de Supabase CLI en el repo (`supabase/config.toml` vía `supabase init`) y enlace al proyecto remoto (`supabase link`), solo si no existen.
- Aplicación de la migración al remoto (`supabase db push`).
- Verificación remota de que `public.daycares` existe con los tipos correctos y contiene las 4 filas.

**Out of scope (para specs futuras):**

- RLS y policies de `daycares` (spec de seguridad posterior).
- `updated_at` en `daycares` (el doc lista solo `created_at`; si se quiere, va como alter en otra spec).
- Constraints extra (`NOT NULL` en `name`, checks, índices).
- Resto de tablas del esquema (`users`, `rooms`, `children`, …).
- Cliente `@supabase/supabase-js`, `.env.local`, helpers en `app/` y cualquier cambio UI.

## Modelo de datos

```sql
-- supabase/migrations/<timestamp>_create_daycares.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.daycares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.daycares (name) VALUES
  ('Guardería Sala Soles'),
  ('Guardería Sala Lunas'),
  ('Guardería Sala Estrellas'),
  ('Guardería Sala Arcoíris');
```

Convenciones (del doc de referencia):

- PK `id uuid` con `default gen_random_uuid()`.
- `created_at timestamptz`, sin `updated_at` en esta tabla.
- Todo lo persistido en inglés; los nombres de guarderías son datos libres en español.
- La fila protagonista es "Guardería Sala Soles"; las otras 3 son relleno temporal para probar listados.

Esta spec no introduce estructuras en `app/` ni tipos TypeScript.

## Plan de implementación

1. Verificar CLI: `supabase --version`; si falta, instalar según docs oficiales. Verificar: comando responde versión.
2. Inicializar/enlazar: `supabase init` (solo si no existe `supabase/config.toml`) + `supabase link --project-ref <ref>`. Verificar: `supabase status` o `supabase migration list` conecta sin error.
3. Crear migración: `supabase migration new create_daycares` y volcar el DDL + seed del modelo de datos en el archivo generado. Verificar: el archivo existe en `supabase/migrations/` y contiene `CREATE TABLE public.daycares` e `INSERT INTO public.daycares`.
4. Revisar DDL en seco: `supabase db push --dry-run` (o `db diff` según versión CLI). Verificar: sin errores de sintaxis.
5. Aplicar: `supabase db push`. Verificar: la migración aparece como aplicada en `supabase migration list`.
6. Verificar estructura: `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='daycares';` Verificar: 3 filas (`id` uuid, `name` text, `created_at` timestamptz).
7. Verificar seed: `SELECT name FROM public.daycares ORDER BY name;` Verificar: 4 filas, incluida "Guardería Sala Soles".

## Criterios de aceptación

- [ ] Existe `supabase/migrations/*_create_daycares.sql` versionado en git con el DDL + seed exactos del modelo de datos.
- [ ] `supabase db push` aplica sin errores contra el remoto.
- [ ] `SELECT tablename FROM pg_tables WHERE schemaname='public'` incluye `daycares`.
- [ ] Las columnas son exactamente `id uuid`, `name text`, `created_at timestamptz` (verificado vía `information_schema`).
- [ ] `daycares` no tiene RLS activado ni policies en esta spec.
- [ ] `SELECT count(*) FROM public.daycares` devuelve 4.
- [ ] Existe la fila "Guardería Sala Soles".
- [ ] Ningún archivo bajo `app/` fue modificado ni se añadió dependencia (`package.json` intacto).

## Decisiones

- **Sí:** Supabase CLI local con `supabase/migrations/*.sql` — decisión del usuario; reproducible, auditable y versionado frente a DDL ad-hoc vía MCP.
- **Sí:** DDL literal del doc (sin `updated_at`, sin `NOT NULL` en `name`) — decisión del usuario; fidelidad a la tabla 1 del esquema.
- **Sí:** `CREATE EXTENSION IF NOT EXISTS pgcrypto;` en la misma migración — decisión del usuario; `gen_random_uuid()` la requiere e `IF NOT EXISTS` la hace idempotente.
- **Sí:** seed de 4 guarderías en la misma migración — decisión del usuario; permite probar lectura de datos reales; protagonista "Guardería Sala Soles", resto relleno temporal.
- **Sí:** INSERT plano (sin `ON CONFLICT`) — la migración corre una sola vez, no necesita idempotencia.
- **Sí:** sin RLS — decisión del usuario; prueba de DDL + seed, seguridad en spec posterior.
- **Sí:** sin tocar `app/` — decisión del usuario; las specs 01–06 siguen con mocks.
- **No:** `apply_migration` vía MCP como patrón — descartado por el usuario; el MCP sirve para verificación (SELECT), no como canal de DDL.
- **No:** `updated_at`, constraints extra, índices, RLS, resto de tablas, cliente JS.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `supabase link` requiere `project-ref` y credenciales | No hardcodear secretos; usar login/links locales, nunca commitear tokens |
| Deriva entre migración local y remoto (alguien creó tablas a mano) | `supabase migration list` + verificación vía `information_schema` antes de dar por buena |
| Versión de CLI distinta genera nombres/checksums distintos | Fijar versión de CLI usada en la descripción del PR de implementación |
| Nombres de relleno (Lunas, Estrellas, Arcoíris) llegan a producción | Documentados como temporales en esta spec; renombrar o borrar en la spec de datos reales |

## Lo que **no** entra en esta spec

- RLS y policies.
- `updated_at`, `NOT NULL` en `name`, índices.
- Tablas `users`, `rooms`, `children` y siguientes.
- Cliente Supabase en `app/`, `.env`, cambios UI.

Cada una de esas, si llega, va en su propia spec.
