import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { CATEGORY_ICONS } from "@/domain/foods/constants";
import { FoodItem } from "@/domain/foods/entities/food-item.entity";
import { ThemeColorPalette } from "@/shared/constants/theme";

interface Props {
    colors: ThemeColorPalette;
    suggested: FoodItem[];
    onAdd: (name: string) => void;
}

export const ShoppingListSuggested = ({ colors, suggested, onAdd }: Props) => {
    if (suggested.length === 0) return null;

    return (
        <View style={styles.suggestedSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                💡 Sugeridos
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
                Basados en alimentos próximos a vencer
            </Text>
            <View style={styles.suggestedList}>
                {suggested.map((food) => (
                    <Pressable
                        key={food.id}
                        onPress={() => onAdd(food.name)}
                        style={[styles.suggestedChip, { backgroundColor: "#F39C1215", borderColor: "#F39C1240" }]}
                    >
                        <Text style={styles.suggestedIcon}>{CATEGORY_ICONS[food.category]}</Text>
                        <Text style={[styles.suggestedText, { color: colors.foreground }]}>{food.name}</Text>
                        <Text style={[styles.suggestedAdd, { color: "#F39C12" }]}>+ Agregar</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    suggestedSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        lineHeight: 22,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 10,
    },
    suggestedList: {
        gap: 8,
    },
    suggestedChip: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    suggestedIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    suggestedText: {
        flex: 1,
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 20,
    },
    suggestedAdd: {
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 18,
    },
});
