import { createContext, useContext, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export const THEMES = [
  { id: "warm", label: "Warm Sage", swatch: ["#1F6F6B", "#E4F0EC", "#F2A97E"] },
  { id: "ufhealth", label: "UF Health", swatch: ["#005496", "#E3EDF7", "#F37021"] },
  { id: "sparc", label: "SPARC C-LEAR", swatch: ["#004AAD", "#E3EBF8", "#F9BA4B"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export const DEFAULT_THEME: ThemeId = "warm";

export function isTheme(v: unknown): v is ThemeId {
  return typeof v === "string" && THEMES.some((t) => t.id === v);
}

/** Reads the theme from the URL (?theme=). Never persisted to storage. */
export function useUrlTheme(): ThemeId {
  const t = useRouterState({ select: (s) => (s.location.search as { theme?: unknown }).theme });
  return isTheme(t) ? t : DEFAULT_THEME;
}

type Ctx = { theme: ThemeId; setTheme: (t: ThemeId) => void };
const ThemeContext = createContext<Ctx>({ theme: DEFAULT_THEME, setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUrlTheme();
  const navigate = useNavigate();
  const setTheme = (t: ThemeId) => {
    // Router navigation with replace → history.replaceState; keeps path & other params.
    navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => ({ ...prev, theme: t }),
      replace: true,
    } as never);
  };
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
