import { ShoppingItem } from "@/domain/shopping/entities";
import { ShoppingRepository } from "@/domain/shopping/repositories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "@/shared/constants/keys";

export class ShoppingImplRepository implements ShoppingRepository {
    async getShoppingItems(): Promise<ShoppingItem[]> {
        const raw = await AsyncStorage.getItem(KEYS.SHOPPING);
        return raw ? JSON.parse(raw) : [];
    }
    async addShoppingItem(item: ShoppingItem): Promise<void> {
        const items = await this.getShoppingItems();
        items.push(item);
        await AsyncStorage.setItem(KEYS.SHOPPING, JSON.stringify(items));
    }
    async updateShoppingItem(item: ShoppingItem): Promise<void> {
        const items = await this.getShoppingItems();
        const idx = items.findIndex((i) => i.id === item.id);
        if (idx !== -1) {
            items[idx] = item;
            await AsyncStorage.setItem(KEYS.SHOPPING, JSON.stringify(items));
        }
    }
    async deleteShoppingItem(itemId: string): Promise<void> {
        const items = await this.getShoppingItems();
        await AsyncStorage.setItem(KEYS.SHOPPING, JSON.stringify(items.filter((i) => i.id !== itemId)));
    }

    async toggleShoppingItem(id: string): Promise<void> {
        const items = await this.getShoppingItems();
        const idx = items.findIndex((i) => i.id === id);
        if (idx !== -1) items[idx].completed = !items[idx].completed;
        await this.saveShoppingItems(items);
    }
    async saveShoppingItems(items: ShoppingItem[]): Promise<void> {
        await AsyncStorage.setItem(KEYS.SHOPPING, JSON.stringify(items));
    }
    async clearCompletedShoppingItems(): Promise<void> {
        const items = await this.getShoppingItems();
        await AsyncStorage.setItem(KEYS.SHOPPING, JSON.stringify(items.filter((i) => !i.completed)));
    }
}