
import { Link } from "react-router-dom";

const backgrounds = {
  transparent: "bg-transparent",
  white: "bg-white",
  pink: "bg-accent",
  dark: "bg-dark",
} as const;

type BrandBackground = keyof typeof backgrounds;

export default function Brand({ className = "",  iconSize = 36,  variant = "title",  background = "transparent",}: Readonly<{
  className?: string; iconSize?: number; variant?: "title" | "icon"; background?: BrandBackground; }>) {
  const imagePath =  variant === "title"  ? "assets/app-title.png"  : "assets/ponderam-icon.png";

  return (
    <Link
      to="/"
      aria-label="Ponderam home"
      className={`inline-flex items-center rounded-lg ${backgrounds[background]} ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}${imagePath}`}
        alt="Ponderam"
        width={variant === "title" ? iconSize * 4 : iconSize}
        height={iconSize * 2}
        className="h-auto max-w-full object-contain"
      />
    </Link>
  );
}
