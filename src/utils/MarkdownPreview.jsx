import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";

export const MarkdownPreview = (markdown) => {
  const text = typeof markdown === "string" ? markdown : "";
  return (
    <div className="porikkhaloy-preview dark:text-gray-100 text-gray-900">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          table: ({ node, ...props }) => (
            <div className="w-full overflow-x-auto mt-[-15px] mb-[0px] pointer-events-auto select-text">
              <table {...props} />
            </div>
          ),
        }}
      >
        {text || "Preview এখানে দেখাবে..."}
      </ReactMarkdown>
    </div>
  );
};