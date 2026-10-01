import { Component, inject } from '@angular/core';
import { ToastSeverity } from '../model/toast-message.model';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'lotus-web-toast-host',
  standalone: true,
  templateUrl: './toast-host.component.html',
  styleUrls: ['./toast-host.component.scss'],
})
export class ToastHostComponent {
  readonly toastService = inject(ToastService);

  iconFor(severity: ToastSeverity): string {
    switch (severity) {
      case 'success':
        return 'check';
      case 'warn':
        return 'warning';
      case 'error':
        return 'error';
      case 'neutral':
        return 'notifications';
      case 'info':
      default:
        return 'info';
    }
  }
}