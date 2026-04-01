import { useThemeContext } from "@/application/hooks/use-theme";

export function useColorScheme() {
  return useThemeContext().colorScheme;
}
