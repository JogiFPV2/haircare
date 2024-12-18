# Przewodnik konfiguracji Supabase dla aplikacji Salon

## 1. Konfiguracja projektu Supabase

1. Zaloguj się do panelu Supabase: https://app.supabase.com/
2. Kliknij "New project" i wybierz organizację.
3. Wprowadź nazwę projektu (np. "salon-app").
4. Wybierz hasło do bazy danych (zapisz je bezpiecznie).
5. Wybierz region najbliższy Twojej lokalizacji.
6. Kliknij "Create new project".

## 2. Konfiguracja tabel w Supabase

1. W panelu Supabase, przejdź do zakładki "Table editor".
2. Utwórz następujące tabele:

### Tabela "klienci":
- Kliknij "Create a new table".
- Nazwa tabeli: klienci
- Kolumny:
  - id (int8, primary key)
  - imie (varchar)
  - nazwisko (varchar)
  - telefon (varchar)
- Kliknij "Save".

### Tabela "uslugi":
- Kliknij "Create a new table".
- Nazwa tabeli: uslugi
- Kolumny:
  - id (int8, primary key)
  - nazwa (varchar)
  - czas (varchar)
  - kolor (varchar)
- Kliknij "Save".

### Tabela "wizyty":
- Kliknij "Create a new table".
- Nazwa tabeli: wizyty
- Kolumny:
  - id (int8, primary key)
  - data (date)
  - godzina (time)
  - imie_nazwisko (varchar)
  - telefon (varchar)
  - uslugi (jsonb)
  - notatki (text)
  - oplacona (boolean)
- Kliknij "Save".

## 3. Konfiguracja autoryzacji w Supabase

1. Przejdź do zakładki "Authentication" w panelu Supabase.
2. W sekcji "Providers", włącz "Email".
3. Możesz dostosować ustawienia autoryzacji, takie jak czas trwania sesji, w sekcji "Settings".

## 4. Aktualizacja plików aplikacji

1. Zaktualizuj plik `.env.local` w głównym katalogu projektu:

