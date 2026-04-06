import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ShoppingItem } from "@/domain/shopping/entities/shopping-item.entity";
import { ThemeColorPalette } from "@/shared/constants/theme";

interface Props {
    item: ShoppingItem;
    colors: ThemeColorPalette;
    onToggle: (id: string) => void;
    onLongPress: (id: string, name: string) => void;
}

export const ShoppingListItem = ({ item, colors, onToggle, onLongPress }: Props) => {
    return (
        <Pressable
            onPress={() => onToggle(item.id)}
            onLongPress={() => onLongPress(item.id, item.name)}
            style={({ pressed }) => [
                styles.listItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
                item.completed && { opacity: 0.5 },
                pressed && { opacity: 0.7 },
            ]}
        >
            <View
                style={[
                    styles.checkbox,
                    {
                        borderColor: item.completed ? colors.primary : colors.border,
                        backgroundColor: item.completed ? colors.primary : "transparent",
                    },
                ]}
            >
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text
                style={[
                    styles.itemText,
                    { color: colors.foreground },
                    item.completed && styles.strikethrough,
                ]}
            >
                {item.name}
            </Text>
            {item.suggested && (
                <View style={[styles.suggestedBadge, { backgroundColor: "#F39C1220" }]}>
                    <Text style={[styles.suggestedBadgeText, { color: "#F39C12" }]}>💡</Text>
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 8,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    checkmark: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 16,
    },
    itemText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 20,
    },
    strikethrough: {
        textDecorationLine: "line-through",
    },
    suggestedBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    suggestedBadgeText: {
        fontSize: 12,
        lineHeight: 17,
    },
});
