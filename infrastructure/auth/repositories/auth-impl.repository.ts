import { AuthRepository } from "@/domain/auth/repositories";
import { User } from "@/domain/auth/entities";
import { ApiBaseRepository } from "@/infrastructure/http";
import { getApiBaseUrl } from "@/shared/constants/oauth";

export class AuthImplRepository extends ApiBaseRepository implements AuthRepository {
    async exchangeOAuthCode(code: string, state: string): Promise<{ sessionToken: string; user: User }> {
        const params = new URLSearchParams({ code, state });
        const endpoint = `/api/oauth/mobile?${params.toString()}`;
        const result = await this.apiCall<{ app_session_id: string; user: User }>(endpoint);

        return {
            sessionToken: result.app_session_id,
            user: result.user,
        };
    }

    async logout(): Promise<void> {
        await this.apiCall<void>("/api/auth/logout", {
            method: "POST",
        });
    }

    async getMe(): Promise<User | null> {
        try {
            const result = await this.apiCall<{ user: User }>("/api/auth/me");
            return result.user || null;
        } catch (error) {
            console.error("[AuthImplRepository] getMe failed:", error);
            return null;
        }
    }

    async establishSession(token: string): Promise<boolean> {
        try {
            const baseUrl = getApiBaseUrl();
            const url = `${baseUrl}/api/auth/session`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            return response.ok;
        } catch (error) {
            console.error("[AuthImplRepository] establishSession error:", error);
            return false;
        }
    }
}
