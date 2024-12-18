# Salon App - Instrukcja konfiguracji Supabase

Ta instrukcja przeprowadzi Cię przez proces konfiguracji bazy danych Supabase dla aplikacji Salon.

## Krok 1: Konfiguracja projektu Supabase

1. Zaloguj się do panelu Supabase: https://app.supabase.com/
2. Utwórz nowy projekt lub wybierz istniejący.
3. W panelu projektu, przejdź do zakładki "SQL Editor".

## Krok 2: Tworzenie tabel

Wykonaj poniższe zapytania SQL, aby utworzyć niezbędne tabele:

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

