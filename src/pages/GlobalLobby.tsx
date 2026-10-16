
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CircleHelp, Clock3, Globe2, Plus, RefreshCw, Search, Users, X,} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Game } from "../models/Game";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useUser } from "../providers/UserProvider";
import { gameRepository, userRepository } from "../repo";
import Pagination from "../components/Pagination";

function GameCard({  game,  onDetails,  onJoin,}: Readonly<{ game: Game; onDetails: (game: Game) => void; onJoin: (game: Game) => void; }>) {

  const playerCount = game.participants.filter( (participant) => participant.leftAt === null).length;
  const isFull = playerCount >= game.details.maxPlayers;

  const categories = game.details.selectedCategories
    .map((category) => category.charAt(0).toUpperCase() + category.slice(1))
    .join(", ");

  return (
    <div className="page-transition w-full rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => onDetails(game)}
          className="min-w-0 flex-1 text-left"
        >
          <h3 className="font-bold text-text">{game.code}</h3>
          <p className="truncate text-sm text-muted">
            {categories || "No categories selected"}
          </p>
        </button>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1.5" title="Players">
            <Users size={16} />
            {playerCount}/{game.details.maxPlayers}
          </span>

          <span className="flex items-center gap-1.5" title="Game duration">
            <Clock3 size={16} />
            {game.details.duration} min
          </span>

          <span className="flex items-center gap-1.5" title="Selected categories">
            <Globe2 size={16} />
            {game.details.selectedCategories.length} categories
          </span>
        </div>

        <button
          type="button"
          onClick={() => onJoin(game)}
          disabled={isFull}
          className="rounded-xl bg-accent px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-24"
        >
          {isFull ? "Full" : "Join"}
        </button>
      </div>
    </div>
  );
}

export default function GlobalLobby() {
  const [search, setSearch] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const navigate = useNavigate();
  const { user, loading } = useUser();

  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  

  const refreshGames = useCallback(async () => {
    try {
      const result = await gameRepository.listPublicWaitingGames();
      setGames(result);
      setNotice("");
    } catch (error) {
      console.error("Could not load public games:", error);
      setNotice("Could not load public games. Please try refreshing.");
    } finally {
      setGamesLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    setGamesLoading(true);

    const unsubscribe = gameRepository.subscribeLobby((updatedGames) => {
      if (!active) return;

      setGames(updatedGames);
      setGamesLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const openGames = useMemo(
    () =>
      games.filter(
        (game) =>
          game.visibility === "public" &&
          game.status === "waiting" &&
          !game.hasStarted &&
          !game.hasEnded
      ),
    [games]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, refreshGames]);

  const totalPages = Math.ceil(openGames.length / PAGE_SIZE);

  const paginatedGames = openGames.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const filteredGames = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return openGames;

    return openGames.filter((game) => {
      const searchableText = [
        game.code,
        ...game.details.selectedCategories,
        ...game.participants
          .filter((participant) => participant.leftAt === null)
          .map((participant) => participant.username),
      ].join(" ").toLowerCase();

      return searchableText.includes(query);
    });
  }, [openGames, search]);

  function handleCreateGame() {
    void navigate("/create-game");
  }

  async function handleJoin(code: string) {
    try {
      if (!user) {
        setNotice("Please sign in to join a game.");
        return;
      }

      const normalizedCode = code.trim().toUpperCase();

      if (!/^[A-Z0-9]{7}$/.test(normalizedCode)) {
        setNotice("Enter a valid seven-character game code.");
        return;
      }

      const game = await gameRepository.getByCode(normalizedCode);

      if (!game) {
        setNotice(`No game was found with code ${normalizedCode}.`);
        return;
      }

      if (
        game.status !== "waiting" ||
        game.hasStarted ||
        game.hasEnded
      ) {
        setNotice("This game is no longer accepting players.");
        return;
      }

      const activePlayers = game.participants.filter( (participant) => participant.leftAt === null ).length;

      if (activePlayers >= game.details.maxPlayers) {
        setNotice("This game is full.");
        return;
      }

      const participant = userRepository.createParticipant(user);

      await gameRepository.join(game.code, participant);

      setShowCodeModal(false);
      setJoinCode("");

      navigate(`/game/${game.code}`);
    } catch (error) {
      console.error("Could not join game:", error);
      setNotice( error instanceof Error ? error.message : "Could not join the game. Please try again.");
      
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg text-text">
        <p className="text-muted">Loading your profile...</p>
      </main>
    );
  }

  return (
    <div className="page-transition min-h-screen bg-bg font-body text-text">
      <Navbar
        brandTo="/"
        activePath="/lobby"
        avatar={{
          label: user?.avatar ?? "",
          to: "/profile",
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section
          className="page-transition relative overflow-hidden rounded-3xl bg-dark bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgb(17 17 17 / 85%), rgb(17 17 17 / 25%)), url("${import.meta.env.BASE_URL}images/ponderam-hero-background.png")`,
          }}>
          <div className="relative z-10 flex min-h-64 flex-col justify-center gap-8 p-6 sm:p-10 lg:min-h-80 lg:p-14">
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                Think fast. Play together.
              </p>

              <h1 className="max-w-lg text-4xl font-black leading-tight text-white sm:text-5xl">
                Same Letters,
                <br />
                Different Minds
                <span className="text-accent">.</span>
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                Find your people, pick a category and see who can think of the
                most answers.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-surface px-4 py-3 text-muted shadow-sm">
                <Search size={20} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search games or categories..."
                  aria-label="Search public games"
                  className="w-full min-w-0 bg-transparent text-text outline-none placeholder:text-muted"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search">
                    <X size={18} />
                  </button>
                )}
              </label>

              <button
                type="button"
                onClick={handleCreateGame}
                className="flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-white transition hover:opacity-90">
                <Plus size={20} />
                Create Game
              </button>

              <button
                type="button"
                onClick={() => setShowCodeModal(true)}
                className="rounded-xl bg-surface px-5 py-3 font-bold text-text transition hover:bg-bg">
                Join with Code
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Open Games <span className="text-muted">(Public)</span>
              </h2>
              <p className="mt-1 text-sm text-muted">
                Jump into a game or find one that suits you.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void refreshGames()}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-text transition hover:bg-bg">
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>

          {notice && (
            <div
              role="status"
              className="page-transition mb-4 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text">
              {notice}
            </div>
          )}

          
          {gamesLoading ? (
            <p className="py-10 text-center text-muted">
              Loading open games...
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {paginatedGames.map((game, index) => (
                <div
                  key={game.id}
                  className={
                    index === 1
                      ? "delay-100"
                      : index === 2
                        ? "delay-200"
                        : ""
                  }
                >
                  <GameCard
                    game={game}
                    onDetails={setSelectedGame}
                    onJoin={(game) => void handleJoin(game.code)}
                  />
                </div>
              ))}
            </div>
          )}

          {!gamesLoading && filteredGames.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
              <Search className="mx-auto mb-3 text-muted" size={30} />
              <h3 className="font-bold">No open games found</h3>
              <p className="mt-1 text-sm text-muted">
                Try another game code or category.
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 font-bold text-accent hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {!gamesLoading && filteredGames.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              <p className="mt-3 text-center text-xs text-muted">
                Showing {((currentPage - 1) * PAGE_SIZE) + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredGames.length)} of{" "}
                {filteredGames.length} games
              </p>
            </div>
          )}

        </section>

        <section className="mt-12 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-bg p-3 text-accent">
              <CircleHelp size={24} />
            </div>
            <div>
              <h2 className="font-bold">Got a private game code?</h2>
              <p className="mt-1 text-sm text-muted">
                Join friends in a private game using their invite code.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCodeModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 font-bold transition hover:border-accent hover:text-accent">
            Enter game code <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <Footer />

      {showCodeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 p-4"
          onClick={() => setShowCodeModal(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-code-title"
            className="page-transition w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl sm:p-8"
            onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="join-code-title" className="text-xl font-black">
                  Join with Code
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Enter the code shared by your friend.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-muted hover:bg-bg hover:text-text"    >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleJoin(joinCode);
              }}>
              <label
                htmlFor="game-code"
                className="mb-2 block text-sm font-bold">
                Game code
              </label>
              <input
                id="game-code"
                value={joinCode}
                onChange={(event) =>
                  setJoinCode(event.target.value.toUpperCase().slice(0, 7))
                }
                placeholder="e.g. PINK101"
                autoComplete="off"
                maxLength={7}
                pattern="[A-Za-z0-9]{7}"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none transition focus:border-accent"
                required
              />

              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-accent px-5 py-3 font-bold text-white transition hover:opacity-90">
                Find Game
              </button>
            </form>
          </section>
        </div>
      )}

      {selectedGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 p-4"
          onClick={() => setSelectedGame(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-details-title"
            className="page-transition w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="game-details-title" className="text-xl font-black">
                  {selectedGame.code}
                </h2>
                <p className="mt-1 text-sm text-muted">Game details</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGame(null)}
                aria-label="Close game details"
                className="rounded-lg p-2 text-muted hover:bg-bg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-muted">
                <Users size={17} />
                {
                  selectedGame.participants.filter(
                    (participant) => participant.leftAt === null
                  ).length
                }{" "}
                of {selectedGame.details.maxPlayers} players
              </p>
              <p className="flex items-center gap-2 text-muted">
                <Clock3 size={17} />
                {selectedGame.details.duration} minutes
              </p>
              <p className="flex items-center gap-2 text-muted">
                <Globe2 size={17} />
                {selectedGame.details.selectedCategories.join(", ")}
              </p>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <h3 className="mb-2 font-bold">Players</h3>
              {selectedGame.participants
                .filter((participant) => participant.leftAt === null)
                .map((participant) => (
                  <p key={participant.id} className="py-1 text-sm text-muted">
                    {participant.username}
                  </p>
                ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const game = selectedGame;
                setSelectedGame(null);
                handleJoin(game.code);
              }}
              disabled={
                selectedGame.participants.filter(
                  (participant) => participant.leftAt === null
                ).length >= selectedGame.details.maxPlayers
              }
              className="mt-5 w-full rounded-xl bg-accent px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
              Join Game
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
