import { useColors } from '@/application/hooks/use-colors';
import { useFoods } from '@/application/hooks/use-foods';
import { FoodItem } from '@/domain/foods/entities';
import React, { useState, useMemo } from 'react'
import { FilterCategory } from '@/presentation/home/types';
import { getDaysUntilExpiry, getExpiryStatus } from '@shared/helpers';
import { CategoryFilters, ExpiringSoon, FoodList, Header, Loading, StatsRow } from '@/presentation/home/components';
import { ScreenContainer } from '@/components/screen-container';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { AddFoodModal } from '@/components/add-food-modal';
import { useFoodActions } from '@/presentation/home/hooks';
import { categories } from '@/presentation/home/constants';

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

  const freshCount = foods.filter((f) => getExpiryStatus(getDaysUntilExpiry(f.expiryDate)) === "fresh").length;
  const warningCount = foods.filter((f) => getExpiryStatus(getDaysUntilExpiry(f.expiryDate)) === "warning").length;
  const expiredCount = foods.filter((f) => getExpiryStatus(getDaysUntilExpiry(f.expiryDate)) === "expired").length;

  if (loading) return <Loading styles={styles} colors={colors} />


  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header styles={styles} colors={colors} foods={foods} />
        <StatsRow
          styles={styles}
          colors={colors}
          freshCount={freshCount}
          warningCount={warningCount}
          expiredCount={expiredCount}
        />
        <ExpiringSoon
          styles={styles}
          colors={colors}
          expiringSoon={expiringSoon}
          handleLongPress={useFoodActions}
        />
        <CategoryFilters
          styles={styles}
          colors={colors}
          filter={filter}
          setFilter={setFilter}
          categories={categories}
        />
        <FoodList
          styles={styles}
          colors={colors}
          filteredFoods={filteredFoods}
          filter={filter}
          handleLongPress={useFoodActions}
        />
      </ScrollView>
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
  )
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