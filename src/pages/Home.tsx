
import { useState } from "react";
import { ArrowRight, Play, Users, Timer, Trophy, Heart, Layers, Hourglass, PencilLine, Star,  Globe2, } from "lucide-react";

import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.js";
import InfoDialog from "../components/InfoDialog.js";
import { siteContent } from "../data/SiteContent.js";

const features = [
  {
    icon: Users,
    title: "Multiplayer",
    text: "Play with people worldwide",
  },
  {
    icon: Timer,
    title: "Fast paced",
    text: "Quick and exciting rounds",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    text: "Track your best scores",
  },
  {
    icon: Heart,
    title: "Make friends",
    text: "Like players and join the community",
    pink: true,
  },
];

const steps = [
  {
    icon: Layers,
    title: "Choose categories",
    text: "Pick 4–6 categories and test your knowledge.",
  },
  {
    icon: Hourglass,
    title: "Get a letter",
    text: "Everyone gets the same random letter or you can pick one.",
  },
  {
    icon: PencilLine,
    title: "Beat the clock",
    text: "Fill in a word for each category before time runs out.",
  },
  {
    icon: Star,
    title: "Mark and score",
    text: "Players mark the answers. Score points and see the results.",
  },
];


function Home() {
const [activeDialog, setActiveDialog] = useState< "features" | "howToPlay" | "markingRules" | null >(null);
  return (
    <div
      id="top"
      className="min-h-screen overflow-x-hidden bg-white text-[#111111] page-transition" >
      {/* Header */}
      
      <Navbar
        brandTo="/"
        action={{ label: "Play Ponderam", to: "/create-account" }}
      />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-xs font-bold tracking-[0.16em] text-[#f52d91]">

              <span className="size-2 rounded-full bg-[#f52d91]" />{" "}
              A MULTIPLAYER WORD GAME
            </p>

            <h1 className="max-w-xl text-5xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
              Think fast.
              <br />
              Play{" "}
              <span className="text-[#f52d91]">together.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
              Pick a letter. Beat the clock. See what your mind comes up with.
              Play with friends or meet new Ponderers from around the world.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
              to="/create-account"
                className="inline-flex items-center gap-3 rounded-full bg-dark px-6 py-4 font-bold !text-white shadow-lg shadow-pink/30 transition-all duration-300 hover:bg-pink hover:shadow-xl hover:shadow-pink/50">
                <Play size={17} fill="currentColor" className="shrink-0" />
                <span className="text-white">Play Ponderam</span>
                <ArrowRight size={17} className="shrink-0 text-white" />
              </Link>

              <button
                type="button"
                onClick={() => setActiveDialog("features")}
                className="inline-flex sm:mx-auto items-center gap-2 font-semibold text-muted transition hover:text-accent">
                Explore features
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* Hero artwork */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#171717] sm:aspect-[5/4]">
              <img
                src="/images/ponderam-hero-background.png" 
                alt="Friends enjoying a game together"
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

              <div className="absolute left-6 top-6 text-sm font-black leading-6 tracking-widest text-white sm:left-8 sm:top-8 sm:text-base sm:leading-7">
                SAME
                <br />
                LETTERS
                <br />
                <span className="text-[#f52d91]">DIFFERENT</span>
                <br />
                MINDS <span className="text-[#f52d91]">↗</span>
              </div>

              <span className="absolute right-7 top-7 rotate-12 text-5xl text-[#f52d91]">
                〃
              </span>

              <div className="absolute bottom-7 left-6 text-sm font-black leading-6 tracking-widest text-white sm:bottom-9 sm:left-8 sm:text-base sm:leading-7">
                GOOD
                <br />
                WORDS
                <br />
                <span className="text-[#f52d91]">BETTER</span>
                <br />
                PEOPLE <span className="text-[#f52d91]">♥</span>
              </div>

              <span className="absolute bottom-7 right-7 text-4xl text-[#f52d91]">
                ♛
              </span>
            </div>

            <div className="absolute -bottom-4 -right-2 -z-10 size-28 rounded-full bg-pink-100 sm:-right-5 sm:size-36" />
            <div className="absolute -left-3 -top-3 -z-10 size-20 rounded-3xl border-2 border-[#f52d91] sm:-left-5 sm:-top-5 sm:size-24" />
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          aria-label="Game features"
          className="border-y border-gray-100 bg-gray-50/70">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-6 lg:px-12">
            {features.map(({ icon: Icon, title, text, pink }) => (
              <article key={title} className="flex items-start gap-4">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                    pink ? "bg-pink-100 text-[#f52d91]" : "bg-white text-gray-800 shadow-sm" }`}>
                  <Icon size={27} strokeWidth={2} />
                </div>

                <div>
                  <h2 className="font-bold">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* How to play */}
        <section
          id="how-to-play"
          className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#f52d91]">
                READY, SET, PONDER
              </p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                How to play
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setActiveDialog("markingRules")}
              className="inline-flex items-center gap-2 font-semibold text-muted transition hover:text-accent" >
              See the rules
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className="group rounded-3xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100/50 sm:p-7">
                <div className="mb-7 flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-full bg-pink-50 text-sm font-bold text-[#f52d91]">
                    {index + 1}
                  </span>

                  <Icon
                    size={38}
                    strokeWidth={1.7}
                    className="text-gray-800 transition-colors group-hover:text-[#f52d91]"
                  />
                </div>

                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section id="play" className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
          <div className="relative mx-auto flex max-w-7xl flex-col gap-8 overflow-hidden rounded-[2rem] bg-[#111111] px-6 py-10 text-white sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-16 rotate-12 select-none text-6xl font-black leading-tight tracking-widest text-white/[0.04] sm:right-10 sm:text-8xl">
              SAME
              <br />
              LETTERS
              <br />
              DIFFERENT
              <br />
              MINDS
            </div>

            <div className="relative flex items-center gap-5">
              <Globe2
                size={43}
                strokeWidth={1.5}
                className="shrink-0 text-[#f52d91]"
              />

              <div>
                <h2 className="text-2xl font-black sm:text-3xl">
                  Ready to play?
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-300 sm:text-base">
                  Jump in and meet new Ponderers.
                </p>
              </div>
            </div>

            <Link
              to="/create-account"
              className="relative inline-flex items-center justify-center gap-3 self-start rounded-full bg-[#f52d91] px-6 py-4 font-bold text-white transition hover:bg-[#df197d] lg:self-auto sm:w-full">
              Play Ponderam
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>


      <InfoDialog
        open={activeDialog !== null}
        title={
          activeDialog === "features"? siteContent.features.title : activeDialog === "howToPlay" ? siteContent.howToPlay.title: siteContent.markingRules.title
        }
        description={
          activeDialog === "features"
            ? siteContent.features.description
            : activeDialog === "howToPlay"
              ? siteContent.howToPlay.description
              : siteContent.markingRules.description
        }
        onClose={() => setActiveDialog(null)} >
        {activeDialog === "features" &&
          siteContent.features.items.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-border p-4">
              <h3 className="font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {feature.description}
              </p>
            </article>
          ))}

        {activeDialog === "howToPlay" &&
          siteContent.howToPlay.steps.map((step, index) => (
            <article key={step.title} className="flex gap-4 rounded-xl border border-border p-4">
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

        {activeDialog === "markingRules" &&
          siteContent.markingRules.rules.map((rule) => (
            <article key={rule.title} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold">{rule.title}</h3>
                <span className="text-sm font-bold text-accent">{rule.score}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                {rule.description}
              </p>
            </article>
          ))}
      </InfoDialog>

      <Footer/>

    </div>
  );
}

export default Home;
