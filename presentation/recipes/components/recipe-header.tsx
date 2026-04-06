import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";

interface Props {
    colors: ThemeColorPalette;
    canMakeCount: number;
}

export const RecipeHeader = ({ colors, canMakeCount }: Props) => {
    return (
        <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>Recetas</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
                Basadas en lo que tienes en casa
            </Text>
            {canMakeCount > 0 && (
                <View style={[styles.banner, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}>
                    <Text style={[styles.bannerText, { color: colors.primary }]}>
                        🍽️ Puedes preparar {canMakeCount} receta{canMakeCount > 1 ? "s" : ""} ahora mismo
                    </Text>
                </View>
            )}
            {canMakeCount > 0 && (
                <Text style={[styles.sectionLabel, { color: colors.foreground }]}>✅ Listas para preparar</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 8,
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
        marginBottom: 12,
    },
    banner: {
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
    },
    bannerText: {
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 20,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 22,
        marginBottom: 10,
    },
});
