import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, lastPage, onChange }) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}