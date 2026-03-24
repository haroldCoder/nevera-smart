import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { FoodCard } from "@/components/food-card";
import { AddFoodModal } from "@/components/add-food-modal";
import { useFoods } from "@/hooks/use-foods";
import { FoodItem, FoodCategory, CATEGORY_LABELS, CATEGORY_ICONS, getDaysUntilExpiry, getExpiryStatus } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

type FilterCategory = "todos" | FoodCategory;

export default function HomeScreen() {
  const colors = useColors();
  const { foods, loading, add, update, remove } = useFoods();
  const [modalVisible, setModalVisible] = useState(false);
  const [editFood, setEditFood] = useState<FoodItem | null>(null);
  const [filter, setFilter] = useState<FilterCategory>("todos");

  const expiringSoon = useMemo(
    () => foods.filter((f) => {
      const days = getDaysUntilExpiry(f.expiryDate);
      return days <= 3;
    }).sort((a, b) => getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate)),
    [foods]
  );

  const filteredFoods = useMemo(() => {
    const base = filter === "todos" ? foods : foods.filter((f) => f.category === filter);
    return base.sort((a, b) => getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate));
  }, [foods, filter]);

  const categories: FilterCategory[] = ["todos", "lacteos", "frutas", "verduras", "carnes", "granos", "bebidas", "otros"];

  const handleLongPress = (food: FoodItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      food.name,
      "¿Qué deseas hacer?",
      [
        { text: "Editar", onPress: () => { setEditFood(food); setModalVisible(true); } },
        { text: "Eliminar", style: "destructive", onPress: () => remove(food.id) },
        { text: "Marcar como desperdicio", style: "destructive", onPress: () => remove(food.id, true) },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const freshCount = foods.filter((f) => getExpiryStatus(getDaysUntilExpiry(f.expiryDate)) === "fresh").length;
  const warningCount = foods.filter((f) => getExpiryStatus(getDaysUntilExpiry(f.expiryDate)) === "warning").length;
  const expiredCount = foods.filter((f) => getExpiryStatus(getDaysUntilExpiry(f.expiryDate)) === "expired").length;

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
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

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#2ECC7115", borderColor: "#2ECC7140" }]}>
            <Text style={[styles.statNumber, { color: "#2ECC71" }]}>{freshCount}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>frescos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#F39C1215", borderColor: "#F39C1240" }]}>
            <Text style={[styles.statNumber, { color: "#F39C12" }]}>{warningCount}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>por vencer</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#E74C3C15", borderColor: "#E74C3C40" }]}>
            <Text style={[styles.statNumber, { color: "#E74C3C" }]}>{expiredCount}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>vencidos</Text>
          </View>
        </View>

        {/* Expiring soon */}
        {expiringSoon.length > 0 && (
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
        )}

        {/* Category filters */}
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
              <Text style={[styles.filterText, { color: filter === cat ? "#fff" : colors.foreground }]}>
                {cat === "todos" ? "Todos" : CATEGORY_LABELS[cat as FoodCategory]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Food list */}
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
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => { setEditFood(null); setModalVisible(true); }}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: colors.primary },
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      <AddFoodModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditFood(null); }}
        onSave={(food) => {
          if (editFood) {
            update({ ...food, id: editFood.id, addedAt: editFood.addedAt });
          } else {
            add(food);
          }
        }}
        editFood={editFood}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  summaryBadge: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  summaryCount: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  summaryLabel: {
    fontSize: 11,
    lineHeight: 15,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
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
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2ECC71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
    lineHeight: 32,
    marginTop: -2,
  },
});
