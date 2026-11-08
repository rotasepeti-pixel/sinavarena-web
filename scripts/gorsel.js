// Site görselleri: favicon (ikon-192.png) ve paylaşım görseli (og.png, 1200x630). Uygulamanın logo.svg'sinden.
// Kullanım: NODE_PATH=<@resvg/resvg-js olan node_modules> node scripts/gorsel.js
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const IMG = path.join(__dirname, '../src/img');
const logo = fs.readFileSync(path.join(__dirname, '../../sinav-arena/assets/logo.svg'), 'utf8');
const png = (svg, w) => new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { loadSystemFonts: true } }).render().asPng();
fs.writeFileSync(path.join(IMG, 'ikon-192.png'), png(logo, 192));
const ic = logo.replace(/<\?xml[^>]*>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const desen = fs.readFileSync(path.join(IMG, 'desen.png')).toString('base64');
const og = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#0B1024"/>
${[0, 360, 720, 1080].flatMap((x) => [0, 360].map((y) => `<image x="${x}" y="${y}" width="360" height="360" href="data:image/png;base64,${desen}"/>`)).join('')}
<g transform="translate(80 150) scale(0.2)"><svg width="1024" height="1024" viewBox="0 0 1024 1024">${ic}</svg></g>
<text x="80" y="420" fill="#FFFFFF" font-family="Segoe UI" font-weight="800" font-size="74">Deneme çöz,</text>
<text x="80" y="500" fill="#FFFFFF" font-family="Segoe UI" font-weight="800" font-size="74">sonucunu anında gör.</text>
<text x="300" y="235" fill="#FFFFFF" font-family="Segoe UI" font-weight="800" font-size="64">SınavArena</text>
<text x="80" y="570" fill="#F5A524" font-family="Segoe UI" font-weight="700" font-size="32">Ehliyet · AÖF · Açık Lise · Bursluluk · Özel Güvenlik · sinavarena.tr</text>
</svg>`;
fs.writeFileSync(path.join(IMG, 'og.png'), png(og, 1200));
console.log('ok');
