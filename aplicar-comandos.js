/*
  Adiciona no index.html uma lupa no topo que abre uma barra de comandos.
  Comando "bets": dá 20 pontos (a meta) UMA vez só.

  Como usar (na pasta do projeto):
    node aplicar-comandos.js

  Faz backup em originais/index.backup-comandos.html (pasta que não vai pro GitHub).
  Pode rodar mais de uma vez: se já estiver aplicado, ele avisa e não duplica.

  Pra criar outros comandos depois, edite o objeto COMANDOS dentro de configurarComandos()
  no index.html. Exemplo: { bets: 20, amor: 5 }
*/
const fs = require("fs");
const path = require("path");

const ARQUIVO = "index.html";

if (!fs.existsSync(ARQUIVO)) {
  console.error("Não achei o index.html. Rode o comando dentro da pasta do projeto (ana).");
  process.exit(1);
}

let html = fs.readFileSync(ARQUIVO, "utf8");

if (html.includes("busca-tela")) {
  console.log("A barra de comandos já está aplicada. Nada a fazer.");
  process.exit(0);
}

fs.mkdirSync("originais", { recursive: true });
fs.writeFileSync(path.join("originais", "index.backup-comandos.html"), html);

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

/* 1. CSS da barra de comandos */
const cssAntigo = "/* ===== PAINEL DE TESTE";
const cssNovo = `/* ===== BARRA DE COMANDOS (lupa) ===== */
  .busca-tela {
    position: fixed; inset: 0; z-index: 16; background: rgba(20, 12, 32, .85);
    display: flex; align-items: flex-start; justify-content: center;
    padding: calc(72px + env(safe-area-inset-top, 0px)) 24px 24px;
  }
  .busca-tela[hidden] { display: none; }
  .busca-caixa {
    width: 100%; max-width: 420px; background: var(--papel); border-radius: 12px;
    padding: 18px; display: flex; flex-direction: column; align-items: center; gap: 12px;
    box-shadow: 0 18px 50px rgba(0, 0, 0, .5);
  }
  .busca-linha { display: flex; gap: 8px; width: 100%; }
  .busca-linha input {
    flex: 1; min-width: 0; padding: 12px 16px; border: 1px solid var(--linha); border-radius: 999px;
    font-family: "Newsreader", Georgia, serif; font-size: 1.05rem; color: var(--tinta); background: #fff;
  }
  .busca-msg { margin: 0; min-height: 1.4em; font-size: 1rem; color: var(--tinta); text-align: center; }

  /* ===== PAINEL DE TESTE`;
trocar("estilo da barra de comandos", cssAntigo, cssNovo);

/* 2. Botão da lupa no topo (antes do cassino) */
const lupaAntigo = '<button type="button" class="btn-nav btn-cassino" id="abrir-sorte"';
const lupaNovo =
  '<button type="button" class="btn-nav btn-cassino" id="abrir-busca" aria-label="Comandos"><span aria-hidden="true">🔍</span></button>\n      ' +
  lupaAntigo;
trocar("botão da lupa no topo", lupaAntigo, lupaNovo);

/* 3. Janela da barra de comandos */
const telaAntigo = '<button type="button" class="premio-btn" id="premio-btn"';
const telaNovo = `<div class="busca-tela" id="busca-tela" hidden>
    <div class="busca-caixa">
      <div class="busca-linha">
        <input type="text" id="busca-campo" placeholder="Digite um comando..." autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
        <button type="button" class="btn-nav btn-sair" id="busca-enviar">OK</button>
      </div>
      <p class="busca-msg" id="busca-msg"></p>
      <button type="button" class="btn-nav" id="busca-fechar">Fechar</button>
    </div>
  </div>

  ` + telaAntigo;
trocar("janela da barra de comandos", telaAntigo, telaNovo);

/* 4. Lógica dos comandos */
const funcAntigo = "function configurarConfirmacao() {";
const funcNovo = `/* =====================================================
   BARRA DE COMANDOS (lupa): cada comando só funciona UMA vez
===================================================== */
function configurarComandos() {
  const tela = document.getElementById("busca-tela");
  const campo = document.getElementById("busca-campo");
  const msg = document.getElementById("busca-msg");

  // comando -> pontos que ele dá (use minúsculas)
  const COMANDOS = { bets: CONFIG.metaPontos };

  function abrir() {
    msg.textContent = "";
    campo.value = "";
    tela.hidden = false;
    campo.focus();
  }

  function fechar() {
    tela.hidden = true;
  }

  function executar() {
    const texto = campo.value.trim().toLowerCase();
    if (!texto) return;
    campo.value = "";

    if (!Object.prototype.hasOwnProperty.call(COMANDOS, texto)) {
      msg.textContent = "Comando não encontrado 🔍";
      return;
    }

    const j = lerJogo();
    j.comandosUsados = j.comandosUsados || [];
    if (j.comandosUsados.includes(texto)) {
      msg.textContent = "Esse comando já foi usado 💜";
      return;
    }

    const pontos = COMANDOS[texto];
    j.comandosUsados.push(texto);
    j.pontos = (j.pontos || 0) + pontos;
    salvarJogo(j);

    msg.textContent = "✨ +" + pontos + " pontos!";
    atualizarJogo("🔓 Comando secreto: +" + pontos + " pontos!");
  }

  document.getElementById("abrir-busca").addEventListener("click", abrir);
  document.getElementById("busca-fechar").addEventListener("click", fechar);
  document.getElementById("busca-enviar").addEventListener("click", executar);
  campo.addEventListener("keydown", (e) => {
    if (e.key === "Enter") executar();
  });
}

` + funcAntigo;
trocar("lógica dos comandos", funcAntigo, funcNovo);

/* 5. Chamar a função ao iniciar */
const chamadaAntigo = "configurarTeste();";
const chamadaNovo = "configurarTeste();\nconfigurarComandos();";
trocar("iniciar a barra de comandos", chamadaAntigo, chamadaNovo);

fs.writeFileSync(ARQUIVO, html);
console.log("\nPronto! index.html atualizado. Backup em originais/index.backup-comandos.html");