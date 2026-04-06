import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FoodCard } from '@/components/food-card'
import { CATEGORY_LABELS } from '@/domain/foods/constants'
import { FoodCategory } from '@/domain/foods/types'
import { ThemeColorPalette } from '@/shared/constants/theme';
import { FoodItem } from '@/domain/foods/entities';

interface Props {
    colors: ThemeColorPalette;
    filteredFoods: FoodItem[];
    handleLongPress: (food: FoodItem) => void;
    filter: string;
}

export const FoodList = ({ colors, filteredFoods, handleLongPress, filter }: Props) => {
    return (
        <View style={styles.section}>
            {filteredFoods.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={styles.emptyIcon}>🥗</Text>
                    <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                        {filter === "todos" ? "Tu nevera está vacía" : `Sin ${CATEGORY_LABELS[filter as FoodCategory]}`}
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
                        Toca el botón + para agregar alimentos
                    </Text>
                </View>
            ) : (
                filteredFoods.map((food) => (
                    <FoodCard
                        key={food.id}
                        food={food}
                        onPress={() => handleLongPress(food)}
                    />
                ))
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 8,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 40,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: "dashed",
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "600",
        lineHeight: 22,
    },
    emptySubtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 4,
    },
});