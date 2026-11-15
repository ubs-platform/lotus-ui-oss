import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {
  CommentFilterPatternAddDTO,
  CommentFilterPatternDTO,
  CommentFlagEditDTO,
  CommentFilterPatternExportDTO,
  CommentFilterPatternImportResultDTO,
} from '@ubs-platform/social-common';

@Injectable({ providedIn: 'root' })
export class CommentAdminService {
  readonly prefix = '/api/social/comment/admin';
  constructor(private httpCl: HttpClient) {}

  clearCommentsOfUser(userId: string): Observable<any> {
    return this.httpCl.delete(`${this.prefix}/user-id/${userId}`).pipe();
  }

  // ---- Filtre pattern'leri ----

  listPatterns(): Observable<CommentFilterPatternDTO[]> {
    return this.httpCl.get<CommentFilterPatternDTO[]>(
      `${this.prefix}/filter-pattern`
    );
  }

  createPattern(
    dto: CommentFilterPatternAddDTO
  ): Observable<CommentFilterPatternDTO> {
    return this.httpCl.post<CommentFilterPatternDTO>(
      `${this.prefix}/filter-pattern`,
      dto
    );
  }

  updatePattern(
    id: string,
    dto: CommentFilterPatternAddDTO
  ): Observable<CommentFilterPatternDTO> {
    return this.httpCl.put<CommentFilterPatternDTO>(
      `${this.prefix}/filter-pattern/${id}`,
      dto
    );
  }

  deletePattern(id: string): Observable<void> {
    return this.httpCl.delete<void>(`${this.prefix}/filter-pattern/${id}`);
  }

  /**
   * Tüm pattern'leri dosyadakilerle değiştirir. Hata varsa 400:
   * `{ message: 'import-invalid', errors: [{ index, code }] }`
   */
  importPatterns(
    body: CommentFilterPatternExportDTO | CommentFilterPatternAddDTO[]
  ): Observable<CommentFilterPatternImportResultDTO> {
    return this.httpCl.post<CommentFilterPatternImportResultDTO>(
      `${this.prefix}/filter-pattern/import`,
      body
    );
  }

  /** Export biçimi: _id'siz, version'lı */
  static toExport(
    patterns: CommentFilterPatternDTO[]
  ): CommentFilterPatternExportDTO {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      patterns: patterns.map(({ _id, ...rest }) => rest),
    };
  }

  // ---- Flag / shadow moderasyonu ----

  editFlags(commentId: string, edit: CommentFlagEditDTO): Observable<void> {
    return this.httpCl.put<void>(`${this.prefix}/${commentId}/flags`, edit);
  }

  /** Shadow yorumun otomatik silinmesini durdurur */
  keepShadow(commentId: string): Observable<void> {
    return this.httpCl.put<void>(
      `${this.prefix}/${commentId}/shadow/keep`,
      null
    );
  }

  /** Yanlış pozitif: shadow yorumu herkese görünür yapar */
  releaseShadow(commentId: string): Observable<void> {
    return this.httpCl.put<void>(
      `${this.prefix}/${commentId}/shadow/release`,
      null
    );
  }

  deleteAsModerator(commentId: string): Observable<void> {
    return this.httpCl.delete<void>(`${this.prefix}/${commentId}`);
  }

  /** Mevcut pattern'lerdeki flag'ler (öneri listesi için) */
  static flagSuggestions(patterns: CommentFilterPatternDTO[]): string[] {
    return [
      ...new Set(patterns.map((p) => p.flag).filter((f): f is string => !!f)),
    ].sort();
  }
}
