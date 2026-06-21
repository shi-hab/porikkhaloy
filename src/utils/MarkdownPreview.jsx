import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export const MarkdownPreview = (markdown) => {
  const text = typeof markdown === "string" ? markdown : "";
  return (
    <div className="porikkhaloy-preview ">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex,rehypeRaw]}
        components={{
          table: ({ node, ...props }) => (
            <div className="w-full overflow-x-auto mt-[-15px] mb-[0px] pointer-events-auto select-text">
              <table {...props} />
            </div>
          ),
        }}
      >
        {text || ""}
      </ReactMarkdown>
    </div>
  );
};