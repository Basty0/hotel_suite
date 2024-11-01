"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// Remplacer l'import de type par une importation régulière
import { ThemeProviderProps } from "next-themes/dist/types";

// Remplacer la syntaxe TypeScript par une syntaxe JavaScript
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
