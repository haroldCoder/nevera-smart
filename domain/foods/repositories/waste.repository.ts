import { WasteRecord } from "@/domain/foods/entities";

export interface WasteRepository {
    getWasteRecords(): Promise<WasteRecord[]>;
    addWasteRecord(record: WasteRecord): Promise<void>;
}