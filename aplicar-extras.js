/*
  Adiciona vários comandos de uma vez na barra de comandos (lupa) do index.html:

    0609      -> cartão com a data de vocês + dias juntos + corações subindo
    teamo     -> mensagem + chuva de corações   (também vale "te amo", "Te Amo")
    saudade   -> carta escondida
    vale      -> cupom especial
    pedido    -> "Quer sair comigo de novo?" com o botão Não que foge do dedo

  Precisa ter rodado antes o aplicar-comandos.js e o aplicar-rain.js.

  Como usar (na pasta do projeto):
    node aplicar-extras.js

  Faz backup em originais/index.backup-extras.html (pasta que não vai pro GitHub).
  Pode rodar mais de uma vez: se já estiver aplicado, ele avisa e não duplica.

  Os textos ficam no index.html, procure por "TEXTOS DOS COMANDOS" pra editar.
*/
const fs = require("fs");
const path = require("path");

const ARQUIVO = "index.html";

if (!fs.existsSync(ARQUIVO)) {
  console.error("Não achei o index.html. Rode o comando dentro da pasta do projeto (ana).");
  process.exit(1);
}

let html = fs.readFileSync(ARQUIVO, "utf8");

if (!html.includes("configurarComandos")) {
  console.error("Não achei a barra de comandos. Rode antes: node aplicar-comandos.js");
  process.exit(1);
}
if (!html.includes("EFEITOS")) {
  console.error('Não achei o comando rain. Rode antes: node aplicar-rain.js "link-do-spotify"');
  process.exit(1);
}
if (html.includes("TEXTO_TEAMO")) {
  console.log("Os comandos extras já estão aplicados. Nada a fazer.");
  process.exit(0);
}

fs.mkdirSync("originais", { recursive: true });
fs.writeFileSync(path.join("originais", "index.backup-extras.html"), html);

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

/* 1. CSS dos cartões e corações */
const cssAntigo = "/* ===== PAINEL DE TESTE";
const cssNovo = `/* ===== CARTÕES DOS COMANDOS ===== */
  .cartao-tela {
    position: fixed; inset: 0; z-index: 17; background: rgba(20, 12, 32, .88);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .cartao-caixa {
    position: relative; width: 100%; max-width: 380px; background: var(--papel); border-radius: 12px;
    padding: 28px 24px; text-align: center; display: flex; flex-direction: column; align-items: center;
    gap: 14px; box-shadow: 0 18px 50px rgba(0, 0, 0, .5); overflow: hidden;
  }
  .cartao-titulo { margin: 0; font-family: "Caveat", cursive; font-size: 2.2rem; font-weight: 500; color: var(--tinta); line-height: 1.1; }
  .cartao-data { margin: 0; font-family: "Caveat", cursive; font-size: 3.2rem; color: var(--rosa); line-height: 1; }
  .cartao-texto { margin: 0; font-size: 1.05rem; line-height: 1.5; color: var(--tinta); }
  .cartao-suave { margin: 0; font-size: .95rem; color: var(--suave); font-style: italic; min-height: 1.3em; }
  .vale-borda { border: 2px dashed var(--rosa); border-radius: 10px; padding: 16px; width: 100%; }
  .pedido-botoes { display: flex; gap: 12px; justify-content: center; min-height: 52px; width: 100%; }
  .pedido-botoes .btn-nav { min-width: 90px; justify-content: center; }
  .coracoes { position: fixed; inset: 0; z-index: 19; pointer-events: none; overflow: hidden; }
  .coracao { position: absolute; bottom: -40px; animation: subir linear forwards; }
  @keyframes subir { to { transform: translateY(-115vh) rotate(20deg); opacity: 0; } }

  /* ===== PAINEL DE TESTE`;
trocar("estilo dos cartões e corações", cssAntigo, cssNovo);

/* 2. Os comandos */
const efAntigo = "  function abrir() {";
const efNovo = `  // ===== TEXTOS DOS COMANDOS (edite aqui) =====
  const TEXTO_TEAMO = "Te amo, amor. Obrigado por existir na minha vida.";
  const TEXTO_SAUDADE = "Quando bater saudade, lembra que eu tô pensando em você também. Daqui a pouco a gente se vê e eu te dou o abraço que tô guardando.";
  const TEXTO_VALE = "Vale 1 jantar escolhido por você 🍽️";
  const PERGUNTA_PEDIDO = "Quer sair comigo de novo?";

  // Abre um cartão no meio da tela com o conteúdo (HTML) e um botão Fechar
  function cartao(conteudo) {
    fechar();
    const cx = document.createElement("div");
    cx.className = "cartao-tela";
    cx.innerHTML = '<div class="cartao-caixa">' + conteudo +
      '<button type="button" class="btn-nav cartao-fechar">Fechar</button></div>';
    cx.querySelector(".cartao-fechar").addEventListener("click", () => cx.remove());
    document.body.appendChild(cx);
    return cx;
  }

  // Corações subindo pela tela
  function coracoes(qtd) {
    const c = document.createElement("div");
    c.className = "coracoes";
    const emojis = ["💜", "❤️", "💗", "💖"];
    for (let i = 0; i < qtd; i++) {
      const s = document.createElement("span");
      s.className = "coracao";
      s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      s.style.left = (Math.random() * 100) + "%";
      s.style.fontSize = (18 + Math.random() * 22) + "px";
      s.style.animationDuration = (3 + Math.random() * 3) + "s";
      s.style.animationDelay = (Math.random() * 1.5) + "s";
      c.appendChild(s);
    }
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 8000);
  }

  Object.assign(EFEITOS, {
    "0609": () => {
      const p = CONFIG.inicioNamoro.split("-");
      const dias = diasJuntos();
      cartao(
        '<h2 class="cartao-titulo">O dia em que tudo começou</h2>' +
        '<p class="cartao-data">' + p[2] + "/" + p[1] + "/" + p[0] + "</p>" +
        (dias >= 0
          ? '<p class="cartao-texto">Faz <strong>' + dias.toLocaleString("pt-BR") + " dias</strong> que a gente tá junto. 💜</p>"
          : "")
      );
      coracoes(40);
    },

    teamo: () => {
      cartao(
        '<h2 class="cartao-titulo">💜</h2>' +
        '<p class="cartao-texto">' + TEXTO_TEAMO + "</p>"
      );
      coracoes(60);
    },

    saudade: () => {
      cartao(
        '<h2 class="cartao-titulo">Pra quando bater saudade</h2>' +
        '<p class="cartao-texto">' + TEXTO_SAUDADE + "</p>" +
        '<p class="cartao-suave">— ' + CONFIG.seuNome + "</p>"
      );
    },

    vale: () => {
      cartao(
        '<h2 class="cartao-titulo">🎟️ Vale especial</h2>' +
        '<div class="vale-borda"><p class="cartao-texto"><strong>' + TEXTO_VALE + "</strong></p></div>" +
        '<p class="cartao-suave">Mostra essa tela pra mim e eu cumpro. 😉</p>'
      );
    },

    pedido: () => {
      const cx = cartao(
        '<h2 class="cartao-titulo">' + PERGUNTA_PEDIDO + "</h2>" +
        '<div class="pedido-botoes">' +
        '<button type="button" class="btn-nav btn-sair" id="pedido-sim">Sim 💜</button>' +
        '<button type="button" class="btn-nav" id="pedido-nao">Não</button>' +
        "</div>" +
        '<p class="cartao-suave" id="pedido-msg"></p>'
      );
      const caixa = cx.querySelector(".cartao-caixa");
      const sim = cx.querySelector("#pedido-sim");
      const nao = cx.querySelector("#pedido-nao");

      // O botão Não foge do dedo/mouse
      function fugir(e) {
        if (e) e.preventDefault();
        nao.style.position = "absolute";
        nao.style.left = (Math.random() * Math.max(0, caixa.clientWidth - nao.offsetWidth)) + "px";
        nao.style.top = (Math.random() * Math.max(0, caixa.clientHeight - nao.offsetHeight)) + "px";
      }
      nao.addEventListener("touchstart", fugir, { passive: false });
      nao.addEventListener("mouseover", fugir);
      nao.addEventListener("click", fugir);

      sim.addEventListener("click", () => {
        cx.querySelector(".cartao-titulo").textContent = "Eu sabia! 💜";
        cx.querySelector("#pedido-msg").textContent = "Então já pode me chamar. 😄";
        nao.remove();
        sim.remove();
        coracoes(60);
      });
    }
  });

` + efAntigo;
trocar("comandos 0609, teamo, saudade, vale e pedido", efAntigo, efNovo);

/* 3. Aceitar variações: maiúscula, espaço, acento ("Te Amo", "te amo", "teamo") */
const normAntigo = "const texto = campo.value.trim().toLowerCase();";
const normNovo =
  'const texto = campo.value.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");';
trocar("aceitar variações de escrita (te amo, Te Amo, teamo)", normAntigo, normNovo);

fs.writeFileSync(ARQUIVO, html);
console.log("\nPronto! index.html atualizado. Backup em originais/index.backup-extras.html");