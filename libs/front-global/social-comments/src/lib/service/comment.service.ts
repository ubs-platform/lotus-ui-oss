import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, of } from 'rxjs';
import { UserDTO } from '@ubs-platform/users-common';
import {
  CommentAddDTO,
  CommentDTO,
  CommentSearchDTO,
  CommentAbilityDTO,
  CommentMetaSearchDTO,
  CommentStatus,
  ExistCommentAbilityDTO,
} from '@ubs-platform/social-common';
import { CommentBanUserDTO } from '../models';
import { objectToQueryParameters } from '@lotus/front-global/object-to-query-parameters';
import { SearchResult, SearchRequest } from '@ubs-platform/crud-base-common';

@Injectable()
export class CommentService {
  readonly prefix = '/api/social/comment';
  private commentCountCache = new Map<String, number>();
  constructor(private httpCl: HttpClient) {}

  addComment(commetnDto: CommentAddDTO): Observable<CommentDTO> {
    return this.httpCl
      .post(`${this.prefix}`, commetnDto)
      .pipe(map((a) => a as CommentDTO));
  }

  fetchComments(
    commetnDto: CommentSearchDTO & SearchRequest
  ): Observable<SearchResult<CommentDTO>> {
    const qParams = objectToQueryParameters(commetnDto);
    return this.httpCl.get(`${this.prefix}?${qParams}`).pipe(
      map((a) => {
        return a as SearchResult<CommentDTO>;
      })
    );
  }

  fetchMultipleComments(
    pagination: SearchRequest,
    ...commetnDtos: CommentSearchDTO[]
  ): Observable<SearchResult<CommentDTO>> {
    const qParams = objectToQueryParameters(pagination);
    return this.httpCl
      .post(`${this.prefix}/search?${qParams}`, commetnDtos)
      .pipe(
        map((a) => {
          return a as SearchResult<CommentDTO>;
        })
      );
  }

  deleteComment(id: string | String): Observable<any> {
    return this.httpCl.delete(`${this.prefix}/${id}`).pipe();
  }

  editComment(id: string | String, newComment: string) {
    return this.httpCl
      .put(`${this.prefix}/${id}`, { textContent: newComment })
      .pipe(map((a) => a as CommentDTO));
  }

  checkAbility(commetnDto: CommentSearchDTO): Observable<CommentAbilityDTO> {
    return this.httpCl
      .get(`${this.prefix}/ability?${objectToQueryParameters(commetnDto)}`)
      .pipe(map((a) => a as CommentAbilityDTO));
  }

  checkExistCommentAbility(commentId: string): Observable<ExistCommentAbilityDTO> {
    return this.httpCl
      .get(`${this.prefix}/ability/${commentId}`)
      .pipe(map((a) => a as ExistCommentAbilityDTO));
  }

  upvote(commentId: string | String): Observable<CommentDTO> {
    return this.httpCl
      .put(`${this.prefix}/${commentId}/upvote`, null)
      .pipe(map((a) => a as CommentDTO));
  }

  downvote(commentId: string | String): Observable<CommentDTO> {
    return this.httpCl
      .put(`${this.prefix}/${commentId}/downvote`, null)
      .pipe(map((a) => a as CommentDTO));
  }

  count(commentDto: CommentSearchDTO): Observable<number> {
    const qParams = objectToQueryParameters(commentDto);
    return this.commentCountCache.has(qParams)
      ? of(this.commentCountCache.get(qParams)!)
      : this.httpCl
          .get(`${this.prefix}/count?${qParams}`, {
            headers: { 'loading-indicator': 'silent' },
          })
          .pipe(
            map(
              (a) =>
                this.commentCountCache
                  .set(qParams, a as any as number)
                  .get(qParams)!
            )
          );
  }

  blockUser(commentDto: CommentBanUserDTO): Observable<number> {
    return this.httpCl
      .put(`${this.prefix}/block-user`, commentDto)
      .pipe(map((a) => a as any as number));
  }

  unblockUser(commentDto: CommentBanUserDTO): Observable<number> {
    return this.httpCl
      .put(`${this.prefix}/unblock-user`, commentDto)
      .pipe(map((a) => a as any as number));
  }

  commentStatus(commentDto: CommentMetaSearchDTO): Observable<CommentStatus> {
    return this.httpCl
      .get(`${this.prefix}/status?${objectToQueryParameters(commentDto)}`)
      .pipe(map((a: any) => a['status'] as CommentStatus));
  }

  setCommentStatus(
    commentDto: CommentMetaSearchDTO,
    newStatus: CommentStatus
  ): Observable<number> {
    return this.httpCl
      .put(`${this.prefix}/status`, {
        newStatus,
        ...commentDto,
      })
      .pipe(map((a) => a as any as number));
  }

  fetchBlockedUsers(commentDto: CommentMetaSearchDTO): Observable<UserDTO[]> {
    return this.httpCl
      .get(`${this.prefix}/block-user?${objectToQueryParameters(commentDto)}`)
      .pipe(map((a) => a as UserDTO[]));
  }
}
