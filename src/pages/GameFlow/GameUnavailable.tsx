
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleAlert, Clock, Plus, Search, } from "lucide-react";

type UnavailableReason =
  | "not-found"
  | "countdown"
  | "playing"
  | "finished"
  | "cancelled";

interface UnavailableState {
  reason?: UnavailableReason;
  code?: string;
}

const messages: Record< UnavailableReason, { title: string; description: string } > = {
  "not-found": {
    title: "Game not found",
    description: "We couldn't find a game with that code. Check the link or ask your friend to share it again.",
  },
  countdown: {
    title: "This game is about to start",
    description: "The room is already counting down. You can find another room or create a new game.",
  },
  playing: {
    title: "This game has already started",
    description: "Sorry, this game is no longer accepting players. Find another room and join the fun.",
  },
  finished: {
    title: "This game has ended",
    description: "This game has already finished. Why not start a new one or join another room?",
  },
  cancelled: {
    title: "This game is no longer available",
    description:  "This room has been cancelled. You can return to the lobby or create a new game.",
  },
};

export default function GameUnavailable() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state as UnavailableState | null) ?? null;
  const reason = state?.reason ?? "not-found";
  const message = messages[reason];

  return (
    <main className="page-transition flex min-h-screen items-center justify-center bg-bg px-5 py-12 text-text">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/10 text-accent">
          {reason === "playing" || reason === "countdown" ? (
            <Clock size={36} />
          ) : (
            <CircleAlert size={36} />
          )}
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-accent">
          Game unavailable
        </p>

        <h1 className="mt-3 font-heading text-4xl sm:text-5xl">
          {message.title}
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          {message.description}
        </p>

        {state?.code && (
          <p className="mt-5 text-sm text-muted">
            Room code:{" "}
            <span className="font-mono font-bold tracking-wider text-text">
              {state.code}
            </span>
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigate("/lobby", { replace: true })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-white transition hover:opacity-90"
          >
            <Search size={18} />
            Find a game
          </button>

          <button
            type="button"
            onClick={() => navigate("/create-game")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 font-bold transition hover:border-accent hover:text-accent"
          >
            <Plus size={18} />
            Create a game
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-text"
        >
          <ArrowLeft size={16} />
          Back to home
        </button>
      </div>
    </main>
  );
}
