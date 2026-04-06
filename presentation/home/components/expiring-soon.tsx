import { FoodCard } from '@/components/food-card';
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ThemeColorPalette } from '@/shared/constants/theme';
import { FoodItem } from '@/domain/foods/entities';

interface Props {
    colors: ThemeColorPalette;
    expiringSoon: FoodItem[];
    handleLongPress: (food: FoodItem) => void;
}

export const ExpiringSoon = ({ colors, expiringSoon, handleLongPress }: Props) => {
    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                ⚠️ Próximos a vencer
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                {expiringSoon.map((food: FoodItem) => (
                    <FoodCard
                        key={food.id}
                        food={food}
                        compact
                        onPress={() => handleLongPress(food)}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 10,
        lineHeight: 22,
    },
    horizontalList: {
        marginBottom: 16,
    },
});
