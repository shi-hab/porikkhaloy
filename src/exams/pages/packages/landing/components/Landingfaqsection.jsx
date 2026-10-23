import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import LandingSectionHeading from "./LandingSectionHeading";

const DEFAULT_FAQS = [
  {
    q: "এই ব্যাচে কীভাবে অংশ নেব?",
    a: "সাবস্ক্রাইব করার সাথে সাথেই পরীক্ষালয় অ্যাপে ব্যাচটি চালু হয়ে যাবে এবং সব পরীক্ষা রুটিন অনুযায়ী সেখান থেকেই দেওয়া যাবে।",
  },
  {
    q: "পরীক্ষা মিস করলে কী হবে?",
    a: "প্রতিটি পরীক্ষার একটি নির্দিষ্ট সময়সীমা থাকে, তবে মিস হয়ে গেলেও পরে প্র্যাকটিস হিসেবে সমাধান করা যাবে — শুধু লাইভ মেরিট লিস্টে যুক্ত হবে না।",
  },
  {
    q: "ফলাফল ও সমাধান কবে পাওয়া যাবে?",
    a: "পরীক্ষা শেষ হওয়ার সাথে সাথেই মেরিট লিস্ট, বিস্তারিত সলভ শীট এবং ব্যাখ্যা অ্যাপে দেখা যাবে।",
  },
  {
    q: "মেয়াদ শেষ হওয়ার পর অ্যাক্সেস থাকবে কি?",
    a: "না, প্যাকেজের মেয়াদ শেষ হয়ে গেলে ব্যাচের পরীক্ষা ও রিসোর্সে অ্যাক্সেস আর থাকবে না।",
  },
];

const LandingFaqSection = ({ faqs = DEFAULT_FAQS }) => {
  const [openIndex, setOpenIndex] = useState(null);
  if (!faqs?.length) return null;

  return (
    <section className="font-siliguri">
      <LandingSectionHeading title="সাধারণ জিজ্ঞাসা" subtitle="ব্যাচ সম্পর্কে সাধারণ কিছু প্রশ্নের উত্তর" />

      <div className="mt-5 divide-y divide-[#E3EBE6] overflow-hidden rounded-2xl border border-[#DCE6E0] bg-white">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className={isOpen ? "bg-[#F4F9F6]" : "bg-white"}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0B6E4F] sm:px-5"
              >
                <span
                  className={`text-[14px] font-semibold leading-snug transition-colors ${
                    isOpen ? "text-[#0B6E4F]" : "text-[#0C1B15]"
                  }`}
                >
                  {item.q}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen ? "bg-[#0B6E4F] text-white" : "bg-[#EEF3F0] text-[#4F625A]"
                  }`}
                >
                  <Plus className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 pr-14 text-[13.5px] leading-[1.8] text-[#4F625A] sm:px-5 sm:pr-16">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingFaqSection;