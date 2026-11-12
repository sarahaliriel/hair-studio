import type { ReactNode } from "react";

/** One native sticky composition behind an incoming arc, without content clones. */
export function ArcScrollScene({
  children,
  incoming,
}: {
  children: ReactNode;
  incoming: ReactNode;
}) {
  return (
    <div className="arc-scroll-scene" data-arc-scene>
      <div className="arc-scroll-outgoing" data-arc-outgoing>
        {children}
      </div>
      {incoming}
    </div>
  );
}
