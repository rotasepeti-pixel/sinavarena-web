# sinavarena.tr

SınavArena'nın tanıtım ve SEO sitesi. Statik HTML, `data/*.json`'dan üretilir.

- `node scripts/veri-cek.js` — Supabase'den (anon anahtar, salt okuma) sınavlar, AÖF dersleri, sayılar, site ayarları ve yazılar
- `node scripts/uret.js` — `site/` klasörünü üretir (`--alan` CNAME ekler, `--onizleme` yerel önizleme)
- Metinler: `scripts/metinler.js`; stil: `src/style.css`
- Duyuru bandı, ana sayfa başlığı, ek SSS, AdSense, App Store bağlantısı ve yazılar admin panelindeki **Web sitesi** bölümünden yönetilir (`site_ayarlari`, `site_yazilar`).
- GitHub Actions 2 saatte bir yeniden üretip yayınlar (`.github/workflows/yayinla.yml`).
