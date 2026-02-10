import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { FrontGlobalImagesModule } from '../front-global-images.module';
export type FileVolatility = {
  name: string;
  category: string;
  volatile: boolean;
  durationMiliseconds?: number;
};
@Injectable({
  providedIn: 'root',
})
export class FileService {
  readonly fetchEntityUrl = '/api/file';
  readonly profileUploadUrl = '/api/users/user/current/profile-photo';

  constructor(private http: HttpClient) {}

  // public upload(name: string, file: Blob) {
  //   const fd = new FormData();
  //   fd.append('file', file);
  //   fd.append('name', name);
  //   return this.http
  //     .put(`${this.entityUrl}`, fd, { responseType: 'string' as 'arraybuffer' })
  //     .pipe(map((a) => a as any as string));
  // }

  public updateVolatilities(volatilities: FileVolatility[]) {
    if (volatilities.length > 0) {
      return this.http
        .put(`${this.fetchEntityUrl}/volatility`, volatilities)
        .pipe();
    }
    return of().pipe();
  }

  public changeProfilePhoto(file: Blob) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http
      .put(`${this.profileUploadUrl}`, fd)
      .pipe(map((a) => a as { category: string; name: string }));
  }

  public upload(file: Blob, category: string, objectId?: string) {
    const fd = new FormData();
    fd.append('file', file);
    const postfix = objectId ? '/' + objectId : '';
    return this.http
      .put(`${this.fetchEntityUrl}/${category}${postfix}`, fd)
      .pipe(map((a) => a as { category: string; name: string }));
  }

  public uploadDynamic(url: string, file: Blob) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http
      .put(url, fd)
      .pipe(map((a) => a as { category: string; name: string }));
  }
}
