import type { Metrics } from "react-native-safe-area-context";
import type { SafeAreaCallback, SafeAreaInsets } from "./types";

let safeAreaCallback: SafeAreaCallback | null = null;

export const subscribeSafeAreaInsets = (callback: (metrics: Metrics) => void) => {
    safeAreaCallback = callback;
    return () => {
        if (safeAreaCallback === callback) {
            safeAreaCallback = null;
        }
    };
}

export function handleSafeAreaMessage(payload: any) {
    if (
        payload.type === "setSafeAreaInsets" &&
        isValidInsets(payload.payload) &&
        safeAreaCallback
    ) {
        const insets = payload.payload;

        const frame = {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        };

        safeAreaCallback({ insets, frame });
    }
}

function isValidInsets(payload: any): payload is SafeAreaInsets {
    return (
        typeof payload.top === "number" &&
        typeof payload.bottom === "number" &&
        typeof payload.left === "number" &&
        typeof payload.right === "number"
    );
}
