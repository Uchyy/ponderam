
export const siteContent = {
  about: {
    eyebrow: "GET TO KNOW US",
    title: "Same Letters, Different Minds.",
    description:
      "Ponderam brings people together through words, categories, quick thinking and friendly competition.",
    sections: [
      {
        title: "Think differently",
        description:
          "Everyone gets the same categories and letter, but the answers can be wonderfully different.",
      },
      {
        title: "Play your way",
        description:
          "Challenge yourself solo or play with friends using game codes.",
      },
      {
        title: "Keep it fun and fair",
        description:
          "Earn points for valid answers and use the marking rules to score responses fairly.",
      },
    ],
  },

  howToPlay: {
    eyebrow: "HOW TO PLAY",
    title: "Think fast. Fill it in.",
    description:
      "Choose your categories, find words that fit the starting letter, beat the clock and score points.",
    steps: [
      {
        title: "Pick your categories",
        description:
          "Choose 4–6 categories to shape your round.",
      },
      {
        title: "Get your letter",
        description:
          "Every answer must fit its category and begin with the selected letter.",
      },
      {
        title: "Beat the clock",
        description:
          "Complete your answers before the game timer runs out.",
      },
      {
        title: "Play solo or multiplayer",
        description:
          "Practise alone or challenge friends using game codes.",
      },
      {
        title: "Get ready to start",
        description:
          "In multiplayer, the host can start the game, or the countdown begins automatically when the room reaches capacity. Everyone gets a 10-second countdown before the game starts.",
      },
      {
        title: "Stay connected",
        description:
          "When the countdown ends, disconnected players are removed. If the host is disconnected, a connected player takes over as host. At least two connected players are required for a multiplayer game to start.",
      },
      {
        title: "Score points",
        description:
          "Earn 1 point for a valid answer, 0.5 points for an eligible partial answer, and 0 points for an incorrect or blank answer.",
      },
    ],
    tips: [
      "Think of common words first, then get creative!",
      "Make sure your answers fit the category and start with the correct letter.",
      "Stay connected while waiting for a multiplayer game to begin.",
      "Practise solo to sharpen your skills.",
    ],
  },

  markingRules: {
    title: "Marking Rules",
    description:
      "Give every answer a fair and consistent score.",
    rules: [
      {
        icon: "check",
        title: "Full marks",
        description:
          "Award full marks when the answer is valid, fits the category and begins with the required letter.",
        score: "1 point",
      },
      {
        icon: "partial",
        title: "Partial marks",
        description:
          "Award half a point when an answer is a reasonable partial match or has a minor spelling mistake that still makes the intended answer clear.",
        score: "0.5 points",
      },
      {
        icon: "incorrect",
        title: "Zero marks",
        description:
          "Award zero for a blank or incorrect answer, or one that does not fit the category or starting letter. For example, 'foppy' is not a valid animal answer.",
        score: "0 points",
      },
    ],
    reminder:
      "Keep it fun and fair. Apply the same marking standards to everyone.",
  },

  features: {
    eyebrow: "WHAT YOU CAN DO",
    title: "Your game. Your strategy.",
    description:
      "Choose how you play, think on your feet and make every answer count.",
    items: [
      {
        title: "Choose your categories",
        description:
          "Pick 4–6 categories to shape your round.",
        icon: "layers",
      },
      {
        title: "Race against time",
        description:
          "Complete your answers before the timer runs out.",
        icon: "clock",
      },
      {
        title: "Solo or multiplayer",
        description:
          "Practise alone or challenge friends with game codes.",
        icon: "users",
      },
      {
        title: "Fair scoring",
        description:
          "Award full, partial or zero marks according to the marking rules.",
        icon: "trophy",
      },
    ],
  },

  recommendations: {
    eyebrow: "YOUR VOICE MATTERS",
    title: "Help shape Ponderam.",
    description:
      "Have an idea, a question or something you'd love to see in the game? Share it with the community.",
    discussions: [
      {
        title: "Suggest a feature",
        description:
          "Tell the community what you'd love to see added.",
      },
      {
        title: "Ask a question",
        description:
          "Start a conversation about the game.",
      },
      {
        title: "Report an issue",
        description:
          "Explain a problem and help improve the experience.",
      },
    ],
    redditUrl: "",
  },
} as const;
