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
