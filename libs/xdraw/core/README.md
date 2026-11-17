# xdraw-core (`@lotus/xdraw/core`)

xdraw çizim motorunun UI'dan bağımsız çekirdeği: veri modeli, katmanlar, undo/redo, araçlar (kalem, silgi, şekil, doldurma, seçim, taşıma), canvas render'ı, content-buffer web worker'ı, binary codec ve ayarlar.

- Reaktif durum Angular signals ile tutulur (`XDrawDataHolder`, `XDrawSettingsConfig`). Ayarlar `providedIn: 'root'` bir servistir ve `localStorage`'a `effect()` ile yazılır.
- Core toast/çeviri bilmez; uyarılar `setXDrawNotifier()` ile UI katmanının kaydettiği notifier'a iletilir (varsayılan: `console.warn`).
- Mimari notlar: [CONTENT-BUFFER-ARCHITECTURE.md](./CONTENT-BUFFER-ARCHITECTURE.md), [TOOL-HOST-REFACTOR-PLAN.md](./TOOL-HOST-REFACTOR-PLAN.md).

Bilinen sorunlar: [../KNOWN-ISSUES.md](../KNOWN-ISSUES.md)

## Test

```bash
npx nx test xdraw-core
```
