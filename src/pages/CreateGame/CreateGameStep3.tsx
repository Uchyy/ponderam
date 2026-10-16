
import {
  ArrowRight,
  Globe,
  LockKeyhole,
  Users,
  Clock,
  CaseSensitive,
  Info,
} from "lucide-react";

import { getCategories } from "../../models/Categories";
import type { GameVisibility } from "../../models/Game";

const AVAILABLE_CATEGORIES = getCategories();

type CreateGameStep3Props = {
  visibility: GameVisibility;
  maxPlayers: number;
  duration: number;
  selectedChar: string;
  selectedCategories: string[];
  startAutomatic: boolean;
  setStartAutomatic: (value: boolean) => void;
  setStep: (step: number) => void;
  createGame: () => void | Promise<void>;
  creating: boolean
};

export default function CreateGameStep3({ visibility, maxPlayers, duration, selectedChar, selectedCategories, startAutomatic, setStartAutomatic, setStep, createGame, creating}: CreateGameStep3Props) {
  return (
    <section className="flex flex-1 flex-col">
      <h1 className="mb-2 text-3xl font-black">
        Review your game
      </h1>

      <p className="mb-7 text-muted">
        Check your settings before creating the game.
      </p>

      <div className="space-y-5 rounded-2xl border border-border bg-white p-5">
        {/* Visibility */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {visibility === "public" ? (
              <Globe size={20} className="text-accent" />
            ) : (
              <LockKeyhole size={20} className="text-accent" />
            )}

            <span className="text-muted">Visibility</span>
          </div>

          <span className="font-bold capitalize">{visibility}</span>
        </div>

        <div className="border-t border-border" />

        {/* Maximum players */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-accent" />
            <span className="text-muted">Maximum players</span>
          </div>

          <span className="font-bold">{maxPlayers} players</span>
        </div>

        <div className="border-t border-border" />

        {/* Duration */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-accent" />
            <span className="text-muted">Game duration</span>
          </div>

          <span className="font-bold">
            {duration < 60 ? `${duration} seconds` : `${duration / 60} ${
                  duration === 60 ? "minute" : "minutes"
                }`}
          </span>
        </div>

        <div className="border-t border-border" />

        {/* Starting character */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CaseSensitive size={20} className="text-accent" />
            <span className="text-muted">Starting character</span>
          </div>

          <span className="flex size-10 items-center justify-center rounded-xl bg-pink-50 text-xl font-black text-accent">
            {selectedChar}
          </span>
        </div>

        <div className="border-t border-border" />

        {/* Selected categories */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-bold">Selected categories</h2>

            <span className="text-sm text-muted">
              {selectedCategories.length} selected
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {selectedCategories.map((categoryName) => {
              const category = AVAILABLE_CATEGORIES.find(
                (item) => item.name === categoryName
              );

              const Icon = category?.icon;

              return (
                <div
                  key={categoryName}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-white p-3 text-center">
                  {Icon && (
                    <Icon size={22} className="text-accent" />
                  )}

                  <span className="text-xs font-semibold capitalize sm:text-sm">
                    {categoryName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Automatic start */}
      <div className="mt-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={startAutomatic}
            onChange={(event) =>
              setStartAutomatic(event.target.checked)
            }
            className="sr-only"
          />

          <span
            className={`flex h-5 w-5 items-center justify-center rounded border transition ${
              startAutomatic
                ? "border-accent bg-accent text-white"
                : "border-dark bg-dark/10"
            }`}
            aria-hidden="true">
            {startAutomatic && "✓"}
          </span>

          <span className="text-sm font-medium text-text">
            Start automatically when the room is full
          </span>
        </label>
      </div>

      {/* Information */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-bg p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />

        <p className="text-sm leading-relaxed text-muted">
          <span className="font-semibold text-text">
            Please note:
          </span>{" "}
          Game details cannot be changed after creation. If you need to
          make changes, you'll have to cancel the current game and create
          a new one with your preferred settings.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex-1 rounded-xl border border-border bg-white px-4 py-3 font-bold transition hover:border-accent">
          Back
        </button>

        <button
          type="button"
          onClick={() => void createGame()}
          disabled={creating}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-dark px-4 py-3 font-bold text-white transition hover:bg-accent">
            {creating ? "Creating game..." : "Create Game"}
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

