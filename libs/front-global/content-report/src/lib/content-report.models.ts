export type ContentReportEntityType = 'COMMENT' | 'BOOK' | 'QUESTION';

export interface ContentReportReason {
  text: string;
  value: string;
}

export interface ContentReportRequest {
  entityType: ContentReportEntityType;
  entityId: string;
  /** Dialog header. Defaults to "İçeriği bildir" */
  dialogTitle?: string;
  /** Reporter's user id, if logged in */
  reporterUserId?: string;
  /** Extra lines (already plain text) describing the content, shown in the report message */
  contextLines?: string[];
  /** Overrides the default reason list of the entity type */
  reasons?: ContentReportReason[];
}
