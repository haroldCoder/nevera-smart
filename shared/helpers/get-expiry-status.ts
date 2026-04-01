export function getExpiryStatus(days: number): "fresh" | "warning" | "expired" {
    if (days < 0) return "expired";
    if (days <= 3) return "warning";
    return "fresh";
}