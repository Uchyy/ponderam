export type ArchivedGameReason = "finished" | "cancelled";

export interface ArchivedGame {
  id: string;
  gameId: string;
  code: string;
  reason: ArchivedGameReason;
  gameEndedAt: Date;
  archivedAt: Date;
}