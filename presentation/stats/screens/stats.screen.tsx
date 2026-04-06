import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/application/hooks/use-colors";
import { useStatsViewModel } from "@/presentation/stats/hooks";
import {
    StatsHealthScore,
    StatsStatusBreakdown,
    StatsCategoryBreakdown,
    StatsWasteSection,
    StatsTips,
} from "../components";

export const StatsScreen = () => {
    const colors = useColors();
    const { stats, wasteByCategory, healthScore, wasteRecords } = useStatsViewModel();

    return (
        <ScreenContainer>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={[styles.title, { color: colors.foreground }]}>Estadísticas</Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>Estado de tu nevera</Text>

                <StatsHealthScore healthScore={healthScore} colors={colors} />

                <StatsStatusBreakdown
                    fresh={stats.fresh}
                    warning={stats.warning}
                    expired={stats.expired}
                    colors={colors}
                />

                <StatsCategoryBreakdown
                    categoryEntries={stats.categoryEntries}
                    total={stats.total}
                    colors={colors}
                />

                <StatsWasteSection
                    wasteRecords={wasteRecords}
                    wasteByCategory={wasteByCategory}
                    colors={colors}
                />

                <StatsTips colors={colors} />
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
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
        marginBottom: 16,
    },
});
