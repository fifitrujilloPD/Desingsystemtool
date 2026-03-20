import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { ColorGroup } from "../utils/token-parser";
import { copyToClipboard } from "../utils/clipboard";

interface ColorCardsProps {
  colors: ColorGroup;
}

export function ColorCards({ colors }: ColorCardsProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = async (hex: string) => {
    const success = await copyToClipboard(hex);
    if (success) {
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(colors).map(([colorName, scales]) => (
        <div key={colorName}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
            {colorName}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Object.entries(scales).map(([scale, color]) => (
              <div
                key={scale}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="h-24 cursor-pointer relative group"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleCopy(color.hex)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    {copiedColor === color.hex ? (
                      <div className="bg-white dark:bg-gray-900 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-900 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {colorName}-{scale}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {color.hex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}