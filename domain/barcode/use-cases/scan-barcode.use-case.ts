import { BarcodeRepository } from "@/domain/barcode/repositories";

export class ScanBarcode {
    constructor(private repo: BarcodeRepository) { }

    async execute(code: string) {
        if (!code) throw new Error("INVALID_BARCODE");

        const product = await this.repo.getByBarcode(code);

        if (!product || !product.found) {
            return null;
        }

        return product;
    }
}