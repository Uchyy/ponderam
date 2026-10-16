
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  ChevronLeft} from "lucide-react";

import Brand from "../../components/Brand";
import StepIndicator from "../../components/StepIndicator";
import type { GameVisibility } from "../../models/Game";
import CreateGameStep1 from "../CreateGame/CreateGameStep1";
import CreateGameStep2 from "../CreateGame/CreateGameStep2";
import CreateGameStep3 from "../CreateGame/CreateGameStep3";
import { useAuth } from "../../providers/AuthProviders";
import { gameRepository, userRepository } from "../../repo";


export default function CreateGame() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [startAutomatic, setStartAutomatic] = useState<boolean>(true);
  const [visibility, setVisibility] = useState<GameVisibility>("public");
  const [duration, setDuration] = useState(60);
  const [selectedChar, setSelectedChar] = useState<string>(() => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  });  

  const { authUser } = useAuth();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


  function continueToReview() {
    if (selectedCategories.length >= 4 && selectedCategories.length <= 6) {
      setStep(3);
    }
  }


  async function createGame() {
    if (creating) return;

    if (selectedCategories.length < 4 || selectedCategories.length > 6) {
      return;
    }

    if (!authUser) {
      navigate("/create-account", {
        state: { returnTo: "/create-game" },
      });
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const profile = await userRepository.getById(authUser.id);

      if (!profile) {
        navigate("/create-account", {
          state: {
            returnTo: "/create-game",
            profileSetup: true,
          },
        });
        return;
      }

      const game = await gameRepository.create({
        host: {
          id: profile.id,
          joinedAt: new Date(),
          leftAt: null,
          connected: true,
          isHost: true,
          username: profile.username,
          avatar: profile.avatar,
          reliability: profile.reliability,
          hasCompletedMarking: false,
        },
        details: {
          duration,
          maxPlayers,
          selectedChar,
          selectedCategories,
          visibility,
          autoStartWhenFull: startAutomatic,
        },
      });

      navigate(`/game/${game.code}`, {state: { game }, });
    } catch (error) {
      console.error("Could not create game:", error);
      setCreateError( error instanceof Error ? error.message : "Something went wrong while creating the game."
      );
    } finally {
      setCreating(false);
    }
  }


  return (
    <main
      className="page-transition min-h-screen bg-bg px-5 py-8 text-text"
      style={{
        backgroundImage: "url('/images/ponderam-hero-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="mx-auto flex min-h-[85vh] w-full max-w-3xl flex-col rounded-3xl bg-white/90 p-5 backdrop-blur-sm sm:p-8">
        <div className="mb-10 flex items-center gap-5">
          <button
            type="button"
            onClick={() => {
              if (step > 1) {
                setStep((current) => current - 1);
              } else {
                void navigate(-1);
              }
            }}
            aria-label="Go back"
            className="rounded-full p-2 transition hover:bg-bg">
            <ChevronLeft size={25} />
          </button>

          <Link to="/" aria-label="Ponderam home">
            <Brand variant="title" background="transparent" />
          </Link>
        </div>

        <StepIndicator
          currentStep={step}
          steps={[
            { index: 1, label: "Basic" },
            { index: 2, label: "Categories" },
            { index: 3, label: "Review" },
          ]}
        />

        {step === 1 && (
          <CreateGameStep1 
            visibility={visibility}
            setVisibility={setVisibility}
            duration={duration}
            setDuration={setDuration}
            maxPlayers={maxPlayers}
            setMaxPlayers={setMaxPlayers}
            selectedChar={selectedChar}
            setSelectedChar={setSelectedChar}
            setStep={setStep}
          />
        )}

        
        {step === 2 && (
          <CreateGameStep2
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            setStep={setStep}
            continueToReview={continueToReview}
          />
        )}

        {step === 3 && (
          <>
            {createError && (
              <p role="alert" className="mb-4 text-sm text-red-600">
                {createError}
              </p>
            )}

            <CreateGameStep3
              visibility={visibility}
              maxPlayers={maxPlayers}
              duration={duration}
              selectedChar={selectedChar}
              selectedCategories={selectedCategories}
              startAutomatic={startAutomatic}
              setStartAutomatic={setStartAutomatic}
              setStep={setStep}
              createGame={createGame}
              creating={creating}
            />
          </>
        )}


      </div>
    </main>
  );
}


