export const DEFAULT_REVEAL_START = "clamp(top 88%)";

function edge(value: string, size: number): number {
  const match = /^(top|center|bottom|[-+]?\d*\.?\d+(?:%|px)?)(?:([+-])=(\d*\.?\d+)(%|px)?)?$/.exec(value);
  if (!match) throw new Error(`Unsupported reveal edge: ${value}`);
  const base = match[1];
  const offset = base === "top" ? 0 : base === "center" ? size / 2 : base === "bottom" ? size :
    parseFloat(base) * (base.endsWith("%") ? size / 100 : 1);
  const adjustment = Number(match[3] || 0) * (match[4] === "%" ? size / 100 : 1);
  return offset + (match[2] === "-" ? -adjustment : adjustment);
}

/** GSAP's vertical start expression, resolved against actual sticky viewport bounds.
 * Covers the homepage's top/percentage starts, edge offsets and numeric starts.
 */
export function sceneRevealEligible(
  top: number, elementHeight: number, start: string,
  viewportHeight: number, scroll: number, maxScroll: number,
) {
  const clamped = start.startsWith("clamp(") && start.endsWith(")");
  const expression = clamped ? start.slice(6, -1) : start;
  const absolute = Number(expression);
  const [local, viewport = "0"] = expression.trim().split(/\s+/);
  const position = expression.trim() && Number.isFinite(absolute) ? absolute :
    scroll + top + edge(local, elementHeight) - edge(viewport, viewportHeight);
  return scroll >= (clamped ? Math.max(0, Math.min(maxScroll, position)) : position);
}
