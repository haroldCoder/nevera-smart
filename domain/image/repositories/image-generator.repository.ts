export interface ImageGeneratorRepository {
    generate(prompt: string): Promise<{ url: string }>;
}