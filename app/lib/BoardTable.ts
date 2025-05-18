import {
  date,
  json,
  numeric,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const BoardTable = pgTable("boards", {
  id: serial("id").primaryKey(),
  ownerId: varchar("ownerId", {length: 256}).notNull(),
  board: json("board").notNull(),
  orientation: varchar("orientation", {length: 256}).notNull(),
  name: varchar("name", {length: 256}).notNull(),
  currentInterval: numeric().notNull(),
  easeFactor: numeric().notNull(),
  lastReviewDate: date().notNull(),
});
