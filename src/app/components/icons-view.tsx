import { copyToClipboard } from "../utils/clipboard";
import { getPrimaryColors, getSecondaryColors } from "../utils/token-parser";
import { useTheme } from "./theme-provider";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, ChevronDown, Copy, Check, Download, X, Minus, Plus, Code } from "lucide-react";
import { CodeModal } from "./code-modal";

// Icon categories matching Google Fonts categories
const iconCategories: Record<string, string[]> = {
  "All Icons": [],
  "Action": [
    "search", "home", "settings", "delete", "info", "check_circle", "favorite",
    "visibility", "bookmark", "lock", "language", "help", "schedule", "fingerprint",
    "trending_up", "history", "done", "power_settings_new", "verified", "zoom_in",
    "zoom_out", "build", "bug_report", "code", "extension", "explore", "lightbulb",
    "receipt", "shopping_cart", "thumb_up", "thumb_down", "star_rate", "token",
    "workspace_premium", "eco", "rocket_launch", "deployed_code", "lab_profile",
  ],
  "Alert": [
    "warning", "error", "notification_important", "report", "crisis_alert",
  ],
  "AV": [
    "play_arrow", "pause", "stop", "skip_next", "skip_previous", "volume_up",
    "volume_off", "mic", "videocam", "movie", "music_note", "playlist_play",
    "repeat", "shuffle", "speed", "equalizer", "library_music", "podcast",
  ],
  "Communication": [
    "mail", "chat", "call", "forum", "contact_mail", "mark_email_read",
    "send", "share", "rss_feed", "hub", "alternate_email", "sms",
    "contacts", "person_add", "group", "campaign", "cell_tower",
  ],
  "Content": [
    "add", "remove", "content_copy", "content_paste", "content_cut", "save",
    "undo", "redo", "flag", "link", "push_pin", "filter_list", "sort",
    "archive", "inventory", "draft", "edit_note", "select_all",
  ],
  "Device": [
    "smartphone", "laptop", "tablet", "desktop_windows", "watch", "mouse",
    "keyboard", "headphones", "memory", "battery_full", "bluetooth",
    "wifi", "signal_cellular_alt", "gps_fixed", "screen_rotation",
    "dark_mode", "light_mode", "developer_mode", "devices",
  ],
  "Editor": [
    "edit", "format_bold", "format_italic", "format_underlined",
    "format_list_bulleted", "format_list_numbered", "format_align_left",
    "format_align_center", "format_align_right", "title", "text_fields",
    "format_color_fill", "format_color_text", "insert_link",
    "insert_photo", "table_chart", "functions", "attach_file",
  ],
  "File": [
    "folder", "file_copy", "upload_file", "download", "upload",
    "cloud", "cloud_upload", "cloud_download", "snippet_folder",
    "topic", "drive_file_move", "create_new_folder",
  ],
  "Hardware": [
    "computer", "tv", "phone_android", "phone_iphone", "router",
    "scanner", "security", "sim_card", "storage", "usb",
  ],
  "Image": [
    "image", "photo_camera", "palette", "brush", "auto_fix_high",
    "filter", "gradient", "tune", "crop", "rotate_right",
    "flip", "blur_on", "hdr_on", "lens", "panorama",
    "photo_library", "slideshow", "camera_alt",
  ],
  "Maps": [
    "map", "place", "directions", "navigation", "near_me",
    "local_shipping", "flight", "train", "directions_car",
    "directions_bike", "directions_walk", "traffic", "layers",
    "my_location", "compass_calibration", "restaurant", "local_cafe",
    "local_hospital", "local_parking",
  ],
  "Navigation": [
    "menu", "arrow_back", "arrow_forward", "arrow_upward", "arrow_downward",
    "chevron_left", "chevron_right", "expand_more", "expand_less", "close",
    "more_vert", "more_horiz", "refresh", "fullscreen", "fullscreen_exit",
    "apps", "first_page", "last_page", "subdirectory_arrow_right",
  ],
  "Notification": [
    "notifications", "notifications_active", "notifications_off",
    "sync", "sync_disabled", "event_available", "priority_high",
    "do_not_disturb", "alarm", "timer",
  ],
  "Social": [
    "person", "group", "public", "share", "mood", "sentiment_satisfied",
    "sentiment_dissatisfied", "school", "workspace", "emoji_events",
    "military_tech", "psychology", "diversity_3", "handshake",
  ],
  "Toggle": [
    "toggle_on", "toggle_off", "check_box", "check_box_outline_blank",
    "radio_button_checked", "radio_button_unchecked", "star", "star_border",
    "indeterminate_check_box",
  ],
};

// Build "All Icons" list
iconCategories["All Icons"] = [...new Set(
  Object.entries(iconCategories)
    .filter(([k]) => k !== "All Icons")
    .flatMap(([, v]) => v)
)];

const sizes = [16, 20, 24, 32, 40] as const;
const categoryNames = Object.keys(iconCategories);

function get600Colors(): { name: string; hex: string }[] {
  return getColorsByShade("600");
}

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

  // Fallback if no colors found
  if (colors.length === 0) {
    colors.push(
      { name: `Brand ${shade}`, hex: shade === "400" ? "#42A5F5" : "#1570B8" },
      { name: `neutral ${shade}`, hex: shade === "400" ? "#9E9E9E" : "#525252" },
    );
  }
  return colors;
}

export function IconsView() {
  const { theme } = useTheme();
  const [selectedSize, setSelectedSize] = useState<number>(24);
  const [selectedCategory, setSelectedCategory] = useState("All Icons");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [iconSize, setIconSize] = useState<number>(24);
  const [iconColor, setIconColor] = useState<string | null>(null);
  const [iconColorOpen, setIconColorOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showCodeSheet, setShowCodeSheet] = useState(false);

  const availableColors = useMemo(() => getColorsByShade(theme === "dark" ? "400" : "600"), [theme]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0]?.hex || "#1570B8");
  const [colorOpen, setColorOpen] = useState(false);

  // Reset selected color when theme changes
  useEffect(() => {
    setSelectedColor(availableColors[0]?.hex || "#1570B8");
  }, [availableColors]);

  // Sync icon-specific controls when selecting an icon
  useEffect(() => {
    if (selectedIcon) {
      setIconSize(selectedSize);
      setIconColor(selectedColor);
    }
  }, [selectedIcon]);

  const icons = useMemo(() => {
    let list = iconCategories[selectedCategory] || iconCategories["All Icons"];
    if (searchQuery) {
      list = list.filter((icon) =>
        icon.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const handleIconClick = (iconName: string) => {
    if (selectedIcon === iconName) {
      setSelectedIcon(null);
    } else {
      setSelectedIcon(iconName);
      setIconSize(selectedSize);
      setIconColor(selectedColor);
      setCodeCopied(false);
    }
  };

  const handleCopyCode = async () => {
    if (!selectedIcon) return;
    setShowCodeSheet(true);
  };

  const handleDownloadSvg = useCallback(() => {
    if (!selectedIcon) return;
    const size = iconSize;
    const color = iconColor || selectedColor;
    // Create an SVG with the icon rendered as text
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

  const getIconStyle = (icon: string) => {
    const isSelected = selectedIcon === icon;
    return {
      fontSize: `${isSelected ? iconSize : selectedSize}px`,
      color: isSelected ? (iconColor || selectedColor) : selectedColor,
      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    };
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8 pr-72">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Icons
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Material Symbols Rounded · No fill · {icons.length} icons disponibles
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area with Right Controls */}
      <div className="flex">
        {/* Icon Grid */}
        <div className="flex-1 pr-72">
          {icons.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
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
              <span className="material-symbols-rounded text-5xl mb-3" style={{ fontVariationSettings: "'FILL' 0" }}>
                search_off
              </span>
              <p className="text-sm">No icons found</p>
            </div>
          )}
        </div>

        {/* Right Controls Panel - Fixed sidebar style */}
        <div className="fixed right-0 top-16 w-64 h-[calc(100vh-4rem)] shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-5 space-y-6 overflow-y-auto transition-colors z-10">
          
          {/* Selected Icon Detail Section */}
          {selectedIcon && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs text-gray-400 uppercase tracking-wider">Selected Icon</h3>
                  <button
                    onClick={() => setSelectedIcon(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Icon name */}
                <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                  {selectedIcon.replace(/_/g, " ")}
                </p>

                {/* Preview */}
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-rounded"
                      style={{
                        fontSize: `${Math.min(iconSize, 48)}px`,
                        color: iconColor || selectedColor,
                        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                      }}
                    >
                      {selectedIcon}
                    </span>
                  </div>
                  <div className="flex-1 space-y-3 pt-0.5">
                    {/* Size control */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Size</label>
                      <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setIconSize(Math.max(8, iconSize - 2))}
                          className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="flex-1 text-center text-xs text-gray-700 dark:text-gray-300 tabular-nums">{iconSize}</span>
                        <button
                          onClick={() => setIconSize(Math.min(96, iconSize + 2))}
                          className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {/* Color control */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider">Color</label>
                      <div className="relative">
                        <button
                          onClick={() => setIconColorOpen(!iconColorOpen)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                        >
                          <span
                            className="w-4 h-4 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                            style={{ backgroundColor: iconColor || selectedColor }}
                          />
                          <span className="font-mono text-[10px] text-gray-400">{iconColor || selectedColor}</span>
                          <ChevronDown className={`w-3 h-3 ml-auto shrink-0 transition-transform ${iconColorOpen ? "rotate-180" : ""}`} />
                        </button>
                        {iconColorOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setIconColorOpen(false)} />
                            <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {availableColors.map((color) => (
                                <button
                                  key={color.hex}
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
                                  <span className="text-gray-700 dark:text-gray-300 truncate">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1a2e] text-[#003d6d] dark:text-blue-300 border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-[12px] py-[8px]"
                  >
                    <Code className="w-3.5 h-3.5" />
                    Code
                  </button>
                  <button
                    onClick={handleDownloadSvg}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1a2e] text-[#003d6d] dark:text-blue-300 border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-[12px] py-[8px]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    SVG
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800" />
            </>
          )}

          <h3 className="text-xs text-gray-400 uppercase tracking-wider">{selectedIcon ? "Global Controls" : "Controls"}</h3>

          {/* Size */}
          <div className="space-y-1.5">
            <label className="text-sm text-gray-700 dark:text-gray-300 p-[0px]">Size</label>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                    selectedSize === size
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <label className="text-sm text-gray-700 dark:text-gray-300">Color</label>
            <div className="relative">
              <button
                onClick={() => setColorOpen(!colorOpen)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <span
                  className="w-5 h-5 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="truncate">{availableColors.find(c => c.hex === selectedColor)?.name || "Color"}</span>
                <span className="ml-auto text-gray-400 font-mono text-[10px]">{selectedColor}</span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${colorOpen ? "rotate-180" : ""}`} />
              </button>
              {colorOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setColorOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {availableColors.map((color) => (
                      <button
                        key={color.hex}
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
                        <span className="text-gray-700 dark:text-gray-300 truncate">{color.name}</span>
                        <span className="ml-auto text-gray-400 text-[10px] font-mono">{color.hex}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5 p-[0px]">
            <label className="text-sm text-gray-700 dark:text-gray-300">Category</label>
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <span>{selectedCategory}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCategoryOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {categoryNames.map((cat) => (
                      <button
                        key={cat}
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
        </div>
      </div>
      {showCodeSheet && selectedIcon && (
        <CodeModal
          onClose={() => setShowCodeSheet(false)}
          title={`Icon: ${selectedIcon.replace(/_/g, " ")}`}
          code={`<span class="material-symbols-rounded">${selectedIcon}</span>`}
        />
      )}
    </div>
  );
}