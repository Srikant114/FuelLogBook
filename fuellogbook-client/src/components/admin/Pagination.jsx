import React from "react";

/**
 * Pagination
 * Props:
 *  - currentPage (number)
 *  - totalPages (number)
 *  - onPageChange(pageNumber)
 *  - hideWhenSingle (boolean) // default true -> hides when totalPages <= 1
 *
 * This component follows the UI you provided and is theme-friendly.
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  hideWhenSingle = true,
}) => {
  // If there's nothing to paginate, hide the component (configurable)
  if (hideWhenSingle && (!totalPages || totalPages <= 1)) {
    return null;
  }

  // Small pager generator: show up to 5 pages centered on current
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPages();

  // If pages array is empty for some reason, don't render anything
  if (!pages.length) return null;

  return (
    <div className="flex items-center justify-between w-full text-theme-light dark:text-theme-light font-medium">
      <button
        type="button"
        aria-label="prev"
        className="rounded-full bg-slate-200/50 dark:bg-white/6 p-1"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        {/* prev arrow (keeps your svg) */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="currentColor" stroke="currentColor" strokeWidth=".078"/>
        </svg>
      </button>

      <div className="flex items-center gap-2 text-sm font-medium">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-10 w-10 flex items-center justify-center aspect-square rounded-full ${
              p === currentPage
                ? "!text-white bg-primary border border-primary-dark"
                : "hover:bg-slate-100/60 dark:hover:bg-white/6"
            }`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="next"
        className="rounded-full bg-slate-200/50 dark:bg-white/6 p-1"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        <svg className="rotate-180" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="currentColor" stroke="currentColor" strokeWidth=".078"/>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
