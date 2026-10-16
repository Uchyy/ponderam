
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { userRepository } from "../repo";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign-in...");
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function completeSignIn() {
      const params = new URLSearchParams(location.search);
      const returnTo = params.get("returnTo") || "/lobby";

      // Read any authentication error returned in the URL fragment.
      const fragment = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );

      const authError =
        fragment.get("error_description") ||
        fragment.get("error");

      if (authError) {
        setError(authError);
        setMessage("");
        return;
      }

      try {
        // Supabase's client handles OAuth sessions from the URL
        // when detectSessionInUrl is enabled.
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!data.session) {
          throw new Error(
            "We couldn't confirm your sign-in. Please try again."
          );
        }

        // The profile check will be added in our next step.
        const profile = await userRepository.getById(data.session.user.id);

        if (profile) {
        navigate(returnTo, { replace: true });
        } else {
        navigate("/create-account", {
            replace: true,
            state: {
            returnTo,
            profileSetup: true,
            },
        });
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Sign-in failed. Please try again."
        );
        setMessage("");
      }
    }

    void completeSignIn();
  }, [location.search, navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-5 text-center text-text">
      <h1 className="text-2xl font-bold">
        {error ? "Sign-in unsuccessful" : "Ponderam"}
      </h1>

      {message && <p className="mt-3 text-muted">{message}</p>}

      {error && (
        <>
          <p className="mt-3 max-w-md text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/create-account", { replace: true })}
            className="mt-6 rounded-xl bg-accent px-5 py-3 font-semibold text-white">
            Back to sign in
          </button>
        </>
      )}
    </main>
  );
}
