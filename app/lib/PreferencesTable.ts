import {numeric, pgTable, serial, varchar} from "drizzle-orm/pg-core";

export const PreferencesTable = pgTable("preferences", {
  id: serial("id").primaryKey(),
  ownerId: varchar("ownerId", {length: 256}).notNull(),
  rating: varchar("rating", {length: 256}).notNull(),
  coverage: varchar("coverage", {length: 256}).notNull(),
});
