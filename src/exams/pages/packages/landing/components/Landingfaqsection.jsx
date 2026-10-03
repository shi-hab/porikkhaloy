import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CircleHelp } from "lucide-react";

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

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const answerVariants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
      opacity: {
        duration: 0.2,
        delay: 0.05,
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      },
      opacity: {
        duration: 0.15,
      },
    },
  },
};

const LandingFaqSection = ({ faqs = DEFAULT_FAQS }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs?.length) return null;

  return (
    <section className="relative mt-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="mb-3.5 flex items-center gap-3"
      >
        <motion.div
          whileHover={{
            scale: 1.06,
            rotate: -4,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 18,
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B6E4F] to-[#0E8F65] shadow-[0_6px_18px_rgba(11,110,79,0.18)]"
        >
          <CircleHelp className="h-[17px] w-[17px] text-white" />
        </motion.div>

        <div className="min-w-0">
          <h2 className="font-siliguri text-[16px] font-semibold leading-tight text-[#12241D] sm:text-[17px]">
            সাধারণ জিজ্ঞাসা
          </h2>

          <p className="font-siliguri mt-0.5 text-[11px] leading-relaxed text-[#7A8982]">
            ব্যাচ সম্পর্কে সাধারণ কিছু প্রশ্নের উত্তর
          </p>
        </div>
      </motion.div>

      {/* FAQ Card */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="overflow-hidden rounded-2xl border border-[#E1E8E3] bg-white shadow-[0_8px_28px_rgba(18,36,29,0.05)]"
      >
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;

          return (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`relative border-b border-[#EAF0EC] last:border-b-0 transition-colors duration-200 ${
                isOpen ? "bg-[#F8FBF9]" : "bg-white"
              }`}
            >
              {/* Question */}
              <motion.button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                whileTap={{ scale: 0.995 }}
                className="group flex w-full items-center gap-3 px-3.5 py-3.5 text-left outline-none sm:px-4 sm:py-4"
              >
                {/* Number */}
                <motion.span
                  animate={{
                    backgroundColor: isOpen ? "#0B6E4F" : "#F0F5F2",
                    color: isOpen ? "#FFFFFF" : "#5B6E64",
                    scale: isOpen ? 1.05 : 1,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold"
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>

                {/* Question */}
                <span
                  className={`font-siliguri min-w-0 flex-1 text-[13px] font-medium leading-[1.55] transition-colors duration-200 sm:text-[13.5px] ${
                    isOpen
                      ? "text-[#0B6E4F]"
                      : "text-[#24352D] group-hover:text-[#0B6E4F]"
                  }`}
                >
                  {item.q}
                </span>

                {/* Chevron */}
                <motion.span
                  animate={{
                    rotate: isOpen ? 180 : 0,
                    backgroundColor: isOpen ? "#E1F0EA" : "#F4F7F5",
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-colors duration-200 ${
                      isOpen ? "text-[#0B6E4F]" : "text-[#718078]"
                    }`}
                  />
                </motion.span>
              </motion.button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    variants={answerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden"
                  >
                    <div className="flex gap-3 pb-4 pl-[52px] pr-4 sm:pl-[59px]">
                      {/* Accent */}
                      <motion.div
                        initial={{
                          scaleY: 0,
                          opacity: 0,
                        }}
                        animate={{
                          scaleY: 1,
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: 0.04,
                        }}
                        className="w-[2px] shrink-0 origin-top rounded-full bg-[#B9DCCE]"
                      />

                      {/* Answer Text */}
                      <p className="font-siliguri text-[12.5px] leading-[1.8] text-[#687870] sm:text-[13px]">
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default LandingFaqSection;