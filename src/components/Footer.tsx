
import { useState } from "react";
import { Copy, Mail, Coffee } from "lucide-react";

import InfoDialog from "./InfoDialog";
import termsOfService from "../data/terms-of-service.json";
import privacyPolicy from "../data/pirvacy-policy.json";
import { siteContent } from "../data/SiteContent";

type FooterDialog = "rules" | "privacy" | "terms" | "contact" | null ;

const currentYear = new Date().getFullYear();

const footerLinks: { label: string; dialog: Exclude<FooterDialog, null> }[] = [
  { label: "Rules", dialog: "rules" },
  { label: "Privacy Policy", dialog: "privacy" },
  { label: "Terms of Service", dialog: "terms" },
  { label: "Contact", dialog: "contact" },
];

export default function Footer() {
  const [dialog, setDialog] = useState<FooterDialog>(null);
  const [copied, setCopied] = useState(false);

  const dialogTitles: Record<Exclude<FooterDialog, null>, string> = {
    rules: "Rules",
    privacy: privacyPolicy.title,
    terms: termsOfService.title,
    contact: "Contact Ponderam",
  };

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteContent.contactEmail);
      setCopied(true);
    } catch (error) {
      console.error("Could not copy email:", error);
      setCopied(false);
    }
  }

  const legalDocument =
    dialog === "privacy"
      ? privacyPolicy
      : dialog === "terms"
        ? termsOfService
        : null;

  return (
    <footer
      id="about"
      className="border-t border-gray-200 bg-white px-5 py-8 sm:px-8 lg:px-12">

      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {currentYear} Ponderam</span>

        <span>v0.1 · Made for curious minds</span>
        
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {footerLinks.map(({ label, dialog: target }) => (
            <button
              key={target}
              type="button"
              onClick={() => {
                setCopied(false);
                setDialog(target);
              }}
              className="transition hover:text-[#f52d91]"
            >
              {label}
            </button>
          ))}

          {siteContent.buyMeACoffeeUrl && (
            <a
              href={siteContent.buyMeACoffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-[#f52d91]">
              <Coffee size={16} />
              Buy Me a Coffee
            </a>
          )}
        </nav>

      </div>

      <InfoDialog
        open={dialog !== null}
        title={dialog ? dialogTitles[dialog] : ""}
        onClose={() => setDialog(null)}>

        {dialog === "rules" && (
          <>
            {siteContent.markingRules.rules.map((rule) => (
              <article
                key={rule.title}
                className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold">{rule.title}</h3>
                  <span className="rounded-full bg-bg px-3 py-1 text-sm font-bold text-accent">
                    {rule.score}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {rule.description}
                </p>
              </article>
            ))}
            <p className="text-center font-semibold text-accent">
              {siteContent.markingRules.reminder}
            </p>
          </>
        )}

        {legalDocument && (
          <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-2 scrollbar-hide ">
            <p className="text-xs text-muted">
              Last updated: {legalDocument.lastUpdated}
            </p>

            <p className="text-sm leading-6 text-muted">
              {legalDocument.intro}
            </p>

            {legalDocument.sections.map((section) => (
              <section key={section.heading} className="space-y-2">
                <h3 className="font-bold">{section.heading}</h3>

                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm leading-6 text-muted">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        )}

        {dialog === "contact" && (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted">
              Have a question, suggestion, or encountered an issue? We'd
              love to hear from you.
            </p>

            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3">
              <Mail size={20} className="shrink-0 text-accent" />

              <span className="min-w-0 flex-1 break-all font-semibold">
                {siteContent.contactEmail}
              </span>

              <button
                type="button"
                onClick={() => void copyEmail()}
                aria-label="Copy contact email"
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-accent">
                <Copy size={15} />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <a
              href={`mailto:${siteContent.contactEmail}`}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-white transition hover:opacity-90">
              <Mail size={17} />
              Send us an email
            </a>
          </div>
        )}
      </InfoDialog>
    </footer>
  );
}
