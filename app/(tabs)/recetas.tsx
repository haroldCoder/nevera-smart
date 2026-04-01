import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFoods } from "@/application/hooks/use-foods";
import { FoodItem, CATEGORY_ICONS } from "@/lib/store";
import { useColors } from "@/application/hooks/use-colors";

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  time: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  ingredients: string[];
  steps: string[];
  matchedIngredients: string[];
}

const ALL_RECIPES: Omit<Recipe, "matchedIngredients">[] = [
  {
    id: "1",
    name: "Omelette de espinacas",
    emoji: "🍳",
    time: "10 min",
    difficulty: "Fácil",
    ingredients: ["huevos", "espinacas", "queso", "sal", "aceite"],
    steps: [
      "Bate 2-3 huevos con sal y pimienta.",
      "Calienta aceite en una sartén a fuego medio.",
      "Agrega las espinacas y saltea 1 minuto.",
      "Vierte los huevos y cocina hasta que cuajen.",
      "Agrega el queso rallado, dobla y sirve.",
    ],
  },
  {
    id: "2",
    name: "Arroz con pollo",
    emoji: "🍗",
    time: "35 min",
    difficulty: "Medio",
    ingredients: ["arroz", "pollo", "zanahorias", "sal", "aceite"],
    steps: [
      "Corta el pollo en trozos y sazona con sal.",
      "Dora el pollo en aceite caliente, 5 min por lado.",
      "Agrega las zanahorias cortadas en cubos.",
      "Incorpora el arroz lavado y cubre con agua (doble volumen).",
      "Cocina a fuego bajo 20 minutos con tapa.",
    ],
  },
  {
    id: "3",
    name: "Batido verde energético",
    emoji: "🥤",
    time: "5 min",
    difficulty: "Fácil",
    ingredients: ["espinacas", "manzanas", "leche", "yogur"],
    steps: [
      "Lava las espinacas y la manzana.",
      "Corta la manzana en trozos (sin semillas).",
      "Coloca todos los ingredientes en la licuadora.",
      "Licúa por 1 minuto hasta obtener una mezcla homogénea.",
      "Sirve frío y disfruta.",
    ],
  },
  {
    id: "4",
    name: "Ensalada de zanahorias",
    emoji: "🥗",
    time: "10 min",
    difficulty: "Fácil",
    ingredients: ["zanahorias", "manzanas", "yogur", "sal"],
    steps: [
      "Ralla las zanahorias y corta la manzana en cubos.",
      "Mezcla en un bowl con el yogur.",
      "Sazona con sal y unas gotas de limón.",
      "Refrigera 10 minutos antes de servir.",
    ],
  },
  {
    id: "5",
    name: "Yogur con frutas",
    emoji: "🍓",
    time: "3 min",
    difficulty: "Fácil",
    ingredients: ["yogur", "manzanas", "frutas"],
    steps: [
      "Corta las frutas en trozos pequeños.",
      "Coloca el yogur en un bowl.",
      "Agrega las frutas encima.",
      "Opcional: añade granola o miel.",
    ],
  },
  {
    id: "6",
    name: "Sopa de verduras",
    emoji: "🍲",
    time: "25 min",
    difficulty: "Fácil",
    ingredients: ["zanahorias", "espinacas", "sal", "aceite"],
    steps: [
      "Corta las zanahorias en rodajas.",
      "Calienta aceite y sofríe las verduras 3 minutos.",
      "Agrega 4 tazas de agua y sal.",
      "Cocina 15 minutos a fuego medio.",
      "Agrega las espinacas al final, cocina 2 min más.",
    ],
  },
  {
    id: "7",
    name: "Leche con avena",
    emoji: "🥣",
    time: "5 min",
    difficulty: "Fácil",
    ingredients: ["leche", "arroz", "granos"],
    steps: [
      "Calienta la leche en una olla a fuego bajo.",
      "Agrega avena o arroz cocido.",
      "Revuelve constantemente por 3 minutos.",
      "Endulza al gusto y sirve caliente.",
    ],
  },
  {
    id: "8",
    name: "Pollo al horno con verduras",
    emoji: "🍖",
    time: "45 min",
    difficulty: "Medio",
    ingredients: ["pollo", "zanahorias", "sal", "aceite"],
    steps: [
      "Precalienta el horno a 200°C.",
      "Sazona el pollo con sal, pimienta y aceite.",
      "Coloca las zanahorias alrededor.",
      "Hornea 40 minutos hasta dorar.",
      "Deja reposar 5 minutos antes de servir.",
    ],
  },
];

function getMatchScore(recipe: Omit<Recipe, "matchedIngredients">, foodNames: string[]): string[] {
  const normalizedFoods = foodNames.map((n) => n.toLowerCase());
  return recipe.ingredients.filter((ing) =>
    normalizedFoods.some((food) => food.includes(ing) || ing.includes(food.split(" ")[0]))
  );
}

export default function RecetasScreen() {
  const colors = useColors();
  const { foods } = useFoods();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const foodNames = useMemo(() => foods.map((f) => f.name), [foods]);

  const recipesWithMatch = useMemo(() => {
    return ALL_RECIPES.map((r) => ({
      ...r,
      matchedIngredients: getMatchScore(r, foodNames),
    })).sort((a, b) => b.matchedIngredients.length - a.matchedIngredients.length);
  }, [foodNames]);

  const canMake = recipesWithMatch.filter((r) => r.matchedIngredients.length >= 2);
  const others = recipesWithMatch.filter((r) => r.matchedIngredients.length < 2);

  const difficultyColor = (d: string) =>
    d === "Fácil" ? "#2ECC71" : d === "Medio" ? "#F39C12" : "#E74C3C";

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <Pressable
      onPress={() => setSelectedRecipe(item)}
      style={({ pressed }) => [
        styles.recipeCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={styles.recipeEmoji}>{item.emoji}</Text>
      <View style={styles.recipeInfo}>
        <Text style={[styles.recipeName, { color: colors.foreground }]}>{item.name}</Text>
        <View style={styles.recipeMeta}>
          <Text style={[styles.recipeTime, { color: colors.muted }]}>⏱ {item.time}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor(item.difficulty) + "20" }]}>
            <Text style={[styles.difficultyText, { color: difficultyColor(item.difficulty) }]}>
              {item.difficulty}
            </Text>
          </View>
        </View>
        {item.matchedIngredients.length > 0 && (
          <Text style={[styles.matchText, { color: colors.primary }]}>
            ✓ Tienes: {item.matchedIngredients.join(", ")}
          </Text>
        )}
      </View>
      <View style={[styles.matchBadge, {
        backgroundColor: item.matchedIngredients.length >= 2 ? colors.primary + "20" : colors.surface,
        borderColor: item.matchedIngredients.length >= 2 ? colors.primary : colors.border,
      }]}>
        <Text style={[styles.matchCount, {
          color: item.matchedIngredients.length >= 2 ? colors.primary : colors.muted,
        }]}>
          {item.matchedIngredients.length}/{item.ingredients.length}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={[...canMake, ...others]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Recetas</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Basadas en lo que tienes en casa
            </Text>
            {canMake.length > 0 && (
              <View style={[styles.banner, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}>
                <Text style={[styles.bannerText, { color: colors.primary }]}>
                  🍽️ Puedes preparar {canMake.length} receta{canMake.length > 1 ? "s" : ""} ahora mismo
                </Text>
              </View>
            )}
            {canMake.length > 0 && (
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>✅ Listas para preparar</Text>
            )}
          </View>
        )}
        renderItem={renderRecipeCard}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      {/* Recipe Detail Modal */}
      <Modal visible={!!selectedRecipe} animationType="slide" transparent presentationStyle="overFullScreen">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            {selectedRecipe && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalEmoji}>{selectedRecipe.emoji}</Text>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>{selectedRecipe.name}</Text>
                <View style={styles.modalMeta}>
                  <Text style={[styles.recipeTime, { color: colors.muted }]}>⏱ {selectedRecipe.time}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor(selectedRecipe.difficulty) + "20" }]}>
                    <Text style={[styles.difficultyText, { color: difficultyColor(selectedRecipe.difficulty) }]}>
                      {selectedRecipe.difficulty}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.modalSectionTitle, { color: colors.foreground }]}>Ingredientes</Text>
                {selectedRecipe.ingredients.map((ing, i) => {
                  const have = selectedRecipe.matchedIngredients.includes(ing);
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
                {selectedRecipe.steps.map((step, i) => (
                  <View key={i} style={styles.stepRow}>
                    <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                      <Text style={styles.stepNumberText}>{i + 1}</Text>
                    </View>
                    <Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text>
                  </View>
                ))}

                <View style={{ height: 32 }} />
              </ScrollView>
            )}
            <Pressable
              onPress={() => setSelectedRecipe(null)}
              style={[styles.closeBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
    marginBottom: 12,
  },
  banner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 10,
  },
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
  // Modal
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
