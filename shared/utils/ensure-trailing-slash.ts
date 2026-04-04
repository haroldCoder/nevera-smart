export const ensureTrailingSlash = (value: string): string => {
    return value.endsWith("/") ? value : `${value}/`;
}