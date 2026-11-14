/** Keep the bar inert while any independent visibility or page lock is active. */
export function syncFloatingCtaInert(
  bar: HTMLElement,
  visible: boolean,
  doc: Document = document,
) {
  const introPending = doc.documentElement.classList.contains("intro-pending");
  const introActive =
    doc.querySelector(
      '.home-intro[data-active="true"], .home-intro[data-active="revealing"]',
    ) !== null;
  const transitionActive =
    doc.querySelector('.page-transition[data-active="true"]') !== null;
  const blocked = !visible || introPending || introActive || transitionActive;

  if (blocked && bar.contains(doc.activeElement)) {
    (doc.activeElement as HTMLElement | null)?.blur?.();
  }
  bar.inert = blocked;
  return blocked;
}
