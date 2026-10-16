
import { Mail, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

type AccountStep1Props = {
  continueWithGoogle: () => void;
  handleMagicLink: () => void;
  email: string;
  setEmail: (email: string) => void;
  magicLinkSent: boolean;
  setMagicLinkSent: (sent: boolean) => void;
};

export default function AccountStep1({ continueWithGoogle, handleMagicLink, email, setEmail, magicLinkSent, setMagicLinkSent,}: AccountStep1Props) {

  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl bg-cover bg-center sm:px-3 px-6 text-center">
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-cover bg-center px-6 text-center">
        <div className="absolute inset-0 bg-white/45" />

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="mb-3 pt-5 text-3xl font-black">
            Think fast. Play together.
          </h2>

          <p className="mb-8 max-w-sm text-gray-600">
            Join Ponderam and challenge your friends in the
            ultimate word game.
          </p>
        </div>
      </div>

      {/* Google sign-in */}
      <button
        type="button"
        onClick={continueWithGoogle}
        className="mx-auto flex w-full max-w-lg items-center justify-center gap-3 rounded-xl border border-gray-300 bg-dark px-5 py-3 font-bold text-white shadow-sm transition hover:opacity-90"  >
        <svg
          viewBox="0 0 48 48"
          className="h-5 w-5 shrink-0"
          aria-hidden="true">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>

        <span className="text-sm lg:text-base">
          Continue with Google
        </span>
      </button>

      {/* Email sign-in */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            Or continue with email
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        {magicLinkSent ? (
          <div className="rounded-2xl border border-border bg-bg p-5 text-center sm:w-full">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-accent">
              <MailCheck className="h-6 w-6" />
            </div>

            <h3 className="font-semibold text-text">
              Check your inbox
            </h3>

            <p className="mt-2 text-sm text-muted">
              If an account can be signed in with this address,
              you'll receive an email with instructions. Check your
              spam folder too.
            </p>

            <p className="mt-3 break-all text-sm font-medium text-text">
              {email}
            </p>

            <button
              type="button"
              onClick={() => setMagicLinkSent(false)}
              className="mt-4 text-sm font-semibold text-accent transition hover:underline">
              Try another email
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleMagicLink();
            }}
            className="space-y-3 w-full"
          >
            <label htmlFor="magic-link-email" className="sr-only">
              Email address
            </label>

            <input
              id="magic-link-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
            />

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              <Mail className="h-5 w-5" />
              Continue with email
            </button>

            <p className="text-center text-xs leading-5 text-muted">
              We'll email you a secure sign-in link. No password needed.
            </p>
          </form>
        )}
      </div>

      {/* Legal links */}
      <p className="mt-10 text-xs leading-5 text-gray-500">
        By continuing, you agree to our{" "}
        <Link to="/terms" className="font-bold underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="font-bold underline">
          Privacy Policy
        </Link>.
      </p>
    </section>
  );
}
