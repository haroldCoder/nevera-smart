import { FoodItem } from "@/domain/foods/entities";

export interface NotificationsRepository {
    requestPermissions(): Promise<boolean>;
    scheduleExpiryNotification(food: FoodItem): Promise<void>;
    cancelExpiryNotification(foodId: string): Promise<void>;
}