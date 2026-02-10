export interface ApplicationSocialRestrictionDTO {
  _id: string;

  userId: string;

  restriction: 'COMMENT' | 'POST';

  until?: string;

  endless: boolean;
}

export interface ApplicationSocialRestrictionAddDTO {
  userId: string;

  restriction: 'COMMENT' | 'POST';

  until?: string | null;

  note: string;
}

export interface ApplicationSocialRestrictionSearchDTO {
  userId: string;

  restriction: 'COMMENT' | 'POST';
}
