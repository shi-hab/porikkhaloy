export function EncodeURL(value) {
  try {
    return btoa(String(value)); // Base64 encode
  } catch (err) {
    console.error("EncodeURL error:", err);
    return null;
  }
}
