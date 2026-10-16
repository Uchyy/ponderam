import type { Game, GameDetails } from "../../models/Game";
import type { Participant } from "../../models/Participant";
import type { Submission } from "../../models/Submission";
import type { Marks } from "../../models/Marks";
import { supabase } from "../../utils/supabase";
import type { GameRepository } from "../GameRepository";
import type { ArchivedGame } from "../../models/ArchivedGame";

type GameRow = {
  id: string;
  code: string;
  created_by: string;
  created_at: string;
  has_started: boolean;
  has_ended: boolean;
  status: Game["status"];
  started_at: string | null;
  ended_at: string | null;
  countdown_started_at: string | null;
  countdown_ends_at: string | null;
  duration: number;
  max_players: number;
  selected_char: string;
  selected_categories: string[];
  visibility: GameDetails["visibility"];
  auto_start_when_full: boolean;
  participants: Participant[];
};

export class SupabaseGameRepository implements GameRepository {
  private mapParticipant(value: Participant): Participant {
    return {
      ...value,
      joinedAt: new Date(value.joinedAt),
      leftAt: value.leftAt ? new Date(value.leftAt) : null,
    };
  }

  private mapSubmission(row: { id: string; game_code: string; player_id: string; items: Submission["items"]; created_at: string;
    }): Submission {
    return {
      id: row.id,
      gameCode: row.game_code,
      playerId: row.player_id,
      items: row.items,
      createdAt: new Date(row.created_at),
    };
  }

  private mapMarks(row: {
    id: string;
    game_code: string;
    submission_id: string;
    assigned_to: string;
    initial_marker: string;
    marked_by: string | null;
    marked_who: string;
    status: Marks["status"];
    reassignment_history: string[];
    marks: Marks["marks"];
    total_score: number | null;
    assigned_at: string;
    created_at: string | null;
    completed_at: string | null;
  }): Marks {
    return {
      id: row.id,
      gameCode: row.game_code,
      submissionId: row.submission_id,
      assignedTo: row.assigned_to,
      initialMarker: row.initial_marker,
      markedBy: row.marked_by,
      markedWho: row.marked_who,
      status: row.status,
      reassignmentHistory: row.reassignment_history,
      marks: row.marks,
      totalScore: row.total_score,
      assignedAt: new Date(row.assigned_at),
      createdAt: row.created_at ? new Date(row.created_at) : null,
      completedAt: row.completed_at ? new Date(row.completed_at) : null,
    };
  }

  private async mapGame(row: GameRow): Promise<Game> {
    const [submissionResult, marksResult] = await Promise.all([
      supabase.from("submissions").select("*").eq("game_code", row.code),

      supabase.from("marks").select("*").eq("game_code", row.code),
    ]);

    if (submissionResult.error) throw submissionResult.error;
    if (marksResult.error) throw marksResult.error;

    return {
      id: row.id,
      code: row.code,
      createdBy: row.created_by,
      createdAt: new Date(row.created_at),
      hasStarted: row.has_started,
      hasEnded: row.has_ended,
      status: row.status,
      startedAt: row.started_at ? new Date(row.started_at) : null,
      endedAt: row.ended_at ? new Date(row.ended_at) : null,
      countdownStartedAt: row.countdown_started_at ? new Date(row.countdown_started_at) : null,
      countdownEndsAt: row.countdown_ends_at ? new Date(row.countdown_ends_at) : null,
      visibility: row.visibility,

      details: {
        duration: row.duration,
        maxPlayers: row.max_players,
        selectedChar: row.selected_char,
        selectedCategories: row.selected_categories,
        visibility: row.visibility,
        autoStartWhenFull: row.auto_start_when_full,
      },

      participants: (row.participants ?? []).map((participant) =>
        this.mapParticipant(participant)
      ),

      submissions: (submissionResult.data ?? []).map((submission) =>
        this.mapSubmission(submission)
      ),

      markings: (marksResult.data ?? []).map((mark) =>
        this.mapMarks(mark)
      ),
    };
  }

  async getByCode(code: string): Promise<Game | null> {
    const { data, error } = await supabase.from("games").select("*").eq("code", code.trim().toUpperCase()).maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return this.mapGame(data as GameRow);
  }

  async listPublicWaitingGames(): Promise<Game[]> {
    const { data, error } = await supabase.from("games").select("*").eq("visibility", "public").eq("status", "waiting").order("created_at", { ascending: false });

    if (error) throw error;

    return Promise.all(
      (data ?? []).map((row) => this.mapGame(row as GameRow))
    );
  }

  async submitAnswers( code: string, submission: Submission ): Promise<Game> {
    const { error } = await supabase.rpc("submit_submission", {
        p_game_code: code.trim().toUpperCase(),
        p_items: submission.items,
    });

    if (error) throw error;

    const game = await this.getByCode(code);

    if (!game) {
        throw new Error("Game not found after submitting answers.");
    }

    return game;
   }

    async submitMarks( code: string, marking: Marks ): Promise<Game> {
    const { error } = await supabase.rpc("submit_marks", {
        p_mark_id: marking.id,
        p_marks: marking.marks,
    });

    if (error) throw error;

    const game = await this.getByCode(code);

    if (!game) {
        throw new Error("Game not found after submitting marks.");
    }

    return game;
   }

    async finish( code: string, _hostId: string ): Promise<Game> {
        const { error } = await supabase.rpc("finish_game", {
            p_game_code: code.trim().toUpperCase(),
        });

        if (error) throw error;

        const game = await this.getByCode(code);

        if (!game) {
            throw new Error("Game not found after finishing the game.");
        }

        return game;
    }

    async create(input: { host: Participant; details: GameDetails; }): Promise<Game> {
        const { details } = input;

        const { data, error } = await supabase.rpc("create_game", {
            p_duration: details.duration,
            p_max_players: details.maxPlayers,
            p_selected_char: details.selectedChar,
            p_selected_categories: details.selectedCategories,
            p_visibility: details.visibility,
            p_auto_start_when_full: details.autoStartWhenFull,
        });

        if (error) throw error;
        if (!data) throw new Error("Failed to create game.");

        return this.mapGame(data as GameRow);
    }

    async join( code: string, _participant: Participant ): Promise<Game> {
        const { data, error } = await supabase.rpc("join_game", {
            p_code: code.trim().toUpperCase(),
        });

        if (error) throw error;
        if (!data) throw new Error("Failed to join game.");

        return this.mapGame(data as GameRow);
    }

    async leave( code: string, _participantId: string ): Promise<Game | null> {
        // The database UUID is needed by leave_game.
        const currentGame = await this.getByCode(code);

        if (!currentGame) {
            throw new Error("Game not found.");
        }

        const { data, error } = await supabase.rpc("leave_game", {
            p_game_id: currentGame.id,
        });

        if (error) throw error;
        if (!data) throw new Error("Failed to leave game.");

        const updatedGame = await this.mapGame(data as GameRow);

        // The repository contract returns null when leaving
        // causes the room to be cancelled.
        if (updatedGame.status === "cancelled") {
            return null;
        }

        return updatedGame;
    }

    async startCountdown( code: string, _requesterId: string): Promise<Game> {
        const normalizedCode = code.trim().toUpperCase();

        const { error } = await supabase.rpc("start_countdown", {
            p_game_code: normalizedCode,
        });

        if (error) throw error;

        const game = await this.getByCode(normalizedCode);

        if (!game) {
            throw new Error("Game not found after starting countdown.");
        }

        return game;
    }

    async cancel( code: string, _hostId: string, reason: string ): Promise<void> {
        const { error } = await supabase.rpc("cancel_game", {
            p_game_code: code.trim().toUpperCase(),
            p_reason: reason,
        });

        if (error) throw error;
    }

    subscribe( code: string, listener: (game: Game | null) => void ): () => void {
        const roomCode = code.trim().toUpperCase();

        const channel = supabase
            .channel(`game:${roomCode}`)
            .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "games",
                filter: `code=eq.${roomCode}`,
            },
            () => {
                void this.getByCode(roomCode)
                .then(listener)
                .catch(() => listener(null));
            }
            )
            .subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }

    private mapArchivedGame(row: { id: string; game_id: string; code: string; reason: ArchivedGame["reason"]; game_ended_at: string; archived_at: string; }): ArchivedGame {
        return {
            id: row.id,
            gameId: row.game_id,
            code: row.code,
            reason: row.reason,
            gameEndedAt: new Date(row.game_ended_at),
            archivedAt: new Date(row.archived_at),
        };
    }

    async getArchivedByCode( code: string ): Promise<ArchivedGame | null> {
        const { data, error } = await supabase.from("archived_games").select("*").eq("code", code.trim().toUpperCase()).maybeSingle();

        if (error) throw error;
        return data ? this.mapArchivedGame(data) : null;
    }

    async listArchivedGames(): Promise<ArchivedGame[]> {
        const { data, error } = await supabase.from("archived_games").select("*").order("archived_at", { ascending: false });

        if (error) throw error;

        return (data ?? []).map((row) => this.mapArchivedGame(row));
    }

    subscribeLobby( listener: (games: Game[]) => void ): () => void {
        const channel = supabase .channel("public-game-lobby").on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "games",
            },() => {
                void this.listPublicWaitingGames()
                .then(listener)
                .catch((error) => {
                    console.error("Failed to refresh game lobby:", error);
                });
             }
            ).subscribe();

        // Load the initial lobby immediately.
        void this.listPublicWaitingGames().then(listener).catch((error) => {console.error("Failed to load game lobby:", error);});

        return () => {void supabase.removeChannel(channel); };
    }
}