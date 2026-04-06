import { isWeb, isInIframe } from "./utils";
import { SpacePreviewerMessage, MessageType } from "./types";

const DEBUG = true;

const log = (msg: string) => {
    if (!DEBUG) return;
    console.log(`[ManusRuntime ${new Date().toISOString()}] ${msg}`);
};

export function sendToParent(
    type: MessageType,
    payload: Record<string, unknown> = {}
): void {
    if (!isWeb() || !isInIframe()) return;

    const message: SpacePreviewerMessage = {
        type: "SpacePreviewerChannel",
        payload: {
            type,
            from: "content",
            to: "container",
            payload,
        },
    };

    window.parent.postMessage(message, "*");
    log(`Sent to parent: ${type}`);
}

export function createMessageHandler(
    callback: (payload: any) => void
) {
    return (event: MessageEvent<unknown>) => {
        const data = event.data as SpacePreviewerMessage | undefined;

        if (!data || data.type !== "SpacePreviewerChannel") return;

        const { payload } = data;

        if (!payload || payload.to !== "content") return;

        callback(payload);
    };
}