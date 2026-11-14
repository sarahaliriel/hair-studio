/** Resolve a fragment without changing the URL or the current focus. */
export function hashTarget(
  hash: string,
  doc: Pick<Document, "getElementById"> = document,
) {
  if (!hash || hash === "#") return null;
  try {
    return doc.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

/** Keep the browser's scroll-padding and the target's scroll-margin in effect. */
export function alignHash(hash: string, doc: Document = document) {
  const target = hashTarget(hash, doc);
  if (!target) return false;
  target.scrollIntoView({ behavior: "instant", block: "start" });
  return true;
}
