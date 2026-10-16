
import { getCategories } from "../../models/Categories";

const AVAILABLE_CATEGORIES = getCategories();

type CreateGameStep2Props = {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  setStep: (step: number) => void;
  continueToReview: () => void;
};

export default function CreateGameStep2({ selectedCategories, setSelectedCategories, setStep, continueToReview, }: CreateGameStep2Props) {

  function toggleCategory(categoryName: string) {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== categoryName)
      );
      return;
    }

    if (selectedCategories.length >= 6) return;

    setSelectedCategories([...selectedCategories, categoryName]);
  }

  const enabledCategories = AVAILABLE_CATEGORIES.filter(
    (category) => category.isEnabled
  );

  return (
    <section className="flex flex-1 flex-col">
      <h1 className="mb-2 text-3xl font-black">
        Choose categories
      </h1>

      <p className="mb-6 text-muted">
        Select 4–6 categories for this game.
      </p>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {AVAILABLE_CATEGORIES.map((category) => {
          const checked = selectedCategories.includes(category.name);
          const disabled =
            !category.isEnabled ||
            (!checked && selectedCategories.length >= 6);
          const Icon = category.icon;

          return (
            <label
              key={category.name}
              title={category.name}
              className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition ${
                checked ? "border-accent bg-pink-50 text-accent" : "border-border bg-white hover:border-accent"
              } ${
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}>
              <input
                type="checkbox"
                checked={checked}
                disabled={!category.isEnabled}
                onChange={() => toggleCategory(category.name)}
                className="sr-only"
              />

              <Icon size={24} aria-hidden="true" />

              <span className="hidden text-sm font-medium capitalize sm:block">
                {category.name}
              </span>

              <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-dark px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 sm:hidden">
                {category.name}
              </span>

              {checked && (
                <span className="absolute right-1 top-1 size-2 rounded-full bg-accent" />
              )}
            </label>
          );
        })}
      </div>

      <p className="mt-3 text-sm text-muted">
        {selectedCategories.length} of {enabledCategories.length} categories selected
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 rounded-xl border border-border bg-white px-4 py-3 font-bold">
          Back
        </button>

        <button
          type="button"
          onClick={continueToReview}
          disabled={ selectedCategories.length < 4 || selectedCategories.length > 6}
          className="flex-1 rounded-xl bg-dark px-4 py-3 font-bold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40">
          Review game
        </button>
      </div>
    </section>
  );
}
