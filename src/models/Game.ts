
import type { Participant } from "./Participant";
import type { Submission } from "./Submission";
import type { Marks } from "./Marks";

export interface GameDetails {
  duration: number;
  maxPlayers: number;
  selectedChar: string;
  selectedCategories: string[];
  visibility: GameVisibility;
  autoStartWhenFull: boolean;
}

export type GameVisibility = "public" | "private";

export type GameStatus = | "waiting" | "countdown"| "playing" | "marking" | "finished" | "cancelled";

export interface Game {
  id: string;
  code: string;
  createdBy: string;
  createdAt: Date;

  hasStarted: boolean;
  hasEnded: boolean;
  status: GameStatus;

  startedAt: Date | null;
  endedAt: Date | null;

  countdownStartedAt: Date | null;
  countdownEndsAt: Date | null;

  details: GameDetails;
  visibility: GameVisibility;

  participants: Participant[];
  submissions: Submission[];
  markings: Marks[];
}
