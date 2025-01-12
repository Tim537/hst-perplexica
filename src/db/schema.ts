import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey(),
  content: text('content').notNull(),
  chatId: text('chatId').notNull(),
  messageId: text('messageId').notNull(),
  role: text('type', { enum: ['assistant', 'user'] }),
  metadata: text('metadata', {
    mode: 'json',
  }),
});

interface File {
  name: string;
  fileId: string;
}

export const chats = sqliteTable('chats', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: text('createdAt').notNull(),
  focusMode: text('focusMode').notNull(),
  files: text('files', { mode: 'json' })
    .$type<File[]>()
    .default(sql`'[]'`),
});

export const memories = sqliteTable('memories', {
  id: integer('id').primaryKey(),
  content: text('content').notNull(),
  type: text('type').notNull(),
});

export const cards = sqliteTable('cards', {
  id: integer('id').primaryKey(),
  stack: integer('stack').notNull(),
  front: text('front').notNull(),
  back: text('back').notNull(),
});

export const stacks = sqliteTable('stacks', {
  id: integer('id').primaryKey(),
  cards: text('cards', { mode: 'json' }).notNull(),
  chat: text('chat').notNull(),
});

export const summaries = sqliteTable('summaries', {
  id: integer('id').primaryKey(),
  content: text('content').notNull(),
  chat: text('chat').notNull(),
});
