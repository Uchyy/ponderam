
import type { Game } from "../models/Game";
import type { GameDetails } from "../models/Game";
import type { Participant } from "../models/Participant";
import type { Submission } from "../models/Submission";
import type { Marks } from "../models/Marks";
import type { ArchivedGame } from "../models/ArchivedGame";

export interface CreateGameInput {
  host: Participant;
  details: GameDetails;
}

export interface GameRepository {
  // Create and retrieve games
  create(input: CreateGameInput): Promise<Game>;
  getByCode(code: string): Promise<Game | null>;

  // Public lobby
  listPublicWaitingGames(): Promise<Game[]>;

  // Waiting room
  join(code: string, participant: Participant): Promise<Game>;

  /**
   * Returns the updated game when it remains active.
   * Returns null if leaving caused the room to be cancelled.
   */
  leave(
    code: string,
    participantId: string
  ): Promise<Game | null>;

  // Game lifecycle
  startCountdown(
    code: string,
    requesterId: string
  ): Promise<Game>;

  // Submissions and marking
  submitAnswers(
    code: string,
    submission: Submission
  ): Promise<Game>;

  submitMarks(
    code: string,
    marking: Marks
  ): Promise<Game>;

  // Completion and cancellation
  finish(code: string, hostId: string): Promise<Game>;

  cancel(
    code: string,
    hostId: string,
    reason: string
  ): Promise<void>;

  // Archived games
  getArchivedByCode(code: string): Promise<ArchivedGame | null>;

  listArchivedGames(): Promise<ArchivedGame[]>;

  // Realtime updates
  subscribe(
    code: string,
    listener: (game: Game | null) => void
  ): () => void;


  subscribeLobby(
    listener: (games: Game[]) => void
  ): () => void;
}
