import type { Metrics } from "react-native-safe-area-context";

export type MessageType = "appDevServerReady";

export type SafeAreaInsets = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

export type SafeAreaCallback = (metrics: Metrics) => void;

export interface SpacePreviewerMessage {
    type: "SpacePreviewerChannel";
    payload: {
        type: string;
        from: "container" | "content";
        to: "container" | "content";
        payload: Record<string, unknown>;
    };
}