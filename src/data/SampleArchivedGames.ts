
import type { ArchivedGame } from "../models/ArchivedGame";
import { sampleMarkings } from "./SampleMarks";
import { sampleParticipants } from "./SampleParticipant";
import { sampleSubmissions } from "./SampleSubmissions";

export const sampleArchivedGames: ArchivedGame[] = [
  // 1. Completed game with results
  {
    id: "DONE505",
    createdBy: "user-002",
    createdAt: new Date("2026-10-13T17:00:00"),
    hasStarted: true,
    hasEnded: true,
    startedAt: new Date("2026-10-13T17:02:00"),
    endedAt: new Date("2026-10-13T17:08:00"),
    countdownStartedAt: new Date("2026-10-13T17:01:50"),
    countdownEndsAt: new Date("2026-10-13T17:02:00"),
    status: "finished",
    details: {
      duration: 60,
      maxPlayers: 4,
      selectedChar: "P",
      selectedCategories: ["animal", "country", "food", "colour"],
      visibility: "public",
    },
    participants: sampleParticipants.filter(
      (player) =>
        ["user-001", "user-002", "user-004"].includes(player.id)
    ),
    submissions: sampleSubmissions.filter(
      (submission) => submission.gameCode === "DONE505"
    ),
    markings: sampleMarkings.filter(
      (marking) => marking.gameCode === "DONE505"
    ),
    cancellationReason: null,
    cancelledAt: null,
    archivedAt: new Date("2026-10-13T17:08:05"),
  },

  // 2. Completed game with no submissions
  {
    id: "EMPTY606",
    createdBy: "user-003",
    createdAt: new Date("2026-10-12T12:00:00"),
    hasStarted: true,
    hasEnded: true,
    startedAt: new Date("2026-10-12T12:02:00"),
    endedAt: new Date("2026-10-12T12:03:00"),
    countdownStartedAt: new Date("2026-10-12T12:01:50"),
    countdownEndsAt: new Date("2026-10-12T12:02:00"),
    status: "finished",
    details: {
      duration: 30,
      maxPlayers: 2,
      selectedChar: "A",
      selectedCategories: ["animal", "country"],
      visibility: "public",
    },
    participants: sampleParticipants.filter(
      (player) => ["user-003", "user-004"].includes(player.id)
    ),
    submissions: [],
    markings: [],
    cancellationReason: null,
    cancelledAt: null,
    archivedAt: new Date("2026-10-12T12:03:05"),
  },

  // 3. Cancelled because the host intentionally left
  {
    id: "CANCEL707",
    createdBy: "user-002",
    createdAt: new Date("2026-10-15T08:00:00"),
    hasStarted: false,
    hasEnded: true,
    startedAt: null,
    endedAt: new Date("2026-10-15T08:03:00"),
    countdownStartedAt: null,
    countdownEndsAt: null,
    status: "cancelled",
    details: {
      duration: 60,
      maxPlayers: 4,
      selectedChar: "",
      selectedCategories: ["animal", "country", "food", "colour"],
      visibility: "private",
    },
    participants: sampleParticipants.filter(
      (player) => ["user-002", "user-003"].includes(player.id)
    ),
    submissions: [],
    markings: [],
    cancellationReason: "The host left before the game started.",
    cancelledAt: new Date("2026-10-15T08:03:00"),
    archivedAt: new Date("2026-10-15T08:03:01"),
  },

  // 4. Cancelled because too few connected players remained
  {
    id: "CANCEL808",
    createdBy: "user-001",
    createdAt: new Date("2026-10-15T11:00:00"),
    hasStarted: false,
    hasEnded: true,
    startedAt: null,
    endedAt: new Date("2026-10-15T11:01:10"),
    countdownStartedAt: new Date("2026-10-15T11:01:00"),
    countdownEndsAt: new Date("2026-10-15T11:01:10"),
    status: "cancelled",
    details: {
      duration: 60,
      maxPlayers: 4,
      selectedChar: "S",
      selectedCategories: ["animal", "country", "food", "colour"],
      visibility: "public",
    },
    participants: sampleParticipants.filter(
      (player) => player.id === "user-001"
    ),
    submissions: [],
    markings: [],
    cancellationReason:
      "The game could not start because fewer than two connected players remained.",
    cancelledAt: new Date("2026-10-15T11:01:10"),
    archivedAt: new Date("2026-10-15T11:01:11"),
  },
];
