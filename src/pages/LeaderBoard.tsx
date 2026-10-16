
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Trophy } from "lucide-react";

import { leaderboardRepository } from "../repo";
import Pagination from "../components/Pagination";
import LetterAvatar from "../components/LetterAvatar";
import type { LeaderboardEntry, LeaderboardTab } from "../repo/LeaderboardReposiroty";
import Navbar from "../components/Navbar";
import { useUser } from "../providers/UserProvider";
import Footer from "../components/Footer";

const PAGE_SIZE = 10;

export default function Leaderboard() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("ranked");
  const [error, setError] = useState("");
  const { user } = useUser();

  const loadPlayers = useCallback(async (initial = false) => {
    if (initial) {
        setLoading(true);
    } else {
        setRefreshing(true);
    }

    try {
        const results = await leaderboardRepository.getTopPlayers(
        activeTab,
        100
        );

        setPlayers(results);
        setCurrentPage(1);
        setError("");
    } catch (err) {
        console.error("Could not load leaderboard:", err);
        setError("We couldn't load the leaderboard. Please try again.");
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
    }, [activeTab]);

  useEffect(() => {
    void loadPlayers(true);

    const unsubscribe = leaderboardRepository.subscribe(() => {
      void loadPlayers();
    });

    return unsubscribe;
  }, [loadPlayers]);

  const totalPages = Math.ceil(players.length / PAGE_SIZE);

  const paginatedPlayers = players.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="page-transition min-h-screen bg-bg font-body text-text">
          <Navbar
            brandTo="/"
            activePath="/profile"
            avatar={{
              label: user?.avatar || "",
              to: "/profile",
            }}
          />
    
          <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-3xl">
                <header className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                        <Trophy size={32} />
                    </div>

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
                        Ponderam rankings
                    </p>

                    <h1 className="mt-2 font-heading text-3xl font-black sm:text-4xl">
                        Leaderboard
                    </h1>

                    <p className="mt-3 text-muted">
                        Every game counts. Every point matters.
                    </p>
                </header>

                
                <div role="tablist" aria-label="Leaderboard type"
                    className="mb-6 grid grid-cols-2 rounded-2xl border border-border bg-surface p-1">
                    <button
                        type="button"
                        role="tab"
                        id="ranked-tab"
                        aria-selected={activeTab === "ranked"}
                        onClick={() => setActiveTab("ranked")}
                        className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                        activeTab === "ranked"
                            ? "bg-accent text-white"
                            : "text-muted hover:text-text"
                        }`}
                    >
                        Ranked
                    </button>

                    <button
                        type="button"
                        role="tab"
                        id="popular-tab"
                        aria-selected={activeTab === "popular"}
                        onClick={() => setActiveTab("popular")}
                        className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                        activeTab === "popular"
                            ? "bg-accent text-white"
                            : "text-muted hover:text-text"
                        }`}>
                        Popular
                    </button>
                </div>

                <p className="mb-5 text-sm text-muted">
                {activeTab === "ranked"
                    ? "The highest-scoring players in Ponderam."
                    : "The players receiving the most appreciation from the community."}
                </p>


                <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-muted">
                    {players.length} {players.length === 1 ? "player" : "players"}
                </p>

                <button
                    type="button"
                    onClick={() => void loadPlayers()}
                    disabled={loading || refreshing}
                    className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-accent disabled:opacity-50">
                    <RefreshCw
                    size={15}
                    className={refreshing ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
                </div>

                <section
                aria-label="Player leaderboard"
                className="overflow-hidden rounded-2xl border border-border bg-surface">
                {loading ? (
                    <p className="p-10 text-center text-muted">
                    Loading leaderboard...
                    </p>
                ) : error && players.length === 0 ? (
                    <div className="p-8 text-center">
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => void loadPlayers(true)}
                        className="mt-4 rounded-full bg-accent px-5 py-2 font-semibold text-white">
                        Try again
                    </button>
                    </div>
                ) : players.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                    <Trophy className="mx-auto mb-3 text-muted" size={30} />
                    <h2 className="font-bold">The leaderboard is waiting</h2>
                    <p className="mt-1 text-sm text-muted">
                        Play your first game and start earning points!
                    </p>
                    </div>
                ) : (
                    <ol>
                    {paginatedPlayers.map((player, index) => {
                        const rank = (currentPage - 1) * PAGE_SIZE + index + 1;

                        return (
                        <li
                            key={`${player.username}-${rank}`}
                            className="flex items-center gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:gap-4 sm:px-6">
                            <span
                                className={`w-8 shrink-0 text-center font-black ${
                                    rank <= 3 ? "text-accent" : "text-muted"
                                }`}
                                >
                                <LetterAvatar
                                letter={player.avatar}
                                h={10}
                                w={10}
                            />
                            </span>

                            

                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold">
                                    {player.username}
                                </p>
                                {rank === 1 && (
                                    <p className="text-xs text-accent">
                                        {activeTab === "ranked" ? "Top player" : "Most popular"}
                                    </p>
                                )}
                            </div>

                            <p className="shrink-0 text-right font-black tabular-nums">
                                {(activeTab === "ranked"
                                    ? player.total_score
                                    : player.likes
                                ).toLocaleString()}

                                <span className="ml-1 text-xs font-normal text-muted">
                                    {activeTab === "ranked" ? "pts" : "likes"}
                                </span>
                            </p>
                        </li>
                        );
                    })}
                    </ol>
                )}
                </section>

                {!loading && players.length > 0 && (
                <div className="mt-6">
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    />

                    <p className="mt-3 text-center text-xs text-muted">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, players.length)} of{" "}
                    {players.length} players
                    </p>
                </div>
                )}

                {!loading && error && players.length > 0 && (
                <p role="status" className="mt-3 text-center text-xs text-muted">
                    Couldn't refresh the rankings. Showing the last loaded results.
                </p>
                )}
            </div>

            
          </main>

        <Footer/>
    </div>
  );
}
