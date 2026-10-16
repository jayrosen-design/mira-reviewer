import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Columns3, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEMES, useTheme, type ThemeId } from "@/lib/theme";

/** Preview swatches intentionally show each scheme's own colors (not the active theme). */
export function Swatch({ colors }: { colors: readonly string[] }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {colors.map((c) => (
        <span key={c} className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

export function ThemeMenuItems() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      {THEMES.map((t) => (
        <DropdownMenuItem key={t.id} onSelect={() => setTheme(t.id as ThemeId)}>
          <Swatch colors={t.swatch} />
          <span className="ml-2 flex-1">{t.label}</span>
          {theme === t.id && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
      ))}
      <DropdownMenuItem asChild>
        <Link to="/compare">
          <Columns3 className="mr-2 h-4 w-4" />
          Compare side by side
        </Link>
      </DropdownMenuItem>
    </>
  );
}

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const current = THEMES.find((t) => t.id === theme)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Color scheme"
        className={`inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted ${className}`}
      >
        <Palette className="h-4 w-4" />
        <Swatch colors={current.swatch} />
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Color scheme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
