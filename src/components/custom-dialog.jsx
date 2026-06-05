export function CustomDialog({
  children,
  isOpen,
  setIsOpen,
  title = "",
  description = "",
}) {
  return (
    <div
      className={`fixed inset-0 p-2 z-50 flex items-center justify-center bg-black/60 ${
        isOpen ? "visible" : "hidden"
      }`}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-900 max-w-3xl w-[95%] rounded-md shadow-lg p-4  relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          onClick={() => setIsOpen(false)}
          aria-label="Close dialog"
        >
          ✕
        </button>
        {title && (
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
