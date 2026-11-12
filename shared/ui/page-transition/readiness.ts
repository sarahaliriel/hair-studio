/** The overlay remains the single source of truth for destination visibility. */
export function pageTransitionActive() {
  return !!document.querySelector('.page-transition[data-active="true"]');
}

export function whenPageVisible(callback: () => void) {
  let started = false;
  const ready = () => {
    if (started || pageTransitionActive()) return;
    started = true;
    document.removeEventListener("arlete:page-visible", ready);
    callback();
  };
  // Subscribe before checking state, so an already-released page never waits.
  document.addEventListener("arlete:page-visible", ready);
  ready();
  return () => document.removeEventListener("arlete:page-visible", ready);
}
