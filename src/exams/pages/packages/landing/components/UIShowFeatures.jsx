import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { AppMockup } from "./AppMockup";

const featuresData = [
  {
    id: "feature-1",
    badge: "ফিচার ০১",
    title: "সৃজনশীল বা বহুনির্বাচনি—পরীক্ষা দাও পরীক্ষালয়ে",
    subtitle: "SMART EXAM EXPERIENCE",
    description:
      "MCQ ও CQ—দুই ধরনের পরীক্ষার জন্য নির্দিষ্ট টাইমার, বিষয় ও অধ্যায় নির্বাচন এবং বাস্তব পরীক্ষার মতো সুন্দর ও সহজ ইন্টারফেসে পরীক্ষা দেওয়ার সুবিধা।",
    screenType: "home",
  },
  {
    id: "feature-5",
    badge: "ফিচার ০৫",
    title: "সাজানো রুটিনে নিয়মিত মডেল টেস্ট দাও",
    subtitle: "ALL-IN-ONE EXAM BATCH",
    description:
      "গুরুত্বপূর্ণ ও নির্বাচিত প্রশ্ন নিয়ে সাজানো লাইভ এক্সাম ব্যাচে নিয়মিত পরীক্ষা দাও। পাশাপাশি আরও বেশি প্র্যাকটিসের জন্য থাকছে আর্কাইভ এক্সাম ব্যাচ—ভর্তি হলেই পেয়ে যাবে অ্যাক্সেস।",
    screenType: "exam_batch",
  },

  {
    id: "feature-6",
    badge: "ফিচার ০৬",
    title: "MCQ থেকে CQ—সব ধরনের পরীক্ষার প্রস্তুতি",
    subtitle: "MCQ, CQ & WRITTEN EXAM",
    description:
      "MCQ, সৃজনশীল ও লিখিত—প্রতিটি পরীক্ষার জন্য আলাদা প্রস্তুতির সুযোগ। এক প্ল্যাটফর্মেই বিভিন্ন ধরনের পরীক্ষার মাধ্যমে নিজেকে প্রস্তুত করে তোলো।",
    screenType: "mcq_cq_written_exam",
  },

  {
    id: "feature-7",
    badge: "ফিচার ০৭",
    title: "লিখিত খাতা দেখে নাও কোথায় ভুল হচ্ছে",
    subtitle: "EXPERT WRITTEN PAPER CHECKING",
    description:
      "সৃজনশীল ও ভর্তি পরীক্ষার লিখিত খাতা এক্সপার্ট মেন্টরের মাধ্যমে মূল্যায়ন করিয়ে নাও। কোথায় ভুল হয়েছে, কত নম্বর পেয়েছো এবং কীভাবে আরও ভালো করতে পারো—সবকিছুর বিস্তারিত ফিডব্যাক পাবে।",
    screenType: "written_paper_check",
  },

  {
    id: "feature-8",
    badge: "ফিচার ০৮",
    title: "নিজের অবস্থান জানো, অন্যদের সাথে তুলনা করো",
    subtitle: "LEADERBOARD & RANKING",
    description:
      "প্রতিটি পরীক্ষার পর সারাদেশের শিক্ষার্থীদের মাঝে নিজের র‍্যাংক দেখো। অন্যদের পারফরম্যান্সের সাথে তুলনা করে বুঝে নাও তোমার প্রস্তুতি ঠিক কোথায় আছে।",
    screenType: "ranking",
  },
];

/**
 * All features, one after another, in normal document flow.
 * No carousel, no autoplay, no clicking — each block simply
 * reveals itself the moment it scrolls into view.
 */

const PEN = "#D6362B"; // the one accent color doing any work here
const INK = "#14161F";
const MUTED = "#6F6A5C";

function FeatureBlock({ feature }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const screenType = `${feature.screenType}_1`;

  const contentStagger = { shown: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
  const contentItem = {
    hidden: { opacity: 0, y: 12 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div ref={ref} className="flex w-full flex-col items-center text-center">
      
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[210px] sm:max-w-[230px] rounded-[23px] overflow-hidden"
      >
        <AppMockup type={screenType} />
      </motion.div>

      <motion.div
        variants={contentStagger}
        initial="hidden"
        animate={inView ? "shown" : "hidden"}
        className="mt-6 flex w-full flex-col items-center"
      >
        <motion.h3 variants={contentItem} className="text-xl font-black leading-snug sm:text-2xl tracking-tight" style={{ color: INK }}>
          {feature.title}
        </motion.h3>

        {feature.description && (
          <motion.p variants={contentItem} className="mx-auto mt-3 max-w-xs text-xs leading-relaxed sm:text-sm" style={{ color: MUTED }}>
            {feature.description}
          </motion.p>
        )}

        {feature.highlights?.length > 0 && (
          <motion.div variants={contentItem} className="flex flex-col gap-2 mt-5 w-full max-w-xs text-left">
            {feature.highlights.slice(0, 4).map((hl, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: PEN }} />
                <span className="text-[11px] font-medium leading-tight" style={{ color: INK }}>
                  {hl}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function UIShowFeatures() {
  return (
    <section id="feature-showcase" className="w-full font-siliguri py-14 sm:py-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-16 sm:gap-24">
        {featuresData.map((feature, idx) => (
          <FeatureBlock key={feature.id || idx} feature={feature} />
        ))}
      </div>
    </section>
  );
}

export default UIShowFeatures;