import { BarcodeProduct } from "@/domain/barcode/entities";

export interface BarcodeRepository {
    searchProductByBarcode(barcode: string): Promise<BarcodeProduct | null>;
    isValidBarcode(barcode: string): boolean;
    cleanBarcode(barcode: string): string;
    getByBarcode(code: string): Promise<BarcodeProduct | null>;
}