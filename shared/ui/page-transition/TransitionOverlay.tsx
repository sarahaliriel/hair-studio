import { forwardRef } from "react";

export const hiddenPath = "M -10 105 Q 50 105 110 105 L 110 220 L -10 220 Z";

export const TransitionOverlay = forwardRef<HTMLDivElement>(function TransitionOverlay(_, ref) {
  return (
    <div ref={ref} className="page-transition" data-active="false" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
        <path data-transition-surface d={hiddenPath} fill="var(--wine)" />
      </svg>
      <div className="page-transition-title">
        <div className="page-transition-title-mask" data-transition-title />
      </div>
    </div>
  );
});
