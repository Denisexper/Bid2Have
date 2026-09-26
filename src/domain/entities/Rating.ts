export interface Rating {
  id: string;
  offerId: string;
  raterId: string;
  ratedUserId: string;
  score: number;
  comment: string | null;
  createdAt: Date;
}
