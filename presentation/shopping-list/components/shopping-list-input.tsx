import React from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { ThemeColorPalette } from "@/shared/constants/theme";

interface Props {
    colors: ThemeColorPalette;
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
}

export const ShoppingListInput = ({ colors, value, onChangeText, onSubmit }: Props) => {
    return (
        <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={value}
                onChangeText={onChangeText}
                placeholder="Agregar ítem..."
                placeholderTextColor={colors.muted}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
            />
            <Pressable
                onPress={onSubmit}
                style={({ pressed }) => [
                    styles.addBtn,
                    { backgroundColor: value.trim() ? colors.primary : colors.border },
                    pressed && { opacity: 0.8 },
                ]}
            >
                <Text style={styles.addBtnText}>+</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        borderWidth: 1,
        paddingLeft: 14,
        paddingRight: 6,
        paddingVertical: 6,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        fontSize: 15,
        lineHeight: 20,
        paddingVertical: 8,
    },
    addBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    addBtnText: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "300",
        lineHeight: 26,
    },
});
