import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useShopping } from "@/hooks/use-shopping";
import { useFoods } from "@/hooks/use-foods";
import { getDaysUntilExpiry, getExpiryStatus, CATEGORY_ICONS } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function ListaScreen() {
  const colors = useColors();
  const { items, loading, add, toggle, remove, clearCompleted, pendingCount } = useShopping();
  const { foods } = useFoods();
  const [newItem, setNewItem] = useState("");

  // Suggested items: expired or expiring foods not already in list
  const suggested = useMemo(() => {
    const inList = new Set(items.map((i) => i.name.toLowerCase()));
    return foods
      .filter((f) => {
        const days = getDaysUntilExpiry(f.expiryDate);
        const status = getExpiryStatus(days);
        return (status === "expired" || status === "warning") && !inList.has(f.name.toLowerCase());
      })
      .slice(0, 5);
  }, [foods, items]);

  const handleAdd = () => {
    if (!newItem.trim()) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    add(newItem.trim());
    setNewItem("");
  };

  const handleToggle = (id: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggle(id);
  };

  const handleClearCompleted = () => {
    const completedCount = items.filter((i) => i.completed).length;
    if (completedCount === 0) return;
    Alert.alert(
      "Limpiar completados",
      `¿Eliminar ${completedCount} ítem${completedCount > 1 ? "s" : ""} completado${completedCount > 1 ? "s" : ""}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Limpiar", style: "destructive", onPress: clearCompleted },
      ]
    );
  };

  const pendingItems = items.filter((i) => !i.completed);
  const completedItems = items.filter((i) => i.completed);

  return (
    <ScreenContainer>
      <FlatList
        data={[...pendingItems, ...completedItems]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={[styles.title, { color: colors.foreground }]}>Lista de Compras</Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                  {pendingCount > 0 ? `${pendingCount} ítem${pendingCount > 1 ? "s" : ""} pendiente${pendingCount > 1 ? "s" : ""}` : "Todo listo 🎉"}
                </Text>
              </View>
              {completedItems.length > 0 && (
                <Pressable
                  onPress={handleClearCompleted}
                  style={[styles.clearBtn, { borderColor: colors.border }]}
                >
                  <Text style={[styles.clearText, { color: colors.muted }]}>Limpiar</Text>
                </Pressable>
              )}
            </View>

            {/* Add item input */}
            <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={newItem}
                onChangeText={setNewItem}
                placeholder="Agregar ítem..."
                placeholderTextColor={colors.muted}
                returnKeyType="done"
                onSubmitEditing={handleAdd}
              />
              <Pressable
                onPress={handleAdd}
                style={({ pressed }) => [
                  styles.addBtn,
                  { backgroundColor: newItem.trim() ? colors.primary : colors.border },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.addBtnText}>+</Text>
              </Pressable>
            </View>

            {/* Suggested section */}
            {suggested.length > 0 && (
              <View style={styles.suggestedSection}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  💡 Sugeridos
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
                  Basados en alimentos próximos a vencer
                </Text>
                <View style={styles.suggestedList}>
                  {suggested.map((food) => (
                    <Pressable
                      key={food.id}
                      onPress={() => add(food.name, true)}
                      style={[styles.suggestedChip, { backgroundColor: "#F39C1215", borderColor: "#F39C1240" }]}
                    >
                      <Text style={styles.suggestedIcon}>{CATEGORY_ICONS[food.category]}</Text>
                      <Text style={[styles.suggestedText, { color: colors.foreground }]}>{food.name}</Text>
                      <Text style={[styles.suggestedAdd, { color: "#F39C12" }]}>+ Agregar</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {items.length > 0 && (
              <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 8 }]}>
                🛒 Mi lista
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Lista vacía</Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Agrega ítems usando el campo de arriba
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleToggle(item.id)}
            onLongPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              Alert.alert("Eliminar", `¿Eliminar "${item.name}"?`, [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => remove(item.id) },
              ]);
            }}
            style={({ pressed }) => [
              styles.listItem,
              { backgroundColor: colors.surface, borderColor: colors.border },
              item.completed && { opacity: 0.5 },
              pressed && { opacity: 0.7 },
            ]}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: item.completed ? colors.primary : colors.border,
                  backgroundColor: item.completed ? colors.primary : "transparent",
                },
              ]}
            >
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text
              style={[
                styles.itemText,
                { color: colors.foreground },
                item.completed && styles.strikethrough,
              ]}
            >
              {item.name}
            </Text>
            {item.suggested && (
              <View style={[styles.suggestedBadge, { backgroundColor: "#F39C1220" }]}>
                <Text style={[styles.suggestedBadgeText, { color: "#F39C12" }]}>💡</Text>
              </View>
            )}
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
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
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
  },
  clearText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 8,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "300",
    lineHeight: 26,
  },
  suggestedSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  suggestedList: {
    gap: 8,
  },
  suggestedChip: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestedIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  suggestedText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  suggestedAdd: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  suggestedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  suggestedBadgeText: {
    fontSize: 12,
    lineHeight: 17,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: 8,
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
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
