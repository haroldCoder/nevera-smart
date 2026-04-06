import { createMessageHandler, sendToParent } from "./messaging";
import { handleSafeAreaMessage } from "./safe-area";
import { isInIframe, isWeb } from "./utils";

let initialized = false;

export function initManusRuntime(): void {
    if (!isWeb() || !isInIframe()) return;
    if (initialized) return;

    initialized = true;

    const handler = createMessageHandler((payload) => {
        handleSafeAreaMessage(payload);
    });

    window.addEventListener("message", handler);

    sendToParent("appDevServerReady", {});
}

export function isRunningInPreviewIframe(): boolean {
    return isWeb() && isInIframe();
}