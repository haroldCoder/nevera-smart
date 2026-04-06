import React from 'react'
import { Text, View } from 'react-native'

interface Props {
    styles: any;
    colors: any;
    foods: any[];
}

export const Header = ({ styles, colors, foods }: Props) => {
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
