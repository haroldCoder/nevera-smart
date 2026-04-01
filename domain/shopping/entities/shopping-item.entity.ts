import { FoodCategory } from "@/domain/foods/types";

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
