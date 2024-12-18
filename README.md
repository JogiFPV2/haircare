# Salon App - Instrukcja konfiguracji backendu

Ta aplikacja może być skonfigurowana do pracy z bazą danych PostgreSQL lub Supabase. Poniżej znajdziesz instrukcje dla obu opcji.

## Konfiguracja PostgreSQL

1. Zainstaluj PostgreSQL na swoim komputerze lub skorzystaj z hostowanej usługi PostgreSQL.

2. Utwórz nową bazę danych dla aplikacji.

3. Utwórz tabele w bazie danych:

```sql
CREATE TABLE klienci (
  id SERIAL PRIMARY KEY,
  imie VARCHAR(100) NOT NULL,
  nazwisko VARCHAR(100) NOT NULL,
  telefon VARCHAR(20) NOT NULL
);

CREATE TABLE uslugi (
  id SERIAL PRIMARY KEY,
  nazwa VARCHAR(100) NOT NULL,
  czas VARCHAR(20) NOT NULL,
  kolor VARCHAR(20) NOT NULL
);

CREATE TABLE wizyty (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL,
  godzina TIME NOT NULL,
  imie_nazwisko VARCHAR(200) NOT NULL,
  telefon VARCHAR(20) NOT NULL,
  uslugi JSONB NOT NULL,
  notatki TEXT,
  oplacona BOOLEAN NOT NULL DEFAULT false
);

