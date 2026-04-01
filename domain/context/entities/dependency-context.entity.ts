import { FoodRepository, WasteRepository } from "@/domain/foods/repositories";
import { NotificationsRepository } from "@/domain/notifications";
import { ShoppingRepository } from "@/domain/shopping/repositories";
import { AuthRepository, AuthStorageRepository } from "@/domain/auth/repositories";

export interface DependencyContextType {
    foodRepository: FoodRepository;
    wasteRepository: WasteRepository;
    shoppingRepository: ShoppingRepository;
    notificationsRepository: NotificationsRepository;
    authRepository: AuthRepository;
    authStorageRepository: AuthStorageRepository;
}