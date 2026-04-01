import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { FoodItem } from "@/domain/foods/entities";
import { useColors } from "@/application/hooks/use-colors";
import { BarcodeScanner } from "../presentation/barcode/screens/barcode-scanner";
import * as Haptics from "expo-haptics";
import { CATEGORY_LABELS, CATEGORY_ICONS, LOCATION_LABELS } from "@/domain/foods/constants";
import { FoodCategory, FoodLocation } from "@/domain/foods/types";

interface AddFoodModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (food: Omit<FoodItem, "id" | "addedAt">) => void;
  editFood?: FoodItem | null;
}

const CATEGORIES: FoodCategory[] = ["lacteos", "frutas", "verduras", "carnes", "granos", "bebidas", "otros"];
const LOCATIONS: FoodLocation[] = ["nevera", "congelador", "despensa"];

export function AddFoodModal({ visible, onClose, onSave, editFood }: AddFoodModalProps) {
  const colors = useColors();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodCategory>("otros");
  const [location, setLocation] = useState<FoodLocation>("nevera");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("unid");
  const [expiryDays, setExpiryDays] = useState("7");
  const [scannerVisible, setScannerVisible] = useState(false);

  useEffect(() => {
    if (editFood) {
      setName(editFood.name);
      setCategory(editFood.category);
      setLocation(editFood.location);
      setQuantity(String(editFood.quantity));
      setUnit(editFood.unit);
      const days = Math.max(0, Math.ceil((new Date(editFood.expiryDate).getTime() - Date.now()) / 86400000));
      setExpiryDays(String(days));
    } else {
      setName("");
      setCategory("otros");
      setLocation("nevera");
      setQuantity("1");
      setUnit("unid");
      setExpiryDays("7");
    }
  }, [editFood, visible]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays || "0", 10));
    onSave({
      name: name.trim(),
      category,
      location,
      quantity: parseFloat(quantity) || 1,
      unit: unit.trim() || "unid",
      expiryDate: expiryDate.toISOString(),
    });
    onClose();
  };

  const QUICK_EXPIRY = [
    { label: "Hoy", days: 0 },
    { label: "3 días", days: 3 },
    { label: "1 semana", days: 7 },
    { label: "2 semanas", days: 14 },
    { label: "1 mes", days: 30 },
  ];

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: colors.border }]} />

            <Text style={[styles.title, { color: colors.foreground }]}>
              {editFood ? "Editar alimento" : "Agregar alimento"}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Name with Scanner */}
              <Text style={[styles.label, { color: colors.muted }]}>Nombre</Text>
              <View style={styles.nameRow}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground, flex: 1 }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ej: Leche entera"
                  placeholderTextColor={colors.muted}
                  returnKeyType="done"
                />
                <Pressable
                  onPress={() => setScannerVisible(true)}
                  style={[styles.scannerBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.scannerIcon}>📱</Text>
                </Pressable>
              </View>

              {/* Category */}
              <Text style={[styles.label, { color: colors.muted }]}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: category === cat ? colors.primary : colors.surface,
                        borderColor: category === cat ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.chipIcon}>{CATEGORY_ICONS[cat]}</Text>
                    <Text style={[styles.chipText, { color: category === cat ? "#fff" : colors.foreground }]}>
                      {CATEGORY_LABELS[cat]}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Location */}
              <Text style={[styles.label, { color: colors.muted }]}>Ubicación</Text>
              <View style={styles.row}>
                {LOCATIONS.map((loc) => (
                  <Pressable
                    key={loc}
                    onPress={() => setLocation(loc)}
                    style={[
                      styles.locationBtn,
                      {
                        backgroundColor: location === loc ? colors.primary : colors.surface,
                        borderColor: location === loc ? colors.primary : colors.border,
                        flex: 1,
                      },
                    ]}
                  >
                    <Text style={[styles.locationText, { color: location === loc ? "#fff" : colors.foreground }]}>
                      {loc === "nevera" ? "🧊" : loc === "congelador" ? "❄️" : "🗄️"} {LOCATION_LABELS[loc]}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Quantity */}
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.label, { color: colors.muted }]}>Cantidad</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: colors.muted }]}>Unidad</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                    value={unit}
                    onChangeText={setUnit}
                    placeholder="unid, kg, L..."
                    placeholderTextColor={colors.muted}
                    returnKeyType="done"
                  />
                </View>
              </View>

              {/* Expiry */}
              <Text style={[styles.label, { color: colors.muted }]}>Vence en (días)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                {QUICK_EXPIRY.map((q) => (
                  <Pressable
                    key={q.days}
                    onPress={() => setExpiryDays(String(q.days))}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: expiryDays === String(q.days) ? "#F39C12" : colors.surface,
                        borderColor: expiryDays === String(q.days) ? "#F39C12" : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: expiryDays === String(q.days) ? "#fff" : colors.foreground }]}>
                      {q.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                value={expiryDays}
                onChangeText={setExpiryDays}
                keyboardType="number-pad"
                placeholder="Número de días"
                placeholderTextColor={colors.muted}
                returnKeyType="done"
              />
            </ScrollView>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
                style={[styles.cancelBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.cancelText, { color: colors.muted }]}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: name.trim() ? 1 : 0.5 }]}
              >
                <Text style={styles.saveText}>{editFood ? "Guardar" : "Agregar"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <BarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onProductFound={(product) => {
          setName(product.name);
          setCategory(product.category as FoodCategory);
          if (product.brand) {
            setUnit(product.brand);
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    lineHeight: 26,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    lineHeight: 17,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 20,
  },
  nameRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  scannerBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerIcon: {
    fontSize: 20,
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  locationBtn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  locationText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 20,
  },
});
