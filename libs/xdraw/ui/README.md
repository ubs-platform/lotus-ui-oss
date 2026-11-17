# xdraw-ui (`@lotus/xdraw/ui`)

xdraw'ın Angular UI katmanı: çizim sayfası (`CanvasDrawComponent`), sidebar, paneller ve diyaloglar.

- `XDrawAppShellComponent` + `provideXDrawApp()`: web (`apps/xdraw`) ve mobil (`apps/xdraw-mobile`) kabuklarının ortak kök bileşeni ve provider'ları. Kabuk sadece `APP_NATIVE_CONTROLLER_TOKEN` ve gerekirse ek çeviri dosyalarını sağlar.
- `APP_NATIVE_CONTROLLER_TOKEN` / `IAppNativeController`: dosya aç/kaydet/paylaş gibi platforma özgü işlemlerin sözleşmesi. Web uygulaması `apps/xdraw` kendi implementasyonunu sağlar; mobil/Electron kabukları kendi implementasyonlarını sağlayabilir.
- `provideXDrawNotifier()`: `@lotus/xdraw/core` uyarılarını lotus-web toast'u ve çeviri deposu üzerinden gösterir.

Bilinen sorunlar: [../KNOWN-ISSUES.md](../KNOWN-ISSUES.md)
