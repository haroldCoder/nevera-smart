import { ScreenContainer } from '@/components/screen-container'
import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { ThemeColorPalette } from '@/shared/constants/theme';

interface Props {
    colors: ThemeColorPalette;
}

export const Loading = ({ colors }: Props) => {
    return (
        <ScreenContainer>
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
