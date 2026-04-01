import { FoodItem } from "@/domain/foods/entities";

export const DEMO_FOODS: FoodItem[] = [
    { id: "1", name: "Leche entera", category: "lacteos", location: "nevera", expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(), quantity: 1, unit: "L", addedAt: new Date().toISOString() },
    { id: "2", name: "Yogur natural", category: "lacteos", location: "nevera", expiryDate: new Date(Date.now() + 5 * 86400000).toISOString(), quantity: 4, unit: "unid", addedAt: new Date().toISOString() },
    { id: "3", name: "Manzanas", category: "frutas", location: "nevera", expiryDate: new Date(Date.now() + 7 * 86400000).toISOString(), quantity: 6, unit: "unid", addedAt: new Date().toISOString() },
    { id: "4", name: "Espinacas", category: "verduras", location: "nevera", expiryDate: new Date(Date.now() + 1 * 86400000).toISOString(), quantity: 1, unit: "bolsa", addedAt: new Date().toISOString() },
    { id: "5", name: "Pechuga de pollo", category: "carnes", location: "congelador", expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(), quantity: 500, unit: "g", addedAt: new Date().toISOString() },
    { id: "6", name: "Arroz integral", category: "granos", location: "despensa", expiryDate: new Date(Date.now() + 180 * 86400000).toISOString(), quantity: 1, unit: "kg", addedAt: new Date().toISOString() },
    { id: "7", name: "Queso fresco", category: "lacteos", location: "nevera", expiryDate: new Date(Date.now() - 1 * 86400000).toISOString(), quantity: 200, unit: "g", addedAt: new Date().toISOString() },
    { id: "8", name: "Zanahorias", category: "verduras", location: "nevera", expiryDate: new Date(Date.now() + 10 * 86400000).toISOString(), quantity: 5, unit: "unid", addedAt: new Date().toISOString() },
    { id: "9", name: "Jugo de naranja", category: "bebidas", location: "nevera", expiryDate: new Date(Date.now() + 3 * 86400000).toISOString(), quantity: 1, unit: "L", addedAt: new Date().toISOString() },
    { id: "10", name: "Huevos", category: "otros", location: "nevera", expiryDate: new Date(Date.now() + 14 * 86400000).toISOString(), quantity: 12, unit: "unid", addedAt: new Date().toISOString() },
];