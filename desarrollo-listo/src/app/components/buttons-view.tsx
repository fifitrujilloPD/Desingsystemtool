import { useState, useMemo, useEffect } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import { allMaterialIconNames } from "../data/material-icon-catalog";
import {
  resolveJsonBackgroundColor,
  resolveJsonBorderColor,
  resolveJsonBrandColor,
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./buttons.module.css";

type ButtonStyle = "Primary" | "Outlined" | "Link";
type ButtonState = "Enabled" | "Hover" | "Press" | "Disabled";
type ButtonSize = "sm" | "md" | "lg" | "xl";
type ButtonColor = "Blue" | "Gray";
type IconPosition = "none" | "left" | "right" | "both";

export interface ButtonAppearance {
  bg: string;
  text: string;
  border: string;
  shadow: "inset" | "none";
}

const SIZE_LABELS: Record<ButtonSize, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
  xl: "Extra Large",
};

const BUTTON_STATE_TOKENS = [
  {
    label: "Default",
    token: "button-color",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") => resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Hover",
    token: "button-hover",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") => resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Pressed",
    token: "button-press",
    jsonPath: "Button color.button-press",
    resolve: (mode: "light" | "dark") => resolveJsonButtonColor("button-press", mode),
  },
  {
    label: "Disabled",
    token: "button-disabled",
    jsonPath: "Button color.button-disabled",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-disabled", mode),
  },
] as const;

export function resolveButtonAppearance(
  mode: "light" | "dark",
  style: ButtonStyle,
  state: ButtonState,
  color: ButtonColor,
): ButtonAppearance {
  const btn = (name: string) => resolveJsonButtonColor(name, mode);
  const txt = (name: string) => resolveJsonTextColor(name, mode);
  const bg = (name: string) => resolveJsonBackgroundColor(name, mode);
  const border = (name: string) => resolveJsonBorderColor(name, mode);

  const inkDisabled = txt("text-disabled");
  const inkBrand = txt("text-primary-brand");
  const onPrimary = txt("text-primary-white");

  if (style === "Primary") {
    const fill =
      state === "Disabled"
        ? btn("button-disabled")
        : state === "Press"
          ? btn("button-press")
          : state === "Hover"
            ? btn("button-hover")
            : btn("button-color");
    return {
      bg: fill,
      text: state === "Disabled" ? inkDisabled : onPrimary,
      border: "transparent",
      shadow: "inset",
    };
  }

  if (style === "Link") {
    return {
      bg:
        state === "Disabled"
          ? "transparent"
          : state === "Hover"
            ? bg("bg-container")
            : "transparent",
      text: state === "Disabled" ? inkDisabled : inkBrand,
      border: "transparent",
      shadow: "none",
    };
  }

  // Outlined — Blue vs Gray (Figma: border-brand vs border-primary)
  if (state === "Disabled") {
    return {
      bg: btn("button-disabled"),
      text: inkDisabled,
      border: border("border-primary"),
      shadow: "inset",
    };
  }

  let borderColor =
    color === "Blue" ? border("border-brand") : border("border-primary");
  let bgColor = bg("bg-container");

  if (state === "Hover") {
    if (color === "Blue") {
      bgColor = bg("bg-brand-ships");
      borderColor = resolveJsonBrandColor("50", mode);
    } else {
      bgColor = bg("bg-container");
      borderColor = border("border-primary");
    }
  }

  return {
    bg: bgColor,
    text: inkBrand,
    border: borderColor,
    shadow: "inset",
  };
}

function buttonCssVars(appearance: ButtonAppearance): React.CSSProperties {
  return {
    ["--ds-btn-bg" as string]: appearance.bg,
    ["--ds-btn-text" as string]: appearance.text,
    ["--ds-btn-border" as string]: appearance.border,
  };
}

export function CatalogButton({
  buttonStyle,
  buttonState,
  buttonColor,
  size,
  text,
  showText,
  iconPosition,
  leftIcon,
  rightIcon,
  appearance,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}: {
  buttonStyle: ButtonStyle;
  buttonState: ButtonState;
  buttonColor: ButtonColor;
  size: ButtonSize;
  text: string;
  showText: boolean;
  iconPosition: IconPosition;
  leftIcon: string;
  rightIcon: string;
  appearance: ButtonAppearance;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
}) {
  const isDisabled = buttonState === "Disabled";
  const showLeft = iconPosition === "left" || iconPosition === "both";
  const showRight = iconPosition === "right" || iconPosition === "both";

  return (
    <div
      className={styles.button}
      data-size={size}
      data-style={buttonStyle.toLowerCase()}
      data-color={buttonColor.toLowerCase()}
      data-disabled={isDisabled ? "true" : "false"}
      data-shadow={appearance.shadow === "none" ? "none" : undefined}
      style={buttonCssVars(appearance)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      role="button"
      aria-disabled={isDisabled}
    >
      {showLeft && (
        <span className={`material-symbols-rounded ${styles.materialIcon}`}>
          {leftIcon}
        </span>
      )}
      {showText && <span>{text}</span>}
      {showRight && (
        <span className={`material-symbols-rounded ${styles.materialIcon}`}>
          {rightIcon}
        </span>
      )}
    </div>
  );
}

function StateColorCard({
  label,
  hex,
  jsonPath,
}: {
  label: string;
  hex: string;
  jsonPath: string;
}) {
  return (
    <div className={shell.tokenRow}>
      <div
        className={shell.tokenSwatch}
        style={{ backgroundColor: hex === "transparent" ? undefined : hex }}
        title={hex}
      />
      <div className="min-w-0">
        <p className={shell.tokenTitle}>{label}</p>
        <p className={shell.tokenMeta}>JSON {jsonPath}</p>
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

function buildButtonSnippet(opts: {
  buttonStyle: ButtonStyle;
  buttonState: ButtonState;
  buttonColor: ButtonColor;
  size: ButtonSize;
  appearance: ButtonAppearance;
  buttonText: string;
  showText: boolean;
  iconPosition: IconPosition;
  leftIcon: string;
  rightIcon: string;
  jsonComment: string;
}): { html: string; css: string } {
  const {
    buttonStyle,
    buttonState,
    buttonColor,
    size,
    appearance,
    buttonText,
    showText,
    iconPosition,
    leftIcon,
    rightIcon,
    jsonComment,
  } = opts;

  const vars = [
    `--ds-btn-bg: ${appearance.bg}`,
    `--ds-btn-text: ${appearance.text}`,
    `--ds-btn-border: ${appearance.border}`,
  ].join("; ");

  const showLeft = iconPosition === "left" || iconPosition === "both";
  const showRight = iconPosition === "right" || iconPosition === "both";
  const indent = "  ";
  const children = [
    showLeft
      ? `${indent}<span class="material-symbols-rounded ds-button__icon">${leftIcon}</span>`
      : null,
    showText ? `${indent}<span>${buttonText}</span>` : null,
    showRight
      ? `${indent}<span class="material-symbols-rounded ds-button__icon">${rightIcon}</span>`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<button type="button" class="ds-button" data-style="${buttonStyle.toLowerCase()}" data-color="${buttonColor.toLowerCase()}" data-size="${size}" data-state="${buttonState.toLowerCase()}" style="${vars}"${buttonState === "Disabled" ? " disabled" : ""}>
${children}
</button>`;

  const css = `/* Button — Figma 2:7813 · ${jsonComment} */
.ds-button {
  --ds-btn-bg: transparent;
  --ds-btn-text: var(--ds-color-brand);
  --ds-btn-border: transparent;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid var(--ds-btn-border);
  background: var(--ds-btn-bg);
  color: var(--ds-btn-text);
  font-family: var(--ds-typography-font-family);
  font-weight: 600;
  cursor: pointer;
}

.ds-button[data-shadow="inset"] {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ds-color-control-ink) 10%, transparent),
    inset 0 -2px 2px 0 color-mix(in srgb, var(--ds-color-control-ink) 10%, transparent);
}

.ds-button__icon {
  font-size: 20px;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}`;

  return { html, css };
}

export function ButtonsView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>("Primary");
  const [buttonColor, setButtonColor] = useState<ButtonColor>("Blue");
  const [buttonState, setButtonState] = useState<ButtonState>("Enabled");
  const [size, setSize] = useState<ButtonSize>("md");
  const [iconPosition, setIconPosition] = useState<IconPosition>("both");
  const [leftIcon, setLeftIcon] = useState("arrow_back");
  const [rightIcon, setRightIcon] = useState("arrow_forward");
  const [buttonText, setButtonText] = useState("Button");
  const [showText, setShowText] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);
  const [previewPressed, setPreviewPressed] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const effectiveButtonState: ButtonState =
    buttonState === "Enabled"
      ? previewPressed
        ? "Press"
        : previewHover
          ? "Hover"
          : "Enabled"
      : buttonState;

  useEffect(() => {
    if (buttonState !== "Enabled") {
      setPreviewHover(false);
      setPreviewPressed(false);
    }
  }, [buttonState]);

  const previewAppearance = useMemo(
    () =>
      resolveButtonAppearance(
        mode,
        buttonStyle,
        effectiveButtonState,
        buttonColor,
      ),
    [mode, buttonStyle, effectiveButtonState, buttonColor],
  );

  const specAppearance = useMemo(
    () => resolveButtonAppearance(mode, buttonStyle, buttonState, buttonColor),
    [mode, buttonStyle, buttonState, buttonColor],
  );

  const stateColors = useMemo(
    () =>
      BUTTON_STATE_TOKENS.map((d) => ({
        label: d.label,
        hex: d.resolve(mode),
        jsonPath: d.jsonPath,
      })),
    [mode],
  );

  const jsonComment = useMemo(() => {
    if (buttonStyle === "Primary") {
      return `Primary · Button color.${BUTTON_STATE_TOKENS.find((t) => t.label === (buttonState === "Enabled" ? "Default" : buttonState === "Press" ? "Pressed" : buttonState))?.token || "button-color"}`;
    }
    if (buttonStyle === "Outlined") {
      const borderToken =
        buttonColor === "Blue"
          ? effectiveButtonState === "Hover"
            ? "Primary.Brand.50 (hover border)"
            : "Border color.border-brand"
          : "Border color.border-primary";
      return `Outlined ${buttonColor} · ${borderToken} · Text colors.text-primary-brand`;
    }
    return "Link · Text colors.text-primary-brand";
  }, [buttonStyle, buttonColor, effectiveButtonState, buttonState]);

  const codeSnippet = useMemo(
    () =>
      buildButtonSnippet({
        buttonStyle,
        buttonState,
        buttonColor,
        size,
        appearance: specAppearance,
        buttonText,
        showText,
        iconPosition,
        leftIcon,
        rightIcon,
        jsonComment,
      }),
    [
      buttonStyle,
      buttonState,
      buttonColor,
      size,
      specAppearance,
      buttonText,
      showText,
      iconPosition,
      leftIcon,
      rightIcon,
      jsonComment,
    ],
  );

  return (
    <div className={`${styles.root} flex gap-8`}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Explora, entiende y configura el componente botón del sistema de
          diseño. Colores desde JSON Feature 02 (
          <code className="font-mono text-[length:inherit]">--ds-btn-*</code>
          ).
        </p>

        <div className="mb-4">
          <div className={`${shell.previewCard} overflow-visible`}>
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
              <CatalogButton
                buttonStyle={buttonStyle}
                buttonState={effectiveButtonState}
                buttonColor={buttonColor}
                size={size}
                text={buttonText}
                showText={showText}
                iconPosition={iconPosition}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                appearance={previewAppearance}
                onMouseEnter={() => {
                  if (buttonState === "Enabled") setPreviewHover(true);
                }}
                onMouseLeave={() => {
                  if (buttonState === "Enabled") {
                    setPreviewHover(false);
                    setPreviewPressed(false);
                  }
                }}
                onMouseDown={() => {
                  if (buttonState === "Enabled") setPreviewPressed(true);
                }}
                onMouseUp={() => {
                  if (buttonState === "Enabled") setPreviewPressed(false);
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
                label="Font size (SM/MD)"
                value="var(--ds-typography-body-sm-font-size)"
              />
              <SpecRow
                label="Font size (LG/XL)"
                value="var(--ds-typography-body-md-font-size)"
              />
              <SpecRow label="Font weight" value="600 (Semibold)" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Border & Spacing</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Border radius" value="var(--ds-btn-radius)" />
              <SpecRow
                label="Border width"
                value={
                  buttonStyle === "Outlined"
                    ? "var(--ds-btn-border-w)"
                    : "0"
                }
              />
              <SpecRow label="Gap" value="var(--ds-btn-gap)" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>
              Colors — {buttonStyle}
              {buttonStyle === "Outlined" ? ` (${buttonColor})` : ""}
            </h3>
            <div className={shell.specDivider}>
              <StateColorCard
                label="Background"
                hex={specAppearance.bg}
                jsonPath={
                  buttonStyle === "Primary"
                    ? `Button color (fill)`
                    : buttonStyle === "Outlined" && buttonColor === "Blue"
                      ? effectiveButtonState === "Hover"
                        ? "Background.bg-brand-ships"
                        : "Background.bg-container"
                      : "Background.bg-container"
                }
              />
              <StateColorCard
                label="Text"
                hex={specAppearance.text}
                jsonPath={
                  buttonStyle === "Primary" && buttonState !== "Disabled"
                    ? "Text colors.text-primary-white"
                    : buttonState === "Disabled"
                      ? "Text colors.text-disabled"
                      : "Text colors.text-primary-brand"
                }
              />
              {buttonStyle === "Outlined" && (
                <StateColorCard
                  label="Border"
                  hex={specAppearance.border}
                  jsonPath={
                    buttonColor === "Blue"
                      ? effectiveButtonState === "Hover"
                        ? "Primary.Brand.50"
                        : "Border color.border-brand"
                      : "Border color.border-primary"
                  }
                />
              )}
            </div>
          </div>

          {buttonStyle === "Primary" && (
            <div className={shell.specCard}>
              <h3 className={shell.specHeading}>Button tokens (Primary)</h3>
              <div className={shell.specDivider}>
                {stateColors.map((sc) => (
                  <StateColorCard key={sc.label} {...sc} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ControlsPanelFrame>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={shell.panelTitle}>Controls</h2>
            <p className={shell.panelHint}>Configure the button properties</p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Style"
            value={buttonStyle}
            options={[
              { value: "Primary", label: "Primary" },
              { value: "Outlined", label: "Outlined" },
              { value: "Link", label: "Link" },
            ]}
            onChange={setButtonStyle}
          />

          {buttonStyle === "Outlined" && (
            <SegmentedControl
              label="Outline color"
              value={buttonColor}
              options={[
                { value: "Blue", label: "Blue" },
                { value: "Gray", label: "Gray" },
              ]}
              onChange={setButtonColor}
            />
          )}

          <SegmentedControl
            label="State"
            value={buttonState}
            options={[
              { value: "Enabled", label: "Default" },
              { value: "Hover", label: "Hover" },
              { value: "Press", label: "Press" },
              { value: "Disabled", label: "Disabled" },
            ]}
            onChange={setButtonState}
          />

          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { value: "sm", label: "SM" },
              { value: "md", label: "MD" },
              { value: "lg", label: "LG" },
              { value: "xl", label: "XL" },
            ]}
            onChange={setSize}
          />

          <SegmentedControl
            label="Icon position"
            value={iconPosition}
            options={[
              { value: "none", label: "None" },
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
              { value: "both", label: "Both" },
            ]}
            onChange={setIconPosition}
          />

          {(iconPosition === "left" || iconPosition === "both") && (
            <ControlSelect
              label="Left icon"
              value={leftIcon}
              options={allMaterialIconNames.map((i) => ({
                value: i,
                label: i.replace(/_/g, " "),
              }))}
              onChange={setLeftIcon}
            />
          )}

          {(iconPosition === "right" || iconPosition === "both") && (
            <ControlSelect
              label="Right icon"
              value={rightIcon}
              options={allMaterialIconNames.map((i) => ({
                value: i,
                label: i.replace(/_/g, " "),
              }))}
              onChange={setRightIcon}
            />
          )}

          <div className={shell.panelDivider} />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Text</span>
              <Switch
                checked={showText}
                onCheckedChange={setShowText}
                aria-label="Mostrar texto en el botón"
                style={showText ? switchOnStyle : undefined}
              />
            </label>
          </div>

          {showText && (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Button text
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          )}

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Style</span>
                <span className={shell.configVal}>{buttonStyle}</span>
              </div>
              {buttonStyle === "Outlined" && (
                <div className={shell.configRow}>
                  <span className={shell.configKey}>Outline</span>
                  <span className={shell.configVal}>{buttonColor}</span>
                </div>
              )}
              <div className={shell.configRow}>
                <span className={shell.configKey}>State</span>
                <span className={shell.configVal}>{buttonState}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Size</span>
                <span className={shell.configVal}>{SIZE_LABELS[size]}</span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Button — ${buttonStyle}${buttonStyle === "Outlined" ? ` ${buttonColor}` : ""} / ${buttonState} / ${SIZE_LABELS[size]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
