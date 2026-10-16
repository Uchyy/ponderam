
import FormInput from "../../components/Input";
import { sampleUsernameSuggestion } from "../../data/sampleUsernameSuggestions";

type AccountStep2Props = {
  username: string;
  setUsername: (username: string) => void;
  setStep: (step: number) => void;
  continueToAvatar: () => void;
};

export default function AccountStep2({ username, setUsername, setStep, continueToAvatar, }: AccountStep2Props) {
  const validUsername = /^[A-Za-z0-9_]{3,20}$/.test(username);

  return (
    <section className="flex flex-1 flex-col">
      <h2 className="mb-2 text-3xl font-black">
        Choose your username
      </h2>

      <p className="mb-7 text-gray-600">
        This is how other players will see you in Ponderam.
      </p>

      <label htmlFor="username" className="mb-2 font-semibold">
        Username
      </label>

      <FormInput
        id="username"
        name="username"
        autoComplete="nickname"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        maxLength={20}
        placeholder="e.g. UchyyWrites"
        required
        error={
          username.length > 0 && username.length < 3
            ? "Username must be at least 3 characters."
            : false
        }
      />

      <p className="mt-2 text-sm text-gray-500">
        Use 3–20 characters: letters, numbers and underscores.
      </p>

      {username.length > 0 && (
        <p
          className={`mt-3 text-sm ${
            validUsername ? "text-green-600" : "text-red-500"
          }`}
        >
          {validUsername
            ? "Username format looks good."
            : "Please enter a valid username."}
        </p>
      )}

      <div className="grid max-h-64 grid-cols-3 gap-4 scrollbar-hide sm:grid-cols-4 md:grid-cols-5 lg:max-h-86">
        <span className="col-span-full text-sm font-semibold text-gray-600">
          Suggested usernames
        </span>

        {sampleUsernameSuggestion.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setUsername(suggestion)}
            className="w-fit rounded-xl border border-gray-200 bg-dark/20 px-3 py-2 text-sm transition hover:border-[#f52d91] hover:bg-pink-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-10 lg:flex-row">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 font-bold"
        >
          Back
        </button>

        <button
          type="button"
          onClick={continueToAvatar}
          disabled={!validUsername}
          className="flex-1 rounded-xl bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </section>
  );
}
