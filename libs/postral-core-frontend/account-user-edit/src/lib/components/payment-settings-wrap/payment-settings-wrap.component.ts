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
      title: 'general._',
      type: 'category',
      path: '',
      hidden: of(false),
      icon: fromMaterialSymbol('settings'),
    },
    {
      title: 'postral.menu.addresses',
      path: 'address',
      hidden: of(false),
      icon: fromMaterialSymbol('location_on'),
    },
    {
      title: 'postral.menu.accounts',
      path: 'account',
      hidden: of(false),
      icon: fromMaterialSymbol('info'),
    },
    {
      title: 'postral.menu.taxes',
      path: 'tax',
      hidden: of(false),
      icon: fromMaterialSymbol('sell'),
    },
    {
      title: 'postral.menu.items',
      path: 'item',
      hidden: of(false),
      icon: fromMaterialSymbol('inventory_2'),
    },
    {
      title: 'postral.menu.payment-records',
      type: 'category',
      path: '',
      hidden: of(false),
      icon: fromMaterialSymbol('settings'),
    },
    {
      title: 'postral.menu.payment-history',
      path: 'payment/history',
      hidden: of(false),
      icon: fromMaterialSymbol('history'),
    },
    {
      title: 'postral.menu.seller-orders',
      path: 'transaction/history',
      hidden: of(false),
      icon: fromMaterialSymbol('history'),
    },
    {
      title: 'postral.menu.refund-requests',
      path: 'refund/requests',
      hidden: of(false),
      icon: fromMaterialSymbol('history'),
    },
    {
      title: 'postral.menu.refund-detail',
      path: 'refund/:id',
      hidden: of(true),
      icon: fromMaterialSymbol('history'),
    },
    {
      title: 'postral.menu.invoices',
      path: 'invoice/history',
      hidden: of(false),
      icon: fromMaterialSymbol('description'),
    },
    {
      title: 'postral.menu.reports',
      type: 'category',
      path: '',
      hidden: of(false),
      icon: fromMaterialSymbol('settings'),
    },
    {
      title: 'postral.menu.report-queries',
      path: 'report-query',
      hidden: of(false),
      icon: fromMaterialSymbol('search'),
    },
    {
      title: 'postral.menu.all-reports',
      path: 'reports',
      hidden: of(false),
      icon: fromMaterialSymbol('show_chart'),
    },
    {
      title: 'postral.menu.integrations',
      type: 'category',
      path: '',
      hidden: of(false),
      icon: fromMaterialSymbol('settings'),
    },
    {
      title: 'postral.menu.webhook',
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
