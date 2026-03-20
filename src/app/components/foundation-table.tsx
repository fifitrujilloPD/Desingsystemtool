import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { FoundationColor } from "../utils/token-parser";
import { copyToClipboard } from "../utils/clipboard";

interface FoundationTableProps {
  colors: FoundationColor[];
}

function ColorPill({ color, hex, variant, copied, onCopy }: { color: string; hex: string; variant: "light" | "dark"; copied: boolean; onCopy: () => void }) {
  const isLight = variant === "light";
  return (
    <button
      onClick={onCopy}
      className={`inline-flex items-center gap-2.5 rounded-[14px] border px-1 py-1 pr-3.5 cursor-pointer transition-colors group ${
        isLight
          ? "bg-white border-[#e4e7ec] hover:border-gray-400"
          : "bg-[#1a1f2e] border-[#2d3548] hover:border-gray-500"
      }`}
    >
      <div
        className={`w-[32px] h-[32px] rounded-[10px] border flex-shrink-0 relative ${
          isLight ? "border-[#e4e7ec]" : "border-[#2d3548]"
        }`}
        style={{ backgroundColor: hex }}
      >
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[10px]">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <Copy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
      </div>
      <span className={`text-sm font-semibold tracking-[-0.15px] ${
        isLight ? "text-[#0b1220]" : "text-gray-200"
      }`}>
        {color}
      </span>
    </button>
  );
}

export function FoundationTable({ colors }: FoundationTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (hex: string, key: string) => {
    const success = await copyToClipboard(hex);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const groupedColors = colors.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {} as Record<string, FoundationColor[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedColors).map(([category, categoryColors]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {category}
          </h3>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: "30%" }} />
                <col style={{ width: "35%" }} />
                <col style={{ width: "35%" }} />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Light Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dark Mode
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {categoryColors.map((color) => (
                  <tr
                    key={color.name}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                        {color.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ColorPill
                        color={color.lightToken}
                        hex={color.light}
                        variant="light"
                        copied={copiedKey === `light-${color.name}`}
                        onCopy={() => handleCopy(color.light, `light-${color.name}`)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <ColorPill
                        color={color.darkToken}
                        hex={color.dark}
                        variant="dark"
                        copied={copiedKey === `dark-${color.name}`}
                        onCopy={() => handleCopy(color.dark, `dark-${color.name}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}