import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";
import { FoodCategory } from "@/domain/foods/types";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/domain/foods/constants";

interface Props {
    wasteRecords: any[];
    wasteByCategory: Record<FoodCategory, number>;
    colors: ThemeColorPalette;
}

export const StatsWasteSection = ({ wasteRecords, wasteByCategory, colors }: Props) => {
    return (
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Desperdicio registrado</Text>
            {wasteRecords.length === 0 ? (
                <View style={styles.noWaste}>
                    <Text style={styles.noWasteIcon}>🌱</Text>
                    <Text style={[styles.noWasteText, { color: colors.foreground }]}>
                        ¡Sin desperdicios registrados!
                    </Text>
                    <Text style={[styles.noWasteSubtext, { color: colors.muted }]}>
                        Sigue así, estás cuidando el planeta.
                    </Text>
                </View>
            ) : (
                <>
                    <View style={styles.wasteTotal}>
                        <Text style={[styles.wasteTotalNumber, { color: "#E74C3C" }]}>{wasteRecords.length}</Text>
                        <Text style={[styles.wasteTotalLabel, { color: colors.muted }]}>
                            alimento{wasteRecords.length > 1 ? "s" : ""} desperdiciado{wasteRecords.length > 1 ? "s" : ""}
                        </Text>
                    </View>
                    {(Object.entries(wasteByCategory) as [FoodCategory, number][])
                        .filter(([, count]) => count > 0)
                        .sort(([, a], [, b]) => b - a)
                        .map(([cat, count]) => (
                            <View key={cat} style={[styles.wasteRow, { borderColor: colors.border }]}>
                                <Text style={styles.barIcon}>{CATEGORY_ICONS[cat]}</Text>
                                <Text style={[styles.barLabel, { color: colors.foreground, flex: 1 }]}>
                                    {CATEGORY_LABELS[cat]}
                                </Text>
                                <View style={[styles.wasteBadge, { backgroundColor: "#E74C3C20" }]}>
                                    <Text style={[styles.wasteBadgeText, { color: "#E74C3C" }]}>{count}</Text>
                                </View>
                            </View>
                        ))}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 22,
        marginBottom: 12,
    },
    noWaste: {
        alignItems: "center",
        paddingVertical: 16,
    },
    noWasteIcon: {
        fontSize: 36,
        marginBottom: 8,
    },
    noWasteText: {
        fontSize: 15,
        fontWeight: "600",
        lineHeight: 20,
    },
    noWasteSubtext: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: 4,
        textAlign: "center",
    },
    wasteTotal: {
        alignItems: "center",
        marginBottom: 12,
    },
    wasteTotalNumber: {
        fontSize: 36,
        fontWeight: "800",
        lineHeight: 44,
    },
    wasteTotalLabel: {
        fontSize: 13,
        lineHeight: 18,
    },
    wasteRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        gap: 10,
    },
    barIcon: {
        fontSize: 20,
        width: 28,
        textAlign: "center",
    },
    barLabel: {
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 18,
    },
    wasteBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    wasteBadgeText: {
        fontSize: 13,
        fontWeight: "700",
        lineHeight: 18,
    },
});
