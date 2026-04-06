import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";

interface Props {
    healthScore: number;
    colors: ThemeColorPalette;
}

export const StatsHealthScore = ({ healthScore, colors }: Props) => {
    const scoreColor = healthScore >= 70 ? "#2ECC71" : healthScore >= 40 ? "#F39C12" : "#E74C3C";
    const scoreEmoji = healthScore >= 70 ? "🌟" : healthScore >= 40 ? "⚠️" : "🔴";

    return (
        <View style={[styles.scoreCard, { backgroundColor: scoreColor + "15", borderColor: scoreColor + "40" }]}>
            <View style={styles.scoreLeft}>
                <Text style={[styles.scoreTitle, { color: colors.foreground }]}>Salud de tu nevera</Text>
                <Text style={[styles.scoreSubtitle, { color: colors.muted }]}>
                    {healthScore >= 70 ? "¡Excelente! Tus alimentos están frescos." :
                        healthScore >= 40 ? "Atención: algunos alimentos por vencer." :
                            "Alerta: revisa tus alimentos urgente."}
                </Text>
            </View>
            <View style={styles.scoreRight}>
                <Text style={styles.scoreEmoji}>{scoreEmoji}</Text>
                <Text style={[styles.scoreValue, { color: scoreColor }]}>{healthScore}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scoreCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    scoreLeft: {
        flex: 1,
        marginRight: 12,
    },
    scoreTitle: {
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 22,
    },
    scoreSubtitle: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: 4,
    },
    scoreRight: {
        alignItems: "center",
    },
    scoreEmoji: {
        fontSize: 28,
    },
    scoreValue: {
        fontSize: 22,
        fontWeight: "800",
        lineHeight: 28,
    },
});
