/** Shared scene policy; progress always comes from native scroll, never a spring. */
export const ARC_COVERED = 0.78;
export const ARC_CONTENT_ENTER = 0.8;

export function sceneProgress(top: number, scroll: number, height: number, destinationOffset = 0) {
  // Hash navigation ends below the header, not at viewport top. Normalize that
  // destination's scene to its actual landing point, including short viewports.
  return Math.max(0, Math.min(1, (height - (top - scroll)) / Math.max(1, height - destinationOffset)));
}

export function contentExposed(progress: number, wasVisible: boolean) {
  // Reverse only once the fully covering surface begins to uncover again.
  return wasVisible ? progress >= ARC_COVERED : progress > ARC_CONTENT_ENTER;
}

export function visualExitProgress(bottom: number, height: number) {
  return Math.max(0, Math.min(1, (height * 0.18 - bottom) / Math.max(1, height * 0.2)));
}
