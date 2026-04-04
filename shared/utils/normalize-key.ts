export const normalizeKey = (key: string): string => {
    return key.replace(/^\/+/, "");
}