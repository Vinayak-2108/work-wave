import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../styles/auth.css";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import { AlertIcon, Button, EyeIcon, EyeOffIcon, Field, Notice, SegmentedControl } from "../components/ui";
import { login_admin, register_admin } from "../controllers/admin";
import { login_user, register_user } from "../controllers/user";
import { useAuth } from "../utils/useAuth";
import { SLIP_KEY } from "../components/site/JobSlip";
import Reveal from "../components/site/Reveal";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

const NETWORK_ERROR =
  "We could not reach WorkWave. Check your connection and try again.";

/* Targets a given role may be sent back to after login (matches RequireAuth). */
const ALLOWED_RETURN = {
  admin: ["/admindashboard"],
  user: ["/userdashboard", "/requestservice"],
};

/* Honour location.state.from only for same-origin internal paths the role can open. */
function returnPath(from, role) {
  const pathname = typeof from === "string" ? from : from && from.pathname;
  if (typeof pathname !== "string" || !pathname.startsWith("/") || pathname.startsWith("//")) return null;
  if (pathname.includes("\\") || /^\/[a-z][a-z0-9+.-]*:/i.test(pathname)) return null;
  const clean = pathname.toLowerCase().replace(/\/+$/, "");
  if (!ALLOWED_RETURN[role].includes(clean)) return null;
  return pathname + (from && typeof from === "object" && from.search ? from.search : "");
}

function hasSlip() {
  try {
    return Boolean(window.sessionStorage.getItem(SLIP_KEY));
  } catch (e) {
    return false;
  }
}

const PasswordField = memo(function PasswordField({ value, onChange, shown, onToggle, autoComplete }) {
  return (
    <Field
      label="Password"
      name="pswd"
      type={shown ? "text" : "password"}
      required
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      endAdornment={
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={shown}
          aria-label={shown ? "Hide password" : "Show password"}
          className="flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-[color,transform] duration-fast ease-out hover:text-action active:translate-y-px"
        >
          {shown ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
        </button>
      }
    />
  );
});

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state && location.state.from;

  // The #chk checkbox stays the state source: checked means "log in".
  const [isLogin, setIsLogin] = useState(Boolean(from));
  const [userType, setUserType] = useState("admin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null); // { kind, text }
  const [phoneError, setPhoneError] = useState("");

  const loginEmailRef = useRef(null);
  const phoneRef = useRef(null);
  const [focusLoginEmail, setFocusLoginEmail] = useState(false);
  const [focusPhone, setFocusPhone] = useState(false);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    document.title = `${isLogin ? "Log in" : "Sign up"} · WorkWave`;
  }, [isLogin]);

  useEffect(() => {
    if (focusLoginEmail && isLogin) {
      if (loginEmailRef.current) loginEmailRef.current.focus();
      setFocusLoginEmail(false);
    }
  }, [focusLoginEmail, isLogin]);

  useEffect(() => {
    if (focusPhone) {
      if (phoneRef.current) phoneRef.current.focus();
      setFocusPhone(false);
    }
  }, [focusPhone]);

  const setMode = useCallback((login_) => {
    setIsLogin(login_);
    setNotice(null);
    setPhoneError("");
  }, []);
  const onChk = useCallback((e) => setMode(e.target.checked), [setMode]);
  const showSignup = useCallback(() => setMode(false), [setMode]);
  const showLogin = useCallback(() => setMode(true), [setMode]);

  const onName = useCallback((e) => setName(e.target.value), []);
  const onEmail = useCallback((e) => setEmail(e.target.value), []);
  const onPassword = useCallback((e) => setPassword(e.target.value), []);
  const onRole = useCallback((e) => {
    setUserType(e.target.value);
    setPhoneError("");
  }, []);
  const onContact = useCallback((v) => {
    setContact(v || "");
    setPhoneError("");
  }, []);
  const togglePassword = useCallback(() => setShowPassword((s) => !s), []);
  const dismiss = useCallback(() => setNotice(null), []);

  /* Runs one request with a single in-flight guard; network failures become a Notice. */
  const run = useCallback(async (task) => {
    if (busy.current) return;
    busy.current = true;
    setSubmitting(true);
    setNotice(null);
    try {
      await task();
    } catch (err) {
      if (mounted.current) setNotice({ kind: "error", text: NETWORK_ERROR });
    } finally {
      busy.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }, []);

  const handleSignup = useCallback(
    (e) => {
      e.preventDefault();
      if (userType === "user" && !contact) {
        setPhoneError("Enter a phone number so we can reach you about your requests.");
        setFocusPhone(true);
        return;
      }
      run(async () => {
        const data =
          userType === "admin"
            ? await register_admin({
                admin_name: name,
                admin_email: email,
                admin_password: password,
              })
            : await register_user({
                user_name: name,
                user_email: email,
                user_password: password,
                user_contact: contact,
              });
        if (!mounted.current) return;
        const message = data && data.message;
        if (typeof message === "string" && /created successfully/i.test(message)) {
          setName("");
          setPassword("");
          setContact("");
          setIsLogin(true);
          setFocusLoginEmail(true);
          setNotice({ kind: "success", text: `${message}. Log in to continue.` });
        } else {
          setNotice({
            kind: "error",
            text: message
              ? `${message}. Check your details and try again.`
              : "We could not create the account. Try again.",
          });
        }
      });
    },
    [userType, contact, name, email, password, run]
  );

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      run(async () => {
        const data =
          userType === "admin"
            ? await login_admin({ admin_email: email, admin_password: password })
            : await login_user({ user_email: email, user_password: password });
        if (!mounted.current) return;
        if (data && data.tag === true && data.token) {
          login(userType, data.token);
          const target =
            returnPath(from, userType) ||
            (userType === "admin"
              ? "/admindashboard"
              : hasSlip()
                ? "/requestservice"
                : "/userdashboard");
          navigate(target, { replace: true });
        } else {
          const reason = data && (data.message || data.msg);
          if (typeof reason === "string" && /invalid credentials/i.test(reason)) {
            setPassword("");
            setNotice({
              kind: "error",
              text: "Email or password is incorrect. Check them and try again.",
            });
          } else {
            setNotice({ kind: "error", text: "Something went wrong. Please try again." });
          }
        }
      });
    },
    [userType, email, password, from, login, navigate, run]
  );

  const noticeEl = useMemo(
    () =>
      notice ? (
        <Notice kind={notice.kind} onDismiss={dismiss}>
          {notice.text}
        </Notice>
      ) : null,
    [notice, dismiss]
  );

  const tabClass = (active) =>
    "flex-1 rounded-pill px-4 font-text text-body font-semibold h-10 " +
    "transition-[background-color,color,transform] duration-fast ease-out active:translate-y-px " +
    (active ? "bg-action text-surface" : "bg-transparent text-ink hover:bg-paper");

  return (
    <div className="site">
      <SiteHeader />
      <main id="main">
        <div className="bg-paper px-margin pb-section pt-14 text-ink md:pt-20">
          <div className="grid w-full gap-x-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
            <Reveal as="h1" className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em]">
              {isLogin ? "Log in" : "Sign up"}
            </Reveal>
            <Reveal as="p" delay={75} className="mt-4 text-lead">
              {isLogin
                ? "Log in to post a job, track its status and pay once it is accepted."
                : "Create a WorkWave account to post a tech job with your own budget."}
            </Reveal>
            <Reveal as="p" delay={150} className="mt-10 hidden max-w-[44ch] text-body lg:block">
              Every request starts as Pending. One person at WorkWave reviews it and
              accepts or rejects it, and you pay through PayPal once it is accepted.
            </Reveal>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">

            {/* State source for the toggle. Kept in the DOM and the tab order is
                served by the two buttons below, so the checkbox itself is skipped. */}
            <input
              type="checkbox"
              id="chk"
              className="sr-only"
              checked={isLogin}
              onChange={onChk}
              tabIndex={-1}
              aria-hidden="true"
            />

            <Reveal
              role="group"
              aria-label="Choose sign up or log in"
              className="mt-8 flex lg:mt-0 gap-1 rounded-pill bg-surface p-1"
            >
              <button type="button" aria-pressed={!isLogin} onClick={showSignup} className={tabClass(!isLogin)}>
                Sign up
              </button>
              <button type="button" aria-pressed={isLogin} onClick={showLogin} className={tabClass(isLogin)}>
                Log in
              </button>
            </Reveal>

            <form
              method="POST"
              onSubmit={handleSignup}
              aria-label="Sign up"
              className={`mt-8 flex-col gap-6 ${isLogin ? "hidden" : "flex"}`}
            >
              <SegmentedControl
                label="I am signing up as"
                name="user_type"
                options={ROLES}
                value={userType}
                onChange={onRole}
                disabled={submitting}
              />
              <Field
                label="Name"
                name="txt"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={onName}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={onEmail}
              />
              {userType === "user" && (
                <div className="auth-phone flex flex-col gap-2">
                  <label htmlFor="contact" className="text-body font-semibold text-ink">
                    Phone
                  </label>
                  <PhoneInput
                    id="contact"
                    ref={phoneRef}
                    autoComplete="tel"
                    placeholder="Phone number"
                    value={contact}
                    onChange={onContact}
                    aria-invalid={phoneError ? true : undefined}
                    aria-describedby={phoneError ? "contact-error" : undefined}
                    data-invalid={phoneError ? "true" : undefined}
                  />
                  {phoneError ? (
                    <p id="contact-error" role="alert" className="flex items-start gap-2 text-small font-semibold text-negative">
                      <AlertIcon size={16} className="mt-0.5 flex-none" />
                      <span>{phoneError}</span>
                    </p>
                  ) : null}
                </div>
              )}
              <PasswordField
                value={password}
                onChange={onPassword}
                shown={showPassword}
                onToggle={togglePassword}
                autoComplete="new-password"
              />
              {!isLogin && noticeEl}
              <Button type="submit" loading={submitting} className="w-full" value="Register">
                {submitting ? "Creating account" : "Sign up"}
              </Button>
            </form>

            <form
              onSubmit={handleLogin}
              aria-label="Log in"
              className={`mt-8 flex-col gap-6 ${isLogin ? "flex" : "hidden"}`}
            >
              <SegmentedControl
                label="I am logging in as"
                name="user_type"
                id="login_type"
                options={ROLES}
                value={userType}
                onChange={onRole}
                disabled={submitting}
              />
              <Field
                ref={loginEmailRef}
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={onEmail}
              />
              <PasswordField
                value={password}
                onChange={onPassword}
                shown={showPassword}
                onToggle={togglePassword}
                autoComplete="current-password"
              />
              {isLogin && noticeEl}
              <Button type="submit" loading={submitting} className="w-full">
                {submitting ? "Logging in" : "Log in"}
              </Button>
            </form>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
