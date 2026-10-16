export interface User {
  id: string;
  username: string;
  avatar: string;
  coins: number;
  streak: number;
  likes: number;
  soloIds: string[];
  multiplayerIds: string[];
  createdAt: Date;
  lastPlayedDate: Date | null;
  reliability: number;
  total_score: number
}