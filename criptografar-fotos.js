const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const readline = require("readline");

const ORIGEM = "originais";
const DESTINO = "surpresa";
const TIPOS = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif"
};

function perguntarSenha() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("Senha das fotos: ", (resp) => { rl.close(); resolve(resp); });
  });
}

function criptografar(buffer, senha) {
  const sal = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const chave = crypto.pbkdf2Sync(senha, sal, 200000, 32, "sha256");
  const cifra = crypto.createCipheriv("aes-256-gcm", chave, iv);
  const dados = Buffer.concat([cifra.update(buffer), cifra.final()]);
  const tag = cifra.getAuthTag();
  return Buffer.concat([sal, iv, dados, tag]);
}

async function main() {
  let senha = process.argv[2];
  if (!senha) senha = await perguntarSenha();
  if (!senha) { console.error("Senha vazia. Cancelado."); process.exit(1); }

  if (!fs.existsSync(ORIGEM)) {
    console.error('Pasta "' + ORIGEM + '" não existe. Crie ela e coloque as fotos lá.');
    process.exit(1);
  }

  const arquivos = fs.readdirSync(ORIGEM)
    .filter((f) => TIPOS[path.extname(f).toLowerCase()])
    .sort();

  if (!arquivos.length) {
    console.error('Nenhuma foto (jpg, png, webp, gif) em "' + ORIGEM + '".');
    process.exit(1);
  }

  fs.mkdirSync(DESTINO, { recursive: true });

  for (const f of fs.readdirSync(DESTINO)) {
    if (f.endsWith(".enc") || f === "lista.json") fs.unlinkSync(path.join(DESTINO, f));
  }

  const lista = [];
  arquivos.forEach((nome, i) => {
    const original = fs.readFileSync(path.join(ORIGEM, nome));
    const saida = "foto-" + (i + 1) + ".enc";
    fs.writeFileSync(path.join(DESTINO, saida), criptografar(original, senha));
    lista.push({ arquivo: saida, tipo: TIPOS[path.extname(nome).toLowerCase()] });
    console.log("OK:", nome, "->", saida);
  });

  fs.writeFileSync(path.join(DESTINO, "lista.json"), JSON.stringify(lista, null, 2));
  console.log("\nPronto! " + lista.length + " foto(s) criptografada(s) em \"" + DESTINO + "\".");

  const abertas = fs.readdirSync(DESTINO).filter((f) => TIPOS[path.extname(f).toLowerCase()]);
  if (abertas.length) {
    console.warn("\nATENÇÃO: tem foto ABERTA em \"" + DESTINO + "\": " + abertas.join(", "));
    console.warn('Move ela pra "' + ORIGEM + '" antes de dar commit.');
  }
}

main();