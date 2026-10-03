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
import { useState } from "react";
import { MessageCircle, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import Logo from "../components/atoms/Logo";

const WHATSAPP_NUMBER = "8801706429945";

const ForgetPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // step: "choose" | "new" | "old" | null (modal closed)
  const [step, setStep] = useState(null);
  const [email, setEmail] = useState("");

  const onSubmit = (formData) => {
    setEmail(formData.email);
    setStep("choose");
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `আমার পাসওয়ার্ড চেঞ্জ করতে সাহায্য দরকার।\nআমার ইমেইল: ${email}`
  )}`;

  const closeModal = () => setStep(null);

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-md lg:max-w-xl">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Input
                {...register("email", { required: "Email is required" })}
                id="email"
                name="email"
                type="email"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}

              <Link
                to="/login"
                className="text-sm text-right text-gray-500 hover:underline"
              >
                Remember Password?
              </Link>
            </div>

            <Button className="mt-10">Continue</Button>
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

      {/* ---------------- Modal ---------------- */}
      <Dialog open={!!step} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          {step === "choose" && (
            <>
              <DialogHeader>
                <DialogTitle>তোমার একাউন্ট আছে?</DialogTitle>
                <DialogDescription>
                  তুমি এই অ্যাপে নতুন, নাকি আগে থেকেই অ্যাকাউন্ট আছে — সেটা বেছে নাও
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep("new")}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors p-5 text-center"
                >
                  <UserPlus className="w-7 h-7 text-blue-600" />
                  <span className="font-semibold text-sm">আমি নতুন ইউজার</span>
                  <span className="text-xs text-gray-500">এখনো অ্যাকাউন্ট নেই</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep("old")}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors p-5 text-center"
                >
                  <LogIn className="w-7 h-7 text-green-600" />
                  <span className="font-semibold text-sm">আগে থেকে অ্যাকাউন্ট আছে</span>
                  <span className="text-xs text-gray-500">পাসওয়ার্ড ভুলে গেছি</span>
                </button>
              </div>
            </>
          )}

          {step === "new" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  নতুন অ্যাকাউন্ট প্রয়োজন
                </DialogTitle>
                <DialogDescription>
                  তোমার এই ইমেইলে ({email}) এখনো কোনো অ্যাকাউন্ট খোলা নেই। প্রথমে একটা অ্যাকাউন্ট তৈরি করো।
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 mt-4">
                <Button onClick={() => navigate("/registration")}>
                  Create Account
                </Button>
                <button
                  type="button"
                  onClick={() => setStep("choose")}
                  className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:underline mt-1"
                >
                  <ArrowLeft className="w-4 h-4" /> পিছনে যাও
                </button>
              </div>
            </>
          )}

          {step === "old" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  সাপোর্ট এর সাথে কথা বলো
                </DialogTitle>
                <DialogDescription>
                  তোমার ইমেইল ({email}) সহ একটা মেসেজ WhatsApp এ পাঠানো হবে। আমাদের টিম দ্রুত তোমার পাসওয়ার্ড রিসেট করে দেবে।
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 mt-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeModal}
                >
                  <Button className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp এ মেসেজ করো
                  </Button>
                </a>
                <button
                  type="button"
                  onClick={() => setStep("choose")}
                  className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:underline mt-1"
                >
                  <ArrowLeft className="w-4 h-4" /> পিছনে যাও
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForgetPass;