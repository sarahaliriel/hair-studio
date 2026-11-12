// Configurable collection; silhouette data is generated separately.
import type { ToolAsset } from "./types";
import geometry from "./geometry.json";

export const salonTools: ToolAsset[] = [
  { id: "dryer", src: "/images/footer-tools/dryer.webp", width: 230, x: 0.14, angle: -0.2, ...geometry["dryer"] },
  { id: "comb", src: "/images/footer-tools/comb.webp", width: 235, x: 0.7, angle: 0.18, ...geometry["comb"] },
  { id: "scissors", src: "/images/footer-tools/scissors.webp", width: 260, x: 0.38, angle: -0.28, ...geometry["scissors"] },
  { id: "bowl", src: "/images/footer-tools/bowl.webp", width: 190, x: 0.85, angle: 0.1, ...geometry["bowl"] },
  { id: "hairbrush", src: "/images/footer-tools/hairbrush.webp", width: 240, x: 0.53, angle: 0.22, ...geometry["hairbrush"] },
  { id: "tint-brush", src: "/images/footer-tools/tint-brush.webp", width: 245, x: 0.23, angle: -0.3, ...geometry["tint-brush"] },
  { id: "clip", src: "/images/footer-tools/clip.webp", width: 205, x: 0.67, angle: 0.16, ...geometry["clip"] },
];
