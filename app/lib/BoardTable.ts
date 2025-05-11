import { json, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const BoardTable = pgTable('boards', {
  id: serial('id').primaryKey(),
  ownerId: varchar('ownerId', { length: 256 }).notNull(),
  board: json('board').notNull(),
});
