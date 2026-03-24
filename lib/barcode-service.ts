/**
 * Barcode Service - Integración con Open Food Facts API
 * Permite buscar productos por código de barras y obtener información
 */

export interface BarcodeProduct {
  name: string;
  category?: string;
  brand?: string;
  imageUrl?: string;
  found: boolean;
}

// Mapeo de categorías de Open Food Facts a nuestras categorías
const CATEGORY_MAPPING: Record<string, string> = {
  dairy: "lacteos",
  milk: "lacteos",
  cheese: "lacteos",
  yogurt: "lacteos",
  butter: "lacteos",
  cream: "lacteos",
  fruit: "frutas",
  apple: "frutas",
  banana: "frutas",
  orange: "frutas",
  berry: "frutas",
  vegetable: "verduras",
  carrot: "verduras",
  spinach: "verduras",
  broccoli: "verduras",
  lettuce: "verduras",
  meat: "carnes",
  chicken: "carnes",
  beef: "carnes",
  pork: "carnes",
  fish: "carnes",
  cereal: "granos",
  grain: "granos",
  rice: "granos",
  bread: "granos",
  pasta: "granos",
  beverage: "bebidas",
  juice: "bebidas",
  water: "bebidas",
  milk_drink: "bebidas",
  tea: "bebidas",
  coffee: "bebidas",
};

function mapCategory(openFoodFactsCategory: string): string {
  const normalized = openFoodFactsCategory.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  return "otros";
}

/**
 * Busca un producto por código de barras usando Open Food Facts API
 * @param barcode - Código de barras (EAN-13, UPC, etc.)
 * @returns Información del producto o null si no se encuentra
 */
export async function searchProductByBarcode(barcode: string): Promise<BarcodeProduct | null> {
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

    const data = await response.json();

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
export function isValidBarcode(barcode: string): boolean {
  const digits = barcode.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 14;
}

/**
 * Extrae dígitos de un código de barras (remueve caracteres especiales)
 */
export function cleanBarcode(barcode: string): string {
  return barcode.replace(/\D/g, "");
}

// Productos de ejemplo para testing sin conexión a API
export const DEMO_BARCODES: Record<string, BarcodeProduct> = {
  "7501000529104": {
    name: "Leche Entera Lala",
    category: "lacteos",
    brand: "Lala",
    found: true,
  },
  "7501001004014": {
    name: "Yogur Natural Lala",
    category: "lacteos",
    brand: "Lala",
    found: true,
  },
  "7501234567890": {
    name: "Manzanas Rojas",
    category: "frutas",
    brand: "Frutería",
    found: true,
  },
  "7501111111111": {
    name: "Espinacas Frescas",
    category: "verduras",
    brand: "Huerta",
    found: true,
  },
  "7501222222222": {
    name: "Pechuga de Pollo",
    category: "carnes",
    brand: "Carnicería",
    found: true,
  },
};
