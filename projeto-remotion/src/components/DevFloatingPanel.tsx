import React, { useEffect, useRef, useState } from "react";

type PanelState = {
  x: number;
  y: number;
  zoom: number;
};

type DevFloatingPanelProps = {
  storageKey: string;
  defaultX: number;
  defaultY: number;
  minWidth: number;
  maxWidth?: number;
  title: string;
  children: React.ReactNode;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const loadPanelState = (
  storageKey: string,
  defaultX: number,
  defaultY: number
): PanelState => {
  try {
    if (typeof window === "undefined") {
      return { x: defaultX, y: defaultY, zoom: 1 };
    }
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return { x: defaultX, y: defaultY, zoom: 1 };
    const parsed = JSON.parse(saved) as Partial<PanelState>;
    return {
      x: typeof parsed.x === "number" ? parsed.x : defaultX,
      y: typeof parsed.y === "number" ? parsed.y : defaultY,
      zoom: typeof parsed.zoom === "number" ? parsed.zoom : 1,
    };
  } catch {
    return { x: defaultX, y: defaultY, zoom: 1 };
  }
};

export const DevFloatingPanel: React.FC<DevFloatingPanelProps> = ({
  storageKey,
  defaultX,
  defaultY,
  minWidth,
  maxWidth,
  title,
  children,
}) => {
  const [state, setState] = useState<PanelState>(() =>
    loadPanelState(storageKey, defaultX, defaultY)
  );
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startPanelX: number;
    startPanelY: number;
  } | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
      }
    } catch {}
  }, [storageKey, state]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      setState((current) => ({
        ...current,
        x: Math.round(drag.startPanelX + e.clientX - drag.startX),
        y: Math.round(drag.startPanelY + e.clientY - drag.startY),
      }));
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
  }, []);

  const setZoom = (delta: number) => {
    setState((current) => ({
      ...current,
      zoom: Number(clamp(current.zoom + delta, 0.6, 1.6).toFixed(2)),
    }));
  };

  const resetPanel = () => {
    setState({ x: defaultX, y: defaultY, zoom: 1 });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: state.y,
        left: state.x,
        background: "rgba(0,0,0,0.95)",
        color: "#FFD700",
        fontFamily: "monospace",
        fontSize: 16,
        padding: "0 16px 16px",
        borderRadius: 10,
        zIndex: 2147483000,
        border: "2px solid #FFD700",
        lineHeight: 1.4,
        minWidth,
        maxWidth,
        userSelect: "none",
        transform: `scale(${state.zoom})`,
        transformOrigin: "top left",
        boxSizing: "border-box",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPanelX: state.x,
            startPanelY: state.y,
          };
        }}
        style={{
          height: 38,
          margin: "0 -16px 10px",
          padding: "0 10px 0 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "move",
          borderBottom: "1px solid rgba(255,215,0,0.25)",
          background: "rgba(255,215,0,0.08)",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <span style={{ fontSize: 15, opacity: 0.8 }}>↔</span>
        <span
          style={{
            flex: 1,
            fontSize: 12,
            opacity: 0.6,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setZoom(-0.1)}
          title="Diminuir zoom do painel"
          style={panelButton}
        >
          -
        </button>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setZoom(0.1)}
          title="Aumentar zoom do painel"
          style={panelButton}
        >
          +
        </button>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={resetPanel}
          title="Resetar posição e zoom"
          style={panelButton}
        >
          1x
        </button>
      </div>
      {children}
    </div>
  );
};

const panelButton: React.CSSProperties = {
  background: "#1a1a1a",
  color: "#FFD700",
  border: "1px solid #444",
  borderRadius: 4,
  cursor: "pointer",
  fontFamily: "monospace",
  fontSize: 12,
  fontWeight: 700,
  height: 24,
  minWidth: 26,
  padding: "0 6px",
};
