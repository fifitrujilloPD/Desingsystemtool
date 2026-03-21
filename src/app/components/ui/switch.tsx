"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";
import { useTheme } from "../theme-provider";
import lightTokens from "../../../imports/Ligth_mode.tokens-3.json";
import darkTokens from "../../../imports/darkmode.tokens-3.json";

import styles from "./switch.module.css";

function resolveRef(ref: string, root: any): string | null {
  const path = ref.replace(/[{}]/g, "").split(".");
  let current = root;
  for (const p of path) {
    current = current?.[p];
    if (!current) return null;
  }
  return current?.$value?.hex || null;
}

function resolveColor(tokens: any, path: string): string {
  const parts = path.split(".");
  let current = tokens;
  for (const p of parts) current = current?.[p];
  const val = current?.$value;
  if (!val) return "#000";
  if (typeof val === "string" && val.startsWith("{"))
    return resolveRef(val, tokens) || "#000";
  return val?.hex || "#000";
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type SwitchVisualState = "default" | "hover" | "focus";

export type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  /** Solo para previews de documentación: fuerza aspecto hover/focus sin interacción. */
  visualState?: SwitchVisualState;
};

function Switch({
  className,
  visualState = "default",
  style,
  ...props
}: SwitchProps) {
  const { theme } = useTheme();
  const tokens = theme === "dark" ? darkTokens : lightTokens;

  const borderSecondary = resolveColor(
    tokens,
    "global.color.Border color.border-secondary"
  );
  const borderPrimary = resolveColor(
    tokens,
    "global.color.Border color.border-primary"
  );
  const brand = resolveColor(tokens, "global.color.Button color.button-color");
  const brandHover = resolveColor(
    tokens,
    "global.color.Button color.button-hover"
  );
  const bgContainer = resolveColor(
    tokens,
    "global.color.Background.bg-container"
  );

  const cssVars = {
    "--switch-off": borderSecondary,
    "--switch-off-hover": borderPrimary,
    "--switch-on": brand,
    "--switch-on-hover": brandHover,
    "--switch-border": borderPrimary,
    "--switch-thumb": bgContainer,
    "--switch-focus-ring": hexToRgba(brand, 0.28),
  } as React.CSSProperties;

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        styles.track,
        visualState === "hover" && styles.forceHover,
        visualState === "focus" && styles.forceFocus,
        className,
      )}
      style={{ ...cssVars, ...style }}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={styles.thumb}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
