import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemeColorPalette } from '@/shared/constants/theme';

interface Props {
    freshCount: number;
    warningCount: number;
    expiredCount: number;
    colors: ThemeColorPalette;
}

export const StatsRow = ({ freshCount, warningCount, expiredCount, colors }: Props) => {
    return (
        <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: "#2ECC7115", borderColor: "#2ECC7140" }]}>
                <Text style={[styles.statNumber, { color: "#2ECC71" }]}>{freshCount}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>frescos</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#F39C1215", borderColor: "#F39C1240" }]}>
                <Text style={[styles.statNumber, { color: "#F39C12" }]}>{warningCount}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>por vencer</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#E74C3C15", borderColor: "#E74C3C40" }]}>
                <Text style={[styles.statNumber, { color: "#E74C3C" }]}>{expiredCount}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>vencidos</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "800",
        lineHeight: 28,
    },
    statLabel: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 2,
    },
});
