import { User } from "@/domain/auth/entities";

export interface AuthRepository {
    exchangeOAuthCode(code: string, state: string): Promise<{ sessionToken: string; user: User }>;
    logout(): Promise<void>;
    getMe(): Promise<User | null>;
    establishSession(token: string): Promise<boolean>;
}
