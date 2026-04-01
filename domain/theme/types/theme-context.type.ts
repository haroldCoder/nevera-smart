import { type ColorScheme } from "@shared/constants/theme";

export type ThemeContextValue = {
    colorScheme: ColorScheme;
    setColorScheme: (scheme: ColorScheme) => void;
};
