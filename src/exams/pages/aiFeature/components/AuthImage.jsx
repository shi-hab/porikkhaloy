import { useAiAttachmentQuery } from "@/features/aiFeature/aiAssistantApi";

/** Server theke asha attachment (login lage) -- blob hishebe load kore dekhay. Notun pathano ছবি (blob:) sorasori dekhay. */
export default function AuthImage({ src, onClick, className = "" }) {
  const direct = src.startsWith("blob:") || src.startsWith("data:");
  const { data } = useAiAttachmentQuery(src, { skip: direct });
  const url = direct ? src : data;

  if (!url) return <div className={`animate-pulse bg-gray-200 ${className}`} />;
  return <img src={url} alt="Attachment" onClick={() => onClick?.(url)} className={`cursor-zoom-in object-cover ${className}`} />;
}
