import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  Platform
} from "react-native";
import * as Haptics from "expo-haptics";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useColors } from "@/application/hooks/use-colors";
import { DiFactory } from "@/application/factory";
import { NoPermissionModal, NoPermissionGrantedModal } from "@/presentation/barcode/components";
import { useScanBarcode } from "@/presentation/barcode/hooks";

const barcodeRepository = DiFactory.createBarcodeRepository();

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onProductFound: (product: { name: string; category: string; brand?: string }) => void;
}

export function BarcodeScanner({ visible, onClose, onProductFound }: BarcodeScannerProps) {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const { scan, loading } = useScanBarcode(barcodeRepository);
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

    if (!barcodeRepository.isValidBarcode(data)) {
      Alert.alert("Código inválido");
      return;
    }

    setScanned(true);

    try {
      const cleanedBarcode = barcodeRepository.cleanBarcode(data);

      const product = await scan(cleanedBarcode);

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

      onProductFound({ ...product, category: product.category ?? "" });
      onClose();
    } catch (error: any) {
      Alert.alert("Error");
      setScanned(false);
    }
  };

  if (!permission) {
    return (
      <NoPermissionModal
        visible={visible}
        styles={styles}
        colors={colors}
      />
    );
  }

  if (!permission.granted) {
    return (
      <NoPermissionGrantedModal
        visible={visible}
        styles={styles}
        colors={colors}
        requestPermission={requestPermission}
        onClose={onClose}
      />
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
