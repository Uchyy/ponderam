export interface SubmissionItem {
  category: string;
  answer: string;
}

export interface Submission {
  id: string;
  gameCode: string;
  playerId: string;
  items: SubmissionItem[];
  createdAt: Date;
}