import { useState, useMemo, useEffect, useRef } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { allMaterialIconNames } from "../data/material-icon-catalog";
import {
  getFlagIconUrl,
  type FlagIconEntry,
} from "../data/flag-icons-catalog";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import {
  resolveJsonBorderColor,
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./inputs.module.css";

type InputType =
  | "Label text"
  | "Input text"
  | "Number default"
  | "Number floating";
type InputState = "Default" | "Focused" | "Filled" | "Error" | "Disabled";
type IconPosition = "none" | "left";

function isNumberInputType(type: InputType): boolean {
  return type === "Number default" || type === "Number floating";
}

function isNumberFloatingType(type: InputType): boolean {
  return type === "Number floating";
}

const INPUT_STATE_ATTR: Record<InputState, string> = {
  Default: "default",
  Focused: "focused",
  Filled: "filled",
  Error: "error",
  Disabled: "disabled",
};

const BORDER_COLOR_DEFS = [
  {
    label: "Default",
    cssVar: "--ds-input-border",
    jsonPath: "Border color.border-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", mode),
  },
  {
    label: "Focused",
    cssVar: "--ds-input-border-focus",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Error",
    cssVar: "--ds-input-border-error",
    jsonPath: "Text colors.text-error",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-error", mode),
  },
  {
    label: "Disabled",
    cssVar: "--ds-input-border",
    jsonPath: "Border color.border-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", mode),
  },
] as const;

const TEXT_COLOR_DEFS = [
  {
    label: "Primary",
    cssVar: "--ds-color-control-ink",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Secondary",
    cssVar: "--ds-color-control-ink-muted",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Disabled",
    cssVar: "--ds-input-text-disabled",
    jsonPath: "Text colors.text-disabled",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-disabled", mode),
  },
  {
    label: "Error",
    cssVar: "--ds-input-text-error",
    jsonPath: "Text colors.text-error",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-error", mode),
  },
] as const;

/**
 * Catálogo de prefijos: cada entrada referencia un asset de bandera
 * existente en Foundations / Flags (mismo set ISO2 que `flag-icons-catalog`).
 */
const COUNTRY_LIST: { code: string; iso2: string; name: string }[] = [
  { code: "+57", iso2: "co", name: "Colombia" },
  { code: "+1", iso2: "us", name: "Estados Unidos" },
  { code: "+52", iso2: "mx", name: "México" },
  { code: "+54", iso2: "ar", name: "Argentina" },
  { code: "+56", iso2: "cl", name: "Chile" },
  { code: "+51", iso2: "pe", name: "Perú" },
  { code: "+593", iso2: "ec", name: "Ecuador" },
  { code: "+58", iso2: "ve", name: "Venezuela" },
  { code: "+55", iso2: "br", name: "Brasil" },
  { code: "+34", iso2: "es", name: "España" },
  { code: "+44", iso2: "gb", name: "Reino Unido" },
  { code: "+49", iso2: "de", name: "Alemania" },
  { code: "+33", iso2: "fr", name: "Francia" },
  { code: "+39", iso2: "it", name: "Italia" },
  { code: "+81", iso2: "jp", name: "Japón" },
  { code: "+82", iso2: "kr", name: "Corea del Sur" },
  { code: "+91", iso2: "in", name: "India" },
  { code: "+86", iso2: "cn", name: "China" },
];

function CountryFlag({ iso2, name }: { iso2: string; name: string }) {
  const entry: FlagIconEntry = {
    id: `iso-${iso2}`,
    name,
    iso2: iso2.toLowerCase(),
  };
  return (
    <img
      className={styles.flagIcon}
      src={getFlagIconUrl(entry, 64)}
      alt={`Bandera ${name}`}
      width={24}
      height={24}
      loading="lazy"
      decoding="async"
    />
  );
}

export function CatalogInput({
  inputType,
  inputState,
  showIcon,
  iconName,
  labelText,
  valueText,
  placeholderText,
  helperText,
  showHelper,
  showRequired,
  numberPrefix,
  onValueChange,
  onPrefixChange,
  onFocus,
  onBlur,
  inputId = "input-preview-field",
  wrapClassName,
  wrapVariant = "default",
}: {
  inputType: InputType;
  inputState: InputState;
  showIcon: boolean;
  iconName: string;
  labelText: string;
  valueText: string;
  placeholderText: string;
  helperText: string;
  showHelper: boolean;
  showRequired: boolean;
  numberPrefix: string;
  onValueChange?: (value: string) => void;
  onPrefixChange?: (code: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Evita colisión de `id` cuando hay varios inputs en una molécula. */
  inputId?: string;
  wrapClassName?: string;
  wrapVariant?: "default" | "number" | "menu";
}) {
  const stateAttr = INPUT_STATE_ATTR[inputState];
  const isDisabled = inputState === "Disabled";
  const isFloating = inputType === "Input text";
  const isNumber = isNumberInputType(inputType);
  const numberFloating = isNumberFloatingType(inputType);
  const hasValue = valueText.trim().length > 0;

  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    COUNTRY_LIST.find((c) => c.code === numberPrefix) || COUNTRY_LIST[0];

  const filteredCountries = countrySearch
    ? COUNTRY_LIST.filter(
        (c) =>
          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.code.includes(countrySearch),
      )
    : COUNTRY_LIST;

  useEffect(() => {
    if (!countryOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
        setCountrySearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [countryOpen]);

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;
    if (inputState === "Focused" && !isDisabled) {
      input.focus();
    }
  }, [inputId, inputState, isDisabled]);

  const helperState =
    inputState === "Error"
      ? "error"
      : inputState === "Disabled"
        ? "disabled"
        : "default";

  const previewDataVariant = isNumber
    ? "number"
    : wrapVariant !== "default"
      ? wrapVariant
      : undefined;

  return (
    <div
      className={`${styles.previewWrap} ${wrapClassName ?? ""}`.trim()}
      data-variant={previewDataVariant}
    >
      {isNumber ? (
        <div
          className={styles.numberRow}
          data-state={stateAttr}
          ref={dropdownRef}
        >
          {numberFloating && labelText ? (
            <div className={styles.floatingLabel}>
              <span className={styles.floatingLabelText}>{labelText}</span>
              {showRequired ? (
                <span className={styles.requiredMark} aria-hidden>
                  *
                </span>
              ) : null}
            </div>
          ) : null}

          <div className={styles.numberCluster}>
          <div
            className={styles.prefix}
            data-disabled={isDisabled ? "true" : "false"}
            onClick={() => {
              if (!isDisabled) {
                setCountryOpen(!countryOpen);
                setCountrySearch("");
              }
            }}
          >
            <CountryFlag iso2={selectedCountry.iso2} name={selectedCountry.name} />
            <span
              className={`material-symbols-rounded ${styles.prefixChevron}`}
              data-open={countryOpen ? "true" : "false"}
              aria-hidden
            >
              arrow_drop_down
            </span>
          </div>

          <div className={styles.numberField}>
            <input
              id={inputId}
              type="text"
              className={styles.nativeInput}
              value={valueText}
              placeholder={
                numberFloating ? placeholderText : placeholderText || "Label"
              }
              disabled={isDisabled}
              onChange={(e) => onValueChange?.(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          </div>

          {countryOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownSearchWrap}>
                <input
                  type="text"
                  className={styles.dropdownSearch}
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Buscar país..."
                  autoFocus
                />
              </div>
              {filteredCountries.map((c) => (
                <div
                  key={c.code}
                  className={styles.dropdownItem}
                  data-selected={c.code === numberPrefix ? "true" : "false"}
                  onClick={() => {
                    onPrefixChange?.(c.code);
                    setCountryOpen(false);
                    setCountrySearch("");
                  }}
                >
                  <CountryFlag iso2={c.iso2} name={c.name} />
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span className={styles.dropdownItemCode}>{c.code}</span>
                </div>
              ))}
              {filteredCountries.length === 0 && (
                <div className={styles.dropdownEmpty}>
                  Sin resultados
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={styles.field}
          data-state={stateAttr}
          data-has-value={hasValue ? "true" : "false"}
        >
          {showIcon && (
            <span className={`material-symbols-rounded ${styles.materialIcon}`}>
              {iconName}
            </span>
          )}

          {isFloating && (
            <div className={styles.floatingLabel}>
              <span className={styles.floatingLabelText}>{labelText}</span>
              {showRequired && (
                <span className={styles.requiredMark} aria-hidden>
                  *
                </span>
              )}
            </div>
          )}

          <input
            id={inputId}
            type="text"
            className={styles.nativeInput}
            value={valueText}
            placeholder={placeholderText}
            disabled={isDisabled}
            onChange={(e) => onValueChange?.(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      )}

      {showHelper && (
        <div className={styles.helper} data-state={helperState}>
          {helperText}
        </div>
      )}
    </div>
  );
}

function StateColorCard({
  label,
  hex,
  cssVar,
  jsonPath,
}: {
  label: string;
  hex: string;
  cssVar: string;
  jsonPath: string;
}) {
  return (
    <div className={shell.tokenRow}>
      <div
        className={shell.tokenSwatch}
        style={{ backgroundColor: `var(${cssVar})` }}
        title={hex}
      />
      <div className="min-w-0">
        <p className={shell.tokenTitle}>{label}</p>
        <p className={shell.tokenMeta}>
          var({cssVar}) · JSON {jsonPath}
        </p>
        <p className={shell.tokenHex}>{hex}</p>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={shell.specRow}>
      <span className={shell.specLabel}>{label}</span>
      <span className={shell.specValue}>{value}</span>
    </div>
  );
}

function buildInputSnippet(opts: {
  inputType: InputType;
  inputState: InputState;
  showIcon: boolean;
  iconName: string;
  labelText: string;
  placeholderText: string;
  helperText: string;
  showHelper: boolean;
  showRequired: boolean;
  valueText: string;
  numberPrefix?: string;
}): { html: string; css: string } {
  const {
    inputType,
    inputState,
    showIcon,
    iconName,
    labelText,
    placeholderText,
    helperText,
    showHelper,
    showRequired,
    valueText,
    numberPrefix = "+57",
  } = opts;
  const numberFloating = isNumberFloatingType(inputType);
  const stateAttr = INPUT_STATE_ATTR[inputState];
  const disabled = inputState === "Disabled";

  const baseCss = `/* Input — Figma 2:8432 · tokens Feature 02 */
.ds-input {
  --ds-input-radius: 8px;
  --ds-input-padding-x: 12px;
  --ds-input-padding-y: 10px;
  --ds-input-border-w: 1px;
  --ds-input-current-border: var(--ds-input-border);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: var(--ds-input-padding-y) var(--ds-input-padding-x);
  border-radius: var(--ds-input-radius);
  border: var(--ds-input-border-w) solid var(--ds-input-current-border);
  font-family: var(--ds-typography-font-family);
  font-size: var(--ds-typography-body-md-font-size);
  line-height: var(--ds-typography-body-md-line-height);
  width: 320px;
  position: relative;
  background: transparent;
}

.ds-input[data-state="focused"] {
  --ds-input-current-border: var(--ds-input-border-focus);
  --ds-input-border-w: 1.5px;
}

.ds-input[data-state="error"] {
  --ds-input-current-border: var(--ds-input-border-error);
}

.ds-input[data-state="disabled"] {
  opacity: 0.7;
  cursor: not-allowed;
}

.ds-input__native {
  flex: 1;
  border: none;
  outline: none;
  font: inherit;
  background: transparent;
  color: var(--ds-color-control-ink);
}

.ds-input__floating-label {
  position: absolute;
  top: -8px;
  left: 10px;
  padding: 0 4px;
  font-size: var(--ds-typography-body-xs-font-size);
  background: var(--ds-input-surface);
  color: var(--ds-color-control-ink);
}

.ds-input__helper {
  margin-top: 2px;
  padding-left: 8px;
  font-size: var(--ds-typography-body-sm-font-size);
  color: var(--ds-color-control-ink-muted);
}

.ds-input__helper[data-state="error"] {
  color: var(--ds-input-text-error);
}`;

  const iconHtml = showIcon
    ? `\n  <span class="material-symbols-rounded">${iconName}</span>`
    : "";

  const floatingHtml =
    inputType === "Input text"
      ? `\n  <label class="ds-input__floating-label">${labelText}${showRequired ? " *" : ""}</label>`
      : "";

  const selectedCountry =
    COUNTRY_LIST.find((c) => c.code === numberPrefix) || COUNTRY_LIST[0];
  const flagUrl = getFlagIconUrl(
    {
      id: `iso-${selectedCountry.iso2}`,
      name: selectedCountry.name,
      iso2: selectedCountry.iso2,
    },
    64,
  );
  const numberPlaceholder = numberFloating
    ? placeholderText
    : placeholderText || "Label";
  const numberFloatingHtml =
    numberFloating && labelText
      ? `\n  <label class="ds-input__floating-label">${labelText}${showRequired ? " *" : ""}</label>`
      : "";

  let html = "";
  if (isNumberInputType(inputType)) {
    html = `<div class="ds-input-number" data-state="${stateAttr}">${numberFloatingHtml}
  <div class="ds-input-number__cluster">
  <div class="ds-input-prefix"${disabled ? ' data-disabled="true"' : ""}>
    <img class="ds-input__flag" src="${flagUrl}" alt="Bandera ${selectedCountry.name}" width="24" height="24" />
    <span class="material-symbols-rounded" aria-hidden="true">arrow_drop_down</span>
  </div>
  <div class="ds-input ds-input--number-field" data-state="${stateAttr}">
    <input class="ds-input__native" type="text" value="${valueText}" placeholder="${numberPlaceholder}"${disabled ? " disabled" : ""} />
  </div>
  </div>
</div>`;
  } else {
    html = `<div class="ds-input" data-state="${stateAttr}" data-has-value="${valueText.trim() ? "true" : "false"}">${floatingHtml}${iconHtml}
  <input class="ds-input__native" type="text" placeholder="${placeholderText}" value="${valueText}"${disabled ? " disabled" : ""} />
</div>`;
  }

  if (showHelper) {
    html += `\n<p class="ds-input__helper" data-state="${stateAttr === "error" ? "error" : "default"}">${helperText}</p>`;
  }

  return { html, css: baseCss };
}

export function InputsView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [inputType, setInputType] = useState<InputType>("Label text");
  const [inputState, setInputState] = useState<InputState>("Default");
  const [iconPosition, setIconPosition] = useState<IconPosition>("left");
  const [iconName, setIconName] = useState("radio_button_unchecked");
  const [labelText, setLabelText] = useState("Tipo de documento");
  const [numberPrefix, setNumberPrefix] = useState("+57");
  const [valueText, setValueText] = useState("Label");
  const [placeholderText, setPlaceholderText] = useState("Label");
  const [helperText, setHelperText] = useState("Subtitle");
  const [showHelper, setShowHelper] = useState(true);
  const [showRequired, setShowRequired] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [previewFocused, setPreviewFocused] = useState(false);

  const showIcon = iconPosition !== "none";
  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const effectiveState: InputState =
    inputState === "Default" && previewFocused ? "Focused" : inputState;

  useEffect(() => {
    if (inputState !== "Default") setPreviewFocused(false);
  }, [inputState]);

  const stateColors = useMemo(
    () =>
      BORDER_COLOR_DEFS.map((d) => ({
        label: d.label,
        cssVar: d.cssVar,
        jsonPath: d.jsonPath,
        hex: d.resolve(mode),
      })),
    [mode],
  );

  const textColors = useMemo(
    () =>
      TEXT_COLOR_DEFS.map((d) => ({
        label: d.label,
        cssVar: d.cssVar,
        jsonPath: d.jsonPath,
        hex: d.resolve(mode),
      })),
    [mode],
  );

  const codeSnippet = useMemo(
    () =>
      buildInputSnippet({
        inputType,
        inputState,
        showIcon,
        iconName,
        labelText,
        placeholderText,
        helperText,
        showHelper,
        showRequired,
        valueText,
        numberPrefix,
      }),
    [
      inputType,
      inputState,
      showIcon,
      iconName,
      labelText,
      placeholderText,
      helperText,
      showHelper,
      showRequired,
      valueText,
      numberPrefix,
    ],
  );

  return (
    <div className={`${styles.root} flex gap-8`}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Explora, entiende y configura el componente input del sistema de
          diseño. Colores vía{" "}
          <code className="font-mono text-[length:inherit]">var(--ds-*)</code>{" "}
          alineados a Feature 02 (Figma 2:8432).
        </p>

        <div className="mb-4">
          <div
            className={`${shell.previewCard} overflow-visible`}
            style={{ boxSizing: "content-box" }}
          >
            <div className={shell.previewDivider} />
            <div className={shell.previewToolbar}>
              <h2 className={shell.previewTitle}>Preview</h2>
              <button
                type="button"
                onClick={() => setShowCodeModal(true)}
                className={shell.codeButton}
                title="View Code"
              >
                <CodeXml className="w-5 h-5" />
              </button>
            </div>
            <div className={shell.previewStage}>
              <CatalogInput
                inputType={inputType}
                inputState={effectiveState}
                showIcon={showIcon}
                iconName={iconName}
                labelText={labelText}
                valueText={valueText}
                placeholderText={placeholderText}
                helperText={helperText}
                showHelper={showHelper}
                showRequired={showRequired}
                numberPrefix={numberPrefix}
                onValueChange={setValueText}
                onPrefixChange={setNumberPrefix}
                onFocus={() => {
                  if (inputState === "Default") setPreviewFocused(true);
                }}
                onBlur={() => {
                  if (inputState === "Default") setPreviewFocused(false);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Font family"
                value="var(--ds-typography-font-family)"
              />
              <SpecRow
                label="Label size"
                value="var(--ds-typography-body-md-font-size) / var(--ds-typography-body-md-line-height)"
              />
              <SpecRow
                label="Floating label"
                value="var(--ds-typography-body-xs-font-size)"
              />
              <SpecRow
                label="Helper text"
                value="var(--ds-typography-body-sm-font-size) / var(--ds-typography-body-sm-line-height)"
              />
              <SpecRow label="Font weight" value="400 (Regular)" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Border & Spacing</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Border radius" value="var(--ds-input-radius)" />
              <SpecRow
                label="Border width"
                value="var(--ds-input-border-w) (1.5px en focus)"
              />
              <SpecRow label="Padding X" value="var(--ds-input-padding-x)" />
              <SpecRow label="Padding Y" value="var(--ds-input-padding-y)" />
              <SpecRow label="Icon gap" value="8px" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Border Colors (States)</h3>
            <div className={shell.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={sc.label} {...sc} />
              ))}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Text Colors</h3>
            <div className={shell.specDivider}>
              {textColors.map((tc) => (
                <StateColorCard key={tc.label} {...tc} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ControlsPanelFrame>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={shell.panelTitle}>Controls</h2>
            <p className={shell.panelHint}>Configure the input properties</p>
          </div>

          <div className={shell.panelDivider} />

          <ControlSelect
            label="Type"
            value={inputType}
            options={[
              { value: "Label text", label: "Default" },
              { value: "Input text", label: "Floating" },
              { value: "Number default", label: "Number default" },
              { value: "Number floating", label: "Number floating" },
            ]}
            onChange={setInputType}
          />

          <SegmentedControl
            label="State"
            value={inputState}
            options={[
              { value: "Default", label: "Default" },
              { value: "Focused", label: "Focus" },
              { value: "Filled", label: "Filled" },
              { value: "Error", label: "Error" },
              { value: "Disabled", label: "Disabled" },
            ]}
            onChange={setInputState}
          />

          <div className={shell.panelDivider} />

          {!isNumberInputType(inputType) && (
            <div>
              <label className="flex items-center justify-between gap-4">
                <span className={shell.panelLabel}>Icon</span>
                <Switch
                  checked={showIcon}
                  onCheckedChange={(v) => setIconPosition(v ? "left" : "none")}
                  aria-label="Mostrar icono"
                  style={showIcon ? switchOnStyle : undefined}
                />
              </label>
            </div>
          )}

          {!isNumberInputType(inputType) && showIcon && (
            <ControlSelect
              label="Icon"
              value={iconName}
              options={allMaterialIconNames.map((i) => ({
                value: i,
                label: i.replace(/_/g, " "),
              }))}
              onChange={setIconName}
            />
          )}

          {isNumberInputType(inputType) && (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Prefix
              </label>
              <input
                type="text"
                value={numberPrefix}
                onChange={(e) => setNumberPrefix(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          )}

          <div className={shell.panelDivider} />

          {inputType === "Input text" && (
            <div>
              <label className="flex items-center justify-between gap-4">
                <span className={shell.panelLabel}>Required</span>
                <Switch
                  checked={showRequired}
                  onCheckedChange={setShowRequired}
                  aria-label="Campo requerido"
                  style={showRequired ? switchOnStyle : undefined}
                />
              </label>
            </div>
          )}

          {(inputType === "Input text" || inputType === "Number floating") && (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Label Text
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          )}

          {inputType === "Number floating" && (
            <div>
              <label className="flex items-center justify-between gap-4">
                <span className={shell.panelLabel}>Required</span>
                <Switch
                  checked={showRequired}
                  onCheckedChange={setShowRequired}
                  aria-label="Campo requerido"
                  style={showRequired ? switchOnStyle : undefined}
                />
              </label>
            </div>
          )}

          {inputType === "Input text" && (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Value
              </label>
              <input
                type="text"
                value={valueText}
                onChange={(e) => setValueText(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          )}

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>
              Placeholder
            </label>
            <input
              type="text"
              value={placeholderText}
              onChange={(e) => setPlaceholderText(e.target.value)}
              className={shell.panelInput}
            />
          </div>

          <div className={shell.panelDivider} />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Helper Text</span>
              <Switch
                checked={showHelper}
                onCheckedChange={setShowHelper}
                aria-label="Mostrar texto de ayuda"
                style={showHelper ? switchOnStyle : undefined}
              />
            </label>
          </div>

          {showHelper && (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Helper / Error Text
              </label>
              <input
                type="text"
                value={helperText}
                onChange={(e) => setHelperText(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          )}

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current Config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Type</span>
                <span className={shell.configVal}>{inputType}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>State</span>
                <span className={shell.configVal}>{inputState}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Border (focus)</span>
                <span className={shell.configValMono}>
                  --ds-input-border-focus
                </span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Input — ${inputType} / ${inputState}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
