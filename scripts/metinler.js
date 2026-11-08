// Sınav sayfalarının SEO metinleri ve menüdeki kısa açıklamalar. Yalnızca genel kabul görmüş,
// resmî kılavuzlarda yer alan bilgiler yazılır; değişebilecek ayrıntılar (ücret, tarih, kural) için
// okur resmî kaynağa yönlendirilir. Sayfada her bölüm <h2> + paragraflar olarak çıkar.
module.exports = {
  ehliyet: {
    menu: 'Çıkmış sorular ve e-Sınav düzeninde denemeler',
    bolumler: [
      ['Ehliyet sınavı nasıl yapılır?', [
        'Sürücü belgesi için önce sürücü kursunda teorik ve uygulamalı eğitim alınır, ardından teorik (yazılı) sınava girilir. Teorik sınav Millî Eğitim Bakanlığı Ölçme, Değerlendirme ve Sınav Hizmetleri Genel Müdürlüğü tarafından e-Sınav merkezlerinde, bilgisayar başında yapılır. Sınav randevusunu adayın kayıtlı olduğu sürücü kursu alır.',
        'Teorik sınav 50 sorudan oluşur ve 45 dakika sürer. Sorular trafik ve çevre bilgisi, ilk yardım bilgisi, motor ve araç tekniği ile trafik adabı konularından gelir. Sınavı geçmek için 100 üzerinden en az 70 puan gerekir. Teorik sınavı geçen aday direksiyon (uygulama) sınavına girer.',
      ]],
      ['Hangi konulardan kaç soru çıkar?', [
        'SınavArena denemelerinde dağılım şöyledir: Trafik ve Çevre 23, İlk Yardım 12, Motor ve Araç Tekniği 9, Trafik Adabı 6 soru. En çok soru trafik işaretleri, geçiş üstünlüğü, kavşaklar, hız sınırları ve park kurallarını kapsayan trafik bölümünden gelir. İlk yardımda temel yaşam desteği, kanamalar, kırıklar ve yanıklar; araç tekniğinde motorun parçaları, gösterge paneli uyarıları ve bakım konuları öne çıkar.',
      ]],
      ['Ehliyet sınavına nasıl çalışılır?', [
        'En etkili yöntem gerçek sınav düzeninde, süre tutarak deneme çözmektir. Her denemeden sonra yanlış yaptığın soruların açıklamalarını oku; özellikle trafik işaretlerini ve ilk yardım sıralamalarını tekrar et. Sınavdan önceki günlerde her gün en az bir tam deneme çözmek, 45 dakikayı rahat kullanmanı sağlar.',
        'SınavArena\'da yanlış yaptığın her soru Yanlış Defterim\'e düşer; defteri tekrar çözdükçe doğru bildiklerin defterden çıkar. Serbest çalışma modunda işaretlediğin anda doğru cevabı görürsün. Sınav günü yaklaştığında tarihini ekleyip ana ekranda geri sayımı takip edebilirsin. Uygulama Android ve iOS için; telefonun hangisi olursa olsun aynı hesapla çalışırsın.',
      ]],
    ],
  },
  'anadolu-aof': {
    menu: 'AÖF çıkmış sorular, 49 bölümün ders listesi',
    bolumler: [
      ['Anadolu AÖF sınav sistemi', [
        'Anadolu Üniversitesi Açıköğretim Fakültesi, İktisat Fakültesi ve İşletme Fakültesi\'nin uzaktan eğitim programlarında her dönem ara sınav ve dönem sonu sınavı yapılır. Dönem sonunda başarısız olunan dersler için bütünleme sınavı, mezuniyetine az ders kalan öğrenciler için üç ders sınavı düzenlenir. Yaz okulu da ayrı bir sınav dönemi olarak yapılır.',
        'Sınavlar çoktan seçmelidir ve öğrencinin sınav giriş belgesinde yazan oturumda yapılır. Başarı notu ara sınav ve dönem sonu notlarının ağırlıklı ortalamasıyla hesaplanır. Ağırlıklar, geçme notu ve sınav kuralları için Anadolu Üniversitesi\'nin yönetmeliği ve duyuruları esas alınır.',
      ]],
      ['Anadolu AÖF\'e nasıl çalışılır?', [
        'Açıköğretimde her dersin konuları ünite ünite ilerler; ara sınav genellikle dönemin ilk yarısındaki ünitelerden, dönem sonu sınavı ise bütün ünitelerden sorumludur. Önce dersin ünite özetlerini oku, sonra o ünitelerden soru çöz. Aynı dönemde birden çok dersin sınavına gireceğin için her güne birkaç ders dağıtmak, sınav haftasındaki yükü azaltır.',
        'SınavArena\'da bölümünü ve dersini seçip ara sınav ve dönem sonu konularından karma deneme çözebilirsin. Her deneme 20 soru ve 30 dakikadır. Aşağıdaki listeden bölümünü açınca resmî müfredattaki bütün derslerini yarıyıl yarıyıl görürsün.',
      ]],
    ],
  },
  'ata-aof': {
    menu: 'Çıkmış sorular, 22 bölümün ders listesi',
    bolumler: [
      ['ATA AÖF sınav sistemi', [
        'Atatürk Üniversitesi Açıköğretim Fakültesi\'nde her dönem ara sınav (vize) ve dönem sonu sınavı (final) yapılır; başarısız olunan dersler için bütünleme sınavı düzenlenir. Mezuniyetine az ders kalan öğrenciler için ek sınav hakları üniversitenin duyurularıyla açıklanır.',
        'Sınav tarihleri, oturum saatleri ve sınav yerleri öğrencinin sınav giriş belgesinde yer alır. Not hesaplama ve geçme kuralları için Atatürk Üniversitesi Açıköğretim Fakültesi\'nin yönetmeliği esas alınır.',
      ]],
      ['ATA AÖF\'e nasıl hazırlanılır?', [
        'Her dersin ünitelerini sınav takvimine göre bölüp düzenli tekrar yapmak, sınav haftasında konuların birikmesini önler. Ara sınavdan önce ilk ünitelere, finalden önce bütün ünitelere ağırlık ver. SınavArena\'da bölümünü seçip sınav türüne göre deneme çözebilir, yanlışlarını Yanlış Defterim\'de toplayabilirsin.',
      ]],
    ],
  },
  auzef: {
    menu: 'Çıkmış sorular ve bölüm ders listeleri',
    bolumler: [
      ['İÜ AUZEF sınav sistemi', [
        'İstanbul Üniversitesi Açık ve Uzaktan Eğitim Fakültesi (AUZEF) ön lisans, lisans ve lisans tamamlama programlarında her dönem ara sınav ve final sınavı yapar; başarısız olunan dersler için bütünleme sınavı düzenlenir.',
        'Sınav tarihleri ve oturum bilgileri AUZEF\'in duyurularıyla açıklanır; not hesaplama ve geçme kuralları için üniversitenin yönetmeliği esas alınır.',
      ]],
      ['AUZEF sınavlarına nasıl çalışılır?', [
        'Ders videolarını ve ders notlarını haftalık takip edip her haftanın sonunda o konudan soru çözmek, dönem sonunda tekrar yükünü azaltır. SınavArena\'da bölümünü seçip dersinin ara sınav ve final denemelerini çözebilirsin.',
      ]],
    ],
  },
  aol: {
    menu: 'Çıkmış sorulardan tarihli denemeler',
    bolumler: [
      ['Açık Lise sınavları nasıl yapılır?', [
        'Millî Eğitim Bakanlığı Açık Öğretim Lisesi (AÖL), Mesleki Açık Öğretim Lisesi (MAÖL) ve Açık Öğretim İmam Hatip Lisesi (AİHL) öğrencileri her dönem seçtikleri derslerin sınavlarına girer. Sınavlar yazılı (kâğıt üzerinde) ya da elektronik ortamda e-Sınav olarak yapılabilir.',
        'Dönem tarihleri, ders seçimi ve sınav giriş belgesi aol.meb.gov.tr üzerinden duyurulur. Her dönemin kesin tarihleri ve sınav kuralları için bu adresi esas al.',
      ]],
      ['Açık Lise sınavına nasıl hazırlanılır?', [
        'Açık Lise sınavlarında soruların büyük kısmı ders kitaplarının ünitelerinden gelir. MEB\'in yayımladığı geçmiş dönem soru kitapçıklarını çözmek, soru tarzına alışmanın en iyi yoludur. SınavArena\'daki Açık Lise denemeleri bu kitapçıklardan hazırlanır; her kitapçık kendi tarihli denemesi olarak çözülür ve sonunda doğru, yanlış ve boşlarını görürsün.',
      ]],
    ],
  },
  iokbs: {
    menu: 'Çıkmış sorular, 5-8. sınıf ve lise',
    bolumler: [
      ['Bursluluk sınavı (İOKBS) nedir?', [
        'İlköğretim ve Ortaöğretim Kurumları Bursluluk Sınavı (İOKBS), Millî Eğitim Bakanlığı\'nın maddi imkânı kısıtlı başarılı öğrencilere burs vermek için yaptığı merkezî sınavdır. Sınava 5, 6, 7 ve 8. sınıf ile lise (9, 10 ve 11. sınıf) öğrencileri katılabilir.',
        'Sınav Türkçe, matematik, fen bilimleri ve sosyal bilgiler alanlarından sorulardan oluşur. Başvuru şartları, sınav tarihi ve kitapçık yapısı her yıl MEB\'in yayımladığı e-kılavuzda açıklanır; kesin bilgi için odsgm.meb.gov.tr esas alınır.',
      ]],
      ['Bursluluk sınavına nasıl çalışılır?', [
        'Sınıf düzeyindeki konuları tekrar edip geçmiş yılların kitapçıklarını süre tutarak çözmek en etkili hazırlıktır. SınavArena\'da sınıfını seçip geçmiş yıl kitapçıklarından hazırlanan denemeleri çözebilir, sonunda ders ders sonucunu görebilirsin.',
      ]],
    ],
  },
  ogg: {
    menu: 'Çıkmış sorulardan denemeler',
    bolumler: [
      ['Özel güvenlik sınavı nedir?', [
        'Özel güvenlik görevlisi olmak için özel güvenlik temel eğitimini tamamlayıp Emniyet Genel Müdürlüğü\'nün düzenlediği yazılı sınavda başarılı olmak gerekir. Kimlik kartının süresi dolan görevliler için yenileme eğitimi ve sınavı da yapılır. Sınavlar yılda birkaç dönem düzenlenir; dönem takvimi egm.gov.tr/ozelguvenlik adresinde yayımlanır.',
        'Sorular özel güvenlik mevzuatı, kişisel korunma ve güvenlik teknikleri, ilk yardım, iletişim, silah bilgisi ve atış gibi temel eğitim konularından gelir.',
      ]],
      ['Özel güvenlik sınavına nasıl hazırlanılır?', [
        'Geçmiş dönem soru kitapçıklarını çözmek, sık sorulan konuları görmenin en kısa yoludur. SınavArena\'daki özel güvenlik denemeleri EGM\'nin yayımladığı geçmiş dönem kitapçıklarına dayanır; her dönemi ayrı deneme olarak çözüp yanlışlarını Yanlış Defterim\'de tekrar edebilirsin.',
      ]],
    ],
  },
  kpss: {
    menu: 'KPSS çıkmış sorular, GY-GK',
    bolumler: [
      ['KPSS nedir?', [
        'Kamu Personel Seçme Sınavı (KPSS), kamu kurumlarına personel alımında kullanılan ve ÖSYM tarafından yapılan sınavdır. Lisans, ön lisans ve ortaöğretim mezunları için ayrı oturumlarda yapılır. Bütün düzeylerde Genel Yetenek ve Genel Kültür testi vardır; lisans düzeyinde öğretmen adayları için Eğitim Bilimleri, bazı kadrolar için Alan Bilgisi testleri de yapılır.',
        'Genel Yetenek bölümünde Türkçe ve matematik, Genel Kültür bölümünde tarih, coğrafya, vatandaşlık ve güncel bilgiler soruları yer alır. Sınav tarihleri, başvurular ve puan türleri için ÖSYM\'nin kılavuzu esas alınır.',
      ]],
      ['KPSS\'ye nasıl çalışılır?', [
        'KPSS uzun soluklu bir hazırlık ister. Konu çalışmasını düzenli deneme çözümüyle desteklemek, hem hızını hem de hangi derste eksik olduğunu görmeni sağlar. SınavArena\'da geçmiş yılların resmî KPSS kitapçıklarını açıp çözebilirsin; KPSS düzeninde denemeler de hazırlanıyor; yayına girdiğinde Genel Yetenek - Genel Kültür düzeninde 120 soruluk, 130 dakikalık denemeler uygulamada görünecek.',
      ]],
    ],
  },
  yks: {
    menu: 'TYT, AYT, YDT çıkmış sorular',
    bolumler: [
      ['YKS nedir?', [
        'Yükseköğretim Kurumları Sınavı (YKS), üniversiteye girişte kullanılan ve ÖSYM tarafından yapılan sınavdır. Üç oturumdan oluşur: Temel Yeterlilik Testi (TYT), Alan Yeterlilik Testleri (AYT) ve Yabancı Dil Testi (YDT).',
        'TYT 120 soru ve 165 dakika, AYT 160 soru ve 180 dakika, YDT 80 soru ve 180 dakikadır. Hangi oturumlara girileceği tercih edilecek programın puan türüne göre değişir. Kesin bilgi için ÖSYM\'nin YKS kılavuzu esas alınır.',
      ]],
      ['YKS\'ye nasıl hazırlanılır?', [
        'TYT\'de hız, AYT\'de konu derinliği belirleyicidir. Düzenli deneme çözüp her denemeden sonra yanlışlarını analiz etmek, hazırlığın en önemli parçasıdır. SınavArena\'da geçmiş yılların resmî YKS kitapçıklarını açıp çözebilirsin; YKS düzeninde denemeler de hazırlanıyor.',
      ]],
    ],
  },
  lgs: {
    menu: 'LGS çıkmış sorular',
    bolumler: [
      ['LGS nedir?', [
        'Liselere Geçiş Sistemi (LGS) kapsamındaki merkezî sınav, 8. sınıf öğrencilerinin sınavla öğrenci alan liselere yerleşmesi için Millî Eğitim Bakanlığı tarafından yapılır. Sınav sözel ve sayısal olmak üzere iki oturumdur.',
        'Sözel oturumda Türkçe, T.C. İnkılap Tarihi ve Atatürkçülük, Din Kültürü ve Ahlak Bilgisi ile yabancı dil; sayısal oturumda matematik ve fen bilimleri soruları yer alır. Kesin bilgi için MEB\'in yayımladığı e-kılavuz esas alınır.',
      ]],
      ['LGS\'ye nasıl çalışılır?', [
        'LGS soruları okuduğunu anlama ve yorumlama becerisini ölçer. Bol paragraf okumak, süre tutarak deneme çözmek ve yanlışları düzenli tekrar etmek en etkili yöntemdir. SınavArena\'da geçmiş yılların resmî LGS kitapçıklarını açıp çözebilirsin; LGS düzeninde denemeler de hazırlanıyor.',
      ]],
    ],
  },
  ales: {
    menu: 'ALES çıkmış sorular',
    bolumler: [
      ['ALES nedir?', [
        'Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı (ALES), yüksek lisans ve doktora programlarına başvuruda ve akademik kadrolara atamada kullanılan, ÖSYM tarafından yapılan sınavdır. Sayısal ve sözel testlerden oluşur; puanlar sayısal, sözel ve eşit ağırlık türlerinde hesaplanır.',
        'Sınav tarihleri, başvurular ve puanların geçerlilik süresi için ÖSYM\'nin ALES kılavuzu esas alınır.',
      ]],
      ['ALES\'e nasıl hazırlanılır?', [
        'ALES\'te mantık ve problem çözme ağırlıklıdır; düzenli soru çözümü ve süre yönetimi belirleyicidir. SınavArena\'da geçmiş yılların resmî ALES kitapçıklarını açıp çözebilirsin; ALES düzeninde denemeler de hazırlanıyor.',
      ]],
    ],
  },
  dgs: {
    menu: 'DGS çıkmış sorular',
    bolumler: [
      ['DGS nedir?', [
        'Dikey Geçiş Sınavı (DGS), ön lisans mezunlarının lisans programlarına geçişi için ÖSYM tarafından yapılan sınavdır. Sınav sayısal ve sözel bölümlerden oluşur. Kesin bilgi için ÖSYM\'nin DGS kılavuzu esas alınır.',
      ]],
      ['DGS\'ye nasıl çalışılır?', [
        'DGS\'de matematik ve geometri ile sözel mantık ve Türkçe soruları vardır. Süre tutarak deneme çözmek ve konu eksiklerini düzenli kapatmak en etkili yöntemdir. SınavArena\'da geçmiş yılların resmî DGS kitapçıklarını açıp çözebilirsin; DGS düzeninde denemeler de hazırlanıyor; yayına girdiğinde 100 soruluk, 150 dakikalık denemeler uygulamada görünecek.',
      ]],
    ],
  },
  yds: {
    menu: 'YDS çıkmış sorular',
    bolumler: [
      ['YDS ve YÖKDİL nedir?', [
        'Yabancı Dil Bilgisi Seviye Tespit Sınavı (YDS) ve Yükseköğretim Kurumları Yabancı Dil Sınavı (YÖKDİL), ÖSYM tarafından yapılan yabancı dil sınavlarıdır. YDS 80 soru ve 180 dakikadır; YÖKDİL sağlık, sosyal ve fen bilimleri alanlarında ayrı yapılır. Kesin bilgi için ÖSYM\'nin kılavuzları esas alınır.',
      ]],
      ['YDS\'ye nasıl hazırlanılır?', [
        'Kelime bilgisi, dil bilgisi ve okuduğunu anlama soruları ağırlıktadır. Her gün düzenli kelime çalışması ve süre tutarak deneme çözmek etkili olur. SınavArena\'da geçmiş yılların resmî YDS / YÖKDİL kitapçıklarını açıp çözebilirsin; YDS / YÖKDİL düzeninde denemeler de hazırlanıyor.',
      ]],
    ],
  },
  msu: {
    menu: 'MSÜ çıkmış sorular',
    bolumler: [
      ['MSÜ sınavı nedir?', [
        'Millî Savunma Üniversitesi Askerî Öğrenci Aday Belirleme Sınavı, harp okulları ve astsubay meslek yüksekokullarına öğrenci adayı belirlemek için ÖSYM tarafından yapılır. Sınav Türkçe, sosyal bilimler, temel matematik ve fen bilimleri testlerinden oluşur.',
        'Başvuru şartları, sınav tarihi ve sonraki seçim aşamaları için ÖSYM\'nin ve Millî Savunma Üniversitesi\'nin kılavuzları esas alınır.',
      ]],
      ['MSÜ\'ye nasıl çalışılır?', [
        'MSÜ soruları TYT konularına benzer; düzenli deneme çözümü ve süre yönetimi önemlidir. SınavArena\'da geçmiş yılların resmî MSÜ kitapçıklarını açıp çözebilirsin; MSÜ düzeninde denemeler de hazırlanıyor; yayına girdiğinde 120 soruluk, 165 dakikalık denemeler uygulamada görünecek.',
      ]],
    ],
  },
};
