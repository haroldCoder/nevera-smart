import { FoodItem } from "@/domain/foods/entities";
import { FoodRepository } from "@/domain/foods/repositories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "@/shared/constants/keys";

export class FoodImplRepository implements FoodRepository {
    async getFoods(): Promise<FoodItem[]> {
        const raw = await AsyncStorage.getItem(KEYS.FOODS);
        return raw ? JSON.parse(raw) : [];
    }
    async saveFoods(foods: FoodItem[]): Promise<void> {
        await AsyncStorage.setItem(KEYS.FOODS, JSON.stringify(foods));
    }
    async addFood(food: FoodItem): Promise<void> {
        const foods = await this.getFoods();
        foods.push(food);
        await AsyncStorage.setItem(KEYS.FOODS, JSON.stringify(foods));
    }
    async updateFood(food: FoodItem): Promise<void> {
        const foods = await this.getFoods();
        const idx = foods.findIndex((f) => f.id === food.id);
        if (idx !== -1) {
            foods[idx] = food;
            await AsyncStorage.setItem(KEYS.FOODS, JSON.stringify(foods));
        }
    }
    async deleteFood(foodId: string): Promise<void> {
        const foods = await this.getFoods();
        await AsyncStorage.setItem(KEYS.FOODS, JSON.stringify(foods.filter((f) => f.id !== foodId)));
    }
}