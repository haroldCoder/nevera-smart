import { DbType } from "@/domain/storage/types";
import { InsertUser } from "@/drizzle/schema";

export interface DbRepository {
    getDb(): DbType | null;
    upsertUser(user: InsertUser): Promise<void>;
    getUserByOpenId(openId: string): Promise<any>;
}