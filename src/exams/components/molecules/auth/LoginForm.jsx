import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, EyeOff, Loader2, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderSubmit } from "../../atoms/LoaderSubmit";
import { useCheckAccountMutation, useLoggedInMutation } from "@/features/auth/authApi";
import { useResendVerifyAccountMutation } from "@/features/categories/categoriesApi";
import { getPostAuthRedirect } from "../../utils/authRedirect";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^01[3-9]\d{8}$/;
const normalizePhone = (p = "") => p.replace(/[\s-]/g, "").replace(/^(\+?88)/, "");

/* ---------- "Account পাওয়া যায়নি" modal ---------- */
function NotFoundModal({ kind, value, from, onClose }) {
  const prefill = kind === "phone" ? { phone: value } : { email: value };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="বন্ধ করো"
          className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={16} />
        </button>

        <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-blue-600">
          <UserPlus size={22} />
        </span>
        <h3 className="mt-3 pr-8 text-base font-bold text-slate-900">
          {kind === "phone" ? "এই নাম্বারে" : "এই ইমেইলে"} কোনো একাউন্ট পাওয়া যায়নি
        </h3>
        <p className="mt-1.5 break-all text-sm leading-relaxed text-slate-600">
          <span className="font-semibold text-slate-800">{value}</span> দিয়ে কোনো একাউন্ট খোলা নেই।
        </p>

        <div className="mt-3 grid gap-2 rounded-xl bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-600">
          <p>
            <span className="font-semibold text-slate-800">নতুন হলে:</span> এখনই একাউন্ট খুলে নাও, ১ মিনিটেই হয়ে যাবে।
          </p>
          <p>
            <span className="font-semibold text-slate-800">আগে থেকে একাউন্ট থাকলে:</span> সঠিক ইমেইল বা ফোন নাম্বার দিয়ে আবার চেষ্টা করো।
          </p>
        </div>

        <div className="mt-4 grid gap-2">
          <Link
            to="/registration"
            state={{ from, prefill }}
            className="grid h-10 place-items-center rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 hover:bg-blue-700"
          >
            নতুন একাউন্ট খোলো
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 place-items-center rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            সঠিক ইমেইল / নাম্বার দিই
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Login form ---------- */
const LoginForm = () => {
  const location = useLocation();
  const from = getPostAuthRedirect(location.state, "/dashboard");

  const [showPass, setShowPass] = useState(false);
  const [checking, setChecking] = useState(false);
  const [exists, setExists] = useState(false); // green tick-er jonno
  const [notFound, setNotFound] = useState(null); // { kind, value } | null
  const timer = useRef(null);
  const seq = useRef(0);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({ defaultValues: { identifier: "", password: "" } });

  const [loggedIn, { data, isLoading, error }] = useLoggedInMutation();
  const [resendVerifyAccount] = useResendVerifyAccountMutation();
  const [checkAccount] = useCheckAccountMutation();

  const idv = (watch("identifier") || "").trim();
  const kind = EMAIL_RE.test(idv) ? "email" : PHONE_RE.test(normalizePhone(idv)) ? "phone" : null;

  /* instant account check (debounced) */
  useEffect(() => {
    clearTimeout(timer.current);
    setExists(false);

    if (!kind) {
      seq.current++;
      setChecking(false);
      return;
    }

    const value = kind === "email" ? idv.toLowerCase() : normalizePhone(idv);
    const mySeq = ++seq.current;
    setChecking(true);

    timer.current = setTimeout(async () => {
      try {
        const res = await checkAccount({
          email: kind === "email" ? value : "",
          phone: kind === "phone" ? value : "",
        }).unwrap();
        if (mySeq !== seq.current) return;

        const d = res?.data ?? {};
        const found = kind === "email" ? d.email_exists : d.phone_exists;

        if (found) setExists(true);
        else setNotFound({ kind, value });
      } catch {
        // check fail korle login submit-e server nijei validate korbe
      } finally {
        if (mySeq === seq.current) setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer.current);
  }, [idv, kind, checkAccount]);

  const handleLogin = (f) => {
    loggedIn({ identifier: f.identifier.trim(), password: f.password });
  };

  /* server errors */
  useEffect(() => {
    const res = error?.data;
    if (!res) return;
    const errs = res.errors || {};

    if (errs.identifier === "account_not_found") {
      const v = (watch("identifier") || "").trim();
      const k = EMAIL_RE.test(v) ? "email" : "phone";
      setNotFound({ kind: k, value: k === "email" ? v.toLowerCase() : normalizePhone(v) });
      return;
    }

    Object.keys(errs).forEach((key) => {
      setError(key === "email" ? "root.serverError" : key, {
        type: "server",
        message: errs[key],
      });
    });

    if (!errs.identifier && !errs.password && !errs.email && res.message) {
      setError("root.serverError", { type: "server", message: res.message });
    }
  }, [error, setError, watch]);

  /* analytics */
  useEffect(() => {
    if (data?.data?.token) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ user_id: null, user_email: null, user_phone: null });
      window.dataLayer.push({
        event: "user_login",
        user_id: data?.data?.student?.id,
        user_email: data?.data?.student?.email,
        user_phone: data?.data?.student?.phone,
      });
      // GuestRoute nijei `from`-e redirect korbe
    }
  }, [data]);

  const resendEmail = async () => {
    const res = await resendVerifyAccount({ email: idv });
    if (res.data?.status_code == 200) toast.success(res?.data?.message);
  };

  const closeModal = () => {
    setNotFound(null);
    setTimeout(() => setFocus("identifier"), 50);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleLogin)} noValidate>
        <div className="grid gap-4">
          {/* Email / Phone */}
          <div className="grid gap-1">
            <div className="relative">
              <Input
                {...register("identifier", {
                  required: "ইমেইল বা ফোন নাম্বার লিখো",
                  validate: (val) => {
                    const t = val.trim();
                    return EMAIL_RE.test(t) || PHONE_RE.test(normalizePhone(t)) || "সঠিক ইমেইল বা ফোন নাম্বার দাও";
                  },
                  onChange: () => clearErrors("root.serverError"),
                })}
                type="text"
                inputMode="email"
                autoComplete="username"
                autoCapitalize="none"
                placeholder="ইমেইল অথবা ফোন নাম্বার"
                className="pr-10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <AnimatePresence mode="wait" initial={false}>
                  {checking ? (
                    <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 size={16} className="animate-spin text-slate-400" />
                    </motion.span>
                  ) : exists ? (
                    <motion.span
                      key="ok"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-blue-600"
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </span>
            </div>
            {errors.identifier && <p className="text-sm text-red-600">{errors.identifier.message}</p>}
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <div className="relative">
              <Input
                {...register("password", {
                  required: "পাসওয়ার্ড লিখো",
                  minLength: { value: 8, message: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হবে" },
                })}
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="পাসওয়ার্ড"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? "পাসওয়ার্ড লুকাও" : "পাসওয়ার্ড দেখাও"}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

            <Link
              to="/forgot-password"
              state={{ from, email: kind === "email" ? idv : undefined }}
              className="text-right text-sm text-gray-500 underline"
            >
              পাসওয়ার্ড ভুলে গেছো?
            </Link>
          </div>

          {/* Root / server error */}
          {errors?.root?.serverError?.message && (
            <div className="text-center text-sm text-red-600">
              {errors.root.serverError.message === "Email Not Verified" ? (
                <>
                  <span>ইমেইল ভেরিফাই করা হয়নি।</span>
                  <button type="button" onClick={resendEmail} className="ml-2 text-red-500 underline">
                    পুনরায় ভেরিফিকেশন পাঠাও
                  </button>
                </>
              ) : (
                errors.root.serverError.message
              )}
            </div>
          )}

          <Button disabled={isLoading || checking} className="mt-6">
            {isLoading ? <LoaderSubmit /> : "লগইন করো"}
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {notFound && (
          <NotFoundModal key="nf" kind={notFound.kind} value={notFound.value} from={from} onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginForm;