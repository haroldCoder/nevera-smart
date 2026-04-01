import { BarcodeRepositoryImpl } from "@/infrastructure/barcode/repositories";
import { NotificationsRepositoryImpl } from "@/infrastructure/notifications/repositories";
import { ShoppingImplRepository } from "@/infrastructure/shopping/repositories/shopping-impl.repositories";
import { FoodImplRepository, WasteImplRepository } from "@/infrastructure/foods/repositories";
import { AuthImplRepository, AuthStorageImplRepository } from "@/infrastructure/auth/repositories";

export class DiFactory {
    static createBarcodeRepository() {
        return new BarcodeRepositoryImpl();
    }

    static createNotificationRepository() {
        return new NotificationsRepositoryImpl();
    }

    static createShoppingRepository() {
        return new ShoppingImplRepository();
    }

    static createFoodRepository() {
        return new FoodImplRepository();
    }

    static createWasteRepository() {
        return new WasteImplRepository();
    }

    static createAuthRepository() {
        return new AuthImplRepository(this.createAuthStorageRepository());
    }

    static createAuthStorageRepository() {
        return new AuthStorageImplRepository();
    }
}