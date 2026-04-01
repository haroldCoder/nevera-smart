import { Platform } from "react-native";
import { getApiBaseUrl } from "@/shared/constants/oauth";
import * as Auth from "@/lib/_core/auth";

export class ApiBaseRepository {
    protected async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...((options.headers as Record<string, string>) || {}),
        };

        if (Platform.OS !== "web") {
            const sessionToken = await Auth.getSessionToken();
            if (sessionToken) {
                headers["Authorization"] = `Bearer ${sessionToken}`;
            }
        }

        const baseUrl = getApiBaseUrl();
        const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
        const url = baseUrl ? `${cleanBaseUrl}${cleanEndpoint}` : endpoint;

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                credentials: "include",
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = errorText;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error || errorJson.message || errorText;
                } catch {
                    // Not JSON
                }
                throw new Error(errorMessage || `API call failed: ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return (await response.json()) as T;
            }

            const text = await response.text();
            return (text ? JSON.parse(text) : {}) as T;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error("Unknown error occurred");
        }
    }
}
