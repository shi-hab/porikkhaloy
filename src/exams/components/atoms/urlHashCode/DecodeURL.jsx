export function DecodeURL(encoded) {
  try {
    if (!encoded) return null;
    return atob(encoded); // Base64 decode
  } catch (err) {
    console.error("DecodeURL error:", err);
    return null;
  }
}
