/*
  Adiciona no index.html a aba "Estudar" (botão 📚 no topo) com:
    - Quiz do dia: 5 perguntas de matérias diferentes (a mesma pra todo mundo no mesmo dia)
      Concluindo, ganha pontos no jogo (1x por dia).
    - Treino por matéria: Matemática, Português, Ciências, História, Geografia, Atualidades.

  As perguntas ficam num arquivo separado: perguntas.js (criado por este script).
  Pra adicionar perguntas, abra o perguntas.js e copie o formato de uma existente:
    { "m": "Matemática", "q": "pergunta?", "o": ["A", "B", "C", "D"], "c": 1, "e": "explicação" }
  "c" é a posição da resposta certa em "o" (0 = primeira, 1 = segunda...).

  Como usar (na pasta do projeto):
    node aplicar-estudo.js

  Faz backup em originais/index.backup-estudo.html (pasta que não vai pro GitHub).
  Se perguntas.js já existir, ele NÃO sobrescreve (pra não perder o que você adicionou).
*/
const fs = require("fs");
const path = require("path");

const ARQUIVO = "index.html";

const PERGUNTAS = [
  // ===== MATEMÁTICA =====
  { m: "Matemática", q: "Quanto é 20% de 150?", o: ["15", "30", "20", "45"], c: 1, e: "20% = 20/100. Então 150 × 0,20 = 30." },
  { m: "Matemática", q: "3 cadernos custam R$ 18. Quanto custam 5 cadernos do mesmo tipo?", o: ["R$ 24", "R$ 28", "R$ 30", "R$ 36"], c: 2, e: "Regra de três: cada caderno custa 18 ÷ 3 = R$ 6. Então 5 × 6 = R$ 30." },
  { m: "Matemática", q: "Quanto é 1/2 + 1/4?", o: ["2/6", "3/4", "1/6", "2/4"], c: 1, e: "1/2 = 2/4. Então 2/4 + 1/4 = 3/4." },
  { m: "Matemática", q: "Qual o valor de x na equação 2x + 6 = 14?", o: ["2", "3", "4", "10"], c: 2, e: "2x = 14 - 6 = 8, então x = 8 ÷ 2 = 4." },
  { m: "Matemática", q: "Um produto de R$ 80 recebe 25% de desconto. Qual o novo preço?", o: ["R$ 55", "R$ 60", "R$ 65", "R$ 70"], c: 1, e: "25% de 80 = 20. Então 80 - 20 = R$ 60." },
  { m: "Matemática", q: "Quanto é 3/5 de 40?", o: ["16", "20", "24", "30"], c: 2, e: "40 ÷ 5 = 8 (cada quinto). 3 × 8 = 24." },

  // ===== PORTUGUÊS =====
  { m: "Português", q: "Em \"Ele é rápido como um raio\", qual figura de linguagem aparece?", o: ["Metáfora", "Comparação", "Ironia", "Hipérbole"], c: 1, e: "A palavra \"como\" liga duas coisas de forma explícita: isso é comparação." },
  { m: "Português", q: "\"Estou morrendo de fome\" é um exemplo de:", o: ["Hipérbole", "Eufemismo", "Comparação", "Antítese"], c: 0, e: "Hipérbole é o exagero de uma ideia para dar mais força." },
  { m: "Português", q: "Qual é o plural de \"cidadão\"?", o: ["Cidadões", "Cidadãos", "Cidadães", "Cidadans"], c: 1, e: "Cidadão forma o plural com \"-ãos\": cidadãos." },
  { m: "Português", q: "Em \"Os meninos brincavam no parque\", qual é o sujeito?", o: ["brincavam", "no parque", "Os meninos", "meninos brincavam"], c: 2, e: "O sujeito é quem pratica a ação: \"Os meninos\"." },
  { m: "Português", q: "Complete: \"Ele acordou de ___ humor.\"", o: ["mal", "mau", "maul", "mao"], c: 1, e: "\"Mau\" é o contrário de \"bom\" (mau humor). \"Mal\" é o contrário de \"bem\"." },
  { m: "Português", q: "\"A vida é uma moeda\" apresenta qual figura de linguagem?", o: ["Hipérbole", "Eufemismo", "Metáfora", "Comparação"], c: 2, e: "Metáfora é uma comparação implícita, sem \"como\" ou \"tal qual\"." },

  // ===== CIÊNCIAS =====
  { m: "Ciências", q: "Qual órgão do corpo humano bombeia o sangue?", o: ["Pulmão", "Fígado", "Coração", "Rim"], c: 2, e: "O coração bombeia o sangue para todo o corpo." },
  { m: "Ciências", q: "Como se chama o processo em que as plantas produzem o próprio alimento usando a luz do sol?", o: ["Respiração", "Fotossíntese", "Digestão", "Fermentação"], c: 1, e: "Na fotossíntese, a planta usa luz, água e gás carbônico para produzir glicose." },
  { m: "Ciências", q: "Qual gás as plantas absorvem durante a fotossíntese?", o: ["Oxigênio", "Nitrogênio", "Gás carbônico", "Hidrogênio"], c: 2, e: "Elas absorvem gás carbônico (CO₂) e liberam oxigênio." },
  { m: "Ciências", q: "Quando a água líquida vira vapor, a mudança de estado se chama:", o: ["Fusão", "Solidificação", "Condensação", "Vaporização"], c: 3, e: "Líquido para gasoso é vaporização (evaporação, ebulição ou calefação)." },
  { m: "Ciências", q: "Qual órgão é responsável pela troca de gases na respiração?", o: ["Pulmão", "Estômago", "Intestino", "Coração"], c: 0, e: "Nos pulmões, o oxigênio entra no sangue e o gás carbônico sai." },
  { m: "Ciências", q: "A camada da atmosfera que nos protege dos raios ultravioleta é a:", o: ["Camada de ozônio", "Camada de nitrogênio", "Camada de argônio", "Camada de metano"], c: 0, e: "O gás ozônio (O₃) absorve boa parte dos raios UV do Sol." },

  // ===== HISTÓRIA =====
  { m: "História", q: "Quem proclamou a Independência do Brasil, em 1822?", o: ["D. Pedro II", "D. João VI", "D. Pedro I", "Getúlio Vargas"], c: 2, e: "Em 7 de setembro de 1822, D. Pedro I declarou a Independência." },
  { m: "História", q: "Em que ano foi proclamada a República no Brasil?", o: ["1822", "1888", "1889", "1930"], c: 2, e: "A República foi proclamada em 15 de novembro de 1889." },
  { m: "História", q: "A Lei Áurea, que aboliu a escravidão no Brasil, foi assinada em:", o: ["1822", "1888", "1889", "1900"], c: 1, e: "A Lei Áurea foi assinada pela Princesa Isabel em 13 de maio de 1888." },
  { m: "História", q: "A Segunda Guerra Mundial aconteceu entre:", o: ["1914 e 1918", "1939 e 1945", "1950 e 1953", "1961 e 1975"], c: 1, e: "A Segunda Guerra foi de 1939 a 1945. De 1914 a 1918 foi a Primeira." },
  { m: "História", q: "A Era Vargas teve início em:", o: ["1889", "1930", "1964", "1985"], c: 1, e: "Getúlio Vargas assumiu o poder após a Revolução de 1930." },
  { m: "História", q: "Quem comandou a esquadra que chegou ao Brasil em 1500?", o: ["Cristóvão Colombo", "Vasco da Gama", "Pedro Álvares Cabral", "Américo Vespúcio"], c: 2, e: "Pedro Álvares Cabral chegou ao litoral da atual Bahia em abril de 1500." },

  // ===== GEOGRAFIA =====
  { m: "Geografia", q: "Qual é o maior estado do Brasil em área?", o: ["Pará", "Amazonas", "Mato Grosso", "Bahia"], c: 1, e: "O Amazonas é o maior estado brasileiro em extensão territorial." },
  { m: "Geografia", q: "Qual é a capital do Brasil?", o: ["Rio de Janeiro", "São Paulo", "Salvador", "Brasília"], c: 3, e: "Brasília é a capital desde 1960." },
  { m: "Geografia", q: "Qual das alternativas define melhor a globalização?", o: ["Isolamento entre os países", "Integração econômica, cultural e de informação entre países", "Fim do comércio internacional", "Divisão do mundo em dois blocos"], c: 1, e: "A globalização aproxima os países por meio do comércio, da tecnologia e da comunicação." },
  { m: "Geografia", q: "A linha imaginária que divide a Terra nos hemisférios Norte e Sul é:", o: ["Trópico de Câncer", "Meridiano de Greenwich", "Linha do Equador", "Trópico de Capricórnio"], c: 2, e: "A Linha do Equador separa o hemisfério Norte do Sul." },
  { m: "Geografia", q: "Qual é a região mais populosa do Brasil?", o: ["Norte", "Nordeste", "Sul", "Sudeste"], c: 3, e: "O Sudeste concentra a maior população do país." },
  { m: "Geografia", q: "Em qual direção o Sol nasce?", o: ["Oeste", "Norte", "Leste", "Sul"], c: 2, e: "O Sol nasce no leste e se põe no oeste." },

  // ===== ATUALIDADES =====
  { m: "Atualidades", q: "Qual cidade brasileira sediou a COP30, conferência da ONU sobre o clima, em 2025?", o: ["Rio de Janeiro", "Brasília", "Belém", "São Paulo"], c: 2, e: "A COP30 foi realizada em Belém, no Pará." },
  { m: "Atualidades", q: "O Pix, sistema de pagamentos instantâneos do Banco Central, foi lançado em:", o: ["2010", "2015", "2020", "2023"], c: 2, e: "O Pix começou a funcionar em novembro de 2020." },
  { m: "Atualidades", q: "Qual instituição é responsável pelo Censo demográfico no Brasil?", o: ["IBGE", "INSS", "Banco Central", "IBAMA"], c: 0, e: "O IBGE realiza o Censo e outras pesquisas oficiais." },
  { m: "Atualidades", q: "O aquecimento global está ligado principalmente ao aumento de:", o: ["Gases do efeito estufa", "Gás oxigênio", "Água dos rios", "Ventos fortes"], c: 0, e: "Gases como o gás carbônico (CO₂) e o metano retêm calor na atmosfera." },
  { m: "Atualidades", q: "\"Fake news\" são:", o: ["Notícias muito antigas", "Notícias falsas espalhadas como se fossem verdadeiras", "Notícias de esportes", "Notícias de outros países"], c: 1, e: "Fake news são informações falsas disfarçadas de notícia. Vale sempre checar a fonte." },
  { m: "Atualidades", q: "O que significa a sigla IA, muito comentada hoje?", o: ["Internet Avançada", "Informação Automática", "Inteligência Artificial", "Integração Analógica"], c: 2, e: "IA é Inteligência Artificial: sistemas que executam tarefas que normalmente exigem inteligência humana." }
];

if (!fs.existsSync(ARQUIVO)) {
  console.error("Não achei o index.html. Rode o comando dentro da pasta do projeto (ana).");
  process.exit(1);
}

let html = fs.readFileSync(ARQUIVO, "utf8");

if (html.includes("tela-estudo")) {
  console.log("A aba Estudar já está aplicada. Nada a fazer.");
  process.exit(0);
}

fs.mkdirSync("originais", { recursive: true });
fs.writeFileSync(path.join("originais", "index.backup-estudo.html"), html);

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
trocar(
  "topo com quebra de linha",
  ".topo { display: flex; justify-content: flex-end; gap: 8px; margin: -18px 0 16px; }",
  ".topo { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin: -18px 0 16px; }"
);

trocar("estilo da aba Estudar", "/* ===== PAINEL DE TESTE", `/* ===== ESTUDAR ===== */
  .estudo-card { background: #fff; border: 1px solid var(--linha); border-radius: 10px; padding: 16px; margin: 0 0 18px; }
  .estudo-card h3, .estudo-sub { margin: 0 0 6px; font-family: "Caveat", cursive; font-size: 1.7rem; font-weight: 500; color: var(--tinta); }
  .estudo-texto { margin: 0 0 12px; font-size: 1rem; line-height: 1.5; color: var(--suave); }
  .estudo-grade { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 0 0 18px; }
  .estudo-grade .btn-nav { justify-content: center; }
  .estudo-prog { margin: 0 0 8px; font-size: .95rem; color: var(--suave); }
  .estudo-q { margin: 0 0 14px; font-size: 1.25rem; line-height: 1.4; font-weight: 500; color: var(--tinta); }
  .estudo-ops { display: flex; flex-direction: column; gap: 8px; margin: 0 0 14px; }
  .estudo-op { justify-content: flex-start; text-align: left; color: var(--tinta); }
  .estudo-op.certo { background: #dff3e4; border-color: #7bc48f; color: #1d5c32; }
  .estudo-op.errado { background: #fbe3e8; border-color: #e08aa0; color: #8a2745; }
  .estudo-fb { margin: 0 0 12px; font-size: 1rem; line-height: 1.5; color: var(--tinta); min-height: 1.4em; }
  .estudo-stat { margin: 0; padding-top: 14px; border-top: 1px solid var(--linha); font-size: .95rem; color: var(--suave); }

  /* ===== PAINEL DE TESTE`);

/* 2. Botão 📚 no topo */
const botaoAntigo = '<button type="button" class="btn-nav btn-cassino" id="abrir-busca"';
trocar(
  "botão Estudar no topo",
  botaoAntigo,
  '<button type="button" class="btn-nav btn-cassino" id="abrir-estudo" aria-label="Estudar"><span aria-hidden="true">📚</span></button>\n      ' + botaoAntigo
);

/* 3. Tela de estudo + arquivo de perguntas */
const telaAntiga = '<div class="sorte-tela" id="sorte-tela" hidden>';
trocar("tela de estudo", telaAntiga, `<section class="calendario" id="tela-estudo" hidden>
    <button type="button" class="btn-nav" id="voltar-estudo"><span aria-hidden="true">←</span> Voltar à carta</button>
    <h2 class="cal-titulo">Estudar 📚</h2>
    <div id="estudo-corpo"></div>
  </section>

  <script src="perguntas.js"></script>

  ` + telaAntiga);

/* 4. Lógica */
const funcAntiga = "function configurarConfirmacao() {";
trocar("lógica do quiz", funcAntiga, `/* =====================================================
   ESTUDAR: quiz do dia + treino por matéria (perguntas em perguntas.js)
===================================================== */
function configurarEstudo() {
  const CHAVE = "cartaDoDiaEstudo";
  const PONTOS_QUIZ = 2;   // pontos no jogo ao concluir o quiz do dia (1x por dia)
  const POR_QUIZ = 5;
  const MATERIAS = ["Matemática", "Português", "Ciências", "História", "Geografia", "Atualidades"];

  const banco = window.PERGUNTAS || [];
  const telaCarta = document.getElementById("tela-carta");
  const tela = document.getElementById("tela-estudo");
  const corpo = document.getElementById("estudo-corpo");

  function ler() { try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { return {}; } }
  function salvar(d) { try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch (e) {} }

  function el(tag, classe, texto) {
    const x = document.createElement(tag);
    if (classe) x.className = classe;
    if (texto !== undefined) x.textContent = texto;
    return x;
  }

  function embaralhar(lista) {
    const c = lista.slice();
    for (let a = c.length - 1; a > 0; a--) {
      const b = Math.floor(Math.random() * (a + 1));
      const t = c[a]; c[a] = c[b]; c[b] = t;
    }
    return c;
  }

  // Quiz do dia: uma pergunta de cada matéria (rodando), igual o dia todo
  function doDia() {
    const hoje = numeroDoDia(new Date());
    const lista = [];
    for (let k = 0; k < POR_QUIZ; k++) {
      const mat = MATERIAS[(hoje + k) % MATERIAS.length];
      const doMat = banco.filter((p) => p.m === mat);
      if (!doMat.length) continue;
      lista.push(doMat[Math.floor(sorteioDoDia(hoje * 7 + k) * doMat.length)]);
    }
    return lista;
  }

  function menu() {
    const d = ler();
    const hoje = numeroDoDia(new Date());
    const feito = d.quizDia === hoje;
    corpo.innerHTML = "";

    if (!banco.length) {
      corpo.appendChild(el("p", "estudo-texto", "As perguntas não carregaram. Confere se o arquivo perguntas.js está na pasta do site."));
      return;
    }

    const card = el("div", "estudo-card");
    card.appendChild(el("h3", "", "Quiz do dia"));
    card.appendChild(el("p", "estudo-texto", feito
      ? "Concluído hoje: " + d.quizAcertos + " de " + d.quizTotal + " ✓. Volte amanhã pra um novo (ou refaça sem pontos)."
      : POR_QUIZ + " perguntas de matérias diferentes. Concluindo, você ganha +" + PONTOS_QUIZ + " pontos! ⭐"));
    const b = el("button", "btn-nav btn-sair", feito ? "Refazer o quiz" : "Começar o quiz");
    b.type = "button";
    b.addEventListener("click", () => rodar(doDia(), !feito));
    card.appendChild(b);
    corpo.appendChild(card);

    corpo.appendChild(el("h3", "estudo-sub", "Treinar por matéria"));
    const grade = el("div", "estudo-grade");
    MATERIAS.forEach((mat) => {
      const doMat = banco.filter((p) => p.m === mat);
      if (!doMat.length) return;
      const bt = el("button", "btn-nav", mat);
      bt.type = "button";
      bt.addEventListener("click", () => rodar(embaralhar(doMat).slice(0, POR_QUIZ), false));
      grade.appendChild(bt);
    });
    corpo.appendChild(grade);

    corpo.appendChild(el("p", "estudo-stat",
      "Total: " + (d.totalAcertos || 0) + " acertos em " + (d.totalRespondidas || 0) + " perguntas respondidas."));
  }

  function rodar(perguntas, vale) {
    let i = 0;
    let acertos = 0;

    function mostrar() {
      const p = perguntas[i];
      const ops = embaralhar(p.o.map((t, k) => ({ t: t, ok: k === p.c })));
      corpo.innerHTML = "";
      corpo.appendChild(el("p", "estudo-prog", "Pergunta " + (i + 1) + " de " + perguntas.length + " · " + p.m));
      corpo.appendChild(el("h3", "estudo-q", p.q));

      const lista = el("div", "estudo-ops");
      const fb = el("p", "estudo-fb");
      const prox = el("div");
      const botoes = [];

      ops.forEach((o) => {
        const b = el("button", "btn-nav estudo-op", o.t);
        b.type = "button";
        b.addEventListener("click", () => {
          botoes.forEach((x) => { x.btn.disabled = true; if (x.ok) x.btn.classList.add("certo"); });
          if (o.ok) {
            acertos++;
            fb.textContent = "✅ Isso aí! " + p.e;
          } else {
            b.classList.add("errado");
            fb.textContent = "❌ Quase! " + p.e;
          }
          const d = ler();
          d.totalRespondidas = (d.totalRespondidas || 0) + 1;
          if (o.ok) d.totalAcertos = (d.totalAcertos || 0) + 1;
          salvar(d);

          const n = el("button", "btn-nav btn-sair", i + 1 < perguntas.length ? "Próxima" : "Ver resultado");
          n.type = "button";
          n.addEventListener("click", () => { i++; if (i < perguntas.length) mostrar(); else fim(); });
          prox.appendChild(n);
        });
        botoes.push({ btn: b, ok: o.ok });
        lista.appendChild(b);
      });

      corpo.appendChild(lista);
      corpo.appendChild(fb);
      corpo.appendChild(prox);
    }

    function fim() {
      corpo.innerHTML = "";
      corpo.appendChild(el("h3", "estudo-sub", "Resultado"));
      corpo.appendChild(el("p", "estudo-q", "Você acertou " + acertos + " de " + perguntas.length + "!"));

      let extra = "";
      if (vale) {
        const d = ler();
        d.quizDia = numeroDoDia(new Date());
        d.quizAcertos = acertos;
        d.quizTotal = perguntas.length;
        salvar(d);
        const j = lerJogo();
        j.pontos = (j.pontos || 0) + PONTOS_QUIZ;
        salvarJogo(j);
        atualizarJogo("📚 +" + PONTOS_QUIZ + " pontos pelo quiz do dia!");
        extra = " +" + PONTOS_QUIZ + " pontos no seu jogo! ⭐";
      }
      const frase = acertos === perguntas.length ? "Perfeito! 🎉" : acertos >= perguntas.length / 2 ? "Muito bem! Vai ficando craque. 💪" : "Bora revisar e tentar de novo. Você consegue! 💜";
      corpo.appendChild(el("p", "estudo-texto", frase + extra));

      const v = el("button", "btn-nav btn-sair", "Voltar ao menu");
      v.type = "button";
      v.addEventListener("click", menu);
      corpo.appendChild(v);
    }

    mostrar();
  }

  document.getElementById("abrir-estudo").addEventListener("click", () => {
    menu();
    telaCarta.classList.add("oculta");
    tela.hidden = false;
    window.scrollTo(0, 0);
  });

  document.getElementById("voltar-estudo").addEventListener("click", () => {
    tela.hidden = true;
    telaCarta.classList.add("volta");
    telaCarta.classList.remove("oculta");
    window.scrollTo(0, 0);
  });
}

` + funcAntiga);

/* 5. Iniciar */
trocar("iniciar a aba Estudar", "configurarComandos();", "configurarComandos();\nconfigurarEstudo();");

fs.writeFileSync(ARQUIVO, html);

/* 6. Banco de perguntas (não sobrescreve se já existir) */
if (fs.existsSync("perguntas.js")) {
  console.log("perguntas.js já existe: mantido como está.");
} else {
  fs.writeFileSync("perguntas.js", "window.PERGUNTAS = " + JSON.stringify(PERGUNTAS, null, 1) + ";\n");
  console.log("OK: perguntas.js criado com " + PERGUNTAS.length + " perguntas");
}

console.log("\nPronto! index.html atualizado. Backup em originais/index.backup-estudo.html");