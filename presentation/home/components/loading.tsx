import { ScreenContainer } from '@/components/screen-container'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

interface Props {
    styles: any;
    colors: any;
}

export const Loading = ({ styles, colors }: Props) => {
    return (
        <ScreenContainer>
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        </ScreenContainer>
    )
}
