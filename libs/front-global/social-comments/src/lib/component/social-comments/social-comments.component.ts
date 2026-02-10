import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  input
} from '@angular/core';
import { CommentService } from '../../service';
import {
  CommentAbilityDTO,
  CommentDTO,
  CommentSearchDTO,
  SORT_FIELD,
  SORT_ROTATION,
} from '@ubs-platform/social-common';

@Component({
  selector: 'social-comments-component',
  templateUrl: './social-comments.component.html',
  styleUrl: './social-comments.component.scss',
  standalone: false,
})
export class SocialCommentsComponent implements OnInit, OnChanges {
  readonly entityGroup = input<string>('');
  readonly mainEntityName = input<string>('');
  readonly mainEntityId = input<string>('');
  readonly childEntityName = input<string>('');
  readonly childEntityId = input<string>('');
  readonly parentCommentId = input<string>('');
  readonly initialSortField = input<SORT_FIELD>("vote");
  readonly initialSortRotation = input<SORT_ROTATION>("desc");
  pickedChild?: String;
  sortField: SORT_FIELD = "vote";
  sortRotation: SORT_ROTATION = 'desc';
  baseObj?: CommentSearchDTO;
  comments: CommentDTO[] = [];
  textboxFocused = false;
  language: string = 'en-us';
  dates: { [isostr: string]: string } = {};
  activeComment?: CommentDTO;
  commentAbility?: CommentAbilityDTO;
  writtenUnpublishedComment = '';
  pageSize = 15;
  page = 0;
  allCommentsAreLoaded = false;
  totalItemsLength: number = 0;
  activeSortingText = '';

  /**
   *
   */
  constructor(private commentService: CommentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['entityGroup'] ||
      changes['mainEntityName'] ||
      changes['mainEntityId'] ||
      changes['childEntityName'] ||
      changes['childEntityId']
    ) {
      this.initialBaseObj();
      this.setSorting(this.initialSortField(), this.initialSortRotation());
    }
  }
  commentRemoval($event: CommentDTO) {
    this.comments = this.comments.filter((a) => a._id != $event._id);
  }
  ngOnInit(): void {}

  setSorting(field: SORT_FIELD, rotation: SORT_ROTATION) {
    this.sortField = field;
    this.sortRotation = rotation;
    this.activeSortingText = this.generateTextForSort(field, rotation);

    this.resetComments();
  }

  public generateTextForSort(field: SORT_FIELD, rotation: SORT_ROTATION) {
    if (field == "creationDate") {
      return rotation == "asc" ? 'Eski -> Yeni' : 'Yeni -> Eski';
    } else if (field == 'vote') {
      return rotation == 'asc'
        ? 'Düşük -> Yüksek puan'
        : 'Yüksek -> Düşük puan';
    }
    return '';
  }

  initialBaseObj() {
    this.baseObj = {
      childEntityId: this.childEntityId(),
      childEntityName: this.childEntityName(),
      mainEntityId: this.mainEntityId(),
      mainEntityName: this.mainEntityName(),
      entityGroup: this.entityGroup(),
      childOfCommentId: this.parentCommentId() as string,
    };
    this.commentService.checkAbility(this.baseObj!).subscribe((result) => {
      this.commentAbility = result;
    });
  }

  private resetComments() {
    this.page = 0;
    this.comments = [];
    this.allCommentsAreLoaded = false;
    this.loadMoreComments();
  }

  public loadMoreComments() {
    if (!this.allCommentsAreLoaded) {
      this.commentService
        .fetchComments({
          ...this.baseObj!,
          size: this.pageSize,
          page: this.page,
          sortBy: this.sortField,
          sortRotation: this.sortRotation,
        })
        .subscribe((comments) => {
          this.totalItemsLength = comments.maxItemLength;
          this.comments.push(...comments.content);
          this.allCommentsAreLoaded =
            this.comments.length >= comments.maxItemLength;
          if (!this.allCommentsAreLoaded) {
            this.page++;
          }
        });
    }
  }

  sendComment($event: CommentDTO) {
    this.comments.push($event);
  }
}
