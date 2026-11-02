/*
CREATE USER recepti_user WITH PASSWORD 'superVarnoGeslo';

CREATE DATABASE recepti OWNER recepti_user;
 */

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

/*
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('recept', 'recept_sestavine')
ORDER BY table_name, ordinal_position;
 */

SELECT * FROM recept;
SELECT * FROM recept_sestavine;