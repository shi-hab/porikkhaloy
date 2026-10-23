import { AppMockup } from "./AppMockup";
import LandingSectionHeading from "./LandingSectionHeading";

const featuresData = [
  {
    id: "feature-1",
    title: "সৃজনশীল বা বহুনির্বাচনি—পরীক্ষা দাও পরীক্ষালয়ে",
    description:
      "MCQ ও CQ—দুই ধরনের পরীক্ষার জন্য নির্দিষ্ট টাইমার, বিষয় ও অধ্যায় নির্বাচন এবং বাস্তব পরীক্ষার মতো সুন্দর ও সহজ ইন্টারফেসে পরীক্ষা দেওয়ার সুবিধা।",
    screenType: "home",
  },
  {
    id: "feature-5",
    title: "সাজানো রুটিনে নিয়মিত মডেল টেস্ট দাও",
    description:
      "গুরুত্বপূর্ণ ও নির্বাচিত প্রশ্ন নিয়ে সাজানো লাইভ এক্সাম ব্যাচে নিয়মিত পরীক্ষা দাও। পাশাপাশি আরও বেশি প্র্যাকটিসের জন্য থাকছে আর্কাইভ এক্সাম ব্যাচ—ভর্তি হলেই পেয়ে যাবে অ্যাক্সেস।",
    screenType: "exam_batch",
  },
  {
    id: "feature-6",
    title: "MCQ থেকে CQ—সব ধরনের পরীক্ষার প্রস্তুতি",
    description:
      "MCQ, সৃজনশীল ও লিখিত—প্রতিটি পরীক্ষার জন্য আলাদা প্রস্তুতির সুযোগ। এক প্ল্যাটফর্মেই বিভিন্ন ধরনের পরীক্ষার মাধ্যমে নিজেকে প্রস্তুত করে তোলো।",
    screenType: "mcq_cq_written_exam",
  },
  {
    id: "feature-7",
    title: "লিখিত খাতা দেখে নাও কোথায় ভুল হচ্ছে",
    description:
      "সৃজনশীল ও ভর্তি পরীক্ষার লিখিত খাতা এক্সপার্ট মেন্টরের মাধ্যমে মূল্যায়ন করিয়ে নাও। কোথায় ভুল হয়েছে, কত নম্বর পেয়েছো এবং কীভাবে আরও ভালো করতে পারো—সবকিছুর বিস্তারিত ফিডব্যাক পাবে।",
    screenType: "written_paper_check",
  },
  {
    id: "feature-8",
    title: "নিজের অবস্থান জানো, অন্যদের সাথে তুলনা করো",
    description:
      "প্রতিটি পরীক্ষার পর সারাদেশের শিক্ষার্থীদের মাঝে নিজের র‍্যাংক দেখো। অন্যদের পারফরম্যান্সের সাথে তুলনা করে বুঝে নাও তোমার প্রস্তুতি ঠিক কোথায় আছে।",
    screenType: "ranking",
  },
];

const UIShowFeatures = () => (
  <section id="feature-showcase" >
    <LandingSectionHeading
    className="font-siliguri"
      title="পরীক্ষাগুলো হবে পরীক্ষালয় এক্সাম অ্যাপে"
      subtitle="অ্যাপে কী কী সুবিধা পাবে, একনজরে দেখে নাও।"
    />

    <div className="mt-6 space-y-4">
      {featuresData.map((f, i) => {
        const tinted = i % 2 === 0;
        return (
          <article
            key={f.id}
            className={`flex flex-col items-center gap-6 rounded-3xl p-6 sm:flex-row sm:gap-10 sm:p-8 ${
              i % 2 ? "sm:flex-row-reverse" : ""
            } ${tinted ? "bg-[#E9F3ED]" : "border border-[#DCE6E0] bg-white"}`}
          >
            <div className="w-[190px] shrink-0 overflow-hidden rounded-[24px] shadow-[0_28px_44px_-20px_rgba(12,27,21,0.55)]">
              <AppMockup type={`${f.screenType}_1`} />
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <h3 className=" text-[19px] font-bold leading-snug tracking-tight text-[#0C1B15] sm:text-[21px]">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-[1.8] text-[#4F625A]">{f.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

export default UIShowFeatures;