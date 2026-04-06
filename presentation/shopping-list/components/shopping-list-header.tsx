import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";

interface Props {
    colors: ThemeColorPalette;
    pendingCount: number;
    completedItemsCount: number;
    onClearCompleted: () => void;
}

export const ShoppingListHeader = ({ colors, pendingCount, completedItemsCount, onClearCompleted }: Props) => {
    return (
        <View style={styles.header}>
            <View>
                <Text style={[styles.title, { color: colors.foreground }]}>Lista de Compras</Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                    {pendingCount > 0
                        ? `${pendingCount} ítem${pendingCount > 1 ? "s" : ""} pendiente${pendingCount > 1 ? "s" : ""}`
                        : "Todo listo 🎉"}
                </Text>
            </View>
            {completedItemsCount > 0 && (
                <Pressable
                    onPress={onClearCompleted}
                    style={[styles.clearBtn, { borderColor: colors.border }]}
                >
                    <Text style={[styles.clearText, { color: colors.muted }]}>Limpiar</Text>
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        lineHeight: 34,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 2,
    },
    clearBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 6,
    },
    clearText: {
        fontSize: 13,
        fontWeight: "500",
        lineHeight: 18,
    },
});
