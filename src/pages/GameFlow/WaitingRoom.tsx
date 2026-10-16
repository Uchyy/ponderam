
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useBlocker } from "react-router-dom";
import { Clock3, Copy, Globe, LockKeyhole, Users, Check, LogOut,} from "lucide-react";

import type { Game } from "../../models/Game";
import { gameRepository } from "../../repo";
import { useAuth } from "../../providers/AuthProviders";
import LetterAvatar from "../../components/LetterAvatar";

export default function WaitingRoom() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const [game, setGame] = useState<Game | null>(null);
  const [loadingGame, setLoadingGame] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const allowNavigation = useRef(false);
  const currentUserId = authUser?.id;

  const activeParticipants = game?.participants.filter((player) => player.leftAt === null) ?? [];

  const currentPlayer = activeParticipants.find(
    (player) => player.id === currentUserId
  );

  const isHost = currentPlayer?.isHost === true;

  const canStartGame =  isHost &&  game?.status === "waiting" &&  activeParticipants.length >= 3 &&  !actionLoading;

  // Load the room and listen for real-time changes.
  useEffect(() => {
    if (!code) {
      setGame(null);
      setLoadingGame(false);
      return;
    }

    let active = true;
    const normalizedCode = code.trim().toUpperCase();

    setLoadingGame(true);
    setGame(null);
    setErrorMessage("");

    const unsubscribe = gameRepository.subscribe(
      normalizedCode,
      (updatedGame) => {
        if (!active) return;

        setGame(updatedGame);
        setLoadingGame(false);
      }
    );

    void gameRepository.getByCode(normalizedCode).then((loadedGame) => {
        if (!active) return;

        setGame(loadedGame);
        setLoadingGame(false);
      }).catch((error: unknown) => {
        if (!active) return;

        console.error("Failed to load game:", error);
        setErrorMessage("Unable to load this room. Please try again.");
        setLoadingGame(false);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [code]);

  // Reset the copied indicator.
  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => {
      setCopied(false);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  // Warn before navigating away from the room.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !allowNavigation.current &&
      currentLocation.pathname.startsWith("/game/") &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state !== "blocked") return;

    const shouldLeave = window.confirm(
      "Are you sure you want to leave this game room?"
    );

    if (shouldLeave) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);

  // Warn if the browser tab is closed or refreshed.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowNavigation.current) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  async function copyCode() {
    if (!game) return;

    try {
      await navigator.clipboard.writeText(game.code);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy room code:", error);
      setErrorMessage("Unable to copy the room code.");
    }
  }

  async function handleLeaveGame() {
    if (!game || !currentUserId || actionLoading) return;

    const message = isHost
      ? "Leaving will cancel this waiting room for everyone. Are you sure?"
      : "Are you sure you want to leave this game room?";

    if (!window.confirm(message)) return;

    setActionLoading(true);
    setErrorMessage("");

    try {
      await gameRepository.leave(game.code, currentUserId);

      allowNavigation.current = true;
      navigate("/lobby", { replace: true });
    } catch (error) {
      console.error("Failed to leave game:", error);
      setErrorMessage("Unable to leave the game. Please try again.");
      setActionLoading(false);
    }
  }

  async function handleStartGame() {
    if (!game || !currentUserId || !canStartGame) return;

    setActionLoading(true);
    setErrorMessage("");

    try {
      const updatedGame = await gameRepository.startCountdown(
        game.code,
        currentUserId
      );

      setGame(updatedGame);
    } catch (error) {
      console.error("Failed to start countdown:", error);
      setErrorMessage( error instanceof Error ? error.message: "Unable to start the game. Please try again." );
    } finally {
      setActionLoading(false);
    }
  }

  if (loadingGame) {
    return (
      <main className="min-h-screen bg-bg px-5 py-16 text-text">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-muted">Loading game room...</p>
        </div>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="min-h-screen bg-bg px-5 py-16 text-text">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading text-3xl">Room not found</h1>
          <p className="mt-3 text-muted">
            {errorMessage ||
              "This room is no longer available. It may have ended or been cancelled."}
          </p>
          <button
            onClick={() => navigate("/lobby", { replace: true })}
            className="mt-6 rounded-full bg-accent px-6 py-3 font-semibold text-white">
            Back to lobby
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-transition min-h-screen bg-bg px-4 py-8 text-text sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Game lobby
          </p>

          <h1 className="mt-3 font-heading text-4xl sm:text-5xl">
            {game.status === "countdown" ? "Get ready!" : "Waiting for players"}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-muted">
            Share your room code with friends and get ready to play.
          </p>
        </header>

        <section className="mt-8 rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <div className="text-center">
            <p className="text-sm text-muted">ROOM CODE</p>

            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="font-mono text-3xl font-bold tracking-[0.2em] sm:text-4xl">
                {game.code}
              </span>

              <button
                onClick={copyCode}
                aria-label={copied ? "Room code copied" : "Copy room code"}
                title={copied ? "Copied!" : "Copy room code"}
                className="rounded-full border border-border p-3 transition hover:border-accent hover:text-accent">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="my-7 border-t border-border" />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-bg p-4">
              <div className="flex items-center gap-2 text-muted">
                <Users size={18} />
                <span className="text-sm">Players</span>
              </div>
              <p className="mt-2 text-xl font-bold">
                {activeParticipants.length} / {game.details.maxPlayers}
              </p>
            </div>

            <div className="rounded-2xl bg-bg p-4">
              <div className="flex items-center gap-2 text-muted">
                {game.details.visibility === "public" ? (
                  <Globe size={18} /> ) : ( <LockKeyhole size={18} />
                )}
                <span className="text-sm">Visibility</span>
              </div>
              <p className="mt-2 text-xl font-bold capitalize">
                {game.details.visibility}
              </p>
            </div>

            <div className="rounded-2xl bg-bg p-4">
              <div className="flex items-center gap-2 text-muted">
                <Clock3 size={18} />
                <span className="text-sm">Duration</span>
              </div>
              <p className="mt-2 text-xl font-bold">
                {game.details.duration} minutes
              </p>
            </div>

            <div className="rounded-2xl bg-bg p-4">
              <p className="text-sm text-muted">Starting letter</p>
              <p className="mt-2 text-xl font-bold">
                {game.details.selectedChar || "Random"}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <h2 className="font-semibold">Selected categories</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {game.details.selectedCategories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-border px-3 py-2 text-sm capitalize">
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Players in the room</h2>
              <span className="text-sm text-muted">
                {activeParticipants.length} joined
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {activeParticipants.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 rounded-2xl border border-border p-3">
                  <LetterAvatar letter={player.avatar} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {player.username}
                      {player.id === currentUserId ? " (You)" : ""}
                    </p>
                    <p className="text-sm text-muted">
                      {player.isHost ? "Host" : "Player"}
                    </p>
                  </div>

                  {player.isHost && (
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="mt-5 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleLeaveGame}
              disabled={actionLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 font-semibold text-text transition hover:border-red-500 hover:text-red-600 disabled:opacity-50 sm:flex-1">
              <LogOut size={18} />
              Leave Game
            </button>

            {isHost && (
              <button
                type="button"
                onClick={handleStartGame}
                disabled={!canStartGame}
                className="w-full rounded-full bg-accent px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 sm:flex-1">

                {actionLoading
                  ? "Please wait..." : game.status === "countdown" ? "Starting..." : canStartGame? "Start Game"
                      : `Waiting for players (${activeParticipants.length}/3 minimum)`}
              </button>
            )}
          </div>

          <p className="mt-7 text-center text-sm text-muted">
            {game.details.autoStartWhenFull
              ? "The game will begin automatically when the room is full, or when the host starts it."
              : "The game will begin when the host starts it."}
          </p>
        </section>
      </div>
    </main>
  );
}
