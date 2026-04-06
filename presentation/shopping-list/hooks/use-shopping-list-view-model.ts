import { useState, useMemo } from "react";
import { Alert, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useShopping } from "@/application/hooks/use-shopping";
import { useFoods } from "@/application/hooks/use-foods";
import { useColors } from "@/application/hooks/use-colors";
import { getDaysUntilExpiry, getExpiryStatus } from "@shared/helpers";

export const useShoppingListViewModel = () => {
    const colors = useColors();
    const { items, loading, add, toggle, remove, clearCompleted, pendingCount } = useShopping();
    const { foods } = useFoods();
    const [newItem, setNewItem] = useState("");

    const suggested = useMemo(() => {
        const inList = new Set(items.map((i) => i.name.toLowerCase()));
        return foods
            .filter((f) => {
                const days = getDaysUntilExpiry(f.expiryDate);
                const status = getExpiryStatus(days);
                return (status === "expired" || status === "warning") && !inList.has(f.name.toLowerCase());
            })
            .slice(0, 5);
    }, [foods, items]);

    const handleAdd = () => {
        if (!newItem.trim()) return;
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        add(newItem.trim());
        setNewItem("");
    };

    const handleToggle = (id: string) => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        toggle(id);
    };

    const handleRemove = (id: string, name: string) => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        Alert.alert("Eliminar", `¿Eliminar "${name}"?`, [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", style: "destructive", onPress: () => remove(id) },
        ]);
    }

    const handleClearCompleted = () => {
        const completedCount = items.filter((i) => i.completed).length;
        if (completedCount === 0) return;
        Alert.alert(
            "Limpiar completados",
            `¿Eliminar ${completedCount} ítem${completedCount > 1 ? "s" : ""} completado${completedCount > 1 ? "s" : ""}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Limpiar", style: "destructive", onPress: clearCompleted },
            ]
        );
    };

    const pendingItems = useMemo(() => items.filter((i) => !i.completed), [items]);
    const completedItems = useMemo(() => items.filter((i) => i.completed), [items]);

    return {
        colors,
        items,
        loading,
        newItem,
        setNewItem,
        suggested,
        pendingCount,
        completedItemsCount: completedItems.length,
        pendingItems,
        completedItems,
        handleAdd,
        handleToggle,
        handleRemove,
        handleClearCompleted,
        addSuggested: (name: string) => add(name, true),
    };
};
