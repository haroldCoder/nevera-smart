import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFoods } from "@/application/hooks/use-foods";
import { CATEGORY_LABELS, CATEGORY_ICONS, FoodCategory, getDaysUntilExpiry, getExpiryStatus } from "@/lib/store";
import { useColors } from "@/application/hooks/use-colors";

const CATEGORY_COLORS: Record<FoodCategory, string> = {
  lacteos: "#3498DB",
  frutas: "#E74C3C",
  verduras: "#2ECC71",
  carnes: "#E67E22",
  granos: "#F1C40F",
  bebidas: "#9B59B6",
  otros: "#95A5A6",
};

export default function StatsScreen() {
  const colors = useColors();
  const { foods, wasteRecords } = useFoods();

  const stats = useMemo(() => {
    const byCategory: Record<FoodCategory, number> = {
      lacteos: 0, frutas: 0, verduras: 0, carnes: 0, granos: 0, bebidas: 0, otros: 0,
    };
    let fresh = 0, warning = 0, expired = 0;

    foods.forEach((f) => {
      byCategory[f.category]++;
      const status = getExpiryStatus(getDaysUntilExpiry(f.expiryDate));
      if (status === "fresh") fresh++;
      else if (status === "warning") warning++;
      else expired++;
    });

    const total = foods.length;
    const categoryEntries = Object.entries(byCategory)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a) as [FoodCategory, number][];

    return { byCategory, categoryEntries, total, fresh, warning, expired };
  }, [foods]);

  const wasteByCategory = useMemo(() => {
    const byCategory: Record<FoodCategory, number> = {
      lacteos: 0, frutas: 0, verduras: 0, carnes: 0, granos: 0, bebidas: 0, otros: 0,
    };
    wasteRecords.forEach((r) => {
      byCategory[r.category]++;
    });
    return byCategory;
  }, [wasteRecords]);

  const healthScore = useMemo(() => {
    if (stats.total === 0) return 100;
    return Math.round(((stats.fresh + stats.warning * 0.5) / stats.total) * 100);
  }, [stats]);

  const scoreColor = healthScore >= 70 ? "#2ECC71" : healthScore >= 40 ? "#F39C12" : "#E74C3C";
  const scoreEmoji = healthScore >= 70 ? "🌟" : healthScore >= 40 ? "⚠️" : "🔴";

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Estadísticas</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Estado de tu nevera</Text>

        {/* Health Score */}
        <View style={[styles.scoreCard, { backgroundColor: scoreColor + "15", borderColor: scoreColor + "40" }]}>
          <View style={styles.scoreLeft}>
            <Text style={[styles.scoreTitle, { color: colors.foreground }]}>Salud de tu nevera</Text>
            <Text style={[styles.scoreSubtitle, { color: colors.muted }]}>
              {healthScore >= 70 ? "¡Excelente! Tus alimentos están frescos." :
                healthScore >= 40 ? "Atención: algunos alimentos por vencer." :
                  "Alerta: revisa tus alimentos urgente."}
            </Text>
          </View>
          <View style={styles.scoreRight}>
            <Text style={styles.scoreEmoji}>{scoreEmoji}</Text>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{healthScore}%</Text>
          </View>
        </View>

        {/* Status breakdown */}
        <View style={styles.row}>
          <View style={[styles.miniCard, { backgroundColor: "#2ECC7115", borderColor: "#2ECC7140" }]}>
            <Text style={[styles.miniNumber, { color: "#2ECC71" }]}>{stats.fresh}</Text>
            <Text style={[styles.miniLabel, { color: colors.muted }]}>Frescos</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: "#F39C1215", borderColor: "#F39C1240" }]}>
            <Text style={[styles.miniNumber, { color: "#F39C12" }]}>{stats.warning}</Text>
            <Text style={[styles.miniLabel, { color: colors.muted }]}>Por vencer</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: "#E74C3C15", borderColor: "#E74C3C40" }]}>
            <Text style={[styles.miniNumber, { color: "#E74C3C" }]}>{stats.expired}</Text>
            <Text style={[styles.miniLabel, { color: colors.muted }]}>Vencidos</Text>
          </View>
        </View>

        {/* Category breakdown */}
        {stats.total > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Por categoría</Text>
            {stats.categoryEntries.map(([cat, count]) => {
              const pct = Math.round((count / stats.total) * 100);
              const color = CATEGORY_COLORS[cat];
              return (
                <View key={cat} style={styles.barRow}>
                  <Text style={styles.barIcon}>{CATEGORY_ICONS[cat]}</Text>
                  <View style={styles.barInfo}>
                    <View style={styles.barHeader}>
                      <Text style={[styles.barLabel, { color: colors.foreground }]}>
                        {CATEGORY_LABELS[cat]}
                      </Text>
                      <Text style={[styles.barCount, { color: colors.muted }]}>{count}</Text>
                    </View>
                    <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                      <View
                        style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: color }]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Waste section */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Desperdicio registrado</Text>
          {wasteRecords.length === 0 ? (
            <View style={styles.noWaste}>
              <Text style={styles.noWasteIcon}>🌱</Text>
              <Text style={[styles.noWasteText, { color: colors.foreground }]}>
                ¡Sin desperdicios registrados!
              </Text>
              <Text style={[styles.noWasteSubtext, { color: colors.muted }]}>
                Sigue así, estás cuidando el planeta.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.wasteTotal}>
                <Text style={[styles.wasteTotalNumber, { color: "#E74C3C" }]}>{wasteRecords.length}</Text>
                <Text style={[styles.wasteTotalLabel, { color: colors.muted }]}>
                  alimento{wasteRecords.length > 1 ? "s" : ""} desperdiciado{wasteRecords.length > 1 ? "s" : ""}
                </Text>
              </View>
              {(Object.entries(wasteByCategory) as [FoodCategory, number][])
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => (
                  <View key={cat} style={[styles.wasteRow, { borderColor: colors.border }]}>
                    <Text style={styles.barIcon}>{CATEGORY_ICONS[cat]}</Text>
                    <Text style={[styles.barLabel, { color: colors.foreground, flex: 1 }]}>
                      {CATEGORY_LABELS[cat]}
                    </Text>
                    <View style={[styles.wasteBadge, { backgroundColor: "#E74C3C20" }]}>
                      <Text style={[styles.wasteBadgeText, { color: "#E74C3C" }]}>{count}</Text>
                    </View>
                  </View>
                ))}
            </>
          )}
        </View>

        {/* Tips */}
        <View style={[styles.section, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>💡 Consejos</Text>
          {[
            "Revisa tu nevera antes de ir al supermercado.",
            "Coloca los alimentos más antiguos al frente.",
            "Congela lo que no vayas a usar pronto.",
            "Planifica tus comidas semanalmente.",
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.tipText, { color: colors.foreground }]}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
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
    marginBottom: 16,
  },
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  scoreLeft: {
    flex: 1,
    marginRight: 12,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  scoreSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  scoreRight: {
    alignItems: "center",
  },
  scoreEmoji: {
    fontSize: 28,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  miniCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  miniNumber: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  miniLabel: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 12,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  barIcon: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },
  barInfo: {
    flex: 1,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  barCount: {
    fontSize: 13,
    lineHeight: 18,
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  noWaste: {
    alignItems: "center",
    paddingVertical: 16,
  },
  noWasteIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  noWasteText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  noWasteSubtext: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    textAlign: "center",
  },
  wasteTotal: {
    alignItems: "center",
    marginBottom: 12,
  },
  wasteTotalNumber: {
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 44,
  },
  wasteTotalLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  wasteRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 10,
  },
  wasteBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  wasteBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 10,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
