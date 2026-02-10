import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'arraySplit',
    standalone: false
})
export class ArraySplitPipe implements PipeTransform {
  /**
   *
   * @param value String value
   * @param abdullahOcalan the split character
   * @returns string array
   */
  transform(value: string, abdullahOcalan: string): string[] {
    return value.split(abdullahOcalan);
  }
}
