import { useState, useEffect, useCallback } from "react";
import {
  FoodItem,
  getFoods,
  saveFoods,
  addFood,
  updateFood,
  deleteFood,
  addWasteRecord,
  getWasteRecords,
  WasteRecord,
  DEMO_FOODS,
  generateId,
} from "@/lib/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const INITIALIZED_KEY = "nevera_smart_initialized";

export function useFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
      if (!initialized) {
        await saveFoods(DEMO_FOODS);
        await AsyncStorage.setItem(INITIALIZED_KEY, "true");
      }
      const [f, w] = await Promise.all([getFoods(), getWasteRecords()]);
      setFoods(f);
      setWasteRecords(w);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (food: Omit<FoodItem, "id" | "addedAt">) => {
    const newFood: FoodItem = {
      ...food,
      id: generateId(),
      addedAt: new Date().toISOString(),
    };
    await addFood(newFood);
    setFoods((prev) => [...prev, newFood]);
  }, []);

  const update = useCallback(async (food: FoodItem) => {
    await updateFood(food);
    setFoods((prev) => prev.map((f) => (f.id === food.id ? food : f)));
  }, []);

  const remove = useCallback(async (id: string, markAsWaste = false) => {
    if (markAsWaste) {
      const food = foods.find((f) => f.id === id);
      if (food) {
        const record: WasteRecord = {
          id: generateId(),
          foodName: food.name,
          category: food.category,
          wastedAt: new Date().toISOString(),
        };
        await addWasteRecord(record);
        setWasteRecords((prev) => [...prev, record]);
      }
    }
    await deleteFood(id);
    setFoods((prev) => prev.filter((f) => f.id !== id));
  }, [foods]);

  const refresh = useCallback(async () => {
    const [f, w] = await Promise.all([getFoods(), getWasteRecords()]);
    setFoods(f);
    setWasteRecords(w);
  }, []);

  return { foods, wasteRecords, loading, add, update, remove, refresh };
}
