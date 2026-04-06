import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/application/hooks/use-colors";
import { useRecipesViewModel } from "@/presentation/recipes/hooks/use-recipes-view-model";
import { RecipeCard, RecipeDetailModal, RecipeHeader } from "@/presentation/recipes/components";

export const RecipesScreen = () => {
    const colors = useColors();
    const {
        canMake,
        others,
        selectedRecipe,
        handleSelectRecipe,
        handleCloseModal,
    } = useRecipesViewModel();

    return (
        <ScreenContainer>
            <FlatList
                data={[...canMake, ...others]}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <RecipeHeader colors={colors} canMakeCount={canMake.length} />
                )}
                renderItem={({ item }) => (
                    <RecipeCard
                        recipe={item}
                        colors={colors}
                        onPress={handleSelectRecipe}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />

            <RecipeDetailModal
                recipe={selectedRecipe}
                colors={colors}
                onClose={handleCloseModal}
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
});
