import { drizzle } from "drizzle-orm/mysql2";

export type DbType = ReturnType<typeof drizzle>;