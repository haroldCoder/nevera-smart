import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";
import { Recipe } from "../types/recipe.type";

interface Props {
    recipe: Recipe;
    colors: ThemeColorPalette;
    onPress: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, colors, onPress }: Props) => {
    const difficultyColor = (d: string) =>
        d === "Fácil" ? "#2ECC71" : d === "Medio" ? "#F39C12" : "#E74C3C";

    return (
        <Pressable
            onPress={() => onPress(recipe)}
            style={({ pressed }) => [
                styles.recipeCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && { opacity: 0.75 },
            ]}
        >
            <Text style={styles.recipeEmoji}>{recipe.emoji}</Text>
            <View style={styles.recipeInfo}>
                <Text style={[styles.recipeName, { color: colors.foreground }]}>{recipe.name}</Text>
                <View style={styles.recipeMeta}>
                    <Text style={[styles.recipeTime, { color: colors.muted }]}>⏱ {recipe.time}</Text>
                    <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor(recipe.difficulty) + "20" }]}>
                        <Text style={[styles.difficultyText, { color: difficultyColor(recipe.difficulty) }]}>
                            {recipe.difficulty}
                        </Text>
                    </View>
                </View>
                {recipe.matchedIngredients.length > 0 && (
                    <Text style={[styles.matchText, { color: colors.primary }]}>
                        ✓ Tienes: {recipe.matchedIngredients.join(", ")}
                    </Text>
                )}
            </View>
            <View style={[styles.matchBadge, {
                backgroundColor: recipe.matchedIngredients.length >= 2 ? colors.primary + "20" : colors.surface,
                borderColor: recipe.matchedIngredients.length >= 2 ? colors.primary : colors.border,
            }]}>
                <Text style={[styles.matchCount, {
                    color: recipe.matchedIngredients.length >= 2 ? colors.primary : colors.muted,
                }]}>
                    {recipe.matchedIngredients.length}/{recipe.ingredients.length}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    recipeCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 8,
    },
    recipeEmoji: {
        fontSize: 36,
        marginRight: 12,
    },
    recipeInfo: {
        flex: 1,
    },
    recipeName: {
        fontSize: 15,
        fontWeight: "700",
        lineHeight: 20,
    },
    recipeMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
    },
    recipeTime: {
        fontSize: 12,
        lineHeight: 17,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: "600",
        lineHeight: 16,
    },
    matchText: {
        fontSize: 11,
        lineHeight: 16,
        marginTop: 4,
        fontWeight: "500",
    },
    matchBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        minWidth: 44,
    },
    matchCount: {
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 17,
    },
});
