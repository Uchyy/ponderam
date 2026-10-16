
import AvatarPicker from "../../components/AvatarPicker";

type AccountStep3Props = {
  selectedAvatar: string | null;
  setSelectedAvatar: (avatar: string) => void;
  setStep: (step: number) => void;
  finishProfile: () => void;
};

export default function AccountStep3({ selectedAvatar, setSelectedAvatar, setStep, finishProfile, }: AccountStep3Props) {
  return (
    <section className="flex flex-1 flex-col">
      <h2 className="mb-2 text-3xl font-black">
        Pick your character
      </h2>

      <p className="mb-6 text-gray-600">
        Choose an illustrated alphabet character to represent you.
      </p>

      <div className="rounded-2xl border border-dashed border-gray-300 p-4 text-center">
        <AvatarPicker
          selectedAvatar={selectedAvatar}
          onSelect={setSelectedAvatar}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-10 lg:flex-row">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 font-bold">
          Back
        </button>

        <button
          type="button"
          onClick={finishProfile}
          disabled={!selectedAvatar}
          className="flex-1 rounded-xl bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40">
          Create my profile
        </button>
      </div>
    </section>
  );
}
