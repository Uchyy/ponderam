
import { avatars } from "../data/avatar";

interface AvatarProps {
  selectedAvatar: string | null;
  onSelect: (avatarId: string) => void;
}

export default function AvatarPicker({ selectedAvatar, onSelect, }: Readonly<AvatarProps>) {
  return (
    <div className="grid max-h-64 lg:max-h-86 grid-cols-3 gap-4 overflow-y-auto scrollbar-hide sm:grid-cols-4 md:grid-cols-5">
      {avatars.map((avatar) => {
        const isSelected = selectedAvatar === avatar.id;

        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            aria-label={`Choose avatar ${avatar.letter}`}
            aria-pressed={isSelected}
            className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-2 p-2 transition hover:-translate-y-1 hover:shadow-md ${
              isSelected
                ? "border-[#f52d91] bg-pink-50 ring-2 ring-pink-200"
                : "border-gray-200 bg-white hover:border-pink-300"
            }`}>
            <img
              src={avatar.file}
              alt={`Letter ${avatar.letter} avatar`}
              className="h-full w-full object-contain"
            />

            {isSelected && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#f52d91] text-xs font-bold text-white">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
