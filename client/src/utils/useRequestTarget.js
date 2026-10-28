import { useAuth } from "./useAuth";

/*
 * Destination of every "Request a service" call to action:
 * /requestservice for a signed-in client, /admindashboard for an admin,
 * /signup for guests. The header's own Signup button does not use this.
 */
export function useRequestTarget() {
  const { role } = useAuth();
  if (role === "user") return "/requestservice";
  if (role === "admin") return "/admindashboard";
  return "/signup";
}

export default useRequestTarget;
