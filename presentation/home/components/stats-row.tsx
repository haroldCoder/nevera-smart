import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface Props {
    freshCount: number;
    warningCount: number;
    expiredCount: number;
    colors: any;
    styles: any;
}

export const StatsRow = ({ freshCount, warningCount, expiredCount, colors, styles }: Props) => {
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
