import { FoodCategory } from "@/domain/foods/types";

export interface WasteRecord {
    id: string;
    foodName: string;
    category: FoodCategory;
    wastedAt: string;
}