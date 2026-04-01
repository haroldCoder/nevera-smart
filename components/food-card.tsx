import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FoodItem } from "@/domain/foods/entities";
import { useColors } from "@/application/hooks/use-colors";
import { getDaysUntilExpiry, getExpiryStatus } from "@shared/helpers";
import { CATEGORY_ICONS, LOCATION_LABELS } from "@/domain/foods/constants";

interface FoodCardProps {
  food: FoodItem;
  onPress?: () => void;
  compact?: boolean;
}

export function FoodCard({ food, onPress, compact = false }: FoodCardProps) {
  const colors = useColors();
  const days = getDaysUntilExpiry(food.expiryDate);
  const status = getExpiryStatus(days);

  const badgeColor =
    status === "expired" ? colors.error :
      status === "warning" ? colors.warning :
        colors.success;

  const badgeText =
    status === "expired" ? "Vencido" :
      days === 0 ? "Hoy" :
        days === 1 ? "Mañana" :
          `${days}d`;

  const icon = CATEGORY_ICONS[food.category];

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.compactCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={styles.compactIcon}>{icon}</Text>
        <Text style={[styles.compactName, { color: colors.foreground }]} numberOfLines={1}>
          {food.name}
        </Text>
        <View style={[styles.badge, { backgroundColor: badgeColor + "22", borderColor: badgeColor }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.75 },
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {food.name}
        </Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          {food.quantity} {food.unit} · {LOCATION_LABELS[food.location]}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: badgeColor + "22", borderColor: badgeColor }]}>
        <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(46,204,113,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  meta: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
  },
  // Compact styles
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  compactIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  compactName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
});
