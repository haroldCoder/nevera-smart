import { WasteRecord } from "@/domain/foods/entities";
import { WasteRepository } from "@/domain/foods/repositories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "@/shared/constants/keys";

export class WasteImplRepository implements WasteRepository {
    async getWasteRecords(): Promise<WasteRecord[]> {
        const raw = await AsyncStorage.getItem(KEYS.WASTE);
        return raw ? JSON.parse(raw) : [];
    }
    async addWasteRecord(record: WasteRecord): Promise<void> {
        const records = await this.getWasteRecords();
        records.push(record);
        await AsyncStorage.setItem(KEYS.WASTE, JSON.stringify(records));
    }
}