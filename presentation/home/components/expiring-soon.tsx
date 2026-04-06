import { FoodCard } from '@/components/food-card';
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

interface Props {
    styles: any;
    colors: any;
    expiringSoon: any[];
    handleLongPress: (food: any) => void;
}

export const ExpiringSoon = ({ styles, colors, expiringSoon, handleLongPress }: Props) => {
    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                ⚠️ Próximos a vencer
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                {expiringSoon.map((food) => (
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
