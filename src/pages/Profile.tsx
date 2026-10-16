
import { useState } from "react";
import { CalendarDays, Coins, Flame, Gamepad2, LogOut, Pencil, Save, ShieldCheck, Trophy, X,} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LetterAvatar from "../components/LetterAvatar";
import { useUser } from "../providers/UserProvider";
import { useAuth } from "../providers/AuthProviders";
import { supabase } from "../utils/supabase";
import { userRepository } from "../repo";
import { useSnackbar } from "../components/SnackBar";
import AvatarPicker from "../components/AvatarPicker";

export default function Profile() {
  const { user, loading, refreshUser } = useUser();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const { snackbar } = useSnackbar();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    const nextUsername = username.trim();
    const nextAvatar = avatar.trim().toUpperCase();

    if (nextUsername.length < 3 || nextUsername.length > 20) {
      setError("Your username must be between 3 and 20 characters.");
      return;
    }

    if (!/^[A-Za-z0-9_]+$/.test(nextUsername)) {
      setError("Use only letters, numbers and underscores in your username.");
      return;
    }

    if (!nextAvatar) {
      setError("Please enter an avatar letter.");
      snackbar.error(" Please enter an avatar letter.")
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (nextUsername.toLowerCase() !== user.username.toLowerCase()) {
        if (await userRepository.usernameExists(nextUsername)) {
          setError("That username is already taken.");
          snackbar.error("That username is already taken.");
          return;
        }
      }

      await userRepository.update(user.id, {
        username: nextUsername,
        avatar: nextAvatar,
      });

      await refreshUser();

      setEditing(false);
      setNotice("Your profile has been updated.");
      snackbar.success("Your profile has been updated.");
    } catch (err) {
      console.error("Could not update profile:", err);
      setError( err instanceof Error ? err.message : "Could not update your profile. Please try again.");
      snackbar.error( err instanceof Error ? err.message : "Could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing() {
    if (!user) return;

    setUsername(user.username);
    setAvatar(user.avatar);
    setError("");
    setNotice("");
    setEditing(true);
  }

  async function handleSignOut() {
    setSigningOut(true);
    setError("");

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Could not sign out:", err);
      setError("Could not sign out. Please try again.");
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg text-text">
        <p className="text-muted">Loading your profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-5 text-center text-text">
        <h1 className="font-heading text-3xl font-bold">
          Profile unavailable
        </h1>
        <p className="max-w-md text-muted">
          We couldn't find your Ponderam profile. Please sign in or complete
          your profile setup.
        </p>
        <button
          type="button"
          onClick={() => navigate("/create-account")}
          className="rounded-full bg-accent px-6 py-3 font-bold text-white">
          Continue to account
        </button>
      </main>
    );
  }

  const avatarProfile = user.avatar;

  const stats = [
    {
      label: "Coins",
      value: user.coins,
      icon: Coins,
    },
    {
      label: "Play streak",
      value: user.streak,
      icon: Flame,
    },
    {
      label: "Total score",
      value: user.total_score,
      icon: Trophy,
    },
    {
      label: "Reliability",
      value: user.reliability,
      icon: ShieldCheck,
    },
    {
      label: "Solo games",
      value: user.soloIds.length,
      icon: Gamepad2,
    },
    {
      label: "Multiplayer games",
      value: user.multiplayerIds.length,
      icon: Gamepad2,
    },
  ];

  return (
    <div className="page-transition min-h-screen bg-bg font-body text-text">
      <Navbar
        brandTo="/"
        activePath="/profile"
        avatar={{
          label: user.avatar,
          to: "/profile",
        }}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Your account
          </p>
          <h1 className="mt-2 font-heading text-3xl font-black sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-muted">
            Manage your identity and keep track of your progress.
          </p>
        </header>

        {notice && (
          <p
            role="status"
            className="mb-5 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            {notice}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <LetterAvatar letter={avatarProfile} h={10} w={10} />

              <div className="min-w-0">
                <h2 className="break-words text-2xl font-black">
                  {user.username}
                </h2>
                <p className="mt-1 break-all text-sm text-muted">
                  {authUser?.email ?? "Email unavailable"}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <CalendarDays size={14} />
                  Member since{" "}
                  {user.createdAt.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="sm:ml-auto">
              {!editing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 font-semibold transition hover:border-accent hover:text-accent">
                  <Pencil size={17} />
                  Edit profile
                </button>
              )}
            </div>
          </div>

          {editing && (
            <form
              onSubmit={handleSaveProfile}
              className="mt-7 space-y-5 border-t border-border pt-6">
              <div>
                <label
                  htmlFor="profile-username"
                  className="mb-2 block text-sm font-semibold">
                  Username
                </label>
                <input
                  id="profile-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  minLength={3}
                  maxLength={20}
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-border bg-bg px-4 py-3 outline-none focus:border-accent"
                />
                <p className="mt-1 text-xs text-muted">
                  3–20 characters. Letters, numbers and underscores only.
                </p>
              </div>

              <div>
                <label
                  htmlFor="profile-avatar"
                  className="mb-2 block text-sm font-semibold">
                  Avatar
                </label>
                <div className="flex items-center gap-3">
                    <AvatarPicker
                        selectedAvatar={editing ? avatar : user.avatar}
                        onSelect={setAvatar}
                    />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50">
                  <Save size={17} />
                  {saving ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setEditing(false);
                    setError("");
                    setUsername(user.username);
                    setAvatar(user.avatar);
                  }}
                  className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-bg disabled:opacity-50"
                >
                  <X size={17} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-black sm:text-2xl">
              Your progress
            </h2>
            <p className="mt-1 text-sm text-muted">
              Your current Ponderam statistics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={21} />
                </div>
                <p className="text-2xl font-black">
                  {value.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-bold">Recent activity</h2>

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm text-muted">
              {user.lastPlayedDate
                ? `Last played ${user.lastPlayedDate.toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}.`
                : "Your game activity will appear here once you start playing."}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-bold">Account</h2>
          <p className="mt-1 text-sm text-muted">
            Sign out of your Ponderam account on this device.
          </p>

          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="mt-4 flex items-center justify-center gap-2 rounded-full border border-red-300 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut size={17} />
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
