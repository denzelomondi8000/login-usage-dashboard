import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const userUsage = pgTable("user_usage", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    currentUsage: integer("current_usage").notNull().default(0),
    usageLimit: integer("usage_limit").notNull().default(100),
    lastUpdated: timestamp("last_updated")
        .$defaultFn(() => new Date())
        .notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    userIdIdx: index("user_usage_user_id_idx").on(table.userId),
}));

export type UserUsageSelect = typeof userUsage.$inferSelect;
export type UserUsageInsert = typeof userUsage.$inferInsert;