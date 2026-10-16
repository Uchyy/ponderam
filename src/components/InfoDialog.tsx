
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface InfoDialogProps {
  open: boolean;
  eyebrow?: string;
  title: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function InfoDialog({ open, eyebrow, title, description, onClose, children, }: Readonly<InfoDialogProps>) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-dark/50 p-3 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-dialog-title"
        className="page-transition my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-3xl border border-border bg-surface p-5 shadow-2xl sm:max-h-[85dvh] sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {eyebrow}
              </p>
            )}

            <h2
              id="info-dialog-title"
              className="text-2xl font-bold tracking-tight text-text sm:text-3xl"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition hover:border-accent hover:text-accent"
          >
            <X size={20} />
          </button>
        </div>

        {description && (
          <p className="mb-6 text-sm leading-7 text-muted sm:text-base">
            {description}
          </p>
        )}

        <div className="space-y-4">{children}</div>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full rounded-full bg-dark px-5 py-3 font-bold text-white transition hover:bg-accent"
        >
          Got it
        </button>
      </section>
    </div>,
    document.body,
  );
}
