import { Modal, Pressable, Text, View } from 'react-native'
import React from 'react'

interface NoPermissionGrantedModalProps {
    visible: boolean;
    styles: any;
    colors: any;
    requestPermission: () => void;
    onClose: () => void;
}

export const NoPermissionGrantedModal = ({ visible, styles, colors, requestPermission, onClose }: NoPermissionGrantedModalProps) => {
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
    )
}