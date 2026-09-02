import React from "react";
import { AbsoluteFill, Composition, Folder, type CalculateMetadataFunction } from "remotion";
import { DismorfiaReel, type DismorfiaReelProps } from "./compositions/DismorfiaReel";
import { MonsterReel, type MonsterReelProps } from "./compositions/MonsterReel";
import { NippardReel, type NippardReelProps } from "./compositions/NippardReel";
import { PerderPesoReel, type PerderPesoReelProps } from "./compositions/PerderPesoReel";
import { LegDayReel, type LegDayReelProps } from "./compositions/LegDayReel";
import { EquipeCapacitada, type EquipeCapacitadaProps } from "./compositions/EquipeCapacitada";
import equipeCapacitadaPropsRaw from "../props.equipe-capacitada.json";
import { PRP, type PRPProps } from "./compositions/PRP";
import { NewHairImplanter, type NewHairImplanterProps } from "./compositions/NewHairImplanter";
import { NewHairCinco, type NewHairCincoProps } from "./compositions/NewHairCinco";
import { NewHairEquipe, type NewHairEquipeProps } from "./compositions/NewHairEquipe";
import { NewHairAtencao, type NewHairAtencaoProps } from "./compositions/NewHairAtencao";
import { NewHairQualidade, type NewHairQualidadeProps } from "./compositions/NewHairQualidade";
import { NewHairResolve, type NewHairResolveProps } from "./compositions/NewHairResolve";
import { NewHairNaoSo, type NewHairNaoSoProps } from "./compositions/NewHairNaoSo";
import { NewHairOrganizada, type NewHairOrganizadaProps } from "./compositions/NewHairOrganizada";
import { NewHairNivel, type NewHairNivelProps } from "./compositions/NewHairNivel";
import { NewHairFluir, type NewHairFluirProps } from "./compositions/NewHairFluir";
import { NewHairFluir2, type NewHairFluir2Props } from "./compositions/NewHairFluir2";
import { NewHairSalaVazia, type NewHairSalaVaziaProps } from "./compositions/NewHairSalaVazia";
import { NewHairMuitasMaos, type NewHairMuitasMaosProps } from "./compositions/NewHairMuitasMaos";
import { NewHairCusta, type NewHairCustaProps } from "./compositions/NewHairCusta";
import { NewHairCusta2, type NewHairCusta2Props } from "./compositions/NewHairCusta2";
import { NewHairSupervisionar, type NewHairSupervisionarProps } from "./compositions/NewHairSupervisionar";
import { NewHairSuporte, type NewHairSuporteProps } from "./compositions/NewHairSuporte";
import prpPropsRaw from "../props.prp.json";

const equipeCapacitadaProps = equipeCapacitadaPropsRaw as EquipeCapacitadaProps;
const prpProps = prpPropsRaw as PRPProps;
import { InsulinaBarChart } from "./components/InsulinaBarChart";
import { InsulinaBarChartVertical } from "./components/InsulinaBarChartVertical";
import { SonoBarChart } from "./components/SonoBarChart";
import { FomeBarChart } from "./components/FomeBarChart";
import { PaperHighlightCaminhada } from "./components/PaperHighlightCaminhada";
import { InsulinarReel, type InsulinarReelProps } from "./compositions/InsulinarReel";
import { DevDraggable, DevDraggableProvider, DevHUD } from "./components/DevDraggable";
import { GraficoBarras } from "./components/GraficoBarras";
import { SetaAnatomia } from "./components/SetaAnatomia";
import { PillBadge } from "./components/PillBadge";
import { WeekTabBar } from "./components/WeekTabBar";
import { PictogramGrid } from "./components/PictogramGrid";
import { StackedBlockChart } from "./components/StackedBlockChart";
import { PaperHighlight } from "./components/PaperHighlight";
import { BarChartPaper } from "./components/BarChartPaper";
import { ExperienceGauge } from "./components/ExperienceGauge";
import { PhoneMockup } from "./components/PhoneMockup";
import { AthleteCard } from "./components/AthleteCard";
import { MuscleGlowOverlay } from "./components/MuscleGlowOverlay";
import { EmagrecerRapidoReel, type EmagrecerRapidoReelProps } from "./compositions/EmagrecerRapidoReel";
import { HolgReel, type HolgReelProps } from "./compositions/HolgReel";
import { FeedReel, type FeedReelProps } from "./compositions/FeedReel";
import { ComposerView, composerViewSchema, type ComposerViewProps } from "./compositions/ComposerView";
import { MacaReel, type MacaReelProps } from "./compositions/MacaReel";
import { GanleyReel, type GanleyReelProps } from "./compositions/GanleyReel";

const fps = 30;

const ganleyDefaults: GanleyReelProps = {
  videoSrc: "reels ganley/main.mp4",
  captionsJson: "reels ganley/captions.json",
  duration: 78.32,
};

const macaDefaults: MacaReelProps = {
  videoSrc: "reels maça/main.mp4",
  captionsJson: "reels maça/captions.json",
  voiceSrc: "reels maça/main_audio.m4a",
  musicSrc: "reels maça/music.MP3",
  duration: 44,
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT PROPS DOS REELS
// ═══════════════════════════════════════════════════════════════════════════

const defaultProps: NippardReelProps = {
  videoSrc: "",
  captionsJson: "",
  duration: 45,
  overlays: [
    {
      type: "stat",
      start: 3,
      end: 7,
      label: "DADO PRINCIPAL",
      value: "128g PROTEINA / DIA",
      detail: "Exemplo de barra estatistica",
    },
    {
      type: "paper",
      start: 8,
      end: 13,
      title: "Meta-analise",
      subtitle: "49 estudos / 1.863 participantes",
      source: "Morton et al. 2018",
    },
  ],
};

const calculateMetadata: CalculateMetadataFunction<NippardReelProps> = async ({
  props,
}) => {
  const durationSeconds = props.duration ?? defaultProps.duration;
  return {
    durationInFrames: Math.max(1, Math.ceil(durationSeconds * fps)),
    fps,
    width: 1080,
    height: 1920,
    props: {
      ...defaultProps,
      ...props,
      overlays: props.overlays ?? defaultProps.overlays,
    },
  };
};

const dismorfiaDefaults: DismorfiaReelProps = {
  videoSrc: "dismorfia/main_preview.mp4",
  captionsJson: "dismorfia/captions.json",
  duration: 54.45,
  leftPhotoSrc: "dismorfia/photo_obeso.png",
  rightPhotoSrc: "dismorfia/photo_atual.PNG",
  ganleyPhotoSrc: "dismorfia/shape_ganley.jpg",
  matuePhotoSrc: "dismorfia/shape_matue.jpg",
  nih23Src: "dismorfia/nih_23percent.png",
  nih38Src: "dismorfia/nih_38hours.png",
};

const calculateDismorfiaMetadata: CalculateMetadataFunction<DismorfiaReelProps> = async ({
  props,
}) => {
  const mergedProps = { ...dismorfiaDefaults, ...props };
  return {
    durationInFrames: Math.ceil((mergedProps.duration ?? 54.45) * fps),
    fps,
    width: 1080,
    height: 1920,
    props: mergedProps,
  };
};

const monsterDefaults: MonsterReelProps = {
  videoSrc: "monster/main_master_hq.mp4",
  captionsJson: "monster/captions.json",
  duration: 63.27,
  studySrc: "monster/estudo_nih.png",
  musicSrc: "monster/music_bg_new.mp3",
};

const calculateMonsterMetadata: CalculateMetadataFunction<MonsterReelProps> = async ({
  props,
}) => {
  const mergedProps = { ...monsterDefaults, ...props };
  return {
    durationInFrames: Math.ceil((mergedProps.duration ?? 63.27) * fps),
    fps,
    width: 1080,
    height: 1920,
    props: mergedProps,
  };
};

const perderPesoDefaults: PerderPesoReelProps = {
  videoSrc:    "perder 68kg/main_preview.mp4",
  captionsJson: "perder 68kg/captions.json",
  duration:    43.537,
  antesSrc:    "perder 68kg/antes.PNG",
  depoisSrc:   "perder 68kg/depois.jpeg",
  pubmedSrc:   "perder 68kg/pubmed.png",
  fundoSrc:    "perder 68kg/fundo_preview.mp4",
  semFundoSrc: "perder 68kg/sem_fundo_alpha.webm",
  inicioSrc:   "perder 68kg/inicio_preview.mp4",
};

const calculatePerderPesoMetadata: CalculateMetadataFunction<PerderPesoReelProps> = async ({
  props,
}) => {
  const merged = { ...perderPesoDefaults, ...props };
  return {
    durationInFrames: Math.ceil((merged.duration ?? 43.537) * 30),
    fps: 30,
    width: 1080,
    height: 1920,
    props: merged,
  };
};

const legDayDefaults: LegDayReelProps = {
  videoSrc: "legday/new_main.mp4",
  captionsJson: "legday/captions.json",
  duration: 66.1,
  quadAnatomySrc: "legday/quadriceps.mp4",
  // hamstringAnatomySrc: "legday/hamstring_anatomy.png",
};

const calculateLegDayMetadata = async ({ props }: { props: LegDayReelProps }) => {
  const merged = { ...legDayDefaults, ...props };
  return {
    durationInFrames: Math.ceil((merged.duration ?? 66.1) * 30),
    fps: 30,
    width: 1080,
    height: 1920,
    props: merged,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER — wrapper de preview pra overlay (1080x1080 green-screen + DevDraggable)
// ═══════════════════════════════════════════════════════════════════════════

const overlayPreview = (children: React.ReactNode) => (
  <AbsoluteFill style={{ background: "#00FF00" }}>
    <DevDraggableProvider>
      {children}
      <DevHUD />
    </DevDraggableProvider>
  </AbsoluteFill>
);

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ╔══════════════════════════════════════════════════════════════════╗
          ║  📺  REELS  —  Composições completas 1080x1920                  ║
          ╚══════════════════════════════════════════════════════════════════╝ */}
      <Folder name="REELS">

        {/* Padrão §10.1 — legenda de reel. endCard e splitScreen MEDIDOS nesta
            fita com medir-fita.py, nunca herdados de outra peça. */}
        <Folder name="NewHair-Suporte">
          <Composition
            id="NewHairSuporte"
            component={NewHairSuporte as React.FC<NewHairSuporteProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(13.167 * 30)}
            defaultProps={{ durationSeconds: 13.167, video: "newhair/suporte_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Supervisionar">
          <Composition
            id="NewHairSupervisionar"
            component={NewHairSupervisionar as React.FC<NewHairSupervisionarProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(16.233 * 30)}
            defaultProps={{ durationSeconds: 16.233, video: "newhair/supervisionar_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Custa2">
          <Composition
            id="NewHairCusta2"
            component={NewHairCusta2 as React.FC<NewHairCusta2Props>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(12.333 * 30)}
            defaultProps={{ durationSeconds: 12.333, video: "newhair/custa2_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Custa">
          <Composition
            id="NewHairCusta"
            component={NewHairCusta as React.FC<NewHairCustaProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(19.108 * 30)}
            defaultProps={{ durationSeconds: 19.108, video: "newhair/custa_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-MuitasMaos">
          <Composition
            id="NewHairMuitasMaos"
            component={NewHairMuitasMaos as React.FC<NewHairMuitasMaosProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(14.8 * 30)}
            defaultProps={{ durationSeconds: 14.8, video: "newhair/muitasmaos_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-SalaVazia">
          <Composition
            id="NewHairSalaVazia"
            component={NewHairSalaVazia as React.FC<NewHairSalaVaziaProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(6.802 * 30)}
            defaultProps={{ durationSeconds: 6.802, video: "newhair/salavazia_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Fluir2">
          <Composition
            id="NewHairFluir2"
            component={NewHairFluir2 as React.FC<NewHairFluir2Props>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(10.842 * 30)}
            defaultProps={{ durationSeconds: 10.842, video: "newhair/fluir2_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Fluir">
          <Composition
            id="NewHairFluir"
            component={NewHairFluir as React.FC<NewHairFluirProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(15.8 * 30)}
            defaultProps={{ durationSeconds: 15.8, video: "newhair/fluir_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Nivel">
          <Composition
            id="NewHairNivel"
            component={NewHairNivel as React.FC<NewHairNivelProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(15.4 * 30)}
            defaultProps={{ durationSeconds: 15.4, video: "newhair/nivel_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Organizada">
          <Composition
            id="NewHairOrganizada"
            component={NewHairOrganizada as React.FC<NewHairOrganizadaProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(7.65 * 30)}
            defaultProps={{ durationSeconds: 7.65, video: "newhair/organizada_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-NaoSo">
          <Composition
            id="NewHairNaoSo"
            component={NewHairNaoSo as React.FC<NewHairNaoSoProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(13.216 * 30)}
            defaultProps={{ durationSeconds: 13.216, video: "newhair/naoso_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Resolve">
          <Composition
            id="NewHairResolve"
            component={NewHairResolve as React.FC<NewHairResolveProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(13.908 * 30)}
            defaultProps={{ durationSeconds: 13.908, video: "newhair/resolve_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Qualidade">
          <Composition
            id="NewHairQualidade"
            component={NewHairQualidade as React.FC<NewHairQualidadeProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(15.558 * 30)}
            defaultProps={{ durationSeconds: 15.558, video: "newhair/qualidade_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Atencao">
          <Composition
            id="NewHairAtencao"
            component={NewHairAtencao as React.FC<NewHairAtencaoProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(15.0 * 30)}
            defaultProps={{ durationSeconds: 15.0, video: "newhair/atencao_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Equipe">
          <Composition
            id="NewHairEquipe"
            component={NewHairEquipe as React.FC<NewHairEquipeProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(7.633 * 30)}
            defaultProps={{ durationSeconds: 7.633, video: "newhair/equipe_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Cinco">
          <Composition
            id="NewHairCinco"
            component={NewHairCinco as React.FC<NewHairCincoProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(9.472 * 30)}
            defaultProps={{ durationSeconds: 9.472, video: "newhair/cinco_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-Implanter">
          <Composition
            id="NewHairImplanter"
            component={NewHairImplanter as React.FC<NewHairImplanterProps>}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={Math.round(11.8 * 30)}
            defaultProps={{ durationSeconds: 11.8, video: "newhair/implanter_h264.mp4" }}
          />
        </Folder>

        <Folder name="NewHair-EquipeCapacitada">
          <Composition
            id="EquipeCapacitada"
            component={EquipeCapacitada}
            durationInFrames={Math.ceil(equipeCapacitadaProps.duration * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={equipeCapacitadaProps}
          />
        </Folder>

        <Folder name="NewHair-PRP">
          <Composition
            id="PRP"
            component={PRP}
            durationInFrames={Math.ceil(prpProps.duration * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={prpProps}
          />
        </Folder>

        <Folder name="Reel11-Ganley">
          <Composition
            id="GanleyReel"
            component={GanleyReel}
            durationInFrames={Math.ceil(ganleyDefaults.duration * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={ganleyDefaults}
          />
        </Folder>

        <Folder name="Reel10-MacaBala">
          <Composition
            id="MacaReel"
            component={MacaReel}
            durationInFrames={Math.ceil(macaDefaults.duration * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={macaDefaults}
          />
        </Folder>

        <Folder name="Reel09-FeedDieta">
          <Composition
            id="FeedReel"
            component={FeedReel}
            durationInFrames={Math.ceil(41.076 * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              videoSrc: "feed/main.mp4",
              captionsJson: "feed/captions.json",
              duration: 41.076,
              estudoSrc: "feed/estudo.png",
            }}
          />
        </Folder>

        <Folder name="Reel08-HolgSuperior">
          <Composition
            id="HolgReel"
            component={HolgReel}
            durationInFrames={Math.ceil(42.678 * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              videoSrc: "holg/main.mp4",
              captionsJson: "holg/captions.json",
              duration: 42.678,
            }}
          />
        </Folder>

        <Folder name="Reel07-EmagrecerRapido">
          <Composition
            id="EmagrecerRapidoReel"
            component={EmagrecerRapidoReel}
            durationInFrames={Math.ceil(58 * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              videoSrc: "perda rapida/main.mp4",
              captionsJson: "reel07/captions.json",
              duration: 58,
            }}
          />
        </Folder>

        <Folder name="Atuais-Referencia">
          <Composition
            id="LegDayReel"
            component={LegDayReel}
            durationInFrames={Math.ceil(66.1 * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={legDayDefaults}
            calculateMetadata={calculateLegDayMetadata}
          />
          <Composition
            id="InsulinarReel"
            component={InsulinarReel}
            durationInFrames={Math.ceil(43.05 * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              videoSrc: "insulina/main_proxy.mp4",
              captionsJson: "insulina/captions.json",
              duration: 43.05,
            }}
          />
          <Composition
            id="PerderPesoReel"
            component={PerderPesoReel}
            durationInFrames={Math.ceil(43.537 * 30)}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={perderPesoDefaults}
            calculateMetadata={calculatePerderPesoMetadata}
          />
        </Folder>

        <Folder name="Legados-Nao-Usar-Como-Base">
          <Composition
            id="DismorfiaReel"
            component={DismorfiaReel}
            durationInFrames={Math.ceil(54.45 * fps)}
            fps={fps}
            width={1080}
            height={1920}
            defaultProps={dismorfiaDefaults}
            calculateMetadata={calculateDismorfiaMetadata}
          />
          <Composition
            id="MonsterReel"
            component={MonsterReel}
            durationInFrames={Math.ceil(63.27 * fps)}
            fps={fps}
            width={1080}
            height={1920}
            defaultProps={monsterDefaults}
            calculateMetadata={calculateMonsterMetadata}
          />
          <Composition
            id="NippardReel"
            component={NippardReel}
            durationInFrames={defaultProps.duration * fps}
            fps={fps}
            width={1080}
            height={1920}
            defaultProps={defaultProps}
            calculateMetadata={calculateMetadata}
          />
        </Folder>

      </Folder>

      {/* ╔══════════════════════════════════════════════════════════════════╗
          ║  🎨  OVERLAYS  —  Componentes isolados 1080x1080 green-screen   ║
          ║  Workflow: posicionar visual → render verde → chroma key CapCut  ║
          ╚══════════════════════════════════════════════════════════════════╝ */}
      <Folder name="OVERLAYS">

        <Folder name="Charts-Dados">
          <Composition
            id="ovl-GraficoBarras"
            component={() =>
              overlayPreview(
                <DevDraggable
                  id="grafico-barras"
                  label="grafico barras"
                  initialTop={120}
                  initialLeft={60}
                  initialWidth={620}
                >
                  {(p) => (
                    <GraficoBarras
                      top={p.top}
                      left={p.left}
                      width={p.width}
                      headerTitle="DEFICIT CALORICO"
                      headerSubtitle="Exemplo — edite as bars no JSON"
                      bars={[
                        { label: ["PESO", "(KG)"], color: "#5A5A5A", from: 118, to: 98, unit: "kg" },
                        { label: ["% GORDURA"], color: "#C87D10", from: 34, to: 22, unit: "%" },
                        { label: ["RESISTENCIA", "INSULINICA"], color: "#8B1A1A", from: 100, to: 88, unit: "%", pulse: true },
                      ]}
                    />
                  )}
                </DevDraggable>
              )
            }
            durationInFrames={90}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />
          <Composition
            id="ovl-GraficoTorreInsulina"
            component={() =>
              overlayPreview(
                <DevDraggable
                  id="insulina-chart"
                  label="insulina chart"
                  initialTop={60}
                  initialLeft={40}
                  initialWidth={1000}
                >
                  {(p) => (
                    <InsulinaBarChart top={p.top} left={p.left} width={p.width} />
                  )}
                </DevDraggable>
              )
            }
            durationInFrames={72}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />
          <Composition
            id="ovl-GraficoTorreVerticalInsulina"
            component={() =>
              overlayPreview(
                <DevDraggable
                  id="insulina-chart-vertical"
                  label="insulina chart vertical"
                  initialTop={60}
                  initialLeft={40}
                  initialWidth={340}
                >
                  {(p) => <InsulinaBarChartVertical top={p.top} left={p.left} />}
                </DevDraggable>
              )
            }
            durationInFrames={72}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />
        </Folder>

        <Folder name="Setas-Indicadores">
          <Composition
            id="ovl-SetaAnatomia"
            component={() => (
              <AbsoluteFill style={{ background: "#00FF00" }}>
                <SetaAnatomia
                  fromX={780}
                  fromY={200}
                  toX={420}
                  toY={620}
                  color="#FFD700"
                  label="AQUI"
                  labelPosition="above"
                  labelFontSize={42}
                  strokeWidth={10}
                  arrowHeadSize={40}
                  drawInFrames={18}
                />
              </AbsoluteFill>
            )}
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />
        </Folder>

        <Folder name="Cards-Papers">
          <Composition
            id="ovl-PaperCaminhada"
            component={() =>
              overlayPreview(
                <DevDraggable
                  id="paper-caminhada"
                  label="paper caminhada"
                  initialTop={60}
                  initialLeft={60}
                  initialWidth={960}
                >
                  {(p) => <PaperHighlightCaminhada top={p.top} left={p.left} />}
                </DevDraggable>
              )
            }
            durationInFrames={120}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />
          {/* TODO: previews pra <PaperOverlay>, <IngredientCard>, <BeforeAfterCard>, <DynamicStudyOverlay>
              Criar sob demanda — pedir ao Claude: "cria preview do <NomeComponent>" */}
        </Folder>

        {/* ╔══════════════════════════════════════════════════════════════════╗
            ║  📚  NIPPARD-REFS  —  8 componentes extraidos de 3 reels do Nippard  ║
            ║  Catalogados 2026-05-18. Genericos, parametrizaveis via props.       ║
            ╚══════════════════════════════════════════════════════════════════╝ */}
        <Folder name="Nippard-Refs">

          <Composition
            id="ovl-PillBadge-white"
            component={() =>
              overlayPreview(
                <>
                  <PillBadge top={120} left={60} variant="white" text="NEW LIFTERS" />
                  <PillBadge top={220} left={60} variant="white" text="SLOW BULK" emoji="🥗" />
                  <PillBadge top={320} left={60} variant="white" text="WEEK 1" />
                  <PillBadge top={420} left={60} variant="white" text="Normal Diet + 2010 kcal" fontSize={22} />
                </>
              )
            }
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-PillBadge-dark"
            component={() =>
              overlayPreview(
                <>
                  <PillBadge top={120} left={60} variant="dark" text="Caminhada leve" />
                  <PillBadge top={220} left={60} variant="dark" text="20-50%" arrow="↓" />
                  <PillBadge top={320} left={60} variant="dark" text="0.7 g/lb" fontSize={26} />
                </>
              )
            }
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-PillBadge-meal"
            component={() =>
              overlayPreview(
                <>
                  <PillBadge top={100} left={60} variant="meal" text="MEAL 1 -" accent="10:00am" />
                  <PillBadge top={220} left={60} variant="meal" text="MEAL 2 -" accent="3:00pm" />
                  <PillBadge top={340} left={60} variant="meal" text="SNACK -" accent="6:00pm" />
                  <PillBadge top={460} left={60} variant="meal" text="MEAL 3 -" accent="8:00pm" />
                </>
              )
            }
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-PillBadge-ingredient"
            component={() =>
              overlayPreview(
                <>
                  <PillBadge top={120} left={60} variant="ingredient" text="Egg whites" />
                  <PillBadge top={200} left={60} variant="ingredient" text="Mushrooms" />
                  <PillBadge top={280} left={60} variant="ingredient" text="Chicken breast" />
                  <PillBadge top={360} left={60} variant="ingredient" text="Strawberries" />
                </>
              )
            }
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-WeekTabBar"
            component={() =>
              overlayPreview(
                <>
                  <WeekTabBar top={80} left={60} steps={["WEEK 1", "WEEK 2", "WEEK 3"]} activeIndex={0} />
                  <WeekTabBar top={200} left={60} steps={["WEEK 1", "WEEK 2", "WEEK 3"]} activeIndex={1} />
                  <WeekTabBar top={320} left={60} steps={["WEEK 1", "WEEK 2", "WEEK 3"]} activeIndex={2} />
                  <WeekTabBar top={440} left={60} steps={["DIA 1", "DIA 2", "DIA 3", "DIA 4"]} activeIndex={1} fontSize={22} />
                </>
              )
            }
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-PictogramGrid"
            component={() =>
              overlayPreview(
                <>
                  {/* Grupo: 9 verdes + 1 cinza (estudo de prevalência) */}
                  <PictogramGrid
                    top={80}
                    left={60}
                    cols={10}
                    iconSize={70}
                    gap={8}
                    groups={[
                      { count: 9, color: "#2D6A4F" },
                      { count: 1, color: "#888" },
                    ]}
                  />
                  {/* Grupo dense: 33 silhuetas pequenas */}
                  <PictogramGrid
                    top={260}
                    left={60}
                    cols={11}
                    iconSize={48}
                    gap={4}
                    groups={[{ count: 33, color: "#7AAACB" }]}
                  />
                </>
              )
            }
            durationInFrames={90}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-StackedBlockChart"
            component={() =>
              overlayPreview(
                <DevDraggable
                  id="stacked-blocks"
                  label="stacked blocks"
                  initialTop={120}
                  initialLeft={120}
                  initialWidth={420}
                >
                  {(p) => (
                    <StackedBlockChart
                      top={p.top}
                      left={p.left}
                      width={p.width}
                      headerLabel="WEIGHT GAIN"
                      blocks={[
                        { label: "FAT", height: 110, color: "#D4A017", width: p.width },
                        { label: "MUSCLE", height: 90, color: "#2D6A4F", width: p.width * 0.55 },
                        { label: "UNREALIZED GAINS", height: 90, color: "#7A8B7E", width: p.width * 0.45, fontSize: 16 },
                      ]}
                    />
                  )}
                </DevDraggable>
              )
            }
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-PaperHighlight"
            component={() =>
              overlayPreview(
                <PaperHighlight
                  top={80}
                  left={60}
                  width={960}
                  title="Conclusions"
                  textBefore="In the present sample, "
                  highlightWords={[
                    "individuals", "who", "consumed", "larger", "energy", "surpluses",
                  ]}
                  textAfter=" — thereby gaining more body mass — experienced similar increases in strength and triceps and quadriceps muscle size but increased their skinfold thicknesses more compared to those who consumed smaller energy surpluses or maintenance calories."
                  highlightStart={20}
                  highlightDuration={50}
                />
              )
            }
            durationInFrames={120}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-BarChartPaper"
            component={() =>
              overlayPreview(
                <BarChartPaper
                  top={60}
                  left={60}
                  width={700}
                  height={400}
                  titlePills={["NEW LIFTERS", "Normal Diet + 2010 kcal"]}
                  yAxisLabel="Total Weight Gain (kg)"
                  yMax={7}
                  bars={[
                    { label: "Body Mass", value: 6.5, color: "#9C9C9C" },
                    { label: "Fat-Free Mass", value: 3.2, color: "#7A8B7E" },
                    { label: "Fat Mass", value: 3.0, color: "#D4A017" },
                  ]}
                />
              )
            }
            durationInFrames={90}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-ExperienceGauge"
            component={() =>
              overlayPreview(
                <ExperienceGauge
                  top={120}
                  left={120}
                  width={500}
                  levels={[
                    { label: "Beginner",     color: "#9C9C9C" },
                    { label: "Intermediate", color: "#6E7E70" },
                    { label: "Advanced",     color: "#2D6A4F" },
                  ]}
                  activeIndex={2}
                  arrowLabel="VOCE"
                />
              )
            }
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-AthleteCard"
            component={() =>
              overlayPreview(
                <DevDraggable
                  id="athlete-card"
                  label="athlete card"
                  initialTop={60}
                  initialLeft={140}
                  initialWidth={800}
                >
                  {(p) => (
                    <AthleteCard
                      top={p.top}
                      left={p.left}
                      width={p.width}
                      topPill="1900s"
                      name="George Hackenschmidt"
                      stats="5'9, 200 lbs"
                      photoSrc="dismorfia/shape_ganley.jpg"
                    />
                  )}
                </DevDraggable>
              )
            }
            durationInFrames={90}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-AthleteCard-scene"
            component={() => (
              <AthleteCard
                scene
                width={520}
                topPill="2020s"
                name="Chris Bumstead"
                stats="6'1, 240 lbs"
                photoSrc="dismorfia/shape_matue.jpg"
              />
            )}
            durationInFrames={90}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{}}
          />

          <Composition
            id="ovl-MuscleGlowOverlay"
            component={() => (
              <AbsoluteFill style={{ background: "#00FF00" }}>
                {/* Red glow no bíceps (estilo "muscle memory") */}
                <MuscleGlowOverlay
                  cx={540}
                  cy={520}
                  rx={220}
                  ry={130}
                  rotate={-15}
                  variant="red"
                  pulse
                />
                {/* Orange glow no calf */}
                <MuscleGlowOverlay
                  cx={540}
                  cy={1200}
                  rx={150}
                  ry={220}
                  rotate={0}
                  variant="orange"
                />
                {/* Yellow glow stretch point */}
                <MuscleGlowOverlay
                  cx={540}
                  cy={1600}
                  rx={300}
                  ry={80}
                  rotate={0}
                  variant="yellow"
                  maxOpacity={0.75}
                />
              </AbsoluteFill>
            )}
            durationInFrames={90}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{}}
          />

          <Composition
            id="ovl-PillBadge-decade"
            component={() =>
              overlayPreview(
                <>
                  <PillBadge top={120} left={60} variant="white" text="1900s" underline fontSize={32} />
                  <PillBadge top={240} left={60} variant="white" text="1920s" underline fontSize={32} />
                  <PillBadge top={360} left={60} variant="white" text="ANTES" underline fontSize={32} />
                  <PillBadge top={480} left={60} variant="white" text="CASE STUDY 1" underline fontSize={26} />
                </>
              )
            }
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

          <Composition
            id="ovl-PhoneMockup"
            component={() =>
              overlayPreview(
                <DevDraggable
                  id="phone-mockup"
                  label="phone mockup"
                  initialTop={60}
                  initialLeft={300}
                  initialWidth={380}
                >
                  {(p) => (
                    <PhoneMockup
                      top={p.top}
                      left={p.left}
                      width={p.width}
                      screenshotSrc="dismorfia/photo_atual.PNG"
                      rotate={-3}
                    />
                  )}
                </DevDraggable>
              )
            }
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={{}}
          />

        </Folder>

        {/* TODO — Folders abaixo serao populados sob demanda.
            Pedir ao Claude: "cria preview de <NomeComponent>"
            Componentes disponiveis (ver OVERLAYS_LIBRARY.md):
            - Texto/Titulos:   TopTitleCard, ImpactWord
            - Listas:          IngredientChecklist, StrikethroughList
            - Cards:           PaperOverlay, IngredientCard, BeforeAfterCard, DynamicStudyOverlay
            - Genericos:       LogoStamp, GuestPhotoOverlay, FloatingStats, StatBar,
                               PopulationBurst, ScientificEnvironment, ScientificFooter, MiniMonsterCan
            - Camera/wrappers: CognitiveZoom, InsertCutaway (nao precisam de preview isolado)
        */}

      </Folder>

      {/* ═══════════════════════════════════════════════════════════════════
          EXPORT-CapCut — overlays prontos pra exportar direto pro CapCut
          Nao sao bases. Renderizar e importar como clip.
      ═══════════════════════════════════════════════════════════════════ */}
      <Folder name="EXPORT-CapCut">

        <Composition
          id="export-GraficoFome"
          component={() =>
            overlayPreview(
              <FomeBarChart top={60} left={60} width={820} />
            )
          }
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{}}
        />

      </Folder>

      {/* ═══════════════════════════════════════════════════════════════════
          DEV — Composer: arrasta overlays em cima do vídeo real
          1. Selecionar "ComposerView" no Studio
          2. Edit Props → videoSrc → ex: "legday/new_main.mp4"
          3. Painel esquerdo: clicar "+" para adicionar overlay
          4. Arrastar + ajustar no DevHUD → COPY → mandar pro Claude
      ════════════════════════════════════════════════════════════════════ */}
      <Folder name="DEV-Composer">
        <Composition
          id="ComposerView"
          component={ComposerView}
          schema={composerViewSchema}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            videoSrc: "reels maça/main.mp4",
            audioSrc: "reels maça/main_audio.m4a",
            videoOpacity: 1,
          } satisfies ComposerViewProps}
        />
      </Folder>

    </>
  );
};
