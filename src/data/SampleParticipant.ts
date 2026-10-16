import type { Participant } from "../models/Participant";
import { sampleUsers } from "./SampleUsers";

export const sampleParticipants: Participant[] = sampleUsers.map(
  (user) => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    joinedAt: new Date().toISOString(),
    connected: true,
  }),
);
