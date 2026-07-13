const SKIN_CLASS_REGEX =
  /^(dark:)?(bg-|border(?:-|$)|text-(?!left|center|right|justify)|font-(?!sans|serif|mono)|rounded|shadow|ring|decoration-|p[trblxy]?-)/;
function splitButtonClassName(className = "") {
  const tokens = className.split(/\s+/).filter(Boolean);
  const layout = [];
  const discarded = [];

  for (const token of tokens) {
    if (SKIN_CLASS_REGEX.test(token)) {
      discarded.push(token);
    } else {
      layout.push(token);
    }
  }

  // Dev-only heads up, so legacy usages get noticed & cleaned up over time
  if (process.env.NODE_ENV !== "production" && discarded.length > 0) {
    console.warn(
      `[Button] Ignored skin classes (use the "variant" prop instead): ${discarded.join(", ")}`
    );
  }

  return layout.join(" ");
}

export default splitButtonClassName;