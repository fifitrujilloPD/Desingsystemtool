import lightTokens from "../../imports/Ligth_mode.tokens-3.json";

/**
 * Foundations / Borders.
 * Solo muestra los radios documentados en `global.radius` (Feature 02 / Figma)
 * con cuadrados de preview, nombre del token y variable CSS asociada.
 * Para colores de borde, ver Colors → Foundation Colors → Border.
 */

const RADIUS_KEYS = ["0", "4", "8", "10", "12", "16", "24"] as const;

interface RadiusToken {
  name: string;
  jsonKey: string;
  value: number;
  /** Alias en `ds-tokens.css` (cuando exista). El `10` es el radio base del DS. */
  dsAlias?: string;
}

function getRadiusTokens(): RadiusToken[] {
  const radius = (lightTokens as any)?.global?.radius;
  if (!radius) return [];

  return RADIUS_KEYS.flatMap((k) => {
    const def = radius[k];
    if (!def || (def as any).$type !== "number") return [];
    const value = (def as any).$value as number;
    return [
      {
        name: `radius-${k}`,
        jsonKey: k,
        value,
        dsAlias: k === "10" ? "--ds-radius-default" : undefined,
      },
    ];
  });
}

export function BordersView() {
  const tokens = getRadiusTokens();
  const maxValue = tokens.reduce((m, t) => (t.value > m ? t.value : m), 0);

  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Borders
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Escala de border-radius del sistema desde{" "}
          <span className="font-mono text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
            global.radius
          </span>
          . Para colores de borde, revisá{" "}
          <span className="font-mono">Colors → Foundation Colors → Border</span>.
        </p>
      </div>

      {/* Scale overview pill */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Radius scale
        </span>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-mono rounded-lg border border-blue-200 dark:border-blue-800">
          {tokens.length} tokens · 0–{maxValue}px
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          var(--ds-color-border-default)
        </span>
      </div>

      {/* Diagram: cuadrados con cada radio */}
      <div className="mb-12">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Diagram
        </h2>
        <div className="flex flex-wrap gap-6">
          {tokens.map((token) => (
            <div
              key={token.name}
              className="flex flex-col items-center gap-3"
            >
              <div
                aria-hidden
                className="bg-white dark:bg-gray-900 border-2"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: `${token.value}px`,
                  borderColor: "var(--ds-color-border-default)",
                }}
              />
              <div className="text-center">
                <div className="text-xs font-mono font-medium text-gray-900 dark:text-white">
                  {token.name}
                </div>
                <div className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                  {token.value}px
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spec list */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Tokens
        </h2>
        <div className="space-y-3">
          {tokens.map((token) => (
            <div
              key={`row-${token.name}`}
              className="group flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 px-5 py-4 rounded-xl bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
            >
              {/* Preview */}
              <div className="w-20 shrink-0 flex items-center justify-start">
                <div
                  aria-hidden
                  className="bg-gray-50 dark:bg-gray-800 border-2"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: `${token.value}px`,
                    borderColor: "var(--ds-color-border-default)",
                  }}
                />
              </div>

              {/* Token name */}
              <div className="w-40 shrink-0">
                <span className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                  {token.name}
                </span>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                  global.radius.{token.jsonKey}
                </p>
              </div>

              {/* Values */}
              <div className="w-[5.5rem] shrink-0 flex items-baseline gap-1.5">
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {token.value}px
                </span>
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                  {(token.value / 16).toFixed(token.value % 16 === 0 ? 0 : 3)}
                  rem
                </span>
              </div>

              {/* DS alias (si existe) */}
              <div className="flex-1 min-w-[120px]">
                {token.dsAlias && (
                  <span className="text-[11px] font-mono text-blue-700 dark:text-blue-300 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                    {token.dsAlias}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
