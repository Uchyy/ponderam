
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronDown, ChevronRight, CircleHelp, House, Info, Layers, Menu, MessageCircle, Scale, Trophy, Users, X, } from "lucide-react";

import Brand from "./Brand";
import InfoDialog from "./InfoDialog";
import { siteContent } from "../data/SiteContent";
import LetterAvatar from "./LetterAvatar";

type DialogKey = | "about" | "features" | "howToPlay" | "markingRules" | "help" | "community";

interface NavbarProps {
  brandTo?: string;
  activePath?: string;
  avatar?: {  label: string;to: string;};
  action?: {
    label: string;
    to: string;
    icon?: ReactNode;
  };
}

const aboutItems: {
  label: string;
  description: string;
  icon: typeof Info;
  dialog: DialogKey;
}[] = [
  {
    label: "About Ponderam",
    description: "Our story and purpose",
    icon: Info,
    dialog: "about",
  },
  {
    label: "Features",
    description: "Discover what you can do",
    icon: Layers,
    dialog: "features",
  },
  {
    label: "How to Play",
    description: "Learn the game",
    icon: BookOpen,
    dialog: "howToPlay",
  },
  {
    label: "Marking Rules",
    description: "Understand the scoring",
    icon: Scale,
    dialog: "markingRules",
  },
  {
    label: "Help & Support",
    description: "Get help when you need it",
    icon: CircleHelp,
    dialog: "help",
  },
];

const dialogTitles: Record<DialogKey, string> = {
  about: "About Ponderam",
  features: siteContent.features.title,
  howToPlay: siteContent.howToPlay.title,
  markingRules: siteContent.markingRules.title,
  help: "Help & Support",
  community: "Join the Community",
};

const dialogDescriptions: Record<DialogKey, string> = {
  about: siteContent.about.description,
  features: siteContent.features.description,
  howToPlay: siteContent.howToPlay.description,
  markingRules: siteContent.markingRules.description,
  help: "Need a hand? Find the game instructions and scoring rules here.",
  community:    "Play, share ideas and connect with other players. Join the conversation and help shape Ponderam.",
};

export default function Navbar({ brandTo = "/", activePath, avatar, action, }: Readonly<NavbarProps>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogKey | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const avatarProfile = avatar?.label.split("-").pop() ?? "";

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setAboutOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAboutOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function openDialog(dialog: DialogKey) {
    setActiveDialog(dialog);
    setAboutOpen(false);
    setMenuOpen(false);
  }

  function navClass(to: string) {
    const active = activePath === to;

    return `inline-flex items-center gap-2 border-b-2 py-2 text-sm font-semibold transition-colors ${
      active
        ? "border-accent text-accent"
        : "border-transparent text-muted hover:border-accent hover:text-accent"
    }`;
  }

  function mobileItemClass() {
    return "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-text transition hover:bg-bg hover:text-accent";
  }

  const dialog = activeDialog;

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12">
          <Link
            to={brandTo}
            aria-label="Ponderam home"
            className="shrink-0">
            <Brand variant="title" background="white" />
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Main navigation">
            <NavLink to={brandTo} className={() => navClass(brandTo)}>
              <House size={17} strokeWidth={1.8} />
              Home
            </NavLink>

            {/* About dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}>
              <button
                type="button"
                aria-expanded={aboutOpen}
                aria-haspopup="menu"
                onClick={() => setAboutOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setAboutOpen(true);
                  }
                }}
                className={`inline-flex items-center gap-2 border-b-2 py-2 text-sm font-semibold transition-colors ${
                  aboutOpen
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:border-accent hover:text-accent"
                }`}>
                <Info size={17} strokeWidth={1.8} />
                About
                <ChevronDown
                  size={15}
                  className={`transition-transform ${
                    aboutOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {aboutOpen && (
                <div
                    role="menu"
                    aria-label="About Ponderam"
                    className="page-transition absolute left-0 top-full z-50 w-72 pt-2">
                    <div className="rounded-2xl border border-border bg-surface p-2 shadow-xl">
                    {aboutItems.map((item) => {
                        const Icon = item.icon;

                        return (
                        <button
                            key={item.dialog}
                            type="button"
                            role="menuitem"
                            onClick={() => openDialog(item.dialog)}
                            className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-bg">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted transition group-hover:border-accent group-hover:text-accent">
                            <Icon size={19} strokeWidth={1.8} />
                            </span>

                            <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-text group-hover:text-accent">
                                {item.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted">
                                {item.description}
                            </span>
                            </span>

                            <ChevronRight
                            size={16}
                            className="text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
                            />
                        </button>
                        );
                    })}
                    </div>
                </div>
                )}
            </div>

            <NavLink
              to="/leaderboard"
              className={() => navClass("/leaderboard")}>
              <Trophy size={17} strokeWidth={1.8} />
              Leaderboard
            </NavLink>

            <button
              type="button"
              onClick={() => openDialog("community")}
              className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-muted transition hover:text-accent">
              <Users size={17} strokeWidth={1.8} />
              Community
            </button>
          </nav>

          {/* Profile and mobile menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {action && (
              <Link
                to={action.to}
                className="hidden items-center gap-2 rounded-full bg-dark px-5 py-3 text-sm font-bold !text-white transition hover:bg-accent sm:inline-flex">
                {action.label}
                {action.icon ?? <ArrowRight size={16} />}
              </Link>
            )}

            {avatar && (
              <Link
                to={avatar.to}
                aria-label={avatar.label}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-bg font-bold text-accent transition hover:border-accent">
                <LetterAvatar letter={avatarProfile} h={10} w={10}/>
              </Link>
            )}

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((open) => !open);
                setAboutOpen(false);
              }}
              className="flex size-10 items-center justify-center rounded-full border border-border text-text transition hover:border-accent hover:text-accent lg:hidden">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <nav
            className="page-transition border-t border-border bg-surface px-4 py-4 sm:px-8 lg:hidden"
            aria-label="Mobile navigation">
            <NavLink
              to={brandTo}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text transition hover:bg-bg hover:text-accent">
              <House size={19} />
              Home
            </NavLink>

            <div className="mt-2 rounded-xl border border-border p-2">
              <button
                type="button"
                aria-expanded={aboutOpen}
                onClick={() => setAboutOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-sm font-semibold text-text hover:text-accent">
                <span className="flex items-center gap-3">
                  <Info size={19} />
                  About
                </span>
                <ChevronDown
                  size={17}
                  className={`transition-transform ${
                    aboutOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {aboutOpen && (
                <div className="page-transition space-y-1 border-t border-border pt-2">
                  {aboutItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.dialog}
                        type="button"
                        onClick={() => openDialog(item.dialog)}
                        className={mobileItemClass()}
                      >
                        <Icon size={18} className="text-accent" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <NavLink
              to="/leaderboard"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text transition hover:bg-bg hover:text-accent">
              <Trophy size={19} />
              Leaderboard
            </NavLink>

            <button
              type="button"
              onClick={() => openDialog("community")}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-text transition hover:bg-bg hover:text-accent">
              <Users size={19} />
              Community
            </button>

            {avatar && (
              <Link
                to={avatar.to}
                onClick={() => setMenuOpen(false)}
                className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text transition hover:bg-bg hover:text-accent">
                <span className="flex size-8 items-center justify-center rounded-full border border-border text-accent">
                  <LetterAvatar letter={avatarProfile}  h={10} w={10}/>
                </span>
                <span>Profile</span>
              </Link>
            )}

            {action && (
              <Link
                to={action.to}
                onClick={() => setMenuOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-dark px-5 py-3 font-bold !text-white transition hover:bg-accent">
                {action.label}
                {action.icon ?? <ArrowRight size={17} />}
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* Information dialogs */}
      <InfoDialog
        open={dialog !== null}
        eyebrow={
          dialog === "community"
            ? "BE PART OF PONDERAM"
            : dialog === "markingRules"
              ? "PLAY FAIR"
              : undefined
        }
        title={dialog ? dialogTitles[dialog] : ""}
        description={dialog ? dialogDescriptions[dialog] : undefined}
        onClose={() => setActiveDialog(null)}>
        {dialog === "about" &&
          siteContent.about.sections.map((section) => (
            <article key={section.title}>
              <h3 className="font-bold">{section.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                {section.description}
              </p>
            </article>
          ))}

        {dialog === "features" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {siteContent.features.items.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-border p-4">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        )}

        {dialog === "howToPlay" && (
          <>
            {siteContent.howToPlay.steps.map((step, index) => (
              <article
                key={step.title}
                className="flex gap-4 rounded-xl border border-border p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}

            <h3 className="pt-2 font-bold">Pro Tips</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              {siteContent.howToPlay.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </>
        )}

        {dialog === "markingRules" && (
          <>
            {siteContent.markingRules.rules.map((rule) => (
              <article
                key={rule.title}
                className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold">{rule.title}</h3>
                  <span className="rounded-full bg-bg px-3 py-1 text-sm font-bold text-accent">
                    {rule.score}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {rule.description}
                </p>
              </article>
            ))}
            <p className="text-center font-semibold text-accent">
              {siteContent.markingRules.reminder}
            </p>
          </>
        )}

        {dialog === "help" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => openDialog("howToPlay")}
              className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left font-semibold transition hover:border-accent">
              <span className="flex items-center gap-3">
                <BookOpen size={19} className="text-accent" />
                How to Play
              </span>
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => openDialog("markingRules")}
              className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left font-semibold transition hover:border-accent">
              <span className="flex items-center gap-3">
                <Scale size={19} className="text-accent" />
                Marking Rules
              </span>
              <ChevronRight size={18} />
            </button>
            <p className="text-sm leading-6 text-muted">
              For questions, suggestions or issues, visit the Ponderam
              community when the community link is available.
            </p>
          </div>
        )}

        {dialog === "community" && (
          <div className="space-y-3">
            <a
              href="https://www.reddit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-border p-4 font-semibold transition hover:border-accent">
              <span className="flex items-center gap-3">
                <MessageCircle size={20} className="text-accent" />
                Join our Reddit community
              </span>
              <ArrowRight size={18} />
            </a>
            <p className="text-sm leading-6 text-muted">
              Follow Ponderam on social media for updates, announcements
              and community news. Official social links will be added here
              as the accounts become available.
            </p>
          </div>
        )}
      </InfoDialog>
    </>
  );
}
