import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export const parseReactQuill = (htmlContent) => {
  if (!htmlContent) return null;

  const cleanHtml = DOMPurify.sanitize(htmlContent);

  return (
    <div>
      {parse(cleanHtml, {
        replace: (domNode) => {
          if (
            domNode.attribs &&
            domNode.attribs.class?.includes("ql-formula")
          ) {
            const latex = domNode.attribs["data-value"];
            if (latex) {
              return <InlineMath math={latex} />;
            }
          }
        },
      })}
    </div>
  );
};
