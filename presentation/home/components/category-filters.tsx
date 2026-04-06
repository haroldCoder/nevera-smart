import React from 'react'
import { ScrollView, Text, Pressable } from 'react-native'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/domain/foods/constants'
import { FoodCategory } from '@/domain/foods/types'
import { FilterCategory } from '@/presentation/home/types';

interface Props {
    styles: any;
    colors: any;
    categories: FilterCategory[];
    filter: FilterCategory;
    setFilter: (filter: FilterCategory) => void;
}

export const CategoryFilters = ({ styles, colors, categories, filter, setFilter }: Props) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {categories.map((cat) => (
                <Pressable
                    key={cat}
                    onPress={() => setFilter(cat)}
                    style={[
                        styles.filterChip,
                        {
                            backgroundColor: filter === cat ? colors.primary : colors.surface,
                            borderColor: filter === cat ? colors.primary : colors.border,
                        },
                    ]}
                >
                    {cat !== "todos" && (
                        <Text style={styles.filterIcon}>{CATEGORY_ICONS[cat as FoodCategory]}</Text>
                    )}
                    <Text
                        style={[
                            styles.filterLabel,
                            { color: filter === cat ? "#fff" : colors.muted },
                        ]}
                    >
                        {cat === "todos" ? "📦 Todos" : CATEGORY_LABELS[cat as FoodCategory]}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    )
}
