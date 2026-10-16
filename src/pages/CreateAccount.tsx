
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import StepIndicator from "../components/StepIndicator";
import { ChevronLeft } from "lucide-react";
import Brand from "../components/Brand";
import { useAuth } from "../providers/AuthProviders";
import { useSnackbar } from "../components/SnackBar";
import AccountStep1 from "./CreateAccount/AccountStep1";
import AccountStep2 from "./CreateAccount/AccountStep2";
import AccountStep3 from "./CreateAccount/AccountStep3";
import { userRepository } from "../repo";
import { useUser } from "../providers/UserProvider";


export default function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const { snackbar } = useSnackbar();

  const [step, setStep] = useState(() => {
    const state = location.state as { profileSetup?: boolean;} | null;
    return state?.profileSetup ? 2 : 1;
  });

  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const validUsername = /^[A-Za-z0-9_]{3,20}$/.test(username);

  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const { authUser, loading: authLoading, signInWithGoogle, signInWithMagicLink,} = useAuth();
  const {  user , loading: profileLoading,   refreshUser, } = useUser();
 
  async function handleMagicLink() {
    if (!email.trim()) return;

    const state = location.state as {
      returnTo?: string;
      gameCode?: string;
    } | null;

    const returnTo = state?.returnTo ?? "/lobby";

    try {
      await signInWithMagicLink(email.trim(), returnTo);

      setMagicLinkSent(true);
      snackbar.success("Sign-in link sent. Please check your email.");
    } catch (error) {
      console.error("Could not send magic link:", error);

      snackbar.error(
        error instanceof Error
          ? error.message
          : String(error)
      );
    }
  }

  useEffect(() => {
    if (authLoading || profileLoading) return;

    const state = location.state as { returnTo?: string;} | null;
    const returnTo = state?.returnTo ?? "/lobby";

    // Existing profile: skip account setup.
    if (user) {
      navigate(returnTo, { replace: true });
      return;
    }

    // Signed in, but no profile: start username setup.
    if (authUser) {
      setStep((currentStep) =>
        currentStep === 1 ? 2 : currentStep
      );
    }
  }, [ authLoading, profileLoading, authUser, user, location.state, navigate,]);

  async function continueWithGoogle() {
    const state = location.state as {
      returnTo?: string;
      gameCode?: string;
    } | null;

    const returnTo = state?.returnTo ?? "/lobby";

    try {
      await signInWithGoogle(returnTo);
    } catch (error) {
      console.error("Google sign-in failed:", error);

      snackbar.error( error instanceof Error ? error.message : String(error) );
    }
  }

  function continueToAvatar() {
    if (validUsername) setStep(3);
  }

  
  async function finishProfile() {
    if (!validUsername || !selectedAvatar) return;

    if (!authUser) {
      snackbar.error("Please sign in before creating your profile.");
      return;
    }

    try {
      const existingProfile = await userRepository.getById(authUser.id);

      if (existingProfile) {
        await userRepository.update(authUser.id, {
          username,
          avatar: selectedAvatar,
        });
      } else {
        const usernameTaken =
          await userRepository.usernameExists(username);

        if (usernameTaken) {
          snackbar.error("That username is already taken.");
          return;
        }

        await userRepository.create(authUser.id, {
          username,
          avatar: selectedAvatar,
        });
      }
      await refreshUser();

      const state = location.state as {
        returnTo?: string;
        gameCode?: string;
      } | null;

      const returnTo = state?.returnTo ?? "/lobby";

      navigate(returnTo, { replace: true });
    } catch (error) {
      console.error("Could not save profile:", error);

      snackbar.error( error instanceof Error ? error.message : "Could not save your profile. Please try again." );
    }
  }


  return (
    <main className="page-transition delay min-h-screen bg-white px-5 py-8 text-text" style={{
      backgroundImage: `url("${import.meta.env.BASE_URL}images/ponderam-hero-background.png")`,
    }}>
      <div className="mx-auto flex min-h-[85vh] w-full max-w-3xl bg-white/45 p-5 flex-col">
        
        <div className="flex flex-row items-center mb-10 ">
          <Link to="/" className="text-3xl font-black tracking-tight ">
            <ChevronLeft/>
          </Link>

          <Link to="/" className="ml-10 text-2xl font-black tracking-tight ">
            <Brand variant="title" background="transparent" />
          </Link>

        </div>

        <StepIndicator
          currentStep={step}
          
          steps={[
            { index: 1, label: "Continue" },
            { index: 2, label: "Username" },
            { index: 3, label: "Avatar" },
          ]}
        />

        
        {step === 1 && (
          <AccountStep1
            continueWithGoogle={continueWithGoogle}
            handleMagicLink={handleMagicLink}
            email={email}
            setEmail={setEmail}
            magicLinkSent={magicLinkSent}
            setMagicLinkSent={setMagicLinkSent}
          />
        )}
        
        {step === 2 && (
          <AccountStep2
            username={username}
            setUsername={setUsername}
            setStep={setStep}
            continueToAvatar={continueToAvatar}
          />
        )}


        {step === 3 && (
          <AccountStep3 
            setSelectedAvatar={setSelectedAvatar} 
            setStep={setStep}
            selectedAvatar={selectedAvatar} 
            finishProfile={finishProfile} 
          />
        )}
      </div>
    </main>
  );
}
