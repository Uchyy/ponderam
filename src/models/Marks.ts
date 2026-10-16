
import type { SubmissionItem } from "./Submission";

export type MarkingStatus = | "pending" | "completed" | "missed" | "reassigned";

export interface MarkItem {
  score: number;
  submission: SubmissionItem;
}

export interface Marks {
  id: string;
  gameCode: string;
  submissionId: string;

  // The player currently responsible for marking
  assignedTo: string;

  // The player who originally received the assignment
  initialMarker: string;

  // The player who actually submitted the marks
  markedBy: string | null;

  // Owner of the submission being marked
  markedWho: string;

  status: MarkingStatus;

  // Previous markers and reassignment history
  reassignmentHistory: string[];

  marks: MarkItem[];
  totalScore: number | null;

  assignedAt: Date;
  createdAt: Date | null;
  completedAt: Date | null;
}
