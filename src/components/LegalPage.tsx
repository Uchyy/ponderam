
import { Link } from "react-router-dom";

interface LegalSection {
  heading: string;
  paragraphs: string[];
  links?: {
    label: string;
    href: string;
  }[];
}

interface LegalDocument {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

interface LegalPageProps {
  document: LegalDocument;
}

export default function LegalPage({ document }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <Link
          to="/"
          className="text-sm font-semibold text-gray-500 transition hover:text-[#f52d91]"
        >
          ← Back to Ponderam
        </Link>

        <header className="mt-10 border-b border-gray-200 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f52d91]">
            Ponderam
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            {document.title}
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Last updated: {document.lastUpdated}
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {document.intro}
          </p>
        </header>

        <article className="space-y-9 py-8">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold">
                {section.heading}
              </h2>

              <div className="mt-3 space-y-3 leading-7 text-gray-600">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {section.links?.map((link) => (
                <p key={link.label} className="mt-4">
                  <a
                    href={
                      link.href.startsWith("#")
                        ? `${import.meta.env.BASE_URL}${link.href}`
                        : link.href
                    }
                    className="font-semibold text-[#f52d91] hover:underline"
                  >
                    {link.label} →
                  </a>
                </p>
              ))}
            </section>
          ))}
        </article>

        <div className="border-t border-gray-200 pt-6 text-sm text-gray-500">
          Questions?{" "}
          <a
            href="mailto:hello@ponderam.com"
            className="font-semibold text-[#f52d91] hover:underline"
          >
            hello@ponderam.com
          </a>
        </div>
      </main>
    </div>
  );
}
