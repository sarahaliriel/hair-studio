import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const entry = readFileSync("app/globals.css", "utf8");
const imports = [
  '@import "tailwindcss";',
  '@import "../styles/tokens.css";',
  '@import "../styles/base.css";',
  '@import "../styles/utilities.css";',
  "@custom-variant dark (&:where(.dark, .dark *));",
];

let previous = -1;
for (const statement of imports) {
  const position = entry.indexOf(statement);
  assert(
    position > previous,
    `Import/configuração global ausente ou fora de ordem: ${statement}`,
  );
  previous = position;
}

const cssDirectory = ".next/static/chunks";
const chunks = readdirSync(cssDirectory)
  .filter((file) => file.endsWith(".css"))
  .map((file) => readFileSync(join(cssDirectory, file), "utf8"));
assert(
  chunks.length > 0,
  "CSS compilado ausente; executa npm run build primeiro",
);

const foundations = chunks.find(
  (css) =>
    css.includes("--bg:#f5f1eb") &&
    css.includes("a{color:inherit;text-decoration:none}"),
);
assert(
  foundations,
  "Tokens e reset de links não aparecem juntos no CSS compilado",
);

for (const token of [
  "--bg",
  "--ink",
  "--nude",
  "--clay",
  "--wine",
  "--font-body",
  "--type-button-size",
]) {
  assert(
    foundations.includes(`${token}:`),
    `Token ausente no CSS compilado: ${token}`,
  );
}
assert(
  foundations.includes(".section-wrap{"),
  "Utilitários globais ausentes no CSS compilado",
);
assert(
  foundations.includes(".site-button[data-slot=button]{"),
  "Estilo do botão partilhado ausente",
);
assert(
  foundations.includes(".site-button-label"),
  "Estilo do rótulo do botão ausente",
);

const order = [
  "--bg:#f5f1eb",
  "a{color:inherit;text-decoration:none}",
  ".section-wrap{",
  ".site-button[data-slot=button]{",
];
for (let i = 1; i < order.length; i++) {
  assert(
    foundations.indexOf(order[i - 1]) < foundations.indexOf(order[i]),
    `Ordem compilada alterada: ${order[i]}`,
  );
}

console.log(
  "Fundações globais e estilos partilhados presentes na ordem esperada.",
);
