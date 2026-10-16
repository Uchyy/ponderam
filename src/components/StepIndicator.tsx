
interface Step {
  index: number;
  label?: string;
}

type StepIndicatorProps = {
  steps: Step[];
  currentStep: number;
};

export default function StepIndicator({ steps, currentStep, }: Readonly<StepIndicatorProps>) {
  return (
    <div className="mb-7 w-full">
      <div className="flex items-center">
        {steps.map((step, position) => {
          const isActive = step.index === currentStep;
          const isCompleted = step.index < currentStep;
          const isLast = position === steps.length - 1;

          return (
            <div
              key={step.index}
              className={`flex items-center ${
                isLast ? "" : "flex-1"
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold transition-all duration-300 ease-out ${
                    isActive
                      ? "scale-110 bg-[#f52d91] text-white shadow-md shadow-pink-200"
                      : isCompleted
                        ? "scale-100 bg-[#f52d91] text-white"
                        : "scale-100 bg-gray-200 text-gray-600"
                  }`}
                >
                  <span
                    key={isCompleted ? "completed" : "number"}
                    className="animate-step-content"
                  >
                    {isCompleted ? "✓" : step.index}
                  </span>
                </div>

                {step.label && (
                  <span
                    className={`mt-2 whitespace-nowrap text-sm transition-colors duration-300 ${
                      isActive
                        ? "font-semibold text-[#f52d91]"
                        : isCompleted
                          ? "font-medium text-gray-700"
                          : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                )}
              </div>

              {!isLast && (
                <div className="mx-2 mb-6 h-0.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full bg-[#f52d91] transition-all duration-500 ease-in-out ${
                      isCompleted ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
