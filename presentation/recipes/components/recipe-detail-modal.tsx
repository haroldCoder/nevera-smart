import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";
import { Recipe } from "../types/recipe.type";

interface Props {
    recipe: Recipe | null;
    colors: ThemeColorPalette;
    onClose: () => void;
}

export const RecipeDetailModal = ({ recipe, colors, onClose }: Props) => {
    if (!recipe) return null;

    const difficultyColor = (d: string) =>
        d === "Fácil" ? "#2ECC71" : d === "Medio" ? "#F39C12" : "#E74C3C";

    return (
        <Modal visible={!!recipe} animationType="slide" transparent presentationStyle="overFullScreen">
            <View style={styles.modalOverlay}>
                <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
                    <View style={[styles.handle, { backgroundColor: colors.border }]} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalEmoji}>{recipe.emoji}</Text>
                        <Text style={[styles.modalTitle, { color: colors.foreground }]}>{recipe.name}</Text>
                        <View style={styles.modalMeta}>
                            <Text style={[styles.recipeTime, { color: colors.muted }]}>⏱ {recipe.time}</Text>
                            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor(recipe.difficulty) + "20" }]}>
                                <Text style={[styles.difficultyText, { color: difficultyColor(recipe.difficulty) }]}>
                                    {recipe.difficulty}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.modalSectionTitle, { color: colors.foreground }]}>Ingredientes</Text>
                        {recipe.ingredients.map((ing, i) => {
                            const have = recipe.matchedIngredients.includes(ing);
                            return (
                                <View key={i} style={[styles.ingredientRow, { borderColor: colors.border }]}>
                                    <Text style={{ color: have ? colors.primary : colors.muted, fontSize: 16 }}>
                                        {have ? "✓" : "○"}
                                    </Text>
                                    <Text style={[styles.ingredientText, { color: have ? colors.foreground : colors.muted }]}>
                                        {ing.charAt(0).toUpperCase() + ing.slice(1)}
                                    </Text>
                                    {have && (
                                        <View style={[styles.haveBadge, { backgroundColor: colors.primary + "20" }]}>
                                            <Text style={[styles.haveText, { color: colors.primary }]}>Tienes</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}

                        <Text style={[styles.modalSectionTitle, { color: colors.foreground }]}>Preparación</Text>
                        {recipe.steps.map((step, i) => (
                            <View key={i} style={styles.stepRow}>
                                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                                </View>
                                <Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text>
                            </View>
                        ))}

                        <View style={{ height: 32 }} />
                    </ScrollView>
                    <Pressable
                        onPress={onClose}
                        style={[styles.closeBtn, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.closeBtnText}>Cerrar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    modalSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 32,
        maxHeight: "90%",
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 16,
    },
    modalEmoji: {
        fontSize: 56,
        textAlign: "center",
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        textAlign: "center",
        lineHeight: 28,
        marginBottom: 8,
    },
    modalMeta: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20,
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
    modalSectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        lineHeight: 22,
        marginBottom: 10,
        marginTop: 8,
    },
    ingredientRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        gap: 10,
    },
    ingredientText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 20,
    },
    haveBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    haveText: {
        fontSize: 11,
        fontWeight: "600",
        lineHeight: 16,
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
        gap: 12,
    },
    stepNumber: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    stepNumberText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
        lineHeight: 18,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 21,
    },
    closeBtn: {
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 8,
    },
    closeBtnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
        lineHeight: 20,
    },
});
