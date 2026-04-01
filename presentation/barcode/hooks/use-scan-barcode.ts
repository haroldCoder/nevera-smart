import { useState } from "react";
import { ScanBarcode } from "@/domain/barcode/use-cases";
import { BarcodeRepositoryImpl } from "@/infrastructure/barcode/repositories";

export const useScanBarcode = (BarcodeRepositoryImpl: BarcodeRepositoryImpl) => {
    const [loading, setLoading] = useState(false);

    const scan = async (code: string) => {
        setLoading(true);

        try {
            const repo = BarcodeRepositoryImpl;
            const useCase = new ScanBarcode(repo);

            return await useCase.execute(code);
        } finally {
            setLoading(false);
        }
    };

    return { scan, loading };
};