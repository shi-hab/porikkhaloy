import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Phone,
  School,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useCheckAccountMutation,
  useLoggedInMutation,
  useRegistrationMutation,
} from "@/features/auth/authApi";
import { loggedIn } from "@/features/auth/authSlice";
import { useGetCategoryQuery } from "@/features/categories/categoriesApi";
import { useCategoryData } from "@/exams/components/molecules/filterquesforexam/useCategoryData";
import { getPostAuthRedirect, setPostAuthRedirect } from "@/exams/components/utils/authRedirect";
import {
  EMAIL_RE,
  PHONE_RE,
  getTargetOptions,
  groupKind,
  isActive,
  label,
  makeBatches,
  normalizePhone,
  sectionKind,
  toIds,
} from "@/exams/pages/studentDashboard/components/Academicconfig";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const STEPS = [
  { key: "basic", short: "পরিচয়", title: "তোমার পরিচয়", sub: "নাম, ইমেইল আর ফোন নাম্বার দাও", fields: ["name", "email", "phone"] },
  { key: "class", short: "ক্লাস", title: "তুমি কোন ক্লাসে?", sub: "সেকশন, গ্রুপ আর মাধ্যম বেছে নাও", fields: ["section", "group", "level"] },
  { key: "goal", short: "লক্ষ্য", title: "তোমার লক্ষ্য কী?", sub: "সেই অনুযায়ী প্রস্তুতি সাজিয়ে দেব", fields: ["target"] },
  { key: "security", short: "পাসওয়ার্ড", title: "পাসওয়ার্ড সেট করো", sub: "কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দাও", fields: ["password", "password_confirmation"] },
];

const FIELD_MAP = { section_id: "section", group_id: "group", level_id: "level" };
const stepOfField = (f) => STEPS.findIndex((s) => s.fields.includes(f));

const STRENGTH = [
  { t: "", c: "bg-slate-200" },
  { t: "দুর্বল", c: "bg-red-500" },
  { t: "মোটামুটি", c: "bg-amber-400" },
  { t: "ভালো", c: "bg-sky-500" },
  { t: "শক্তিশালী", c: "bg-blue-600" },
];
const strengthOf = (p = "") => {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.max(1, s);
};

/* ------------------------------------------------------------------ */
/* Motion presets                                                      */
/* ------------------------------------------------------------------ */

const stepVariants = {
  enter: (d) => ({ opacity: 0, x: d * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -28 }),
};

const popIn = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 500, damping: 26 },
};

const riseIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: "easeOut" },
};

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

// The answer-sheet bubble: the one memorable motif of this form.
function StepBubble({ state, onDark }) {
  const tone = onDark
    ? {
        done: "border-white bg-white text-blue-700",
        current: "border-white ring-4 ring-white/20",
        todo: "border-white/30",
      }
    : {
        done: "border-blue-600 bg-blue-600 text-white",
        current: "border-blue-600 ring-4 ring-blue-600/15",
        todo: "border-slate-300",
      };
  return (
    <motion.span
      animate={{ scale: state === "current" ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300",
        tone[state]
      )}
    >
      <AnimatePresence initial={false}>
        {state === "done" && (
          <motion.span key="c" {...popIn} className="grid place-items-center">
            <Check size={13} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

const inputCls = (error, left = "pl-10") =>
  cn(
    "h-10 rounded-lg border bg-white pr-10 text-sm text-slate-900 placeholder:text-sm placeholder:text-slate-400",
    "focus-visible:ring-2 focus-visible:ring-offset-0 transition-shadow",
    left,
    error
      ? "border-red-400 focus-visible:ring-red-200"
      : "border-slate-200 hover:border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
  );

function Field({ icon: Icon, label: text, error, valid, children }) {
  return (
    <div className="grid gap-1">
      {text && <label className="text-[13px] font-medium text-slate-700">{text}</label>}

      <div className="group relative">
        <Icon
          size={16}
          className={cn(
            "pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 transition-colors",
            error ? "text-red-500" : "text-slate-400 group-focus-within:text-blue-600"
          )}
        />

        {children}

        <AnimatePresence>
          {valid && !error && (
            <motion.span
              key="ok"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute inset-y-0 right-3 z-10 flex items-center text-blue-600"
            >
              <motion.span {...popIn} className="grid place-items-center">
                <Check size={16} strokeWidth={2.5} />
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Choice({ selected, onClick, title, desc, icon: Icon }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        selected
          ? "border-blue-600 bg-blue-50 shadow-[0_0_0_1px_theme(colors.blue.600)]"
          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
      )}
    >
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full border-2 transition-colors",
          selected ? "border-blue-600 bg-blue-600" : "border-slate-300"
        )}
        style={{ height: 18, width: 18 }}
      >
        {selected && (
          <motion.span {...popIn} className="grid place-items-center text-white">
            <Check size={11} strokeWidth={3.5} />
          </motion.span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-tight text-slate-900">{title}</span>
        {desc && <span className="mt-0.5 block truncate text-[11px] leading-tight text-slate-500">{desc}</span>}
      </span>
      {Icon && <Icon size={18} className={selected ? "text-blue-600" : "text-slate-300"} />}
    </motion.button>
  );
}

function Skeletons({ n = 4 }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="h-[46px] animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

function SectionTitle({ children, hint }) {
  return (
    <h3 className="text-[13px] font-semibold text-slate-700">
      {children} {hint && <span className="font-normal text-slate-400">{hint}</span>}
    </h3>
  );
}

function Modal({ children, onClose }) {
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
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করো"
            className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        )}
        {children}
      </motion.div>
    </div>
  );
}

const primaryBtn =
  "grid h-10 place-items-center rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition-colors hover:bg-blue-700 disabled:opacity-70";

/* ------------------------------------------------------------------ */
/* "Account already exists" popup                                      */
/* ------------------------------------------------------------------ */

function ExistingAccountModal({ kind, email, from, onClose }) {
  const [loginRequest, { isLoading }] = useLoggedInMutation();
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const doLogin = async (e) => {
    e.preventDefault();
    if (!pw) return setErr("পাসওয়ার্ড লিখো");
    setErr("");
    setPostAuthRedirect(from);
    try {
      // login API expects `identifier` (email or phone)
      await loginRequest({ identifier: email, password: pw }).unwrap();
      toast.success("লগইন সফল! স্বাগতম 👋");
    } catch (e2) {
      setErr(e2?.data?.errors?.password || e2?.data?.message || "পাসওয়ার্ড ঠিক হয়নি, আবার চেষ্টা করো");
    }
  };

  if (kind === "phone") {
    return (
      <Modal onClose={onClose}>
        <h3 className="pr-8 text-base font-bold text-slate-900">এই নাম্বারে আগে থেকেই একাউন্ট আছে</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          নতুন একাউন্ট না খুলে আগের একাউন্টে লগইন করো। পাসওয়ার্ড মনে না থাকলে রিসেট করে নিতে পারবে।
        </p>
        <div className="mt-4 grid gap-2">
          <Link to="/login" state={from ? { from } : undefined} className={primaryBtn}>
            লগইন করো
          </Link>
          <Link
            to="/forgot-password"
            className="grid h-9 place-items-center rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            পাসওয়ার্ড ভুলে গেছো?
          </Link>
          <button type="button" onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800">
            অন্য নাম্বার দেব
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="pr-8 text-base font-bold text-slate-900">তোমার একাউন্ট আগে থেকেই আছে</h3>
      <p className="mt-1.5 break-all text-sm leading-relaxed text-slate-600">
        <span className="font-semibold text-slate-800">{email}</span> দিয়ে একাউন্ট খোলা আছে। পাসওয়ার্ড দিলেই লগইন হয়ে যাবে।
      </p>
      <form onSubmit={doLogin} className="mt-3 grid gap-2.5">
        <Field icon={Lock} error={err}>
          <Input
            autoFocus
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="তোমার পাসওয়ার্ড"
            autoComplete="current-password"
            className={inputCls(err)}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "পাসওয়ার্ড লুকাও" : "পাসওয়ার্ড দেখাও"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </Field>
        <button type="submit" disabled={isLoading} className={primaryBtn}>
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : "লগইন করো"}
        </button>
        <Link
          to="/forgot-password"
          state={{ email }}
          className="text-center text-sm font-semibold text-blue-600 hover:underline"
        >
          পাসওয়ার্ড মনে নেই? রিসেট করো
        </Link>
        <button type="button" onClick={onClose} className="text-center text-xs text-slate-500 hover:text-slate-800">
          অন্য ইমেইল দিয়ে খুলব
        </button>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Success modal                                                       */
/* ------------------------------------------------------------------ */

const CONFETTI = Array.from({ length: 14 }).map((_, i) => {
  const a = (i / 14) * Math.PI * 2;
  const d = 70 + (i % 3) * 22;
  return {
    x: Math.round(Math.cos(a) * d),
    y: Math.round(Math.sin(a) * d),
    r: (i % 2 ? 1 : -1) * (90 + i * 20),
    c: ["#2563eb", "#38bdf8", "#1e3a8a"][i % 3],
  };
});

function SuccessModal({ name, onGo }) {
  return (
    <Modal>
      <div className="grid place-items-center text-center">
        <div className="relative grid h-20 w-20 place-items-center">
          <motion.span
            className="absolute inset-0 rounded-full bg-blue-500/30"
            animate={{ scale: [0.7, 1.6], opacity: [0.55, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
          {CONFETTI.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-1.5 rounded-sm"
              style={{ background: p.c }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.r }}
              transition={{ duration: 1.1, ease: [0.1, 0.7, 0.3, 1] }}
            />
          ))}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="relative grid h-16 w-16 place-items-center rounded-full bg-blue-600"
          >
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
              />
            </svg>
          </motion.span>
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900">অভিনন্দন{name ? `, ${name}` : ""}!</h3>
        <p className="mt-1 text-sm text-slate-600">তোমার একাউন্ট তৈরি হয়ে গেছে। এখন ড্যাশবোর্ডে নিয়ে যাচ্ছি।</p>
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full origin-left rounded-full bg-blue-600"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 3.2, ease: "linear" }}
          />
        </div>
        <button type="button" onClick={onGo} className={`${primaryBtn} mt-4 w-full`}>
          এখনই শুরু করো
        </button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Main form                                                           */
/* ------------------------------------------------------------------ */

export default function RegisterForm() {
  const location = useLocation();
  const dispatch = useDispatch();
  const from = getPostAuthRedirect(location.state, "/dashboard");
  const prefill = location.state?.prefill; // { email } | { phone } from login / forgot-password

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [checkingField, setCheckingField] = useState(null);
  const accountCheckTimer = useRef(null);
  const accountCheckSeq = useRef(0);
  const [existing, setExisting] = useState(null); // "email" | "phone" | null
  const [success, setSuccess] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const finished = useRef(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    setError,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: prefill?.email ?? "",
      phone: prefill?.phone ?? "",
      section: "",
      group: "",
      level: "",
      target: "",
      hsc_batch: "",
      password: "",
      password_confirmation: "",
    },
  });
  const v = watch();

  /* ---- data (all three load in parallel on mount, filtered locally) ---- */
  const { data: sections, isLoading: sectionsLoading } = useGetCategoryQuery("sections");
  const { categories: groups, isLoading: groupsLoading } = useCategoryData("groups");
  const { categories: levels, isLoading: levelsLoading } = useCategoryData("levels");

  const [registration, { isLoading: submitting }] = useRegistrationMutation();
  const [checkAccount] = useCheckAccountMutation();

  /* ---- live duplicate-account check (debounced) ---- */
  useEffect(() => {
    const email = v.email?.trim().toLowerCase() || "";
    const phone = normalizePhone(v.phone || "");
    const validEmail = EMAIL_RE.test(email);
    const validPhone = PHONE_RE.test(phone);

    clearTimeout(accountCheckTimer.current);

    if (!validEmail && !validPhone) {
      setCheckingField(null);
      return;
    }

    const field = validEmail && validPhone ? "both" : validEmail ? "email" : "phone";
    const seq = ++accountCheckSeq.current;

    // As soon as the value becomes valid, lock navigation while checking.
    setCheckingField(field);

    accountCheckTimer.current = setTimeout(async () => {
      try {
        const res = await checkAccount({
          email: validEmail ? email : "",
          phone: validPhone ? phone : "",
        }).unwrap();

        if (seq !== accountCheckSeq.current) return;

        const d = res?.data ?? {};
        if (d.email_exists) return setExisting("email");
        if (d.phone_exists) return setExisting("phone");
      } catch {
        // Registration API will still validate email/phone on submit.
      } finally {
        if (seq === accountCheckSeq.current) setCheckingField(null);
      }
    }, 500);

    return () => clearTimeout(accountCheckTimer.current);
  }, [v.email, v.phone, checkAccount]);

  /* ---- category cascade: section → group → level, group → target ---- */
  const sectionList = useMemo(() => (sections?.data?.data ?? []).filter(isActive), [sections]);
  const selectedSection = sectionList.find((s) => String(s.id) === String(v.section));
  const kind = selectedSection ? sectionKind(selectedSection) : "other";

  const groupOptions = useMemo(
    () => (groups ?? []).filter(isActive).filter((g) => toIds(g.section_id).includes(String(v.section))),
    [groups, v.section]
  );
  const selectedGroup = groupOptions.find((g) => String(g.id) === String(v.group));
  const levelOptions = useMemo(
    () => (levels ?? []).filter(isActive).filter((l) => toIds(l.group_id).includes(String(v.group))),
    [levels, v.group]
  );

  // Arts / Commerce এ মেডিকেল-ইঞ্জিনিয়ারিং আসবে না
  const targetOptions = useMemo(
    () => getTargetOptions(kind, selectedGroup ? groupKind(selectedGroup) : "other"),
    [kind, selectedGroup]
  );

  const batches = useMemo(() => makeBatches(kind), [kind]);

  /* ---- custom (non-input) fields ---- */
  useEffect(() => {
    register("section", { required: "সেকশন বেছে নাও" });
    register("group", {
      validate: (val) => groupOptions.length === 0 || !!val || "গ্রুপ বেছে নাও",
    });
    register("level", {
      validate: (val) => levelOptions.length === 0 || !!val || "মাধ্যম বেছে নাও",
    });
    register("target", { required: "তোমার লক্ষ্য বেছে নাও" });
    register("hsc_batch");
  }, [register, groupOptions.length, levelOptions.length]);

  const setField = (name, val) => setValue(name, val, { shouldValidate: true, shouldDirty: true });

  const pickSection = (id) => {
    if (String(id) === String(v.section)) return;
    setField("section", String(id));
    ["group", "level", "target", "hsc_batch"].forEach((f) => setValue(f, ""));
  };
  const pickGroup = (id) => {
    if (String(id) === String(v.group)) return;
    setField("group", String(id));
    setValue("level", "");
    setValue("target", ""); // group bodlale target abar bechhe nite hobe
  };

  // Auto-pick when there's only one possible answer — one tap less for the student.
  useEffect(() => {
    if (v.section && !v.group && groupOptions.length === 1) setField("group", String(groupOptions[0].id));
  }, [v.section, v.group, groupOptions]); // eslint-disable-line
  useEffect(() => {
    if (v.group && !v.level && levelOptions.length === 1) setField("level", String(levelOptions[0].id));
  }, [v.group, v.level, levelOptions]); // eslint-disable-line
  useEffect(() => {
    if (v.section && !v.target && targetOptions.length === 1) setField("target", targetOptions[0].v);
  }, [v.section, v.target, targetOptions]); // eslint-disable-line

  /* ---- navigation ---- */
  const next = async () => {
    const ok = await trigger(STEPS[step].fields);
    if (!ok) return;
    setDir(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  /* ---- submit ---- */
  const handleServerError = (e) => {
    const errs = e?.data?.errors || {};
    const keys = Object.keys(errs);
    if (keys.includes("email")) return setExisting("email");
    if (keys.includes("phone")) return setExisting("phone");

    let firstStep = null;
    keys.forEach((key) => {
      const field = FIELD_MAP[key] || key;
      const msg = Array.isArray(errs[key]) ? errs[key][0] : errs[key];
      setError(field, { type: "server", message: msg });
      const st = stepOfField(field);
      if (st >= 0 && (firstStep === null || st < firstStep)) firstStep = st;
    });
    if (firstStep !== null) {
      setDir(-1);
      setStep(firstStep);
    }
    toast.error(e?.data?.message || "রেজিস্ট্রেশন করা যায়নি, আবার চেষ্টা করো");
  };

  const onSubmit = async (f) => {
    const payload = new FormData();
    payload.append("name", f.name.trim());
    payload.append("email", f.email.trim().toLowerCase());
    payload.append("phone", normalizePhone(f.phone));
    payload.append("password", f.password);
    payload.append("password_confirmation", f.password_confirmation);
    payload.append("section_id", f.section);
    if (f.group) payload.append("group_id", f.group);
    if (f.level) payload.append("level_id", f.level);
    if (selectedGroup) payload.append("group_name", label(selectedGroup));
    if (f.hsc_batch) payload.append("hsc_batch", f.hsc_batch);
    payload.append("target", f.target);
    payload.append("active_status", "1");

    try {
      const res = await registration(payload).unwrap();
      setSuccess(res); // { status, message, data: { token, student } }
    } catch (e) {
      handleServerError(e);
    }
  };

  /* ---- auto-login: the register response already carries the token ---- */
  const finish = useCallback(() => {
    if (finished.current || !success) return;
    finished.current = true;
    setPostAuthRedirect(from);
    dispatch(
      loggedIn({
        status: success.status,
        message: success.message,
        token: success.data?.token,
        student: success.data?.student,
      })
    );
  }, [success, from, dispatch]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(finish, 3200);
    return () => clearTimeout(t);
  }, [success, finish]);

  const isLast = step === STEPS.length - 1;
  const busy = !!checkingField || submitting || !!success;
  const firstName = (v.name || "").trim().split(" ")[0];
  const strength = strengthOf(v.password);

  const cheers = [
    "মাত্র ৪টি ধাপ, ১ মিনিটেই শেষ।",
    `ভালো হয়েছে${firstName ? `, ${firstName}` : ""}! আর ৩টি ধাপ বাকি।`,
    "অর্ধেক হয়ে গেছে, আর ২টি ধাপ।",
    "শেষ ধাপ! এরপর সোজা ড্যাশবোর্ডে।",
  ];

  const stepState = (i) => (i < step ? "done" : i === step ? "current" : "todo");

  /* ---------------------------------------------------------------- */
  /* Step bodies                                                      */
  /* ---------------------------------------------------------------- */

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="grid gap-3">
          <Field icon={User} label="তোমার নাম" error={errors.name?.message} valid={touchedFields.name && v.name.trim().length >= 2}>
            <Input
              {...register("name", {
                required: "নাম লিখো",
                minLength: { value: 2, message: "নাম আরেকটু বড় লিখো" },
              })}
              autoComplete="name"
              placeholder="পুরো নাম"
              className={inputCls(errors.name)}
            />
          </Field>

          <Field icon={Mail} label="ইমেইল" error={errors.email?.message} valid={touchedFields.email && EMAIL_RE.test(v.email) && checkingField !== "email" && checkingField !== "both"}>
            <Input
              {...register("email", {
                required: "ইমেইল লিখো",
                validate: (val) => EMAIL_RE.test(val.trim()) || "সঠিক ইমেইল দাও (যেমন name@gmail.com)",
              })}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              placeholder="name@gmail.com"
              className={inputCls(errors.email)}
            />
          </Field>

          <Field icon={Phone} label="ফোন নাম্বার" error={errors.phone?.message} valid={touchedFields.phone && PHONE_RE.test(normalizePhone(v.phone)) && checkingField !== "phone" && checkingField !== "both"}>
            <span className="pointer-events-none absolute left-9 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-500">+88</span>
            <Input
              {...register("phone", {
                required: "ফোন নাম্বার লিখো",
                validate: (val) => PHONE_RE.test(normalizePhone(val)) || "১১ ডিজিটের সঠিক নাম্বার দাও (01XXXXXXXXX)",
              })}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className={inputCls(errors.phone, "pl-[4.25rem]")}
            />
          </Field>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="grid gap-4">
          <section className="grid gap-2">
            <SectionTitle>সেকশন</SectionTitle>
            {sectionsLoading ? (
              <Skeletons n={2} />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {sectionList.map((s) => (
                  <Choice
                    key={s.id}
                    icon={School}
                    title={label(s)}
                    selected={String(v.section) === String(s.id)}
                    onClick={() => pickSection(s.id)}
                  />
                ))}
              </div>
            )}
            {errors.section && <p className="text-xs text-red-600">{errors.section.message}</p>}
          </section>

          {v.section && (
            <motion.section key={`g-${v.section}`} {...riseIn} className="grid gap-2">
              <SectionTitle>গ্রুপ</SectionTitle>
              {groupsLoading ? (
                <Skeletons n={2} />
              ) : groupOptions.length === 0 ? (
                <p className="rounded-lg bg-slate-50 p-2.5 text-sm text-slate-500">এই সেকশনে এখনো কোনো গ্রুপ যোগ করা হয়নি।</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {groupOptions.map((g) => (
                    <Choice
                      key={g.id}
                      icon={GraduationCap}
                      title={label(g)}
                      selected={String(v.group) === String(g.id)}
                      onClick={() => pickGroup(g.id)}
                    />
                  ))}
                </div>
              )}
              {errors.group && <p className="text-xs text-red-600">{errors.group.message}</p>}
            </motion.section>
          )}

          {v.group && (levelsLoading || levelOptions.length > 0) && (
            <motion.section key={`l-${v.group}`} {...riseIn} className="grid gap-2">
              <SectionTitle>মাধ্যম</SectionTitle>
              {levelsLoading ? (
                <Skeletons n={2} />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {levelOptions.map((l) => (
                    <Choice
                      key={l.id}
                      title={label(l)}
                      selected={String(v.level) === String(l.id)}
                      onClick={() => setField("level", String(l.id))}
                    />
                  ))}
                </div>
              )}
              {errors.level && <p className="text-xs text-red-600">{errors.level.message}</p>}
            </motion.section>
          )}
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="grid gap-4">
          <section className="grid gap-2">
            <div className="grid gap-2 sm:grid-cols-2">
              {targetOptions.map((t) => (
                <Choice
                  key={t.v}
                  icon={t.icon}
                  title={t.l}
                  desc={t.d}
                  selected={v.target === t.v}
                  onClick={() => setField("target", t.v)}
                />
              ))}
            </div>
            {errors.target && <p className="text-xs text-red-600">{errors.target.message}</p>}
          </section>

          {(kind === "hsc" || kind === "ssc") && (
            <motion.section {...riseIn} className="grid gap-2">
              <SectionTitle hint="(ঐচ্ছিক)">তোমার ব্যাচ</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {batches.map((b) => (
                  <motion.button
                    key={b}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setValue("hsc_batch", v.hsc_batch === b ? "" : b, { shouldDirty: true })}
                    aria-pressed={v.hsc_batch === b}
                    className={cn(
                      "h-8 rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
                      v.hsc_batch === b
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
                    )}
                  >
                    {b}
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-3">
        <div className="grid gap-1.5">
          <Field icon={Lock} label="পাসওয়ার্ড" error={errors.password?.message}>
            <Input
              {...register("password", {
                required: "পাসওয়ার্ড দাও",
                minLength: { value: 8, message: "কমপক্ষে ৮ অক্ষর লাগবে" },
              })}
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              placeholder="নতুন পাসওয়ার্ড"
              className={inputCls(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? "পাসওয়ার্ড লুকাও" : "পাসওয়ার্ড দেখাও"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>
          <AnimatePresence>
            {v.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2.5"
              >
                <div className="grid flex-1 grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={cn("h-1 rounded-full transition-colors duration-300", i <= strength ? STRENGTH[strength].c : "bg-slate-200")}
                    />
                  ))}
                </div>
                <span className="w-16 text-right text-[11px] font-medium text-slate-500">{STRENGTH[strength].t}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Field
          icon={ShieldCheck}
          label="পাসওয়ার্ড আবার দাও"
          error={errors.password_confirmation?.message}
          valid={!!v.password_confirmation && v.password_confirmation === v.password}
        >
          <Input
            {...register("password_confirmation", {
              required: "পাসওয়ার্ড আবার লিখো",
              validate: (val) => val === watch("password") || "পাসওয়ার্ড দুটো মেলেনি",
            })}
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            placeholder="একই পাসওয়ার্ড আবার"
            className={inputCls(errors.password_confirmation)}
          />
        </Field>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /* Layout                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto w-full max-w-3xl px-4 lg:px-0">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-900/5 ring-1 ring-slate-200/70 lg:grid lg:grid-cols-[220px_1fr]">
          {/* Side panel (desktop): an answer sheet that fills in as you go */}
          <aside className="hidden flex-col bg-blue-700 p-6 text-white lg:flex">
            <h2 className="text-lg font-bold leading-snug">প্রস্তুতির যাত্রা শুরু করো</h2>
            <p className="mt-1.5 text-xs text-blue-100/80">৪টি ঘর ভরাট করলেই তোমার একাউন্ট তৈরি।</p>
            <ol className="mt-8 grid">
              {STEPS.map((s, i) => (
                <li key={s.key} className="relative flex gap-3 pb-6 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span className="absolute left-[11px] top-7 h-[calc(100%-1.5rem)] w-0.5 overflow-hidden rounded bg-white/15">
                      <motion.span
                        className="block w-full bg-white"
                        initial={false}
                        animate={{ height: i < step ? "100%" : "0%" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </span>
                  )}
                  <StepBubble state={stepState(i)} onDark />
                  <div className={cn("transition-opacity", i > step && "opacity-55")}>
                    <p className="text-sm font-semibold leading-6">{s.short}</p>
                    <p className="text-[11px] leading-snug text-blue-100/75">{s.sub}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>

          <div className="px-5 py-5 lg:px-8 lg:py-7">
            {/* Progress (mobile) */}
            <div className="mb-4 lg:hidden">
              <div className="flex gap-1.5">
                {STEPS.map((s, i) => (
                  <span key={s.key} className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <motion.span
                      className="block h-full rounded-full bg-blue-600"
                      initial={false}
                      animate={{ width: i <= step ? "100%" : "0%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </span>
                ))}
              </div>
            </div>

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (busy) return;
                if (isLast) handleSubmit(onSubmit)(e);
                else next();
              }}
              className="flex flex-col lg:min-h-[400px]"
            >
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="px-0.5 pb-1"
                  >
                    <p className="mb-8 mt-4 text-center text-xs font-medium text-blue-600">{cheers[step]}</p>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">{STEPS[step].title}</h1>
                    <p className="mb-4 mt-0.5 text-[13px] text-slate-500">{STEPS[step].sub}</p>
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-5 flex gap-2">
                <AnimatePresence initial={false}>
                  {step > 0 && (
                    <motion.button
                      key="back"
                      type="button"
                      onClick={back}
                      disabled={busy}
                      aria-label="আগের ধাপ"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 40 }}
                      exit={{ opacity: 0, width: 0 }}
                      whileTap={{ scale: 0.94 }}
                      className="grid h-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
                    >
                      <ArrowLeft size={18} />
                    </motion.button>
                  )}
                </AnimatePresence>
                <motion.button
                  type="submit"
                  disabled={busy}
                  whileTap={{ scale: 0.98 }}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-colors hover:bg-blue-700 disabled:opacity-70"
                >
                  {submitting || checkingField ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : isLast ? (
                    "একাউন্ট তৈরি করো"
                  ) : (
                    <>
                      পরের ধাপ <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        <AnimatePresence>
          {existing && (
            <ExistingAccountModal
              key="existing"
              kind={existing}
              email={v.email.trim().toLowerCase()}
              from={from}
              onClose={() => setExisting(null)}
            />
          )}
          {success && <SuccessModal key="success" name={firstName} onGo={finish} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}