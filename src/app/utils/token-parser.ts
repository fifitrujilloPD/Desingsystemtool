import lightTokens from "../../imports/Ligth_mode.tokens-2.json";
import darkTokens from "../../imports/darkmode.tokens-2.json";

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
  const foundations: FoundationColor[] = [];

  const lightPrimary = parseColorGroup(lightTokens?.global?.Primary);
  const darkPrimary = parseColorGroup(darkTokens?.global?.Primary);

  // Background colors - using neutral scale
  foundations.push(
    {
      name: 'background-main',
      light: lightPrimary.neutral?.['50']?.hex || '#FFFFFF',
      dark: darkPrimary.neutral?.['950']?.hex || '#000000',
      lightToken: 'neutral-50',
      darkToken: 'neutral-950',
      category: 'Background',
    },
    {
      name: 'background-surface',
      light: lightPrimary.neutral?.['100']?.hex || '#F9FAFB',
      dark: darkPrimary.neutral?.['900']?.hex || '#0A0A0A',
      lightToken: 'neutral-100',
      darkToken: 'neutral-900',
      category: 'Background',
    },
    {
      name: 'background-hover',
      light: lightPrimary.neutral?.['200']?.hex || '#F3F4F6',
      dark: darkPrimary.neutral?.['800']?.hex || '#1A1A1A',
      lightToken: 'neutral-200',
      darkToken: 'neutral-800',
      category: 'Background',
    }
  );

  // Text colors
  foundations.push(
    {
      name: 'text-primary',
      light: lightPrimary.neutral?.['900']?.hex || '#111827',
      dark: darkPrimary.neutral?.['50']?.hex || '#F9FAFB',
      lightToken: 'neutral-900',
      darkToken: 'neutral-50',
      category: 'Text',
    },
    {
      name: 'text-secondary',
      light: lightPrimary.neutral?.['600']?.hex || '#475467',
      dark: darkPrimary.neutral?.['400']?.hex || '#9CA3AF',
      lightToken: 'neutral-600',
      darkToken: 'neutral-400',
      category: 'Text',
    },
    {
      name: 'text-tertiary',
      light: lightPrimary.neutral?.['500']?.hex || '#6B7280',
      dark: darkPrimary.neutral?.['500']?.hex || '#6B7280',
      lightToken: 'neutral-500',
      darkToken: 'neutral-500',
      category: 'Text',
    }
  );

  // Border colors
  foundations.push(
    {
      name: 'border-default',
      light: lightPrimary.neutral?.['200']?.hex || '#E5E7EB',
      dark: darkPrimary.neutral?.['800']?.hex || '#1F2937',
      lightToken: 'neutral-200',
      darkToken: 'neutral-800',
      category: 'Border',
    },
    {
      name: 'border-subtle',
      light: lightPrimary.neutral?.['100']?.hex || '#F3F4F6',
      dark: darkPrimary.neutral?.['900']?.hex || '#111827',
      lightToken: 'neutral-100',
      darkToken: 'neutral-900',
      category: 'Border',
    },
    {
      name: 'border-strong',
      light: lightPrimary.neutral?.['300']?.hex || '#D1D5DB',
      dark: darkPrimary.neutral?.['700']?.hex || '#374151',
      lightToken: 'neutral-300',
      darkToken: 'neutral-700',
      category: 'Border',
    }
  );

  // Button colors
  foundations.push(
    {
      name: 'button-primary-bg',
      light: lightPrimary.Brand?.['600']?.hex || '#1B73B5',
      dark: darkPrimary.Brand?.['500']?.hex || '#1B73B5',
      lightToken: 'Brand-600',
      darkToken: 'Brand-500',
      category: 'Buttons',
    },
    {
      name: 'button-primary-hover',
      light: lightPrimary.Brand?.['700']?.hex || '#003D6D',
      dark: darkPrimary.Brand?.['600']?.hex || '#0C5A99',
      lightToken: 'Brand-700',
      darkToken: 'Brand-600',
      category: 'Buttons',
    },
    {
      name: 'button-secondary-bg',
      light: lightPrimary.neutral?.['100']?.hex || '#F3F4F6',
      dark: darkPrimary.neutral?.['800']?.hex || '#1F2937',
      lightToken: 'neutral-100',
      darkToken: 'neutral-800',
      category: 'Buttons',
    },
    {
      name: 'button-secondary-hover',
      light: lightPrimary.neutral?.['200']?.hex || '#E5E7EB',
      dark: darkPrimary.neutral?.['700']?.hex || '#374151',
      lightToken: 'neutral-200',
      darkToken: 'neutral-700',
      category: 'Buttons',
    }
  );

  return foundations;
}