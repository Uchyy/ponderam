import { ArrowRight, Check, Globe, LockKeyhole, Shuffle } from "lucide-react";
import Stepper from "../../components/Stepper";
import type { GameVisibility } from "../../models/Game";

type CreateGameStep1Props = {
    visibility: GameVisibility;
    setVisibility: (visibility: GameVisibility) => void;
    maxPlayers: number;
    setMaxPlayers: (maxPlayers: number) => void;
    duration: number;
    setDuration: (duration: number) => void;
    selectedChar: string;
    setSelectedChar: (char: string) => void;
    setStep: (step: number) => void
    
}

export default function CreateGameStep1 ( {visibility, setVisibility, maxPlayers, setMaxPlayers, duration, setDuration, selectedChar, setSelectedChar, setStep } : CreateGameStep1Props) {
    return (

        <section className="flex flex-1 flex-col">
            <h1 className="mb-2 text-3xl font-black">
              Let's create your game
            </h1>

            <p className="mb-7 text-muted">
              Set up your room before choosing your categories.
            </p>

            <h2 className="mb-3 font-bold">Room visibility</h2>

            <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  visibility === "public"
                    ? "border-accent bg-pink-50"
                    : "border-border bg-white"
                }`}>
                <Globe size={22} className="shrink-0 text-accent" />
                <span>
                  <span className="block font-bold">Public</span>
                  <span className="text-sm text-muted">
                    Anyone can join
                  </span>
                </span>
                {visibility === "public" && (
                  <Check size={18} className="ml-auto text-accent" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  visibility === "private"
                    ? "border-accent bg-pink-50"
                    : "border-border bg-white"
                }`}>
                <LockKeyhole size={22} className="shrink-0 text-accent" />
                <span>
                  <span className="block font-bold">Private</span>
                  <span className="text-sm text-muted">
                    Invite players with a code
                  </span>
                </span>
                {visibility === "private" && (
                  <Check size={18} className="ml-auto text-accent" />
                )}
              </button>
            </div>

    
            {/* CHOOSE NUMBER OF PLAYERS BUTTON*/}
            <div className="flex flex-col  gap-3">

              <label htmlFor="maxPlayers" className="mb-2 font-bold">
                Maximum players
              </label>

              <p className="mb-3 text-sm text-muted">
                Choose between 4 and 10 players, including yourself.
              </p>  
              
              <Stepper
                label="maximum players"
                value={maxPlayers}
                min={4}
                max={10}
                onChange={setMaxPlayers}
              />
            </div>

            {/* Game duration */}
            <div className="mt-7">
              <label htmlFor="duration" className="mb-2 block font-bold">
                Game duration
              </label>

              <p className="mb-3 text-sm text-muted">
                Choose how long players have to complete their answers.
              </p>

              <Stepper
                label="game duration"
                value={duration}
                min={30}
                max={120}
                step={30}
                onChange={setDuration}
                formatValue={(seconds) =>
                  seconds < 60
                    ? `${seconds} seconds`
                    : `${seconds / 60} ${seconds === 60 ? "minute" : "minutes"}`
                }
              />
            </div>

            {/* Starting character */}
            <div className="mt-7">

              <div className="flex flex-row gap-5">

                <div className="flex-start">
                  <label htmlFor="selectedChar" className="mb-2 block font-bold">
                    Starting character
                  </label>

                  <p className="mb-3 text-sm text-muted">
                    Choose the letter everyone will use, or randomise it.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];

                    setSelectedChar(randomChar);
                  }}
                  aria-label="Randomise starting character"
                  className="flex ml-auto size-12 shrink-0 items-center justify-center rounded-xl border border-border transition hover:border-accent hover:text-accent">
                  <Shuffle size={20} />
                </button>

              </div>

              <Stepper
                label="starting character"
                value={"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(selectedChar)}
                min={0}
                max={25}
                onChange={(index) =>
                  setSelectedChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index])
                }
                formatValue={(index) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index]}
              />
            </div>

            <div className="mt-auto pt-10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-dark px-5 py-3.5 font-bold text-white transition hover:bg-accent">
                Next: Categories
                <ArrowRight size={18} />
              </button>
            </div>
          </section>

    );
}