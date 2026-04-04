import { DbRepository } from "@/domain/storage/repositories/db.repository";
import { UserDomainService } from "@/domain/storage/services";
import { DbType } from "@/domain/storage/types";
import { InsertUser, users } from "@/drizzle/schema";
import { ENV } from "@/shared/_core";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2/driver";

export class DbImplRepository implements DbRepository {
    _db: DbType | null = null;


    getDb(): DbType | null {
        if (!this._db && process.env.DATABASE_URL) {
            try {
                this._db = drizzle(process.env.DATABASE_URL);
            } catch (error) {
                console.error("Error creating database connection:", error);
            }
        }
        return this._db;
    }

    async upsertUser(user: InsertUser): Promise<void> {
        if (!user.openId) {
            throw new Error("User openId is required for upsert");
        }

        const db = await this.getDb();
        if (!db) {
            console.warn("[Database] Cannot upsert user: database not available");
            return;
        }

        try {
            const buildUser = UserDomainService.buildUser(user, ENV.ownerOpenId);

            const { values, updateSet } = this.mapToDatabase(buildUser);

            await db.insert(users).values(values).onDuplicateKeyUpdate({
                set: updateSet,
            });
        } catch (error) {
            console.error("[Database] Failed to upsert user:", error);
            throw error;
        }
    }

    private mapToDatabase(user: InsertUser) {
        const values = {
            openId: user.openId,
            name: user.name,
            email: user.email,
            role: user.role,
            lastSignedIn: user.lastSignedIn,
        };

        const updateSet = { ...values };

        return { values, updateSet };
    }

    async getUserByOpenId(openId: string): Promise<any> {
        const db = await this.getDb();
        if (!db) {
            console.warn("[Database] Cannot get user: database not available");
            return undefined;
        }

        const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

        return result.length > 0 ? result[0] : undefined;
    }
}