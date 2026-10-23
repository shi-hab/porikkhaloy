import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ gfm: true, breaks: true });

// link gulo notun tab e khulbe
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

/** AI er markdown uttor -> safe HTML string (eta parseHtmlContent() e jabe) */
export function renderMarkdown(md = "") {
  const html = marked.parse(md || "");
  return DOMPurify
    .sanitize(html)
    .replace(/<table>/g, '<div class="ai-table"><table>')
    .replace(/<\/table>/g, "</table></div>");
}
