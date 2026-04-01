import { BarcodeProduct } from "@/domain/barcode/entities";

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
