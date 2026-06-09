import React from "react";
import { getRemotionEnvironment } from "remotion";
import { DevDraggableProvider, DevHUD } from "./DevDraggable";
import { DevComposerLayer, DevComposerPanel } from "./DevComposer";

const isStudio = () => {
  try {
    return getRemotionEnvironment().isStudio;
  } catch {
    return false;
  }
};

export const StudioOverlayTools: React.FC = () => {
  if (!isStudio()) return null;

  return (
    <>
      <DevComposerLayer />
      <DevComposerPanel />
      <DevHUD />
    </>
  );
};

export const StudioOverlayEditor: React.FC = () => {
  if (!isStudio()) return null;

  return (
    <DevDraggableProvider>
      <StudioOverlayTools />
    </DevDraggableProvider>
  );
};
