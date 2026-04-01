import { BarcodeRepositoryImpl } from "@/infrastructure/barcode/repositories";

export class DiFactory {
    static createBarcodeRepository() {
        return new BarcodeRepositoryImpl();
    }
}