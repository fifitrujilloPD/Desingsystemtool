import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { ColorGroup } from "../utils/token-parser";
import { copyToClipboard } from "../utils/clipboard";

interface ColorColumnsProps {
  colors: ColorGroup;
}

export function ColorColumns({ colors }: ColorColumnsProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = async (hex: string) => {
    const success = await copyToClipboard(hex);
    if (success) {
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Object.entries(colors).map(([colorName, scales]) => (
        <div key={colorName} className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 capitalize">
            {colorName}
          </h3>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {Object.entries(scales).map(([scale, color]) => (
              <div
                key={scale}
                className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleCopy(color.hex)}
              >
                <div className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                  <div
                    className="w-10 h-10 rounded-md border border-gray-200 dark:border-gray-700 flex-shrink-0 relative"
                    style={{ backgroundColor: color.hex }}
                  >
                    {copiedColor === color.hex && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {scale}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {color.hex}
                    </p>
                  </div>
                  <Copy className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}