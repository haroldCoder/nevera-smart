import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";

interface Props {
    fresh: number;
    warning: number;
    expired: number;
    colors: ThemeColorPalette;
}

export const StatsStatusBreakdown = ({ fresh, warning, expired, colors }: Props) => {
    return (
        <View style={styles.row}>
            <View style={[styles.miniCard, { backgroundColor: "#2ECC7115", borderColor: "#2ECC7140" }]}>
                <Text style={[styles.miniNumber, { color: "#2ECC71" }]}>{fresh}</Text>
                <Text style={[styles.miniLabel, { color: colors.muted }]}>Frescos</Text>
            </View>
            <View style={[styles.miniCard, { backgroundColor: "#F39C1215", borderColor: "#F39C1240" }]}>
                <Text style={[styles.miniNumber, { color: "#F39C12" }]}>{warning}</Text>
                <Text style={[styles.miniLabel, { color: colors.muted }]}>Por vencer</Text>
            </View>
            <View style={[styles.miniCard, { backgroundColor: "#E74C3C15", borderColor: "#E74C3C40" }]}>
                <Text style={[styles.miniNumber, { color: "#E74C3C" }]}>{expired}</Text>
                <Text style={[styles.miniLabel, { color: colors.muted }]}>Vencidos</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },
    miniCard: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    miniNumber: {
        fontSize: 24,
        fontWeight: "800",
        lineHeight: 30,
    },
    miniLabel: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 2,
    },
});
