import { Navigate, useLocation } from "react-router-dom";
import { hasToken, useAuth } from "./useAuth";

/*
 * Route wrapper. Redirects to /signup only when the token for `role` is
 * missing; the original location is passed in `state.from` so the login flow
 * can send the visitor back (wired up in Phase 5). A present but invalid token
 * is NOT redirected here: the page's own auth_user / auth_admin check handles it.
 */
export default function RequireAuth({ role = "user", children }) {
  const location = useLocation();
  useAuth(); // re-render when a token appears or disappears
  if (!hasToken(role)) {
    return <Navigate to="/signup" replace state={{ from: location }} />;
  }
  return children;
}
