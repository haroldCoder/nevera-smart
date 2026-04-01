export const CATEGORY_MAPPING: Record<string, string> = {
    dairy: "lacteos",
    milk: "lacteos",
    cheese: "lacteos",
    yogurt: "lacteos",
    butter: "lacteos",
    cream: "lacteos",
    fruit: "frutas",
    apple: "frutas",
    banana: "frutas",
    orange: "frutas",
    berry: "frutas",
    vegetable: "verduras",
    carrot: "verduras",
    spinach: "verduras",
    broccoli: "verduras",
    lettuce: "verduras",
    meat: "carnes",
    chicken: "carnes",
    beef: "carnes",
    pork: "carnes",
    fish: "carnes",
    cereal: "granos",
    grain: "granos",
    rice: "granos",
    bread: "granos",
    pasta: "granos",
    beverage: "bebidas",
    juice: "bebidas",
    water: "bebidas",
    milk_drink: "bebidas",
    tea: "bebidas",
    coffee: "bebidas",
};

// Mapeo de categorías de Open Food Facts a nuestras categorías

export const mapCategory = (openFoodFactsCategory: string): string => {
    const normalized = openFoodFactsCategory.toLowerCase();
    for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
        if (normalized.includes(key)) {
            return value;
        }
    }
    return "otros";
}
