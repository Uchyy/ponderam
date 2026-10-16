
import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

export default function FormInput({ error, required, className = "", ...props }: Readonly<FormInputProps>) {
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <input
        {...props}
        required={required}
        aria-invalid={hasError}
        aria-required={required}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
          hasError
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-accent focus:ring-pink-100"
        } ${className}`}
      />

      {hasError && typeof error === "string" && (
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
