// authRedirect.js
// Small helper so "return to the page the student was trying to reach"
// survives more than just an in-memory router navigation — it also
// survives a page refresh, a new tab, or a hard redirect to /login,
// none of which react-router's location.state can survive.

const REDIRECT_KEY = "post_auth_redirect";

/** Call this right before sending the student to /login or /register. */
export function setPostAuthRedirect(path) {
    if (!path) return;
    try {
        sessionStorage.setItem(REDIRECT_KEY, path);
    } catch {
        // sessionStorage can throw in private/incognito edge cases — ignore
    }
}

/**
 * Call this inside LoginForm / RegisterForm to figure out where to send
 * the student after a successful auth. Prefers router state (works even
 * across multiple tabs), falls back to sessionStorage (survives reload).
 */
export function getPostAuthRedirect(locationState, fallback = "/dashboard") {
    if (locationState?.from) return locationState.from;
    try {
        return sessionStorage.getItem(REDIRECT_KEY) || fallback;
    } catch {
        return fallback;
    }
}

/** Call this once the student has actually been redirected. */
export function clearPostAuthRedirect() {
    try {
        sessionStorage.removeItem(REDIRECT_KEY);
    } catch {
        // ignore
    }
}