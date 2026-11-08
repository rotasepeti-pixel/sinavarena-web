// AÖF bölümleri sayfasında bölüm / ders araması (Türkçe büyük-küçük harfe duyarsız).
(function () {
  var input = document.getElementById('bolum-ara');
  if (!input) return;
  var satirlar = Array.prototype.slice.call(document.querySelectorAll('.aranir li'));
  var sonuc = document.getElementById('ara-sonuc');
  input.addEventListener('input', function () {
    var q = input.value.trim().toLocaleLowerCase('tr');
    var n = 0;
    satirlar.forEach(function (li) {
      var uygun = !q || li.getAttribute('data-ara').indexOf(q) !== -1;
      li.hidden = !uygun;
      if (uygun) n++;
    });
    document.querySelectorAll('.aranir').forEach(function (ul) {
      var bos = !ul.querySelector('li:not([hidden])');
      ul.hidden = bos;
      ul.previousElementSibling.hidden = bos;
    });
    sonuc.textContent = q ? (n ? n + ' bölüm bulundu' : 'Sonuç yok. Ders kodunu ya da bölüm adını farklı yazmayı dene.') : '';
  });
})();

// Üst menü: bir grup açılınca diğerleri kapanır; dışarı tıklayınca ya da Esc'e basınca hepsi kapanır.
(function () {
  var gruplar = Array.prototype.slice.call(document.querySelectorAll('.acilir, .mobil-menu'));
  gruplar.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) gruplar.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
  document.addEventListener('click', function (e) {
    gruplar.forEach(function (d) { if (d.open && !d.contains(e.target)) d.open = false; });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') gruplar.forEach(function (d) { d.open = false; });
  });
})();
