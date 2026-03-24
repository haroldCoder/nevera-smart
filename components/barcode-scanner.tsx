import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { searchProductByBarcode, isValidBarcode, cleanBarcode, DEMO_BARCODES } from "@/lib/barcode-service";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onProductFound: (product: { name: string; category: string; brand?: string }) => void;
}

export function BarcodeScanner({ visible, onClose, onProductFound }: BarcodeScannerProps) {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Solicitar permisos al montar
  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission, requestPermission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;

    if (!isValidBarcode(data)) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert("Código inválido", "El código de barras no es válido. Intenta de nuevo.");
      return;
    }

    setScanned(true);
    setLoading(true);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const cleanedBarcode = cleanBarcode(data);

      // Primero intentar con datos de demo
      let product: any = DEMO_BARCODES[cleanedBarcode];

      // Si no está en demo, intentar con API
      if (!product) {
        product = await searchProductByBarcode(cleanedBarcode);
      }

      if (!product || !product.found || !product.name) {
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        Alert.alert(
          "Producto no encontrado",
          `No pudimos encontrar información para el código ${cleanedBarcode}. Intenta con otro o ingresa manualmente.`,
          [{ text: "OK", onPress: () => setScanned(false) }]
        );
        return;
      }

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      onProductFound({
        name: product.name,
        category: product.category || "otros",
        brand: product.brand,
      });

      onClose();
    } catch (error) {
      console.error("Error scanning barcode:", error);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert("Error", "Ocurrió un error al procesar el código. Intenta de nuevo.");
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
        <View style={[styles.overlay, { backgroundColor: colors.background }]}>
          <View style={styles.center}>
            <Text style={[styles.text, { color: colors.foreground }]}>Solicitando permisos de cámara...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
        <View style={[styles.overlay, { backgroundColor: colors.background }]}>
          <View style={styles.center}>
            <Text style={[styles.title, { color: colors.foreground }]}>Permiso de cámara requerido</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Necesitamos acceso a tu cámara para escanear códigos de barras.
            </Text>
            <Pressable
              onPress={requestPermission}
              style={[styles.button, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.buttonText}>Otorgar permiso</Text>
            </Pressable>
            <Pressable onPress={onClose} style={[styles.button, { backgroundColor: colors.border }]}>
              <Text style={[styles.buttonText, { color: colors.foreground }]}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "itf14",
              "datamatrix",
              "qr",
            ] as any,
          }}
        />

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Escanear código</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Scanner frame */}
          <View style={styles.scannerArea}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>Alinea el código dentro del marco</Text>
          </View>

          {/* Loading */}
          {loading && (
            <View style={[styles.loadingOverlay, { backgroundColor: "rgba(0,0,0,0.7)" }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Buscando producto...</Text>
            </View>
          )}

          {/* Bottom info */}
          <View style={[styles.footer, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
            <Text style={styles.footerText}>Escanea un código de barras para agregar un producto</Text>
            <Pressable
              onPress={() => {
                setScanned(false);
                Alert.prompt(
                  "Ingreso manual",
                  "Ingresa el código de barras:",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Buscar",
                      onPress: (barcode: string | undefined) => {
                        if (barcode) {
                          handleBarCodeScanned({ data: barcode });
                        }
                      },
                    },
                  ],
                  "plain-text"
                );
              }}
              style={[styles.manualBtn, { borderColor: colors.primary }]}
            >
              <Text style={[styles.manualBtnText, { color: colors.primary }]}>Ingreso manual</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 24,
  },
  scannerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    width: 280,
    height: 200,
    borderWidth: 2,
    borderColor: "#2ECC71",
    borderRadius: 12,
    backgroundColor: "rgba(46,204,113,0.1)",
  },
  scannerText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 20,
    textAlign: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
    marginTop: 16,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  manualBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
  },
  manualBtnText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    minWidth: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});
