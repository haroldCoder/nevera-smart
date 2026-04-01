import { ShoppingItem } from "@/domain/shopping/entities";

export interface ShoppingRepository {
    getShoppingItems(): Promise<ShoppingItem[]>;
    addShoppingItem(item: ShoppingItem): Promise<void>;
    updateShoppingItem(item: ShoppingItem): Promise<void>;
    deleteShoppingItem(itemId: string): Promise<void>;
    toggleShoppingItem(id: string): Promise<void>;
    saveShoppingItems(items: ShoppingItem[]): Promise<void>;
    clearCompletedShoppingItems(): Promise<void>;
}