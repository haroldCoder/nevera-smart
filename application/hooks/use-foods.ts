import { useState, useEffect, useCallback } from "react";
import { FoodItem, WasteRecord } from "@/domain/foods/entities";
import { DEMO_FOODS } from "@/infrastructure/foods/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateId } from "@shared/helpers"
import { useRepositories } from "@/application/hooks/use-repositories";

const INITIALIZED_KEY = "nevera_smart_initialized";

export function useFoods() {
  const { foodRepository, wasteRepository } = useRepositories();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
      if (!initialized) {
        await foodRepository.saveFoods(DEMO_FOODS);
        await AsyncStorage.setItem(INITIALIZED_KEY, "true");
      }
      const [f, w] = await Promise.all([foodRepository.getFoods(), wasteRepository.getWasteRecords()]);
      setFoods(f);
      setWasteRecords(w);
    } finally {
      setLoading(false);
    }
  }, [foodRepository, wasteRepository]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (food: Omit<FoodItem, "id" | "addedAt">) => {
    const newFood: FoodItem = {
      ...food,
      id: generateId(),
      addedAt: new Date().toISOString(),
    };
    await foodRepository.addFood(newFood);
    setFoods((prev) => [...prev, newFood]);
  }, [foodRepository]);

  const update = useCallback(async (food: FoodItem) => {
    await foodRepository.updateFood(food);
    setFoods((prev) => prev.map((f) => (f.id === food.id ? food : f)));
  }, [foodRepository]);

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
        await wasteRepository.addWasteRecord(record);
        setWasteRecords((prev) => [...prev, record]);
      }
    }
    await foodRepository.deleteFood(id);
    setFoods((prev) => prev.filter((f) => f.id !== id));
  }, [foods, foodRepository, wasteRepository]);

  const refresh = useCallback(async () => {
    const [f, w] = await Promise.all([foodRepository.getFoods(), wasteRepository.getWasteRecords()]);
    setFoods(f);
    setWasteRecords(w);
  }, [foodRepository, wasteRepository]);

  return { foods, wasteRecords, loading, add, update, remove, refresh };
}
