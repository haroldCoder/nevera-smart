import { StorageRepository } from "@/domain/storage/repositories";
import { StorageConfig } from "@/domain/storage/types";
import { ensureTrailingSlash, normalizeKey } from "@/shared/utils";
import { ENV } from "@shared/_core";
import * as FileSystem from "expo-file-system";
import { EncodingType } from "expo-file-system/build/ExpoFileSystem.types";

export class StorageImplRepository implements StorageRepository {
    getStorageConfig(): StorageConfig {
        const baseUrl = ENV.forgeApiUrl;
        const apiKey = ENV.forgeApiKey;

        if (!baseUrl || !apiKey) {
            throw new Error(
                "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY",
            );
        }

        return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
    }
    buildUploadUrl(baseUrl: string, relKey: string): string | URL {
        const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
        url.searchParams.set("path", normalizeKey(relKey));
        return url;
    }
    async buildDownloadUrl(baseUrl: string, relKey: string, apiKey: string): Promise<string | URL> {
        const downloadApiUrl = new URL("v1/storage/downloadUrl", ensureTrailingSlash(baseUrl));
        downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
        const response: Response = await fetch(downloadApiUrl, {
            method: "GET",
            headers: this.buildAuthHeaders(apiKey),
        });

        const responseJson = await response.json() as { url: string };
        return responseJson.url;
    }
    buildAuthHeaders(apiKey: string): HeadersInit_ {
        return { Authorization: `Bearer ${apiKey}` };
    }
    async storagePut(relKey: string, data: Buffer | Uint8Array | string, contentType?: string): Promise<{ key: string; url: string }> {
        const { baseUrl, apiKey } = this.getStorageConfig();
        const key = normalizeKey(relKey);
        const uploadUrl = this.buildUploadUrl(baseUrl, key);
        const formData = await this.toFormData(data, contentType ?? "application/octet-stream", key.split("/").pop() ?? key);
        const response = await fetch(uploadUrl.toString(), {
            method: "POST",
            headers: this.buildAuthHeaders(apiKey),
            body: formData as any,
        });

        if (!response.ok) {
            const message = await response.text().catch(() => response.statusText);
            throw new Error(
                `Storage upload failed (${response.status} ${response.statusText}): ${message}`,
            );
        }

        const responseJson = await response.json() as { url: string };
        return { key, url: responseJson.url };
    }
    async storageGet(relKey: string): Promise<{ key: string; url: string }> {
        const { baseUrl, apiKey } = this.getStorageConfig();
        const key = normalizeKey(relKey);
        const downloadUrl = await this.buildDownloadUrl(baseUrl, key, apiKey);
        return { key, url: downloadUrl.toString() };
    }

    async toFormData(data: Buffer | Uint8Array | string, contentType: string, fileName: string): Promise<FormData> {
        try {
            // 1. Convertir a base64
            let base64: string;

            if (typeof data === "string") {
                // ⚠️ Asumimos que ya viene en base64
                base64 = data;
            } else {
                base64 = Buffer.from(data).toString("base64");
            }

            // 2. Crear ruta temporal
            const fileUri = FileSystem.Paths.cache + fileName;

            // 3. Escribir archivo en el sistema
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: EncodingType.Base64,
            });

            // 4. Crear FormData
            const formData = new FormData();

            formData.append("file", {
                uri: fileUri,
                name: fileName,
                type: contentType,
            } as any);

            return formData;
        } catch (error) {
            console.error("Error creando FormData:", error);
            throw error;
        }
    }
}