import { getPrimaryColors, getSecondaryColors } from "../utils/token-parser";
import { useTheme } from "./theme-provider";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, ChevronDown, Download, X, Minus, Plus, Code } from "lucide-react";
import { CodeModal } from "./code-modal";
import { SegmentedControl } from "./design-system-controls";
import { categoryNames, iconCategories } from "../data/material-icon-catalog";
import {
  getFlagIconEntries,
  getFlagIconUrl,
  type FlagIconEntry,
} from "../data/flag-icons-catalog";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import {
  AlertIcon,
  AlertIconsTab,
  ALERT_ICON_SIZES,
  buildAlertSnippet,
  useResolvedAlerts,
  type AlertIconSize,
  type AlertSelection,
} from "./alert-icons-tab";
import {
  FileIcon,
  FileIconsTab,
  buildFileIconSvg,
  buildFileIconSnippet,
} from "./file-icons-tab";
import {
  FILE_ICON_SIZES,
  FILE_VARIANT_LABEL,
  type FileIconEntry,
  type FileIconSize,
} from "../data/file-icons-catalog";

const sizes = [16, 20, 24, 32, 40] as const;

const MATERIAL_ICON_CSS = `/* Material Symbols Rounded — outline (no fill) */
.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-weight: normal;
  font-style: normal;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}`;

type IconTab = "material" | "flags" | "alerts" | "files";

function getColorsByShade(shade: string): { name: string; hex: string }[] {
  const colors: { name: string; hex: string }[] = [];
  const primary = getPrimaryColors();
  const secondary = getSecondaryColors();

  for (const [name, scale] of Object.entries(primary)) {
    if (scale[shade]) colors.push({ name: `${name} ${shade}`, hex: scale[shade].hex });
  }
  for (const [name, scale] of Object.entries(secondary)) {
    if (scale[shade]) colors.push({ name: `${name} ${shade}`, hex: scale[shade].hex });
  }

  if (colors.length === 0) {
    colors.push(
      { name: `Brand ${shade}`, hex: shade === "400" ? "#42A5F5" : "#1570B8" },
      { name: `neutral ${shade}`, hex: shade === "400" ? "#9E9E9E" : "#525252" },
    );
  }
  return colors;
}

export function IconsView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const [iconTab, setIconTab] = useState<IconTab>("material");
  const [selectedSize, setSelectedSize] = useState<number>(24);
  const [alertSize, setAlertSize] = useState<AlertIconSize>(24);
  const [selectedAlert, setSelectedAlert] = useState<AlertSelection | null>(null);
  const resolvedAlerts = useResolvedAlerts();
  const selectedAlertResolved = selectedAlert
    ? resolvedAlerts.find((a) => a.state === selectedAlert.state) ?? null
    : null;

  const [fileSize, setFileSize] = useState<FileIconSize>(32);
  const [selectedFile, setSelectedFile] = useState<FileIconEntry | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Icons");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedFlag, setSelectedFlag] = useState<FlagIconEntry | null>(null);
  const [iconSize, setIconSize] = useState<number>(24);
  const [iconColor, setIconColor] = useState<string | null>(null);
  const [iconColorOpen, setIconColorOpen] = useState(false);
  const [showCodeSheet, setShowCodeSheet] = useState(false);

  const availableColors = useMemo(() => getColorsByShade(theme === "dark" ? "400" : "600"), [theme]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0]?.hex || "#1570B8");
  const [colorOpen, setColorOpen] = useState(false);

  const flagEntries = useMemo(() => getFlagIconEntries(), []);

  useEffect(() => {
    setSelectedColor(availableColors[0]?.hex || "#1570B8");
  }, [availableColors]);

  useEffect(() => {
    setShowCodeSheet(false);
    if (iconTab !== "alerts") setSelectedAlert(null);
    if (iconTab !== "files") setSelectedFile(null);
  }, [iconTab]);

  useEffect(() => {
    if (selectedIcon) {
      setIconSize(selectedSize);
      setIconColor(selectedColor);
    }
  }, [selectedIcon, selectedSize, selectedColor]);

  const icons = useMemo(() => {
    let list = iconCategories[selectedCategory] || iconCategories["All Icons"];
    if (searchQuery) {
      list = list.filter((icon) =>
        icon.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const filteredFlags = useMemo(() => {
    if (!searchQuery.trim()) return flagEntries;
    const q = searchQuery.toLowerCase();
    return flagEntries.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.iso2.toLowerCase().includes(q)
    );
  }, [flagEntries, searchQuery]);

  const handleIconClick = (iconName: string) => {
    setSelectedFlag(null);
    if (selectedIcon === iconName) {
      setSelectedIcon(null);
    } else {
      setSelectedIcon(iconName);
      setIconSize(selectedSize);
      setIconColor(selectedColor);
    }
  };

  const handleFlagClick = (entry: FlagIconEntry) => {
    setSelectedIcon(null);
    if (selectedFlag?.id === entry.id) {
      setSelectedFlag(null);
    } else {
      setSelectedFlag(entry);
    }
  };

  const handleCopyCode = () => {
    if (iconTab === "material" && selectedIcon) setShowCodeSheet(true);
  };

  const handleDownloadSvg = useCallback(() => {
    if (!selectedIcon) return;
    const size = iconSize;
    const color = iconColor || selectedColor;
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
    font-family="Material Symbols Rounded" font-size="${size}px"
    fill="${color}" style="font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;">
    ${selectedIcon}
  </text>
</svg>`;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedIcon}_${size}px.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedIcon, iconSize, iconColor, selectedColor]);

  const handleDownloadFileSvg = useCallback(() => {
    if (!selectedFile) return;
    const svg = buildFileIconSvg(selectedFile, 64);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `file-icon_${selectedFile.variant}_${selectedFile.label.replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleDownloadFlagSvg = useCallback(async () => {
    if (!selectedFlag) return;
    const url = getFlagIconUrl(selectedFlag, selectedSize);
    if (!url.endsWith(".svg")) return;
    const safeName =
      selectedFlag.name.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") ||
      selectedFlag.iso2;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const obj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = obj;
      a.download = `flag-${safeName}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(obj);
    } catch {
      window.open(url, "_blank");
    }
  }, [selectedFlag, selectedSize]);

  const getIconStyle = (icon: string) => {
    const isSelected = selectedIcon === icon;
    return {
      fontSize: `${isSelected ? iconSize : selectedSize}px`,
      color: isSelected ? (iconColor || selectedColor) : selectedColor,
      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    };
  };

  const codeModalContent = useMemo(() => {
    if (iconTab === "material" && selectedIcon) {
      return {
        title: `Icon: ${selectedIcon.replace(/_/g, " ")}`,
        html: `<span class="material-symbols-rounded">${selectedIcon}</span>`,
        css: MATERIAL_ICON_CSS,
      };
    }
    if (iconTab === "alerts" && selectedAlert && selectedAlertResolved) {
      const snippet = buildAlertSnippet(
        selectedAlertResolved,
        selectedAlert.variant,
        alertSize,
      );
      return {
        title: `Alert · ${selectedAlertResolved.label} · ${selectedAlert.variant}`,
        html: snippet.html,
        css: snippet.css,
      };
    }
    if (iconTab === "files" && selectedFile) {
      const snippet = buildFileIconSnippet(selectedFile);
      return {
        title: `File · ${selectedFile.label} · ${FILE_VARIANT_LABEL[selectedFile.variant]}`,
        html: snippet.html,
        css: snippet.css,
      };
    }
    return null;
  }, [iconTab, selectedIcon, selectedAlert, selectedAlertResolved, alertSize, selectedFile]);

  return (
    <div className="">
      <div className={`mb-8 ${contentPaddingClass}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Icons
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              {iconTab === "material" && (
                <>
                  Material Symbols Rounded · No fill · {icons.length} icons
                  disponibles
                </>
              )}
              {iconTab === "flags" && (
                <>
                  Country flags (Figma &quot;Country&quot; · nodo 75-2860) ·{" "}
                  {filteredFlags.length} banderas · SVG desde Figma (fallback flagcdn)
                </>
              )}
              {iconTab === "alerts" && (
                <>
                  Alert icons (Figma · nodo 556-147108) · estados
                  <span className="font-mono"> info / success / error </span>
                  con contenedor circle o badge.
                </>
              )}
              {iconTab === "files" && (
                <>
                  File icons (Figma · nodo 974-291724) · variantes
                  <span className="font-mono"> Solid / Outline + Color / Icon + Outline </span>
                  para extensiones y archivos genéricos.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Tabs — mismo patrón que Colors */}
        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIconTab("material");
              setSelectedFlag(null);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              iconTab === "material"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Material Icons
          </button>
          <button
            type="button"
            onClick={() => {
              setIconTab("flags");
              setSelectedIcon(null);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              iconTab === "flags"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Flag icons
          </button>
          <button
            type="button"
            onClick={() => {
              setIconTab("alerts");
              setSelectedIcon(null);
              setSelectedFlag(null);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              iconTab === "alerts"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Alert Icons
          </button>
          <button
            type="button"
            onClick={() => {
              setIconTab("files");
              setSelectedIcon(null);
              setSelectedFlag(null);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              iconTab === "files"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            File icons
          </button>
        </div>

        {iconTab !== "alerts" && iconTab !== "files" && (
          <div className="mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={
                  iconTab === "material"
                    ? "Search icons..."
                    : "Search country or code..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex">
        <div className={`flex-1 ${contentPaddingClass}`}>
          {iconTab === "material" && (
            <>
              {icons.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleIconClick(icon)}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                        selectedIcon === icon
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500"
                          : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      title={icon}
                    >
                      <div className="relative w-full flex items-center justify-center h-12">
                        <span
                          className="material-symbols-rounded transition-transform group-hover:scale-110"
                          style={getIconStyle(icon)}
                        >
                          {icon}
                        </span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 truncate max-w-full text-center leading-tight transition-colors text-[10px]">
                        {icon.replace(/_/g, " ")}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <span
                    className="material-symbols-rounded text-5xl mb-3"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    search_off
                  </span>
                  <p className="text-sm">No icons found</p>
                </div>
              )}
            </>
          )}

          {iconTab === "alerts" && (
            <AlertIconsTab
              size={alertSize}
              selected={selectedAlert}
              onSelect={setSelectedAlert}
            />
          )}

          {iconTab === "files" && (
            <FileIconsTab
              size={fileSize}
              selected={selectedFile}
              onSelect={setSelectedFile}
            />
          )}

          {iconTab === "flags" && (
            <>
              {filteredFlags.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
                  {filteredFlags.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => handleFlagClick(entry)}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                        selectedFlag?.id === entry.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500"
                          : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      title={entry.name}
                    >
                      <div className="relative w-full flex items-center justify-center h-12">
                        <img
                          src={getFlagIconUrl(entry, selectedSize)}
                          alt=""
                          width={selectedSize}
                          className="object-contain max-h-12 w-auto h-auto shadow-sm rounded-sm"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                      <span className="text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 truncate max-w-full text-center leading-tight transition-colors text-[10px]">
                        {entry.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <p className="text-sm">No flags found</p>
                </div>
              )}
            </>
          )}
        </div>

        <ControlsPanelFrame>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Controls
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {iconTab === "material" &&
                  "Configure grid size, color, and icon category."}
                {iconTab === "flags" &&
                  "Configure preview size for flag icons."}
                {iconTab === "alerts" &&
                  "Configure preview size for alert icons. Estados y colores vienen de Foundation."}
                {iconTab === "files" &&
                  "Configure preview size for file icons. Colores brand vienen del frame Figma 974:291724 (asset brand)."}
              </p>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-800" />

            {iconTab === "flags" && (
              <>
                <SegmentedControl
                  label="Size"
                  value={String(selectedSize)}
                  options={sizes.map((s) => ({
                    value: String(s),
                    label: `${s}px`,
                  }))}
                  onChange={(v) =>
                    setSelectedSize(Number(v) as (typeof sizes)[number])
                  }
                />
                <div className="h-px bg-gray-200 dark:bg-gray-800" />
              </>
            )}

            {iconTab === "alerts" && (
              <>
                <SegmentedControl
                  label="Size"
                  value={String(alertSize)}
                  options={ALERT_ICON_SIZES.map((s) => ({
                    value: String(s),
                    label: `${s}px`,
                  }))}
                  onChange={(v) => setAlertSize(Number(v) as AlertIconSize)}
                />

                {selectedAlertResolved && selectedAlert && (
                  <>
                    <div className="h-px bg-gray-200 dark:bg-gray-800" />
                    <div className="space-y-4" data-panel-section="alert-selected">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Selected alert
                        </h3>
                        <button
                          type="button"
                          onClick={() => setSelectedAlert(null)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          aria-label="Cerrar selección"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {selectedAlertResolved.label}
                        </p>
                        <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                          {selectedAlert.variant} · {alertSize}px
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 min-h-[120px]">
                        <AlertIcon
                          alert={selectedAlertResolved}
                          variant={selectedAlert.variant}
                          size={alertSize}
                        />
                      </div>

                      <div className="space-y-1.5 text-[11px] font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] w-14 shrink-0">
                            Color
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            var({selectedAlertResolved.iconCssVar})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] w-14 shrink-0">
                            Token
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            {selectedAlertResolved.iconJsonToken}
                          </span>
                        </div>
                        {selectedAlert.variant === "circle" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] w-14 shrink-0">
                              Border
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 truncate">
                              {selectedAlertResolved.borderJsonToken}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] w-14 shrink-0">
                              Border
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 truncate">
                              var(--ds-color-border-default)
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCodeSheet(true)}
                        className="w-full flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1a2e] text-[#003d6d] dark:text-blue-300 border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-[12px] py-[8px]"
                      >
                        <Code className="w-3.5 h-3.5" />
                        Ver código / variable
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {iconTab === "files" && (
              <>
                <SegmentedControl
                  label="Size"
                  value={String(fileSize)}
                  options={FILE_ICON_SIZES.map((s) => ({
                    value: String(s),
                    label: `${s}px`,
                  }))}
                  onChange={(v) => setFileSize(Number(v) as FileIconSize)}
                />

                {selectedFile && (
                  <>
                    <div className="h-px bg-gray-200 dark:bg-gray-800" />
                    <div className="space-y-4" data-panel-section="file-selected">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Selected file icon
                        </h3>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          aria-label="Cerrar selección"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                          {selectedFile.label}
                        </p>
                        <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                          {FILE_VARIANT_LABEL[selectedFile.variant]} · {fileSize}px
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 min-h-[120px]">
                        <FileIcon
                          variant={selectedFile.variant}
                          fileType={selectedFile.fileType}
                          brandHex={selectedFile.brandHex}
                          glyph={selectedFile.glyph}
                          size={Math.max(fileSize * 2, 48)}
                        />
                      </div>

                      <div className="space-y-1.5 text-[11px] font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] w-16 shrink-0">
                            Variant
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            {FILE_VARIANT_LABEL[selectedFile.variant]}
                          </span>
                        </div>
                        {selectedFile.brandHex && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] w-16 shrink-0">
                              Brand
                            </span>
                            <span
                              className="w-3 h-3 rounded-sm border border-gray-200 dark:border-gray-700 shrink-0"
                              style={{ backgroundColor: selectedFile.brandHex }}
                            />
                            <span className="text-gray-700 dark:text-gray-300 truncate">
                              EXTENSION_BRAND_HEX[&quot;{selectedFile.label}&quot;]
                            </span>
                          </div>
                        )}
                        {selectedFile.glyph && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] w-16 shrink-0">
                              Glyph
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 truncate">
                              {selectedFile.glyph}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] w-16 shrink-0">
                            Paper
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            var(--ds-color-surface-elevated)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px] w-16 shrink-0">
                            Border
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            var(--ds-color-border-default)
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCodeSheet(true)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1a2e] text-[#003d6d] dark:text-blue-300 border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-[12px] py-[8px]"
                        >
                          <Code className="w-3.5 h-3.5" />
                          Code
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadFileSvg}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1a2e] text-[#003d6d] dark:text-blue-300 border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-[12px] py-[8px]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          SVG
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {iconTab === "material" && selectedIcon && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Selected Icon
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedIcon(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                    {selectedIcon.replace(/_/g, " ")}
                  </p>

                  <div className="flex items-stretch gap-3">
                    <div className="w-[98px] h-[116px] rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-rounded"
                        style={{
                          fontSize: `${Math.min(iconSize, 48)}px`,
                          color: iconColor || selectedColor,
                          fontVariationSettings:
                            "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        }}
                      >
                        {selectedIcon}
                      </span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider">
                          Size
                        </label>
                        <div className="w-[88px] flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              setIconSize(Math.max(8, iconSize - 2))
                            }
                            className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="flex-1 text-center text-xs text-gray-700 dark:text-gray-300 tabular-nums">
                            {iconSize}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setIconSize(Math.min(96, iconSize + 2))
                            }
                            className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider">
                          Color
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIconColorOpen(!iconColorOpen)}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                          >
                            <span
                              className="w-4 h-4 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                              style={{
                                backgroundColor: iconColor || selectedColor,
                              }}
                            />
                            <span className="font-mono text-[10px] text-gray-400">
                              {iconColor || selectedColor}
                            </span>
                            <ChevronDown
                              className={`w-3 h-3 ml-auto shrink-0 transition-transform ${iconColorOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                          {iconColorOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIconColorOpen(false)}
                              />
                              <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {availableColors.map((color) => (
                                  <button
                                    key={color.hex}
                                    type="button"
                                    onClick={() => {
                                      setIconColor(color.hex);
                                      setIconColorOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-2 px-2.5 py-2 text-xs transition-colors ${
                                      (iconColor || selectedColor) === color.hex
                                        ? "bg-blue-50 dark:bg-blue-950 ring-1 ring-inset ring-blue-500"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                                  >
                                    <span
                                      className="w-4 h-4 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 truncate">
                                      {color.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1a2e] text-[#003d6d] dark:text-blue-300 border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-[12px] py-[8px]"
                    >
                      <Code className="w-3.5 h-3.5" />
                      Code
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSvg}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1a2e] text-[#003d6d] dark:text-blue-300 border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-[12px] py-[8px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      SVG
                    </button>
                  </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-800" />
              </>
            )}

            {iconTab === "flags" && selectedFlag && (
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Selected flag
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedFlag(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                    {selectedFlag.name}
                  </p>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {selectedFlag.iso2.toUpperCase()}
                  </p>

                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 min-h-[120px]">
                    <img
                      src={getFlagIconUrl(selectedFlag, selectedSize)}
                      alt={selectedFlag.name}
                      width={selectedSize}
                      className="object-contain max-w-full h-auto shadow-sm rounded"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadFlagSvg}
                    disabled={
                      !getFlagIconUrl(selectedFlag, selectedSize).endsWith(".svg")
                    }
                    title="Descarga solo disponible para asset SVG local"
                    className="w-full flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1a2e] text-[#003d6d] dark:text-blue-300 border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-[12px] py-[8px] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Download className="w-3.5 h-3.5" />
                    SVG
                  </button>
                </div>
            )}

            {iconTab === "material" && (
              <>
                <SegmentedControl
                  label="Size"
                  value={String(selectedSize)}
                  options={sizes.map((s) => ({
                    value: String(s),
                    label: `${s}px`,
                  }))}
                  onChange={(v) =>
                    setSelectedSize(Number(v) as (typeof sizes)[number])
                  }
                />
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Color
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setColorOpen(!colorOpen)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                    >
                      <span
                        className="w-5 h-5 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <span className="truncate">
                        {availableColors.find((c) => c.hex === selectedColor)
                          ?.name || "Color"}
                      </span>
                      <span className="ml-auto text-gray-400 font-mono text-[10px]">
                        {selectedColor}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${colorOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {colorOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setColorOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {availableColors.map((color) => (
                            <button
                              key={color.hex}
                              type="button"
                              onClick={() => {
                                setSelectedColor(color.hex);
                                setColorOpen(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors ${
                                selectedColor === color.hex
                                  ? "bg-blue-50 dark:bg-blue-950 ring-1 ring-inset ring-blue-500"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              <span
                                className="w-5 h-5 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-gray-700 dark:text-gray-300 truncate">
                                {color.name}
                              </span>
                              <span className="ml-auto text-gray-400 text-[10px] font-mono">
                                {color.hex}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCategoryOpen(!categoryOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                    >
                      <span>{selectedCategory}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {categoryOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setCategoryOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                          {categoryNames.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(cat);
                                setCategoryOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                                selectedCategory === cat
                                  ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              {cat}
                              <span className="ml-1 text-gray-400">
                                ({(iconCategories[cat] || []).length})
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ControlsPanelFrame>
      </div>

      {showCodeSheet && codeModalContent && (
        <CodeModal
          onClose={() => setShowCodeSheet(false)}
          title={codeModalContent.title}
          html={codeModalContent.html}
          css={codeModalContent.css}
        />
      )}
    </div>
  );
}
