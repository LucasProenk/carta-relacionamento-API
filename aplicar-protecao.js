/*
  Aplica no index.html a proteção da foto da surpresa:
    1. trava o toque longo / salvar imagem
    2. marca d'água "só pra você"
    3. esconde a foto quando ela sai do app ou troca de aba

  Como usar (na pasta do projeto):
    node aplicar-protecao.js

  Faz backup em originais/index.backup.html (pasta que não vai pro GitHub).
  Pode rodar mais de uma vez: se já estiver aplicado, ele avisa e não duplica.
*/
const fs = require("fs");
const path = require("path");

const ARQUIVO = "index.html";

if (!fs.existsSync(ARQUIVO)) {
  console.error("Não achei o index.html. Rode o comando dentro da pasta do projeto (ana).");
  process.exit(1);
}

let html = fs.readFileSync(ARQUIVO, "utf8");

if (html.includes("marca-dagua")) {
  console.log("A proteção já está aplicada. Nada a fazer.");
  process.exit(0);
}

// backup fora do GitHub
fs.mkdirSync("originais", { recursive: true });
fs.writeFileSync(path.join("originais", "index.backup.html"), html);

function trocar(descricao, antigo, novo) {
  if (!html.includes(antigo)) {
    console.error("NÃO ACHEI: " + descricao);
    console.error("Seu index.html está diferente do esperado. Nada foi alterado.");
    process.exit(1);
  }
  html = html.replace(antigo, () => novo);
  console.log("OK: " + descricao);
}

// 1. CSS: trava toque longo e seleção na foto
const cssAntigo =
  ".premio-tela img { max-width: 100%; max-height: 60vh; border-radius: 6px; border: 8px solid #fff; }";
const cssNovo =
  ".premio-tela img { max-width: 100%; max-height: 60vh; border-radius: 6px; border: 8px solid #fff; " +
  "-webkit-touch-callout: none; -webkit-user-select: none; user-select: none; pointer-events: none; }\n" +
  "  .marca-dagua {\n" +
  "    position: absolute; inset: 0; z-index: 1; pointer-events: none;\n" +
  "    background-image: url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='140'%3E" +
  "%3Ctext x='10' y='80' transform='rotate(-25 110 70)' font-family='Georgia' font-size='18' " +
  "fill='white' fill-opacity='0.2'%3Esó pra você%3C/text%3E%3C/svg%3E\");\n" +
  "  }";
trocar("travar toque longo na foto + estilo da marca d'água", cssAntigo, cssNovo);

// 2. HTML: camada da marca d'água
const htmlAntigo = '<img id="premio-img" alt="Surpresa" style="display:none">';
const htmlNovo = htmlAntigo + '\n    <div class="marca-dagua"></div>';
trocar("marca d'água na tela do prêmio", htmlAntigo, htmlNovo);

// 3. JS: esconde a foto ao sair do app
const jsAntigo = "  async function carregarLista() {";
const jsNovo =
  "  // Esconde a foto quando ela sai do app ou troca de aba\n" +
  "  document.addEventListener(\"visibilitychange\", () => {\n" +
  "    img.style.visibility = document.hidden ? \"hidden\" : \"visible\";\n" +
  "  });\n\n" +
  jsAntigo;
trocar("esconder foto ao sair do app", jsAntigo, jsNovo);

fs.writeFileSync(ARQUIVO, html);
console.log("\nPronto! index.html atualizado. Backup em originais/index.backup.html");