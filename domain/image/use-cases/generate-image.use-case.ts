import { ImageGeneratorRepository } from "@/domain/image/repositories";

export class GenerateImageUseCase {
    constructor(private readonly imageGeneratorRepository: ImageGeneratorRepository) { }

    async execute(prompt: string): Promise<{ url: string }> {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

        return await this.imageGeneratorRepository.generate(prompt);
    }
}