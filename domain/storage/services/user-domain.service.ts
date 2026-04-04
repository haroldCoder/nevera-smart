import { InsertUser } from "@/drizzle/schema";

export class UserDomainService {
    static buildUser(user: InsertUser, ownerOpenId: string) {
        if (!user.openId) {
            throw new Error("User openId is required for upsert");
        }
        return {
            openId: user.openId,
            name: user.name ?? null,
            email: user.email ?? null,
            role: UserDomainService.resolveRole(user, ownerOpenId),
            lastSignedIn: user.lastSignedIn ?? new Date(),
        };
    }

    private static resolveRole(user: InsertUser, ownerOpenId: string): "admin" | "user" {
        if (user.role) return user.role;
        if (user.openId === ownerOpenId) return "admin";
        return "user";
    }
}