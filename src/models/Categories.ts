import {
  PawPrint,
  MapPin,
  Shapes,
  Apple,
  Music,
  Clapperboard,
  Palmtree,
  ShoppingBag,
  Smile,
  Palette,
  BriefcaseBusiness,
  Accessibility,
  Contact,
  CarFront,
  GlassWater,
  Trophy,
  Languages,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";

export interface GameCategoryOptions {
  isSelected?: boolean;
  isLocal?: boolean;
  isPremium?: boolean;
  isEnabled?: boolean;
}

export class GameCategory {
  name: string;
  icon: LucideIcon;
  info: string;
  isSelected: boolean;
  isLocal: boolean;
  isPremium: boolean;
  isEnabled: boolean;

  constructor({
    name,
    icon,
    info,
    isSelected = false,
    isLocal = false,
    isPremium = false,
    isEnabled = true,
  }: {
    name: string;
    icon: LucideIcon;
    info: string;
  } & GameCategoryOptions) {
    this.name = name;
    this.icon = icon;
    this.info = info;
    this.isSelected = isSelected;
    this.isLocal = isLocal;
    this.isPremium = isPremium;
    this.isEnabled = isEnabled;
  }

  static fromName(  name: string,options: GameCategoryOptions = {},): GameCategory {
    const category = CATEGORY_DATA[name.toLowerCase()];

    return new GameCategory({
      name,
      icon: category?.icon ?? CircleHelp,
      info: category?.info ?? "No description available for this category.", ...options,
    });
  }
}

type CategoryDefinition = {
  icon: LucideIcon;
  info: string;
};

const CATEGORY_DATA: Record<string, CategoryDefinition> = {
  animal: {
    icon: PawPrint,
    info: "Any living creature — domestic or wild.\nFictional creatures don't count.",
  },
  country: {
    icon: MapPin,
    info: "Any country recognized by the UN.",
  },
  thing: {
    icon: Shapes,
    info: "Any physical object that isn't alive — tools, items, or gadgets.",
  },
  "fruits & veg": {
    icon: Apple,
    info: "In English only — fruits and vegetables.",
  },
  song: {
    icon: Music,
    info: "A real song title — no made-up ones!",
  },
  "movie/show": {
    icon: Clapperboard,
    info: "A film or TV show title — animated or live-action.",
  },
  holiday: {
    icon: Palmtree,
    info: "Any celebration or special day, national or cultural.",
  },
  brand: {
    icon: ShoppingBag,
    info: "A brand, product line, or recognizable trademark.",
  },
  emotion: {
    icon: Smile,
    info: "A feeling or mood — like joy, anger, or fear.",
  },
  colour: {
    icon: Palette,
    info: "Any standard or well-known colour name.",
  },
  profession: {
    icon: BriefcaseBusiness,
    info: "A job, trade, or occupation people can have.",
  },
  "body part": {
    icon: Accessibility,
    info: "Any visible or internal part of the human body.",
  },
  name: {
    icon: Contact,
    info: "English only — first name, surname, or famous figure.",
  },
  car: {
    icon: CarFront,
    info: "Any car make or model — real and widely known.",
  },
  drink: {
    icon: GlassWater,
    info: "Beverages — alcoholic, soft, or natural, such as coffee or cola.",
  },
  sports: {
    icon: Trophy,
    info: "Sports only — board games don't count.",
  },
  language: {
    icon: Languages,
    info: "Spoken or written languages — real-world ones only.",
  },
};

export function getCategories(): GameCategory[] {
  return [
    GameCategory.fromName("animal", {
      isSelected: true,
      isPremium: true,
    }),
    GameCategory.fromName("country", {
      isSelected: true,
      isLocal: true,
    }),
    GameCategory.fromName("thing", {
      isSelected: true,
    }),
    GameCategory.fromName("fruits & veg"),
    GameCategory.fromName("song", {
      isSelected: true,
      isPremium: true,
    }),
    GameCategory.fromName("movie/show", {
      isSelected: true,
      isPremium: true,
    }),
    GameCategory.fromName("holiday", {
      //isEnabled: false,
    }),
    GameCategory.fromName("brand", {
     // isEnabled: false,
    }),
    GameCategory.fromName("emotion", {
      isLocal: true,
    }),
    GameCategory.fromName("colour", {
      isLocal: true,
    }),
    GameCategory.fromName("profession", {
     // isEnabled: false,
    }),
    GameCategory.fromName("body part", {
      isLocal: true,
     // isEnabled: false,
    }),
    GameCategory.fromName("name", {
      isEnabled: false,
    }),
    GameCategory.fromName("car", {
      isLocal: true,
    }),
    GameCategory.fromName("drink", {
     // isEnabled: false,
    }),
    GameCategory.fromName("sports", {
      isLocal: true,
    }),
    GameCategory.fromName("language", {
      isSelected: true,
      isLocal: true,
    }),
  ];
}



/**
  
  // Import the function and class
import { getCategories, GameCategory } from "../../data/GameCategory";

// Get all category objects
const categories = getCategories();

// 1. Get the complete category objects
console.log(categories);

// 2. Get just the category names
const categoryNames = categories.map((category) => category.name);

// 3. Get a category's name, icon component, and description
categories.forEach((category) => {
  console.log(category.name);
  console.log(category.icon);
  console.log(category.info);
});

// 4. Find a specific category by name
const animalCategory = categories.find(
  (category) => category.name === "animal",
);

// 5. Get only enabled categories
const enabledCategories = categories.filter(
  (category) => category.isEnabled,
);

// 6. Get only the selected categories
const selectedCategories = categories.filter(
  (category) => category.isSelected,
);

// 7. Create a category object from its name
const category = GameCategory.fromName("animal", {
  isSelected: true,
});

// 8. Get the icon component for rendering in JSX
const Icon = animalCategory?.icon;

// Example rendering
{animalCategory && (
  <div>
    <animalCategory.icon size={20} />
    <h3>{animalCategory.name}</h3>
    <p>{animalCategory.info}</p>
  </div>
)}


  */