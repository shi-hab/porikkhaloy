import { MarkdownPreview } from "./MarkdownPreview";
import { parseReactQuill } from "./parseReactQuill";

export const parseHtmlContent = (htmlContent) => {

  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {typeof htmlContent === "string" && htmlContent.trim().startsWith("<p") ? (
        <div>{parseReactQuill(htmlContent)}</div>
      ) : (
        <div>{MarkdownPreview(htmlContent)}</div>
      )}
    </div>
  );
};
