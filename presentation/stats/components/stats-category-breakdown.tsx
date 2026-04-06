import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";
import { FoodCategory } from "@/domain/foods/types";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/domain/foods/constants";
import { CATEGORY_COLORS } from "@/presentation/stats/constants";

interface Props {
    categoryEntries: [FoodCategory, number][];
    total: number;
    colors: ThemeColorPalette;
}

export const StatsCategoryBreakdown = ({ categoryEntries, total, colors }: Props) => {
    if (total === 0) return null;

    return (
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Por categoría</Text>
            {categoryEntries.map(([cat, count]) => {
                const pct = Math.round((count / total) * 100);
                const color = CATEGORY_COLORS[cat];
                return (
                    <View key={cat} style={styles.barRow}>
                        <Text style={styles.barIcon}>{CATEGORY_ICONS[cat]}</Text>
                        <View style={styles.barInfo}>
                            <View style={styles.barHeader}>
                                <Text style={[styles.barLabel, { color: colors.foreground }]}>
                                    {CATEGORY_LABELS[cat]}
                                </Text>
                                <Text style={[styles.barCount, { color: colors.muted }]}>{count}</Text>
                            </View>
                            <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                                <View
                                    style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: color }]}
                                />
                            </View>
                        </View>
                    </View>
                );
            })}
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
    barRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },
    barIcon: {
        fontSize: 20,
        width: 28,
        textAlign: "center",
    },
    barInfo: {
        flex: 1,
    },
    barHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    barLabel: {
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 18,
    },
    barCount: {
        fontSize: 13,
        lineHeight: 18,
    },
    barTrack: {
        height: 6,
        borderRadius: 3,
        overflow: "hidden",
    },
    barFill: {
        height: 6,
        borderRadius: 3,
    },
});
