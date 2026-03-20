import { X, Check, Copy, ChevronDown, Code2 } from "lucide-react";
import { useState, useEffect } from "react";
import { copyToClipboard } from "../utils/clipboard";

export function IconsCodeModal() {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const codeString = `<!-- Add to your HTML <head> -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

<!-- CSS Configuration -->
<style>
.material-symbols-rounded {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>

<!-- Usage Examples -->
<span class="material-symbols-rounded">home</span>
<span class="material-symbols-rounded">search</span>
<span class="material-symbols-rounded">settings</span>

<!-- With custom size and color -->
<span class="material-symbols-rounded" style="font-size: 32px; color: #1570B8;">
  favorite
</span>`;

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(codeString);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        title="View Code"
      >
        <Code2 className="w-4 h-4" />
        View Code
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={handleClose}
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isVisible ? "opacity-40" : "opacity-0"
            }`}
          />

          {/* Bottom Sheet */}
          <div
            className={`relative z-10 bg-white dark:bg-[#1e1e2e] rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ height: "55vh", minHeight: 320 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <h2 className="text-sm text-gray-800 dark:text-gray-200">Material Symbols Implementation</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto px-5 py-4 bg-gray-50 dark:bg-transparent">
              <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
