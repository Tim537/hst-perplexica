# Dokumentation der Datenbankarchitektur

## Inhaltsverzeichnis
1. [Projektübersicht](#projektübersicht)
2. [Datenbankarchitektur](#datenbankarchitektur)
3. [Notwendigkeit eines DBMS](#notwendigkeit-eines-dbms)
4. [Probleme ohne DBMS](#probleme-ohne-dbms)
5. [Informationsanforderungen](#informationsanforderungen)
6. [Datenstrukturanforderungen](#datenstrukturanforderungen)

## Projektübersicht
Perplexica ist eine moderne Chat-Anwendung, die verschiedene KI-Modelle (wie LLaMA, Mixtral) integriert und erweiterte Funktionen wie Zusammenfassungen, Karteikarten und Gedächtnisspeicherung bietet. Die Anwendung besteht aus einem Frontend (Next.js) und einem Backend (Node.js) mit einer SQLite-Datenbank.

## Datenbankarchitektur
Das Projekt verwendet SQLite mit Drizzle ORM als Datenbankschicht. 



## Notwendigkeit eines DBMS
Die Verwendung eines Datenbankmanagementsystems (DBMS) ist aus folgenden Gründen notwendig:

1. **Persistente Datenspeicherung**: Chats, Nachrichten, Karten, Zusammenfassungen und andere Daten müssen dauerhaft gespeichert werden
2. **Strukturierte Datenverwaltung**: Komplexe Beziehungen zwischen Chats, Nachrichten, Karten und Zusammenfassungen
3. **Datenkonsistenz**: Sicherstellung der Integrität zwischen verschiedenen Datentabellen
4. **Skalierbarkeit**: Effiziente Verwaltung wachsender Datenmengen

## Probleme ohne DBMS
Ohne ein DBMS würden folgende Probleme auftreten:

1. **Datenverlust**: Keine garantierte Persistenz der Daten
2. **Inkonsistente Daten**: Schwierige Verwaltung von Beziehungen zwischen Entitäten
3. **Performanceprobleme**: Ineffiziente Datenzugriffe und -abfragen
4. **Skalierungsprobleme**: Schwierige Handhabung wachsender Datenmengen (Vor allem bei Chats)
5. **Mangelnde Datensicherheit**: Keine eingebauten Sicherheitsmechanismen


## Informationsanforderungen
Die Hauptinformationsanforderungen des Systems sind:

1. **Chat-Verwaltung**
   - Speicherung von Chat-Verläufen
   - Zuordnung von Nachrichten zu Chats
   - Verwaltung von Chat-Metadaten (z.B. Titel, Erstellungsdatum, Fokusmodus)

2. **Nachrichtenverwaltung**
   - Speicherung von Nachrichteninhalten
   - Unterscheidung zwischen Benutzer- und KI-Nachrichten
   - Verwaltung von Nachrichtenmetadaten (z.B. rollen)

3. **Gedächtnisverwaltung**
   - Speicherung der erstellten/bearbeiteten Erinnerungen
   - Unterscheidung zwischen Erinnerungen für Bild-, Video- und Meta-Suche

4. **Kartenverwaltung**
   - Speicherung von generierten/bearbeiteten Karteikarten aus Chats
   - Zuordnung von Karten zu Stapeln
   - Zuordnung von Stapeln zu Chats

5. **Zusammenfassungsverwaltung**
   - Speicherung von generierten/bearbeiteten Zusammenfassungen
   - Zuordnung zu spezifischen Chats

## Datenstrukturanforderungen
Die Datenstrukturanforderungen umfassen:

1. **Relationale Beziehungen**
   - Chat-zu-Nachrichten (1:n)
   - Chat-zu-Zusammenfassung (1:1)
   - Chat-zu-Stack (1:1)
   - Stack-zu-Karten (1:n)

2. **Datentypen**
   - Textuelle Inhalte für Nachrichten und Zusammenfassungen
   - JSON-Strukturen für Metadaten und komplexe Objekte
   - Enumerationen für Nachrichtenrollen

3. **Indizierung**
   - Primärschlüssel für eindeutige Identifikation
   - Fremdschlüssel für Beziehungen zwischen Tabellen

4. **Constraints**
   - Referenzielle Integrität zwischen verknüpften Tabellen

## ER-Modell
Das folgende ER-Modell zeigt die wichtigsten Entitäten und ihre Beziehungen:

![ERM](./ERM.svg "ERM")


### Funktionalität der Entitäten

1. **CHAT**
   - Zentrale Entität für die Verwaltung von Konversationen
   - Speichert Metadaten wie Titel und Erstellungsdatum
   - Verwaltet den Fokusmodus für die Konversation

2. **MESSAGE**
   - Speichert einzelne Nachrichten innerhalb eines Chats
   - Unterscheidet zwischen Benutzer- und KI-Nachrichten
   - Enthält zusätzliche Metadaten für erweiterte Funktionen

3. **SUMMARY**
   - Speichert Zusammenfassungen von Chat-Inhalten
   - Ermöglicht schnellen Überblick über Chatverläufe

4. **STACK**
   - Organisiert Karteikarten in Sammlungen
   - Verknüpft Kartensammlungen mit Chats

5. **CARD**
   - Repräsentiert einzelne Lernkarten
   - Speichert Vorder- und Rückseite der Karte

6. **MEMORY**
   - Speichert verschiedene Arten von Erinnerungen
   - Unterstützt verschiedene Medientypen


## Relationales Schema
Basierend auf dem ER-Modell und unter Berücksichtigung der Normalisierung ergibt sich folgendes relationales Schema:

**Chat**: (<u>id: string</u>,</br>
title: string,</br>
createdAt: string,</br>
focusMode: string,</br>
files: array)

**Messages**: (<u>id: integer</u>,</br>
content: string,</br>
chatId: string,</br>
#messageId: string, //war schon beim forken so gespeichert</br>
role: string,</br>
metadata: array)

**Memories**: (<u>id: integer</u>,</br>
content: string,</br>
type: string)

**Cards**: (<u>id: integer</u>,</br>
stack: integer,</br>
front: string,</br>
back: string)

**Stacks**: (<u>id: integer</u>,</br>
cards: array,</br>
chat: string)

**Summaries**: (<u>id: integer</u>,</br>
content: string,</br>
chat: string)

## Typische Datenbankabfragen

Hier sind einige typische Abfragen, die in der Anwendung verwendet werden:

1. **Alle Nachrichten eines bestimmten Chats abrufen**
```sql
SELECT * FROM messages 
WHERE chatId = 'chat1' 
ORDER BY id ASC;
```

2. **Zusammenfassung für einen bestimmten Chat finden**
```sql
SELECT content 
FROM summaries 
WHERE chat = 'chat1';
```

3. **Alle Karteikarten eines Stapels abrufen**
```sql
SELECT c.* 
FROM cards c
INNER JOIN stacks s ON c.stack = s.id
WHERE s.chat = 'chat1';
```

4. **Letzte Nachrichten eines Benutzers finden**
```sql
SELECT * FROM messages 
WHERE role = 'user' 
ORDER BY id DESC 
LIMIT 5;
```

5. **Chats mit ihren Zusammenfassungen**
```sql
SELECT c.title, s.content 
FROM chats c
LEFT JOIN summaries s ON c.id = s.chat;
```

6. **Alle Erinnerungen eines bestimmten Typs**
```sql
SELECT * FROM memories 
WHERE type = 'context';
```

7. **Anzahl der Nachrichten pro Chat**
```sql
SELECT chatId, COUNT(*) as message_count 
FROM messages 
GROUP BY chatId;
```

8. **Chats ohne Zusammenfassungen finden**
```sql
SELECT c.* 
FROM chats c
LEFT JOIN summaries s ON c.id = s.chat
WHERE s.id IS NULL;
```


