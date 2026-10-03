import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Languages,
  Library,
  TableOfContents,
} from "lucide-react";

const pdfMaterials = [
  {
    label: "দাগানো বই",
    icon: BookOpen,
    from: "#FDE9E1",
    to: "#F97316",
  },
  {
    label: "Question Bank",
    icon: Library,
    from: "#E3EEFF",
    to: "#3B82F6",
  },
  {
    label: "GK & English",
    icon: Languages,
    from: "#EDE6FF",
    to: "#8B5CF6",
  },
  {
    label: "Main Book MCQ",
    icon: TableOfContents,
    from: "#E1F7EE",
    to: "#0B6E4F",
  },
  {
    label: "BCS & Varsity Question",
    icon: GraduationCap,
    from: "#FFF0DA",
    to: "#D97706",
  },
  {
    label: "অন্যান্য তথ্য",
    icon: FileText,
    from: "#FCE4F1",
    to: "#DB2777",
  },
];

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  },
};

const LandingFeaturesSection = () => {
  return (
    <section className="relative mt-6 overflow-hidden font-['Hind_Siliguri']">
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-[0_8px_30px_rgba(11,110,79,0.08)] backdrop-blur-md">
        {/* Header */}
        <div className="flex items-start gap-3 p-4 pb-0 sm:p-5 sm:pb-0">
          <motion.div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B6E4F] to-[#0E8F65] shadow-lg shadow-[#0B6E4F]/25"
            whileHover={{
              rotate: -10,
              scale: 1.08,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
          >
            <FileText className="h-4 w-4 text-white" />
          </motion.div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#12241D]">
              PDF ও স্টাডি ম্যাটেরিয়াল
            </h3>

            <p className="mt-1 text-[12.5px] leading-relaxed text-[#5B6E64]">
              তোমার প্রস্তুতিকে আরও সহজ ও গোছানো করার জন্য বিভিন্ন
              ক্যাটাগরির স্টাডি ম্যাটেরিয়াল দেওয়া হয়েছে।
            </p>
          </div>
        </div>

        {/* Materials */}
        <motion.div
          className="grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-2 sm:p-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridVariants}
        >
          {pdfMaterials.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                variants={cardVariants}
                whileHover={{
                  y: -3,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/70 bg-white/80 px-3 py-2.5 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <motion.span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: item.from,
                  }}
                  whileHover={{
                    rotate: 8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{
                      color: item.to,
                    }}
                  />
                </motion.span>

                <span className="min-w-0 truncate text-[12.5px] font-medium text-[#33443B]">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Note */}
        <div className="mx-4 mb-4 flex items-start gap-2.5 rounded-xl border border-[#F3E1B8] bg-[#FFF8EC]/90 px-3.5 py-3 sm:mx-5 sm:mb-5">
          <motion.span
            className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#D97706]"
            animate={{
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <p className="text-[11.5px] leading-relaxed text-[#8A5709]">
            <span className="font-semibold">বিশেষ দ্রষ্টব্য:</span>{" "}
            আমরা সাধারণত PDF প্রদান করি না। তবে তোমাদের পড়াশোনায়
            আরও বেশি সহায়তা করার উদ্দেশ্যে এই স্টাডি ম্যাটেরিয়ালগুলো
            শেয়ার করার চেষ্টা করা হয়। তাই শুধু PDF এর জন্য এনরোল না হওয়াই ভালো। 
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingFeaturesSection;