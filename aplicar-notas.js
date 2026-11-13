/*
  Adiciona no index.html a aba "Notas" (ícone 📝):
    - Notas de texto livres
    - Listas com checklist (marcar como feito, barra de progresso, limpar concluídos)
    - Título, 6 cores, fixar no topo, busca, excluir
    - Salva sozinho a cada letra digitada (no próprio aparelho)
    - Botão "Copiar tudo" pra guardar um backup das notas

  Precisa ter rodado antes: aplicar-estudo.js (e, se quiser o menu de baixo, aplicar-app.js).

  Como usar (na pasta do projeto):
    node aplicar-notas.js

  Faz backup em originais/index.backup-notas.html (pasta que não vai pro GitHub).
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

if (html.includes("tela-notas")) {
  console.log("A aba Notas já está aplicada. Nada a fazer.");
  process.exit(0);
}
if (!html.includes("configurarEstudo")) {
  console.error("Não achei a aba Estudar. Rode antes: node aplicar-estudo.js");
  process.exit(1);
}

fs.mkdirSync("originais", { recursive: true });
fs.writeFileSync(path.join("originais", "index.backup-notas.html"), html);

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

/* 1. CSS */
trocar("estilo da aba Notas", "/* ===== PAINEL DE TESTE", `/* ===== NOTAS ===== */
  .notas-barra { margin: 0 0 12px; }
  .nota-campo {
    width: 100%; min-width: 0; padding: 10px 16px; border: 1px solid var(--linha); border-radius: 999px;
    font-family: "Newsreader", Georgia, serif; font-size: 1.05rem; color: var(--tinta); background: #fff;
  }
  .notas-acoes { display: flex; gap: 8px; margin: 0 0 14px; }
  .notas-acoes .btn-nav { flex: 1; justify-content: center; }
  .notas-lista { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .nota-card {
    display: flex; flex-direction: column; gap: 6px; min-height: 96px; padding: 12px; text-align: left;
    border: 1px solid var(--linha); border-radius: 12px; color: var(--tinta); cursor: pointer;
    font-family: "Newsreader", Georgia, serif; -webkit-tap-highlight-color: transparent;
  }
  .nota-card strong { font-size: 1.05rem; font-weight: 600; word-break: break-word; }
  .nota-card span {
    font-size: .9rem; color: var(--suave); white-space: pre-line; word-break: break-word;
    overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  }
  .nota-card small { margin-top: auto; font-size: .8rem; color: var(--suave); }
  .nota-vazia { grid-column: 1 / -1; text-align: center; color: var(--suave); padding: 24px 8px; line-height: 1.5; }
  .nota-pagina { border: 1px solid var(--linha); border-radius: 12px; padding: 14px; }
  .nota-titulo {
    width: 100%; border: 0; background: transparent; outline: none; padding: 4px 0 8px;
    font-family: "Caveat", cursive; font-size: 2rem; color: var(--tinta);
  }
  .nota-texto {
    width: 100%; min-height: 240px; border: 0; background: transparent; outline: none; resize: none;
    font-family: "Newsreader", Georgia, serif; font-size: 1.1rem; line-height: 1.6; color: var(--tinta);
  }
  .nota-item { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--linha); }
  .nota-item input[type=checkbox] { width: 22px; height: 22px; accent-color: var(--rosa); flex: none; }
  .nota-item input[type=text] {
    flex: 1; min-width: 0; border: 0; background: transparent; outline: none; padding: 6px 0;
    font-family: "Newsreader", Georgia, serif; font-size: 1.05rem; color: var(--tinta);
  }
  .nota-item.feito input[type=text] { text-decoration: line-through; color: var(--suave); }
  .nota-item button { border: 0; background: none; color: var(--suave); font-size: 1.4rem; cursor: pointer; padding: 4px 8px; }
  .nota-novo-item { display: flex; gap: 8px; margin: 12px 0; }
  .nota-rodape { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; margin-top: 16px; }
  .nota-cores { display: flex; gap: 8px; }
  .nota-cor { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px var(--linha); cursor: pointer; padding: 0; }
  .nota-cor.sel { box-shadow: 0 0 0 2px var(--rosa); }

  /* ===== PAINEL DE TESTE`);

/* 2. Tela de notas */
const telaAntiga = '<div class="sorte-tela" id="sorte-tela" hidden>';
trocar("tela de notas", telaAntiga, `<section class="calendario" id="tela-notas" hidden>
    <button type="button" class="btn-nav" id="voltar-notas"><span aria-hidden="true">←</span> Voltar à carta</button>
    <h2 class="cal-titulo">Notas 📝</h2>
    <div id="notas-corpo"></div>
  </section>

  ` + telaAntiga);

/* 3. Botão no topo (modo antigo) */
const topoAntigo = '<button type="button" class="btn-nav btn-cassino" id="abrir-estudo"';
trocar(
  "botão Notas no topo",
  topoAntigo,
  '<button type="button" class="btn-nav btn-cassino" id="abrir-notas" aria-label="Notas"><span aria-hidden="true">📝</span></button>\n      ' + topoAntigo
);

/* 4. Botão no menu de baixo (se o layout de aplicativo estiver aplicado) */
const navAntigo = '<button type="button" id="nav-sorte">';
if (html.includes(navAntigo)) {
  trocar(
    "botão Notas no menu de baixo",
    navAntigo,
    '<button type="button" id="nav-notas" data-aba="notas"><span class="ic" aria-hidden="true">📝</span>Notas</button>\n    ' + navAntigo
  );

  const inicioAntigo = 'if (!telaEstudo.hidden) document.getElementById("voltar-estudo").click();';
  if (html.includes(inicioAntigo)) {
    trocar(
      "Início fecha as notas",
      inicioAntigo,
      inicioAntigo + '\n    const telaNotas = document.getElementById("tela-notas");\n    if (telaNotas && !telaNotas.hidden) document.getElementById("voltar-notas").click();'
    );
  }
} else {
  console.log("Menu de baixo não encontrado: usando só o botão do topo.");
}

/* 5. Lógica */
const funcAntiga = "function configurarConfirmacao() {";
trocar("lógica das notas", funcAntiga, `/* =====================================================
   NOTAS: textos livres e listas com checklist (salvo no aparelho)
===================================================== */
function configurarNotas() {
  const CHAVE = "cartaDoDiaNotas";
  const CORES = ["#ffffff", "#fde8ee", "#fff3d6", "#e3f4e6", "#e1eefc", "#ece3fa"];
  const telaCarta = document.getElementById("tela-carta");
  const tela = document.getElementById("tela-notas");
  const corpo = document.getElementById("notas-corpo");
  let busca = "";

  function ler() {
    try {
      const d = JSON.parse(localStorage.getItem(CHAVE));
      return Array.isArray(d) ? d : [];
    } catch (e) { return []; }
  }
  function salvar(l) { try { localStorage.setItem(CHAVE, JSON.stringify(l)); } catch (e) {} }
  function achar(id) { return ler().find((n) => n.id === id); }
  function mudar(id, fn) {
    const l = ler();
    const n = l.find((x) => x.id === id);
    if (!n) return;
    fn(n);
    n.editada = Date.now();
    salvar(l);
  }
  function el(tag, classe, texto) {
    const x = document.createElement(tag);
    if (classe) x.className = classe;
    if (texto !== undefined) x.textContent = texto;
    return x;
  }
  function botao(texto, classe, fn) {
    const b = el("button", classe, texto);
    b.type = "button";
    b.addEventListener("click", fn);
    return b;
  }

  function resumo(n) {
    if (n.tipo === "lista") return n.itens.slice(0, 3).map((i) => (i.ok ? "☑ " : "☐ ") + i.t).join("\\n");
    return n.texto;
  }

  function exportar() {
    const t = ler().map((n) =>
      (n.titulo || "Sem título") + "\\n" +
      (n.tipo === "lista" ? n.itens.map((i) => (i.ok ? "[x] " : "[ ] ") + i.t).join("\\n") : n.texto)
    ).join("\\n\\n---\\n\\n");
    if (!t) return;
    const ok = () => alert("Notas copiadas! Cole num lugar seguro pra guardar. 💜");
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, () => alert("Não consegui copiar."));
    else alert("Seu navegador não deixa copiar.");
  }

  function criar(tipo) {
    const l = ler();
    const id = String(Date.now());
    l.push({ id: id, titulo: "", tipo: tipo, texto: "", itens: [], cor: CORES[0], fixada: false, criada: Date.now(), editada: Date.now() });
    salvar(l);
    editor(id);
  }

  /* ----- Tela com todas as notas ----- */
  function lista() {
    corpo.innerHTML = "";

    const campo = el("input", "nota-campo");
    campo.type = "search";
    campo.placeholder = "Buscar nas notas...";
    campo.value = busca;
    const barra = el("div", "notas-barra");
    barra.appendChild(campo);
    corpo.appendChild(barra);

    const acoes = el("div", "notas-acoes");
    acoes.appendChild(botao("＋ Nota", "btn-nav btn-sair", () => criar("texto")));
    acoes.appendChild(botao("☑ Lista", "btn-nav btn-sair", () => criar("lista")));
    corpo.appendChild(acoes);

    const grade = el("div", "notas-lista");
    corpo.appendChild(grade);

    const copiar = botao("Copiar tudo (backup)", "btn-nav", exportar);
    copiar.style.marginTop = "16px";
    corpo.appendChild(copiar);

    function desenhar() {
      grade.innerHTML = "";
      const q = busca.trim().toLowerCase();
      const todas = ler().filter((n) => !q ||
        (n.titulo + " " + n.texto + " " + n.itens.map((i) => i.t).join(" ")).toLowerCase().includes(q));
      todas.sort((a, b) => (b.fixada ? 1 : 0) - (a.fixada ? 1 : 0) || b.editada - a.editada);

      if (!todas.length) {
        grade.appendChild(el("p", "nota-vazia", q ? "Nada encontrado." : "Nenhuma nota ainda. Toque em ＋ Nota ou ☑ Lista pra começar. 💜"));
        return;
      }
      todas.forEach((n) => {
        const c = el("button", "nota-card");
        c.type = "button";
        c.style.background = n.cor;
        c.appendChild(el("strong", "", (n.fixada ? "📌 " : "") + (n.titulo || "Sem título")));
        const r = resumo(n);
        if (r) c.appendChild(el("span", "", r));
        const feitos = n.itens.filter((i) => i.ok).length;
        c.appendChild(el("small", "", n.tipo === "lista"
          ? feitos + " de " + n.itens.length + " feitos"
          : new Date(n.editada).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })));
        c.addEventListener("click", () => editor(n.id));
        grade.appendChild(c);
      });
    }

    campo.addEventListener("input", () => { busca = campo.value; desenhar(); });
    desenhar();
  }

  /* ----- Editor de uma nota ----- */
  function editor(id) {
    const n = achar(id);
    if (!n) { lista(); return; }
    n.itens = n.itens || [];
    corpo.innerHTML = "";

    function sair() {
      const x = achar(id);
      if (x && !x.titulo.trim() && !x.texto.trim() && !(x.itens || []).length) {
        salvar(ler().filter((y) => y.id !== id));
      }
      lista();
    }

    const topo = el("div", "notas-acoes");
    topo.appendChild(botao("← Notas", "btn-nav", sair));
    topo.appendChild(botao(n.fixada ? "📌 Fixada" : "📌 Fixar", "btn-nav", () => {
      mudar(id, (x) => { x.fixada = !x.fixada; });
      editor(id);
    }));
    corpo.appendChild(topo);

    const pagina = el("div", "nota-pagina");
    pagina.style.background = n.cor;
    corpo.appendChild(pagina);

    const titulo = el("input", "nota-titulo");
    titulo.type = "text";
    titulo.placeholder = "Título";
    titulo.value = n.titulo;
    titulo.addEventListener("input", () => mudar(id, (x) => { x.titulo = titulo.value; }));
    pagina.appendChild(titulo);

    if (n.tipo === "texto") {
      const ta = el("textarea", "nota-texto");
      ta.placeholder = "Escreva aqui...";
      ta.value = n.texto;
      const ajustar = () => {
        ta.style.height = "auto";
        ta.style.height = Math.max(ta.scrollHeight, 240) + "px";
      };
      ta.addEventListener("input", () => { ajustar(); mudar(id, (x) => { x.texto = ta.value; }); });
      pagina.appendChild(ta);
      setTimeout(ajustar, 0);
    } else {
      const prog = el("p", "estudo-texto");
      const barra = el("div", "barra");
      const cheia = el("div", "barra-cheia");
      barra.appendChild(cheia);
      const itensEl = el("div");
      pagina.appendChild(prog);
      pagina.appendChild(barra);
      pagina.appendChild(itensEl);

      const novo = el("input", "nota-campo");
      novo.type = "text";
      novo.placeholder = "Novo item...";

      function progresso() {
        const it = achar(id).itens;
        const f = it.filter((i) => i.ok).length;
        prog.textContent = it.length ? f + " de " + it.length + " feitos" : "Adicione o primeiro item abaixo.";
        cheia.style.width = (it.length ? (f / it.length) * 100 : 0) + "%";
      }

      function itens() {
        itensEl.innerHTML = "";
        achar(id).itens.forEach((it, k) => {
          const row = el("div", "nota-item" + (it.ok ? " feito" : ""));
          const cb = el("input");
          cb.type = "checkbox";
          cb.checked = it.ok;
          const tx = el("input");
          tx.type = "text";
          tx.value = it.t;
          const x = botao("×", "", () => { mudar(id, (m) => { m.itens.splice(k, 1); }); itens(); });
          x.setAttribute("aria-label", "Remover item");

          cb.addEventListener("change", () => {
            mudar(id, (m) => { m.itens[k].ok = cb.checked; });
            row.classList.toggle("feito", cb.checked);
            progresso();
          });
          tx.addEventListener("input", () => mudar(id, (m) => { m.itens[k].t = tx.value; }));
          tx.addEventListener("keydown", (e) => { if (e.key === "Enter") novo.focus(); });

          row.appendChild(cb);
          row.appendChild(tx);
          row.appendChild(x);
          itensEl.appendChild(row);
        });
        progresso();
      }

      function adicionar() {
        const v = novo.value.trim();
        if (!v) return;
        mudar(id, (m) => { m.itens.push({ t: v, ok: false }); });
        novo.value = "";
        itens();
        novo.focus();
      }
      novo.addEventListener("keydown", (e) => { if (e.key === "Enter") adicionar(); });

      const add = el("div", "nota-novo-item");
      add.appendChild(novo);
      add.appendChild(botao("＋", "btn-nav btn-sair", adicionar));
      pagina.appendChild(add);

      pagina.appendChild(botao("Limpar concluídos", "btn-nav", () => {
        mudar(id, (m) => { m.itens = m.itens.filter((i) => !i.ok); });
        itens();
      }));

      itens();
    }

    const rodape = el("div", "nota-rodape");
    const cores = el("div", "nota-cores");
    CORES.forEach((cor) => {
      const b = el("button", "nota-cor" + (cor === n.cor ? " sel" : ""));
      b.type = "button";
      b.style.background = cor;
      b.setAttribute("aria-label", "Cor da nota");
      b.addEventListener("click", () => {
        mudar(id, (x) => { x.cor = cor; });
        pagina.style.background = cor;
        cores.querySelectorAll(".nota-cor").forEach((o) => o.classList.toggle("sel", o === b));
      });
      cores.appendChild(b);
    });
    rodape.appendChild(cores);
    rodape.appendChild(botao("🗑️ Excluir", "btn-nav", () => {
      if (confirm("Excluir esta nota?")) {
        salvar(ler().filter((y) => y.id !== id));
        lista();
      }
    }));
    corpo.appendChild(rodape);
  }

  /* ----- Abrir e fechar a aba ----- */
  function marcar(nome) {
    document.querySelectorAll(".nav-app button[data-aba]").forEach((b) => {
      b.classList.toggle("ativo", b.dataset.aba === nome);
    });
  }

  function abrir() {
    busca = "";
    lista();
    telaCarta.classList.add("oculta");
    tela.hidden = false;
    window.scrollTo(0, 0);
  }

  document.getElementById("abrir-notas").addEventListener("click", abrir);

  document.getElementById("voltar-notas").addEventListener("click", () => {
    tela.hidden = true;
    telaCarta.classList.add("volta");
    telaCarta.classList.remove("oculta");
    marcar("inicio");
    window.scrollTo(0, 0);
  });

  const nav = document.getElementById("nav-notas");
  if (nav) {
    nav.addEventListener("click", () => {
      if (!document.getElementById("tela-calendario").hidden) document.getElementById("voltar-carta").click();
      if (!document.getElementById("tela-estudo").hidden) document.getElementById("voltar-estudo").click();
      abrir();
      marcar("notas");
    });
  }
}

` + funcAntiga);

/* 6. Iniciar */
trocar("iniciar as notas", "configurarEstudo();", "configurarEstudo();\nconfigurarNotas();");

fs.writeFileSync(ARQUIVO, html);
console.log("\nPronto! index.html atualizado. Backup em originais/index.backup-notas.html");