import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { ColorGroup } from "../utils/token-parser";
import { copyToClipboard } from "../utils/clipboard";

interface ColorRowsProps {
  colors: ColorGroup;
}

export function ColorRows({ colors }: ColorRowsProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = async (hex: string) => {
    const success = await copyToClipboard(hex);
    if (success) {
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  return (
    <div className="space-y-5">
      {Object.entries(colors).map(([colorName, scales]) => (
        <div key={colorName}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 capitalize">
            {colorName}
          </h3>
          <div className="flex gap-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            {Object.entries(scales).map(([scale, color]) => {
              const r = Math.round(color.components[0] * 255);
              const g = Math.round(color.components[1] * 255);
              const b = Math.round(color.components[2] * 255);
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              const textColor = luminance > 0.5 ? "text-gray-900" : "text-white";

              return (
                <div
                  key={scale}
                  className="flex-1 min-w-0 cursor-pointer group relative"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleCopy(color.hex)}
                >
                  <div className={`flex flex-col items-center justify-center py-6 px-1 ${textColor}`}>
                    <span className="text-xs font-semibold opacity-90">{scale}</span>
                    <span className="text-[10px] font-mono mt-1 opacity-70 truncate w-full text-center">
                      {color.hex}
                    </span>
                  </div>
                  {/* Copy overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/15 transition-colors">
                    {copiedColor === color.hex ? (
                      <Check className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
