import { Pipe, PipeTransform } from '@angular/core';
import { UserDTO, UserGeneralInfoDTO } from '@ubs-platform/users-common';

@Pipe({
    name: 'imageUrl',
    standalone: false
})
export class ImageUrlPipe implements PipeTransform {
  transform(value: UserGeneralInfoDTO, category: String): unknown {
    return null;
  }
}
