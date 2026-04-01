import { Modal, Text, View } from 'react-native'
import React from 'react'

interface NoPermissionModalProps {
  visible: boolean;
  styles: any;
  colors: any;
}

export const NoPermissionModal = ({ visible, styles, colors }: NoPermissionModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={[styles.overlay, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.text, { color: colors.foreground }]}>Solicitando permisos de cámara...</Text>
        </View>
      </View>
    </Modal>
  )
}
