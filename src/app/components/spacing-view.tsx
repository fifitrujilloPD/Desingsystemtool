import lightTokens from "../../imports/Ligth_mode.tokens-3.json";

/** Orden y alias documentales; el valor numérico siempre viene del token JSON. */
const SPACING_SCALE: { semantic: string; jsonKey: string }[] = [
  { semantic: "spacing-half", jsonKey: "4" },
  { semantic: "spacing", jsonKey: "8" },
  { semantic: "spacing-1", jsonKey: "12" },
  { semantic: "spacing-2", jsonKey: "14" },
  { semantic: "spacing-3", jsonKey: "16" },
  { semantic: "spacing-4", jsonKey: "24" },
  { semantic: "spacing-5", jsonKey: "32" },
  { semantic: "spacing-6", jsonKey: "40" },
  { semantic: "spacing-7", jsonKey: "48" },
  { semantic: "spacing-8", jsonKey: "56" },
  { semantic: "spacing-9", jsonKey: "64" },
];

interface SpacingToken {
  semantic: string;
  jsonKey: string;
  value: number;
  rem: string;
  cssVar: string;
}

function getSpacingTokens(): SpacingToken[] {
  const spacingSection = (lightTokens as any)?.global?.spacing;
  if (!spacingSection) return [];

  return SPACING_SCALE.flatMap(({ semantic, jsonKey }) => {
    const def = spacingSection[jsonKey];
    if (!def || (def as any).$type !== "number") return [];
    const value = (def as any).$value as number;
    return [
      {
        semantic,
        jsonKey,
        value,
        rem: (value / 16).toFixed(value % 16 === 0 ? 0 : 2),
        cssVar: `--${semantic}`,
      },
    ];
  });
}

const MAX_BAR_WIDTH = 320;

export function SpacingView() {
  const tokens = getSpacingTokens();
  const maxValue = tokens[tokens.length - 1]?.value ?? 64;

  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Spacing
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Visualiza la escala de espaciado del sistema basada en el grid definido.
        </p>
      </div>

      {/* Scale overview pill */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Base unit
        </span>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-mono rounded-lg border border-blue-200 dark:border-blue-800">
          8pt grid
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {tokens.length} tokens · {tokens[0]?.value ?? 0}–{maxValue}px
        </span>
      </div>

      {/* Spacing rows */}
      <div className="space-y-3">
        {tokens.map((token) => {
          const barWidth = (token.value / maxValue) * MAX_BAR_WIDTH;

          return (
            <div
              key={token.semantic}
              className="group flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 px-5 py-4 rounded-xl bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
            >
              {/* Token name */}
              <div className="w-32 shrink-0">
                <span className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                  {token.semantic}
                </span>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                  global.spacing.{token.jsonKey}
                </p>
              </div>

              {/* Values */}
              <div className="w-[4.5rem] shrink-0 flex items-baseline gap-1.5">
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {token.value}px
                </span>
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                  {token.rem}rem
                </span>
              </div>

              {/* Visual bar */}
              <div className="flex-1 flex items-center min-w-[120px]">
                <div
                  className="h-3 rounded-sm bg-blue-500/20 dark:bg-blue-400/20 border border-blue-400/40 dark:border-blue-500/30 group-hover:bg-blue-500/30 dark:group-hover:bg-blue-400/30 transition-colors"
                  style={{ width: `${Math.max(barWidth, 2)}px` }}
                />
              </div>

              {/* CSS token */}
              <div className="shrink-0 hidden sm:block">
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 px-2 py-0.5 bg-gray-50 dark:bg-gray-800 rounded">
                  {token.cssVar}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid reference */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Visual reference
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          {tokens.map((token) => (
            <div key={token.semantic} className="flex flex-col items-center gap-2">
              <div
                className="bg-blue-500/15 dark:bg-blue-400/15 border border-blue-300/40 dark:border-blue-600/30 rounded-sm"
                style={{
                  width: `${Math.max(token.value, 8)}px`,
                  height: `${Math.max(token.value, 8)}px`,
                }}
              />
              <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500 text-center max-w-[56px] leading-tight">
                {token.value}px
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
