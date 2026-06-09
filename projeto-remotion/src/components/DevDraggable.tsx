import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getRemotionEnvironment, useCurrentFrame, useVideoConfig } from "remotion";
import { DevFloatingPanel } from "./DevFloatingPanel";

// ─── Types ────────────────────────────────────────────────────────────────────
export type DevPos = {
  top: number;
  left: number;
  width: number;
  height?: number;
  fontSize?: number;
  text?: string;
  startMs?: number;
  endMs?: number;
  /** Props extras editáveis (chave→valor). Ex: { headerTitle: "FOME", label1: "MAÇÃ" } */
  extras?: Record<string, string>;
};

/** Helpers passados pro children do DevDraggable */
export type DevDraggableHelpers = {
  /** Atualiza parcialmente o pos do item */
  setPos: (patch: Partial<DevPos>) => void;
  /** Conveniência: atualiza uma chave do extras */
  setExtra: (key: string, value: string) => void;
  /** Indica se este item está selecionado no HUD */
  isActive: boolean;
};

type DragMode = "move" | "resize-w" | "resize-h" | "resize-wh";

type CtxValue = {
  isStudio: boolean;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  positions: Record<string, DevPos>;
  labels: Record<string, string>;
  initials: Record<string, DevPos>;
  registerItem: (id: string, label: string, initial: DevPos) => void;
  setPosition: (id: string, pos: DevPos) => void;
  resetItem: (id: string) => void;
};

const Ctx = createContext<CtxValue | null>(null);
const STORAGE_PREFIX = "devdraggable:";

const detectStudio = (): boolean => {
  try {
    return getRemotionEnvironment().isStudio;
  } catch {
    return process.env.NODE_ENV !== "production";
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const DevDraggableProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isStudio = detectStudio();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, DevPos>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [initials, setInitials] = useState<Record<string, DevPos>>({});

  const registerItem = useCallback(
    (id: string, label: string, initial: DevPos) => {
      setLabels((l) => (l[id] === label ? l : { ...l, [id]: label }));
      setInitials((i) => {
        const ex = i[id];
        if (
          ex &&
          ex.top === initial.top &&
          ex.left === initial.left &&
          ex.width === initial.width &&
          ex.height === initial.height &&
          ex.fontSize === initial.fontSize &&
          ex.text === initial.text &&
          JSON.stringify(ex.extras) === JSON.stringify(initial.extras)
        )
          return i;
        return { ...i, [id]: initial };
      });
      setPositions((p) => {
        if (p[id]) return p;
        let start = initial;
        try {
          if (typeof window !== "undefined") {
            const saved = window.localStorage.getItem(STORAGE_PREFIX + id);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (
                typeof parsed.top === "number" &&
                typeof parsed.left === "number" &&
                typeof parsed.width === "number"
              ) {
                // merge: localStorage overrides initial, preserving extra fields from initial
                start = { ...initial, ...parsed };
              }
            }
          }
        } catch {}
        return { ...p, [id]: start };
      });
    },
    []
  );

  const setPosition = useCallback((id: string, pos: DevPos) => {
    setPositions((p) => ({ ...p, [id]: pos }));
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(pos));
      }
    } catch {}
  }, []);

  const resetItem = useCallback(
    (id: string) => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_PREFIX + id);
        }
      } catch {}
      setPositions((p) => {
        const init = initials[id];
        if (!init) return p;
        return { ...p, [id]: init };
      });
    },
    [initials]
  );

  const value = useMemo<CtxValue>(
    () => ({
      isStudio,
      activeId,
      setActiveId,
      positions,
      labels,
      initials,
      registerItem,
      setPosition,
      resetItem,
    }),
    [isStudio, activeId, positions, labels, initials, registerItem, setPosition, resetItem]
  );

  if (!isStudio) return <>{children}</>;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

// ─── Item ─────────────────────────────────────────────────────────────────────
type DevDraggableProps = {
  id?: string;
  initialTop: number;
  initialLeft: number;
  initialWidth: number;
  /** Altura inicial do overlay (px no canvas). Se omitido usa 1.2 × width. */
  initialHeight?: number;
  /** fontSize inicial (px). Scroll ↑↓ ajusta ±1. */
  initialFontSize?: number;
  /** Texto editável inicial (ex: nome do TitleCard). */
  initialText?: string;
  label?: string;
  /** @deprecated Use initialHeight. Fallback compat. */
  handleHeight?: number;
  /** Extras iniciais (sobrescrevem defaults da componente filha) */
  initialExtras?: Record<string, string>;
  children: (pos: DevPos, helpers: DevDraggableHelpers) => React.ReactNode;
};

export const DevDraggable: React.FC<DevDraggableProps> = ({
  id,
  initialTop,
  initialLeft,
  initialWidth,
  initialHeight,
  initialFontSize,
  initialText,
  initialExtras,
  label,
  handleHeight,
  children,
}) => {
  const ctx = useContext(Ctx);
  const isStudio = ctx?.isStudio ?? false;
  const itemId = id ?? label ?? "unnamed";
  const itemLabel = label ?? itemId;

  const fallbackPos: DevPos = useMemo(
    () => ({
      top: initialTop,
      left: initialLeft,
      width: initialWidth,
      height: initialHeight,
      fontSize: initialFontSize,
      text: initialText,
      extras: initialExtras,
    }),
    [initialTop, initialLeft, initialWidth, initialHeight, initialFontSize, initialText, initialExtras]
  );

  useEffect(() => {
    if (!ctx || !isStudio) return;
    ctx.registerItem(itemId, itemLabel, fallbackPos);
  }, [ctx, isStudio, itemId, itemLabel, fallbackPos]);

  const dragRef = useRef<{
    mode: DragMode;
    startX: number;
    startY: number;
    start: DevPos;
    scale: number;
  } | null>(null);
  const handleRootRef = useRef<HTMLDivElement>(null);

  const pos = ctx?.positions[itemId] ?? fallbackPos;
  // Height to display the drag overlay (not necessarily the visual component's height)
  const displayH =
    pos.height ??
    initialHeight ??
    handleHeight ??
    Math.round(pos.width * 1.2);

  // ── Mouse move + up ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ctx || !isStudio) return;
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = (e.clientX - d.startX) / d.scale;
      const dy = (e.clientY - d.startY) / d.scale;
      let newPos: DevPos = { ...d.start };

      if (d.mode === "move") {
        newPos.top = Math.round(d.start.top + dy);
        newPos.left = Math.round(d.start.left + dx);
      } else if (d.mode === "resize-w") {
        newPos.width = Math.max(40, Math.round(d.start.width + dx));
      } else if (d.mode === "resize-h") {
        const startH = d.start.height ?? displayH;
        newPos.height = Math.max(20, Math.round(startH + dy));
      } else if (d.mode === "resize-wh") {
        const startH = d.start.height ?? displayH;
        newPos.width = Math.max(40, Math.round(d.start.width + dx));
        newPos.height = Math.max(20, Math.round(startH + dy));
      }

      ctx.setPosition(itemId, newPos);
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [ctx, isStudio, itemId, displayH]);

  // ── Scroll = fontSize ±1 ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!ctx || !isStudio) return;
    const el = handleRootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (ctx.activeId !== itemId) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      const current = ctx.positions[itemId] ?? fallbackPos;
      ctx.setPosition(itemId, {
        ...current,
        fontSize: Math.max(8, (current.fontSize ?? initialFontSize ?? 72) + delta),
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ctx, isStudio, itemId, fallbackPos, initialFontSize]);

  const startDrag = (mode: DragMode) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ctx) ctx.setActiveId(itemId);
    let scale = 1;
    const el = handleRootRef.current;
    if (el && pos.width > 0) {
      const rect = el.getBoundingClientRect();
      scale = rect.width / pos.width;
    }
    dragRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      start: { ...pos },
      scale,
    };
  };

  // helpers passados pro children (mesmo fora do Studio, com no-ops)
  const helpers: DevDraggableHelpers = {
    setPos: (patch) => {
      if (ctx && isStudio) ctx.setPosition(itemId, { ...pos, ...patch });
    },
    setExtra: (key, value) => {
      if (ctx && isStudio) {
        ctx.setPosition(itemId, {
          ...pos,
          extras: { ...(pos.extras ?? {}), [key]: value },
        });
      }
    },
    isActive: ctx?.activeId === itemId,
  };

  if (!ctx || !isStudio) {
    return <>{children(fallbackPos, helpers)}</>;
  }

  const isActive = ctx.activeId === itemId;
  const H = 20; // handle px

  return (
    <>
      {children(pos, helpers)}
      <div
        ref={handleRootRef}
        onMouseDown={startDrag("move")}
        onClick={(e) => {
          e.stopPropagation();
          ctx.setActiveId(itemId);
        }}
        style={{
          position: "absolute",
          top: pos.top,
          left: pos.left,
          width: pos.width,
          height: displayH,
          outline: isActive
            ? "3px dashed #FFD700"
            : "1px dashed rgba(255,215,0,0.35)",
          background: isActive ? "rgba(255,215,0,0.06)" : "transparent",
          cursor: "move",
          zIndex: isActive ? 9998 : 9997,
        }}
      >
        {/* Mini-label quando não ativo */}
        {!isActive ? (
          <div
            style={{
              position: "absolute",
              top: -22,
              left: 0,
              background: "rgba(0,0,0,0.7)",
              color: "#FFD700",
              fontFamily: "monospace",
              fontSize: 12,
              padding: "2px 6px",
              borderRadius: 3,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {itemLabel}
          </div>
        ) : null}

        {/* Handles de resize (só quando ativo) */}
        {isActive ? (
          <>
            {/* ← → resize WIDTH (borda direita centro) */}
            <div
              onMouseDown={startDrag("resize-w")}
              title="Arrastar: largura"
              style={{
                position: "absolute",
                right: -H / 2,
                top: "50%",
                transform: "translateY(-50%)",
                width: H,
                height: H,
                background: "#00BFFF",
                border: "3px solid #000",
                cursor: "ew-resize",
                borderRadius: 4,
              }}
            />
            {/* ↑ ↓ resize HEIGHT (borda inferior centro) */}
            <div
              onMouseDown={startDrag("resize-h")}
              title="Arrastar: altura"
              style={{
                position: "absolute",
                bottom: -H / 2,
                left: "50%",
                transform: "translateX(-50%)",
                width: H,
                height: H,
                background: "#00BFFF",
                border: "3px solid #000",
                cursor: "ns-resize",
                borderRadius: 4,
              }}
            />
            {/* ↘ resize WIDTH + HEIGHT (canto inferior direito) */}
            <div
              onMouseDown={startDrag("resize-wh")}
              title="Arrastar: largura + altura"
              style={{
                position: "absolute",
                right: -H / 2,
                bottom: -H / 2,
                width: H,
                height: H,
                background: "#FFD700",
                border: "3px solid #000",
                cursor: "nwse-resize",
                borderRadius: 4,
              }}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

// ─── HUD único ────────────────────────────────────────────────────────────────
export const DevHUD: React.FC = () => {
  const ctx = useContext(Ctx);
  const [copied, setCopied] = useState(false);

  // Remotion hooks — DevHUD DEVE ser renderizado dentro de uma composition
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!ctx || !ctx.isStudio) return null;

  const ids = Object.keys(ctx.labels);
  if (ids.length === 0) return null;

  const activeId = ctx.activeId ?? ids[0];
  const active = ctx.positions[activeId];
  const label = ctx.labels[activeId];

  const currentMs = Math.round((frame / fps) * 1000);

  // Monta o texto de COPY em formato TSX props
  const buildCopyText = (): string => {
    if (!active) return "";
    const parts: string[] = [];
    parts.push(`top={${active.top}}`);
    parts.push(`left={${active.left}}`);
    parts.push(`width={${active.width}}`);
    if (active.height !== undefined) parts.push(`height={${active.height}}`);
    if (active.fontSize !== undefined) parts.push(`fontSize={${active.fontSize}}`);
    if (active.text !== undefined && active.text !== "")
      parts.push(`text="${active.text}"`);
    // Extras (props editáveis específicos do componente)
    if (active.extras) {
      Object.entries(active.extras).forEach(([k, v]) => {
        if (v !== undefined && v !== "") {
          // escapa aspas no texto
          const escaped = String(v).replace(/"/g, '\\"');
          parts.push(`${k}="${escaped}"`);
        }
      });
    }
    if (active.startMs !== undefined) parts.push(`startMs={${active.startMs}}`);
    if (active.endMs !== undefined) parts.push(`endMs={${active.endMs}}`);
    return `{/* ${label} */}\n` + parts.join(" ");
  };

  const handleCopy = async () => {
    const text = buildCopyText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const update = (patch: Partial<DevPos>) => {
    if (!active) return;
    ctx.setPosition(activeId, { ...active, ...patch });
  };

  const handleReset = () => ctx.resetItem(activeId);

  // ── Estilos reutilizáveis ────────────────────────────────────────────────────
  const btnStyle: React.CSSProperties = {
    background: "#FFD700",
    color: "#000",
    border: "none",
    padding: "7px 12px",
    fontFamily: "monospace",
    fontWeight: 700,
    fontSize: 17,
    borderRadius: 5,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const inputNum: React.CSSProperties = {
    background: "#1a1a1a",
    color: "#fff",
    border: "1px solid #444",
    fontFamily: "monospace",
    fontSize: 16,
    padding: "4px 6px",
    borderRadius: 4,
    width: 80,
  };

  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  };

  const lbl: React.CSSProperties = {
    width: 48,
    fontSize: 13,
    opacity: 0.6,
    flexShrink: 0,
  };

  const section: React.CSSProperties = {
    fontSize: 12,
    opacity: 0.4,
    marginBottom: 5,
    marginTop: 3,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  };

  return (
    <DevFloatingPanel
      storageKey="devhud:panel"
      defaultX={724}
      defaultY={16}
      minWidth={340}
      maxWidth={400}
      title="ACTIVE / COPY"
    >
      {/* ACTIVE select */}
      <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 4, letterSpacing: 1 }}>
        ACTIVE
      </div>
      <select
        value={activeId}
        onChange={(e) => ctx.setActiveId(e.target.value)}
        style={{
          width: "100%",
          background: "#1a1a1a",
          color: "#FFD700",
          border: "1px solid #FFD700",
          fontFamily: "monospace",
          fontSize: 15,
          padding: "5px 7px",
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        {ids.map((i) => (
          <option key={i} value={i}>
            {ctx.labels[i]}
          </option>
        ))}
      </select>

      {active ? (
        <>
          {/* ── POSIÇÃO ── */}
          <div style={section}>Posição</div>
          <div style={row}>
            <span style={lbl}>top</span>
            <input
              type="number"
              style={inputNum}
              value={active.top}
              onChange={(e) => update({ top: Number(e.target.value) })}
            />
            <span style={lbl}>left</span>
            <input
              type="number"
              style={inputNum}
              value={active.left}
              onChange={(e) => update({ left: Number(e.target.value) })}
            />
          </div>

          {/* ── TAMANHO ── */}
          <div style={section}>Tamanho &nbsp;
            <span style={{ opacity: 0.4 }}>
              🔵=W/H separado &nbsp; 🟡=ambos
            </span>
          </div>
          <div style={row}>
            <span style={lbl}>W</span>
            <input
              type="number"
              style={inputNum}
              value={active.width}
              onChange={(e) => update({ width: Number(e.target.value) })}
            />
            <span style={lbl}>H</span>
            <input
              type="number"
              style={{ ...inputNum }}
              value={active.height ?? ""}
              placeholder="auto"
              onChange={(e) =>
                update({
                  height:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
          </div>

          {/* ── FONT SIZE ── */}
          <div style={section}>
            fontSize &nbsp;
            <span style={{ opacity: 0.4 }}>scroll ↑↓ = ±1</span>
          </div>
          <div style={{ ...row, marginBottom: 8 }}>
            <span style={lbl}>px</span>
            <input
              type="number"
              style={inputNum}
              value={active.fontSize ?? ""}
              placeholder="auto"
              onChange={(e) =>
                update({
                  fontSize:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
            <button
              style={{ ...btnStyle, background: "#333", color: "#aaa", fontSize: 11, padding: "3px 7px" }}
              onClick={() =>
                update({ fontSize: Math.max(8, (active.fontSize ?? 72) - 1) })
              }
            >
              −
            </button>
            <button
              style={{ ...btnStyle, background: "#333", color: "#aaa", fontSize: 11, padding: "3px 7px" }}
              onClick={() =>
                update({ fontSize: (active.fontSize ?? 72) + 1 })
              }
            >
              +
            </button>
          </div>

          {/* ── TEXTO ── */}
          <div style={section}>Texto</div>
          <input
            type="text"
            style={{
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid #444",
              fontFamily: "monospace",
              fontSize: 12,
              padding: "4px 6px",
              borderRadius: 3,
              width: "100%",
              boxSizing: "border-box" as const,
              marginBottom: 8,
            }}
            value={active.text ?? ""}
            placeholder="(nenhum texto)"
            onChange={(e) => update({ text: e.target.value })}
          />

          {/* ── TEMPO ── */}
          <div style={section}>
            Tempo &nbsp;
            <span style={{ opacity: 0.6, color: "#0cf" }}>▶ {currentMs}ms</span>
          </div>
          <div style={row}>
            <span style={lbl}>start</span>
            <input
              type="number"
              style={inputNum}
              value={active.startMs ?? ""}
              placeholder="0"
              onChange={(e) =>
                update({
                  startMs:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
            <button
              style={{ ...btnStyle, background: "#004466", color: "#0cf", fontSize: 11, padding: "3px 6px" }}
              title={`Capturar tempo atual: ${currentMs}ms`}
              onClick={() => update({ startMs: currentMs })}
            >
              ⏱ agora
            </button>
          </div>
          <div style={{ ...row, marginBottom: 10 }}>
            <span style={lbl}>end</span>
            <input
              type="number"
              style={inputNum}
              value={active.endMs ?? ""}
              placeholder="—"
              onChange={(e) =>
                update({
                  endMs:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
            <button
              style={{ ...btnStyle, background: "#004466", color: "#0cf", fontSize: 11, padding: "3px 6px" }}
              title={`Capturar tempo atual: ${currentMs}ms`}
              onClick={() => update({ endMs: currentMs })}
            >
              ⏱ agora
            </button>
          </div>

          {/* ── EXTRAS (props editáveis específicos do componente) ── */}
          {active.extras && Object.keys(active.extras).length > 0 ? (
            <>
              <div style={section}>Props extras &nbsp;
                <span style={{ opacity: 0.4 }}>(também editável no canvas)</span>
              </div>
              {Object.entries(active.extras).map(([key, value]) => (
                <div key={key} style={row}>
                  <span style={{ ...lbl, width: 90 }}>{key}</span>
                  <input
                    type="text"
                    style={{
                      background: "#1a1a1a",
                      color: "#fff",
                      border: "1px solid #444",
                      fontFamily: "monospace",
                      fontSize: 14,
                      padding: "4px 6px",
                      borderRadius: 3,
                      flex: 1,
                      minWidth: 0,
                    }}
                    value={value}
                    onChange={(e) =>
                      update({
                        extras: { ...active.extras, [key]: e.target.value },
                      })
                    }
                  />
                </div>
              ))}
              <div style={{ height: 8 }} />
            </>
          ) : null}

          {/* ── BOTÕES ── */}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleCopy} style={{ ...btnStyle, flex: 1 }}>
              {copied ? "✓ COPIADO" : "📋 COPY"}
            </button>
            <button
              onClick={handleReset}
              title="Reset para posição inicial"
              style={{ ...btnStyle, background: "#444", color: "#FFD700" }}
            >
              ↺
            </button>
          </div>
        </>
      ) : null}
    </DevFloatingPanel>
  );
};
