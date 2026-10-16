import { avatars } from "../data/avatar";

interface LetterAvatarProps {
  letter: string;
  className?: string;
  h?: number;
  w?: number;
}

export default function LetterAvatar({ letter, className = "", h = 14, w = 18, }: Readonly<LetterAvatarProps>) {
  const avatar = avatars.find(
    (item) => item.letter.toLowerCase() === letter.toLowerCase()
  );

  if (!avatar) return null;

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center overflow-visible ${className}`}
      style={{
        height: `${h * 4}px`,
        width: `${w * 4}px`,
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${avatar.file.replace(/^\/+/, "")}`}
        alt={`${avatar.letter} avatar`}
        className="h-full w-full rounded-full object-contain object-center"
      />
    </div>
  );
}