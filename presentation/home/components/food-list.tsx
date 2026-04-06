import { FlatList, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { FoodCard } from '@/components/food-card'
import { CATEGORY_LABELS } from '@/domain/foods/constants'
import { FoodCategory } from '@/domain/foods/types'

interface Props {
    styles: any;
    colors: any;
    filteredFoods: any[];
    handleLongPress: (food: any) => void;
    filter: string;
}

export const FoodList = ({ styles, colors, filteredFoods, handleLongPress, filter }: Props) => {
    return (
        /*<FlatList
            data={filteredFoods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <FoodCard
                    key={item.id}
                    food={item}
                    onPress={() => handleLongPress(item)}
                />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyIcon, { color: colors.muted }]}>🗑️</Text>
                    <Text style={[styles.emptyText, { color: colors.muted }]}>
                        Tu nevera está vacía
                    </Text>
                </View>
            }
        />*/
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