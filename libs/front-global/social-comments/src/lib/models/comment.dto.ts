// export interface CommentAddDTO {
//   entityGroup: string;
//   mainEntityName: string;
//   mainEntityId: string;
//   childEntityName: string;
//   childEntityId: string;
//   textContent: string;
//   childOfCommentId?: string;
// }

// export interface CommentSearchDTO {
//   entityGroup: string;
//   mainEntityName: string;
//   mainEntityId: string;
//   childEntityName: string;
//   childEntityId: string;
//   childOfCommentId?: string;
// }

// export interface CommentMetaSearchDTO {
//   entityGroup: string;
//   mainEntityName: string;
//   mainEntityId: string;
// }

// export interface CommentDTO {
//   _id: string;

//   entityGroup: string;

//   mainEntityName: string;

//   mainEntityId: string;

//   childEntityName: string;

//   childEntityId: string;

//   textContent: string;

//   byUserId: string;

//   byFullName: string;

//   creationDate: Date;

//   lastEditDate: Date;

//   editCount: number;

//   isChild?: boolean;

//   childOfCommentId?: string;

//   userDownVoted: boolean;

//   userUpVoted: boolean;

//   votesLength: number;
//   childCommentsCount: number;
//   canRemove: boolean;
//   canEdit: boolean;
//   userCommentAdmin: boolean;
//   userBanned: boolean;
// }

export interface CommentBanUserDTO {
  entityGroup: String;
  mainEntityName: String;
  mainEntityId: String;
  byUserId: String;
}
// export interface CommentAbilityDTO {
//   userCanComment: boolean;
//   userCommentBlockReason: string;
// }

// export interface CommentEditDTO {
//   textContent: string;
// }

// export type SORT_FIELD = 'VOTE' | 'CREATIONDATE';
// export type SORT_ROTATION = 'ASC' | 'DESC';

// export interface PaginationRequest {
//   page: number;
//   size: number;
//   sortField: SORT_FIELD;
//   sortRotation: SORT_ROTATION;
// }

// export interface PaginationResult {
//   page: number;
//   size: number;
//   maxItemLength: number;
//   list: CommentDTO[];
// }

// export type CommentStatus = 'ALLOW' | 'DISABLE' | 'ARCHIVE';
