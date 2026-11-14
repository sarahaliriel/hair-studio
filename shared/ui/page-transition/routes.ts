export const transitionTitles: Record<string, string> = {
  "/": "Início",
  "/servicos": "Serviços",
  "/galeria": "Galeria",
};

export function routeKey(path: string) {
  return path.replace(/\/$/, "") || "/";
}

export function destinationTitle(url: URL) {
  // These are sections on the homepage, not additional routes.
  if (url.pathname === "/" && url.hash === "#contato") return "Contacto";
  if (url.pathname === "/" && url.hash === "#sobre") return "O Espaço";
  return transitionTitles[routeKey(url.pathname)] ?? "Arlete Space";
}
