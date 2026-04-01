import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { SESSION_TOKEN_KEY, USER_INFO_KEY } from "@/shared/constants/oauth";
import { AuthStorageRepository } from "@/domain/auth/repositories";
import { User } from "@/domain/auth/entities";

export class AuthStorageImplRepository implements AuthStorageRepository {
    async getSessionToken(): Promise<string | null> {
        try {
            if (Platform.OS === "web") return null;
            return await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
        } catch (error) {
            console.error("[AuthStorage] Failed to get session token:", error);
            return null;
        }
    }

    async setSessionToken(token: string): Promise<void> {
        try {
            if (Platform.OS === "web") return;
            await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
        } catch (error) {
            console.error("[AuthStorage] Failed to set session token:", error);
            throw error;
        }
    }

    async removeSessionToken(): Promise<void> {
        try {
            if (Platform.OS === "web") return;
            await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
        } catch (error) {
            console.error("[AuthStorage] Failed to remove session token:", error);
        }
    }

    async getUserInfo(): Promise<User | null> {
        try {
            let info: string | null = null;
            if (Platform.OS === "web") {
                info = (globalThis as any).localStorage.getItem(USER_INFO_KEY);
            } else {
                info = await SecureStore.getItemAsync(USER_INFO_KEY);
            }

            if (!info) return null;
            const user = JSON.parse(info);
            return {
                ...user,
                lastSignedIn: user.lastSignedIn ? new Date(user.lastSignedIn) : new Date(),
            };
        } catch (error) {
            console.error("[AuthStorage] Failed to get user info:", error);
            return null;
        }
    }

    async setUserInfo(user: User): Promise<void> {
        try {
            const data = JSON.stringify(user);
            if (Platform.OS === "web") {
                (globalThis as any).localStorage.setItem(USER_INFO_KEY, data);
            } else {
                await SecureStore.setItemAsync(USER_INFO_KEY, data);
            }
        } catch (error) {
            console.error("[AuthStorage] Failed to set user info:", error);
        }
    }

    async clearUserInfo(): Promise<void> {
        try {
            if (Platform.OS === "web") {
                (globalThis as any).localStorage.removeItem(USER_INFO_KEY);
            } else {
                await SecureStore.deleteItemAsync(USER_INFO_KEY);
            }
        } catch (error) {
            console.error("[AuthStorage] Failed to clear user info:", error);
        }
    }
}
