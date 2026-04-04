import { StorageConfig } from "@/domain/storage/types";

export interface StorageRepository {
    getStorageConfig(): StorageConfig;
    buildUploadUrl(baseUrl: string, relKey: string): string | URL;
    buildDownloadUrl(baseUrl: string, relkey: string, apiKey: string): Promise<string | URL>;
    buildAuthHeaders(apiKey: string): HeadersInit_;
    storagePut(relKey: string, data: Buffer | Uint8Array | string, contentType?: string): Promise<{ key: string; url: string }>;
    storageGet(relKey: string): Promise<{ key: string; url: string }>;
}