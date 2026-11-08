// Sitenin verisini uygulamanın veritabanından (yalnızca okuma, anon anahtar) çeker: sınav kategorileri,
// AÖF bölümlerinin resmî ders listeleri, yayındaki online denemeler ve derslerin çıkmış sınav sayıları.
// Kullanım: node scripts/veri-cek.js  → data/*.json (site bu dosyalardan üretilir: node scripts/uret.js)
const fs = require('fs');
const path = require('path');

// GitHub Actions'ta ortam değişkenlerinden (depo sırları), yerelde uygulamanın .env dosyasından.
const envDosya = path.join(__dirname, '../../sinav-arena/.env');
const env = process.env.EXPO_PUBLIC_SUPABASE_URL ? process.env : Object.fromEntries(
  fs.readFileSync(envDosya, 'utf8').split(/\r?\n/).filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()])
);
const URL = env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const out = (f, d) => fs.writeFileSync(path.join(__dirname, '../data', f), JSON.stringify(d, null, 1));

async function rest(q, range) {
  const r = await fetch(`${URL}/rest/v1/${q}`, { headers: range ? { ...H, Range: range } : H });
  const d = await r.json();
  if (!Array.isArray(d)) throw new Error(q + ': ' + JSON.stringify(d));
  return d;
}
async function hepsi(q) {
  const all = [];
  for (let i = 0; ; i += 1000) {
    const d = await rest(q, `${i}-${i + 999}`);
    all.push(...d);
    if (d.length < 1000) return all;
  }
}

(async () => {
  const cats = await hepsi('exam_categories?select=slug,name,subtitle,parent,exam_date,exam_note,grup,aof_tur,ders_kod,sort_order&order=sort_order');
  out('kategoriler.json', cats);
  out('dersler.json', await hepsi('aof_dersler?select=program,kod,ad,yariyil,secmeli,sira&order=program,sira'));
  out('denemeler.json', await hepsi('exams?select=category&is_online=eq.true&is_published=eq.true'));
  // Bölümlerin ders başına çıkmış sınav sayısı (uygulamadaki "Dersini seç" listesiyle aynı kaynak).
  const kids = (s) => cats.filter((c) => c.parent === s);
  const programlar = cats.filter((c) => !c.aof_tur && !c.ders_kod && kids(c.slug).length && kids(c.slug).every((k) => k.aof_tur));
  const cikmis = {};
  for (const p of programlar) {
    const r = await fetch(`${URL}/rest/v1/rpc/program_dersleri`, { method: 'POST', headers: H, body: JSON.stringify({ p_program: p.slug }) });
    const d = await r.json();
    if (Array.isArray(d)) for (const x of d) if (Number(x.cikmis) > 0) cikmis[`${p.slug}|${x.kod}`] = Number(x.cikmis);
  }
  out('cikmis.json', cikmis);
  // Soru havuzu (uygulamadaki "… soruluk havuz") ve resmî çıkmış sınav kitapçıkları, kök sınav başına.
  const havuz = {};
  const havuzKategori = ['ehliyet', 'aol', 'ogg', ...cats.filter((c) => c.parent === 'iokbs').map((c) => c.slug)];
  // Büyük havuzlarda sorgu zaman aşımına uğrayabilir: 3 kez denenir, olmazsa önceki sayı korunur
  // (sitede sayı hiçbir zaman sıfıra düşmez).
  let onceki = {};
  try { onceki = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sayilar.json'), 'utf8')).havuz ?? {}; } catch {}
  const hatali = new Set();
  for (const c of havuzKategori) {
    const kok = c.split('-')[0];
    let toplam = null;
    for (let deneme = 0; deneme < 3 && toplam == null; deneme++) {
      const r = await fetch(`${URL}/rest/v1/rpc/online_hub`, { method: 'POST', headers: H, body: JSON.stringify({ p_category: c }) });
      const j = await r.json().catch(() => null);
      if (j?.pool?.total != null && Number(j.pool.total) > 0) toplam = Number(j.pool.total);
    }
    if (toplam == null) hatali.add(kok);
    else havuz[kok] = (havuz[kok] || 0) + toplam;
  }
  for (const k of hatali) havuz[k] = Math.max(havuz[k] || 0, onceki[k] || 0);
  const kitapcik = {};
  for (const x of await hepsi('past_exams?select=category&is_published=eq.true')) {
    const kok = x.category.split('-')[0];
    kitapcik[kok] = (kitapcik[kok] || 0) + 1;
  }
  out('sayilar.json', { havuz, kitapcik });
  // Admin panelindeki "Web sitesi" bölümü (supabase/web_sitesi.sql).
  out('site-ayarlari.json', (await rest('site_ayarlari?select=*&id=eq.1'))[0] ?? {});
  out('yazilar.json', await hepsi('site_yazilar?select=slug,baslik,ozet,govde,sinav,yayin_tarihi,guncellendi&yayinda=eq.true&order=yayin_tarihi.desc'));
  console.log('havuz', havuz, 'kitapçık', kitapcik);
  console.log('kategori', cats.length, 'program', programlar.length, 'çıkmışlı ders', Object.keys(cikmis).length);
})();
