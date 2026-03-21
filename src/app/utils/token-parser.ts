import lightTokens from "../../imports/Ligth_mode.tokens.json";
import darkTokens from "../../imports/darkmode.tokens.json";

export interface ColorToken {
  hex: string;
  components: number[];
  alpha: number;
}

export interface ColorScale {
  [key: string]: ColorToken;
}

export interface ColorGroup {
  [colorName: string]: ColorScale;
}

function extractColorValue(value: any): ColorToken | null {
  if (value?.$value?.hex) {
    return {
      hex: value.$value.hex,
      components: value.$value.components || [],
      alpha: value.$value.alpha || 1,
    };
  }
  return null;
}

function resolveRef(ref: string, root: any): string | null {
  const path = ref.replace(/[{}]/g, "").split(".");
  let current = root;
  for (const p of path) current = current?.[p];
  return current?.$value?.hex || null;
}

function resolveHex(value: any, root: any): string {
  const hex = value?.$value?.hex;
  if (typeof hex === "string") return hex;
  const ref = value?.$value;
  if (typeof ref === "string" && ref.startsWith("{")) return resolveRef(ref, root) || "#000";
  return "#000";
}

function parseColorGroup(groupData: any): ColorGroup {
  const result: ColorGroup = {};
  if (!groupData || typeof groupData !== 'object') return result;

  Object.entries(groupData).forEach(([colorName, colorData]) => {
    if (typeof colorData === 'object' && colorData !== null) {
      const scale: ColorScale = {};
      Object.entries(colorData).forEach(([scaleKey, value]) => {
        const colorValue = extractColorValue(value);
        if (colorValue) {
          scale[scaleKey] = colorValue;
        }
      });
      if (Object.keys(scale).length > 0) {
        result[colorName] = scale;
      }
    }
  });

  return result;
}

export function getPrimaryColors(): ColorGroup {
  const primary = parseColorGroup(lightTokens?.global?.Primary);
  // Primary includes: Brand, neutral, error, success, warning
  return primary;
}

export function getSecondaryColors(): ColorGroup {
  // secondary is lowercase in the JSON: orange, purple, pink, blue, Brown
  const secondary = parseColorGroup((lightTokens?.global as any)?.secondary);
  return secondary;
}

export interface FoundationColor {
  name: string;
  light: string;
  dark: string;
  lightToken: string;
  darkToken: string;
  category: string;
}

export function getFoundationColors(): FoundationColor[] {
  const lightPrimary = parseColorGroup(lightTokens?.global?.Primary);
  const darkPrimary = parseColorGroup(darkTokens?.global?.Primary);

  const secondaryColors = ["purple", "orange", "blue", "pink", "brown"] as const;

  const makeFoundation = (
    name: string,
    category: "Background" | "Text" | "Border" | "Buttons",
    light: string,
    dark: string,
    lightToken: string,
    darkToken: string
  ): FoundationColor => ({
    name,
    category,
    light,
    dark,
    lightToken,
    darkToken,
  });

  const getBg = (c: (typeof secondaryColors)[number]) =>
    makeFoundation(
      `bg-${c}`,
      "Background",
      resolveHex(lightTokens?.global?.color?.Background?.[`bg-${c}`], lightTokens),
      resolveHex(darkTokens?.global?.color?.Background?.[`bg-${c}`], darkTokens),
      `bg-${c}`,
      `bg-${c}`
    );

  const getTextSecondary = (c: (typeof secondaryColors)[number]) =>
    makeFoundation(
      `text-${c}`,
      "Text",
      resolveHex(lightTokens?.global?.color?.["Text colors"]?.[`text-${c}`], lightTokens),
      resolveHex(darkTokens?.global?.color?.["Text colors"]?.[`text-${c}`], darkTokens),
      `text-${c}`,
      `text-${c}`
    );

  const getBorderSecondary = (c: (typeof secondaryColors)[number]) =>
    makeFoundation(
      `border-${c}`,
      "Border",
      resolveHex(lightTokens?.global?.color?.["Border color"]?.[`border-${c}`], lightTokens),
      resolveHex(darkTokens?.global?.color?.["Border color"]?.[`border-${c}`], darkTokens),
      `border-${c}`,
      `border-${c}`
    );

  // Status foundation colors (error/success/warning) — pulled from semantic tokens.
  // Note: the project JSON uses `warnning` (double n) for background/text tokens.
  const statusBgError = makeFoundation(
    "bg-error",
    "Background",
    resolveHex(lightTokens?.global?.color?.Background?.["bg-error"], lightTokens),
    resolveHex(darkTokens?.global?.color?.Background?.["bg-error"], darkTokens),
    "bg-error",
    "bg-error"
  );
  const statusBgWarnning = makeFoundation(
    "bg-warnning",
    "Background",
    resolveHex(lightTokens?.global?.color?.Background?.["bg-warnning"], lightTokens),
    resolveHex(darkTokens?.global?.color?.Background?.["bg-warnning"], darkTokens),
    "bg-warnning",
    "bg-warnning"
  );
  const statusBgSuccess = makeFoundation(
    "bg-success",
    "Background",
    resolveHex(lightTokens?.global?.color?.Background?.["bg-success"], lightTokens),
    resolveHex(darkTokens?.global?.color?.Background?.["bg-success"], darkTokens),
    "bg-success",
    "bg-success"
  );

  const statusTextError = makeFoundation(
    "text-error",
    "Text",
    resolveHex(lightTokens?.global?.color?.["Text colors"]?.["text-error"], lightTokens),
    resolveHex(darkTokens?.global?.color?.["Text colors"]?.["text-error"], darkTokens),
    "text-error",
    "text-error"
  );
  const statusTextWarnning = makeFoundation(
    "text-warnning",
    "Text",
    resolveHex(lightTokens?.global?.color?.["Text colors"]?.["text-warnning"], lightTokens),
    resolveHex(darkTokens?.global?.color?.["Text colors"]?.["text-warnning"], darkTokens),
    "text-warnning",
    "text-warnning"
  );
  const statusTextSuccess = makeFoundation(
    "text-success",
    "Text",
    resolveHex(lightTokens?.global?.color?.["Text colors"]?.["text-success"], lightTokens),
    resolveHex(darkTokens?.global?.color?.["Text colors"]?.["text-success"], darkTokens),
    "text-success",
    "text-success"
  );

  const statusBorderError = makeFoundation(
    "border-error",
    "Border",
    resolveHex(lightTokens?.global?.color?.["Border color"]?.["border-error"], lightTokens),
    resolveHex(darkTokens?.global?.color?.["Border color"]?.["border-error"], darkTokens),
    "border-error",
    "border-error"
  );
  const statusBorderWarning = makeFoundation(
    "border-warning",
    "Border",
    resolveHex(lightTokens?.global?.color?.["Border color"]?.["border-warning"], lightTokens),
    resolveHex(darkTokens?.global?.color?.["Border color"]?.["border-warning"], darkTokens),
    "border-warning",
    "border-warning"
  );
  const statusBorderSuccess = makeFoundation(
    "border-success",
    "Border",
    resolveHex(lightTokens?.global?.color?.["Border color"]?.["border-success"], lightTokens),
    resolveHex(darkTokens?.global?.color?.["Border color"]?.["border-success"], darkTokens),
    "border-success",
    "border-success"
  );

  const backgroundColors: FoundationColor[] = [
    // Base backgrounds
    makeFoundation(
      "background-main",
      "Background",
      lightPrimary.neutral?.["50"]?.hex || "#FFFFFF",
      darkPrimary.neutral?.["950"]?.hex || "#000000",
      "neutral-50",
      "neutral-950"
    ),
    makeFoundation(
      "background-surface",
      "Background",
      lightPrimary.neutral?.["100"]?.hex || "#F9FAFB",
      darkPrimary.neutral?.["900"]?.hex || "#0A0A0A",
      "neutral-100",
      "neutral-900"
    ),
    makeFoundation(
      "background-hover",
      "Background",
      lightPrimary.neutral?.["200"]?.hex || "#F3F4F6",
      darkPrimary.neutral?.["800"]?.hex || "#1A1A1A",
      "neutral-200",
      "neutral-800"
    ),
    // Preview order: status colors appear early
    getBg("purple"),
    statusBgError,
    statusBgSuccess,
    statusBgWarnning,
    // Remaining secondary backgrounds
    getBg("orange"),
    getBg("blue"),
    getBg("pink"),
    getBg("brown"),
  ];

  const textPrimary = makeFoundation(
    "text-primary",
    "Text",
    lightPrimary.neutral?.["900"]?.hex || "#111827",
    darkPrimary.neutral?.["50"]?.hex || "#F9FAFB",
    "neutral-900",
    "neutral-50"
  );
  const textSecondary = makeFoundation(
    "text-secondary",
    "Text",
    lightPrimary.neutral?.["600"]?.hex || "#475467",
    darkPrimary.neutral?.["400"]?.hex || "#9CA3AF",
    "neutral-600",
    "neutral-400"
  );
  const textTertiary = makeFoundation(
    "text-tertiary",
    "Text",
    lightPrimary.neutral?.["500"]?.hex || "#6B7280",
    darkPrimary.neutral?.["500"]?.hex || "#6B7280",
    "neutral-500",
    "neutral-500"
  );

  const textColors: FoundationColor[] = [
    // Remaining secondary texts
    getTextSecondary("purple"),
    getTextSecondary("orange"),
    getTextSecondary("blue"),
    // Preview order
    textPrimary,
    getTextSecondary("pink"),
    textTertiary,
    getTextSecondary("brown"),
    // Status order
    statusTextError,
    statusTextWarnning,
    statusTextSuccess,
    textSecondary,
  ];

  const borderDefault = makeFoundation(
    "border-default",
    "Border",
    lightPrimary.neutral?.["200"]?.hex || "#E5E7EB",
    darkPrimary.neutral?.["800"]?.hex || "#1F2937",
    "neutral-200",
    "neutral-800"
  );
  const borderSubtle = makeFoundation(
    "border-subtle",
    "Border",
    lightPrimary.neutral?.["100"]?.hex || "#F3F4F6",
    darkPrimary.neutral?.["900"]?.hex || "#111827",
    "neutral-100",
    "neutral-900"
  );
  const borderStrong = makeFoundation(
    "border-strong",
    "Border",
    lightPrimary.neutral?.["300"]?.hex || "#D1D5DB",
    darkPrimary.neutral?.["700"]?.hex || "#374151",
    "neutral-300",
    "neutral-700"
  );

  const borderColors: FoundationColor[] = [
    getBorderSecondary("purple"),
    getBorderSecondary("orange"),
    borderDefault,
    statusBorderSuccess,
    statusBorderWarning,
    getBorderSecondary("blue"),
    getBorderSecondary("pink"),
    getBorderSecondary("brown"),
    statusBorderError,
    borderSubtle,
    borderStrong,
  ];

  const buttonColors: FoundationColor[] = [
    makeFoundation(
      "button-primary-bg",
      "Buttons",
      lightPrimary.Brand?.["600"]?.hex || "#1B73B5",
      darkPrimary.Brand?.["500"]?.hex || "#1B73B5",
      "Brand-600",
      "Brand-500"
    ),
    makeFoundation(
      "button-primary-hover",
      "Buttons",
      lightPrimary.Brand?.["700"]?.hex || "#003D6D",
      darkPrimary.Brand?.["600"]?.hex || "#0C5A99",
      "Brand-700",
      "Brand-600"
    ),
    makeFoundation(
      "button-secondary-bg",
      "Buttons",
      lightPrimary.neutral?.["100"]?.hex || "#F3F4F6",
      darkPrimary.neutral?.["800"]?.hex || "#1F2937",
      "neutral-100",
      "neutral-800"
    ),
    makeFoundation(
      "button-secondary-hover",
      "Buttons",
      lightPrimary.neutral?.["200"]?.hex || "#E5E7EB",
      darkPrimary.neutral?.["700"]?.hex || "#374151",
      "neutral-200",
      "neutral-700"
    ),
  ];

  return [...backgroundColors, ...textColors, ...borderColors, ...buttonColors];
}