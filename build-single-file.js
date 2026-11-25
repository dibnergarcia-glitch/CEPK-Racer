/**
 * build-single-file.js
 * -------------------------------------------------------------------------
 * Gera `jogo-completo.html`: uma cópia do jogo com o CSS e o JavaScript
 * embutidos no próprio HTML.
 *
 * Por que isso existe?
 *   Abrir `index.html` por duplo clique (file://) funciona na maioria dos
 *   navegadores, mas depende de os arquivos `style.css`, `game.js` e dos
 *   ícones estarem na mesma pasta e de o navegador permitir scripts locais.
 *   A versão de arquivo único não depende de nada: é um único `.html`
 *   autocontido (CSS, JS e ícone embutidos), perfeito para compartilhar,
 *   e-mailar ou abrir em qualquer máquina — é a versão de arquivo único.
 *
 * Uso:  node build-single-file.js
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'game.js'), 'utf8');

const banner = `<!--
  ============================================================================
   CEPK RACER — versão de arquivo único (gerada por build-single-file.js)
   CSS, JavaScript e o ícone do CEPK estão embutidos: basta abrir este arquivo
   no navegador. Para editar o jogo, altere index.html / style.css / game.js /
   icon.svg e rode:
       node build-single-file.js
  ============================================================================
-->
`;

// Embute os ícones como data URI, para o arquivo baixado não depender
// de arquivos externos na mesma pasta.
const dataUri = (file, mime) =>
  `data:${mime};base64,${fs.readFileSync(path.join(root, file)).toString('base64')}`;

const iconSvg = dataUri('icon.svg', 'image/svg+xml');
const iconPng = dataUri('icon.png', 'image/png');
const appleTouchIcon = dataUri('apple-touch-icon.png', 'image/png');

const output = html
  .replace(
    '<link rel="stylesheet" href="style.css" />',
    `<style>\n${css}\n  </style>`
  )
  .replace(
    '<script src="game.js"></script>',
    `<script>\n${js}\n  </script>`
  )
  // Marca a página como "arquivo único": serve para gerar cópias do
  // próprio documento (caso queira distribuir o jogo em arquivo único).
  .replace('<html lang="pt-BR">', '<html lang="pt-BR" data-single-file="1">')
  .split('"icon.svg"').join(`"${iconSvg}"`)
  .split('"icon.png"').join(`"${iconPng}"`)
  .split('"apple-touch-icon.png"').join(`"${appleTouchIcon}"`);

const target = path.join(root, 'jogo-completo.html');
fs.writeFileSync(target, banner + output, 'utf8');

console.log('✔ jogo-completo.html gerado (' + fs.statSync(target).size + ' bytes)');
