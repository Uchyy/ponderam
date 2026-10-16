
const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-gray-200 bg-white px-5 py-8 sm:px-8 lg:px-12 ">

      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {currentYear} Ponderam</span>

        <span>v0.1 · Made for curious minds</span>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
          <a href="#rules" className="transition hover:text-[#f52d91]">
            Rules
          </a>

          <a href="/privacy" className="transition hover:text-[#f52d91]">
            Privacy
          </a>

          <a
            href="mailto:hello@ponderam.com"
            className="transition hover:text-[#f52d91]">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
