import type { Marks } from "../models/Marks";
import { sampleSubmissions } from "./SampleSubmissions";

function getSubmissionItems(submissionId: string) {
  return sampleSubmissions.find(
    (submission) => submission.id === submissionId,
  )!.items;
}

export const sampleMarkings: Marks[] = [
  // Word Wizard marks Uchyy's completed submission
  {
    id: "mark-001",
    gameCode: "DONE404",
    submissionId: "sub-003",
    markedBy: "user-002",
    markedWho: "user-001",
    marks: getSubmissionItems("sub-003").map((submission) => ({
      submission,
      score: 10,
    })),
    totalScore: 40,
    createdAt: new Date("2026-10-13T17:06:00"),
  },

  // Quick Thinker marks Word Wizard's submission
  {
    id: "mark-002",
    gameCode: "DONE404",
    submissionId: "sub-004",
    markedBy: "user-004",
    markedWho: "user-002",
    marks: getSubmissionItems("sub-004").map((submission) => ({
      submission,
      score: 10,
    })),
    totalScore: 40,
    createdAt: new Date("2026-10-13T17:06:20"),
  },

  // Uchyy marks Quick Thinker's submission
  {
    id: "mark-003",
    gameCode: "DONE404",
    submissionId: "sub-005",
    markedBy: "user-001",
    markedWho: "user-004",
    marks: getSubmissionItems("sub-005").map((submission) => ({
      submission,
      score: 10,
    })),
    totalScore: 40,
    createdAt: new Date("2026-10-13T17:06:40"),
  },
];
