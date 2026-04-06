import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";

interface Props {
    colors: ThemeColorPalette;
}

export const StatsTips = ({ colors }: Props) => {
    return (
        <View style={[styles.section, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>💡 Consejos</Text>
            {[
                "Revisa tu nevera antes de ir al supermercado.",
                "Coloca los alimentos más antiguos al frente.",
                "Congela lo que no vayas a usar pronto.",
                "Planifica tus comidas semanalmente.",
            ].map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                    <View style={[styles.tipDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.tipText, { color: colors.foreground }]}>{tip}</Text>
                </View>
            ))}
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
    tipRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
        gap: 10,
    },
    tipDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 7,
        flexShrink: 0,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});
