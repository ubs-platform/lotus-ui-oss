import { Component, inject, signal, viewChild } from '@angular/core';
import {
  CommentAdminService,
  CommentService,
} from '@lotus/front-global/social-comments';
import { ActivatedRoute } from '@angular/router';
import { CommentDTO, CommentSearchDTO } from '@ubs-platform/social-common';
// import { SearchResult, } from '@lotus/';
import { SearchResult, SearchRequest } from '@ubs-platform/crud-base-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { Reform } from '@lotus/front-global/minky/core';
import {
  BookCommentSearchForm,
} from './book-comment-search.form';
import {
  AdminCommentSearchForm,
  CommentFlagAddForm,
  FLAG_FORM_PARAM_SUGGESTIONS,
} from './admin-comment-search.form';
import { Observable, map, of, shareReplay } from 'rxjs';
import { AdminSocialOptionsComponent } from '@lotus/front-global/admin-social-options';
import { SearchableDataTableComponent } from '@lotus/front-global/table';

// import {Con} from "@lotus/lotus-common/books";
@Component({
  selector: 'lib-book-comments',
  standalone: false,
  templateUrl: './book-comments.component.html',
  styleUrls: ['./book-comments.component.scss'],
})
export class BookCommentsComponent {

  comments = signal<SearchResult<CommentDTO>>(null!);
  adminMode = signal<boolean>(false);
  headerless = signal<boolean>(false);
  readonly url: string;
  bookIdDialog: string = '';
  questionIdDialog: string = '';
  showQuestionDialog = false;
  searchReform: Reform<CommentSearchDTO>;
  deleted: { [key: string]: boolean } = {};
  // commentsTable = viewChild<SearchableDataTableComponent>('commentsTable')!;
  commentsTable = viewChild<SearchableDataTableComponent>('commentsTable');
  private commentAdmin = inject(CommentAdminService);
  private flagSuggestions$?: Observable<string[]>;
  linkAction: (c: CommentDTO) => string | string[] | undefined = () => {
    return undefined;
  }

  constructor(
    private commentService: CommentService,
    private basicOverlay: BasicOverlayService,
    private activatedRouter: ActivatedRoute
  ) {
    this.url = commentService.prefix;
    this.searchReform = new Reform<CommentSearchDTO & Partial<SearchRequest>>(
      BookCommentSearchForm
      // {

      //   sortBy: 'creationDate',
      //   sortRotation: 'desc',
      // }
    );

    // entityGroup: ENTITY_GROUP_LOTUS,
    // mainEntityName: ENTITY_NAME_QUESTION_BOOK,
    // mainEntityIdByOwner: true,
    this.activatedRouter.data.subscribe((data) => {
      this.linkAction = data['generateLinkAction'] ?? this.linkAction;
      this.adminMode.set(data['adminMode'] ?? false);
      this.headerless.set(data['headerless'] ?? false);

      if (!this.adminMode()) {
        if (data['entityGroup']) {
          this.searchReform.setValueByPath('entityGroup', data['entityGroup']);
        }
        if (data['mainEntityName']) {
          this.searchReform.setValueByPath('mainEntityName', data['mainEntityName']);
        }

        this.searchReform.setValueByPath('mainEntityIdByOwner', true);
      } else {
        // Admin modunda flag/görünürlük filtreleri olan ayrı form
        this.searchReform = new Reform<CommentSearchDTO & Partial<SearchRequest>>(
          AdminCommentSearchForm
        );
        this.searchReform.setValueByPath('entityGroup', undefined);
        this.searchReform.setValueByPath('mainEntityName', undefined);
        this.searchReform.setValueByPath('mainEntityIdByOwner', undefined);
      }

    });
  }


  socialOptions(item: CommentDTO) {
    this.basicOverlay.showComponentAsDialog(AdminSocialOptionsComponent, {
      data: {
        userId: item.byUserId
      }, defaultOutValue: null
    }).onClose().subscribe({
      next: () => {
        this.commentsTable()?.loadData();
      }
    })
  }


  goToTopic(item: CommentDTO) {
    this.bookIdDialog = item.mainEntityId;
    this.questionIdDialog = item.childEntityId;
    this.showQuestionDialog = true;

    // routerLink=""
    // target="_blank"
  }
  goToQuestion(item: CommentDTO) {
    const url = this.linkAction(item);
    if (url) {
      if (typeof url === 'string') {
        window.open(url, '_blank');
        return;
      }

      if (Array.isArray(url)) {
        console.warn("TODO: Router navigasyonu şu an desteklenmiyor")
        window.open(url.join('/'), '_blank');
        // this.router.navigate(url);
      }

    }
    this.basicOverlay.alert("Hata", "Bu yorumun kaynağına gidilemiyor ya da desteklenmiyor.", "error");
  }


  // ---- Moderasyon (sadece adminMode) ----

  isShadow(item: CommentDTO): boolean {
    return item.moderationStatus === 'SHADOW';
  }

  removeFlag(item: CommentDTO, flag: string): void {
    this.commentAdmin.editFlags(item._id, { remove: [flag] }).subscribe(() => {
      item.flags = (item.flags ?? []).filter((f) => f !== flag);
    });
  }

  addFlag(item: CommentDTO): void {
    this.loadFlagSuggestions().subscribe((suggestions) => {
      const reform = new Reform<CommentFlagAddForm>(CommentFlagAddForm, undefined, {
        parameters: { [FLAG_FORM_PARAM_SUGGESTIONS]: suggestions },
      });
      this.basicOverlay
        .reformDialog(reform, 'Flag ekle', () =>
          reform.value.flag?.trim() ? null : 'Flag boş olamaz.'
        )
        .subscribe((ok) => {
          if (!ok) return;
          const flag = reform.value.flag.trim();
          this.commentAdmin.editFlags(item._id, { add: [flag] }).subscribe(() => {
            item.flags = [...new Set([...(item.flags ?? []), flag])];
          });
        });
    });
  }

  keepShadow(item: CommentDTO): void {
    this.commentAdmin.keepShadow(item._id).subscribe(() => {
      item.shadowExpiresAt = undefined;
    });
  }

  releaseShadow(item: CommentDTO): void {
    this.basicOverlay
      .confirm('Yorumu yayınla', 'Bu gizli yorum herkese görünür olacak. Emin misiniz?')
      .subscribe((ok) => {
        if (!ok) return;
        this.commentAdmin.releaseShadow(item._id).subscribe(() => {
          item.moderationStatus = 'VISIBLE';
          item.shadowExpiresAt = undefined;
        });
      });
  }

  deleteAsModerator(item: CommentDTO): void {
    this.basicOverlay
      .confirm('Yorumu sil', 'Bu yorum kalıcı olarak silinecek. Emin misiniz?')
      .subscribe((ok) => {
        if (!ok) return;
        this.commentAdmin.deleteAsModerator(item._id).subscribe(() => {
          this.deleted[item._id] = true;
        });
      });
  }

  private loadFlagSuggestions(): Observable<string[]> {
    if (!this.flagSuggestions$) {
      this.flagSuggestions$ = this.commentAdmin.listPatterns().pipe(
        map((list) => CommentAdminService.flagSuggestions(list)),
        shareReplay(1)
      );
    }
    return this.flagSuggestions$ ?? of([]);
  }

  ngOnInit(): void { }
}
