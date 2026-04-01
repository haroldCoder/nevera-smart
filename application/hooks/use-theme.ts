import { ThemeContext } from "@/application/context";
import { useContext } from "react";
import { ThemeContextValue } from "@/domain/theme/types";

export function useThemeContext(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useThemeContext must be used within ThemeProvider");
    }
    return ctx;
}
