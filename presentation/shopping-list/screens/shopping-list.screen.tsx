import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useShoppingListViewModel } from "@/presentation/shopping-list/hooks";
import { ShoppingListHeader, ShoppingListInput, ShoppingListSuggested, ShoppingListItem } from "@/presentation/shopping-list/components";

export const ShoppingListScreen = () => {
    const {
        colors,
        items,
        newItem,
        setNewItem,
        suggested,
        pendingCount,
        completedItemsCount,
        pendingItems,
        completedItems,
        handleAdd,
        handleToggle,
        handleRemove,
        handleClearCompleted,
        addSuggested,
    } = useShoppingListViewModel();

    return (
        <ScreenContainer>
            <FlatList
                data={[...pendingItems, ...completedItems]}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View>
                        <ShoppingListHeader
                            colors={colors}
                            pendingCount={pendingCount}
                            completedItemsCount={completedItemsCount}
                            onClearCompleted={handleClearCompleted}
                        />

                        <ShoppingListInput
                            colors={colors}
                            value={newItem}
                            onChangeText={setNewItem}
                            onSubmit={handleAdd}
                        />

                        <ShoppingListSuggested
                            colors={colors}
                            suggested={suggested}
                            onAdd={addSuggested}
                        />

                        {items.length > 0 && (
                            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 8 }]}>
                                🛒 Mi lista
                            </Text>
                        )}
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={styles.emptyIcon}>🛒</Text>
                        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Lista vacía</Text>
                        <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
                            Agrega ítems usando el campo de arriba
                        </Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <ShoppingListItem
                        item={item}
                        colors={colors}
                        onToggle={handleToggle}
                        onLongPress={handleRemove}
                    />
                )}
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
    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        lineHeight: 22,
        marginBottom: 4,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 40,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: "dashed",
        marginTop: 8,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "600",
        lineHeight: 22,
    },
    emptySubtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 4,
        textAlign: "center",
        paddingHorizontal: 20,
    },
});
