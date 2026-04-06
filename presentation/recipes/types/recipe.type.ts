export interface Recipe {
    id: string;
    name: string;
    emoji: string;
    time: string;
    difficulty: "Fácil" | "Medio" | "Difícil";
    ingredients: string[];
    steps: string[];
    matchedIngredients: string[];
}
