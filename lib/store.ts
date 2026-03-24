import AsyncStorage from "@react-native-async-storage/async-storage";

export type FoodCategory = "lacteos" | "frutas" | "verduras" | "carnes" | "granos" | "bebidas" | "otros";
export type FoodLocation = "nevera" | "congelador" | "despensa";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  location: FoodLocation;
  expiryDate: string; // ISO date string
  quantity: number;
  unit: string;
  addedAt: string; // ISO date string
}

export interface ShoppingItem {
  id: string;
  name: string;
  category?: FoodCategory;
  quantity?: number;
  unit?: string;
  completed: boolean;
  suggested: boolean;
  addedAt: string;
}

export interface WasteRecord {
  id: string;
  foodName: string;
  category: FoodCategory;
  wastedAt: string;
}

const KEYS = {
  FOODS: "nevera_smart_foods",
  SHOPPING: "nevera_smart_shopping",
  WASTE: "nevera_smart_waste",
};

// ---- Foods ----
export async function getFoods(): Promise<FoodItem[]> {
  const raw = await AsyncStorage.getItem(KEYS.FOODS);
  return raw ? JSON.parse(raw) : [];
}

export async function saveFoods(foods: FoodItem[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.FOODS, JSON.stringify(foods));
}

export async function addFood(food: FoodItem): Promise<void> {
  const foods = await getFoods();
  foods.push(food);
  await saveFoods(foods);
}

export async function updateFood(updated: FoodItem): Promise<void> {
  const foods = await getFoods();
  const idx = foods.findIndex((f) => f.id === updated.id);
  if (idx !== -1) foods[idx] = updated;
  await saveFoods(foods);
}

export async function deleteFood(id: string): Promise<void> {
  const foods = await getFoods();
  await saveFoods(foods.filter((f) => f.id !== id));
}

// ---- Shopping ----
export async function getShoppingItems(): Promise<ShoppingItem[]> {
  const raw = await AsyncStorage.getItem(KEYS.SHOPPING);
  return raw ? JSON.parse(raw) : [];
}

export async function saveShoppingItems(items: ShoppingItem[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.SHOPPING, JSON.stringify(items));
}

export async function addShoppingItem(item: ShoppingItem): Promise<void> {
  const items = await getShoppingItems();
  items.push(item);
  await saveShoppingItems(items);
}

export async function toggleShoppingItem(id: string): Promise<void> {
  const items = await getShoppingItems();
  const idx = items.findIndex((i) => i.id === id);
  if (idx !== -1) items[idx].completed = !items[idx].completed;
  await saveShoppingItems(items);
}

export async function deleteShoppingItem(id: string): Promise<void> {
  const items = await getShoppingItems();
  await saveShoppingItems(items.filter((i) => i.id !== id));
}

export async function clearCompletedShoppingItems(): Promise<void> {
  const items = await getShoppingItems();
  await saveShoppingItems(items.filter((i) => !i.completed));
}

// ---- Waste ----
export async function getWasteRecords(): Promise<WasteRecord[]> {
  const raw = await AsyncStorage.getItem(KEYS.WASTE);
  return raw ? JSON.parse(raw) : [];
}

export async function addWasteRecord(record: WasteRecord): Promise<void> {
  const records = await getWasteRecords();
  records.push(record);
  await AsyncStorage.setItem(KEYS.WASTE, JSON.stringify(records));
}

// ---- Helpers ----
export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(days: number): "fresh" | "warning" | "expired" {
  if (days < 0) return "expired";
  if (days <= 3) return "warning";
  return "fresh";
}

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  lacteos: "Lácteos",
  frutas: "Frutas",
  verduras: "Verduras",
  carnes: "Carnes",
  granos: "Granos",
  bebidas: "Bebidas",
  otros: "Otros",
};

export const CATEGORY_ICONS: Record<FoodCategory, string> = {
  lacteos: "🥛",
  frutas: "🍎",
  verduras: "🥦",
  carnes: "🥩",
  granos: "🌾",
  bebidas: "🧃",
  otros: "📦",
};

export const LOCATION_LABELS: Record<FoodLocation, string> = {
  nevera: "Nevera",
  congelador: "Congelador",
  despensa: "Despensa",
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Seed data for demo
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
