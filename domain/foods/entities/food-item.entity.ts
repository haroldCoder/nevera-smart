import { FoodCategory, FoodLocation } from "../types";

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