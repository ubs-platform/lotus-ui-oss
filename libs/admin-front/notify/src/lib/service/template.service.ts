import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@lotus-web/environment';
import { map } from 'rxjs';
import {
  EmailTemplateDTO,
  EmailTemplateSearch,
} from '@ubs-platform/notify-common';
import { SearchResult } from '../../../../../api-interfaces/src/search-result.dto';
@Injectable()
export class TemplateService {
  readonly RESOURCE_URL = `${environment.notifyUrl}/email-template`;

  constructor(private http: HttpClient) {}

  public fetchAll(s: Partial<EmailTemplateSearch>) {
    const url = this.urlWithQueryParameters(this.RESOURCE_URL, s);

    return this.http
      .get(url.toString())
      .pipe(map((a) => a as EmailTemplateDTO[]));
  }

  public search(s: EmailTemplateSearch) {
    const url = this.urlWithQueryParameters(this.RESOURCE_URL + '/_search', s);

    return this.http
      .get(url.toString())
      .pipe(map((a) => a as SearchResult<EmailTemplateDTO>));
  }

  public add(s: EmailTemplateDTO) {
    return this.http
      .post(this.RESOURCE_URL, s)
      .pipe(map((a) => a as EmailTemplateDTO));
  }

  public edit(s: EmailTemplateDTO) {
    return this.http
      .put(this.RESOURCE_URL, s)
      .pipe(map((a) => a as EmailTemplateDTO));
  }

  public remove(id: string) {
    return this.http.delete(this.RESOURCE_URL + '/' + id);
  }

  public fetchById(id: any) {
    return this.http
      .get(this.RESOURCE_URL + '/' + id)
      .pipe(map((a) => a as EmailTemplateDTO));
  }
  private urlWithQueryParameters(
    resourceUrl: string,
    s: Partial<EmailTemplateSearch>
  ) {
    const url = new URL('https://localhost' + resourceUrl);
    if (s) {
      Object.entries(s).forEach(([key, value]) => {
        url.searchParams.append(key, value as string);
      });
    }
    const realUrl = url.pathname + url.search;
    return realUrl;
  }
}
