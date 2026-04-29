"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { login, signup } from "@/actions/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SocialLogin } from "@/components/auth/SocialLogin";


// ---------------------------------------------------------------------------
// Submit button — must be a separate component so useFormStatus can read
// the pending state of the enclosing <form>.
// ---------------------------------------------------------------------------
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full cta-gradient text-on-primary font-bold py-4 rounded-full shadow-lg hover:opacity-90 transform active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending && (
        <svg
          className="animate-spin h-5 w-5 text-on-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {pending ? "Please wait…" : label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function LoginPage() {
  // Toggle between "Sign In" and "Sign Up" modes without a separate route.
  const [mode, setMode] = useState<"login" | "signup">("login");

  // useActionState wires the server action to a state object.
  // The third argument (null) is the initial state — i.e. no error.
  const [loginState, loginAction] = useActionState(login, null);
  const [signupState, signupAction] = useActionState(signup, null);

  const isLogin = mode === "login";
  const activeAction = isLogin ? loginAction : signupAction;

  // Derive error and check-email state from action responses
  const loginError = loginState?.error;
  const signupError = (signupState && 'error' in signupState) ? signupState.error : undefined;
  const activeError = isLogin ? loginError : signupError;

  // When signup succeeds and email verification is required
  const checkEmail = signupState && 'pending' in signupState && signupState.pending === 'check_email'
    ? signupState.email
    : null;

  return (
    <>
      {/* TopAppBar */}
      <header className="w-full top-0 sticky bg-background z-50 transition-colors duration-300">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary tracking-tight font-headline">
              StudyHive
            </span>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 md:p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
          {/* Side: Brand Area */}
          <div className="relative hidden md:flex flex-col items-center justify-center p-12 text-center paper-texture border-r border-outline-variant/20">
            <div className="relative z-10 max-w-sm">
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/80 backdrop-blur-sm rounded-full text-primary font-bold text-sm shadow-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-sm" data-icon="auto_awesome">
                    auto_awesome
                  </span>
                  <span>Curating Knowledge Daily</span>
                </div>
              </div>
              <h1 className="font-headline text-2xl font-bold text-primary mb-4 tracking-tight">
                StudyHive
              </h1>
              <h2 className="font-headline text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight">
                Organize by topic, <br />
                <span className="text-primary">conquer by Track.</span>
              </h2>
              <p className="mt-8 text-on-surface-variant text-lg leading-relaxed font-medium">
                Join 50,000+ students organizing their academic life in the
                digital atelier of focus.
              </p>
            </div>
          </div>

          {/* Side: Auth Form */}
          <div className="bg-surface-container-lowest p-8 md:p-16 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">

              {/* ── Check-email screen (shown after successful signup) ──────── */}
              {checkEmail ? (
                <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-primary text-4xl">mark_email_unread</span>
                  </div>
                  <div>
                    <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Check your inbox</h2>
                    <p className="text-on-surface-variant font-body">
                      We&apos;ve sent a verification link to
                    </p>
                    <p className="font-bold text-primary mt-1 break-all">{checkEmail}</p>
                  </div>
                  <div className="bg-surface-container-high rounded-2xl p-5 text-left space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">check_circle</span>
                      <p className="text-sm text-on-surface-variant">Open the email from <span className="font-semibold text-on-surface">StudyHive</span></p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">check_circle</span>
                      <p className="text-sm text-on-surface-variant">Click the <span className="font-semibold text-on-surface">Confirm your email</span> link</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">check_circle</span>
                      <p className="text-sm text-on-surface-variant">You&apos;ll be redirected to your dashboard automatically</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant/60">
                    Didn&apos;t receive it? Check your spam folder or{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => window.location.reload()}
                    >
                      try again
                    </button>
                    .
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center md:text-left">
                    <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
                      {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-on-surface-variant font-body">
                      {isLogin
                        ? "Please enter your details to access your hive."
                        : "Start your academic journey with StudyHive."}
                    </p>
                  </div>

              {/* Error banner */}
              {activeError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="mb-6 px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm font-medium"
                >
                  {activeError}
                </div>
              )}

              <form className="space-y-6" action={activeAction}>
                {/* Google Login */}
                <SocialLogin />

                <div className="relative flex items-center py-2">
                  <div className="grow border-t border-outline-variant/30"></div>
                  <span className="shrink mx-4 text-outline text-xs uppercase tracking-widest">
                    or email
                  </span>
                  <div className="grow border-t border-outline-variant/30"></div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Username (Signup Only) */}
                  {!isLogin && (
                    <div>
                      <label
                        className="block text-sm font-medium text-on-surface-variant mb-1.5 ml-1"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-200 placeholder:text-outline"
                        id="username"
                        name="username"
                        placeholder="academic_scholar"
                        type="text"
                        autoComplete="username"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div>
                    <label
                      className="block text-sm font-medium text-on-surface-variant mb-1.5 ml-1"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-200 placeholder:text-outline"
                      id="email"
                      name="email"
                      placeholder="curator@studyhive.edu"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5 ml-1">
                      <label
                        className="block text-sm font-medium text-on-surface-variant"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      {isLogin && (
                        <a
                          className="text-xs text-tertiary hover:underline"
                          href="#"
                        >
                          Forgot Password?
                        </a>
                      )}
                    </div>
                    <input
                      className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-200 placeholder:text-outline"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      required
                    />
                  </div>

                  {/* Confirm Password (Signup Only) */}
                  {!isLogin && (
                    <div>
                      <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label
                          className="block text-sm font-medium text-on-surface-variant"
                          htmlFor="confirmPassword"
                        >
                          Confirm Password
                        </label>
                      </div>
                      <input
                        className="w-full px-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-200 placeholder:text-outline"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        autoComplete="new-password"
                        required={!isLogin}
                      />
                    </div>
                  )}
                </div>

                {/* Action Button — uses SubmitButton so useFormStatus works */}
                <SubmitButton label={isLogin ? "Sign In" : "Create Account"} />
              </form>

              <div className="mt-8 text-center">
                <p className="text-on-surface-variant text-sm">
                  {isLogin ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        className="text-primary font-bold hover:underline ml-1"
                        onClick={() => setMode("signup")}
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-primary font-bold hover:underline ml-1"
                        onClick={() => setMode("login")}
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
                </div>
              </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-background border-t-0 transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
          <div className="text-on-surface-variant/60 font-body text-xs tracking-wide">
            © 2024 StudyHive. Secured by Academic Encryption.
          </div>
          <div className="flex gap-6">
            <a
              className="text-on-surface-variant/60 font-body text-xs tracking-wide transition-colors hover:text-primary"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-surface-variant/60 font-body text-xs tracking-wide transition-colors hover:text-primary"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-on-surface-variant/60 font-body text-xs tracking-wide transition-colors hover:text-primary"
              href="#"
            >
              Security Standards
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
