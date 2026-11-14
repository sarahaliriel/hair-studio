export type ToolAsset = {
  id: string;
  src: string;
  width: number;
  aspect: number;
  /** Convex alpha-silhouette slices, normalized to the tightly cropped image. */
  parts: { x: number; y: number }[][];
  x: number;
  angle: number;
};
