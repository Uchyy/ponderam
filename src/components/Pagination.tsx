
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export default function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1,}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  const firstPage = 1;
  const lastPage = totalPages;

  const startPage = Math.max( firstPage,currentPage - siblingCount);
  const endPage = Math.min( lastPage, currentPage + siblingCount );

  pages.push(firstPage);

  if (startPage > firstPage + 1) {
    if (startPage > firstPage + 2) {
      pages.push("ellipsis");
    } else {
      pages.push(firstPage + 1);
    }
  }

  for (let page = Math.max(2, startPage); page <= Math.min(totalPages - 1, endPage); page++) {
    pages.push(page);
  }

  if (endPage < lastPage - 1) {
    if (endPage < lastPage - 2) {
      pages.push("ellipsis");
    } else {
      pages.push(lastPage - 1);
    }
  }

  if (lastPage > firstPage) {
    pages.push(lastPage);
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40" >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="flex h-10 w-8 items-center justify-center text-muted"   >
            <MoreHorizontal size={18} />
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition ${
              currentPage === page
                ? "border-accent bg-accent text-white"
                : "border-border hover:border-accent hover:text-accent"
            }`}>
            {page}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40">
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
