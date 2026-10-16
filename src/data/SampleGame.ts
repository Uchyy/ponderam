
import type { Game } from "../models/Game";
import { sampleMarkings } from "./SampleMarks";
import { sampleParticipants } from "./SampleParticipant";
import { sampleSubmissions } from "./SampleSubmissions";

export const sampleGames: Game[] = [
  // 1. Public room waiting for players
  {
    id: "PINK101",
    createdBy: "user-001",
    createdAt: new Date("2026-10-14T09:00:00"),
    hasStarted: false,
    hasEnded: false,
    startedAt: null,
    endedAt: null,
    countdownStartedAt: null,
    countdownEndsAt: null,
    status: "waiting",
    details: {
      duration: 60,
      maxPlayers: 6,
      selectedChar: "",
      selectedCategories: ["animal", "country", "thing", "colour"],
      visibility: "public",
      autoStartWhenFull: true
    },
    participants: sampleParticipants.filter(
      (player) => player.id === "user-001"
    ),
    submissions: [],
    markings: [],
  },

  // 2. Public room with several players
  {
    id: "WORD202",
    createdBy: "user-002",
    createdAt: new Date("2026-10-14T09:15:00"),
    hasStarted: false,
    hasEnded: false,
    startedAt: null,
    endedAt: null,
    countdownStartedAt: null,
    countdownEndsAt: null,
    status: "waiting",
    details: {
      duration: 90,
      maxPlayers: 4,
      selectedChar: "",
      selectedCategories: [
        "name",
        "country",
        "food",
        "profession",
        "animal",
      ],
      visibility: "public",
      autoStartWhenFull: false
    },
    participants: sampleParticipants.filter(
      (player) =>
        ["user-002", "user-003", "user-004"].includes(player.id)
    ),
    submissions: [],
    markings: [],
  },

  // 3. Countdown in progress
  {
    id: "COUNT303",
    createdBy: "user-001",
    createdAt: new Date("2026-10-15T10:00:00"),
    hasStarted: false,
    hasEnded: false,
    startedAt: null,
    endedAt: null,
    countdownStartedAt: new Date("2026-10-15T10:05:00"),
    countdownEndsAt: new Date("2026-10-15T10:05:10"),
    status: "countdown",
    details: {
      duration: 60,
      maxPlayers: 4,
      selectedChar: "C",
      selectedCategories: ["animal", "country", "food", "colour"],
      visibility: "public",
      autoStartWhenFull: true
    },
    participants: sampleParticipants.filter(
      (player) =>
        ["user-001", "user-002", "user-003"].includes(player.id)
    ),
    submissions: [],
    markings: [],
  },

  // 4. Game currently in progress
  {
    id: "PLAY404",
    createdBy: "user-001",
    createdAt: new Date("2026-10-14T09:30:00"),
    hasStarted: true,
    hasEnded: false,
    startedAt: new Date("2026-10-14T09:32:00"),
    endedAt: null,
    countdownStartedAt: new Date("2026-10-14T09:31:50"),
    countdownEndsAt: new Date("2026-10-14T09:32:00"),
    status: "playing",
    details: {
      duration: 60,
      maxPlayers: 4,
      selectedChar: "P",
      selectedCategories: ["animal", "country", "food", "colour"],
      visibility: "public",
      autoStartWhenFull: false
    },
    participants: sampleParticipants.filter(
      (player) =>
        ["user-001", "user-002", "user-003"].includes(player.id)
    ),
    submissions: sampleSubmissions.filter(
      (submission) => submission.gameCode === "PLAY404"
    ),
    markings: sampleMarkings.filter(
      (marking) => marking.gameCode === "PLAY404"
    ),
  },

  // 5. Completed game with results
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
      autoStartWhenFull: false
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
  },

  // 6. Completed game with no submissions
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
      autoStartWhenFull: true
    },
    participants: sampleParticipants.filter(
      (player) => ["user-003", "user-004"].includes(player.id)
    ),
    submissions: [],
    markings: [],
  },

  // 7. Cancelled room: host left before starting
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
      autoStartWhenFull: false
    },
    participants: sampleParticipants.filter(
      (player) => ["user-002", "user-003"].includes(player.id)
    ),
    submissions: [],
    markings: [],
  },

  // 8. Cancelled room: insufficient connected players
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
      autoStartWhenFull: true
    },
    participants: sampleParticipants.filter(
      (player) => player.id === "user-001"
    ),
    submissions: [],
    markings: [],
  },
];
