/**
 * DevComposer — Picker visual de overlays para o Remotion Studio.
 *
 * Uso dentro de qualquer composition:
 *
 *   <DevDraggableProvider>
 *     <DevComposerLayer />
 *     <DevComposerPanel />
 *     <DevHUD />
 *   </DevDraggableProvider>
 *
 * 1. DevComposerPanel (esquerda): clica "+" para adicionar overlay ao canvas.
 * 2. Drag no canvas para posicionar (DevDraggable).
 * 3. DevHUD (direita): ajusta pos / tamanho / fontSize / texto / startMs / endMs → COPY.
 */

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Freeze } from "remotion";
import { DevDraggable, DevPos, DevDraggableHelpers, DevDraggableProvider } from "./DevDraggable";
import { DevFloatingPanel } from "./DevFloatingPanel";

// ─── Imports dos Overlays ─────────────────────────────────────────────────────
import { FomeBarChart } from "./FomeBarChart";
import { SonoBarChart } from "./SonoBarChart";
import { InsulinaBarChart } from "./InsulinaBarChart";
import { InsulinaBarChartVertical } from "./InsulinaBarChartVertical";
import { TopTitleCard } from "./TopTitleCard";
import { StatBar } from "./StatBar";
import { NeonPill } from "./NeonPill";
import { PillBadge } from "./PillBadge";
import { DeficitCard } from "./DeficitCard";
import { AthleteCard } from "./AthleteCard";
import { GraficoBarras } from "./GraficoBarras";
import { PaperHighlight } from "./PaperHighlight";
import { ScientificFooter } from "./ScientificFooter";
import { WeekTabBar } from "./WeekTabBar";
import { StackedBlockChart } from "./StackedBlockChart";
import { LogoStamp } from "./LogoStamp";
import { StrikethroughList } from "./StrikethroughList";
import { ScaleProgressCard } from "./ScaleProgressCard";
import { ImpactWord } from "./ImpactWord";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type ComposerInstance = {
  /** id único, ex: "FomeBarChart-2" */
  id: string;
  /** typeId do registro */
  typeId: string;
  /** posição inicial (após isso gerenciada pelo DevDraggable) */
  initialPos: DevPos;
};

type RegistryEntry = {
  typeId: string;
  label: string;
  category: string;
  icon: string;
  /** Largura inicial padrão (canvas px) */
  defaultWidth: number;
  /** Altura do handle de drag */
  defaultHeight: number;
  defaultFontSize?: number;
  defaultText?: string;
  /** Props extras editáveis (vão pra extras + aparecem no HUD + saem no COPY) */
  defaultExtras?: Record<string, string>;
  /**
   * Se definido, o componente escala uniformemente via transform: scale().
   * scale = pos.width / naturalWidth. O componente é renderizado em top=0 left=0
   * dentro de um wrapper que aplica position e scale.
   * Use pra gráficos com tamanhos internos hardcoded.
   */
  naturalWidth?: number;
  /** Renderiza o componente com o DevPos atual e helpers do DevDraggable */
  render: (pos: DevPos, helpers?: DevDraggableHelpers) => React.ReactNode;
};

// ─── Registry ─────────────────────────────────────────────────────────────────
export const OVERLAY_REGISTRY: RegistryEntry[] = [
  // ── Gráficos ────────────────────────────────────────────────────────────────
  {
    typeId: "FomeBarChart",
    label: "Gráfico Fome",
    category: "📊 Gráficos",
    icon: "🍎",
    defaultWidth: 820,
    defaultHeight: 280,
    naturalWidth: 820,
    defaultExtras: {
      headerTitle: "FOME",
      headerSubtitle: "Impacto nas escolhas alimentares",
      label1: "MAÇÃ",
      label2: "BALA",
    },
    render: (pos, helpers) => (
      <FomeBarChart
        top={0}
        left={0}
        width={820}
        editable
        headerTitle={pos.extras?.headerTitle ?? "FOME"}
        headerSubtitle={pos.extras?.headerSubtitle ?? "Impacto nas escolhas alimentares"}
        label1={pos.extras?.label1 ?? "MAÇÃ"}
        label2={pos.extras?.label2 ?? "BALA"}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "SonoBarChart",
    label: "Gráfico Sono",
    category: "📊 Gráficos",
    icon: "😴",
    defaultWidth: 820,
    defaultHeight: 280,
    naturalWidth: 820,
    defaultExtras: {
      headerTitle: "NOITE MAL DORMIDA",
      headerSubtitle: "Efeito na sensibilidade insulínica",
      label1: "QUALIDADE\nDE SONO",
      label2: "SENSIBILIDADE\nINSULÍNICA",
    },
    render: (pos, helpers) => (
      <SonoBarChart
        top={0}
        left={0}
        width={820}
        editable
        headerTitle={pos.extras?.headerTitle ?? "NOITE MAL DORMIDA"}
        headerSubtitle={pos.extras?.headerSubtitle ?? "Efeito na sensibilidade insulínica"}
        label1={pos.extras?.label1 ?? "QUALIDADE\nDE SONO"}
        label2={pos.extras?.label2 ?? "SENSIBILIDADE\nINSULÍNICA"}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "InsulinaBarChart",
    label: "Gráfico Insulina",
    category: "📊 Gráficos",
    icon: "📉",
    defaultWidth: 600,
    defaultHeight: 220,
    naturalWidth: 600,
    defaultExtras: {
      headerTitle: "DÉFICIT CALÓRICO",
      headerSubtitle: "Sem melhorar sensibilidade insulínica",
      label1: "PESO\n(KG)",
      label2: "% GORDURA\nCORPORAL",
      label3: "RESISTÊNCIA\nINSULÍNICA",
    },
    render: (pos, helpers) => (
      <InsulinaBarChart
        top={0}
        left={0}
        width={600}
        editable
        headerTitle={pos.extras?.headerTitle ?? "DÉFICIT CALÓRICO"}
        headerSubtitle={pos.extras?.headerSubtitle ?? "Sem melhorar sensibilidade insulínica"}
        label1={pos.extras?.label1 ?? "PESO\n(KG)"}
        label2={pos.extras?.label2 ?? "% GORDURA\nCORPORAL"}
        label3={pos.extras?.label3 ?? "RESISTÊNCIA\nINSULÍNICA"}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "InsulinaBarChartVertical",
    label: "Insulina Vertical",
    category: "📊 Gráficos",
    icon: "📈",
    defaultWidth: 420,
    defaultHeight: 480,
    naturalWidth: 420,
    defaultExtras: {
      headerTitle: "DÉFICIT CALÓRICO",
      headerSubtitle: "Sem melhorar sensibilidade insulínica",
      label1: "PESO\n(KG)",
      label2: "% GORDURA\nCORPORAL",
      label3: "RESISTÊNCIA\nINSULÍNICA",
    },
    render: (pos, helpers) => (
      <InsulinaBarChartVertical
        top={0}
        left={0}
        editable
        headerTitle={pos.extras?.headerTitle ?? "DÉFICIT CALÓRICO"}
        headerSubtitle={pos.extras?.headerSubtitle ?? "Sem melhorar sensibilidade insulínica"}
        label1={pos.extras?.label1 ?? "PESO\n(KG)"}
        label2={pos.extras?.label2 ?? "% GORDURA\nCORPORAL"}
        label3={pos.extras?.label3 ?? "RESISTÊNCIA\nINSULÍNICA"}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "GraficoBarras",
    label: "Gráfico Barras",
    category: "📊 Gráficos",
    icon: "📊",
    defaultWidth: 780,
    defaultHeight: 320,
    naturalWidth: 780,
    defaultExtras: {
      headerTitle: "DADO",
      headerSubtitle: "Editar após COPY",
      label1: "BARRA A",
      label2: "BARRA B",
    },
    render: (pos, helpers) => (
      <GraficoBarras
        top={0}
        left={0}
        width={780}
        editable
        headerTitle={pos.extras?.headerTitle ?? "DADO"}
        headerSubtitle={pos.extras?.headerSubtitle ?? "Editar após COPY"}
        bars={[
          { label: (pos.extras?.label1 ?? "BARRA A").split("\n"), color: "#4E7033", from: 0, to: 75, unit: "%" },
          { label: (pos.extras?.label2 ?? "BARRA B").split("\n"), color: "#C0392B", from: 0, to: 100, unit: "%" },
        ]}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "StackedBlockChart",
    label: "Blocos Empilhados",
    category: "📊 Gráficos",
    icon: "🧱",
    defaultWidth: 700,
    defaultHeight: 400,
    naturalWidth: 700,
    defaultExtras: {
      headerLabel: "WEIGHT GAIN",
      label1: "MÚSCULO",
      label2: "GORDURA",
    },
    render: (pos, helpers) => (
      <StackedBlockChart
        top={0}
        left={0}
        width={700}
        editable
        headerLabel={pos.extras?.headerLabel ?? "WEIGHT GAIN"}
        blocks={[
          { label: pos.extras?.label1 ?? "MÚSCULO", height: 220, color: "#4E7033" },
          { label: pos.extras?.label2 ?? "GORDURA", height: 80, color: "#C0392B" },
        ]}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },

  // ── Texto ────────────────────────────────────────────────────────────────────
  {
    typeId: "TopTitleCard",
    label: "TitleCard Topo",
    category: "🔤 Texto",
    icon: "🏷️",
    defaultWidth: 900,
    defaultHeight: 120,
    defaultExtras: {
      text: "TÍTULO",
      subtitle: "SUBTÍTULO",
    },
    render: (pos, helpers) => (
      <TopTitleCard
        text={pos.extras?.text ?? "TÍTULO"}
        subtitle={pos.extras?.subtitle ?? "SUBTÍTULO"}
        top={pos.top}
        color="#FFD700"
        editable
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "StatBar",
    label: "StatBar",
    category: "🔤 Texto",
    icon: "📌",
    defaultWidth: 900,
    defaultHeight: 100,
    defaultExtras: {
      label: "DADO PRINCIPAL",
      value: "100%",
      detail: "DETALHE",
    },
    render: (pos, helpers) => (
      <StatBar
        label={pos.extras?.label ?? "DADO PRINCIPAL"}
        value={pos.extras?.value ?? "100%"}
        detail={pos.extras?.detail ?? "DETALHE"}
        tone="darknavy"
        yOffset={pos.top}
        editable
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "NeonPill",
    label: "NeonPill",
    category: "🔤 Texto",
    icon: "💊",
    defaultWidth: 600,
    defaultHeight: 80,
    defaultFontSize: 28,
    defaultExtras: {
      label: "LABEL",
      accent: "DESTAQUE",
    },
    render: (pos, helpers) => (
      <NeonPill
        label={pos.extras?.label ?? "LABEL"}
        accent={pos.extras?.accent ?? "DESTAQUE"}
        top={pos.top}
        left={pos.left}
        width={pos.width}
        height={pos.height}
        fontSize={pos.fontSize}
        editable
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "PillBadge",
    label: "PillBadge",
    category: "🔤 Texto",
    icon: "🔵",
    defaultWidth: 400,
    defaultHeight: 70,
    defaultExtras: {
      text: "DEFICIT:",
      accent: "500 KCAL",
    },
    render: (pos, helpers) => (
      <PillBadge
        text={pos.extras?.text ?? "DEFICIT:"}
        accent={pos.extras?.accent ?? "500 KCAL"}
        top={pos.top}
        left={pos.left}
        width={pos.width}
        height={pos.height}
        variant="dark"
        editable
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "DeficitCard",
    label: "DeficitCard",
    category: "🔤 Texto",
    icon: "🔢",
    defaultWidth: 700,
    defaultHeight: 200,
    defaultFontSize: 96,
    defaultExtras: {
      label: "DEFICIT AGRESSIVO =",
      accent1: "INSUSTENTAVEL",
      middle: "+ PERDA DE",
      accent2: "MASSA MUSCULAR",
    },
    render: (pos, helpers) => (
      <DeficitCard
        top={pos.top}
        left={pos.left}
        fontSize={pos.fontSize ?? 96}
        editable
        label={pos.extras?.label ?? "DEFICIT AGRESSIVO ="}
        accent1={pos.extras?.accent1 ?? "INSUSTENTAVEL"}
        middle={pos.extras?.middle ?? "+ PERDA DE"}
        accent2={pos.extras?.accent2 ?? "MASSA MUSCULAR"}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "ScientificFooter",
    label: "Rodapé Científico",
    category: "🔤 Texto",
    icon: "📝",
    defaultWidth: 1080,
    defaultHeight: 60,
    defaultExtras: {
      text: "Autor et al. · NIH/NLM · 2024",
    },
    render: (pos, helpers) => (
      <ScientificFooter
        text={pos.extras?.text ?? "Autor et al. · NIH/NLM · 2024"}
        editable
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "StrikethroughList",
    label: "Lista Riscada",
    category: "🔤 Texto",
    icon: "❌",
    defaultWidth: 800,
    defaultHeight: 300,
    defaultExtras: {
      item1: "ITEM 1",
      item2: "ITEM 2",
      item3: "ITEM 3",
    },
    render: (pos, helpers) => (
      <StrikethroughList
        items={[
          { label: pos.extras?.item1 ?? "ITEM 1", revealFrame: 0 },
          { label: pos.extras?.item2 ?? "ITEM 2", revealFrame: 20 },
          { label: pos.extras?.item3 ?? "ITEM 3", revealFrame: 40 },
        ]}
        editable
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "ImpactWord",
    label: "Impact Word",
    category: "🔤 Texto",
    icon: "⚡",
    defaultWidth: 900,
    defaultHeight: 140,
    defaultFontSize: 112,
    defaultExtras: {
      text: "IMPACTO",
    },
    render: (pos, helpers) => (
      <ImpactWord
        text={pos.extras?.text ?? "IMPACTO"}
        color="#FFD700"
        top={pos.top}
        size={pos.fontSize ?? 112}
        editable
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },

  // ── Científico ───────────────────────────────────────────────────────────────
  {
    typeId: "PaperHighlight",
    label: "Paper Highlight",
    category: "🔬 Científico",
    icon: "📄",
    defaultWidth: 420,
    defaultHeight: 280,
    naturalWidth: 420,
    defaultExtras: {
      title: "Conclusions",
      textBefore: "Adicionar ",
      highlight1: "paperSrc",
      textAfter: " após COPY",
    },
    render: (pos, helpers) => (
      <PaperHighlight
        top={0}
        left={0}
        width={420}
        editable
        title={pos.extras?.title ?? "Conclusions"}
        textBefore={pos.extras?.textBefore ?? "Adicionar "}
        highlightWords={[pos.extras?.highlight1 ?? "paperSrc"]}
        textAfter={pos.extras?.textAfter ?? " após COPY"}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "LogoStamp",
    label: "Logo Stamp",
    category: "🔬 Científico",
    icon: "🔖",
    defaultWidth: 300,
    defaultHeight: 80,
    defaultExtras: {
      handle: "@xandokaoriginal",
    },
    render: (pos, helpers) => (
      <LogoStamp
        handle={pos.extras?.handle ?? "@xandokaoriginal"}
        editable
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
  {
    typeId: "ScaleProgressCard",
    label: "ScaleProgressCard",
    category: "🔬 Científico",
    icon: "⚖️",
    defaultWidth: 700,
    defaultHeight: 300,
    naturalWidth: 700,
    defaultExtras: {
      label1: "110,3 KG",
      label2: "102,5 KG",
      label3: "92,9 KG",
    },
    render: (pos, helpers) => (
      <ScaleProgressCard
        top={0}
        left={0}
        width={700}
        editable
        label1={pos.extras?.label1 ?? "110,3 KG"}
        label2={pos.extras?.label2 ?? "102,5 KG"}
        label3={pos.extras?.label3 ?? "92,9 KG"}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },

  // ── Pessoas ─────────────────────────────────────────────────────────────────
  {
    typeId: "AthleteCard",
    label: "AthleteCard",
    category: "👤 Pessoas",
    icon: "🏆",
    defaultWidth: 520,
    defaultHeight: 380,
    naturalWidth: 520,
    defaultExtras: {
      topPill: "CASE STUDY",
      name: "NOME DO ATLETA",
      stats: "Stats aqui",
    },
    render: (pos, helpers) => (
      <AthleteCard
        top={0}
        left={0}
        width={520}
        editable
        topPill={pos.extras?.topPill ?? "CASE STUDY"}
        name={pos.extras?.name ?? "NOME DO ATLETA"}
        stats={pos.extras?.stats ?? "Stats aqui"}
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },

  // ── Estrutura ────────────────────────────────────────────────────────────────
  {
    typeId: "WeekTabBar",
    label: "WeekTabBar",
    category: "📅 Estrutura",
    icon: "📆",
    defaultWidth: 1000,
    defaultHeight: 80,
    defaultExtras: {
      step1: "SEMANA 1",
      step2: "SEMANA 2",
      step3: "SEMANA 3",
    },
    render: (pos, helpers) => (
      <WeekTabBar
        top={pos.top}
        left={pos.left}
        steps={[
          pos.extras?.step1 ?? "SEMANA 1",
          pos.extras?.step2 ?? "SEMANA 2",
          pos.extras?.step3 ?? "SEMANA 3",
        ]}
        activeIndex={0}
        editable
        onTextEdit={(key, value) => helpers?.setExtra(key, value)}
      />
    ),
  },
];

// Agrupa registry por categoria
const CATEGORIES = Array.from(
  new Set(OVERLAY_REGISTRY.map((e) => e.category))
);

// ─── Storage de instâncias ─────────────────────────────────────────────────────
const STORAGE_KEY = "devcomposer:instances";

const getStorageKey = () => {
  try {
    if (typeof window === "undefined") return STORAGE_KEY;
    const composition = window.location.pathname.replace(/^\/+/, "") || "default";
    return `${STORAGE_KEY}:${composition}`;
  } catch {
    return STORAGE_KEY;
  }
};

function loadInstances(storageKey = getStorageKey()): ComposerInstance[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    return JSON.parse(raw) as ComposerInstance[];
  } catch {
    return [];
  }
}

function saveInstances(instances: ComposerInstance[], storageKey = getStorageKey()) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(instances));
    }
  } catch {}
}

// ─── DevComposerLayer ─────────────────────────────────────────────────────────
/**
 * Renderiza as instâncias ativas no canvas.
 * Deve ser colocado DENTRO de <DevDraggableProvider>.
 */
export const DevComposerLayer: React.FC = () => {
  const storageKey = getStorageKey();
  const [instances, setInstances] = useState<ComposerInstance[]>(() =>
    loadInstances(storageKey)
  );

  // expõe instâncias para o Panel via contexto compartilhado
  useComposerBridge(instances, setInstances);

  return (
    <>
      {instances.map((inst) => {
        const entry = OVERLAY_REGISTRY.find((e) => e.typeId === inst.typeId);
        if (!entry) return null;
        return (
          <DevDraggable
            key={inst.id}
            id={inst.id}
            label={`${entry.icon} ${entry.label}`}
            initialTop={inst.initialPos.top}
            initialLeft={inst.initialPos.left}
            initialWidth={inst.initialPos.width}
            initialHeight={inst.initialPos.height ?? entry.defaultHeight}
            initialFontSize={inst.initialPos.fontSize ?? entry.defaultFontSize}
            initialText={inst.initialPos.text ?? entry.defaultText}
            initialExtras={inst.initialPos.extras ?? entry.defaultExtras}
          >
            {(pos, helpers) => {
              // Freeze no frame 90 (3s) — overlay sempre visível no estado pós-animação
              // pra facilitar posicionamento. No reel real animação roda normal.
              const inner = <Freeze frame={90}>{entry.render(pos, helpers)}</Freeze>;

              // Se naturalWidth existe, aplica scale uniforme via transform.
              // O componente interno renderiza em top=0 left=0 e o wrapper posiciona/escala.
              if (entry.naturalWidth) {
                const scale = pos.width / entry.naturalWidth;
                return (
                  <div
                    style={{
                      position: "absolute",
                      top: pos.top,
                      left: pos.left,
                      width: entry.naturalWidth,
                      transform: `scale(${scale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    {inner}
                  </div>
                );
              }

              return inner;
            }}
          </DevDraggable>
        );
      })}
    </>
  );
};

// ─── Bridge (compartilha instâncias entre Layer e Panel) ──────────────────────
type BridgeCtx = {
  instances: ComposerInstance[];
  addInstance: (typeId: string) => void;
  removeInstance: (id: string) => void;
  clearAll: () => void;
};

const BridgeContext = React.createContext<BridgeCtx | null>(null);

function useComposerBridge(
  instances: ComposerInstance[],
  setInstances: React.Dispatch<React.SetStateAction<ComposerInstance[]>>
) {
  // não é um hook real, apenas atualiza o ref do Provider
  bridgeRef.instances = instances;
  bridgeRef.setInstances = setInstances;
}

// Ref mútavel compartilhado (funciona dentro do mesmo render tree)
const bridgeRef: {
  instances: ComposerInstance[];
  setInstances: React.Dispatch<React.SetStateAction<ComposerInstance[]>> | null;
} = { instances: [], setInstances: null };

// ─── DevComposerPanel ─────────────────────────────────────────────────────────
/**
 * Painel de seleção de overlays. Fica no lado esquerdo do canvas.
 * Deve ser colocado DENTRO de <DevDraggableProvider> (e ao lado de <DevComposerLayer>).
 */
export const DevComposerPanel: React.FC = () => {
  const storageKey = getStorageKey();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [instances, setInstances] = useState<ComposerInstance[]>(() =>
    loadInstances(storageKey)
  );
  const counterRef = useRef<Record<string, number>>({});

  // Sincroniza com o Layer via pooling simples (mesmo processo React)
  useEffect(() => {
    const id = setInterval(() => {
      if (bridgeRef.instances !== instances) {
        setInstances([...bridgeRef.instances]);
      }
    }, 200);
    return () => clearInterval(id);
  }, [instances]);

  const addInstance = useCallback((typeId: string) => {
    const entry = OVERLAY_REGISTRY.find((e) => e.typeId === typeId);
    if (!entry) return;

    counterRef.current[typeId] = (counterRef.current[typeId] ?? 0) + 1;
    const id = `${typeId}-${counterRef.current[typeId]}`;

    // Posição inicial: centro do canvas, offset por instância para não sobrepor
    const offset = (counterRef.current[typeId] - 1) * 30;
    const newInst: ComposerInstance = {
      id,
      typeId,
      initialPos: {
        top: 400 + offset,
        left: Math.round((1080 - entry.defaultWidth) / 2) + offset,
        width: entry.defaultWidth,
        height: entry.defaultHeight,
        fontSize: entry.defaultFontSize,
        text: entry.defaultText,
        extras: entry.defaultExtras,
      },
    };

    const updated = [...bridgeRef.instances, newInst];
    bridgeRef.setInstances?.((prev) => [...prev, newInst]);
    setInstances(updated);
    saveInstances(updated, storageKey);
  }, [storageKey]);

  const removeInstance = useCallback((id: string) => {
    const updated = bridgeRef.instances.filter((i) => i.id !== id);
    bridgeRef.setInstances?.((prev) => prev.filter((i) => i.id !== id));
    setInstances(updated);
    saveInstances(updated, storageKey);
    // limpa localStorage do DevDraggable para esse id
    try {
      window.localStorage.removeItem("devdraggable:" + id);
    } catch {}
  }, [storageKey]);

  const clearAll = useCallback(() => {
    instances.forEach((i) => {
      try {
        window.localStorage.removeItem("devdraggable:" + i.id);
      } catch {}
    });
    bridgeRef.setInstances?.(() => []);
    setInstances([]);
    saveInstances([], storageKey);
  }, [instances, storageKey]);

  const filtered = OVERLAY_REGISTRY.filter(
    (e) => e.category === activeCategory
  );

  const btnBase: React.CSSProperties = {
    background: "#1a1a1a",
    color: "#FFD700",
    border: "1px solid #333",
    fontFamily: "monospace",
    fontSize: 14,
    borderRadius: 5,
    cursor: "pointer",
    padding: "6px 10px",
  };

  return (
    <DevFloatingPanel
      storageKey="devcomposer:panel"
      defaultX={16}
      defaultY={16}
      minWidth={280}
      maxWidth={310}
      title="OVERLAYS / ATIVOS"
    >
      {/* Header */}
      <div
        style={{
          fontSize: 12,
          opacity: 0.5,
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        OVERLAYS — ADICIONAR
      </div>

      {/* Tabs de categoria */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          marginBottom: 8,
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              ...btnBase,
              background: cat === activeCategory ? "#FFD700" : "#1a1a1a",
              color: cat === activeCategory ? "#000" : "#FFD700",
              fontSize: 14,
              padding: "5px 9px",
            }}
          >
            {cat.split(" ")[0]} {/* só o emoji */}
          </button>
        ))}
      </div>

      {/* Label categoria ativa */}
      <div
        style={{ fontSize: 12, opacity: 0.4, marginBottom: 6, letterSpacing: 0.8 }}
      >
        {activeCategory.replace(/^[^ ]+ /, "")}
      </div>

      {/* Lista de overlays */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 10 }}>
        {filtered.map((entry) => (
          <button
            key={entry.typeId}
            onClick={() => addInstance(entry.typeId)}
            style={{
              ...btnBase,
              display: "flex",
              alignItems: "center",
              gap: 8,
              textAlign: "left" as const,
              padding: "7px 10px",
              fontSize: 16,
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#2a2a2a")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a")
            }
          >
            <span style={{ fontSize: 18 }}>{entry.icon}</span>
            <span>{entry.label}</span>
            <span
              style={{
                marginLeft: "auto",
                background: "#FFD700",
                color: "#000",
                borderRadius: 4,
                padding: "1px 7px",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              +
            </span>
          </button>
        ))}
      </div>

      {/* Instâncias ativas */}
      {instances.length > 0 && (
        <>
          <div
            style={{
              fontSize: 12,
              opacity: 0.4,
              letterSpacing: 1,
              marginBottom: 5,
              borderTop: "1px solid #333",
              paddingTop: 8,
            }}
          >
            ATIVOS ({instances.length})
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              maxHeight: 200,
              overflowY: "auto" as const,
              marginBottom: 8,
            }}
          >
            {instances.map((inst) => {
              const entry = OVERLAY_REGISTRY.find(
                (e) => e.typeId === inst.typeId
              );
              return (
                <div
                  key={inst.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "#111",
                    borderRadius: 4,
                    padding: "4px 7px",
                  }}
                >
                  <span style={{ fontSize: 14, flex: 1, opacity: 0.8 }}>
                    {entry?.icon} {inst.id}
                  </span>
                  <button
                    onClick={() => removeInstance(inst.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#E74C3C",
                      cursor: "pointer",
                      fontSize: 16,
                      padding: "0 4px",
                      lineHeight: 1,
                    }}
                    title="Remover"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          <button
            onClick={clearAll}
            style={{
              ...btnBase,
              width: "100%",
              color: "#E74C3C",
              borderColor: "#E74C3C44",
              fontSize: 13,
              textAlign: "center" as const,
            }}
          >
            🗑 Limpar tudo
          </button>
        </>
      )}
    </DevFloatingPanel>
  );
};
