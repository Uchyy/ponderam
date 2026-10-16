
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../providers/AuthProviders";
import { gameRepository, userRepository } from "../../repo";

export default function GameGateway() {
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!code) {
      navigate("/lobby", { replace: true });
      return;
    }

    let cancelled = false;

    async function checkGame() {
      try {
        const game = await gameRepository.getByCode(code!);

        if (cancelled) return;

        if (!game) {
          navigate("/game-unavailable", {
            replace: true,
            state: { reason: "not-found", code },
          });
          return;
        }

        if (game.status !== "waiting") {
          navigate("/game-unavailable", {
            replace: true,
            state: { reason: game.status, code },
          });
          return;
        }

        if (!authUser) {
          navigate("/create-account", {
            replace: true,
            state: {
              returnTo: location.pathname,
              gameCode: code,
            },
          });
          return;
        }

        const profile = await userRepository.getById(authUser.id);

        if (cancelled) return;

        if (!profile) {
          navigate("/create-account", {
            replace: true,
            state: {
              returnTo: location.pathname,
              gameCode: code,
              profileSetup: true,
            },
          });
          return;
        }

        navigate(`/game/${code}/waiting`, {
          replace: true,
          state: {
            game,
            user: profile,
          },
        });
      } catch (error) {
        if (cancelled) return;

        console.error("Could not load game:", error);

        navigate("/game-unavailable", {
          replace: true,
          state: {
            reason: "load-error",
            code,
          },
        });
      }
    }

    void checkGame();

    return () => {
      cancelled = true;
    };
    }, [
        authUser,
        code,
        loading,
        location.pathname,
        navigate,
    ]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-bg px-5 text-text">
        <p className="text-muted">Checking your game...</p>
        </main>
    );
}
