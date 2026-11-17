# xdraw — Bilinen sorunlar

lotus-neo'dan Angular'a taşıma sonrası doğrulamada (Faz 4) bulunan sorunlar. Hepsi lotus-neo sürümünde de aynen vardı; taşımadan kaynaklanmıyor.

## 1. Kalem modunda iki parmakla pinch küçük bir çizgi bırakıyor

- **Nerede:** `libs/xdraw/ui/src/lib/canvas-draw/canvas-draw.component.ts` → `onPointerDown`
- **Neden:** İlk parmak `pointerdown` olduğunda çizim hemen başlıyor (`drawTools.startInteraction`). İkinci parmak geldiğinde seçim ve şekil etkileşimleri iptal ediliyor (`cancelSelectionInteraction`, `cancelShapeInteraction`), başlamış olan kalem çizgisi ise iptal edilmiyor.
- **Tekrar:** Kalem aracı → iki parmakla yakınlaştır → bırak → çizimde 1 öğe fazla.
- **Öneri:** İkinci pointer geldiğinde aktif kalem çizgisini geri almak, ya da dokunmatikte çizimi kısa bir gecikmeyle başlatmak.

## 2. Metin modunda pinch, parmaklar kalkınca metin girişi açıyor

- **Nerede:** `onPointerUp` → `drawTools.finishInteraction` (metin aracı `promptForTextAt` çağırıyor)
- **Neden:** Pinch'te son parmak kalktığında etkileşim normal bir tıklama gibi tamamlanıyor.
- **Öneri:** Etkileşim sırasında iki pointer görüldüyse `finishInteraction`'ı iptal moduyla çağırmak.

## 3. Renk saydamlığı ("A" kaydırıcısı) çizime yansımıyor

- **Nerede:** `libs/xdraw/core/src/rendering/canvas-element-painter.ts` → `ColorUtils.regularizeToHexColor(...)`
- **Neden:** Renderer rengi hex'e çevirirken alfayı atıyor. Öğeler `rgba(r, g, b, a)` olarak kaydediliyor ama `a` hiç kullanılmıyor.
- **Not:** lotus-neo'da üretilmiş dosyalarda renkler `rgba(..., 0)` olarak kayıtlı (eski `readNumber` hatası yüzünden alfa 0 okunuyordu). Alfa desteği eklenirse bu çizgiler görünmez olur; yükleme sırasında `a = 0` olanları `1`'e çeviren bir göç (migration) gerekir.

## 4. Canvas devicePixelRatio ile ölçeklenmiyor

- **Nerede:** `canvas-draw.component.ts` → `syncCanvasViewportSize` (`canvas.width = rect.width`)
- **Etkisi:** Yüksek DPI ekranlarda (telefon/tablet) çizgiler hafif bulanık görünebilir.
- **Öneri:** `canvas.width = rect.width * devicePixelRatio` ve rasterizer tarafında aynı ölçek. Content-buffer boyutları ve performans da birlikte ele alınmalı.

## 5. IndexedDB `versionchange` / `blocked` olayları ele alınmıyor

- **Nerede:** `libs/xdraw/core/src/persistence/idb-store.ts`
- **Etkisi:** Başka bir sekme veritabanı bağlantısını açık tutarken DB silme veya şema yükseltmesi bekletilirse, sonraki tüm açılışlar (autosave yazımı dahil) süresiz bekler. Yükleme göstergesi de kapanmaz.
- **Öneri:** `onversionchange` olayında bağlantıyı kapatmak; `blocked` durumunda zaman aşımı ya da kullanıcıya uyarı.

## 6. Kırmızı birim testi

- **Test:** `libs/xdraw/core/src/xdraw-core.spec.ts` → "selection drag includes partial overlaps and move mode translates the selection once"
- **Durum:** Seçim dışında kalan öğe de taşınıyor (beklenen `[70, 70]`, gelen `[80, 80]`). `npx nx test xdraw-core` bu yüzden başarısız.
