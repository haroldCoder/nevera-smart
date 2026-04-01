import { mapCategory } from "@/domain/barcode/constants";
import { BarcodeRepository } from "@/domain/barcode/repositories";
import { BarcodeProduct } from "@/domain/barcode/entities";
import { DEMO_BARCODES } from "@/infrastructure/barcode/data";

/**
 * Barcode Service - Integración con Open Food Facts API
 * Permite buscar productos por código de barras y obtener información
 */

export class BarcodeRepositoryImpl implements BarcodeRepository {
    /**
 * Busca un producto por código de barras usando Open Food Facts API
 * @param barcode - Código de barras (EAN-13, UPC, etc.)
 * @returns Información del producto o null si no se encuentra
 */
    async searchProductByBarcode(barcode: string): Promise<BarcodeProduct | null> {
        try {
            // Validar que el barcode tenga al menos 8 dígitos
            if (!barcode || barcode.replace(/\D/g, "").length < 8) {
                return null;
            }

            const cleanBarcode = barcode.replace(/\D/g, "");
            const url = `https://world.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "User-Agent": "NeveraSmart/1.0 (Linux; Android 10; NeveraSmart)",
                },
            });

            if (!response.ok) {
                return null;
            }

            const data: any = await response.json();

            if (data.status === 0 || !data.product) {
                return {
                    name: "",
                    found: false,
                };
            }

            const product = data.product;
            const name = product.product_name || product.generic_name || "";
            const category = product.categories ? mapCategory(product.categories) : "otros";
            const brand = product.brands || undefined;
            const imageUrl = product.image_front_url || product.image_url || undefined;

            return {
                name: name.trim(),
                category,
                brand,
                imageUrl,
                found: true,
            };
        } catch (error) {
            console.error("Error searching barcode:", error);
            return null;

        }
    }
    /**
 * Valida si un string es un código de barras válido
 */
    isValidBarcode(barcode: string): boolean {
        const digits = barcode.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 14;
    }

    /**
 * Extrae dígitos de un código de barras (remueve caracteres especiales)
 */
    cleanBarcode(barcode: string): string {
        return barcode.replace(/\D/g, "");
    }

    async getByBarcode(code: string) {
        let product: BarcodeProduct | null = DEMO_BARCODES[code];

        if (!product) {
            product = await this.searchProductByBarcode(code);
        }

        return product;
    }
}