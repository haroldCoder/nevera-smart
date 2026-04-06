import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ThemeColorPalette } from '@/shared/constants/theme';

interface Props {
    colors: ThemeColorPalette;
    foods: any[];
}

export const Header = ({ colors, foods }: Props) => {
    return (
        <View style={styles.header}>
            <View>
                <Text style={[styles.greeting, { color: colors.muted }]}>Hola 👋</Text>
                <Text style={[styles.title, { color: colors.foreground }]}>Mi Nevera</Text>
            </View>
            <View style={[styles.summaryBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.summaryCount, { color: colors.foreground }]}>{foods.length}</Text>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>alimentos</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    greeting: {
        fontSize: 14,
        lineHeight: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        lineHeight: 34,
    },
    summaryBadge: {
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 14,
        borderWidth: 1,
    },
    summaryCount: {
        fontSize: 22,
        fontWeight: "800",
        lineHeight: 28,
    },
    summaryLabel: {
        fontSize: 11,
        lineHeight: 15,
    },
});
