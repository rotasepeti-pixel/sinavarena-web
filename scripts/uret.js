// sinavarena.tr tanıtım ve SEO sitesini data/*.json'dan statik HTML olarak üretir.
// Kullanım: node scripts/uret.js            → site/   (GitHub Pages'e giden site)
//           node scripts/uret.js --onizleme → onizleme/ (Claude artifact önizlemesi: bağlantılar index.html ile)
const fs = require('fs');
const path = require('path');

const ONIZLEME = process.argv.includes('--onizleme');
const KOK = path.join(__dirname, '..');
const OUT = path.join(KOK, ONIZLEME ? 'onizleme' : 'site');
const ALAN = 'https://sinavarena.tr';
const PLAY = 'https://play.google.com/store/apps/details?id=com.corsh.sinavarena';
const playLink = (kaynak) => `${PLAY}&referrer=utm_source%3Dsinavarena.tr%26utm_medium%3Dweb%26utm_campaign%3D${kaynak}`;
const BUGUN = new Date();
const GUNCELLEME = BUGUN.toISOString().slice(0, 10);

const METIN = require('./metinler');
const oku = (f) => JSON.parse(fs.readFileSync(path.join(KOK, 'data', f), 'utf8'));
const cats = oku('kategoriler.json');
const dersler = oku('dersler.json');
const denemeler = oku('denemeler.json');
const cikmis = oku('cikmis.json');
const { havuz, kitapcik } = oku('sayilar.json');
// Admin panelindeki "Web sitesi" bölümünden gelen ayarlar ve yazılar (dosya yoksa varsayılanlar).
const okuVarsa = (f, v) => { try { return oku(f); } catch { return v; } };
const AYAR = okuVarsa('site-ayarlari.json', {});
const YAZILAR = okuVarsa('yazilar.json', []);
const ADSENSE = /^ca-pub-\d{10,20}$/.test(AYAR.adsense_client || '') ? AYAR.adsense_client : '';
const APP_STORE = /^https:\/\/apps\.apple\.com\//.test(AYAR.app_store_url || '') ? AYAR.app_store_url : '';
// Sayılar aşağı yuvarlanır ("1.596" → "1.500+"): büyük ama her zaman doğru.
const yuvarla = (n) => {
  const adim = n < 100 ? 1 : n < 1000 ? 50 : n < 10000 ? 500 : 5000;
  const y = Math.floor(n / adim) * adim;
  return y.toLocaleString('tr-TR') + (y < n ? '+' : '');
};
// Bir sınavın uygulamadaki içeriği tek cümlede: soru havuzu, deneme ve resmî çıkmış sınav kitapçıkları.
const icerikParcalari = (slug) => [
  havuz[slug] && `${yuvarla(havuz[slug])} soruluk soru havuzu`,
  kokDeneme[slug] && `${yuvarla(kokDeneme[slug])} deneme`,
  kitapcik[slug] && `${yuvarla(kitapcik[slug])} resmî çıkmış sınav kitapçığı`,
].filter(Boolean);
const listele = (a) => (a.length > 1 ? a.slice(0, -1).join(', ') + ' ve ' + a[a.length - 1] : a[0] ?? '');

const by = (s) => cats.find((c) => c.slug === s);
const kids = (s) => cats.filter((c) => c.parent === s);
const kokSlug = (s) => {
  let x = by(s) || by((s || '').split('--')[0]);
  if (!x) return null;
  while (x.parent) x = by(x.parent);
  return x.slug;
};
// Türkçe adı adres parçasına çevirir: "Çocuk Gelişimi (Lisans)" → "cocuk-gelisimi-lisans".
const slugla = (t) => t.toLocaleLowerCase('tr').replace(/[çğıöşüâî]/g, (h) => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i' })[h]).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tarihYaz = (d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });

// Yayındaki online deneme sayıları: sınav (kök kategori) ve bölüm başına.
const kokDeneme = {};
const altDeneme = {};
for (const e of denemeler) {
  const k = kokSlug(e.category);
  if (k) kokDeneme[k] = (kokDeneme[k] || 0) + 1;
  let x = by((e.category || '').split('--')[0]);
  while (x) {
    altDeneme[x.slug] = (altDeneme[x.slug] || 0) + 1;
    x = x.parent ? by(x.parent) : null;
  }
}

// ---------------------------------------------------------------------------------------------
// Sınav sayfalarının içeriği. Sayılar uygulamadaki sınav düzeniyle aynıdır
// (supabase/sinav_duzeni_msu_dgs.sql, online_kpss_plan); bilinmeyen yapı yazılmaz.
const SINAVLAR = [
  {
    slug: 'ehliyet', url: 'ehliyet-deneme-sinavi', kisa: 'EHL', renk: '#1F7BD1',
    baslik: 'Ehliyet Deneme Sınavı Çöz', h1: 'Ehliyet deneme sınavı: MEB e-Sınav düzeninde çöz',
    aciklama: 'MEB e-Sınav düzeninde 50 soruluk ehliyet deneme sınavları: trafik, ilk yardım, araç tekniği ve trafik adabı. Süreli çöz, sonucunu ve yanlışlarını anında gör.',
    giris: 'Sürücü belgesi yazılı sınavı MEB e-Sınav merkezlerinde bilgisayarda yapılır. SınavArena\'daki ehliyet denemeleri bu düzeni izler: 50 soru, 45 dakika ve aynı ders dağılımı. Her deneme bitince doğru, yanlış ve boşlarını, ders ders sonucunu görürsün.',
    yapi: { sure: 45, dersler: [['Trafik ve Çevre', 23], ['İlk Yardım', 12], ['Araç Tekniği', 9], ['Trafik Adabı', 6]], not: 'Geçme notu 70 puandır.' },
    kelimeler: ['ehliyet deneme sınavı', 'e-sınav ehliyet soruları', 'ehliyet sınav soruları çöz', 'MEB e-sınav deneme'],
  },
  {
    slug: 'anadolu-aof', url: 'anadolu-aof', kisa: 'AÖF', renk: '#E8590C',
    baslik: 'Anadolu AÖF Deneme Sınavı ve Ders Listeleri', h1: 'Anadolu AÖF sınavlarına hazırlan',
    aciklama: 'Anadolu Üniversitesi Açıköğretim (AÖF) ön lisans ve lisans bölümlerinin ders listeleri, sınav takvimi ve ara sınav, dönem sonu deneme sınavları.',
    giris: 'Anadolu AÖF\'te bölümünü ve dersini seçip o dersin ara sınav ve dönem sonu konularından deneme çözebilirsin. Aşağıda bütün bölümlerin resmî ders listeleri var; bölümüne dokununca dersleri yarıyıl yarıyıl görürsün.',
    yapi: { sure: 30, dersler: [['Ara Sınav Konuları', 10], ['Dönem Sonu Konuları', 10]], baslik: 'Uygulamadaki AÖF karma denemesi' },
    kelimeler: ['anadolu aöf deneme sınavı', 'aöf ders listesi', 'aöf vize final deneme', 'açıköğretim sınav hazırlık'],
  },
  {
    slug: 'ata-aof', url: 'ata-aof', kisa: 'ATA', renk: '#1E2A78',
    baslik: 'ATA AÖF Deneme Sınavı ve Ders Listeleri', h1: 'ATA AÖF sınavlarına hazırlan',
    aciklama: 'Atatürk Üniversitesi Açıköğretim (ATA AÖF) bölümlerinin ders listeleri, sınav takvimi ve deneme sınavları.',
    giris: 'ATA AÖF bölümlerinin resmî ders listeleri ve sınav takvimi. Uygulamada bölümünü seçip ara sınav ve final için deneme çözebilirsin.',
    kelimeler: ['ata aöf deneme sınavı', 'ata aöf ders listesi', 'atatürk üniversitesi açıköğretim sınav'],
  },
  {
    slug: 'auzef', url: 'auzef', kisa: 'AUZ', renk: '#0E7490',
    baslik: 'İÜ AUZEF Deneme Sınavı ve Ders Listeleri', h1: 'İÜ AUZEF sınavlarına hazırlan',
    aciklama: 'İstanbul Üniversitesi AUZEF ön lisans, lisans ve lisans tamamlama bölümlerinin ders listeleri, sınav takvimi ve deneme sınavları.',
    giris: 'İÜ AUZEF bölümlerinin resmî ders listeleri ve sınav takvimi. Uygulamada bölümünü seçip ara sınav ve final için deneme çözebilirsin.',
    kelimeler: ['auzef deneme sınavı', 'auzef ders listesi', 'auzef vize final'],
  },
  {
    slug: 'aol', url: 'acik-lise-deneme-sinavi', kisa: 'AÖL', renk: '#C2410C',
    baslik: 'Açık Lise Deneme Sınavı Çöz', h1: 'Açık Lise (AÖL) deneme sınavları',
    aciklama: 'MEB Açık Öğretim Lisesi sınavlarına hazırlık: çıkmış sorulardan hazırlanan karma denemeler, sınav takvimi ve resmî kaynaklar.',
    giris: 'Açık Lise denemeleri MEB\'in yayımladığı çıkmış soru kitapçıklarından hazırlanır; her kitapçık kendi tarihli denemesi olarak çözülür. Sınav tarihleri ve kesin bilgi için aol.meb.gov.tr esas alınır.',
    kelimeler: ['açık lise deneme sınavı', 'aöl çıkmış sorular', 'açık lise sınav soruları'],
  },
  {
    slug: 'iokbs', url: 'bursluluk-sinavi-deneme', kisa: 'BUR', renk: '#7C3AED',
    baslik: 'Bursluluk Sınavı (İOKBS) Deneme Çöz', h1: 'Bursluluk sınavı (İOKBS) denemeleri',
    aciklama: 'MEB İOKBS bursluluk sınavına 5, 6, 7, 8. sınıf ve lise için hazırlık: geçmiş yıl kitapçıklarından denemeler ve sınav bilgileri.',
    giris: 'Bursluluk denemeleri sınıf düzeyine göre ayrılır: 5, 6, 7, 8. sınıf ve lise. Denemeler MEB Ölçme, Değerlendirme ve Sınav Hizmetleri\'nin yayımladığı geçmiş yıl kitapçıklarına dayanır.',
    kelimeler: ['bursluluk sınavı deneme', 'iokbs deneme sınavı', 'bursluluk sınavı soruları'],
  },
  {
    slug: 'ogg', url: 'ozel-guvenlik-sinav-sorulari', kisa: 'ÖGG', renk: '#B91C1C',
    baslik: 'Özel Güvenlik Sınav Soruları ve Deneme', h1: 'Özel güvenlik (ÖGG) sınavına hazırlan',
    aciklama: 'Özel güvenlik görevlisi temel eğitim sınavı için Emniyet Genel Müdürlüğü\'nün yayımladığı geçmiş dönem kitapçıklarından denemeler.',
    giris: 'Özel güvenlik denemeleri Emniyet Genel Müdürlüğü\'nün yayımladığı geçmiş dönem soru kitapçıklarına dayanır. Her dönemi ayrı bir deneme olarak çözebilirsin.',
    kelimeler: ['özel güvenlik sınav soruları', 'ögg deneme sınavı', 'özel güvenlik çıkmış sorular'],
  },
  {
    slug: 'kpss', url: 'kpss-deneme-sinavi', kisa: 'KPSS', renk: '#0F766E',
    baslik: 'KPSS Deneme Sınavı', h1: 'KPSS deneme sınavı',
    aciklama: 'KPSS Genel Yetenek - Genel Kültür düzeninde deneme: 120 soru, 130 dakika. Lisans, ön lisans ve ortaöğretim.',
    giris: 'KPSS denemeleri Genel Yetenek ve Genel Kültür testinin ders dağılımını izler. Lisans, ön lisans ve ortaöğretim düzeyleri ayrı seçilir.',
    yapi: { sure: 130, dersler: [['Türkçe', 30], ['Matematik', 30], ['Tarih', 27], ['Coğrafya', 18], ['Vatandaşlık', 9], ['Güncel Bilgiler', 6]] },
    kelimeler: ['kpss deneme sınavı', 'kpss gy gk deneme', 'kpss online deneme'],
  },
  {
    slug: 'msu', url: 'msu-deneme-sinavi', kisa: 'MSÜ', renk: '#3F6212',
    baslik: 'MSÜ Deneme Sınavı', h1: 'MSÜ deneme sınavı',
    aciklama: 'Millî Savunma Üniversitesi sınavı düzeninde deneme: Türkçe, sosyal bilimler, temel matematik ve fen bilimleri; 120 soru, 165 dakika.',
    giris: 'MSÜ denemeleri ÖSYM\'nin uyguladığı soru dağılımını izler.',
    yapi: { sure: 165, dersler: [['Türkçe', 40], ['Sosyal Bilimler', 20], ['Temel Matematik', 40], ['Fen Bilimleri', 20]] },
    kelimeler: ['msü deneme sınavı', 'msü soruları'],
  },
  {
    slug: 'dgs', url: 'dgs-deneme-sinavi', kisa: 'DGS', renk: '#9D174D',
    baslik: 'DGS Deneme Sınavı', h1: 'DGS deneme sınavı',
    aciklama: 'Dikey Geçiş Sınavı düzeninde deneme: sayısal (matematik ve geometri) ve sözel bölüm; 100 soru, 150 dakika.',
    giris: 'DGS denemeleri sayısal ve sözel bölümlerin soru dağılımını izler.',
    yapi: { sure: 150, dersler: [['Matematik', 40], ['Geometri', 10], ['Türkçe (sözel)', 50]] },
    kelimeler: ['dgs deneme sınavı', 'dgs soruları'],
  },
  {
    slug: 'yks', url: 'yks-deneme-sinavi', kisa: 'YKS', renk: '#4338CA',
    baslik: 'YKS Deneme Sınavı (TYT, AYT, YDT)', h1: 'YKS deneme sınavı',
    aciklama: 'YKS (TYT, AYT, YDT) sınavına hazırlık: sınav takvimi ve deneme sınavları.',
    giris: 'YKS bölümünde TYT, AYT ve YDT oturumları için denemeler yer alır.',
    kelimeler: ['yks deneme sınavı', 'tyt deneme', 'ayt deneme'],
  },
  {
    slug: 'lgs', url: 'lgs-deneme-sinavi', kisa: 'LGS', renk: '#B45309',
    baslik: 'LGS Deneme Sınavı', h1: 'LGS deneme sınavı',
    aciklama: 'Liselere Geçiş Sistemi (LGS) merkezî sınavına hazırlık: sınav bilgileri ve deneme sınavları.',
    giris: 'LGS bölümünde 8. sınıf merkezî sınavı için denemeler yer alır.',
    kelimeler: ['lgs deneme sınavı', 'lgs soruları'],
  },
  {
    slug: 'ales', url: 'ales-deneme-sinavi', kisa: 'ALES', renk: '#0369A1',
    baslik: 'ALES Deneme Sınavı', h1: 'ALES deneme sınavı',
    aciklama: 'Akademik Personel ve Lisansüstü Eğitim Giriş Sınavı (ALES) için sınav takvimi ve deneme sınavları.',
    giris: 'ALES bölümünde sayısal ve sözel testler için denemeler yer alır.',
    kelimeler: ['ales deneme sınavı', 'ales soruları'],
  },
  {
    slug: 'yds', url: 'yds-deneme-sinavi', kisa: 'YDS', renk: '#15803D',
    baslik: 'YDS ve YÖKDİL Deneme Sınavı', h1: 'YDS / YÖKDİL deneme sınavı',
    aciklama: 'Yabancı dil sınavları (YDS, YÖKDİL) için sınav takvimi ve deneme sınavları.',
    giris: 'YDS / YÖKDİL bölümünde yabancı dil sınavları için denemeler yer alır.',
    kelimeler: ['yds deneme sınavı', 'yökdil deneme'],
  },
];
const KAYNAK = {
  ehliyet: ['MEB Ölçme, Değerlendirme ve Sınav Hizmetleri', 'https://odsgm.meb.gov.tr'],
  lgs: ['MEB Ölçme, Değerlendirme ve Sınav Hizmetleri', 'https://odsgm.meb.gov.tr'],
  iokbs: ['MEB Ölçme, Değerlendirme ve Sınav Hizmetleri', 'https://odsgm.meb.gov.tr'],
  aol: ['MEB Açık Öğretim Lisesi', 'https://aol.meb.gov.tr'],
  ogg: ['Emniyet Genel Müdürlüğü Özel Güvenlik', 'https://www.egm.gov.tr/ozelguvenlik'],
  'anadolu-aof': ['Anadolu Üniversitesi Açıköğretim', 'https://www.anadolu.edu.tr'],
  'ata-aof': ['Atatürk Üniversitesi Açıköğretim', 'https://atauni.edu.tr'],
  auzef: ['İstanbul Üniversitesi AUZEF', 'https://auzef.istanbul.edu.tr'],
};
const kaynak = (slug) => KAYNAK[slug] ?? ['ÖSYM', 'https://www.osym.gov.tr'];
const AOF = ['anadolu-aof', 'ata-aof', 'auzef'];

// AÖF bölümleri: alt kartlarının hepsi sınav türü (vize, final…) olan kategoriler.
const programlar = cats
  .filter((c) => !c.aof_tur && !c.ders_kod && kids(c.slug).length && kids(c.slug).every((k) => k.aof_tur))
  .map((p) => {
    const kok = kokSlug(p.slug);
    const ust = by(p.parent);
    return {
      ...p, kok,
      duzey: ust && ust.slug !== kok ? ust.name : (p.subtitle || '').split('·')[0].trim(),
      url: `${SINAVLAR.find((s) => s.slug === kok).url}/${slugla(p.name)}`,
      dersler: dersler.filter((d) => d.program === p.slug),
      deneme: altDeneme[p.slug] || 0,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, 'tr'));
for (const p of programlar) if (programlar.some((x) => x !== p && x.url === p.url)) p.url += '-' + slugla(p.duzey || 'bolum');

// ---------------------------------------------------------------------------------------------
// Üst menü: sınav adları; açıköğretim, MEB ve ÖSYM sınavları açılır gruplarda, her birinin altında
// kısa açıklama (metinler.js). Telefonda tek "Menü" düğmesinin altında bütün liste açılır.
const MENU = [
  ['ehliyet'],
  ['Açıköğretim', ['anadolu-aof', 'ata-aof', 'auzef', 'aol'], ['aof-bolumleri', 'Bütün AÖF bölümleri', 'Bölüm ya da ders koduyla ara']],
  ['MEB sınavları', ['iokbs', 'lgs']],
  ['ÖSYM sınavları', ['kpss', 'yks', 'ales', 'dgs', 'yds', 'msu']],
  ['ogg'],
];
function menuHtml(L) {
  const oge = (slug) => {
    const s = SINAVLAR.find((x) => x.slug === slug);
    return `<a class="menu-oge" href="${L(s.url)}">${rozet(s, 'mini')}<span><strong>${esc(by(slug)?.name ?? s.kisa)}</strong><small>${esc(METIN[slug]?.menu ?? '')}</small></span></a>`;
  };
  const ek = (e) => (e ? `<a class="menu-oge" href="${L(e[0])}"><span class="rozet mini ara-rozet" aria-hidden="true">⌕</span><span><strong>${e[1]}</strong><small>${e[2]}</small></span></a>` : '');
  const masa = MENU.map(([a, liste, e]) => (liste
    ? `<details class="acilir"><summary>${a}</summary><div class="acilir-panel">${liste.map(oge).join('')}${ek(e)}</div></details>`
    : `<a class="menu-link" href="${L(SINAVLAR.find((x) => x.slug === a).url)}">${esc(by(a)?.name)}</a>`)).join('');
  const tel = MENU.map(([a, liste, e]) => (liste ? `<p class="mobil-grup">${a}</p>${liste.map(oge).join('')}${ek(e)}` : oge(a))).join('');
  return `<nav class="menu" aria-label="Sınavlar">${masa}</nav>
  <details class="mobil-menu"><summary aria-label="Menü"><span></span></summary><div class="mobil-panel">${tel}<a class="menu-oge" href="${L('sss')}"><span><strong>Sık sorulan sorular</strong></span></a></div></details>`;
}

// ---------------------------------------------------------------------------------------------
// Sayfa iskeleti
function sayfa({ yol, title, desc, govde, jsonld = [], anahtar }) {
  const derinlik = yol ? yol.split('/').length : 0;
  const kok = derinlik ? '../'.repeat(derinlik) : './';
  // Önizlemede klasör bağlantıları index.html'e gider; gerçek sitede temiz adres (/klasor/).
  const L = (to) => (to ? kok + to + '/' + (ONIZLEME ? 'index.html' : '') : kok + (ONIZLEME ? 'index.html' : ''));
  const canon = `${ALAN}/${yol ? yol + '/' : ''}`;
  const html = govde(L, kok);
  const head = `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">${anahtar ? `\n<meta name="keywords" content="${esc(anahtar.join(', '))}">` : ''}
<link rel="canonical" href="${canon}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SınavArena">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${ALAN}/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B1024">
<link rel="icon" href="${kok}img/ikon-192.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Source+Sans+3:wght@400;600;700&display=swap">
<link rel="stylesheet" href="${kok}style.css">${ADSENSE && !ONIZLEME ? `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>` : ''}
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}`;
  const duyuru = AYAR.duyuru ? `<div class="duyuru"><div class="ic">${AYAR.duyuru_link ? `<a href="${esc(AYAR.duyuru_link)}">${esc(AYAR.duyuru)}</a>` : esc(AYAR.duyuru)}</div></div>
` : '';
  const ust = `${duyuru}<header class="ust"><div class="ic ust-ic">
  <a class="marka" href="${L('')}"><img src="${kok}img/ikon-192.png" alt="" width="34" height="34"><span>SınavArena</span></a>
  ${menuHtml(L)}
  <a class="indir-kucuk" href="${playLink('ust')}" rel="noopener">Uygulamayı indir</a>
</div></header>`;
  const alt = `<footer class="alt"><div class="ic">
  <div class="alt-ust">
    <div><a class="marka" href="${L('')}"><img src="${kok}img/ikon-192.png" alt="" width="30" height="30"><span>SınavArena</span></a>
    <p class="alt-not">Android ve iOS için sınav hazırlık uygulaması. Deneme çöz, sonucunu anında gör. Ehliyet, açıköğretim, Açık Lise, Bursluluk, Özel Güvenlik ve ÖSYM sınavları.</p></div>
    <nav class="alt-menu" aria-label="Alt menü">
      <a href="${L('ehliyet-deneme-sinavi')}">Ehliyet deneme sınavı</a>
      <a href="${L('anadolu-aof')}">Anadolu AÖF</a>
      <a href="${L('acik-lise-deneme-sinavi')}">Açık Lise</a>
      <a href="${L('aof-bolumleri')}">Bütün AÖF bölümleri</a>
      <a href="${L('sss')}">Sık sorulan sorular</a>
${YAZILAR.length ? `      <a href="${L('yazilar')}">Yazılar</a>
` : ''}      <a href="https://rotasepeti-pixel.github.io/sinavarena/">Gizlilik politikası</a>
      <a href="https://rotasepeti-pixel.github.io/sinavarena/kullanim-kosullari.html">Kullanım koşulları</a>
    </nav>
  </div>
  <p class="beyan">SınavArena bağımsız bir sınav hazırlık uygulamasıdır. ÖSYM, MEB, Emniyet Genel Müdürlüğü, üniversiteler veya herhangi bir devlet kurumunu temsil etmez; bu kurumlarla bağlantılı değildir ve bu kurumlarca onaylanmamıştır. Sınav tarihleri, başvurular ve sonuçlar için daima resmî kaynakları esas alın: <a href="https://www.osym.gov.tr">osym.gov.tr</a>, <a href="https://odsgm.meb.gov.tr">odsgm.meb.gov.tr</a>, <a href="https://aol.meb.gov.tr">aol.meb.gov.tr</a>, <a href="https://www.egm.gov.tr/ozelguvenlik">egm.gov.tr</a>, <a href="https://www.anadolu.edu.tr">anadolu.edu.tr</a>, <a href="https://atauni.edu.tr">atauni.edu.tr</a>, <a href="https://auzef.istanbul.edu.tr">auzef.istanbul.edu.tr</a>.</p>
  ${ADSENSE ? '<p class="kucuk cerez-not">Bu sitede Google AdSense reklamları gösterilir; Google reklamları kişiselleştirmek için çerez kullanabilir. Ayrıntılar gizlilik politikasında.</p>' : ''}
  <p class="telif">© ${BUGUN.getFullYear()} SınavArena · Son güncelleme ${tarihYaz(BUGUN)}</p>
</div></footer>`;
  const body = `${ust}\n<main>${html}</main>\n${alt}\n<script src="${kok}site.js" defer></script>`;
  // Önizlemenin ana sayfası artifact iskeletine sarılır: kendi doctype/head'i olmaz.
  if (ONIZLEME && !yol) return `${head.replace('<title>', '<meta name="claude:viewport-fit-sides" content="cover">\n<title>')}\n${body}\n`;
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head>
<body>
${body}
</body>
</html>
`;
}

const yaz = (yol, html) => {
  const f = path.join(OUT, yol, 'index.html');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
};

const durum = (slug) => (AOF.includes(slug) ? { cls: 'hazir', yazi: `${programlar.filter((p) => p.kok === slug).length} bölüm` }
  : havuz[slug] ? { cls: 'hazir', yazi: `${yuvarla(havuz[slug])} soru` }
  : kokDeneme[slug] ? { cls: 'hazir', yazi: `${yuvarla(kokDeneme[slug])} deneme` }
  : kitapcik[slug] ? { cls: 'hazir', yazi: `${yuvarla(kitapcik[slug])} çıkmış sınav` }
  : { cls: 'yakinda', yazi: 'Hazırlanıyor' });
const sonrakiTarih = (c) => (c?.exam_date && new Date(c.exam_date) > BUGUN ? c.exam_date : null);
const kalanGun = (d) => Math.ceil((new Date(d) - BUGUN) / 86400000);

// Reklam alanı: yalnızca admin panelinde AdSense yayıncı ve birim kimliği girildiyse görünür.
const reklam = (yer) => {
  const slot = AYAR[`adsense_slot_${yer}`];
  if (!ADSENSE || !/^\d{6,20}$/.test(slot || '') || ONIZLEME) return '';
  return `<div class="reklam" aria-label="Reklam"><span>Reklam</span><ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`;
};
const rozet = (s, boy = '') => `<span class="rozet ${boy}" style="--r:${s.renk}" aria-hidden="true">${esc(s.kisa)}</span>`;
const indirDugme = (kaynakAdi, yazi = 'Google Play’den indir') => `<a class="indir" href="${playLink(kaynakAdi)}" rel="noopener">
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M3.6 1.8 13.8 12 3.6 22.2c-.4-.2-.6-.7-.6-1.2V3c0-.5.2-1 .6-1.2Zm11.3 11.3 2.4 2.4-11 6.3 8.6-8.7Zm3.6-3.6 2.6 1.5c.8.5.8 1.6 0 2l-2.6 1.5-2.6-2.5 2.6-2.5ZM6.3 2.2l11 6.3-2.4 2.4-8.6-8.7Z"/></svg>
  <span><small>Ücretsiz</small>${esc(yazi)}</span></a>`;
// iOS uygulaması sitede her yerde anılır; yalnızca App Store indirme bağlantısı henüz yok: soluk, tıklanamaz düğme.
const IOS_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.3-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9ZM14 5.3c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z"/></svg>';
const iosDugme = () => APP_STORE ? `<a class="indir" href="${esc(APP_STORE)}" rel="noopener">${IOS_SVG}<span><small>iPhone için</small>App Store’dan indir</span></a>` : `<span class="ios" aria-label="App Store sürümü yakında"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.3-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9ZM14 5.3c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z"/></svg><span><small>iPhone için</small>App Store</span><em>Yakında</em></span>`;

function sinavKarti(s, L) {
  const c = by(s.slug);
  const d = durum(s.slug);
  const t = sonrakiTarih(c) || programlar.filter((p) => p.kok === s.slug).map((p) => p.exam_date).find(Boolean);
  const gun = t && new Date(t) > BUGUN ? kalanGun(t) : null;
  return `<li><a class="kart" href="${L(s.url)}">
  ${rozet(s)}
  <span class="kart-yazi"><strong>${esc(c?.name ?? s.kisa)}</strong><span>${esc(c?.subtitle ?? '')}</span></span>
  ${gun != null ? `<span class="gun">${gun} gün</span>` : ''}
  <span class="durum ${d.cls}">${d.yazi}</span>
</a></li>`;
}

// ---------------------------------------------------------------------------------------------
// Ana sayfa
const MODLAR = [
  ['Ortak oturum', 'Belirlenen saatte tüm Türkiye aynı denemeye aynı anda girer; sıralaman sınav biter bitmez çıkar.', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z'],
  ['Hazır masalar', 'Boş koltuğu olan bir masaya otur; masa dolunca deneme başlar, arkadaşlarınla aynı soruları çözersin.', 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4Zm8 0c-.3 0-.7 0-1.1.1 1.2.9 2.1 2.1 2.1 3.9v2h7v-2c0-2.7-5.3-4-8-4Z'],
  ['Kendi masanı kur', 'Davet kodunu arkadaşlarına gönder, aynı denemeyi birlikte çözün.', 'M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-6 9h-2V9H8V7h3V4h2v3h3v2h-3v3Z'],
  ['Tek başına çöz', 'Süreli deneme ya da istediğin konudan serbest çalışma. İşaretlediğin anda doğru cevabı görürsün.', 'M3 17.3V21h3.8L17.8 9.9l-3.7-3.7L3 17.3ZM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7L20.7 7Z'],
];
const OZELLIKLER = [
  ['Anında sonuç', 'Deneme bitince doğru, yanlış, boş, net ve puanın; ders ders sonuç tablosuyla eksiklerin görünür; geçmiş denemelerin Raporlarım’da saklanır.'],
  ['Yanlış Defterim', 'Yanlış yaptığın her soru defterine düşer. Defteri tekrar çöz; doğru bildiklerin defterden çıkar.'],
  ['Haftalık lig', 'Her doğru cevap lig puanı kazandırır. Grubunla yarış, Bronz’dan Şampiyon ligine yüksel.'],
  ['Günlük seri', 'Her gün bir deneme ya da çalışma bitir, serin büyüsün. Çalışmadığın gün akşam bir kez hatırlatılır.'],
  ['Sınav geri sayımı', 'Sınav tarihini ekle, kalan günleri ana ekranında takip et.'],
  ['Android ve iOS', 'Android telefonda, iPhone’da ve iPad’de aynı hesapla çalış; denemelerin, serin ve Yanlış Defterin hesabında saklanır.'],
];
const SSS = [
  ['SınavArena ücretsiz mi?', 'Evet, uygulamayı ücretsiz indirip kullanabilirsin. Ücretsiz kullanımda reklam gösterilir. İsteğe bağlı Premium abonelik ortak oturumları, sınırsız online sınavı, reklamsız kullanımı ve detaylı raporu açar.'],
  ['SınavArena resmî bir uygulama mı?', 'Hayır. SınavArena bağımsız bir sınav hazırlık uygulamasıdır; ÖSYM, MEB, Emniyet Genel Müdürlüğü veya üniversitelerle bağlantılı değildir. Sınav tarihleri, başvuru ve sonuçlar için resmî kurumların sitelerini esas al.'],
  ['Hangi sınavlara hazırlanabilirim?', 'Ehliyet (MEB e-Sınav), Anadolu AÖF, ATA AÖF, İÜ AUZEF, Açık Lise, Bursluluk (İOKBS) ve Özel Güvenlik sınavları için denemeler hazır. KPSS, YKS, LGS, ALES, DGS, YDS ve MSÜ için yüzlerce resmî çıkmış sınav kitapçığı uygulamada; bu sınavların deneme düzenleri hazırlanıyor.'],
  ['Denemeler nasıl hazırlanıyor?', 'Denemeler resmî kaynaklarda açıklanan soru sayısı, süre ve puanlama yapısına göre hazırlanır. Geçmiş yıllara ait resmî kitapçıklar ve cevap anahtarları yayımlandıkları resmî sitelerde açılır; SınavArena bu dosyaların sahibi değildir.'],
  ['Arkadaşlarımla birlikte çözebilir miyim?', 'Evet. Hazır masalardan birine oturabilir ya da kendi masanı kurup davet kodunu arkadaşlarına gönderebilirsin. Masa dolunca deneme herkes için aynı anda başlar.'],
  ['iPhone’da (iOS) var mı?', 'SınavArena Android ve iOS için bir uygulamadır; iPhone ve iPad’de de aynı hesapla çalışırsın. Android sürümü Google Play’den indirilebilir, App Store indirme bağlantısı çok yakında burada olacak.'],
  ['Hesabımı silebilir miyim?', 'Evet. Hesabını ve bütün verilerini uygulama içinden dilediğin zaman kalıcı olarak silebilirsin.'],
];
for (const x of Array.isArray(AYAR.ek_sss) ? AYAR.ek_sss : []) if (x?.soru && x?.cevap) SSS.push([x.soru, x.cevap]);
if (APP_STORE) SSS[SSS.findIndex(([q]) => q.startsWith('iPhone'))][1] = 'Evet. SınavArena Android ve iOS için bir uygulamadır; iPhone ve iPad’de App Store’dan, Android’de Google Play’den indirip aynı hesapla çalışabilirsin.';
const faqLd = (liste) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: liste.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const appLd = {
  '@context': 'https://schema.org', '@type': 'MobileApplication', name: 'SınavArena', operatingSystem: 'Android, iOS',
  applicationCategory: 'EducationalApplication', inLanguage: 'tr', url: ALAN + '/', installUrl: PLAY,
  description: 'Ehliyet, açıköğretim (AÖF, AUZEF), Açık Lise, Bursluluk, Özel Güvenlik ve ÖSYM sınavlarına hazırlananlar için online deneme sınavı ve soru çözme uygulaması.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
};
const sssHtml = (liste) => `<div class="sss">${liste.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
const hazirSinavlar = SINAVLAR.filter((s) => kokDeneme[s.slug] || havuz[s.slug]);
const yakindaSinavlar = SINAVLAR.filter((s) => !kokDeneme[s.slug] && !havuz[s.slug]);

yaz('', sayfa({
  yol: '',
  title: 'SınavArena · Online Deneme Sınavı Çöz: Ehliyet, AÖF, Açık Lise',
  desc: 'Ehliyet, Anadolu AÖF, ATA AÖF, AUZEF, Açık Lise, Bursluluk ve Özel Güvenlik sınavlarına Android telefonundan ya da iPhone’undan hazırlan. Gerçek sınav düzeninde deneme çöz, sonucunu anında gör. Ücretsiz.',
  anahtar: ['deneme sınavı çöz', 'online deneme sınavı', 'ehliyet deneme sınavı', 'aöf deneme sınavı', 'açık lise deneme', 'sınav hazırlık uygulaması', 'iphone sınav uygulaması', 'android deneme sınavı uygulaması'],
  jsonld: [appLd, { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SınavArena', url: ALAN + '/', inLanguage: 'tr' }, faqLd(SSS)],
  govde: (L, kok) => `
<section class="hero"><div class="ic hero-ic">
  <div class="hero-yazi">
    <p class="ust-etiket">Sınav hazırlık uygulaması · Android · iOS</p>
    <h1>${esc(AYAR.hero_baslik || 'Sınavına telefondan hazırlan. Deneme çöz, sonucunu anında gör.')}</h1>
    <p class="hero-alt">${esc(AYAR.hero_alt || 'Ehliyet, açıköğretim, Açık Lise, Bursluluk ve Özel Güvenlik sınavları için gerçek sınav düzeninde denemeler; Android telefonda ve iPhone’da. İster tek başına, ister arkadaşlarınla aynı masada, ister tüm Türkiye ile aynı anda.')}</p>
    <div class="hero-cta">${indirDugme('hero')}${iosDugme()}<a class="ikincil" href="#sinavlar">Sınavları gör</a></div>
    <ul class="hero-sayilar">
      <li><strong>${yuvarla(Object.values(havuz).reduce((a, b) => a + b, 0))}</strong><span>soru</span></li>
      <li><strong>${yuvarla(Object.values(kitapcik).reduce((a, b) => a + b, 0))}</strong><span>resmî çıkmış sınav</span></li>
      <li><strong>${programlar.length}</strong><span>AÖF bölümü</span></li>
          </ul>
  </div>
  <div class="telefonlar" aria-hidden="true">
    <figure class="tel tel-arka"><img src="${kok}img/ekran-aof.jpg" alt="" width="540" height="995" loading="lazy"></figure>
    <figure class="tel tel-on"><img src="${kok}img/ekran-ehliyet.jpg" alt="" width="540" height="995"></figure>
  </div>
</div></section>

<section class="blok" id="sinavlar"><div class="ic">
  <h2>Hangi sınava hazırlanıyorsun?</h2>
  <p class="blok-alt">Sınavına dokun; soru sayısı, süre, sınav tarihi ve uygulamada neler yapabileceğin açılır.</p>
  <p class="grup-baslik">Denemeler hazır</p>
  <ul class="kartlar">${hazirSinavlar.map((s) => sinavKarti(s, L)).join('')}</ul>
  <p class="grup-baslik">Resmî çıkmış sınavlar · denemeler hazırlanıyor</p>
  <ul class="kartlar">${yakindaSinavlar.map((s) => sinavKarti(s, L)).join('')}</ul>
</div></section>

${reklam('ust') ? `<div class="ic">${reklam('ust')}</div>` : ''}
<section class="blok koyu"><div class="ic">
  <h2>Nasıl çözmek istersin?</h2>
  <ul class="modlar">${MODLAR.map(([b, a, d], i) => `<li style="--i:${i}"><span class="mod-ikon"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg></span><div><h3>${b}</h3><p>${a}</p></div></li>`).join('')}</ul>
</div></section>

<section class="blok"><div class="ic">
  <h2>Çalışmanı takip eden araçlar</h2>
  <ul class="ozellikler">${OZELLIKLER.map(([b, a]) => `<li><h3>${b}</h3><p>${a}</p></li>`).join('')}</ul>
</div></section>

<section class="blok ince"><div class="ic">
  <div class="aof-serit">
    <div><h2>${programlar.length} AÖF bölümünün ders listesi</h2>
    <p class="blok-alt">Anadolu AÖF, ATA AÖF ve İÜ AUZEF bölümlerinin resmî ders listeleri yarıyıl yarıyıl. Bölümünü bul, derslerini gör, uygulamada o dersten deneme çöz.</p></div>
    <a class="ikincil koyu-dugme" href="${L('aof-bolumleri')}">Bölümünü bul</a>
  </div>
</div></section>

<section class="blok"><div class="ic dar">
  <h2>Sık sorulan sorular</h2>
  ${sssHtml(SSS)}
</div></section>

<section class="son-cta"><div class="ic">
  <h2>Bugünün denemesini çöz.</h2>
  <div class="cta-satir">${indirDugme('alt')}${iosDugme()}</div>
</div></section>`,
}));

// ---------------------------------------------------------------------------------------------
// Sınav sayfaları
for (const s of SINAVLAR) {
  const c = by(s.slug) || {};
  const [kurum, kurumUrl] = kaynak(s.slug);
  const d = durum(s.slug);
  const t = sonrakiTarih(c);
  const toplam = s.yapi ? s.yapi.dersler.reduce((a, [, n]) => a + n, 0) : 0;
  const bolumler = programlar.filter((p) => p.kok === s.slug);
  const altlar = kids(s.slug).filter((k) => !bolumler.some((p) => p.slug === k.slug) && !kids(k.slug).length);
  const ustDuzey = AOF.includes(s.slug) ? [...new Set(bolumler.map((p) => p.duzey).filter(Boolean))] : [];
  const sss = [
    [`${c.name} denemeleri ücretsiz mi?`, 'Uygulamayı ücretsiz indirip denemeleri çözebilirsin; ücretsiz kullanımda reklam gösterilir. İsteğe bağlı Premium reklamları kaldırır ve ortak oturumları açar.'],
    [`${c.name} sınav tarihi ne zaman?`, c.exam_note ? `${c.exam_note} Kesin tarih ve başvuru bilgisi için ${kurum} sitesini esas al.` : `Resmî tarih açıklandığında uygulamada otomatik görünür. Kesin bilgi için ${kurum} sitesini esas al.`],
    ...(s.yapi ? [[`${c.name} denemesi kaç soru, kaç dakika?`, `Uygulamadaki ${c.name} denemesi ${toplam} soru ve ${s.yapi.sure} dakikadır: ${s.yapi.dersler.map(([a, n]) => `${a} ${n}`).join(', ')}.${s.yapi.not ? ' ' + s.yapi.not : ''}`]] : []),
  ];
  yaz(s.url, sayfa({
    yol: s.url,
    title: `${s.baslik} · SınavArena`,
    desc: s.aciklama,
    anahtar: s.kelimeler,
    jsonld: [
      faqLd(sss),
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'SınavArena', item: ALAN + '/' },
        { '@type': 'ListItem', position: 2, name: c.name, item: `${ALAN}/${s.url}/` }] },
    ],
    govde: (L) => `
<section class="sayfa-bas" style="--r:${s.renk}"><div class="ic">
  <nav class="kirinti" aria-label="Konum"><a href="${L('')}">SınavArena</a><span>›</span><span>${esc(c.name)}</span></nav>
  <div class="bas-satir">${rozet(s, 'buyuk')}<div>
    <h1>${esc(s.h1)}</h1>
    <p class="bas-alt">${esc(c.subtitle)} · <span class="durum ${d.cls}">${d.yazi}</span></p>
  </div></div>
</div></section>
<section class="blok"><div class="ic iki-sutun">
  <div class="metin">
    <p class="giris">${esc(s.giris)}</p>
    ${(METIN[s.slug]?.bolumler ?? []).map(([h, ps]) => `<h2>${esc(h)}</h2>${ps.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('')}
    ${t || c.exam_note ? `<div class="tarih-kutu"><p class="kutu-etiket">Sıradaki sınav</p>${t ? `<p class="tarih-buyuk">${tarihYaz(t)} <span class="gun">${kalanGun(t)} gün</span></p>` : ''}${c.exam_note ? `<p>${esc(c.exam_note)}</p>` : ''}</div>` : ''}
    ${s.yapi ? `<h2>${esc(s.yapi.baslik ?? 'Deneme düzeni')}</h2>
    <div class="tablo-kap"><table class="tablo"><thead><tr><th scope="col">Ders</th><th scope="col" class="sayi">Soru</th></tr></thead><tbody>
    ${s.yapi.dersler.map(([a, n]) => `<tr><td>${esc(a)}</td><td class="sayi">${n}</td></tr>`).join('')}
    </tbody><tfoot><tr><th scope="row">Toplam · ${s.yapi.sure} dakika</th><td class="sayi">${toplam}</td></tr></tfoot></table></div>
    ${s.yapi.not ? `<p>${esc(s.yapi.not)}</p>` : ''}` : ''}
    ${altlar.length ? `<h2>Bölümler</h2><ul class="etiketler">${altlar.map((a) => `<li>${esc(a.name)}</li>`).join('')}</ul>` : ''}
    ${bolumler.length ? `<h2>${esc(c.name)} bölümleri ve ders listeleri</h2>
    ${(ustDuzey.length ? ustDuzey : ['']).map((duz) => `${duz ? `<h3>${esc(duz)}</h3>` : ''}<ul class="bolum-liste">${bolumler.filter((p) => !duz || p.duzey === duz).map((p) => `<li><a href="${L(p.url)}">${esc(p.name)}</a><span>${p.dersler.length} ders${p.deneme ? ' · deneme var' : ''}</span></li>`).join('')}</ul>`).join('')}` : ''}
    ${reklam('icerik')}
    <h2>Uygulamada ${esc(c.name)} için neler var?</h2>
    <ul class="tik">
      <li>Gerçek sınav düzeninde süreli denemeler ve serbest çalışma</li>
      <li>İşaretlediğin anda doğru cevap ve açıklama (serbest çalışmada)</li>
      <li>Ders ders sonuç tablosu ve Yanlış Defterim</li>
      <li>Arkadaşlarınla aynı masada ya da tüm Türkiye ile aynı anda çözme</li>
      <li>Sınav tarihine geri sayım</li>
      <li>Android telefonda ve iPhone’da aynı hesapla çalışma</li>
    </ul>
    <h2>Sık sorulan sorular</h2>
    ${sssHtml(sss)}
  </div>
  <aside class="yan">
    <div class="yan-kart">
      <p class="kutu-etiket">${esc(c.name)} denemesi çöz</p>
      <p>${icerikParcalari(s.slug).length ? `${esc(c.name)} için ${listele(icerikParcalari(s.slug))} uygulamada seni bekliyor.${!kokDeneme[s.slug] && !havuz[s.slug] ? ` ${esc(c.name)} düzeninde denemeler de hazırlanıyor.` : ''}` : 'Bu bölüm hazırlanıyor; yayına girince uygulamada görünür.'}</p>
      ${indirDugme(s.slug)}${iosDugme()}
    </div>
    <div class="yan-kart sade">
      <p class="kutu-etiket">Resmî kaynak</p>
      <p><a href="${kurumUrl}" rel="noopener">${esc(kurum)}</a></p>
      <p class="kucuk">SınavArena bu kurumla bağlantılı değildir. Tarih, başvuru ve sonuçlar için resmî siteyi esas al.</p>
    </div>
  </aside>
</div></section>
<section class="blok ince"><div class="ic">
  ${reklam('alt')}
  <h2>Diğer sınavlar</h2>
  <ul class="kartlar">${SINAVLAR.filter((x) => x !== s).slice(0, 6).map((x) => sinavKarti(x, L)).join('')}</ul>
</div></section>`,
  }));
}

// ---------------------------------------------------------------------------------------------
// AÖF bölüm sayfaları: resmî ders listesi yarıyıl yarıyıl (her sayfanın içeriği kendine özgü).
for (const p of programlar) {
  const s = SINAVLAR.find((x) => x.slug === p.kok);
  const kokCat = by(p.kok);
  const [kurum, kurumUrl] = kaynak(p.kok);
  const yariyillar = [...new Set(p.dersler.map((d) => d.yariyil))].sort((a, b) => a - b);
  const kodlar = p.dersler.slice(0, 4).map((d) => d.kod).join(', ');
  const desc = `${kokCat.name} ${p.name}${p.duzey ? ` (${p.duzey})` : ''} bölümünün ${p.dersler.length} dersi yarıyıl yarıyıl: ${p.dersler.slice(0, 3).map((d) => d.ad).join(', ')}… Sınav takvimi ve deneme sınavları.`;
  const sss = [
    [`${kokCat.name} ${p.name} bölümünde hangi dersler var?`, `Resmî müfredatta ${p.dersler.length} ders var${yariyillar.length ? `, ${yariyillar.length} yarıyıla dağılmış` : ''}. Ders listesi bu sayfada yarıyıl yarıyıl yer alıyor.`],
    [`${kokCat.name} sınavı ne zaman?`, kokCat.exam_note ? `${kokCat.exam_note} Kesin bilgi için ${kurum} sitesini esas al.` : `Kesin tarih için ${kurum} sitesini esas al.`],
  ];
  yaz(p.url, sayfa({
    yol: p.url,
    title: `${kokCat.name} ${p.name} Dersleri ve Deneme Sınavı · SınavArena`,
    desc,
    anahtar: [`${kokCat.name.toLowerCase()} ${p.name.toLowerCase()}`, `${p.name.toLowerCase()} dersleri`, `${p.name.toLowerCase()} deneme sınavı`, kodlar.toLowerCase()],
    jsonld: [
      faqLd(sss),
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'SınavArena', item: ALAN + '/' },
        { '@type': 'ListItem', position: 2, name: kokCat.name, item: `${ALAN}/${s.url}/` },
        { '@type': 'ListItem', position: 3, name: p.name, item: `${ALAN}/${p.url}/` }] },
    ],
    govde: (L) => `
<section class="sayfa-bas" style="--r:${s.renk}"><div class="ic">
  <nav class="kirinti" aria-label="Konum"><a href="${L('')}">SınavArena</a><span>›</span><a href="${L(s.url)}">${esc(kokCat.name)}</a><span>›</span><span>${esc(p.name)}</span></nav>
  <div class="bas-satir">${rozet(s, 'buyuk')}<div>
    <h1>${esc(kokCat.name)} ${esc(p.name)} dersleri</h1>
    <p class="bas-alt">${esc([p.duzey, kokCat.subtitle].filter(Boolean).join(' · '))} · ${p.dersler.length} ders${p.deneme ? ` · <span class="durum hazir">${p.deneme} deneme hazır</span>` : ''}</p>
  </div></div>
</div></section>
<section class="blok"><div class="ic iki-sutun">
  <div class="metin">
    <p class="giris">${esc(p.name)} bölümünün resmî müfredatındaki dersler aşağıda yarıyıl yarıyıl. Uygulamada bölümünü seçip dersine dokununca o dersin sınav türleri (ara sınav, dönem sonu, bütünleme, üç ders) ve denemeleri açılır.</p>
    ${kokCat.exam_note ? `<div class="tarih-kutu"><p class="kutu-etiket">Sıradaki sınav</p>${sonrakiTarih(kokCat) ? `<p class="tarih-buyuk">${tarihYaz(kokCat.exam_date)} <span class="gun">${kalanGun(kokCat.exam_date)} gün</span></p>` : ''}<p>${esc(kokCat.exam_note)}</p></div>` : ''}
    ${yariyillar.map((y) => `<h2>${y}. yarıyıl</h2><div class="tablo-kap"><table class="tablo"><thead><tr><th scope="col">Kod</th><th scope="col">Ders</th></tr></thead><tbody>
      ${p.dersler.filter((d) => d.yariyil === y).map((d) => `<tr><td class="kod">${esc(d.kod)}</td><td>${esc(d.ad)}${d.secmeli ? ' <span class="secmeli">Seçmeli</span>' : ''}${cikmis[`${p.slug}|${d.kod}`] ? ` <span class="secmeli cikmis">${cikmis[`${p.slug}|${d.kod}`]} çıkmış sınav</span>` : ''}</td></tr>`).join('')}
    </tbody></table></div>`).join('')}
    ${reklam('icerik')}
    <h2>Sık sorulan sorular</h2>
    ${sssHtml(sss)}
  </div>
  <aside class="yan">
    <div class="yan-kart">
      <p class="kutu-etiket">${esc(p.name)} için deneme çöz</p>
      <p>${p.deneme ? `Bu bölümde ${p.deneme} deneme yayında.` : 'Bu bölümün denemeleri hazırlanıyor. Uygulamada çıkmış soru yükleyerek katkı verebilir, puan kazanabilirsin.'}</p>
      ${indirDugme('bolum')}${iosDugme()}
    </div>
    <div class="yan-kart sade">
      <p class="kutu-etiket">Resmî kaynak</p>
      <p><a href="${kurumUrl}" rel="noopener">${esc(kurum)}</a></p>
      <p class="kucuk">Ders listesi resmî müfredattan alınmıştır; değişiklikler için üniversitenin sitesini esas al.</p>
    </div>
  </aside>
</div></section>
<section class="blok ince"><div class="ic">
  <h2>${esc(kokCat.name)} diğer bölümler</h2>
  <ul class="bolum-liste">${programlar.filter((x) => x.kok === p.kok && x !== p).slice(0, 12).map((x) => `<li><a href="${L(x.url)}">${esc(x.name)}</a><span>${esc(x.duzey || '')}</span></li>`).join('')}</ul>
  <p><a href="${L(s.url)}">Bütün ${esc(kokCat.name)} bölümleri</a></p>
</div></section>`,
  }));
}

// ---------------------------------------------------------------------------------------------
// AÖF bölümleri arama sayfası ve SSS
yaz('aof-bolumleri', sayfa({
  yol: 'aof-bolumleri',
  title: 'AÖF Bölümleri ve Ders Listeleri: Anadolu, ATA, AUZEF · SınavArena',
  desc: `Anadolu AÖF, ATA AÖF ve İÜ AUZEF'in ${programlar.length} bölümünün resmî ders listeleri. Bölümünü ya da dersini ara, derslerini yarıyıl yarıyıl gör.`,
  anahtar: ['aöf bölümleri', 'aöf ders listesi', 'auzef bölümleri', 'ata aöf bölümleri'],
  govde: (L) => `
<section class="sayfa-bas"><div class="ic">
  <nav class="kirinti" aria-label="Konum"><a href="${L('')}">SınavArena</a><span>›</span><span>AÖF bölümleri</span></nav>
  <h1>AÖF bölümleri ve ders listeleri</h1>
  <p class="bas-alt">${programlar.length} bölüm · ${dersler.length.toLocaleString('tr-TR')} ders</p>
</div></section>
<section class="blok"><div class="ic">
  <label class="ara" for="bolum-ara"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M9.5 3a6.5 6.5 0 0 1 5.2 10.4l5.4 5.4-1.4 1.4-5.4-5.4A6.5 6.5 0 1 1 9.5 3Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/></svg>
  <input id="bolum-ara" type="search" placeholder="Bölüm ya da ders ara (ör. halkla ilişkiler, İKT103U)" autocomplete="off"></label>
  <p class="ara-sonuc" id="ara-sonuc" aria-live="polite"></p>
  ${AOF.map((k) => {
    const s = SINAVLAR.find((x) => x.slug === k);
    return `<h2 class="uni-baslik">${rozet(s)} ${esc(by(k).name)}</h2><ul class="bolum-liste aranir">${programlar.filter((p) => p.kok === k).map((p) => `<li data-ara="${esc((p.name + ' ' + p.dersler.map((d) => d.kod + ' ' + d.ad).join(' ')).toLocaleLowerCase('tr'))}"><a href="${L(p.url)}">${esc(p.name)}</a><span>${esc(p.duzey || '')} · ${p.dersler.length} ders</span></li>`).join('')}</ul>`;
  }).join('')}
</div></section>`,
}));

yaz('sss', sayfa({
  yol: 'sss',
  title: 'Sık Sorulan Sorular · SınavArena',
  desc: 'SınavArena hakkında sık sorulan sorular: ücretsiz mi, hangi sınavlar var, denemeler nasıl hazırlanıyor, arkadaşlarla birlikte çözme.',
  jsonld: [faqLd(SSS)],
  govde: (L) => `
<section class="sayfa-bas"><div class="ic">
  <nav class="kirinti" aria-label="Konum"><a href="${L('')}">SınavArena</a><span>›</span><span>Sık sorulan sorular</span></nav>
  <h1>Sık sorulan sorular</h1>
</div></section>
<section class="blok"><div class="ic dar">${sssHtml(SSS)}<div class="yan-kart">${indirDugme('sss')}${iosDugme()}</div></div></section>`,
}));

// ---------------------------------------------------------------------------------------------
// Yazılar (admin panelinden): düz metin gövde; boş satır paragraf, "## " ara başlık, "- " madde.
const govdeHtml = (t) => String(t || '').replace(/\r/g, '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean).map((b) => {
  if (b.startsWith('## ')) return `<h2>${esc(b.slice(3))}</h2>`;
  const satir = b.split('\n');
  if (satir.every((x) => x.startsWith('- '))) return `<ul class="tik">${satir.map((x) => `<li>${esc(x.slice(2))}</li>`).join('')}</ul>`;
  return `<p>${esc(b).replace(/\n/g, '<br>')}</p>`;
}).join('\n');
const yaziKarti = (y, L) => `<li><a href="${L('yazilar/' + y.slug)}"><strong>${esc(y.baslik)}</strong></a><span>${tarihYaz(y.yayin_tarihi)}${y.ozet ? ' · ' + esc(y.ozet) : ''}</span></li>`;
if (YAZILAR.length) {
  yaz('yazilar', sayfa({
    yol: 'yazilar',
    title: 'Sınav Rehberi Yazıları · SınavArena',
    desc: 'Ehliyet, AÖF, Açık Lise, KPSS ve diğer sınavlar için hazırlık rehberleri ve güncel bilgiler.',
    govde: (L) => `
<section class="sayfa-bas"><div class="ic">
  <nav class="kirinti" aria-label="Konum"><a href="${L('')}">SınavArena</a><span>›</span><span>Yazılar</span></nav>
  <h1>Sınav rehberi yazıları</h1>
</div></section>
<section class="blok"><div class="ic dar"><ul class="yazi-liste">${YAZILAR.map((y) => yaziKarti(y, L)).join('')}</ul></div></section>`,
  }));
  for (const y of YAZILAR) {
    const ilgili = SINAVLAR.find((x) => x.slug === y.sinav);
    const yol = 'yazilar/' + y.slug;
    yaz(yol, sayfa({
      yol,
      title: `${y.baslik} · SınavArena`,
      desc: y.ozet || y.baslik,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: y.baslik, description: y.ozet || undefined, datePublished: y.yayin_tarihi, dateModified: y.guncellendi, inLanguage: 'tr', mainEntityOfPage: `${ALAN}/${yol}/`, image: `${ALAN}/img/og.png`, author: { '@type': 'Organization', name: 'SınavArena' }, publisher: { '@type': 'Organization', name: 'SınavArena', logo: { '@type': 'ImageObject', url: `${ALAN}/img/ikon-192.png` } } }],
      govde: (L) => `
<section class="sayfa-bas"${ilgili ? ` style="--r:${ilgili.renk}"` : ''}><div class="ic">
  <nav class="kirinti" aria-label="Konum"><a href="${L('')}">SınavArena</a><span>›</span><a href="${L('yazilar')}">Yazılar</a><span>›</span><span>${esc(y.baslik)}</span></nav>
  <h1>${esc(y.baslik)}</h1>
  <p class="bas-alt">${tarihYaz(y.yayin_tarihi)}</p>
</div></section>
<section class="blok"><div class="ic iki-sutun">
  <article class="metin">
    ${y.ozet ? `<p class="giris">${esc(y.ozet)}</p>` : ''}
    ${govdeHtml(y.govde)}
    ${reklam('icerik')}
  </article>
  <aside class="yan">
    <div class="yan-kart">
      <p class="kutu-etiket">${ilgili ? esc(by(ilgili.slug)?.name ?? ilgili.kisa) + ' denemesi çöz' : 'Deneme çöz'}</p>
      ${ilgili ? `<p><a href="${L(ilgili.url)}">${esc(by(ilgili.slug)?.name ?? ilgili.kisa)} sayfasına git</a></p>` : ''}
      ${indirDugme('yazi')}${iosDugme()}
    </div>
  </aside>
</div></section>
<section class="blok ince"><div class="ic dar">
  <h2>Diğer yazılar</h2>
  <ul class="yazi-liste">${YAZILAR.filter((x) => x !== y).slice(0, 5).map((x) => yaziKarti(x, L)).join('')}</ul>
</div></section>`,
    }));
  }
}

// ---------------------------------------------------------------------------------------------
// Sabit dosyalar
fs.mkdirSync(path.join(OUT, 'img'), { recursive: true });
for (const f of fs.readdirSync(path.join(KOK, 'src/img'))) fs.copyFileSync(path.join(KOK, 'src/img', f), path.join(OUT, 'img', f));
fs.copyFileSync(path.join(KOK, 'src/style.css'), path.join(OUT, 'style.css'));
fs.copyFileSync(path.join(KOK, 'src/site.js'), path.join(OUT, 'site.js'));
if (!ONIZLEME) {
  const yollar = ['', ...SINAVLAR.map((s) => s.url), 'aof-bolumleri', 'sss', ...programlar.map((p) => p.url), ...(YAZILAR.length ? ['yazilar', ...YAZILAR.map((y) => 'yazilar/' + y.slug)] : [])];
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${yollar.map((y) => `  <url><loc>${ALAN}/${y ? y + '/' : ''}</loc><lastmod>${GUNCELLEME}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ALAN}/sitemap.xml\n`);
  fs.writeFileSync(path.join(OUT, '404.html'), sayfa({ yol: '404', title: 'Sayfa bulunamadı · SınavArena', desc: 'Aradığın sayfa bulunamadı.', govde: (L) => `<section class="sayfa-bas"><div class="ic"><h1>Bu sayfa bulunamadı</h1><p class="bas-alt"><a href="/">Ana sayfaya dön</a></p></div></section>` }).replaceAll('../', '/'));
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
  // AdSense satıcı beyanı (admin panelinde yayıncı kimliği girilince).
  if (ADSENSE) fs.writeFileSync(path.join(OUT, 'ads.txt'), `google.com, ${ADSENSE.replace('ca-', '')}, DIRECT, f08c47fec0942fa0
`);
  if (process.argv.includes('--alan')) fs.writeFileSync(path.join(OUT, 'CNAME'), 'sinavarena.tr\n');
}
console.log(`${OUT}: ${2 + SINAVLAR.length + programlar.length + 2 + (YAZILAR.length ? YAZILAR.length + 1 : 0)} sayfa`);
