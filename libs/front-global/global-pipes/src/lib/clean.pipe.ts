import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'clean',
    standalone: false
})
export class CleanPipe implements PipeTransform {
  /**
   * Filters the array and eliminates null,undefined or false
   * @param value
   * @returns
   */
  transform(value: any[]): string[] {
    return value.filter((a) => a != null && a != false);
  }
}
