import { Alert, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { FoodItem } from "@/domain/foods/entities";

type Props = {
    onEdit: (food: FoodItem) => void;
    onDelete: (id: string, waste?: boolean) => void;
};

export const useFoodActions = ({ onEdit, onDelete }: Props) => {
    const handleLongPress = (food: FoodItem) => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        Alert.alert(food.name, "¿Qué deseas hacer?", [
            {
                text: "Editar",
                onPress: () => onEdit(food),
            },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: () => onDelete(food.id),
            },
            {
                text: "Marcar como desperdicio",
                style: "destructive",
                onPress: () => onDelete(food.id, true),
            },
            {
                text: "Cancelar",
                style: "cancel",
            },
        ]);
    };

    return { handleLongPress };
};