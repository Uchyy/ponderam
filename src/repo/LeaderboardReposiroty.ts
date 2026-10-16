

export type LeaderboardTab = "ranked" | "popular";

export interface LeaderboardEntry {
  username: string;
  avatar: string;
  total_score: number;
  likes: number;
}

export interface LeaderboardRepository {
  getTopPlayers(
    tab?: LeaderboardTab,
    limit?: number
  ): Promise<LeaderboardEntry[]>;

  subscribe(listener: () => void): () => void;
}
