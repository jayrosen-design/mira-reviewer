import { useEffect, useState } from "react";
import type { ReviewerRole } from "./reviewerRole";

const LOGGED_IN_KEY = "mira:loggedIn";
const ROLE_KEY = "mira:reviewerRole";
const EVENT = "mira:auth-change";

export function getStoredRole(): ReviewerRole | null {
  try {
    const raw = localStorage.getItem(ROLE_KEY);
    if (raw === "parent" || raw === "expert" || raw === "researcher") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function getIsLoggedIn(): boolean {
  try {
    return localStorage.getItem(LOGGED_IN_KEY) === "1" && getStoredRole() !== null;
  } catch {
    return false;
  }
}

export function loginAs(role: ReviewerRole) {
  try {
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(LOGGED_IN_KEY, "1");
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function logout() {
  try {
    localStorage.removeItem(LOGGED_IN_KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function useAuth() {
  const [state, setState] = useState<{
    isLoggedIn: boolean;
    role: ReviewerRole | null;
    /** False until localStorage has been read on the client. */
    ready: boolean;
  }>(() => ({ isLoggedIn: false, role: null, ready: false }));

  useEffect(() => {
    const sync = () =>
      setState({ isLoggedIn: getIsLoggedIn(), role: getStoredRole(), ready: true });
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return state;
}

