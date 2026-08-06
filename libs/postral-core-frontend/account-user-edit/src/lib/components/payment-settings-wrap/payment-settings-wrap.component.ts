import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarItem } from '@lotus/front-global/sidebar';
import { fromMaterialSymbol } from 'libs/front-global/icon-type/src/lib/icon-type';
import { of } from 'rxjs';

export type PaymentMode = 'seller' | 'customer';

// Müşteri modunda görünür olan path'lar
const CUSTOMER_VISIBLE_PATHS = new Set([
  'address',
  'account',
  'payment/history',
  'refund/requests',
  'invoice/history',
]);

// Müşteri modunda görünür olan kategori başlıkları
const CUSTOMER_VISIBLE_CATEGORIES = new Set(['Genel', 'Ödeme kayıtları']);

@Component({
  selector: 'lib-payment-settings-wrap',
  standalone: false,
  templateUrl: './payment-settings-wrap.component.html',
  styleUrls: ['./payment-settings-wrap.component.scss'],
})
export class PaymentSettingsWrapComponent {
  currentMenu = signal<string>('');
  paymentMode: PaymentMode = 'seller';
  menuItems: SidebarItem[] = [];

  private readonly allMenuItems: SidebarItem[] = [
    {
      title: 'Genel',
      type: 'category',
      path: '',
      hidden: of(false),
      icon: fromMaterialSymbol('settings'),
    },
    {
      title: 'Adresler',
      path: 'address',
      hidden: of(false),
      icon: fromMaterialSymbol('location_on'),
    },
    {
      title: 'Hesaplar',
      path: 'account',
      hidden: of(false),
      icon: fromMaterialSymbol('info'),
    },
    {
      title: 'Vergiler',
      path: 'tax',
      hidden: of(false),
      icon: fromMaterialSymbol('sell'),
    },
    {
      title: 'Ürünler',
      path: 'item',
      hidden: of(false),
      icon: fromMaterialSymbol('inventory_2'),
    },
    {
      title: 'Ödeme kayıtları',
      type: 'category',
      path: '',
      hidden: of(false),
      icon: fromMaterialSymbol('settings'),
    },
    {
      title: 'Ödeme geçmişi',
      path: 'payment/history',
      hidden: of(false),
      icon: fromMaterialSymbol('history'),
    },
    {
      title: 'Satıcı siparişleri',
      path: 'transaction/history',
      hidden: of(false),
      icon: fromMaterialSymbol('history'),
    },
    {
      title: 'İade talepleri',
      path: 'refund/requests',
      hidden: of(false),
      icon: fromMaterialSymbol('history'),
    },
    {
      title: 'İade detayı',
      path: 'refund/:id',
      hidden: of(true),
      icon: fromMaterialSymbol('history'),
    },
    {
      title: 'Faturalar',
      path: 'invoice/history',
      hidden: of(false),
      icon: fromMaterialSymbol('description'),
    },
    {
      title: 'Raporlar',
      type: 'category',
      path: '',
      hidden: of(false),
      icon: fromMaterialSymbol('settings'),
    },
    {
      title: 'Rapor sorguları',
      path: 'report-query',
      hidden: of(false),
      icon: fromMaterialSymbol('search'),
    },
    {
      title: 'Tüm Raporlar',
      path: 'reports',
      hidden: of(false),
      icon: fromMaterialSymbol('show_chart'),
    },
    {
      title: 'Entegrasyonlar',
      type: 'category',
      path: '',
      hidden: of(false),
      icon: fromMaterialSymbol('settings'),
    },
    {
      title: 'Webhook',
      path: 'webhook',
      hidden: of(false),
      icon: fromMaterialSymbol('send'),
    },
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // tüm url segmentleri birleştirilerek tam path elde ediliyor (örn: 'refund/requests')
    const segments = this.activatedRoute.snapshot.firstChild?.url;
    const currentPath = segments?.map((s) => s.path).join('/') ?? '';
    this.currentMenu.set(currentPath);

    // Üst route'lardan paymentMode datasını oku (default: 'seller')
    let route = this.activatedRoute.parent;
    while (route) {
      const mode = route.snapshot.data['paymentMode'] as PaymentMode | undefined;
      if (mode) {
        this.paymentMode = mode;
        break;
      }
      route = route.parent ?? null;
    }

    this.menuItems = this.buildMenuItems(this.paymentMode);
  }

  private buildMenuItems(mode: PaymentMode): SidebarItem[] {
    if (mode === 'seller') {
      return this.allMenuItems;
    }
    return this.allMenuItems.map((item) => {
      const isCategory = item.type === 'category';
      const hidden = isCategory
        ? !CUSTOMER_VISIBLE_CATEGORIES.has(item.title)
        : !CUSTOMER_VISIBLE_PATHS.has(item.path);
      return { ...item, hidden: of(hidden) };
    });
  }

  navigateTo(path: string) {
    this.currentMenu.set(path);
    // ana route'un parent'ına göre navigasyon yapılıyor çünkü bu component'in parent'ı pages module'deki route
    // ve onun child'ı da teams-edit componenti
    this.router.navigate([path], { relativeTo: this.activatedRoute });
  }
}
