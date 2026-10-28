import { useCallback, useMemo, useSyncExternalStore } from "react";

/*
 * Auth state read from localStorage (keys `user_token` and `admin_token`,
 * unchanged), exposed as a small external store so every component using
 * useAuth() re-renders when a token is set or cleared, with no page reload.
 *
 * Phase 5 (Signup) should call `login(role, token)` after a successful login
 * instead of writing localStorage and calling window.location.reload().
 * Code that still writes localStorage directly can call `notifyAuthChange()`.
 *
 * Precedence matches the old header: a user token wins over an admin token.
 */
const USER_KEY = "user_token";
const ADMIN_KEY = "admin_token";
const KEYS = { user: USER_KEY, admin: ADMIN_KEY };

const listeners = new Set();

function read(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

/* Snapshot is a string ("user", "admin" or ""), so it is stable between reads. */
function getSnapshot() {
  if (read(USER_KEY)) return "user";
  if (read(ADMIN_KEY)) return "admin";
  return "";
}

function getServerSnapshot() {
  return "";
}

function subscribe(listener) {
  listeners.add(listener);
  // Keep other tabs in sync.
  const onStorage = (e) => {
    if (e.key === null || e.key === USER_KEY || e.key === ADMIN_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function notifyAuthChange() {
  listeners.forEach((listener) => listener());
}

export function getToken(role) {
  return read(KEYS[role]);
}

export function hasToken(role) {
  return Boolean(read(KEYS[role]));
}

export function useAuth() {
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback((nextRole, token) => {
    try {
      window.localStorage.setItem(KEYS[nextRole], token);
    } catch (e) {
      /* storage unavailable: nothing to persist */
    }
    notifyAuthChange();
  }, []);

  // Clears only the active role's token, as the old header did.
  const logout = useCallback(() => {
    const active = getSnapshot();
    if (!active) return;
    try {
      window.localStorage.removeItem(KEYS[active]);
    } catch (e) {
      /* ignore */
    }
    notifyAuthChange();
  }, []);

  return useMemo(
    () => ({
      role: role || null,
      isAuthed: role !== "",
      dashboardPath: role === "admin" ? "/admindashboard" : "/userdashboard",
      login,
      logout,
    }),
    [role, login, logout]
  );
}

export default useAuth;
