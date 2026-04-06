import { ImageGeneratorRepository } from "@/domain/image/repositories";
import { StorageRepository } from "@/domain/storage/repositories";
import { ForgeImageGateway } from "@/infrastructure/gateways/forge-image.gateway";

export class ImageGeneratorImplRepository implements ImageGeneratorRepository {
    constructor(private readonly forgeImageGateway: ForgeImageGateway, private readonly storageRepository: StorageRepository) { }
    async generate(prompt: string): Promise<{ url: string }> {
        const result = await this.forgeImageGateway.generateImage(prompt);

        const base64Data = result.image.b64Json;
        const buffer = Buffer.from(base64Data, "base64");

        const { url } = await this.storageRepository.storagePut(`generated/${Date.now()}.png`, buffer, result.image.mimeType);
        return { url };
    }
}