-- Extensiones requeridas por el resto de migraciones.
-- pgcrypto: gen_random_uuid() para llaves primarias.
create extension if not exists "pgcrypto";
