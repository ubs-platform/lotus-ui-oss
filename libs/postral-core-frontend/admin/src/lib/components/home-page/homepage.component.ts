import {
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
  OnDestroy,
} from '@angular/core';
import type { Subscription } from 'rxjs';
import type { TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthManagementService, RoleService } from '@lotus/front-global/auth';
import {
  RefundControllerService,
  ReportControllerService,
} from '@lotus/postral-core-frontend/client';
import { TileTone } from '@lotus/front-global/ui/tile-grid';
import { mergeMap, of, startWith, switchMap } from 'rxjs';
import { ReportDTO } from '@tk-postral/payment-common';

interface HomepageTile {
  key: string;
  path: string;
  icon: string;
  size: 'normal' | 'wide';
  count?: number;
  tone: TileTone;
  customContent?: TemplateRef<any>;
}

@Component({
  selector: 'postral-core-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly reportView = viewChild<TemplateRef<any>>('reportView');
  private readonly auth = inject(AuthManagementService);
  private readonly roles = inject(RoleService);
  reportSummary = signal<ReportDTO[]>([]);
  isAdmin = signal(false);
  subscriptions: Subscription[] = [];

  readonly sellerTiles = signal<HomepageTile[]>([
    {
      key: 'orders',
      path: '/user/payment-accounts/transaction/history',
      icon: 'receipt_long',
      size: 'wide',
      tone: 'primary',
    },
    {
      key: 'items',
      path: '/user/payment-accounts/item',
      icon: 'inventory_2',
      size: 'normal',
      tone: 'surface',
    },
    {
      key: 'invoices',
      path: '/user/payment-accounts/invoice/history',
      icon: 'description',
      size: 'normal',
      tone: 'surface',
    },
    {
      key: 'refunds',
      path: '/user/payment-accounts/refund/requests',
      icon: 'assignment_return',
      size: 'normal',
      tone: 'surface',
      count: 0,
    },
    {
      key: 'reports',
      path: '/user/payment-accounts/reports',
      icon: 'monitoring',
      size: 'wide',
      tone: 'accent',
    },
    {
      key: 'accounts',
      path: '/user/payment-accounts/account',
      icon: 'account_balance_wallet',
      size: 'normal',
      tone: 'surface',
    },
  ]);

  readonly adminTiles = signal<HomepageTile[]>([
    {
      key: 'commissions',
      path: '/admin/comission',
      icon: 'percent',
      size: 'normal',
      tone: 'surface',
    },
    {
      key: 'channels',
      path: '/admin/payment-channel-config',
      icon: 'credit_card',
      size: 'normal',
      tone: 'surface',
    },
    {
      key: 'platforms',
      path: '/admin/external-platforms',
      icon: 'cloud',
      size: 'normal',
      tone: 'surface',
    },
    {
      key: 'settings',
      path: '/admin/admin-settings',
      icon: 'settings',
      size: 'normal',
      tone: 'surface',
    },
    {
      key: 'all-reports',
      path: '/admin/reports',
      icon: 'assessment',
      size: 'wide',
      tone: 'accent',
    },
  ]);

  constructor(
    private refundService: RefundControllerService,
    private reportService: ReportControllerService,
  ) {
    this.subscriptions.push(
      this.auth
        .userChange()
        .pipe(
          mergeMap((user) =>
            user
              ? this.roles
                  .hasRole(['ADMIN', 'POSTRAL_ADMIN'])
                  .pipe(startWith(false))
              : of(false),
          ),
        )
        .subscribe((isAdmin) => {
          this.isAdmin.set(isAdmin);
        }),

      this.refundService
        .searchRefundRequests({
          status: 'PENDING',
          page: 0,
          size: 10,
          mode: 'USER',
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((a) => {
          if (a && a.content.length > 0) {
            this.sellerTiles.update((tiles) => {
              const tile = tiles.find((tile) => tile.key === 'refunds');
              if (tile) {
                tile.count = a.content.length;
              }
              return tiles;
            });
          }
        }),
    );

    // format: YYYY-AA-GG
    const date = new Date().toISOString().split('T')[0];
    this.reportService
      .searchReports({ periodLabel: date, page: 0, size: 10 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((a) => {
        if (a && a.content.length > 0) {
          this.reportSummary.set(a.content);
          this.sellerTiles.update((tiles) => {
            const tile = tiles.find((tile) => tile.key === 'reports');
            if (tile) {
              tile.customContent = this.reportView();
            }
            return tiles;
          });
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
