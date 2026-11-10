import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

const NOT_FOUND_IMAGE = '/assets/not-found.image.png';

/** Clickable tile: cover image, title and optional badge. */
@Component({
  selector: 'lotus-web-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  readonly imageUrl = input<string | null | undefined>(null);
  readonly title = input('');
  readonly badge = input<string | null | undefined>(null);
  readonly skeleton = input(false);
  /** Ask the file service for a resized image (`?width=`). */
  readonly appendWidth = input(false);
  readonly selected = output<void>();

  private readonly failedUrl = signal<string | null>(null);
  readonly imageFailed = computed(
    () => !this.imageUrl() || this.failedUrl() === this.imageUrl(),
  );

  readonly notFoundImage = NOT_FOUND_IMAGE;

  markFailed(): void {
    this.failedUrl.set(this.imageUrl() ?? null);
  }

  src(width: number): string {
    const url = this.imageUrl() ?? '';
    return this.appendWidth() ? `${url}?width=${width}` : url;
  }
}
