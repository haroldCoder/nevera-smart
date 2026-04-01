import { User } from "@/domain/auth/entities";

export interface AuthStorageRepository {
    getSessionToken(): Promise<string | null>;
    setSessionToken(token: string): Promise<void>;
    removeSessionToken(): Promise<void>;
    getUserInfo(): Promise<User | null>;
    setUserInfo(user: User): Promise<void>;
    clearUserInfo(): Promise<void>;
}
