/*
  Adiciona o comando "rain" na barra de comandos (lupa) do index.html:
  faz chover na tela e abre o link de uma música do Spotify.
  O comando pode ser usado quantas vezes ela quiser (não dá pontos).

  Precisa ter rodado antes o aplicar-comandos.js.

  Como usar (na pasta do projeto), passando o link da música entre aspas:
    node aplicar-rain.js "https://open.spotify.com/track/XXXXXXXX"

  No Spotify: música > ... > Compartilhar > Copiar link da música.

  Faz backup em originais/index.backup-rain.html (pasta que não vai pro GitHub).
  Pode rodar mais de uma vez: se já estiver aplicado, ele avisa e não duplica.
  Pra trocar a música depois, mude o valor de LINK_RAIN dentro do index.html.
*/
const fs = require("fs");
const path = require("path");

const ARQUIVO = "index.html";
const link = process.argv[2];

if (!link || !/^https:\/\//.test(link)) {
  console.error('Faltou o link da música. Exemplo:');
  console.error('  node aplicar-rain.js "https://open.spotify.com/track/XXXXXXXX"');
  process.exit(1);
}

if (!fs.existsSync(ARQUIVO)) {
  console.error("Não achei o index.html. Rode o comando dentro da pasta do projeto (ana).");
  process.exit(1);
}

let html = fs.readFileSync(ARQUIVO, "utf8");

if (!html.includes("configurarComandos")) {
  console.error("Não achei a barra de comandos. Rode antes: node aplicar-comandos.js");
  process.exit(1);
}

if (html.includes("EFEITOS")) {
  console.log("O comando rain já está aplicado. Nada a fazer.");
  process.exit(0);
}

fs.mkdirSync("originais", { recursive: true });
fs.writeFileSync(path.join("originais", "index.backup-rain.html"), html);

function trocar(descricao, antigo, novo) {
  const partes = html.split(antigo).length - 1;
  if (partes !== 1) {
    console.error("NÃO ACHEI (ou achei mais de uma vez): " + descricao);
    console.error("Seu index.html está diferente do esperado. Nada foi alterado.");
    process.exit(1);
  }
  html = html.replace(antigo, () => novo);
  console.log("OK: " + descricao);
}

/* 1. CSS da chuva */
const cssAntigo = "/* ===== PAINEL DE TESTE";
const cssNovo = `/* ===== CHUVA (comando rain) ===== */
  .chuva {
    position: fixed; inset: 0; z-index: 18; background: rgba(20, 12, 32, .35);
    overflow: hidden; cursor: pointer; transition: opacity 1s ease;
  }
  .chuva.saindo { opacity: 0; }
  .gota {
    position: absolute; top: -40px; width: 2px; height: 18px; border-radius: 2px;
    background: linear-gradient(to bottom, rgba(200, 220, 255, 0), rgba(200, 220, 255, .85));
    animation: cair linear infinite;
  }
  @keyframes cair { to { transform: translateY(110vh); } }
  .chuva-dica {
    position: absolute; left: 0; right: 0; margin: 0;
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    text-align: center; color: #fff; font-style: italic; font-size: .95rem; opacity: .85;
  }

  /* ===== PAINEL DE TESTE`;
trocar("estilo da chuva", cssAntigo, cssNovo);

/* 2. Efeitos (rain) */
const efAntigo = "  function abrir() {";
const efNovo =
  "  // Música do comando rain (link do Spotify)\n" +
  "  const LINK_RAIN = " + JSON.stringify(link) + ";\n\n" +
  `  // comando -> efeito na tela (pode usar quantas vezes quiser)
  const EFEITOS = {
    rain: () => {
      fechar();
      if (document.querySelector(".chuva")) { window.open(LINK_RAIN, "_blank"); return; }

      const chuva = document.createElement("div");
      chuva.className = "chuva";

      const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduzir) {
        for (let i = 0; i < 90; i++) {
          const g = document.createElement("span");
          g.className = "gota";
          g.style.left = (Math.random() * 100) + "%";
          g.style.animationDuration = (0.6 + Math.random() * 0.7) + "s";
          g.style.animationDelay = (-Math.random() * 1.3) + "s";
          g.style.opacity = String(0.4 + Math.random() * 0.6);
          chuva.appendChild(g);
        }
      }

      const dica = document.createElement("p");
      dica.className = "chuva-dica";
      dica.textContent = "toque na tela pra parar a chuva 🌧️";
      chuva.appendChild(dica);

      chuva.addEventListener("click", () => {
        chuva.classList.add("saindo");
        setTimeout(() => chuva.remove(), 1000);
      });

      document.body.appendChild(chuva);
      window.open(LINK_RAIN, "_blank");
    }
  };

` + efAntigo;
trocar("efeito do comando rain", efAntigo, efNovo);

/* 3. Fazer o executar() reconhecer efeitos */
const execAntigo = "if (!Object.prototype.hasOwnProperty.call(COMANDOS, texto)) {";
const execNovo =
  "if (Object.prototype.hasOwnProperty.call(EFEITOS, texto)) {\n" +
  "      EFEITOS[texto]();\n" +
  "      return;\n" +
  "    }\n\n" +
  "    " + execAntigo;
trocar("reconhecer o comando rain", execAntigo, execNovo);

fs.writeFileSync(ARQUIVO, html);
console.log("\nPronto! index.html atualizado. Backup em originais/index.backup-rain.html");