
export interface Participant {
  id: string; // User profile ID
  joinedAt: Date;
  leftAt: Date | null;

  connected: boolean;
  isHost: boolean;

  username: string;
  avatar: string;

  reliability: number; 
  hasCompletedMarking: boolean;
}
