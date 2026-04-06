import { Platform } from "react-native";

export function isWeb(): boolean {
    return Platform.OS === "web";
}

export function isInIframe(): boolean {
    if (!isWeb()) return false;

    try {
        return window.self !== window.top;
    } catch {
        return true;
    }
}