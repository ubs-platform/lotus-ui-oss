import { Component, signal, viewChild } from '@angular/core';
import {
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


  ngOnInit(): void { }
}
