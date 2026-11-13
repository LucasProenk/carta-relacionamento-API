/*
  Transforma o site em "cara de aplicativo":
    1. Tira o envelope. No lugar, abre uma tela com o ícone (icon.png) que some esmaecendo.
    2. Barra fixa no topo com o ícone e o nome.
    3. Barra de ícones embaixo (estilo Instagram): Início, Estudar, Sorte, Calendário, Buscar.
       Os botões antigos do topo ficam escondidos (a barra de baixo usa as mesmas funções).

  Precisa ter rodado antes: aplicar-comandos.js e aplicar-estudo.js.

  Como usar (na pasta do projeto):
    node aplicar-app.js

  Faz backup em originais/index.backup-app.html (pasta que não vai pro GitHub).
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

if (html.includes("nav-app")) {
  console.log("O layout de aplicativo já está aplicado. Nada a fazer.");
  process.exit(0);
}
if (!html.includes("abrir-estudo") || !html.includes("abrir-busca")) {
  console.error("Faltam botões. Rode antes: node aplicar-comandos.js e node aplicar-estudo.js");
  process.exit(1);
}

fs.mkdirSync("originais", { recursive: true });
fs.writeFileSync(path.join("originais", "index.backup-app.html"), html);

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

/* 1. Tela cheia no iPhone (área segura do topo e da base) */
trocar(
  "ajuste de tela cheia",
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
);

/* 2. Tela de abertura com o ícone */
trocar(
  "tela de abertura com o ícone",
  "<body>",
  '<body>\n  <div class="splash" id="splash"><img src="icon.png?v=2" alt=""></div>'
);

/* 3. CSS */
trocar("estilo do app", "/* ===== PAINEL DE TESTE", `/* ===== LAYOUT DE APLICATIVO ===== */
  body {
    padding-top: calc(66px + env(safe-area-inset-top, 0px));
    padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
  }
  .topo { display: none; }
  .envelope-tela { display: none !important; }

  .splash {
    position: fixed; inset: 0; z-index: 40; background: var(--noite);
    display: flex; align-items: center; justify-content: center;
    transition: opacity .8s ease, visibility .8s;
  }
  .splash.saindo { opacity: 0; visibility: hidden; }
  .splash img {
    width: 110px; height: 110px; border-radius: 26px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, .45);
    animation: splashEntrar .9s ease-out both;
  }
  @keyframes splashEntrar { from { opacity: 0; transform: scale(.8); } to { opacity: 1; transform: none; } }

  .app-topo {
    position: fixed; top: 0; left: 0; right: 0; z-index: 11;
    display: flex; align-items: center; gap: 10px;
    padding: calc(8px + env(safe-area-inset-top, 0px)) 16px 8px;
    background: rgba(42, 31, 61, .96); border-bottom: 1px solid rgba(255, 255, 255, .1);
    -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  }
  .app-topo img { width: 30px; height: 30px; border-radius: 8px; }
  .app-topo span { font-family: "Caveat", cursive; font-size: 1.6rem; color: #fff; line-height: 1; }

  .nav-app {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 12;
    display: flex; justify-content: space-around; align-items: center;
    padding: 6px 4px calc(6px + env(safe-area-inset-bottom, 0px));
    background: rgba(42, 31, 61, .96); border-top: 1px solid rgba(255, 255, 255, .12);
    -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  }
  .nav-app button {
    position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
    border: 0; background: none; padding: 4px 0; cursor: pointer;
    color: #b9a9d4; font-family: "Newsreader", Georgia, serif; font-size: .7rem;
    -webkit-tap-highlight-color: transparent;
  }
  .nav-app .ic { font-size: 1.5rem; line-height: 1; filter: grayscale(1) opacity(.6); transition: transform .15s ease; }
  .nav-app button.ativo { color: #fff; }
  .nav-app button.ativo .ic { filter: none; transform: scale(1.12); }
  .nav-app button:active .ic { transform: scale(.9); }
  .nav-ponto {
    position: absolute; top: 2px; left: calc(50% + 8px); width: 11px; height: 11px;
    border-radius: 50%; background: var(--rosa); border: 2px solid var(--noite);
  }
  .nav-ponto[hidden] { display: none; }

  .premio-btn { bottom: calc(84px + env(safe-area-inset-bottom, 0px)); }
  .painel-teste { bottom: calc(84px + env(safe-area-inset-bottom, 0px)); }

  /* ===== PAINEL DE TESTE`);

/* 4. Barra do topo e barra de baixo */
const htmlAntigo = '<div class="sorte-tela" id="sorte-tela" hidden>';
trocar("barra do topo e menu de baixo", htmlAntigo, `<header class="app-topo"><img src="icon.png?v=2" alt=""><span>Carta do dia</span></header>

  <nav class="nav-app" aria-label="Menu">
    <button type="button" id="nav-inicio" data-aba="inicio" class="ativo"><span class="ic" aria-hidden="true">🏠</span>Início</button>
    <button type="button" id="nav-estudo" data-aba="estudo"><span class="ic" aria-hidden="true">📚</span>Estudar</button>
    <button type="button" id="nav-sorte"><span class="ic" aria-hidden="true">🎰</span>Sorte<span class="nav-ponto" id="nav-ponto" hidden></span></button>
    <button type="button" id="nav-cal" data-aba="cal"><span class="ic" aria-hidden="true">📅</span>Calendário</button>
    <button type="button" id="nav-busca"><span class="ic" aria-hidden="true">🔍</span>Buscar</button>
  </nav>

  ` + htmlAntigo);

/* 5. Lógica */
const funcAntiga = "function configurarConfirmacao() {";
trocar("lógica do app (abertura e menu)", funcAntiga, `/* =====================================================
   APP: tela de abertura + menu de baixo
===================================================== */
function configurarApp() {
  const splash = document.getElementById("splash");
  const carta = document.getElementById("tela-carta");
  const telaCal = document.getElementById("tela-calendario");
  const telaEstudo = document.getElementById("tela-estudo");
  const envelope = document.getElementById("envelope");
  if (envelope) envelope.remove();

  // Abertura: mostra o ícone, depois some esmaecendo e a carta aparece
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(() => {
    carta.classList.add("visivel");
    splash.classList.add("saindo");
    setTimeout(() => splash.remove(), 900);
  }, reduzir ? 200 : 1500);

  function marcar(nome) {
    document.querySelectorAll(".nav-app button[data-aba]").forEach((b) => {
      b.classList.toggle("ativo", b.dataset.aba === nome);
    });
  }

  // Volta pra carta (fecha calendário ou estudo, se estiverem abertos)
  function inicio() {
    if (!telaCal.hidden) document.getElementById("voltar-carta").click();
    if (!telaEstudo.hidden) document.getElementById("voltar-estudo").click();
    marcar("inicio");
  }

  document.getElementById("nav-inicio").addEventListener("click", () => {
    inicio();
    window.scrollTo(0, 0);
  });
  document.getElementById("nav-estudo").addEventListener("click", () => {
    inicio();
    document.getElementById("abrir-estudo").click();
    marcar("estudo");
  });
  document.getElementById("nav-cal").addEventListener("click", () => {
    inicio();
    document.getElementById("abrir-cal").click();
    marcar("cal");
  });
  document.getElementById("nav-sorte").addEventListener("click", () => {
    document.getElementById("abrir-sorte").click();
  });
  document.getElementById("nav-busca").addEventListener("click", () => {
    document.getElementById("abrir-busca").click();
  });

  // Se ela usar o botão "Voltar à carta" dentro das telas, o menu acompanha
  document.getElementById("voltar-carta").addEventListener("click", () => marcar("inicio"));
  document.getElementById("voltar-estudo").addEventListener("click", () => marcar("inicio"));

  // A bolinha de "ainda dá pra girar hoje" aparece também no menu de baixo
  const origem = document.getElementById("ponto-novo");
  const destino = document.getElementById("nav-ponto");
  const copiar = () => { destino.hidden = origem.hidden; };
  new MutationObserver(copiar).observe(origem, { attributes: true, attributeFilter: ["hidden"] });
  copiar();
}

` + funcAntiga);

/* 6. Iniciar */
trocar("iniciar o app", "configurarEstudo();", "configurarEstudo();\nconfigurarApp();");

fs.writeFileSync(ARQUIVO, html);
console.log("\nPronto! index.html atualizado. Backup em originais/index.backup-app.html");