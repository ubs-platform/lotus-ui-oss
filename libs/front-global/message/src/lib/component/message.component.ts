import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UbsTranslatorNgxModule } from '@lotus/extra/ubs-translator-ngx';

type MessageSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'error'
  | 'help'
  | 'primary'
  | 'secondary'
  | 'contrast'
  | string
  | null
  | undefined;

@Component({
  selector: 'lotus-web-message',
  standalone: true,
  imports: [CommonModule, UbsTranslatorNgxModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() severity: MessageSeverity = 'info';
  @Input() text?: string;
  @Input() escape = true;
  @Input() style?: { [klass: string]: unknown } | null;
  @Input() styleClass?: string;

  iconFor(severity: MessageSeverity): string {
    switch (severity) {
      case 'success':
        return 'task_alt';
      case 'warn':
        return 'warning';
      case 'error':
        return 'error';
      case 'help':
        return 'help';
      case 'secondary':
      case 'contrast':
        return 'notifications';
      case 'primary':
      case 'info':
      default:
        return 'info';
    }
  }
}