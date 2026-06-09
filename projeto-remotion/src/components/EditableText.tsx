/**
 * EditableText — span editável in-place via contentEditable.
 *
 * - editable=false → renderiza texto comum
 * - editable=true  → contentEditable. Clica, digita, Enter ou clica fora pra salvar.
 *
 * Usado pelo DevComposer pra permitir edição de labels de gráficos no Studio.
 * Em produção (compositions reais), passa editable=false (default).
 */

import React, { useEffect, useRef } from "react";

export type EditableTextProps = {
  value: string;
  onChange?: (newValue: string) => void;
  editable?: boolean;
  style?: React.CSSProperties;
  /** Tag HTML. Default 'span' */
  as?: "span" | "div";
  /** Hint visual de que o texto é editável (outline tracejado discreto) */
  showHint?: boolean;
};

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  editable = false,
  style,
  as = "span",
  showHint = true,
}) => {
  const ref = useRef<HTMLElement>(null);
  // Tracking pra evitar sobrescrever DOM enquanto user digita
  const lastSyncedValue = useRef<string>(value);

  // Quando o value muda EXTERNAMENTE (não pela própria digitação), sincroniza DOM
  useEffect(() => {
    if (!ref.current) return;
    if (value !== lastSyncedValue.current) {
      ref.current.textContent = value;
      lastSyncedValue.current = value;
    }
  }, [value]);

  if (!editable) {
    return React.createElement(as, { style }, value);
  }

  const editableStyle: React.CSSProperties = {
    ...style,
    outline: showHint ? "1px dashed rgba(255,215,0,0.3)" : "none",
    outlineOffset: 2,
    cursor: "text",
    minWidth: 20,
    minHeight: "1em",
    // permite quebras se o conteúdo for grande
    whiteSpace: "pre-wrap" as const,
  };

  return React.createElement(as, {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    style: editableStyle,
    onMouseDown: (e: React.MouseEvent) => {
      // evita que o drag do DevDraggable comece quando user clica no texto
      e.stopPropagation();
    },
    onBlur: () => {
      const newValue = ref.current?.textContent ?? "";
      if (newValue !== value) {
        lastSyncedValue.current = newValue;
        onChange?.(newValue);
      }
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        (e.currentTarget as HTMLElement).blur();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (ref.current) {
          ref.current.textContent = value; // restaura
        }
        (e.currentTarget as HTMLElement).blur();
      }
    },
  }, value);
};
