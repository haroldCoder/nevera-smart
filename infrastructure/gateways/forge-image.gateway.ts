import { ENV } from "@/shared/_core";

export class ForgeImageGateway {
    async generateImage(prompt: string): Promise<any> {
        const baseUrl = ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`;

        const fullUrl = new URL("images.v1.ImageService/GenerateImage", baseUrl).toString();

        const response = await fetch(fullUrl, {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: `Bearer ${ENV.forgeApiKey}`,
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error("API_ERROR");
        }

        return await response.json();
    }
}