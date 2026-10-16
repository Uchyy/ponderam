import type { Submission } from "../models/Submission";

export const sampleSubmissions: Submission[] = [
  // Live game: Uchyy has submitted
  {
    id: "sub-001",
    gameCode: "PLAY303",
    playerId: "user-001",
    items: [
      { category: "animal", answer: "Panther" },
      { category: "country", answer: "Portugal" },
      { category: "food", answer: "Pizza" },
      { category: "colour", answer: "Purple" },
    ],
    createdAt: new Date("2026-10-14T09:33:00"),
  },

  // Live game: Lexi has submitted
  {
    id: "sub-002",
    gameCode: "PLAY303",
    playerId: "user-003",
    items: [
      { category: "animal", answer: "Parrot" },
      { category: "country", answer: "Poland" },
      { category: "food", answer: "Pasta" },
      { category: "colour", answer: "Pink" },
    ],
    createdAt: new Date("2026-10-14T09:33:30"),
  },

  // Completed game: Uchyy
  {
    id: "sub-003",
    gameCode: "DONE404",
    playerId: "user-001",
    items: [
      { category: "animal", answer: "Panther" },
      { category: "country", answer: "Portugal" },
      { category: "food", answer: "Pizza" },
      { category: "colour", answer: "Purple" },
    ],
    createdAt: new Date("2026-10-13T17:05:00"),
  },

  // Completed game: Word Wizard
  {
    id: "sub-004",
    gameCode: "DONE404",
    playerId: "user-002",
    items: [
      { category: "animal", answer: "Penguin" },
      { category: "country", answer: "Peru" },
      { category: "food", answer: "Pancakes" },
      { category: "colour", answer: "Pink" },
    ],
    createdAt: new Date("2026-10-13T17:05:10"),
  },

  // Completed game: Quick Thinker
  {
    id: "sub-005",
    gameCode: "DONE404",
    playerId: "user-004",
    items: [
      { category: "animal", answer: "Panda" },
      { category: "country", answer: "Poland" },
      { category: "food", answer: "Popcorn" },
      { category: "colour", answer: "Purple" },
    ],
    createdAt: new Date("2026-10-13T17:05:20"),
  },
];
