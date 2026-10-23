import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2, MessageCircle, UserPlus } from "lucide-react";
import Logo from "../components/atoms/Logo";
import { useCheckAccountMutation } from "@/features/auth/authApi";

const WHATSAPP_NUMBER = "8801706429945";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^01[3-9]\d{8}$/;
const normalizePhone = (p = "") => p.replace(/[\s-]/g, "").replace(/^(\+?88)/, "");

// "abc@gmail.com" ba "01XXXXXXXXX" -> { kind, value } | null
const parseIdentifier = (raw = "") => {
  const t = raw.trim();
  if (EMAIL_RE.test(t)) return { kind: "email", value: t.toLowerCase() };
  const p = normalizePhone(t);
  if (PHONE_RE.test(p)) return { kind: "phone", value: p };
  return null;
};

const ForgetPass = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({ defaultValues: { identifier: "" } });

  const [checkAccount] = useCheckAccountMutation();

  const [checking, setChecking] = useState(false);
  const [exists, setExists] = useState(false);
  const [modal, setModal] = useState(null); // "notfound" | "support" | null
  const [target, setTarget] = useState(null); // { kind, value }
  const timer = useRef(null);
  const seq = useRef(0);

  const idv = watch("identifier") || "";
  const parsed = parseIdentifier(idv);
  const kind = parsed?.kind ?? null;
  const value = parsed?.value ?? null;

  const lookup = async (p) => {
    const res = await checkAccount({
      email: p.kind === "email" ? p.value : "",
      phone: p.kind === "phone" ? p.value : "",
    }).unwrap();
    const d = res?.data ?? {};
    return p.kind === "email" ? !!d.email_exists : !!d.phone_exists;
  };

  /* instant check (debounced) */
  useEffect(() => {
    clearTimeout(timer.current);
    setExists(false);

    if (!kind) {
      seq.current++;
      setChecking(false);
      return;
    }

    const mySeq = ++seq.current;
    setChecking(true);

    timer.current = setTimeout(async () => {
      try {
        const found = await lookup({ kind, value });
        if (mySeq !== seq.current) return;

        setTarget({ kind, value });
        if (found) setExists(true);
        else setModal("notfound"); // account nei -> registration modal
      } catch {
        // fail korle submit-e abar check hobe
      } finally {
        if (mySeq === seq.current) setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer.current);
    // eslint-disable-next-line
  }, [kind, value]);

  /* Continue button */
  const onSubmit = async (f) => {
    const p = parseIdentifier(f.identifier);
    if (!p) return;

    try {
      const found = await lookup(p);
      setTarget(p);
      setModal(found ? "support" : "notfound");
    } catch {
      // check korte na parle WhatsApp e pathabo na
      setError("identifier", { message: "এখন চেক করা যাচ্ছে না, একটু পরে আবার চেষ্টা করো" });
    }
  };

  const closeModal = () => {
    setModal(null);
    setTimeout(() => setFocus("identifier"), 50);
  };

  const label = target?.kind === "phone" ? "ফোন নাম্বার" : "ইমেইল";
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `আমার পাসওয়ার্ড চেঞ্জ করতে সাহায্য দরকার।\nআমার ${label}: ${target?.value ?? ""}`
  )}`;

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-md lg:max-w-xl">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <div className="relative">
                <Input
                  {...register("identifier", {
                    required: "ইমেইল বা ফোন নাম্বার লিখো",
                    validate: (val) =>
                      !!parseIdentifier(val) || "সঠিক ইমেইল বা ফোন নাম্বার দাও",
                  })}
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  placeholder="ইমেইল অথবা ফোন নাম্বার"
                  className="pr-10"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  {checking ? (
                    <Loader2 size={16} className="animate-spin text-slate-400" />
                  ) : exists ? (
                    <Check size={16} strokeWidth={2.5} className="text-blue-600" />
                  ) : null}
                </span>
              </div>
              {errors.identifier && (
                <p className="text-red-600 text-sm">{errors.identifier.message}</p>
              )}

              <Link to="/login" className="text-sm text-right text-gray-500 hover:underline">
                Remember Password?
              </Link>
            </div>

            <Button className="mt-10" disabled={checking}>
              {checking ? <Loader2 className="animate-spin" size={18} /> : "Continue"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center border-t pt-5">
          <span className="text-sm text-gray-600">
            তুমি কি অ্যাপে নতুন?{" "}
            <Link
              to="/registration"
              className="font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2 transition"
            >
              নতুন একাউন্ট খুলো
            </Link>
          </span>
        </div>
      </div>

      {/* ---------- Modal: account nei -> registration ---------- */}
      <Dialog open={modal === "notfound"} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              কোনো একাউন্ট পাওয়া যায়নি
            </DialogTitle>
            <DialogDescription className="break-all">
              {target?.value} দিয়ে কোনো একাউন্ট খোলা নেই।
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 rounded-xl bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">নতুন হলে:</span> এখনই একাউন্ট খুলে নাও, ১ মিনিটেই হয়ে যাবে।
            </p>
            <p>
              <span className="font-semibold text-slate-800">আগে থেকে একাউন্ট থাকলে:</span> সঠিক ইমেইল বা ফোন নাম্বার দিয়ে আবার চেষ্টা করো।
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <Button
              onClick={() =>
                navigate("/registration", {
                  state: {
                    prefill:
                      target?.kind === "phone"
                        ? { phone: target.value }
                        : { email: target?.value },
                  },
                })
              }
            >
              নতুন একাউন্ট খোলো
            </Button>
            <button
              type="button"
              onClick={closeModal}
              className="text-sm font-semibold text-blue-600 hover:underline mt-1"
            >
              সঠিক ইমেইল / নাম্বার দিই
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------- Modal: account ache -> WhatsApp support ---------- */}
      <Dialog open={modal === "support"} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              সাপোর্ট এর সাথে কথা বলো
            </DialogTitle>
            <DialogDescription className="break-all">
              তোমার {label} ({target?.value}) সহ একটা মেসেজ WhatsApp এ পাঠানো হবে। আমাদের টিম দ্রুত তোমার পাসওয়ার্ড রিসেট করে দেবে।
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 mt-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={closeModal}>
              <Button className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-4 h-4" />
                WhatsApp এ মেসেজ করো
              </Button>
            </a>
            <button
              type="button"
              onClick={closeModal}
              className="text-sm text-gray-500 hover:underline mt-1"
            >
              বন্ধ করো
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForgetPass;