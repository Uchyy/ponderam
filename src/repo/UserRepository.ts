import type { Participant } from "../models/Participant";

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  coins: number;
  streak: number;
  total_score: number;
  likes: number;
  soloIds: string[];
  multiplayerIds: string[];
  createdAt: Date;
  lastPlayedDate: Date | null;
  reliability: number;
}

export interface CreateProfileInput {
  username: string;
  avatar: string;
}

export interface UpdateProfileInput {
  username?: string;
  avatar?: string;
}

export interface UserRepository {
  getById(id: string): Promise<UserProfile | null>;

  create(
    id: string,
    input: CreateProfileInput
  ): Promise<UserProfile>;

  update(
    id: string,
    input: UpdateProfileInput
  ): Promise<UserProfile>;

  usernameExists(username: string): Promise<boolean>;

  createParticipant(profile: UserProfile): Participant;

  getParticipantById(  code: string,  id: string): Promise<Participant | null>;

  getAllParticipant(   code: string ): Promise<Participant[]>;
}
