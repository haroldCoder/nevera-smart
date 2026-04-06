import { useMemo } from "react";
import { useFoods } from "@/application/hooks/use-foods";
import { FoodCategory } from "@/domain/foods/types";
import { getDaysUntilExpiry, getExpiryStatus } from "@shared/helpers";

export const useStatsViewModel = () => {
    const { foods, wasteRecords } = useFoods();

    const stats = useMemo(() => {
        const byCategory: Record<FoodCategory, number> = {
            lacteos: 0, frutas: 0, verduras: 0, carnes: 0, granos: 0, bebidas: 0, otros: 0,
        };
        let fresh = 0, warning = 0, expired = 0;

        foods.forEach((f) => {
            byCategory[f.category]++;
            const status = getExpiryStatus(getDaysUntilExpiry(f.expiryDate));
            if (status === "fresh") fresh++;
            else if (status === "warning") warning++;
            else expired++;
        });

        const total = foods.length;
        const categoryEntries = Object.entries(byCategory)
            .filter(([, count]) => count > 0)
            .sort(([, a], [, b]) => b - a) as [FoodCategory, number][];

        return { byCategory, categoryEntries, total, fresh, warning, expired };
    }, [foods]);

    const wasteByCategory = useMemo(() => {
        const byCategory: Record<FoodCategory, number> = {
            lacteos: 0, frutas: 0, verduras: 0, carnes: 0, granos: 0, bebidas: 0, otros: 0,
        };
        wasteRecords.forEach((r) => {
            byCategory[r.category]++;
        });
        return byCategory;
    }, [wasteRecords]);

    const healthScore = useMemo(() => {
        if (stats.total === 0) return 100;
        return Math.round(((stats.fresh + stats.warning * 0.5) / stats.total) * 100);
    }, [stats]);

    return {
        stats,
        wasteByCategory,
        healthScore,
        wasteRecords,
    };
};
