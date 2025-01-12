-- Database Schema for Perplexica

-- Messages Table
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    chatId TEXT NOT NULL,
    messageId TEXT NOT NULL,
    role TEXT CHECK (role IN ('assistant', 'user')),
    metadata TEXT
);

-- Chats Table
CREATE TABLE chats (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    focusMode TEXT NOT NULL,
    files TEXT DEFAULT '[]'
);

-- Memories Table
CREATE TABLE memories (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    type TEXT NOT NULL
);

-- Cards Table
CREATE TABLE cards (
    id INTEGER PRIMARY KEY,
    stack INTEGER NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL
);

-- Stacks Table
CREATE TABLE stacks (
    id INTEGER PRIMARY KEY,
    cards TEXT NOT NULL,
    chat TEXT NOT NULL
);

-- Summaries Table
CREATE TABLE summaries (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    chat TEXT NOT NULL
);

-- Example Data

-- Insert example chat
INSERT INTO chats (id, title, createdAt, focusMode, files) VALUES
('chat1', 'Erste Konversation', '2024-03-20T10:00:00Z', 'normal', '[]'),
('chat2', 'Mathematik Lernen', '2024-03-20T11:00:00Z', 'focus', '[]');

-- Insert example messages
INSERT INTO messages (content, chatId, messageId, role, metadata) VALUES
('Hallo, wie kann ich dir helfen?', 'chat1', 'msg1', 'assistant', '{}'),
('Ich möchte etwas über Datenbanken lernen', 'chat1', 'msg2', 'user', '{}'),
('Was ist der Unterschied zwischen SQL und NoSQL?', 'chat2', 'msg3', 'user', '{}');

-- Insert example memories
INSERT INTO memories (content, type) VALUES
('Suche nur schwarz-weiß Bilder aus', 'image'),
('Vorherige Diskussion über SQL vs NoSQL', 'conversation');

-- Insert example cards
INSERT INTO cards (stack, front, back) VALUES
(1, 'Was ist SQL?', 'Structured Query Language - Eine Sprache zur Datenbankabfrage'),
(1, 'Was ist ein Primärschlüssel?', 'Ein eindeutiger Identifikator für Datensätze in einer Tabelle');

-- Insert example stacks
INSERT INTO stacks (cards, chat) VALUES
('[1,2]', 'chat1');

-- Insert example summaries
INSERT INTO summaries (content, chat) VALUES
('Diskussion über Datenbankgrundlagen und verschiedene Datenbanktypen', 'chat1'),
('Mathematische Konzepte und Übungsaufgaben', 'chat2'); 