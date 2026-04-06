import { useState, useMemo } from "react";
import { useFoods } from "@/application/hooks/use-foods";
import { Recipe } from "@/presentation/recipes/types";
import { ALL_RECIPES } from "@/presentation/recipes/constants/recipes";

function getMatchScore(recipe: Omit<Recipe, "matchedIngredients">, foodNames: string[]): string[] {
    const normalizedFoods = foodNames.map((n) => n.toLowerCase());
    return recipe.ingredients.filter((ing) =>
        normalizedFoods.some((food) => food.includes(ing) || ing.includes(food.split(" ")[0]))
    );
}

export const useRecipesViewModel = () => {
    const { foods } = useFoods();
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    const foodNames = useMemo(() => foods.map((f) => f.name), [foods]);

    const recipesWithMatch = useMemo(() => {
        return ALL_RECIPES.map((r) => ({
            ...r,
            matchedIngredients: getMatchScore(r, foodNames),
        })) as Recipe[];
    }, [foodNames]);

    const sortedRecipes = useMemo(() => {
        return [...recipesWithMatch].sort((a, b) => b.matchedIngredients.length - a.matchedIngredients.length);
    }, [recipesWithMatch]);

    const canMake = useMemo(() => {
        return sortedRecipes.filter((r) => r.matchedIngredients.length >= 2);
    }, [sortedRecipes]);

    const others = useMemo(() => {
        return sortedRecipes.filter((r) => r.matchedIngredients.length < 2);
    }, [sortedRecipes]);

    const handleSelectRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
    };

    const handleCloseModal = () => {
        setSelectedRecipe(null);
    };

    return {
        canMake,
        others,
        selectedRecipe,
        handleSelectRecipe,
        handleCloseModal,
    };
};
