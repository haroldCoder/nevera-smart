import React from 'react'
import { ScrollView, StyleSheet, Text, Pressable } from 'react-native'
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/domain/foods/constants'
import { FoodCategory } from '@/domain/foods/types'
import { FilterCategory } from '@/presentation/home/types';
import { ThemeColorPalette } from '@/shared/constants/theme';

interface Props {
    colors: ThemeColorPalette;
    categories: FilterCategory[];
    filter: FilterCategory;
    setFilter: (filter: FilterCategory) => void;
}

export const CategoryFilters = ({ colors, categories, filter, setFilter }: Props) => {
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
                            styles.filterText,
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

const styles = StyleSheet.create({
    filterRow: {
        marginBottom: 16,
    },
    filterChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
    filterIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    filterText: {
        fontSize: 13,
        fontWeight: "500",
        lineHeight: 18,
    },
});
