import { FoodItem } from "@/domain/foods/entities";

export interface FoodRepository {
    getFoods(): Promise<FoodItem[]>;
    saveFoods(foods: FoodItem[]): Promise<void>;
    addFood(food: FoodItem): Promise<void>;
    updateFood(food: FoodItem): Promise<void>;
    deleteFood(foodId: string): Promise<void>;
}